/**
 * Reads and checks a spreadsheet of products (saved as CSV) before anything is sent to the database.
 * Nothing in here talks to Supabase: it only turns text into checked rows, so it can be tested on its own.
 */

export const PRODUCT_CATEGORIES = ["Cleanser", "Soap", "Face Wash", "Moisturizer", "Sunscreen", "Treatment", "Toner", "Scrub", "Oil", "Other"] as const;
export const TREATMENT_LEVELS = ["None", "Level 1", "Level 2", "Prescription"] as const;
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];
export type TreatmentLevel = (typeof TREATMENT_LEVELS)[number];

export const IMPORT_LIMITS = { maxBytes: 1_000_000, maxRows: 500, brand: 80, name: 120, note: 200, ingredients: 5000, url: 500 } as const;

/** Imported products arrive unverified and stay hidden from the public until the owner verifies them. */
export const IMPORT_SOURCE = "Admin Import";

export type ImportProduct = {
  brand: string;
  product_name: string;
  category: ProductCategory;
  ingredients_list: string;
  ingredient_source_url: string | null;
  special_note: string | null;
  treatment_level: TreatmentLevel;
  source: typeof IMPORT_SOURCE;
  verified: false;
};

export type CheckedRow = {
  /** Row number as the spreadsheet shows it (the header is row 1). */
  line: number;
  label: string;
  errors: string[];
  warnings: string[];
  product: ImportProduct | null;
};

export type CheckResult = {
  /** Problems with the whole file. When there are any, no rows are checked. */
  fileProblems: string[];
  rows: CheckedRow[];
  ready: ImportProduct[];
  ignoredColumns: string[];
};

/* ---------- CSV reading ---------- */

/** Reads CSV text. Handles quoted cells, commas and line breaks inside quotes, "" for a quote mark, \r\n, and a leading BOM. */
export function parseCsv(text: string, delimiter = ","): { rows: string[][]; brokenQuote: boolean } {
  const src = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  let i = 0;
  while (i < src.length) {
    const ch = src[i];
    if (inQuotes) {
      if (ch === '"') {
        if (src[i + 1] === '"') { cell += '"'; i += 2; continue; }
        inQuotes = false; i++; continue;
      }
      cell += ch; i++; continue;
    }
    if (ch === '"' && cell === "") { inQuotes = true; i++; continue; }
    if (ch === delimiter) { row.push(cell); cell = ""; i++; continue; }
    if (ch === "\r" || ch === "\n") {
      if (ch === "\r" && src[i + 1] === "\n") i++;
      row.push(cell); rows.push(row); row = []; cell = ""; i++; continue;
    }
    cell += ch; i++;
  }
  const brokenQuote = inQuotes;
  if (cell !== "" || row.length) { row.push(cell); rows.push(row); }
  return { rows, brokenQuote };
}

/** Excel in some countries saves CSV with semicolons, and some tools use tabs. Picks the one the header row uses most. */
export function detectDelimiter(text: string): string {
  const src = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
  const end = src.search(/[\r\n]/);
  const firstLine = end === -1 ? src : src.slice(0, end);
  let inQuotes = false;
  const counts: Record<string, number> = { ",": 0, ";": 0, "\t": 0 };
  for (const ch of firstLine) {
    if (ch === '"') inQuotes = !inQuotes;
    else if (!inQuotes && ch in counts) counts[ch]++;
  }
  const best = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return best[1] > 0 ? best[0] : ",";
}

function quoteCsv(value: string): string {
  return /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

/** The empty spreadsheet to download. It has one clearly fake example row, which the checker refuses, so it cannot be imported by accident. */
export function templateCsv(): string {
  const header = ["brand", "product_name", "category", "ingredients_list", "ingredient_source_url", "special_note", "treatment_level"];
  const example = ["Example Brand", "Example Gentle Cleanser", "Cleanser", "Water, Glycerin, Coco-Glucoside", "https://example.com/product-page", "", "None"];
  return "﻿" + [header, example].map(line => line.map(quoteCsv).join(",")).join("\r\n") + "\r\n";
}

/* ---------- Checking ---------- */

type Field = "brand" | "product_name" | "category" | "ingredients_list" | "ingredient_source_url" | "special_note" | "treatment_level";

/** Header names people are likely to use. Compared in lower case with spaces and punctuation removed. */
const HEADER_ALIASES: Record<Field, string[]> = {
  brand: ["brand", "brandname", "company", "manufacturer"],
  product_name: ["productname", "product", "name", "title"],
  category: ["category", "type", "producttype"],
  ingredients_list: ["ingredientslist", "ingredients", "ingredientlist", "inci", "fullingredients"],
  ingredient_source_url: ["ingredientsourceurl", "sourceurl", "sourcelink", "ingredientsource", "url", "link", "officiallink"],
  special_note: ["specialnote", "note", "notes"],
  treatment_level: ["treatmentlevel", "level", "treatment"],
};
const REQUIRED: Field[] = ["brand", "product_name", "category", "ingredients_list"];
const FIELD_LABEL: Record<Field, string> = {
  brand: "brand", product_name: "product_name", category: "category", ingredients_list: "ingredients_list",
  ingredient_source_url: "ingredient_source_url", special_note: "special_note", treatment_level: "treatment_level",
};

const headerKey = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
/** Tidies one cell: removes invisible control characters, collapses spaces and line breaks, trims the ends. */
const clean = (value: string | undefined) => (value ?? "").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").replace(/\s+/g, " ").trim();
const sameKey = (brand: string, name: string) => `${clean(brand).toLowerCase()}||${clean(name).toLowerCase()}`;

function matchCategory(raw: string): ProductCategory | null {
  let key = headerKey(raw);
  if (key === "moisturiser" || key === "moisturisers") key = "moisturizer";
  if (key === "suncream" || key === "sunblock") key = "sunscreen";
  for (const category of PRODUCT_CATEGORIES) {
    const target = headerKey(category);
    if (key === target || key === target + "s") return category;
  }
  return null;
}

function matchLevel(raw: string): TreatmentLevel | null {
  if (raw === "") return "None";
  const key = headerKey(raw);
  if (key === "none" || key === "no" || key === "0") return "None";
  if (key === "level1" || key === "1") return "Level 1";
  if (key === "level2" || key === "2") return "Level 2";
  if (key === "prescription" || key === "rx") return "Prescription";
  return null;
}

/** Returns the cleaned web address, or null if it is not an http(s) link. */
export function checkUrl(raw: string): string | null {
  try {
    const url = new URL(raw);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch { return null; }
}

/**
 * Turns the bytes of an uploaded file into text. Google Sheets and "CSV UTF-8" in Excel save UTF-8.
 * Plain "CSV" in Excel on Windows saves Windows-1252, where "é" or "’" would otherwise turn into garbage.
 */
export function decodeCsvBytes(bytes: ArrayBuffer): string {
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return new TextDecoder("windows-1252").decode(bytes);
  }
}

/**
 * Checks a CSV file. `existing` is every product already in the catalog, so duplicates are caught before they reach the database.
 * Problems that stop a row from being imported are errors. Things worth a second look are warnings, and do not block the import.
 */
export function checkProductSheet(text: string, existing: { brand: string; product_name: string }[]): CheckResult {
  const empty = (problems: string[], ignoredColumns: string[] = []): CheckResult => ({ fileProblems: problems, rows: [], ready: [], ignoredColumns });
  if (text.trim() === "") return empty(["The file is empty."]);

  const { rows: table, brokenQuote } = parseCsv(text, detectDelimiter(text));
  if (brokenQuote) return empty(["A quote mark in the file is never closed, so the cells after it cannot be read. Open the file, look for a stray \" and save it again."]);
  if (table.length === 0) return empty(["The file is empty."]);

  // Work out which column holds which field.
  const header = table[0].map(cell => clean(cell));
  const columnOf: Partial<Record<Field, number>> = {};
  const ignoredColumns: string[] = [];
  header.forEach((name, index) => {
    if (name === "") return;
    const key = headerKey(name);
    const field = (Object.keys(HEADER_ALIASES) as Field[]).find(candidate => HEADER_ALIASES[candidate].includes(key));
    if (field && columnOf[field] === undefined) columnOf[field] = index;
    else ignoredColumns.push(name);
  });
  const missing = REQUIRED.filter(field => columnOf[field] === undefined);
  if (missing.length) {
    return empty([`The first row must name these columns: ${missing.map(field => FIELD_LABEL[field]).join(", ")}. The columns found were: ${header.filter(Boolean).join(", ") || "none"}. Download the template to see the right layout.`], ignoredColumns);
  }

  const dataRows = table.slice(1).map((cells, index) => ({ cells, line: index + 2 })).filter(({ cells }) => cells.some(cell => clean(cell) !== ""));
  if (dataRows.length === 0) return empty(["There are no products under the header row."], ignoredColumns);
  if (dataRows.length > IMPORT_LIMITS.maxRows) return empty([`The file has ${dataRows.length} products. Import at most ${IMPORT_LIMITS.maxRows} at a time.`], ignoredColumns);

  const taken = new Map<string, string>();
  for (const product of existing) taken.set(sameKey(product.brand, product.product_name), "already in the catalog");
  const firstLine = new Map<string, number>();

  const rows: CheckedRow[] = dataRows.map(({ cells, line }) => {
    const get = (field: Field) => clean(cells[columnOf[field] ?? -1]);
    const brand = get("brand");
    const name = get("product_name");
    const rawCategory = get("category");
    const ingredients = get("ingredients_list").replace(/^ingredients?\s*[:\-–—]\s*/i, "");
    const rawUrl = get("ingredient_source_url");
    const note = get("special_note");
    const rawLevel = get("treatment_level");
    const errors: string[] = [];
    const warnings: string[] = [];

    if (brand.toLowerCase() === "example brand") errors.push("This is the example row from the template. Delete it or replace it with a real product.");
    if (!brand) errors.push("Brand is empty."); else if (brand.length > IMPORT_LIMITS.brand) errors.push(`Brand is longer than ${IMPORT_LIMITS.brand} characters.`);
    if (!name) errors.push("Product name is empty."); else if (name.length > IMPORT_LIMITS.name) errors.push(`Product name is longer than ${IMPORT_LIMITS.name} characters.`);

    let category: ProductCategory | null = null;
    if (!rawCategory) errors.push("Category is empty.");
    else {
      category = matchCategory(rawCategory);
      if (!category) errors.push(`Category "${rawCategory}" is not one of: ${PRODUCT_CATEGORIES.join(", ")}.`);
    }

    if (!ingredients) errors.push("Ingredient list is empty. An import needs the official list so you can check it.");
    else if (ingredients.length > IMPORT_LIMITS.ingredients) errors.push(`Ingredient list is longer than ${IMPORT_LIMITS.ingredients} characters.`);
    else {
      const count = ingredients.split(",").map(part => part.trim()).filter(Boolean).length;
      if (count === 1 && ingredients.length > 40) warnings.push("The ingredients do not look separated by commas.");
      else if (count < 3) warnings.push(`Only ${count} ingredient${count === 1 ? "" : "s"} listed. Is the list complete?`);
      if (/<[^>]+>/.test(ingredients)) warnings.push("The ingredient list contains HTML tags. It may have been copied from a web page.");
    }

    let url: string | null = null;
    if (rawUrl) {
      if (rawUrl.length > IMPORT_LIMITS.url) errors.push(`Source link is longer than ${IMPORT_LIMITS.url} characters.`);
      else {
        url = checkUrl(rawUrl);
        if (!url) errors.push(`Source link "${rawUrl.slice(0, 60)}" is not a web address starting with http:// or https://.`);
      }
    } else warnings.push("No source link, so the product page will not show \"Official ingredient source\".");

    if (note.length > IMPORT_LIMITS.note) errors.push(`Note is longer than ${IMPORT_LIMITS.note} characters.`);

    const level = matchLevel(rawLevel);
    if (!level) errors.push(`Treatment level "${rawLevel}" is not one of: ${TREATMENT_LEVELS.join(", ")}.`);
    else if (category === "Treatment" && level === "None") warnings.push("This is a treatment but its level is None. Set Level 1, Level 2 or Prescription so the safety rules apply.");

    if (brand && name && name.toLowerCase().startsWith(brand.toLowerCase() + " ")) warnings.push("The product name starts with the brand. The site shows brand and name together, so the brand would appear twice.");

    if (brand && name) {
      const key = sameKey(brand, name);
      const earlier = firstLine.get(key);
      if (earlier !== undefined) errors.push(`Same product as row ${earlier}.`);
      else if (taken.has(key)) errors.push(`${brand} ${name} is ${taken.get(key)}.`);
      else firstLine.set(key, line);
    }

    const product: ImportProduct | null = errors.length === 0 && category && level
      ? { brand, product_name: name, category, ingredients_list: ingredients, ingredient_source_url: url, special_note: note || null, treatment_level: level, source: IMPORT_SOURCE, verified: false }
      : null;
    return { line, label: `${brand} ${name}`.trim() || "(blank row)", errors, warnings, product };
  });

  return { fileProblems: [], rows, ready: rows.flatMap(row => (row.product ? [row.product] : [])), ignoredColumns };
}
