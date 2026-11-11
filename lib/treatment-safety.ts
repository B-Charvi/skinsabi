import type { ActiveKind } from "./recommended-products";

/**
 * Safety text for the Treatment category. Treatments are active ingredients, so they carry more risk than a
 * cleanser, moisturiser or sunscreen: irritation, flare-ups, and in some cases harm if a person is pregnant,
 * has a skin condition we cannot see, or mixes products. Keep the wording plain and the rules few.
 */

/** Shown once, above the treatment pick, whenever a treatment is in the plan or in "Add when you can". */
export const TREATMENT_RULES: string[] = [
  "Patch test first, in Test & Watch. Then add only one new product at a time and wait about two weeks before adding another.",
  "Use the basics for about two weeks before you start a treatment. If your skin is calm by then, add the treatment.",
  "Start slowly. Use it every second or third day for the first week, then more often if your skin stays comfortable.",
  "Wear sunscreen every morning while you use a treatment. Sun makes dark marks darker, and some treatments make skin more sensitive.",
  "Do not mix it with other strong products, scrubs or home mixes such as lemon juice, baking soda or toothpaste.",
  "Skip creams that promise fast lightening. Some contain hidden steroids, mercury or hydroquinone above the 2% NAFDAC limit, and these can badly damage skin.",
  "Ask a doctor or pharmacist first if you are pregnant, breastfeeding or trying to get pregnant, if you already use a prescription skin medicine, or if the person using it is under 12.",
  "Stop and see a pharmacist or doctor if you get burning that does not settle, swelling, blisters or hives. If your lips, tongue or face swell or you find it hard to breathe, get urgent medical help.",
];

/** Shown when the concern includes a mark or lump that a cream cannot safely treat. */
export const SEE_A_DOCTOR: string[] = [
  "Deep, painful lumps, scarring, or acne that has not improved after about two months of steady use.",
  "A dark spot that is new, growing, changing shape or colour, or bleeding, or one on your palm, sole or under a nail. It needs a doctor to look at it, not a cream.",
];

export const ACTIVE_GUIDE: Record<ActiveKind, { start: string; watch: string }> = {
  "niacinamide": {
    start: "After cleansing, press a few drops onto the area once a day. Moisturise on top, and use sunscreen in the morning.",
    watch: "Stop if you get lasting redness, itching or flushing.",
  },
  "azelaic acid": {
    start: "Use a thin layer once a day, in the evening, for the first two weeks. Moisturise on top, and use sunscreen in the morning.",
    watch: "Mild tingling in the first weeks is common. Stop if it burns, swells or blisters.",
  },
  "benzoyl peroxide": {
    start: "Put a thin layer on the pimples or the acne area every second evening for the first week, then every evening if your skin copes. Keep it away from your eyes, lips and the corners of your nose. Do not use it on broken or sunburnt skin.",
    watch: "Dryness and peeling are common. Use a moisturiser. It bleaches towels, pillowcases and clothes, so use white ones.",
  },
};
