import { products, type Category, type ConcernName, type Product, type SkinType } from "./recommended-products";

export const ORDER: Category[] = ["sunscreen", "cleanser", "moisturiser"]; // buy in this order

export const low = (p: Product) => Math.min(...p.prices.map(x => x.priceNGN));
export const high = (p: Product) => Math.max(...p.prices.map(x => x.priceNGN));

/** Spend limit for the budget option on the page. Match by text so the exact option strings stay untouched. */
export function budgetCap(budget: string): number {
  if (budget.startsWith("Under")) return 15000;
  if (budget.includes("30k+")) return Infinity;
  return 30000;
}

export function eligible(p: Product, skin: SkinType, concern: ConcernName): boolean {
  const gentle = skin === "Sensitive" || skin === "I don't know";
  return p.skins.includes(skin) && !p.avoidConcerns.includes(concern) && !(gentle && p.fragrance === "contains");
}

const rankFor = (p: Product, skin: SkinType) => p.rank[skin] ?? 9;

export type Pick = { category: Category; chosen: Product; alternatives: Product[] };
export type Deferred = { category: Category; cheapest: Product; best: Product };
export type Recommendation = {
  cap: number;
  startWith: Pick[];
  startTotal: number;
  addWhenYouCan: Deferred[];
  cheapestFullSet: number;      // sum of the cheapest eligible product in every category
  shortfall: number;            // how far the cheapest full set is above the cap (0 if it fits)
  missing: Category[];          // categories with no eligible product on the list
  sunscreenAboveBudget: boolean;
};

export function recommend(input: { skin: SkinType; concern: ConcernName; budget: string }): Recommendation {
  const { skin, concern } = input;
  const cap = budgetCap(input.budget);
  const lists = ORDER.map(category => ({
    category,
    list: products.filter(p => p.category === category && eligible(p, skin, concern))
      .sort((a, b) => rankFor(a, skin) - rankFor(b, skin) || low(a) - low(b))
  }));
  const cheapestOf = (list: Product[]) => list.reduce((m, p) => (low(p) < low(m) ? p : m));
  const missing = lists.filter(x => x.list.length === 0).map(x => x.category);
  const present = lists.filter(x => x.list.length > 0);
  const cheapestFullSet = present.reduce((s, x) => s + low(cheapestOf(x.list)), 0);

  // 1. Include categories in buying order while the cheapest options still fit. Stop at the first that does not.
  const included: typeof present = [];
  const deferredLists: typeof present = [];
  let used = 0, stopped = false;
  for (const x of present) {
    const c = low(cheapestOf(x.list));
    if (!stopped && used + c <= cap) { included.push(x); used += c; } else { stopped = true; deferredLists.push(x); }
  }

  // 2. Start from the cheapest pick in each included category, then upgrade to the best-ranked one the leftover allows.
  let leftover = cap === Infinity ? Infinity : cap - used;
  const startWith: Pick[] = included.map(x => {
    let chosen = cheapestOf(x.list);
    for (const cand of x.list) {
      const extra = low(cand) - low(chosen);
      if (extra <= leftover) { leftover -= Math.max(extra, 0); chosen = cand; break; }
    }
    return { category: x.category, chosen, alternatives: x.list.filter(p => p.id !== chosen.id).slice(0, 2) };
  });
  const startTotal = startWith.reduce((s, p) => s + low(p.chosen), 0);

  const addWhenYouCan: Deferred[] = deferredLists.map(x => ({ category: x.category, cheapest: cheapestOf(x.list), best: x.list[0] }));
  const sunscreenList = lists[0].list;
  const sunscreenAboveBudget = sunscreenList.length > 0 && low(cheapestOf(sunscreenList)) > cap;
  return { cap, startWith, startTotal, addWhenYouCan, cheapestFullSet, shortfall: Math.max(0, cheapestFullSet - cap), missing, sunscreenAboveBudget };
}
