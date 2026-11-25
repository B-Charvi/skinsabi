"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { Button, Callout } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { IMPORT_LIMITS, checkProductSheet, decodeCsvBytes, templateCsv, type CheckResult } from "@/lib/product-import";

type Phase = "idle" | "checking" | "importing";
type Done = { count: number; skipped: number; logSaved: boolean };

const SHOW_LIMIT = 50;
const plural = (count: number, one: string, many = `${one}s`) => `${count} ${count === 1 ? one : many}`;
const short = (value: string, max: number) => (value.length > max ? `${value.slice(0, max).trimEnd()}…` : value);

/** Every product already in the catalog, including ones still waiting for review, so duplicates are caught before upload. */
async function loadCatalog(): Promise<{ brand: string; product_name: string }[]> {
  if (!supabase) throw new Error("The database is not connected.");
  const all: { brand: string; product_name: string }[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase.from("products").select("brand,product_name").order("id").range(from, from + 999);
    if (error) throw new Error(error.message);
    all.push(...(data ?? []));
    if (!data || data.length < 1000) break;
  }
  return all;
}

function downloadTemplate() {
  const url = URL.createObjectURL(new Blob([templateCsv()], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "skinsabi-products-template.csv";
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

/** Upload a CSV, see every mistake, then add the good rows. Imported products are saved unverified and stay hidden until verified. */
export function AdminImport({ onImported }: { onImported: () => void }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState<CheckResult | null>(null);
  const [problem, setProblem] = useState("");
  const [done, setDone] = useState<Done | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const busy = phase !== "idle";

  async function choose(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setResult(null); setProblem(""); setDone(null); setFileName(file.name);

    if (/\.(xlsx|xlsm|xls|ods|numbers)$/i.test(file.name)) {
      setProblem("That is a spreadsheet file, not a CSV. In Excel choose File → Save As → CSV UTF-8. In Google Sheets choose File → Download → Comma-separated values (.csv). Then choose the new file.");
      return;
    }
    if (file.size === 0) { setProblem("That file is empty."); return; }
    if (file.size > IMPORT_LIMITS.maxBytes) { setProblem(`That file is larger than ${IMPORT_LIMITS.maxBytes / 1_000_000} MB. Split it into smaller files.`); return; }

    setPhase("checking");
    try {
      const [text, catalog] = await Promise.all([file.arrayBuffer().then(decodeCsvBytes), loadCatalog()]);
      setResult(checkProductSheet(text, catalog));
    } catch (error) {
      setProblem(error instanceof Error ? error.message : "Something went wrong while checking the file.");
    }
    setPhase("idle");
  }

  function clear() {
    setResult(null); setProblem(""); setFileName("");
    if (input.current) input.current.value = "";
  }

  async function importNow() {
    if (!supabase || !result || result.ready.length === 0) return;
    setPhase("importing"); setProblem("");
    // One request, so either every checked row is saved or none is.
    const { data, error } = await supabase.from("products").insert(result.ready).select("id");
    if (error) {
      setPhase("idle");
      if (error.code === "23505" || error.message.includes("duplicate")) setProblem("One of these products was added while you were checking. Nothing was imported. Choose the file again to re-check it.");
      else if (error.code === "42501" || error.message.includes("row-level security")) setProblem("Not allowed. Log in with the owner Google account.");
      else setProblem(`Nothing was imported. ${error.message}`);
      return;
    }
    const count = data?.length ?? 0;
    if (count === 0) { setPhase("idle"); setProblem("Not allowed. Log in with the owner Google account."); return; }

    const skipped = result.rows.length - result.ready.length;
    const withNotes = result.rows.filter(row => row.product && row.warnings.length > 0).length;
    const { error: logError } = await supabase.from("import_logs").insert({
      source: "Spreadsheet upload",
      finished_at: new Date().toISOString(),
      products_added: count,
      status: "Completed",
      details: { file: fileName.slice(0, 120), rows: result.rows.length, imported: count, skipped, with_notes: withNotes },
    });
    setDone({ count, skipped, logSaved: !logError });
    clear();
    setPhase("idle");
    onImported();
  }

  const problemRows = result?.rows.filter(row => row.errors.length > 0) ?? [];
  const noteRows = result?.rows.filter(row => row.product && row.warnings.length > 0) ?? [];
  const readyCount = result?.ready.length ?? 0;
  const readyRows = result?.rows.filter(row => row.product) ?? [];

  return <section className="card stack" aria-labelledby="admin-import">
    <h2 id="admin-import">Import products from a spreadsheet</h2>
    <p>Add many products at once. Every imported product is saved as <strong>unverified</strong> and stays hidden from the public. It only appears on the Products page after you check it in <em>Products to review</em> and press Save and verify.</p>
    <ol className="admin-import__steps">
      <li>Download the template and fill in one product per row. Copy each ingredient list from the brand&apos;s own page or the packaging.</li>
      <li>Save it as a CSV file. In Excel: File → Save As → CSV UTF-8. In Google Sheets: File → Download → Comma-separated values.</li>
      <li>Choose the file. It is checked first and nothing is added until you press Import.</li>
    </ol>
    <div className="admin-import__bar">
      <Button size="small" variant="secondary" onClick={downloadTemplate}>Download template</Button>
      <label className={`button ui-button ui-button--primary ui-button--small admin-import__file${busy ? " is-disabled" : ""}`}>
        Choose CSV file
        <input ref={input} type="file" accept=".csv,text/csv,text/plain" onChange={choose} disabled={busy}/>
      </label>
    </div>

    {phase === "checking" && <p role="status">Checking {fileName}…</p>}
    {phase === "importing" && <p role="status">Importing…</p>}
    {problem && <Callout tone="danger" title="Could not use that file">{problem}</Callout>}
    {done && <Callout tone="success" title={`Added ${plural(done.count, "product")}`}>
      <p>{done.count === 1 ? "It is" : "They are"} now in Products to review, hidden from the public until you verify {done.count === 1 ? "it" : "them"}.
        {done.skipped > 0 && ` ${plural(done.skipped, "row")} had problems and ${done.skipped === 1 ? "was" : "were"} skipped. Fix ${done.skipped === 1 ? "it" : "them"} in your spreadsheet and upload the file again. Products already added will be reported as duplicates and left alone.`}
        {!done.logSaved && " The import itself worked, but it could not be written to the import log."}</p>
    </Callout>}

    {result && result.fileProblems.length > 0 && <Callout tone="danger" title="This file cannot be imported">
      <ul>{result.fileProblems.map(item => <li key={item}>{item}</li>)}</ul>
    </Callout>}

    {result && result.fileProblems.length === 0 && <div className="stack" aria-live="polite">
      <p><strong>{fileName}</strong>: {plural(result.rows.length, "row")} checked. {readyCount} ready to import{problemRows.length > 0 && `, ${problemRows.length} with problems (these will be skipped)`}.</p>
      {result.ignoredColumns.length > 0 && <p className="small">Columns not used: {result.ignoredColumns.join(", ")}.</p>}

      {problemRows.length > 0 && <div className="admin-import__problems">
        <h3>Rows with problems</h3>
        <ul>
          {problemRows.slice(0, SHOW_LIMIT).map(row => <li key={row.line}>
            <strong>Row {row.line}</strong> · {row.label}
            <ul>{row.errors.map(item => <li key={item}>{item}</li>)}</ul>
          </li>)}
        </ul>
        {problemRows.length > SHOW_LIMIT && <p className="small">…and {problemRows.length - SHOW_LIMIT} more rows with problems.</p>}
      </div>}

      {noteRows.length > 0 && <details className="admin-import__notes">
        <summary>{plural(noteRows.length, "ready row")} with notes worth a look</summary>
        <ul>
          {noteRows.slice(0, SHOW_LIMIT).map(row => <li key={row.line}>
            <strong>Row {row.line}</strong> · {row.label}
            <ul>{row.warnings.map(item => <li key={item}>{item}</li>)}</ul>
          </li>)}
        </ul>
        {noteRows.length > SHOW_LIMIT && <p className="small">…and {noteRows.length - SHOW_LIMIT} more.</p>}
      </details>}

      {readyCount > 0 && <>
        <h3>Ready to import</h3>
        <div className="admin-table" role="region" aria-label="Products ready to import" tabIndex={0}>
          <table>
            <thead><tr><th>Row</th><th>Brand</th><th>Product</th><th>Category</th><th>Level</th><th>Ingredients</th><th>Source link</th></tr></thead>
            <tbody>
              {readyRows.slice(0, SHOW_LIMIT).map(row => <tr key={row.line}>
                <td>{row.line}</td><td>{row.product!.brand}</td><td>{row.product!.product_name}</td><td>{row.product!.category}</td>
                <td>{row.product!.treatment_level}</td><td>{short(row.product!.ingredients_list, 90)}</td><td>{row.product!.ingredient_source_url ? "Yes" : "No"}</td>
              </tr>)}
            </tbody>
          </table>
        </div>
        {readyCount > SHOW_LIMIT && <p className="small">Showing the first {SHOW_LIMIT} of {readyCount}. All {readyCount} will be imported.</p>}
      </>}

      <div className="admin-item__actions">
        <Button onClick={importNow} disabled={busy || readyCount === 0}>{readyCount === 0 ? "Nothing to import" : `Import ${plural(readyCount, "product")}`}</Button>
        <Button variant="secondary" onClick={clear} disabled={busy}>Cancel</Button>
      </div>
      {readyCount > 0 && <p className="small">You can delete any of them in Products to review if you change your mind.</p>}
    </div>}
  </section>;
}
