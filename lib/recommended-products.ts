export type Category = "sunscreen" | "cleanser" | "moisturiser" | "treatment";
/** The active ingredient of a treatment product. Each one has its own how-to-start and warning lines in treatment-safety.ts. */
export type ActiveKind = "niacinamide" | "azelaic acid" | "benzoyl peroxide";
export type SkinType = "I don't know" | "Oily" | "Dry" | "Combination" | "Sensitive";
import { allConcernsExcept, type ConcernName } from "./concerns";
export type { ConcernName };
export type Fragrance = "free_claim" | "none_listed" | "contains";

export type PriceEntry = {
  channel: string;
  kind: "marketplace" | "online-pharmacy" | "store";
  priceNGN: number;
  label: "listed price" | "last known price" | "old price";
  checkedOn: string; // YYYY-MM-DD
  url: string;
  region?: string; // set when the seller is based in one state
  soldOut?: boolean; // the seller's page showed it as sold out on checkedOn. Not counted in prices; a product with nothing in stock is not recommended.
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
  concernRank?: Partial<Record<ConcernName, number>>; // treatments only: 1 = best fit for that concern. Counts before the skin rank.
  active?: ActiveKind;                     // treatments only
  strength?: string;                       // treatments only, as the seller states it, e.g. "5% niacinamide"
  why: string;
  cautions: string[];
  prices: PriceEntry[];
};

const J = (q: string) => `https://www.jumia.com.ng/catalog/?q=${encodeURIComponent(q)}`;

export const PRICES_COLLECTED = "29 October to 12 November 2026";

export const products: Product[] = [
  {
    id: "nivea-sun-uv-face-shine-control-50",
    category: "sunscreen", brand: "NIVEA", name: "Sun UV Face Shine Control Cream SPF 50", size: "50 ml",
    skins: ["Oily", "Combination"], avoidConcerns: ["Acne", "Both"], fragrance: "contains",
    rank: { "Oily": 1, "Combination": 1 },
    why: "Broad-spectrum SPF 50 with a light finish made for oily skin.",
    cautions: ["Contains fragrance and fragrance allergens. Skip it if your skin is sensitive."],
    prices: [
      { channel: "Jumia", kind: "marketplace", priceNGN: 6500, label: "listed price", checkedOn: "2026-11-10", url: J("nivea sun face shine control spf 50") },
      { channel: "Jumia", kind: "marketplace", priceNGN: 7680, label: "listed price", checkedOn: "2026-10-29", url: J("nivea sun face shine control spf 50") }
    ]
  },
  {
    id: "cerave-hydrating-mineral-sunscreen-spf50-75",
    category: "sunscreen", brand: "CeraVe", name: "Hydrating Mineral Sunscreen Face Lotion SPF 50", size: "75 ml",
    skins: ["Oily", "Dry", "Combination", "Sensitive", "I don't know"], avoidConcerns: [], fragrance: "free_claim",
    rank: { "Dry": 1, "Sensitive": 1, "I don't know": 1, "Oily": 2, "Combination": 2 },
    why: "Mineral (zinc oxide and titanium dioxide) broad-spectrum SPF 50. The brand says it is fragrance-free, oil-free and non-comedogenic.",
    cautions: ["The brand warns it can leave a white cast on medium to dark skin. Test it on your jaw first.", "Prices differ a lot between sellers (one pharmacy says ₦22,000 to ₦35,000). Compare before you buy."],
    prices: [
      { channel: "Jumia", kind: "marketplace", priceNGN: 10000, label: "listed price", checkedOn: "2026-10-29", url: J("cerave hydrating mineral sunscreen spf 50 face lotion 75ml") },
      { channel: "GoMed", kind: "online-pharmacy", priceNGN: 28000, label: "last known price", checkedOn: "2026-11-10", url: "https://gomed.ng/product/cerave-hydrating-mineral-sunscreen-spf-50" }
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
      { channel: "GoMed", kind: "online-pharmacy", priceNGN: 7000, label: "last known price", checkedOn: "2026-11-10", url: "https://gomed.ng/product/simple-moisturizing-facial-wash-150ml" },
      { channel: "GoMed", kind: "online-pharmacy", priceNGN: 6000, label: "last known price", checkedOn: "2026-11-10", url: "https://gomed.ng/brand/simple" }
    ]
  },
  {
    id: "cerave-foaming-facial-cleanser-236",
    category: "cleanser", brand: "CeraVe", name: "Foaming Facial Cleanser", size: "236 ml",
    skins: ["Oily", "Combination"], avoidConcerns: ["Dry, flaky or tight skin"], fragrance: "none_listed",
    rank: { "Oily": 1, "Combination": 1 },
    why: "A foaming gel cleanser for normal to oily skin, with ceramides and niacinamide.",
    cautions: ["Formulas can differ by country. Check the pack's ingredient list for \"parfum\"."],
    prices: [{ channel: "Nectar Beauty Hub", kind: "store", priceNGN: 14500, label: "listed price", checkedOn: "2026-11-10", url: "https://nectarbeautyhub.com/collections/face-wash-cleansers", region: "Lagos", soldOut: true }]
  },
  {
    id: "cerave-hydrating-facial-cleanser-236",
    category: "cleanser", brand: "CeraVe", name: "Hydrating Facial Cleanser", size: "236 ml",
    skins: ["Dry", "Combination", "Sensitive", "I don't know"], avoidConcerns: [], fragrance: "none_listed",
    rank: { "Dry": 1, "Sensitive": 2, "I don't know": 2, "Combination": 4 },
    why: "A creamy, non-foaming cleanser for normal to dry skin, with ceramides and hyaluronic acid.",
    cautions: ["Formulas can differ by country. Check the pack's ingredient list for \"parfum\"."],
    prices: [{ channel: "Nectar Beauty Hub", kind: "store", priceNGN: 13600, label: "listed price", checkedOn: "2026-11-10", url: "https://nectarbeautyhub.com/collections/face-wash-cleansers", region: "Lagos" }]
  },
  {
    id: "dove-beauty-bar",
    category: "cleanser", brand: "Dove", name: "Beauty Bar (cream bar)", size: "90 g bar",
    skins: ["Oily", "Dry", "Combination"], avoidConcerns: ["Acne", "Both", "Sunburn or tan marks", "Dry, flaky or tight skin"], fragrance: "contains",
    rank: { "Oily": 3, "Combination": 3, "Dry": 3 },
    why: "A mild beauty bar. It is only an option when a facial wash is out of reach, and only worth it if you can buy a single bar.",
    cautions: ["Fragranced. Not for sensitive skin.", "Bar soap can be harsher than a gentle wash, so we do not suggest it when acne is your concern.", "Online it is sold in packs of 4 (about ₦9,000 to ₦10,800 on Jumia). A single bar was ₦1,600 at a pharmacy, but that is its last known price."],
    prices: [
      { channel: "Jumia", kind: "marketplace", priceNGN: 9500, label: "listed price", checkedOn: "2026-11-12", url: "https://www.jumia.com.ng/slp/dove-beauty-cream-bar-soap" },
      { channel: "GoMed", kind: "online-pharmacy", priceNGN: 1600, label: "last known price", checkedOn: "2026-11-12", url: "https://gomed.ng/p/16302-dove-beauty-cream-bar" }
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
      { channel: "Jumia", kind: "marketplace", priceNGN: 7600, label: "listed price", checkedOn: "2026-10-29", url: J("cetaphil moisturizing lotion 59ml") },
      { channel: "GoMed", kind: "online-pharmacy", priceNGN: 4500, label: "last known price", checkedOn: "2026-11-10", url: "https://gomed.ng/p/20023-cetaphil-moisturizing-lotion-59ml" }
    ]
  },
  {
    id: "simple-hydrating-light-moisturiser-125",
    category: "moisturiser", brand: "Simple", name: "Kind to Skin Hydrating Light Moisturiser", size: "125 ml",
    skins: ["Oily", "Combination", "Sensitive", "I don't know"], avoidConcerns: [], fragrance: "none_listed",
    rank: { "Oily": 1, "Combination": 1, "Sensitive": 1, "I don't know": 1 },
    why: "A lightweight moisturiser with no added perfume. The brand says it is non-comedogenic and suits sensitive skin.",
    cautions: ["Contains mineral oil, so it is not oil-free."],
    prices: [{ channel: "GoMed", kind: "online-pharmacy", priceNGN: 9000, label: "last known price", checkedOn: "2026-11-10", url: "https://gomed.ng/product/simple-hydrating-light-moisturiser-125ml" }]
  },
  {
    id: "vaseline-original-jelly-50",
    category: "moisturiser", brand: "Vaseline", name: "Original Petroleum Jelly", size: "50 ml",
    skins: ["Dry"], avoidConcerns: ["Acne", "Both", "Sunburn or tan marks"], fragrance: "none_listed",
    rank: { "Dry": 2 },
    why: "A sealant, not a lotion. A thin layer over damp skin locks in water on very dry areas.",
    cautions: ["Not for oily or acne-prone skin.", "The price was marked \"last known\" and looks low. Check the current price."],
    prices: [
      { channel: "GoMed", kind: "online-pharmacy", priceNGN: 300, label: "last known price", checkedOn: "2026-10-30", url: "https://gomed.ng/p/9164-vaseline-jellyoriginal-50ml" },
      { channel: "Jumia", kind: "marketplace", priceNGN: 535, label: "listed price", checkedOn: "2026-11-10", url: J("vaseline original petroleum jelly 50ml") }
    ]
  },
  {
    id: "neutrogena-clear-face-oil-free-spf50",
    category: "sunscreen", brand: "Neutrogena", name: "Clear Face Oil-Free Liquid-Lotion Sunscreen", size: "size not listed",
    skins: ["Oily", "Combination", "Dry", "I don't know"], avoidConcerns: [], fragrance: "free_claim",
    rank: { "Oily": 1, "Combination": 1, "I don't know": 2, "Dry": 3 },
    why: "Made for acne-prone skin. The seller's page calls it oil-free, non-comedogenic and fragrance-free. It is the most affordable acne-safe sunscreen from a known brand that we could confirm.",
    cautions: ["These claims come from the seller's page. Check the pack's ingredient list for fragrance.", "The seller lists SPF 50. Versions differ by country (SPF 30, 50 or 55), so read the SPF printed on your pack."],
    prices: [{ channel: "GoMed", kind: "online-pharmacy", priceNGN: 12800, label: "last known price", checkedOn: "2026-11-10", url: "https://gomed.ng/p/3741-neutrogena-clear-face-oil-free" }]
  },
  {
    id: "nivea-uv-super-water-gel-spf50",
    category: "sunscreen", brand: "NIVEA", name: "UV Super Water Gel SPF 50", size: "size not listed",
    skins: ["Oily", "Combination", "Sensitive", "I don't know"], avoidConcerns: [], fragrance: "free_claim",
    rank: { "Oily": 2, "Combination": 2, "Sensitive": 2, "I don't know": 2 },
    why: "A light water gel. The seller's page says it is fragrance-free and alcohol-free and suits oily, combination and sensitive skin.",
    cautions: ["The claims come from the seller's page, not the brand. Check the pack's ingredient list."],
    prices: [{ channel: "GoMed", kind: "online-pharmacy", priceNGN: 22500, label: "last known price", checkedOn: "2026-11-10", url: "https://gomed.ng/product/nivea-uv-super-water-gel-spf-50" }]
  },
  {
    id: "la-roche-posay-anthelios-uvmune-400-oil-control-50",
    category: "sunscreen", brand: "La Roche-Posay", name: "Anthelios UVMune 400 Oil Control Fluid SPF 50+", size: "50 ml",
    skins: ["Oily", "Combination"], avoidConcerns: [], fragrance: "contains",
    rank: { "Oily": 2, "Combination": 2 },
    why: "A mattifying fluid for oily and blemish-prone skin. The seller says it leaves no white cast and is non-comedogenic.",
    cautions: ["Contains fragrance (Parfum is in the ingredient list on one seller's page). Skip it if your skin is sensitive.", "The dearest sunscreen for oily skin on our list. One pharmacy says it usually costs ₦35,000 to ₦48,000."],
    prices: [{ channel: "GoMed", kind: "online-pharmacy", priceNGN: 34500, label: "last known price", checkedOn: "2026-11-10", url: "https://gomed.ng/product/la-roche-posay-anthelios-uvmune-400-50-fluid-oil-control-50ml" }]
  },
  {
    id: "eucerin-sun-pigment-control-anti-dark-spot-50",
    category: "sunscreen", brand: "Eucerin", name: "Sun Pigment Control Anti Dark-Spot Facial Sun Fluid SPF 50+", size: "50 ml",
    skins: ["Oily", "Dry", "Combination"], avoidConcerns: ["Acne", "Both"], fragrance: "contains",
    rank: { "Dry": 2, "Oily": 3, "Combination": 3 },
    why: "Made for dark spots. The seller says it helps stop sun-induced dark marks from coming back.",
    cautions: ["Contains fragrance (Parfum is in the ingredient list).", "There is no non-comedogenic claim, so we do not suggest it when acne is your concern.", "The dearest sunscreen on our list."],
    prices: [{ channel: "Brandlistry", kind: "marketplace", priceNGN: 44180, label: "listed price", checkedOn: "2026-11-10", url: "https://www.brandlistry.ng/products/eucerin-sun-pigment-control-anti-dark-spot-facial-sun-fluid-spf50-50ml" }]
  },
  {
    id: "skin-by-zaron-sun-protection-day-cream-spf50-30",
    category: "sunscreen", brand: "Skin by Zaron", name: "Sun Protection Day Cream SPF 50", size: "30 g",
    skins: ["Oily", "Dry", "Combination"], avoidConcerns: ["Acne", "Both"], fragrance: "none_listed",
    rank: { "Dry": 3, "Oily": 4, "Combination": 4 },
    why: "A low-cost sunscreen cream. The seller says it is lightweight, non-greasy, leaves no white cast and suits all skin tones.",
    cautions: ["The seller's page has no full ingredient list and no non-comedogenic claim, so check the pack for fragrance. We do not suggest it when acne is your concern.", "The seller says it can rarely sting sensitive skin. Patch test first.", "We could not confirm independent SPF testing. Look for the NAFDAC number on the pack."],
    prices: [{ channel: "GoMed", kind: "online-pharmacy", priceNGN: 7900, label: "last known price", checkedOn: "2026-11-10", url: "https://gomed.ng/product/skin-by-zaron-sun-protection-day-cream-spf50-30g" }]
  },
  {
    id: "face-facts-ceramide-blemish-foaming-cleanser-400",
    category: "cleanser", brand: "Face Facts", name: "Ceramide Blemish Clarifying Foaming Cleanser", size: "400 ml",
    skins: ["Oily", "Combination"], avoidConcerns: allConcernsExcept("Acne", "Both"), fragrance: "free_claim",
    rank: { "Oily": 1, "Combination": 1 },
    why: "A gel-to-foam wash with 2% salicylic acid, five ceramides and niacinamide for blemish-prone and oily skin. The brand labels it fragrance-free.",
    cautions: ["Contains 2% salicylic acid, which can sting or dry the skin. Start with once a day.", "Not suggested for dry skin. We offer it only when acne is your concern."],
    prices: [
      { channel: "Nectar Beauty Hub", kind: "store", priceNGN: 6850, label: "listed price", checkedOn: "2026-11-10", url: "https://nectarbeautyhub.com/collections/face-wash-cleansers", region: "Lagos" },
      { channel: "GoMed", kind: "online-pharmacy", priceNGN: 10000, label: "last known price", checkedOn: "2026-11-10", url: "https://gomed.ng/product/facefacts-ceramide-blemish-clarifying-foaming-cleanser-400ml" }
    ]
  },
  {
    id: "cosrx-salicylic-acid-daily-gentle-cleanser-150",
    category: "cleanser", brand: "COSRX", name: "Salicylic Acid Daily Gentle Cleanser", size: "150 ml",
    skins: ["Oily", "Combination"], avoidConcerns: allConcernsExcept("Acne", "Both"), fragrance: "contains",
    rank: { "Oily": 3, "Combination": 3 },
    why: "A gel wash with 0.5% salicylic acid, a milder strength than many acne washes.",
    cautions: ["The brand says \"artificial fragrance free\", but \"Fragrance\" is in the ingredient list, so we treat it as fragranced. Skip it if your skin is sensitive."],
    prices: [{ channel: "Nectar Beauty Hub", kind: "store", priceNGN: 8000, label: "listed price", checkedOn: "2026-11-10", url: "https://nectarbeautyhub.com/collections/face-wash-cleansers", region: "Lagos" }]
  },
  {
    id: "simple-replenishing-rich-moisturiser-125",
    category: "moisturiser", brand: "Simple", name: "Kind to Skin Replenishing Rich Moisturiser", size: "125 ml",
    skins: ["Dry", "Sensitive", "I don't know"], avoidConcerns: [], fragrance: "free_claim",
    rank: { "Dry": 2, "Sensitive": 3, "I don't know": 3 },
    why: "A richer cream for dry skin. The brand says it has no perfume, no mineral oil and no alcohol, and lists niacinamide and panthenol.",
    cautions: ["Richer than a lotion. If your skin is oily or acne-prone, a lighter one suits you better.", "The brand calls it non-comedogenic but gives no test details."],
    prices: [{ channel: "Jumia", kind: "marketplace", priceNGN: 7600, label: "listed price", checkedOn: "2026-11-10", url: J("simple replenishing rich moisturiser 125ml") }]
  },
  {
    id: "neutrogena-hydro-boost-water-cream-50",
    category: "moisturiser", brand: "Neutrogena", name: "Hydro Boost Water Cream", size: "50 ml",
    skins: ["Dry", "Combination", "Oily"], avoidConcerns: [], fragrance: "none_listed",
    rank: { "Dry": 2, "Combination": 3, "Oily": 3 },
    why: "A light, oil-free gel-cream for dehydrated skin. The seller says it absorbs without clogging pores.",
    cautions: ["We could not confirm whether it is fragrance-free. Check the pack's ingredient list.", "Dearer than most moisturisers on our list."],
    prices: [{ channel: "GoMed", kind: "online-pharmacy", priceNGN: 20900, label: "last known price", checkedOn: "2026-11-10", url: "https://gomed.ng/product/neutrogena-hydro-boost-water-cream-50ml" }]
  },
  {
    id: "advanced-clinicals-5-niacinamide-serum-52",
    category: "treatment", brand: "Advanced Clinicals", name: "5% Niacinamide Serum", size: "52 ml",
    active: "niacinamide", strength: "5% niacinamide",
    skins: ["Oily", "Dry", "Combination", "Sensitive", "I don't know"], avoidConcerns: allConcernsExcept("Acne", "Dark Spots", "Both", "Sunburn or tan marks", "Dull or uneven tone"), fragrance: "none_listed",
    rank: { "Sensitive": 1, "I don't know": 1, "Dry": 1, "Oily": 2, "Combination": 2 },
    concernRank: { "Dark Spots": 1, "Both": 2, "Acne": 3, "Sunburn or tan marks": 1, "Dull or uneven tone": 1 },
    why: "Niacinamide is a form of vitamin B3. Studies suggest it can slowly fade dark marks and calm oil when it is used every day with sunscreen. 5% is the gentler end of what is sold, so it is the one we offer first to sensitive skin.",
    cautions: ["Some people flush or itch with niacinamide. Patch test first, and stop if it happens.", "The 5% claim comes from the seller. It is not lab-verified."],
    prices: [
      { channel: "Nectar Beauty Hub", kind: "store", priceNGN: 11910, label: "listed price", checkedOn: "2026-11-10", url: "https://nectarbeautyhub.com/products/advanced-clinicals-5-niacnimide-serum-1-75oz", region: "Lagos" },
      { channel: "GoMed", kind: "online-pharmacy", priceNGN: 13000, label: "last known price", checkedOn: "2026-11-10", url: "https://gomed.ng/product/advanced-clincal-5-niacinamide-serum-52ml" }
    ]
  },
  {
    id: "good-molecules-niacinamide-serum-30",
    category: "treatment", brand: "Good Molecules", name: "Niacinamide Serum", size: "30 ml",
    active: "niacinamide", strength: "10% niacinamide",
    skins: ["Oily", "Dry", "Combination"], avoidConcerns: allConcernsExcept("Acne", "Dark Spots", "Both", "Dull or uneven tone"), fragrance: "none_listed",
    rank: { "Oily": 1, "Combination": 1, "Dry": 2 },
    concernRank: { "Dark Spots": 2, "Both": 3, "Acne": 4, "Dull or uneven tone": 2 },
    why: "A 10% niacinamide serum. A stronger step than 5% for oily or combination skin that has already tolerated niacinamide.",
    cautions: ["10% is stronger. If your skin is sensitive, choose the 5% serum instead.", "Some people flush or itch with niacinamide. Patch test first, and stop if it happens."],
    prices: [{ channel: "Nectar Beauty Hub", kind: "store", priceNGN: 11400, label: "listed price", checkedOn: "2026-11-10", url: "https://nectarbeautyhub.com/products/niacinamide-serum", region: "Lagos" }]
  },
  {
    id: "nineless-b-boost-10-niacinamide-serum-30",
    category: "treatment", brand: "Nineless", name: "B-Boost 10% Niacinamide Serum", size: "30 ml",
    active: "niacinamide", strength: "10% niacinamide",
    skins: ["Oily", "Dry", "Combination"], avoidConcerns: allConcernsExcept("Acne", "Dark Spots", "Both", "Dull or uneven tone"), fragrance: "none_listed",
    rank: { "Oily": 2, "Combination": 2, "Dry": 3 },
    concernRank: { "Dark Spots": 2, "Both": 3, "Acne": 4, "Dull or uneven tone": 2 },
    why: "A 10% niacinamide serum in a dropper bottle, sold for blemishes and dull skin.",
    cautions: ["Prices differ a lot between sellers: ₦9,900 at one store and ₦19,500 at one pharmacy. Compare before you buy.", "10% is stronger. If your skin is sensitive, choose the 5% serum instead."],
    prices: [
      { channel: "Nectar Beauty Hub", kind: "store", priceNGN: 9900, label: "listed price", checkedOn: "2026-11-10", url: "https://nectarbeautyhub.com/products/nineless-b-boost-10-niacinamide-serum-30ml-achieve-radiant-skin", region: "Lagos" },
      { channel: "GoMed", kind: "online-pharmacy", priceNGN: 19500, label: "last known price", checkedOn: "2026-11-10", url: "https://gomed.ng/p/20973-nineless-b-boost-10-niacinamide-serum-30ml" }
    ]
  },
  {
    id: "the-ordinary-azelaic-acid-suspension-10-30",
    category: "treatment", brand: "The Ordinary", name: "Azelaic Acid Suspension 10%", size: "30 ml",
    active: "azelaic acid", strength: "10% azelaic acid",
    skins: ["Oily", "Dry", "Combination", "Sensitive", "I don't know"], avoidConcerns: allConcernsExcept("Acne", "Dark Spots", "Both"), fragrance: "none_listed",
    rank: { "Oily": 1, "Combination": 1, "Dry": 1, "Sensitive": 2, "I don't know": 2 },
    concernRank: { "Both": 1, "Acne": 2, "Dark Spots": 3 },
    why: "Azelaic acid works on both acne and the dark marks acne leaves behind. Dermatology guidance says it can be a good fit for darker skin tones and for sensitive skin.",
    cautions: ["Tingling or stinging in the first weeks is common. Patch test first.", "Only one seller found, and its page does not say whether it is in stock. Check before you pay."],
    prices: [{ channel: "HealthPlus", kind: "online-pharmacy", priceNGN: 21500, label: "listed price", checkedOn: "2026-11-10", url: "https://healthplusnigeria.com/products/the-ordinary-azelaic-acid-10-suspension-30ml" }]
  },
  {
    id: "nineless-a-control-10-azelaic-acid-serum-30",
    category: "treatment", brand: "Nineless", name: "A-Control 10% Azelaic Acid Serum", size: "30 ml",
    active: "azelaic acid", strength: "10% azelaic acid",
    skins: ["Oily", "Dry", "Combination", "Sensitive", "I don't know"], avoidConcerns: allConcernsExcept("Acne", "Dark Spots", "Both"), fragrance: "none_listed",
    rank: { "Oily": 2, "Combination": 2, "Dry": 2, "Sensitive": 3, "I don't know": 3 },
    concernRank: { "Both": 1, "Acne": 2, "Dark Spots": 3 },
    why: "A 10% azelaic acid serum for acne and the dark marks it leaves.",
    cautions: ["Tingling or stinging in the first weeks is common. Patch test first.", "The price is the pharmacy's last known price and may have changed. Confirm it before you go."],
    prices: [{ channel: "GoMed", kind: "online-pharmacy", priceNGN: 19500, label: "last known price", checkedOn: "2026-11-10", url: "https://gomed.ng/p/20967-nineless-a-control-10-azelaic-acid-serum-30ml" }]
  },
  {
    id: "oxy-5-benzoyl-peroxide-10",
    category: "treatment", brand: "Oxy", name: "5 Acne Pimple Medication", size: "10 g",
    active: "benzoyl peroxide", strength: "5% benzoyl peroxide",
    skins: ["Oily", "Combination"], avoidConcerns: allConcernsExcept("Acne"), fragrance: "none_listed",
    rank: { "Oily": 1, "Combination": 1 },
    concernRank: { "Acne": 1 },
    why: "Benzoyl peroxide kills acne bacteria, and dermatologist guidance lists it as a first-choice acne treatment. Lower strengths such as 5% usually work about as well as 10%, with less irritation.",
    cautions: ["Dryness and peeling are common at first.", "It bleaches towels, pillowcases and clothes.", "Only one seller found. Its own page says the usual price is ₦9,500 to ₦11,000, so the price shown may be high."],
    prices: [{ channel: "GoMed", kind: "online-pharmacy", priceNGN: 13500, label: "last known price", checkedOn: "2026-11-10", url: "https://gomed.ng/product/oxy-5-10g-nig" }]
  }
];
