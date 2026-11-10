"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Callout, Chip } from "@/components/ui";
import { high, low, recommend, type Recommendation } from "@/lib/recommend";
import { PRICES_COLLECTED, type Category, type ConcernName, type PriceEntry, type Product, type SkinType } from "@/lib/recommended-products";

const categoryLabel: Record<Category, string> = { sunscreen: "Sunscreen", cleanser: "Cleanser", moisturiser: "Moisturiser" };
const naira = (value: number) => `₦${value.toLocaleString("en-NG")}`;
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function shortDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return `${day} ${monthNames[month - 1]} ${year}`;
}

function priceText(product: Product) {
  const lowest = low(product);
  const highest = high(product);
  return lowest === highest ? naira(lowest) : `${naira(lowest)} to ${naira(highest)}`;
}

function lowestEntry(product: Product): PriceEntry {
  return product.prices.reduce((best, entry) => (entry.priceNGN < best.priceNGN ? entry : best));
}

/** Sellers in the person's state first, then marketplaces, then online pharmacies, then other stores. */
function sortedSellers(product: Product, state: string) {
  const rank = (entry: PriceEntry) => entry.region && entry.region === state ? 1 : entry.kind === "marketplace" ? 2 : entry.kind === "online-pharmacy" ? 3 : 4;
  return [...product.prices].sort((a, b) => rank(a) - rank(b));
}

function whereLine(entry: PriceEntry, state: string) {
  if (entry.kind === "store" && entry.region) {
    if (!state) return `${entry.channel} is based in ${entry.region}.`;
    if (state === entry.region) return `${entry.channel} is in ${entry.region}. Visit or order direct.`;
    return `${entry.channel} is based in ${entry.region}. Ask about delivery to ${state}.`;
  }
  return state ? `${entry.channel}. Delivery to ${state}: check the fee at checkout.` : `${entry.channel}.`;
}

function WhereToFind({ product, state }: { product: Product; state: string }) {
  return <ul className="reco-where" aria-label={`Where to find ${product.brand} ${product.name}`}>
    {sortedSellers(product, state).map((entry, index) => {
      const line = whereLine(entry, state);
      const name = entry.channel;
      const rest = line.slice(name.length);
      // Some products have two listings on the same marketplace with the same search link, so the position is part of the key.
      return <li key={`${entry.channel}-${entry.priceNGN}-${index}`}>
        <a href={entry.url} target="_blank" rel="noopener noreferrer">{name}</a>{rest} <span className="reco-where__price">{naira(entry.priceNGN)}, {entry.label}, checked {shortDate(entry.checkedOn)}</span>
      </li>;
    })}
  </ul>;
}

function PickRow({ category, product, alternatives, state }: { category: Category; product: Product; alternatives: Product[]; state: string }) {
  const cheapest = lowestEntry(product);
  return <li className="reco-row">
    <div className="reco-row__head">
      <Chip tone="brand">{categoryLabel[category]}</Chip>
      <h4>{product.brand} {product.name} <span className="reco-row__size">{product.size}</span></h4>
    </div>
    <p className="reco-row__price"><strong>{priceText(product)}</strong><small>{cheapest.label}, checked {shortDate(cheapest.checkedOn)}</small></p>
    <p>{product.why}</p>
    <div className="reco-row__chips">
      {product.cautions.map(caution => <span key={caution} className="reco-caution">{caution}</span>)}
      <Link className="reco-caution reco-caution--link" href="/test-and-watch">Patch test it in Test &amp; Watch before daily use</Link>
    </div>
    <p className="reco-row__label"><strong>Where to find it</strong></p>
    <WhereToFind product={product} state={state}/>
    {alternatives.length > 0 && <details className="reco-alternatives">
      <summary>Other options</summary>
      <ul>{alternatives.map(option => <li key={option.id}>
        <strong>{option.brand} {option.name}</strong>, {option.size}, {priceText(option)}
        {option.cautions.map(caution => <span key={caution} className="reco-caution">{caution}</span>)}
      </li>)}</ul>
    </details>}
  </li>;
}

export function RecommendedProducts({ skin, concern, budget, state }: { skin: string; concern: string; budget: string; state: string }) {
  const result: Recommendation = useMemo(() => recommend({ skin: skin as SkinType, concern: concern as ConcernName, budget }), [skin, concern, budget]);
  const { cap, startWith, startTotalHigh, startTotalLow, addWhenYouCan, missing, sunscreenDeferred } = result;
  const sunscreenLater = addWhenYouCan.find(item => item.category === "sunscreen");
  const darkSpots = concern === "Dark Spots" || concern === "Both";

  return <article className="card routine-plan-card routine-plan-card--wide reco-card" aria-labelledby="reco-title">
    <h2 id="reco-title">Products that fit your plan</h2>
    <p className="reco-location">
      {state ? <>Where to buy lines use your state: {state}. <Link href="/profile#state">Change</Link></> : <>Add your state to see delivery notes. <Link href="/profile#state">Add it</Link></>}
    </p>
    <p>Based on your skin type, concern and budget. These are suggestions to start your patch test. They are not medical advice.</p>

    {startWith.length > 0 && <>
      <h3>Start with</h3>
      <ol className="reco-list">{startWith.map(pick => <PickRow key={pick.category} category={pick.category} product={pick.chosen} alternatives={pick.alternatives} state={state}/>)}</ol>
      <p className="reco-total">
        <strong>Most you should pay, at the highest prices we found: {naira(startTotalHigh)}</strong>
        {cap !== Infinity && <> · Your budget: up to {naira(cap)}</>}
        <br/><small>{startTotalLow < startTotalHigh ? `If you find the cheapest seller for each product, about ${naira(startTotalLow)}. ` : ""}You do not have to spend all of it.</small>
      </p>
    </>}

    {addWhenYouCan.length > 0 && <>
      <h3>Add when you can</h3>
      <ul className="reco-later">{addWhenYouCan.map(item => <li key={item.category}><strong>{categoryLabel[item.category]}</strong> from {naira(low(item.cheapest))}{high(item.cheapest) > low(item.cheapest) && <> (up to {naira(high(item.cheapest))} at some sellers)</>}</li>)}</ul>
    </>}

    {sunscreenDeferred && sunscreenLater && <Callout tone={darkSpots ? "warning" : "info"} title="Sunscreen is your next step">
      {darkSpots
        ? <>Sun makes dark marks darker and slower to fade, so sunscreen is the most useful product to add next. The one we found costs {priceText(sunscreenLater.cheapest)}, and we could not fit it into your budget with the other products. Until you can buy it, stay in the shade and wear a cap or use an umbrella. Do not use bleaching creams or home mixes to fill the gap.</>
        : <>Sunscreen matters for everyone, and acne marks darken in the sun. It is also the dearest product on our list ({priceText(sunscreenLater.cheapest)}), so we put the basics first so your budget holds at the shop. Save for it next. Until then, stay in the shade and wear a cap or use an umbrella.</>}
    </Callout>}

    {missing.length > 0 && <ul className="reco-missing">{missing.map(category => <li key={category}>We do not have a checked {categoryLabel[category].toLowerCase()} for this skin type yet.</li>)}</ul>}

    <p className="reco-footer"><small>Prices were collected from the stores listed on {PRICES_COLLECTED}. They change often and differ by seller, so compare before you buy. Buy from the brand&apos;s official store or a pharmacy you trust, and check the NAFDAC registration (see <Link href="/learn">How to spot fake products in Learn</Link>). SkinSabi is for education and does not replace a doctor.</small></p>
  </article>;
}
