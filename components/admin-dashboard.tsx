"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { AdminImport } from "@/components/admin-import";
import { Button, Callout, Chip, EmptyState, Input, Select, Textarea } from "@/components/ui";
import { IMPORT_LIMITS, IMPORT_SOURCE, PRODUCT_CATEGORIES, TREATMENT_LEVELS, checkUrl } from "@/lib/product-import";
import { supabase } from "@/lib/supabase";
import { useIsAdmin } from "@/lib/use-is-admin";

const dayFormat = (iso: string) => new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });

/** The whole admin area. Everything on it is guarded twice: here, and by Row Level Security in the database. */
export function AdminDashboard() {
  const access = useIsAdmin();
  const { status } = useAuth();
  // Bumped after an import so the counts, the review list and the log reload.
  const [refresh, setRefresh] = useState(0);

  if (access === "checking") return <div className="gate gate--loading" role="status"><p>Checking access…</p></div>;

  if (status === "signedOut") {
    return <section className="gate card" aria-labelledby="admin-login">
      <h1 id="admin-login">Log in to open the admin page</h1>
      <p>Use the Google account that owns SkinSabi.</p>
      <div className="gate__actions"><Link className="button button--cta" href="/login?next=%2Fadmin">Log in</Link></div>
    </section>;
  }

  if (access === "no") {
    return <section className="gate card" aria-labelledby="admin-denied">
      <h1 id="admin-denied">This page is for the SkinSabi owner</h1>
      <p>If that is you, log in with Google using the owner account. Admin access does not work with an email and password.</p>
      <div className="gate__actions"><Link className="button button--secondary" href="/">Go home</Link></div>
    </section>;
  }

  return <div className="admin stack">
    <header className="admin__head">
      <h1>Admin</h1>
      <p>Only you can see this page. Changes here are saved straight away.</p>
    </header>
    <Overview key={`overview-${refresh}`}/>
    <AdminImport onImported={() => setRefresh(value => value + 1)}/>
    <ProductsToReview key={`products-${refresh}`}/>
    <ReviewsToModerate/>
    <ImportLogs key={`logs-${refresh}`}/>
  </div>;
}

/* ---------- Overview ---------- */

type Overview = {
  users: number; new_7d: number; profiles_filled: number; products_to_review: number; reviews_pending: number; reviews_flagged: number;
  by_skin_type: Record<string, number>; by_concern: Record<string, number>; by_budget: Record<string, number>; by_state: Record<string, number>;
};

function Overview() {
  const [data, setData] = useState<Overview | null>(null);
  const [problem, setProblem] = useState("");

  useEffect(() => {
    let live = true;
    supabase?.rpc("admin_overview").then(({ data: result, error }) => {
      if (!live) return;
      if (error) setProblem(error.message); else setData(result as Overview);
    });
    return () => { live = false; };
  }, []);

  return <section className="card stack" aria-labelledby="admin-overview">
    <h2 id="admin-overview">Overview</h2>
    {problem && <Callout tone="danger" title="Could not load the overview">{problem}</Callout>}
    {!problem && !data && <p role="status">Loading…</p>}
    {data && <>
      <div className="admin-stats">
        <Stat label="People signed up" value={data.users}/>
        <Stat label="Joined in the last 7 days" value={data.new_7d}/>
        <Stat label="Filled in skin details" value={data.profiles_filled}/>
        <Stat label="Products to review" value={data.products_to_review}/>
        <Stat label="Reviews waiting" value={data.reviews_pending}/>
        <Stat label="Reviews flagged" value={data.reviews_flagged}/>
      </div>
      <div className="admin-breakdowns">
        <Breakdown title="Skin type" counts={data.by_skin_type} total={data.users}/>
        <Breakdown title="Main concern" counts={data.by_concern} total={data.users}/>
        <Breakdown title="Budget" counts={data.by_budget} total={data.users}/>
        <Breakdown title="Top states" counts={data.by_state} total={data.users}/>
      </div>
      <p className="small">Counts only. No names or emails are shown here.</p>
    </>}
  </section>;
}

function Stat({ label, value }: { label: string; value: number }) {
  return <div className="admin-stat"><strong>{value}</strong><span>{label}</span></div>;
}

function Breakdown({ title, counts, total }: { title: string; counts: Record<string, number>; total: number }) {
  const rows = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return <div className="admin-breakdown">
    <h3>{title}</h3>
    {rows.length === 0 ? <p className="small">Nothing yet.</p> : <ul>{rows.map(([name, count]) => <li key={name}>
      <span className="admin-breakdown__name">{name}</span>
      <span className="admin-breakdown__bar" aria-hidden="true"><i style={{ width: `${total ? Math.max(4, Math.round((count / total) * 100)) : 0}%` }}/></span>
      <span className="admin-breakdown__count">{count}</span>
    </li>)}</ul>}
  </div>;
}

/* ---------- Products to review ---------- */

type ProductRow = {
  id: string; brand: string; product_name: string; category: string; ingredients_list: string; special_note: string | null; created_at: string;
  treatment_level: string; ingredient_source_url: string | null; source: string;
};

const REVIEW_PAGE = 50;

function ProductsToReview() {
  const [rows, setRows] = useState<ProductRow[] | null>(null);
  const [total, setTotal] = useState(0);
  const [problem, setProblem] = useState("");

  const load = useCallback(async () => {
    if (!supabase) return;
    const { data, error, count } = await supabase.from("products")
      .select("id,brand,product_name,category,ingredients_list,special_note,created_at,treatment_level,ingredient_source_url,source", { count: "exact" })
      .in("source", ["User-Added", IMPORT_SOURCE]).eq("verified", false).order("created_at", { ascending: true }).limit(REVIEW_PAGE);
    if (error) setProblem(error.message); else { setProblem(""); setRows((data ?? []) as ProductRow[]); setTotal(count ?? (data ?? []).length); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const remaining = rows ? Math.max(0, total - rows.length) : 0;

  return <section className="card stack" aria-labelledby="admin-products">
    <h2 id="admin-products">Products to review{rows && rows.length > 0 ? ` (${total})` : ""}</h2>
    <p>Products people added from Check a product, and products you imported from a spreadsheet. They stay unverified, and imported ones stay hidden from the public, until you check the ingredients against a trusted source. Fix anything that is wrong, then verify.</p>
    {problem && <Callout tone="danger" title="Could not load products">{problem}</Callout>}
    {rows && rows.length === 0 && <EmptyState title="Nothing to review">New products added by people, and spreadsheet imports, will show up here.</EmptyState>}
    {rows && rows.map(row => <ProductEditor key={row.id} row={row} onDone={() => { setRows(current => (current ?? []).filter(x => x.id !== row.id)); setTotal(value => Math.max(0, value - 1)); }}/>)}
    {remaining > 0 && <p className="small">{remaining} more waiting. Verify or delete some of these and the next ones will appear when you reload the page.</p>}
  </section>;
}

function ProductEditor({ row, onDone }: { row: ProductRow; onDone: () => void }) {
  const [brand, setBrand] = useState(row.brand);
  const [name, setName] = useState(row.product_name);
  const [category, setCategory] = useState(row.category);
  const [ingredients, setIngredients] = useState(row.ingredients_list);
  const [note, setNote] = useState(row.special_note ?? "");
  const [level, setLevel] = useState(row.treatment_level);
  const [sourceUrl, setSourceUrl] = useState(row.ingredient_source_url ?? "");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const imported = row.source === IMPORT_SOURCE;

  async function verify() {
    if (!supabase) return;
    if (!brand.trim() || !name.trim()) { setMessage("Brand and product name are required."); return; }
    if (!ingredients.trim()) { setMessage("Add the ingredient list before verifying. A verified product must show its official ingredients."); return; }
    if (category === "Treatment" && level === "None") { setMessage("This is a treatment. Set its level (Level 1, Level 2 or Prescription) so the safety rules apply."); return; }
    const link = sourceUrl.trim() ? checkUrl(sourceUrl.trim()) : null;
    if (sourceUrl.trim() && !link) { setMessage("The source link must start with http:// or https://."); return; }
    setBusy(true); setMessage("");
    const { data, error } = await supabase.from("products")
      .update({ brand: brand.trim(), product_name: name.trim(), category, ingredients_list: ingredients.trim(), special_note: note.trim() || null, treatment_level: level, ingredient_source_url: link, verified: true })
      .eq("id", row.id).select("id");
    setBusy(false);
    if (error) { setMessage(error.message.includes("duplicate") ? "A product with this brand and name already exists." : error.message); return; }
    if (!data || data.length === 0) { setMessage("Not allowed. Log in with the owner Google account."); return; }
    onDone();
  }

  async function remove() {
    if (!supabase || !window.confirm(`Delete "${row.brand} ${row.product_name}"? This cannot be undone.`)) return;
    setBusy(true); setMessage("");
    const { data, error } = await supabase.from("products").delete().eq("id", row.id).select("id");
    setBusy(false);
    if (error) { setMessage(error.message); return; }
    if (!data || data.length === 0) { setMessage("Not allowed. Log in with the owner Google account."); return; }
    onDone();
  }

  return <article className="admin-item stack">
    <div className="admin-item__top">
      <Chip tone={imported ? "brand" : "quiet"}>{imported ? "Imported from a spreadsheet" : "Added by a person"}</Chip>
      <small>Added {dayFormat(row.created_at)}</small>
    </div>
    <div className="admin-item__grid">
      <Input label="Brand" value={brand} onChange={event => setBrand(event.target.value)} maxLength={IMPORT_LIMITS.brand}/>
      <Input label="Product name" value={name} onChange={event => setName(event.target.value)} maxLength={IMPORT_LIMITS.name}/>
      <Select label="Category" value={category} onChange={event => setCategory(event.target.value)}>{PRODUCT_CATEGORIES.map(option => <option key={option}>{option}</option>)}</Select>
      <Select label="Treatment level" value={level} onChange={event => setLevel(event.target.value)}>{TREATMENT_LEVELS.map(option => <option key={option}>{option}</option>)}</Select>
    </div>
    <Textarea label="Ingredients (from a trusted source)" rows={3} value={ingredients} onChange={event => setIngredients(event.target.value)} maxLength={IMPORT_LIMITS.ingredients}/>
    <Input label="Link to the official ingredient list (optional)" type="url" inputMode="url" value={sourceUrl} onChange={event => setSourceUrl(event.target.value)} maxLength={IMPORT_LIMITS.url} placeholder="https://"/>
    <Input label="Note shown with the product (optional)" value={note} onChange={event => setNote(event.target.value)} maxLength={IMPORT_LIMITS.note}/>
    <div className="admin-item__actions">
      <Button size="small" onClick={verify} disabled={busy}>Save and verify</Button>
      <Button size="small" variant="secondary" onClick={remove} disabled={busy}>Delete</Button>
    </div>
    {message && <p role="alert" className="admin-item__error">{message}</p>}
  </article>;
}

/* ---------- Reviews to moderate ---------- */

type ReviewStatus = "Pending" | "Flagged";
type ReviewRow = {
  id: string; product_id: string; skin_type: string; caused_pimples: boolean; caused_burning: boolean; dark_spots_result: string | null;
  would_buy_again: string; comment: string | null; state: string | null; city: string | null; created_at: string;
};

function ReviewsToModerate() {
  const [filter, setFilter] = useState<ReviewStatus>("Pending");
  const [rows, setRows] = useState<ReviewRow[] | null>(null);
  const [names, setNames] = useState<Record<string, string>>({});
  const [problem, setProblem] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    if (!supabase) return;
    setRows(null);
    const { data, error } = await supabase.from("reviews")
      .select("id,product_id,skin_type,caused_pimples,caused_burning,dark_spots_result,would_buy_again,comment,state,city,created_at")
      .eq("status", filter).order("created_at", { ascending: true }).limit(50);
    if (error) { setProblem(error.message); setRows([]); return; }
    setProblem("");
    const list = (data ?? []) as ReviewRow[];
    const ids = [...new Set(list.map(item => item.product_id))];
    if (ids.length) {
      const { data: products } = await supabase.from("products").select("id,brand,product_name").in("id", ids);
      setNames(Object.fromEntries((products ?? []).map(item => [item.id as string, `${item.brand} ${item.product_name}`])));
    }
    setRows(list);
  }, [filter]);
  useEffect(() => { void load(); }, [load]);

  async function setStatus(id: string, status: "Approved" | "Flagged" | "Deleted") {
    if (!supabase) return;
    if (status === "Deleted" && !window.confirm("Remove this review? People will not see it.")) return;
    setMessage("");
    const { data, error } = await supabase.from("reviews").update({ status }).eq("id", id).select("id");
    if (error) { setMessage(error.message); return; }
    if (!data || data.length === 0) { setMessage("Not allowed. Log in with the owner Google account."); return; }
    setRows(current => (current ?? []).filter(item => item.id !== id));
  }

  return <section className="card stack" aria-labelledby="admin-reviews">
    <h2 id="admin-reviews">Reviews to moderate</h2>
    <p>Reviews stay hidden until you approve them. Reject anything with links, phone numbers, insults or medical claims.</p>
    <div className="admin-tabs" role="group" aria-label="Review status">
      {(["Pending", "Flagged"] as const).map(option => <button key={option} type="button" aria-pressed={filter === option} className="segmented-choice__option" onClick={() => setFilter(option)}>{option}</button>)}
    </div>
    {problem && <Callout tone="danger" title="Could not load reviews">{problem}</Callout>}
    {message && <p role="alert" className="admin-item__error">{message}</p>}
    {rows === null && !problem && <p role="status">Loading…</p>}
    {rows && rows.length === 0 && !problem && <EmptyState title={`No ${filter.toLowerCase()} reviews`}>Nothing is waiting here.</EmptyState>}
    {rows && rows.map(row => <article key={row.id} className="admin-item stack">
      <div className="admin-item__top">
        <strong>{names[row.product_id] ?? "Unknown product"}</strong>
        <small>{dayFormat(row.created_at)}{row.state ? ` · ${row.city ? `${row.city}, ` : ""}${row.state}` : ""}</small>
      </div>
      <div className="admin-item__chips">
        <Chip>{row.skin_type} skin</Chip>
        <Chip tone={row.caused_pimples ? "brand" : "quiet"}>{row.caused_pimples ? "Caused pimples" : "No new pimples"}</Chip>
        <Chip tone={row.caused_burning ? "brand" : "quiet"}>{row.caused_burning ? "Burning or itching" : "No burning"}</Chip>
        {row.dark_spots_result && row.dark_spots_result !== "Not Applicable" && <Chip>Dark spots: {row.dark_spots_result}</Chip>}
        <Chip>Buy again: {row.would_buy_again}</Chip>
      </div>
      <p className="admin-item__comment">{row.comment ? `“${row.comment}”` : "No comment."}</p>
      <div className="admin-item__actions">
        <Button size="small" onClick={() => setStatus(row.id, "Approved")}>Approve</Button>
        {filter !== "Flagged" && <Button size="small" variant="secondary" onClick={() => setStatus(row.id, "Flagged")}>Flag</Button>}
        <Button size="small" variant="secondary" onClick={() => setStatus(row.id, "Deleted")}>Remove</Button>
      </div>
    </article>)}
  </section>;
}

/* ---------- Import logs ---------- */

type LogRow = { id: string; source: string; started_at: string; finished_at: string | null; products_added: number; status: string; details: { file?: string; rows?: number; skipped?: number } | null };

function logNote(details: LogRow["details"]): string {
  if (!details) return "";
  const parts: string[] = [];
  if (details.file) parts.push(details.file);
  if (typeof details.skipped === "number" && details.skipped > 0) parts.push(`${details.skipped} skipped`);
  return parts.join(" · ");
}

function ImportLogs() {
  const [rows, setRows] = useState<LogRow[] | null>(null);
  const [problem, setProblem] = useState("");

  useEffect(() => {
    let live = true;
    supabase?.from("import_logs").select("id,source,started_at,finished_at,products_added,status,details").order("started_at", { ascending: false }).limit(20)
      .then(({ data, error }) => { if (!live) return; if (error) { setProblem(error.message); setRows([]); } else setRows((data ?? []) as LogRow[]); });
    return () => { live = false; };
  }, []);

  return <section className="card stack" aria-labelledby="admin-imports">
    <h2 id="admin-imports">Import logs</h2>
    <p>Each spreadsheet import is listed here. Automatic imports from other websites are not switched on.</p>
    {problem && <Callout tone="danger" title="Could not load import logs">{problem}</Callout>}
    {rows && rows.length === 0 && !problem && <p className="small">No imports yet.</p>}
    {rows && rows.length > 0 && <div className="admin-table" role="region" aria-label="Import logs" tabIndex={0}>
      <table><thead><tr><th>Source</th><th>Started</th><th>Status</th><th>Added</th><th>Notes</th></tr></thead>
        <tbody>{rows.map(row => <tr key={row.id}><td>{row.source}</td><td>{dayFormat(row.started_at)}</td><td>{row.status}</td><td>{row.products_added}</td><td>{logNote(row.details)}</td></tr>)}</tbody></table>
    </div>}
  </section>;
}
