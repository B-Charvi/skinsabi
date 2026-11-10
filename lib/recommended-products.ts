export type Category = "sunscreen" | "cleanser" | "moisturiser";
export type SkinType = "I don't know" | "Oily" | "Dry" | "Combination" | "Sensitive";
export type ConcernName = "Acne" | "Dark Spots" | "Both" | "Something else";
export type Fragrance = "free_claim" | "none_listed" | "contains";

export type PriceEntry = {
  channel: string;
  kind: "marketplace" | "online-pharmacy" | "store";
  priceNGN: number;
  label: "listed price" | "last known price" | "old price";
  checkedOn: string; // YYYY-MM-DD
  url: string;
  region?: string; // set when the seller is based in one state
};

export type Product = {
  id: string;
  category: Category;
  brand: string;
  name: string;
  size: string;
  skins: SkinType[];                       // skin types it is offered to
  avoidConcerns: ConcernName[];            // never offered when the user's concern is one of these
  fragrance: Fragrance;                    // "contains" products are never offered to Sensitive or "I don't know"
  rank: Partial<Record<SkinType, number>>; // 1 = best fit for that skin type
  why: string;
  cautions: string[];
  prices: PriceEntry[];
};

const J = (q: string) => `https://www.jumia.com.ng/catalog/?q=${encodeURIComponent(q)}`;

export const PRICES_COLLECTED = "29 and 30 October 2026";

export const products: Product[] = [
  {
    id: "nivea-sun-uv-face-shine-control-50",
    category: "sunscreen", brand: "NIVEA", name: "Sun UV Face Shine Control Cream SPF 50", size: "50 ml",
    skins: ["Oily", "Combination"], avoidConcerns: ["Acne", "Both"], fragrance: "contains",
    rank: { "Oily": 1, "Combination": 1 },
    why: "Broad-spectrum SPF 50 with a light finish made for oily skin.",
    cautions: ["Contains fragrance and fragrance allergens. Skip it if your skin is sensitive."],
    prices: [{ channel: "Jumia", kind: "marketplace", priceNGN: 7680, label: "listed price", checkedOn: "2026-10-29", url: J("nivea sun face shine control spf 50") }]
  },
  {
    id: "cerave-hydrating-mineral-sunscreen-spf50-75",
    category: "sunscreen", brand: "CeraVe", name: "Hydrating Mineral Sunscreen Face Lotion SPF 50", size: "75 ml",
    skins: ["Oily", "Dry", "Combination", "Sensitive", "I don't know"], avoidConcerns: [], fragrance: "free_claim",
    rank: { "Dry": 1, "Sensitive": 1, "I don't know": 1, "Oily": 2, "Combination": 2 },
    why: "Mineral (zinc oxide and titanium dioxide) broad-spectrum SPF 50. The brand says it is fragrance-free, oil-free and non-comedogenic.",
    cautions: ["The brand warns it can leave a white cast on medium to dark skin. Test it on your jaw first.", "Prices differ a lot between sellers. Compare before you buy."],
    prices: [
      { channel: "Jumia", kind: "marketplace", priceNGN: 10000, label: "listed price", checkedOn: "2026-10-29", url: J("cerave hydrating mineral sunscreen spf 50 face lotion 75ml") },
      { channel: "GoMed", kind: "online-pharmacy", priceNGN: 25000, label: "last known price", checkedOn: "2026-10-30", url: "https://wellness.gomed.ng/product/cerave-hydrating-sunscreen-spf-50-face-lotion-75ml" }
    ]
  },
  {
    id: "simple-moisturising-facial-wash-150",
    category: "cleanser", brand: "Simple", name: "Kind to Skin Moisturising Facial Wash", size: "150 ml",
    skins: ["Oily", "Dry", "Combination", "Sensitive", "I don't know"], avoidConcerns: [], fragrance: "none_listed",
    rank: { "Sensitive": 1, "I don't know": 1, "Oily": 2, "Combination": 2, "Dry": 2 },
    why: "A soap-free facial wash. The brand says it has no artificial perfume, is non-comedogenic and suits sensitive skin.",
    cautions: ["Formulas can differ by country. Check the pack's ingredient list for \"parfum\"."],
    prices: [
      { channel: "GoMed", kind: "online-pharmacy", priceNGN: 7000, label: "last known price", checkedOn: "2026-10-30", url: "https://gomed.ng/product/simple-moisturizing-facial-wash-150ml" },
      { channel: "GoMed", kind: "online-pharmacy", priceNGN: 6000, label: "last known price", checkedOn: "2026-10-30", url: "https://gomed.ng/brand/simple" }
    ]
  },
  {
    id: "cerave-foaming-facial-cleanser-236",
    category: "cleanser", brand: "CeraVe", name: "Foaming Facial Cleanser", size: "236 ml",
    skins: ["Oily", "Combination"], avoidConcerns: [], fragrance: "none_listed",
    rank: { "Oily": 1, "Combination": 1 },
    why: "A foaming gel cleanser for normal to oily skin, with ceramides and niacinamide.",
    cautions: ["Formulas can differ by country. Check the pack's ingredient list for \"parfum\"."],
    prices: [{ channel: "Nectar Beauty Hub", kind: "store", priceNGN: 14500, label: "listed price", checkedOn: "2026-10-29", url: "https://nectarbeautyhub.com/collections/cerave-cleansers", region: "Lagos" }]
  },
  {
    id: "cerave-hydrating-facial-cleanser-236",
    category: "cleanser", brand: "CeraVe", name: "Hydrating Facial Cleanser", size: "236 ml",
    skins: ["Dry", "Combination", "Sensitive", "I don't know"], avoidConcerns: [], fragrance: "none_listed",
    rank: { "Dry": 1, "Sensitive": 2, "I don't know": 2, "Combination": 4 },
    why: "A creamy, non-foaming cleanser for normal to dry skin, with ceramides and hyaluronic acid.",
    cautions: ["Formulas can differ by country. Check the pack's ingredient list for \"parfum\"."],
    prices: [{ channel: "Nectar Beauty Hub", kind: "store", priceNGN: 13600, label: "listed price", checkedOn: "2026-10-29", url: "https://nectarbeautyhub.com/collections/cerave-cleansers", region: "Lagos" }]
  },
  {
    id: "dove-beauty-bar",
    category: "cleanser", brand: "Dove", name: "Beauty Bar (cream bar)", size: "1 bar",
    skins: ["Oily", "Dry", "Combination"], avoidConcerns: ["Acne", "Both"], fragrance: "contains",
    rank: { "Oily": 3, "Combination": 3, "Dry": 3 },
    why: "A low-cost mild beauty bar. A budget swap for a facial wash when a wash is out of reach.",
    cautions: ["Fragranced. Not for sensitive skin.", "Bar soap can be harsher than a gentle wash, so we do not suggest it when acne is your concern.", "The prices we found were old (2023) and varied by pack size. Check the current price."],
    prices: [
      { channel: "Jumia", kind: "marketplace", priceNGN: 1500, label: "old price", checkedOn: "2026-10-30", url: J("dove beauty cream bar soap") },
      { channel: "Jumia", kind: "marketplace", priceNGN: 5000, label: "old price", checkedOn: "2026-10-30", url: J("dove beauty cream bar soap") }
    ]
  },
  {
    id: "cetaphil-moisturizing-lotion-59",
    category: "moisturiser", brand: "Cetaphil", name: "Moisturizing Lotion for Face & Body", size: "59 ml",
    skins: ["Oily", "Dry", "Combination", "Sensitive", "I don't know"], avoidConcerns: [], fragrance: "free_claim",
    rank: { "Dry": 1, "Oily": 2, "Combination": 2, "Sensitive": 2, "I don't know": 2 },
    why: "A light, fragrance-free lotion. The brand says it is non-comedogenic and hypoallergenic.",
    cautions: ["The listing showed a sale price. Sale prices change.", "A lotion is light. Very dry skin may need more."],
    prices: [
      { channel: "Jumia", kind: "marketplace", priceNGN: 7125, label: "listed price", checkedOn: "2026-10-29", url: J("cetaphil moisturizing lotion 59ml") },
      { channel: "Jumia", kind: "marketplace", priceNGN: 7600, label: "listed price", checkedOn: "2026-10-29", url: J("cetaphil moisturizing lotion 59ml") }
    ]
  },
  {
    id: "simple-hydrating-light-moisturiser-125",
    category: "moisturiser", brand: "Simple", name: "Kind to Skin Hydrating Light Moisturiser", size: "125 ml",
    skins: ["Oily", "Combination", "Sensitive", "I don't know"], avoidConcerns: [], fragrance: "none_listed",
    rank: { "Oily": 1, "Combination": 1, "Sensitive": 1, "I don't know": 1 },
    why: "A lightweight moisturiser with no added perfume. The brand says it is non-comedogenic and suits sensitive skin.",
    cautions: ["Contains mineral oil, so it is not oil-free."],
    prices: [{ channel: "GoMed", kind: "online-pharmacy", priceNGN: 9000, label: "last known price", checkedOn: "2026-10-30", url: "https://gomed.ng/product/simple-hydrating-light-moisturiser-125ml" }]
  },
  {
    id: "vaseline-original-jelly-50",
    category: "moisturiser", brand: "Vaseline", name: "Original Petroleum Jelly", size: "50 ml",
    skins: ["Dry"], avoidConcerns: ["Acne", "Both"], fragrance: "none_listed",
    rank: { "Dry": 2 },
    why: "A sealant, not a lotion. A thin layer over damp skin locks in water on very dry areas.",
    cautions: ["Not for oily or acne-prone skin.", "The price was marked \"last known\" and looks low. Check the current price."],
    prices: [{ channel: "GoMed", kind: "online-pharmacy", priceNGN: 300, label: "last known price", checkedOn: "2026-10-30", url: "https://gomed.ng/p/9164-vaseline-jellyoriginal-50ml" }]
  }
];
