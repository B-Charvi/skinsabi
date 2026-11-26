"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { analyze, catalog } from "@/lib/catalog";
import { supabase } from "@/lib/supabase";
import { Toast, type ToastMessage } from "@/components/toast";
import { Badge, Button, Callout, Card, Chip, EmptyState, Icon, Input, Textarea } from "@/components/ui";

type Product = {
  id: string;
  brand: string;
  product_name: string;
  category: string;
  ingredients_list: string;
  verified: boolean;
  treatment_level: string;
  source: string;
  ingredient_source_url?: string | null;
};

const fallback: Product[] = catalog.map(product => ({
  ...product,
  id: String(product.id),
  brand: product.brand,
  product_name: product.name,
  category: product.category,
  ingredients_list: product.ingredients,
  verified: product.verified,
  treatment_level: product.treatmentLevel,
  source: product.source,
}));

const resultGroups = [
  { label: "Red flag", flag: "Red Flag", icon: "octagon" as const, style: "red" },
  { label: "Yellow flag", flag: "Yellow Flag", icon: "triangle" as const, style: "yellow" },
  { label: "Green flag", flag: "Green Flag", icon: "circle-check" as const, style: "green" },
  { label: "Unknown", flag: "Unknown Ingredient", icon: "info" as const, style: "unknown" },
];

/** A product counts as "saved" only when its list is official (verified), not just pasted in by someone. */
const hasOfficialList = (product: Product) => product.verified && Boolean(product.ingredients_list);

type Tracking = { added: ReadonlySet<string>; adding: string | null };

function ProductCard({ product, addToTest, tracking }: { product: Product; addToTest: (product: Product) => void; tracking: Tracking }) {
  // Only good news is shown on a card. A product without an official list simply shows no status.
  const verified = hasOfficialList(product);
  // Some starter-catalog rows use the placeholder brand "Unverified". Never show that word to a visitor.
  const brand = product.brand === "Unverified" ? "" : product.brand;

  return <Card className="product-card">
    <div className="product-card__meta">
      <Chip tone="neutral">{product.category}</Chip>
      {product.treatment_level && product.treatment_level !== "None" && <Badge tone="level">{product.treatment_level}</Badge>}
    </div>
    <h3>{`${brand} ${product.product_name}`.trim()}</h3>
    {verified && <p className="product-card__status product-card__status--verified"><Icon name="circle-check" size={18}/><span>Official ingredient list saved</span></p>}
    {verified && product.ingredient_source_url && <a href={product.ingredient_source_url} target="_blank" rel="noreferrer">Official ingredient source</a>}
    {!product.ingredients_list && <a className="text-link" href="#label-checker-title">Add the ingredient list</a>}
    {tracking.added.has(product.id)
      ? <Link className="button button--secondary product-card__action product-card__added" href="/test-and-watch"><Icon name="circle-check" size={18}/>In Test &amp; Watch</Link>
      : <Button className="product-card__action" disabled={tracking.adding === product.id} onClick={() => addToTest(product)}>{tracking.adding === product.id ? "Adding…" : "Add to Test & Watch"}</Button>}
    {product.ingredients_list && <details><summary>Show saved ingredients</summary><p>{product.ingredients_list}</p></details>}
  </Card>;
}

const GROUP_LIMIT = 12;

/** One block of the catalog. Products with an official ingredient list sit apart from those without one, so each block looks the same. */
function ProductGroup({ id, title, note, saved, products, addToTest, tracking }: { id: string; title: string; note: string; saved?: boolean; products: Product[]; addToTest: (product: Product) => void; tracking: Tracking }) {
  const [showAll, setShowAll] = useState(false);
  if (products.length === 0) return null;
  const shown = showAll ? products : products.slice(0, GROUP_LIMIT);
  return <section className="product-group" aria-labelledby={id}>
    <div className="product-group__head">
      <h2 id={id}>{saved && <Icon name="circle-check" size={22}/>}{title}<span className="product-group__count">{products.length} {products.length === 1 ? "product" : "products"}</span></h2>
      <p>{note}</p>
    </div>
    <div className="product-grid">{shown.map(product => <ProductCard key={product.id} product={product} addToTest={addToTest} tracking={tracking}/>)}</div>
    {products.length > GROUP_LIMIT && !showAll && <Button variant="secondary" className="product-group__more" onClick={() => setShowAll(true)}>Show all {products.length}</Button>}
  </section>;
}

export function ProductChecker() {
  const [query, setQuery] = useState("");
  const [text, setText] = useState("");
  const [checked, setChecked] = useState(false);
  const [items, setItems] = useState<Product[]>(fallback);
  const [status, setStatus] = useState("Showing starter catalog; connect Supabase to load live products.");
  const [category, setCategory] = useState("All");
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [added, setAdded] = useState<ReadonlySet<string>>(() => new Set());
  const [adding, setAdding] = useState<string | null>(null);
  const closeToast = useCallback(() => setToast(null), []);
  const showToast = (message: Omit<ToastMessage, "id">) => setToast({ ...message, id: Date.now() });

  // Products already in Test & Watch show that on their card, so a return visit still shows what you have added.
  useEffect(() => {
    let live = true;
    async function loadTracked() {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      const { data } = await supabase.from("user_products").select("product_id").eq("user_id", session.user.id).not("product_id", "is", null);
      if (live && data) setAdded(new Set(data.map(row => row.product_id as string)));
    }
    void loadTracked();
    return () => { live = false; };
  }, []);

  useEffect(() => {
    let live = true;
    async function load() {
      if (!supabase) return;
      const { data, error } = await supabase.from("products").select("id,brand,product_name,category,ingredients_list,verified,treatment_level,source,ingredient_source_url").order("brand").order("product_name");
      if (!live) return;
      if (error) { setStatus(`Could not load products: ${error.message}`); return; }
      // The owner can read spreadsheet imports that are still unverified. The public cannot, and the owner should see the same page they do.
      if (data) { setItems((data as Product[]).filter(product => !(product.source === "Admin Import" && !product.verified))); setStatus("Product catalog loaded."); }
    }
    void load();
    return () => { live = false; };
  }, []);

  const categories = useMemo(() => ["All", ...Array.from(new Set(items.map(product => product.category))).sort((a, b) => a.localeCompare(b))], [items]);
  const matching = useMemo(() => items.filter(product => {
    const matchesQuery = `${product.brand} ${product.product_name}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (category === "All" || product.category === category);
  }), [items, query, category]);
  const withList = matching.filter(hasOfficialList);
  const withoutList = matching.filter(product => !hasOfficialList(product));
  const result = checked ? analyze(text) : [];

  const markAdded = (id: string) => setAdded(current => new Set(current).add(id));
  const tracking: Tracking = { added, adding };

  async function addToTest(product: Product) {
    const name = `${product.brand === "Unverified" ? "" : product.brand} ${product.product_name}`.trim();
    const openTracker = { label: "Open Test & Watch", href: "/test-and-watch" };
    if (!supabase || !product.id.match(/^[0-9a-f-]{36}$/i)) { showToast({ tone: "error", title: "Could not add it yet", message: "The product list is still loading. Wait a moment and try again." }); return; }
    if (added.has(product.id)) { showToast({ tone: "info", title: "Already in Test & Watch", message: `${name} is already on your list.`, action: openTracker }); return; }
    setAdding(product.id);
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) { setAdding(null); showToast({ tone: "error", title: "Log in to add this product", message: "Test & Watch keeps your patch tests saved to your account.", action: { label: "Log in", href: "/login?next=%2Fproducts" } }); return; }
    // Insert only if it is not already there, so pressing the button again can never reset a patch test that has started.
    const { data, error } = await supabase.from("user_products")
      .upsert({ user_id: user.id, product_id: product.id, patch_test_status: "Not Started", treatment_level: product.treatment_level }, { onConflict: "user_id,product_id", ignoreDuplicates: true })
      .select("id");
    setAdding(null);
    if (error) { showToast({ tone: "error", title: "Could not add it", message: error.message }); return; }
    markAdded(product.id);
    if (!data || data.length === 0) showToast({ tone: "info", title: "Already in Test & Watch", message: `${name} is already on your list.`, action: openTracker });
    else showToast({ tone: "success", title: "Added to Test & Watch", message: `${name} is now on your list. Start its 14-day patch test there.`, action: openTracker });
  }

  async function saveCommunity() {
    if (!supabase) { showToast({ tone: "error", title: "Could not save yet", message: "The site is not connected right now. Try again in a moment." }); return; }
    const name = query.trim();
    if (!name) { showToast({ tone: "error", title: "Type the product name first", message: "Use the search box above the products, then press Save as community product again." }); return; }
    const { error } = await supabase.from("products").insert({ brand: "Community", product_name: name, category: "Other", ingredients_list: text.trim(), source: "User-Added", verified: false, treatment_level: "None" });
    if (error) showToast({ tone: "error", title: "Could not save it", message: error.message });
    else showToast({ tone: "success", title: "Saved for review", message: `${name} will appear in the catalog once it has been checked. Thank you!` });
  }

  return <div className="products-page">
    <header className="products-header">
      <p className="eyebrow">A clear look at what is on the label</p>
      <h1>Products</h1>
      <p>Look up a product or paste its label to see what to watch for.</p>
    </header>

    <Callout tone="info" className="catalog-note">First 3 ingredients are usually present in the largest amounts. Unknown ingredients are not automatically bad. Formula can vary by region and change over time, so compare with your package.</Callout>

    <div className="products-search-row">
      <Input label="Search the starter catalog" icon="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Type a product name"/>
      <span className="small" aria-live="polite">{`${matching.length} ${matching.length === 1 ? "product" : "products"}`}</span>
    </div>
    <div className="category-chips" role="group" aria-label="Filter products by category">
      {categories.map(value => <button key={value} type="button" aria-pressed={category === value} onClick={() => setCategory(value)}>{value}</button>)}
    </div>
    {status !== "Showing starter catalog; connect Supabase to load live products." || process.env.NODE_ENV !== "production" ? <p className="small" role="status">{status}</p> : null}
    <Toast toast={toast} onClose={closeToast}/>
    {matching.length ? <>
      <ProductGroup id="group-saved" saved title="Official ingredient list saved" note="Tap “Show saved ingredients” on a card to see what is in it." products={withList} addToTest={addToTest} tracking={tracking}/>
      <ProductGroup id="group-needed" title="No official ingredient list yet" note="You can still add these to Test & Watch, or paste the label below to check them." products={withoutList} addToTest={addToTest} tracking={tracking}/>
    </> : <EmptyState title="No product matches that search.">Try another name, or paste the label.</EmptyState>}

    <section className="label-checker" aria-labelledby="label-checker-title">
      <div className="label-checker__intro"><p className="eyebrow">Bring your own label</p><h2 id="label-checker-title">Check ingredients from your label</h2><p>Paste the ingredient list from the pack and we will flag what to watch.</p></div>
      <div className="label-checker__form">
        <Textarea label="Ingredient list" value={text} onChange={event => { setText(event.target.value); setChecked(false); }} placeholder="Paste ingredients separated by commas, semicolons, or line breaks"/>
        <div className="label-checker__actions"><Button onClick={() => setChecked(true)}>Check My Ingredients</Button><Button variant="secondary" onClick={saveCommunity}>Save as community product</Button></div>
        {checked && <div className="result-groups" aria-live="polite">{resultGroups.map(group => {
          const matches = result.filter(item => item.flag === group.flag);
          return <section className={`ingredient-group ingredient-group--${group.style}`} key={group.flag} aria-labelledby={`result-${group.style}`}>
            <div className="ingredient-group__heading"><span className="ingredient-group__icon"><Icon name={group.icon} size={17}/></span><h3 id={`result-${group.style}`}>{group.label}</h3><Badge tone="neutral">{matches.length}</Badge></div>
            {matches.length ? <ul>{matches.map((item, index) => <li key={`${group.flag}-${item.name}-${index}`}><span>{item.name}</span>{item.flag === "Red Flag" && item.index < 3 && <Chip tone="quiet">Found in first 3 ingredients</Chip>}{item.flag === "Unknown Ingredient" && <small>We do not know this one yet. It is not automatically bad; patch testing still matters.</small>}</li>)}</ul> : <p className="ingredient-group__empty">No ingredients in this group</p>}
          </section>;
        })}</div>}
      </div>
    </section>

    <section className="patch-test-section" aria-labelledby="patch-test-title">
      <h2 id="patch-test-title">Patch test every new product</h2>
      <div className="grid">{[["Days 1–2 · Behind ear", "Apply a small amount and wait 48 hours. Itching, burning, or redness means stop on face."], ["Days 3–5 · Jawline", "Apply a thin layer to one side only. New pimples in that spot may mean it is clogging you."], ["Days 6–14 · Gradual face use", "Start thinly and slowly. Stop if burning continues, breakouts rise, or spots look darker."]].map(([title, body]) => <Card key={title}><h3>{title}</h3><p>{body}</p><label className="check"><input type="checkbox"/> Mark step complete</label></Card>)}</div>
    </section>
  </div>;
}
