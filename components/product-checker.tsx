"use client";

import { useEffect, useMemo, useState } from "react";
import { analyze, catalog } from "@/lib/catalog";
import { supabase } from "@/lib/supabase";
import { Badge, Button, Callout, Card, Chip, EmptyState, Icon, Input, Textarea, type IconName } from "@/components/ui";

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

function ProductCard({ product, addToTest }: { product: Product; addToTest: (product: Product) => void }) {
  const verified = product.verified && Boolean(product.ingredients_list);
  const community = product.source === "User-Added";
  const status = community ? "Community entry · not verified" : verified ? "Official ingredient list saved" : "Ingredients not verified";
  const statusIcon: IconName = community ? "info" : verified ? "circle-check" : "info";

  return <Card className="product-card">
    <div className="product-card__meta">
      <Chip tone="neutral">{product.category}</Chip>
      {product.treatment_level && product.treatment_level !== "None" && <Badge tone="level">{product.treatment_level}</Badge>}
    </div>
    <h3>{product.brand} {product.product_name}</h3>
    <p className={`product-card__status product-card__status--${community ? "community" : verified ? "verified" : "unverified"}`}><Icon name={statusIcon} size={18}/><span>{status}</span></p>
    {verified && product.ingredient_source_url && <a href={product.ingredient_source_url} target="_blank" rel="noreferrer">Official ingredient source</a>}
    <Button className="product-card__action" onClick={() => addToTest(product)}>Add to Test &amp; Watch</Button>
    {product.ingredients_list && <details><summary>Show saved ingredients</summary><p>{product.ingredients_list}</p></details>}
  </Card>;
}

export function ProductChecker() {
  const [query, setQuery] = useState("");
  const [text, setText] = useState("");
  const [checked, setChecked] = useState(false);
  const [items, setItems] = useState<Product[]>(fallback);
  const [status, setStatus] = useState("Showing starter catalog; connect Supabase to load live products.");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    let live = true;
    async function load() {
      if (!supabase) return;
      const { data, error } = await supabase.from("products").select("id,brand,product_name,category,ingredients_list,verified,treatment_level,source,ingredient_source_url").order("brand").order("product_name");
      if (!live) return;
      if (error) { setStatus(`Could not load products: ${error.message}`); return; }
      if (data) { setItems(data as Product[]); setStatus("Product catalog loaded. Unverified labels are never guessed."); }
    }
    void load();
    return () => { live = false; };
  }, []);

  const categories = useMemo(() => ["All", ...Array.from(new Set(items.map(product => product.category))).sort((a, b) => a.localeCompare(b))], [items]);
  const matching = useMemo(() => items.filter(product => {
    const matchesQuery = `${product.brand} ${product.product_name}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (category === "All" || product.category === category);
  }), [items, query, category]);
  const found = matching.slice(0, 12);
  const result = checked ? analyze(text) : [];

  async function addToTest(product: Product) {
    if (!supabase || !product.id.match(/^[0-9a-f-]{36}$/i)) { setStatus("Connect Supabase and run the migration before adding products to your tracker."); return; }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setStatus("Please log in to add products to Test & Watch."); return; }
    const { error } = await supabase.from("user_products").upsert({ user_id: user.id, product_id: product.id, patch_test_status: "Not Started", treatment_level: product.treatment_level }, { onConflict: "user_id,product_id" });
    setStatus(error ? `Could not add: ${error.message}` : `${product.brand} ${product.product_name} added to Test & Watch.`);
  }

  async function saveCommunity() {
    if (!supabase) { setStatus("Connect Supabase to save a community product."); return; }
    const name = query.trim();
    if (!name) { setStatus("Type the product name first."); return; }
    const { error } = await supabase.from("products").insert({ brand: "Community", product_name: name, category: "Other", ingredients_list: text.trim(), source: "User-Added", verified: false, treatment_level: "None" });
    setStatus(error ? `Could not save: ${error.message}` : "Community product saved as Not Yet Verified.");
  }

  return <div className="products-page">
    <header className="products-header">
      <p className="eyebrow">A clear look at what is on the label</p>
      <h1>My Products</h1>
      <p>Look up a listed product or paste the label. Ingredients stay blank until an official full ingredient list is verified.</p>
    </header>

    <Callout tone="info" className="catalog-note">First 3 ingredients are usually present in the largest amounts. Unknown ingredients are not automatically bad. Formula can vary by region and change over time, so compare with your package.</Callout>

    <div className="products-search-row">
      <Input label="Search the starter catalog" icon="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Type a product name"/>
      <span className="small" aria-live="polite">{matching.length > 12 ? "Showing the first 12 matches" : `${matching.length} ${matching.length === 1 ? "product" : "products"}`}</span>
    </div>
    <div className="category-chips" role="group" aria-label="Filter products by category">
      {categories.map(value => <button key={value} type="button" aria-pressed={category === value} onClick={() => setCategory(value)}>{value}</button>)}
    </div>
    <p className="unverified-note">Ingredients not verified. Paste the label below for a personal check.</p>
    {status !== "Showing starter catalog; connect Supabase to load live products." || process.env.NODE_ENV !== "production" ? <p className="small" role="status">{status}</p> : null}
    {found.length ? <div className="product-grid">{found.map(product => <ProductCard key={product.id} product={product} addToTest={addToTest}/>)}</div> : <EmptyState title="No product matches that search.">Try another name, or paste the label.</EmptyState>}

    <section className="label-checker" aria-labelledby="label-checker-title">
      <div className="label-checker__intro"><p className="eyebrow">Bring your own label</p><h2 id="label-checker-title">Check ingredients from your label</h2><p>Paste the ingredient list as it appears on your product package.</p></div>
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
