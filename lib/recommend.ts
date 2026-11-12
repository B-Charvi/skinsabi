import { GENTLE_CONCERNS } from "./concerns";
import { products, type Category, type ConcernName, type Product, type SkinType } from "./recommended-products";

/** Prices from sellers that had the product in stock when we checked. */
export const inStock = (p: Product) => p.prices.filter(x => !x.soldOut);
export const buyable = (p: Product) => inStock(p).length > 0;
export const low = (p: Product) => Math.min(...inStock(p).map(x => x.priceNGN));
export const high = (p: Product) => Math.max(...inStock(p).map(x => x.priceNGN));

/**
 * The price used for budget maths: the HIGHEST price we found for the product.
 * Prices differ a lot between sellers (one sunscreen was 10,000 on one site and 25,000 on another), and some are old.
 * Planning with the highest means a product in "Start with" can still be bought inside the budget if the person
 * lands on the dearer seller, so nobody walks into a shop expecting 15,000 and meets a bigger bill.
 */
export const planPrice = high;

/** Spend limit for the budget option on the page. Match by text so the exact option strings stay untouched. */
export function budgetCap(budget: string): number {
  if (budget.startsWith("Under")) return 15000;
  if (budget.includes("30k+")) return Infinity;
  return 30000;
}

/**
 * The order we try to fit the categories into the budget.
 *
 * Dark spots and dull or uneven tone: sunscreen first, because sun makes marks darker and slower to fade.
 * Sunburn or tan marks: moisturiser first, because burnt skin needs comfort first and should stay out of the sun anyway,
 * then sunscreen for when it has healed.
 * Acne and dark spots together: a wash first for the acne, then sunscreen to protect the marks, then moisturiser.
 * Acne, dry skin, healthy skin or anything else: a gentle wash and a light moisturiser first, then sunscreen. Sunscreen
 * is still advised for everyone, but it is the dearest product on the list and should not swallow a small budget.
 * Dry skin puts the moisturiser first, because moisture is the whole job.
 *
 * A treatment (niacinamide, azelaic acid, benzoyl peroxide) is only in the order for concerns that have a reason for
 * one: acne, dark spots, both, sunburn marks and dull tone. For dry skin, healthy skin or "something else" we never
 * suggest one: an active ingredient needs a reason, and healthy skin does not need extras.
 * Marks and tone: treatment before the moisturiser, because that is the product the person asked about.
 * Acne: moisturiser first, because benzoyl peroxide dries the skin and a moisturiser keeps it comfortable.
 */
export function orderFor(concern: ConcernName): Category[] {
  switch (concern) {
    case "Dark Spots": return ["sunscreen", "cleanser", "treatment", "moisturiser"];
    case "Dull or uneven tone": return ["sunscreen", "cleanser", "treatment", "moisturiser"];
    case "Sunburn or tan marks": return ["moisturiser", "sunscreen", "cleanser", "treatment"];
    case "Both": return ["cleanser", "sunscreen", "treatment", "moisturiser"];
    case "Acne": return ["cleanser", "moisturiser", "treatment", "sunscreen"];
    case "Dry, flaky or tight skin": return ["moisturiser", "cleanser", "sunscreen"];
    default: return ["cleanser", "moisturiser", "sunscreen"];
  }
}

export function eligible(p: Product, skin: SkinType, concern: ConcernName): boolean {
  // Sensitive or unknown skin, burnt skin and very dry skin all leave out fragranced products.
  const gentle = skin === "Sensitive" || skin === "I don't know" || GENTLE_CONCERNS.includes(concern);
  return buyable(p) && p.skins.includes(skin) && !p.avoidConcerns.includes(concern) && !(gentle && p.fragrance === "contains");
}

/** Treatments are ranked by concern first (their concernRank), then by skin type. Other products only have the skin rank. */
const rankFor = (p: Product, skin: SkinType, concern: ConcernName) => (p.concernRank?.[concern] ?? 0) * 100 + (p.rank[skin] ?? 9);

export type Pick = { category: Category; chosen: Product; alternatives: Product[] };
export type Deferred = { category: Category; cheapest: Product; best: Product };
export type Recommendation = {
  cap: number;
  startWith: Pick[];
  startTotalHigh: number;       // what the picks cost at the highest prices we found. Never above the cap.
  startTotalLow: number;        // what they cost if you find the cheapest seller for each
  addWhenYouCan: Deferred[];
  missing: Category[];          // categories with no eligible product on the list
  sunscreenDeferred: boolean;   // sunscreen is not in "Start with" (it did not fit, or there is none yet)
};

export function recommend(input: { skin: SkinType; concern: ConcernName; budget: string }): Recommendation {
  const { skin, concern } = input;
  const cap = budgetCap(input.budget);
  const lists = orderFor(concern).map(category => ({
    category,
    list: products.filter(p => p.category === category && eligible(p, skin, concern))
      .sort((a, b) => rankFor(a, skin, concern) - rankFor(b, skin, concern) || planPrice(a) - planPrice(b))
  }));
  const cheapestOf = (list: Product[]) => list.reduce((m, p) => (planPrice(p) < planPrice(m) ? p : m));
  const missing = lists.filter(x => x.list.length === 0).map(x => x.category);
  const present = lists.filter(x => x.list.length > 0);

  // 1. Go through the categories in order. Keep each one whose cheapest option still fits; set the rest aside for later.
  const included: typeof present = [];
  const deferredLists: typeof present = [];
  let used = 0;
  for (const x of present) {
    const c = planPrice(cheapestOf(x.list));
    if (used + c <= cap) { included.push(x); used += c; } else deferredLists.push(x);
  }

  // 2. Start from the cheapest pick in each kept category, then upgrade to the best-ranked one the leftover allows.
  //    The treatment is upgraded first: the difference between treatments matters most (for acne, benzoyl peroxide
  //    comes before niacinamide), while the basics are fine at their cheapest.
  let leftover = cap === Infinity ? Infinity : cap - used;
  const chosenBy = new Map<Category, Product>();
  const upgradeOrder = [...included].sort((a, b) => Number(b.category === "treatment") - Number(a.category === "treatment"));
  for (const x of upgradeOrder) {
    let chosen = cheapestOf(x.list);
    for (const cand of x.list) {
      const extra = planPrice(cand) - planPrice(chosen);
      if (extra <= leftover) { leftover -= Math.max(extra, 0); chosen = cand; break; }
    }
    chosenBy.set(x.category, chosen);
  }
  const startWith: Pick[] = included.map(x => {
    const chosen = chosenBy.get(x.category)!;
    return { category: x.category, chosen, alternatives: x.list.filter(p => p.id !== chosen.id).slice(0, 2) };
  });
  const startTotalHigh = startWith.reduce((s, p) => s + planPrice(p.chosen), 0);
  const startTotalLow = startWith.reduce((s, p) => s + low(p.chosen), 0);

  const addWhenYouCan: Deferred[] = deferredLists.map(x => ({ category: x.category, cheapest: cheapestOf(x.list), best: x.list[0] }));
  const sunscreenDeferred = !startWith.some(p => p.category === "sunscreen");
  return { cap, startWith, startTotalHigh, startTotalLow, addWhenYouCan, missing, sunscreenDeferred };
}
