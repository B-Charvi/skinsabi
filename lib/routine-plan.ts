export type Skin = "I don't know" | "Oily" | "Dry" | "Combination" | "Sensitive";
import { MARK_CONCERNS, TREATMENT_CONCERNS, type ConcernName } from "./concerns";

export type Concern = ConcernName;
export type Budget = "Under ₦15k" | "₦15k–₦30k" | "₦30k+";
export type Step = { name: string; look: string; why: string; later?: string };

type Treatment = { title: string; look: string; why: string; later?: Partial<Record<Budget, string>> };
type TreatmentGroup = "gentle" | "oily" | "dry";

export const cleanser: Record<Skin, Step> = {
  "Oily": { name: "Cleanser", look: "A gentle gel or light foaming cleanser, fragrance-free.", why: "Removes oil, sweat and sunscreen without leaving skin tight." },
  "Dry": { name: "Cleanser", look: "A creamy or milky cleanser that barely foams, fragrance-free.", why: "Cleans without stripping the oils your skin needs. If skin feels tight in the morning, rinse with water only." },
  "Combination": { name: "Cleanser", look: "A gentle gel-cream cleanser, fragrance-free.", why: "Cleans the oily T-zone without drying your cheeks." },
  "Sensitive": { name: "Cleanser", look: "A fragrance-free, soap-free cream or gel cleanser. Wash with lukewarm water.", why: "Fewer irritants means fewer reactions." },
  "I don't know": { name: "Cleanser", look: "A gentle, fragrance-free gel-cream cleanser.", why: "A safe starting point while you learn how your skin behaves." },
};

export const moisturiser: Record<Skin, Step> = {
  "Oily": { name: "Moisturiser", look: "A lightweight gel or gel-cream labelled oil-free or non-comedogenic.", why: "Hydrates without feeling heavy or clogging pores." },
  "Dry": { name: "Moisturiser", look: "A richer cream with ceramides, glycerin or hyaluronic acid. At night, add a thin layer of petroleum jelly on very dry patches.", why: "Seals in water. Rich creams work best on slightly damp skin." },
  "Combination": { name: "Moisturiser", look: "A light lotion or gel-cream. Use a little extra on dry cheeks.", why: "Balances oily and dry areas." },
  "Sensitive": { name: "Moisturiser", look: "A plain, fragrance-free cream with ceramides or panthenol and a short ingredient list.", why: "Helps repair the skin barrier and keeps irritation down." },
  "I don't know": { name: "Moisturiser", look: "A fragrance-free lotion or light cream.", why: "Simple hydration that suits most skin." },
};

export const sunscreen: Record<Skin, Step> = {
  "Oily": { name: "Sunscreen", look: "A gel or fluid sunscreen with a light, non-greasy finish. Broad-spectrum SPF 30 or higher.", why: "Light enough for daily wear and does not add shine." },
  "Dry": { name: "Sunscreen", look: "A cream sunscreen with a moisturising finish. Broad-spectrum SPF 30 or higher.", why: "Protects and adds comfort to dry skin." },
  "Combination": { name: "Sunscreen", look: "A lightweight fluid or lotion sunscreen. Broad-spectrum SPF 30 or higher.", why: "Comfortable on both the oily and dry areas." },
  "Sensitive": { name: "Sunscreen", look: "A fragrance-free mineral sunscreen (zinc oxide or titanium dioxide). Broad-spectrum SPF 30 or higher. Look for \"sheer\" or \"tinted\" to avoid a white cast.", why: "Mineral filters are usually gentler on reactive skin." },
  "I don't know": { name: "Sunscreen", look: "A fragrance-free, broad-spectrum SPF 30 or higher lotion or fluid. Patch test it first.", why: "The most important step in every routine." },
};

export const sunscreenAcne = " Choose one labelled non-comedogenic or oil-free.";
export const sunscreenSpots = " Choose SPF 50 and a tinted version if you can. Reapply every 2 hours outdoors.";

export const budgetPlan: Record<Budget, { headline: string; note: string; buyFirst: string[] }> = {
  "Under ₦15k": {
    headline: "Essentials first",
    note: "Skip toners, serums with many ingredients, eye creams and exfoliants for now. They add cost, not results.",
    buyFirst: ["Sunscreen. Spend the most here.", "Moisturiser. One is enough for day and night.", "Gentle cleanser.", "Only then, one treatment if your concern needs it."],
  },
  "₦15k–₦30k": {
    headline: "Essentials plus one treatment",
    note: "You can afford one targeted product next to the basics. Add it only after the basics have felt comfortable for about 2 weeks.",
    buyFirst: ["Sunscreen.", "Moisturiser.", "Gentle cleanser.", "One treatment for your concern. Patch test it before you use it daily."],
  },
  "₦30k+": {
    headline: "Essentials, one treatment and a professional check",
    note: "A bigger budget does not mean more products. Add one new product at a time and wait 4 weeks before you judge it.",
    buyFirst: ["Sunscreen. Choose the formula you will enjoy wearing every day.", "Moisturiser.", "Gentle cleanser.", "One treatment for your concern.", "A dermatologist visit. A personal plan can save money by avoiding products that do not suit you."],
  },
};

export const avoidBySkin: Record<Skin, string> = {
  "Oily": "Heavy creams, pure oils and butters on the face, and harsh scrubs.",
  "Dry": "Foaming scrubs, alcohol-heavy toners and very hot water.",
  "Combination": "Strong drying products on the whole face. Treat only the oily areas.",
  "Sensitive": "Fragrance, essential oils, scrubs, and more than one new product at a time.",
  "I don't know": "Fragrance, scrubs, and more than one new product at a time.",
};
export const avoidByConcern: Record<Concern, string> = {
  "Acne": "Picking pimples, and home remedies such as toothpaste, lime or lemon on spots.",
  "Dark Spots": "Bleaching or \"lightening\" creams, lemon juice and harsh scrubs. They can make marks darker or damage skin.",
  "Both": "Picking pimples, bleaching creams, lemon juice and harsh scrubs.",
  "Sunburn or tan marks": "More sun while the skin heals, lotions with alcohol or fragrance, scrubs and peels, and popping blisters. Skip lemon juice, toothpaste and bleaching creams.",
  "Dull or uneven tone": "Bleaching or \"lightening\" creams, harsh scrubs, lemon juice and baking soda. They damage skin and can make tone more uneven.",
  "Dry, flaky or tight skin": "Long hot showers, bar soap, scrubs and alcohol-heavy toners. Keep showers to about 10 minutes and use lukewarm water.",
  "Healthy skin, just maintenance": "Bleaching or \"lightening\" creams, and starting many new products at once. Healthy skin needs simple care, not extra actives.",
  "Something else": "",
};
export const seeDoctor: Record<Concern, string> = {
  "Acne": "Your pimples are deep, painful or leave scars.",
  "Dark Spots": "A dark patch spreads quickly, bleeds or changes shape.",
  "Both": "Pimples are deep or painful, or a dark patch spreads quickly or changes shape.",
  "Sunburn or tan marks": "You have large blisters, blisters on your face or hands, fever or chills, severe pain, or signs of infection such as pus or swelling. Get urgent care for confusion, fainting, or a high fever with vomiting.",
  "Dull or uneven tone": "A patch is new, spreading, itchy or bleeding, or your skin colour changes suddenly.",
  "Dry, flaky or tight skin": "The dryness does not improve with moisturiser, or the skin is inflamed or painful, or it cracks into sores.",
  "Healthy skin, just maintenance": "Something changes suddenly, such as itching, a rash, swelling, or a new patch that grows or bleeds.",
  "Something else": "You have itching, a rash, swelling or a sudden change in your skin.",
};

/** Short guidance shown above the plan for concerns that need more than a product list. */
export const concernNote: Partial<Record<Concern, { title: string; lines: string[] }>> = {
  "Sunburn or tan marks": {
    title: "If your sunburn is still fresh",
    lines: [
      "Get out of the sun. Cool the skin with a cool (not ice-cold) bath or shower, or a cool damp cloth, then pat dry.",
      "While the skin is still damp, apply aloe vera gel or a plain, fragrance-free moisturiser. Avoid lotions with alcohol or fragrance.",
      "Drink extra water, because a sunburn can dehydrate you. Leave blisters alone, because popping them can cause infection.",
      "Stay out of the sun or cover up until the skin has healed. After that, wear sunscreen every day. New sun on healing skin makes marks darker.",
    ],
  },
  "Dull or uneven tone": {
    title: "About dull or uneven tone",
    lines: [
      "Dullness usually comes from sun, dry skin and dead skin building up. Daily sunscreen, gentle washing and moisturiser do most of the work.",
      "A treatment can even out marks slowly. Nothing safe changes your natural skin colour, and bleaching creams can permanently damage skin.",
    ],
  },
  "Dry, flaky or tight skin": {
    title: "About dry, flaky or tight skin",
    lines: [
      "Dry skin needs water kept in, not more products. Keep showers short and lukewarm, and moisturise while the skin is still slightly damp.",
      "Use a cream or non-foaming wash instead of bar soap, and wear sunscreen even on cloudy days.",
    ],
  },
  "Healthy skin, just maintenance": {
    title: "Your skin is doing well",
    lines: [
      "Keep it simple: wash gently, moisturise and wear sunscreen. You do not need a treatment.",
      "Do not use skin-lightening or bleaching products. They do not improve healthy skin and can damage it.",
    ],
  },
};

/** True when the concern has a real reason to use a treatment (an active ingredient). */
export const offersTreatment = (concern: string) => TREATMENT_CONCERNS.includes(concern as Concern);

const BUDGETS: Budget[] = ["Under ₦15k", "₦15k–₦30k", "₦30k+"];
const forEveryBudget = (t: Treatment): Record<Budget, Treatment> => ({ "Under ₦15k": t, "₦15k–₦30k": t, "₦30k+": t });
const forEveryGroup = (t: Treatment): Record<TreatmentGroup, Record<Budget, Treatment>> => ({ gentle: forEveryBudget(t), oily: forEveryBudget(t), dry: forEveryBudget(t) });
const laterEverywhere = (text: string): Treatment["later"] => Object.fromEntries(BUDGETS.map(b => [b, text])) as Record<Budget, string>;

const treatment: Record<Concern, Record<TreatmentGroup, Record<Budget, Treatment>>> = {
  "Sunburn or tan marks": forEveryGroup({
    title: "No treatment while the burn heals",
    look: "Care for the burn first (see the note above). Once the skin has fully healed, with no redness, soreness or peeling, you can fade leftover marks.",
    why: "Active ingredients on burnt skin sting and can make marks worse.",
    later: laterEverywhere("After it has healed and you have had 4 weeks of gentle care, add niacinamide 5% for the marks."),
  }),
  "Dull or uneven tone": {
    gentle: forEveryBudget({ title: "No treatment yet", look: "Use the three essentials for 4 weeks. Wear sunscreen every day.", why: "Sunscreen, gentle washing and moisturiser do most of the work for dull skin.", later: laterEverywhere("After 4 weeks, add niacinamide 5%. It helps even tone and does not change your natural skin colour.") }),
    oily: forEveryBudget({ title: "One gentle tone treatment", look: "Niacinamide 5%.", why: "Helps even out tone over 8 to 12 weeks. It does not bleach or change your natural skin colour." }),
    dry: forEveryBudget({ title: "One gentle tone treatment", look: "Niacinamide 5%.", why: "Helps even out tone over 8 to 12 weeks. It does not bleach or change your natural skin colour." }),
  },
  "Dry, flaky or tight skin": forEveryGroup({
    title: "No treatment needed",
    look: "Moisture is the treatment. Moisturise twice a day, while your skin is still slightly damp.",
    why: "Strong products can dry skin out further. Keep it simple until the dryness settles.",
  }),
  "Healthy skin, just maintenance": forEveryGroup({
    title: "No treatment needed",
    look: "Stay with the three essentials.",
    why: "Healthy skin does not need extra products. Adding actives can cause the irritation you do not have now.",
  }),
  "Acne": {
    gentle: {
      "Under ₦15k": { title: "No treatment yet", look: "Use only the three essentials for 4 weeks and track your skin in Test & Watch.", why: "Gentle care first keeps irritation low.", later: { "Under ₦15k": "If pimples stay after 4 weeks, add niacinamide 2 to 5%. One product, patch tested first." } },
      "₦15k–₦30k": { title: "No treatment yet", look: "Use only the three essentials for 4 weeks and track your skin in Test & Watch.", why: "Gentle care first keeps irritation low.", later: { "₦15k–₦30k": "If pimples stay after 4 weeks, add azelaic acid 10%, patch tested first." } },
      "₦30k+": { title: "No treatment yet", look: "Use only the three essentials for 4 weeks and track your skin in Test & Watch.", why: "Gentle care first keeps irritation low.", later: { "₦30k+": "If pimples stay after 4 weeks, see a dermatologist for a plan that suits reactive skin. Add one product at a time." } },
    },
    oily: {
      "Under ₦15k": { title: "One simple acne treatment", look: "Choose ONE: salicylic acid (BHA) 0.5 to 2%, or benzoyl peroxide 2.5% in a thin layer. Pharmacy products are fine.", why: "Start 2 nights a week. Do not use both." },
      "₦15k–₦30k": { title: "One acne treatment", look: "Choose ONE: salicylic acid (BHA) 2% leave-on, niacinamide 4 to 5%, or azelaic acid 10% if pimple marks worry you.", why: "Start 2 nights a week and add more only if your skin stays calm." },
      "₦30k+": { title: "One acne treatment, plus a professional check", look: "Choose ONE: salicylic acid (BHA) 2%, niacinamide 4 to 5%, or azelaic acid 10%.", why: "For deep, painful or scarring pimples, a dermatologist can prescribe options that shop-bought products cannot match." },
    },
    dry: {
      "Under ₦15k": { title: "A gentle acne treatment", look: "Niacinamide 4 to 5%.", why: "It calms skin and does not dry it out. Avoid benzoyl peroxide and strong salicylic acid at first." },
      "₦15k–₦30k": { title: "Azelaic acid for pimples", look: "Azelaic acid 10%.", why: "Helps pimples and the marks they leave, with less drying than most acne treatments." },
      "₦30k+": { title: "Azelaic acid, plus a professional check", look: "Azelaic acid 10%, or ask a dermatologist about prescription options.", why: "A professional plan can speed up results for stubborn pimples." },
    },
  },
  "Dark Spots": {
    gentle: {
      "Under ₦15k": { title: "No treatment yet", look: "Use the three essentials for 4 weeks. Wear sunscreen every day.", why: "Sun protection does more for dark marks than any product.", later: { "Under ₦15k": "After 4 weeks, add niacinamide 5%." } },
      "₦15k–₦30k": { title: "No treatment yet", look: "Use the three essentials for 4 weeks. Wear sunscreen every day.", why: "Sun protection does more for dark marks than any product.", later: { "₦15k–₦30k": "After 4 weeks, add azelaic acid 10%." } },
      "₦30k+": { title: "No treatment yet", look: "Use the three essentials for 4 weeks. Wear sunscreen every day.", why: "Sun protection does more for dark marks than any product.", later: { "₦30k+": "After 4 weeks, add azelaic acid 10%, and ask a dermatologist about prescription options for stubborn marks." } },
    },
    oily: {
      "Under ₦15k": { title: "One affordable spot treatment", look: "Niacinamide 5%.", why: "Gentle and affordable. Results take about 8 to 12 weeks." },
      "₦15k–₦30k": { title: "One spot treatment", look: "Azelaic acid 10%.", why: "Works well on dark marks on deeper skin tones. Results take about 8 to 12 weeks." },
      "₦30k+": { title: "One spot treatment, plus a professional check", look: "Azelaic acid 10%.", why: "For stubborn marks, ask a dermatologist about prescription azelaic acid or tranexamic acid. Be careful with peels and lasers on deeper skin tones, because they can darken skin. Choose someone experienced." },
    },
    dry: {
      "Under ₦15k": { title: "One affordable spot treatment", look: "Niacinamide 5%.", why: "Gentle and affordable. Results take about 8 to 12 weeks." },
      "₦15k–₦30k": { title: "One spot treatment", look: "Azelaic acid 10%.", why: "Works well on dark marks on deeper skin tones. Results take about 8 to 12 weeks." },
      "₦30k+": { title: "One spot treatment, plus a professional check", look: "Azelaic acid 10%.", why: "For stubborn marks, ask a dermatologist about prescription azelaic acid or tranexamic acid. Be careful with peels and lasers on deeper skin tones, because they can darken skin. Choose someone experienced." },
    },
  },
  "Both": {
    gentle: {
      "Under ₦15k": { title: "No treatment yet", look: "Use the three essentials for 4 weeks.", why: "Gentle care first keeps irritation low.", later: { "Under ₦15k": "After 4 weeks, add niacinamide 5%. It helps pimples and marks." } },
      "₦15k–₦30k": { title: "No treatment yet", look: "Use the three essentials for 4 weeks.", why: "Gentle care first keeps irritation low.", later: { "₦15k–₦30k": "After 4 weeks, add azelaic acid 10%. It helps pimples and marks." } },
      "₦30k+": { title: "No treatment yet", look: "Use the three essentials for 4 weeks.", why: "Gentle care first keeps irritation low.", later: { "₦30k+": "After 4 weeks, add azelaic acid 10%, and book a dermatologist visit for a personal plan." } },
    },
    oily: {
      "Under ₦15k": { title: "One treatment for both", look: "Niacinamide 5%.", why: "Affordable and gentle. Move to azelaic acid 10% when your budget allows." },
      "₦15k–₦30k": { title: "One treatment for both", look: "Azelaic acid 10%.", why: "The best single fit for pimples and the dark marks they leave." },
      "₦30k+": { title: "One treatment for both, plus a professional check", look: "Azelaic acid 10%.", why: "If progress is slow after 12 weeks, ask a dermatologist about prescription azelaic acid (15 to 20%)." },
    },
    dry: {
      "Under ₦15k": { title: "One treatment for both", look: "Niacinamide 5%.", why: "Affordable and gentle. Move to azelaic acid 10% when your budget allows." },
      "₦15k–₦30k": { title: "One treatment for both", look: "Azelaic acid 10%.", why: "The best single fit for pimples and the dark marks they leave." },
      "₦30k+": { title: "One treatment for both, plus a professional check", look: "Azelaic acid 10%.", why: "If progress is slow after 12 weeks, ask a dermatologist about prescription azelaic acid (15 to 20%)." },
    },
  },
  "Something else": {
    gentle: {
      "Under ₦15k": { title: "No treatment needed yet", look: "Stay with the three essentials.", why: "Without a clear concern, simple care is the safest plan." },
      "₦15k–₦30k": { title: "No treatment needed yet", look: "Stay with the three essentials.", why: "Without a clear concern, simple care is the safest plan." },
      "₦30k+": { title: "No treatment needed yet", look: "Stay with the three essentials.", why: "Without a clear concern, simple care is the safest plan." },
    },
    oily: {
      "Under ₦15k": { title: "No treatment needed yet", look: "Stay with the three essentials.", why: "Without a clear concern, simple care is the safest plan." },
      "₦15k–₦30k": { title: "No treatment needed yet", look: "Stay with the three essentials.", why: "Without a clear concern, simple care is the safest plan." },
      "₦30k+": { title: "No treatment needed yet", look: "Stay with the three essentials.", why: "Without a clear concern, simple care is the safest plan." },
    },
    dry: {
      "Under ₦15k": { title: "No treatment needed yet", look: "Stay with the three essentials.", why: "Without a clear concern, simple care is the safest plan." },
      "₦15k–₦30k": { title: "No treatment needed yet", look: "Stay with the three essentials.", why: "Without a clear concern, simple care is the safest plan." },
      "₦30k+": { title: "No treatment needed yet", look: "Stay with the three essentials.", why: "Without a clear concern, simple care is the safest plan." },
    },
  },
};

export type RoutinePlan = {
  chips: [Skin, Concern, Budget];
  budget: (typeof budgetPlan)[Budget];
  morning: Step[];
  night: Step[];
  avoid: string[];
  seeDoctor: string;
  concernNote?: { title: string; lines: string[] };
};

/** The budget text, without treatment lines for concerns that do not use one. */
function budgetFor(budget: Budget, concern: Concern): RoutinePlan["budget"] {
  const base = budgetPlan[budget];
  if (offersTreatment(concern)) return base;
  const buyFirst = base.buyFirst.filter(line => !/treatment/i.test(line));
  if (budget === "₦15k–₦30k") return { headline: "Essentials, with room to choose", note: "Your concern does not need a treatment, so the whole budget can go on good basics. Choose formulas you will enjoy using every day.", buyFirst };
  return { ...base, headline: budget === "₦30k+" ? "Essentials and a professional check" : base.headline, buyFirst };
}

export function buildRoutinePlan({ skin, concern, budget }: { skin: Skin; concern: Concern; budget: Budget }): RoutinePlan {
  const group: TreatmentGroup = skin === "Sensitive" || skin === "I don't know" ? "gentle" : skin === "Dry" ? "dry" : "oily";
  const sunscreenStep = { ...sunscreen[skin] };
  if (concern === "Acne" || concern === "Both") sunscreenStep.look += sunscreenAcne;
  if (MARK_CONCERNS.includes(concern)) sunscreenStep.look += sunscreenSpots;
  const treatmentOption = treatment[concern][group][budget];
  const nightTreatment: Step = {
    name: treatmentOption.title,
    look: treatmentOption.look,
    why: treatmentOption.why,
    ...(treatmentOption.later?.[budget] ? { later: treatmentOption.later[budget] } : {}),
  };

  return {
    chips: [skin, concern, budget],
    budget: budgetFor(budget, concern),
    morning: [cleanser[skin], moisturiser[skin], sunscreenStep],
    night: [cleanser[skin], nightTreatment, moisturiser[skin]],
    avoid: [avoidBySkin[skin], avoidByConcern[concern]].filter(Boolean),
    seeDoctor: seeDoctor[concern],
    ...(concernNote[concern] ? { concernNote: concernNote[concern] } : {}),
  };
}
