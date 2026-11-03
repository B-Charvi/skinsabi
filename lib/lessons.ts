export type Lesson = {
  slug: string;
  title: string;
  minutes: number;
  icon: "sun" | "search" | "leaf" | "warning" | "circle-check";
  summary: string;
  steps: string[];
  watchFor: string[];
  link: { label: string; href: string };
};

export const lessons: Lesson[] = [
  {
    slug: "sunscreen-thin-layers",
    title: "How to apply sunscreen thinly",
    minutes: 1,
    icon: "sun",
    summary: "Thin layers feel lighter and blend better on deeper skin tones, but you still need enough in total.",
    steps: [
      "Squeeze a line of sunscreen along your index and middle fingers. That is the amount for your face and neck.",
      "Apply it in two thin layers. Smooth in the first, wait about a minute, then add the second.",
      "Do not forget your ears, hairline, the sides of your neck and your lips. Use a lip balm with SPF 30 or higher.",
      "Make it your last morning step, about 15 minutes before you go out.",
      "Reapply every two hours when you are outside, and after heavy sweating.",
    ],
    watchFor: [
      "A white or grey cast on deeper skin. Look for \"sheer\", \"invisible\" or \"tinted\" on the label.",
      "Stinging in your eyes or burning on your skin. Stop that sunscreen and try a fragrance-free one.",
      "Thin does not mean less. Using too little lowers the protection promised on the label.",
    ],
    link: { label: "Patch test a new sunscreen", href: "/test-and-watch" },
  },
  {
    slug: "dark-spots-need-sunscreen",
    title: "Why dark spots need sunscreen",
    minutes: 1,
    icon: "sun",
    summary: "Sun keeps dark marks dark. Without sunscreen, even the best spot treatment struggles to work.",
    steps: [
      "Wear broad-spectrum SPF 30 or higher every morning, including cloudy days and days you stay indoors near a window.",
      "Choose a tinted or sheer formula if you can. Tinted sunscreens may also help against the visible light that darkens marks on deeper skin.",
      "Reapply every two hours when outdoors, and use shade or a hat when you can.",
      "Be patient. Dark marks usually take about 3 months or more to fade. Take a photo in the same light each month to see your progress.",
    ],
    watchFor: [
      "Sunscreen protects your progress. It does not fade marks by itself.",
      "Picking pimples, scrubbing and harsh products can cause new dark marks. Treat spots gently.",
      "Some unregistered skin-lightening creams have been found to contain hydroquinone, mercury or strong steroids. Avoid creams that promise fast results.",
    ],
    link: { label: "Build my routine", href: "/routine" },
  },
  {
    slug: "spot-fake-products",
    title: "How to spot fake products",
    minutes: 1,
    icon: "search",
    summary: "Fake and unregistered skincare is common in markets and online. A few quick checks protect your skin.",
    steps: [
      "Buy from the brand's official store, a pharmacy or a retailer you trust. Be careful with prices that look too good to be true.",
      "Look for a NAFDAC registration number on the pack. Then search for the product on NAFDAC's registered-products search (nafdac.gov.ng) and check that the name matches. A number on the pack alone is not proof, because fakes can copy it.",
      "Check the pack for spelling mistakes, blurry print, a loose or uneven seal, and a missing batch number or expiry date.",
      "Compare with the one you bought before. A different smell, colour, texture or weight is a warning sign.",
      "Compare the ingredient list on the pack with the brand's official website.",
    ],
    watchFor: [
      "Creams that promise to lighten your whole skin tone. Some unregistered ones have been found to contain hydroquinone, mercury or strong steroids, which can badly damage skin.",
      "A product that burns, swells or breaks you out unusually fast. Stop using it, keep the pack and report it to NAFDAC.",
    ],
    link: { label: "Check a label in My Products", href: "/products" },
  },
  {
    slug: "azelaic-vs-kojic",
    title: "Azelaic Acid vs Kojic Acid: Which One For You?",
    minutes: 2,
    icon: "leaf",
    summary: "Azelaic acid is usually the gentler first choice. Kojic acid works on dark spots only and irritates more people.",
    steps: [
      "Pimples and dark marks together: start with azelaic acid. It helps with both and is usually well tolerated. Shop-bought products are often 10%. Prescription strengths go higher.",
      "Dark marks only and calm skin: azelaic acid is still a good first try. Kojic acid is the next option. It is often sold at 1% to 4%, and 1% or less is gentler.",
      "Sensitive, stinging or reactive skin: choose azelaic acid, or wait. Kojic acid is Level 2 in SkinSabi because it irritates more people. Use it only after a gradual patch test.",
      "Use one at a time, never both together. Wait 4 to 6 weeks before you judge it, and give dark marks about 3 months.",
      "Use sunscreen every morning with either one.",
    ],
    watchFor: [
      "Mild tingling when you start azelaic acid is common. Burning that lasts more than 20 minutes is not. Wash it off and stop.",
      "Kojic acid can cause irritation or allergic reactions in some people. Swelling, hives, blisters or a spreading rash: stop and see a doctor.",
      "If you are pregnant or breastfeeding, ask your doctor before starting either one.",
    ],
    link: { label: "Start a patch test", href: "/test-and-watch" },
  },
  {
    slug: "kojic-acid-safely",
    title: "Kojic Acid: How to Use It Without Burning Your Skin",
    minutes: 2,
    icon: "warning",
    summary: "Go slowly, go thin and protect your skin. Most kojic acid burns come from using it too often, too soon.",
    steps: [
      "Patch test first. Follow the 14-day daily check-ins in Test & Watch before you use it on your whole face.",
      "Start with 2 nights a week. Put a thin layer on clean, dry skin, then moisturise.",
      "After 2 to 3 weeks with no irritation, move to every other night. Do not go daily unless your skin stays calm.",
      "Do not use it on the same night as other strong actives such as acids, retinoids, benzoyl peroxide or vitamin C.",
      "Use sunscreen every morning.",
    ],
    watchFor: [
      "Mild tingling that fades in under 20 minutes can be fine. You can try the Sandwich Method. Burning that lasts longer: wash it off and stop.",
      "Do not use it on broken, peeling or sunburnt skin.",
      "Swelling, hives, blisters or a spreading rash: stop and see a doctor.",
    ],
    link: { label: "Go to Test & Watch", href: "/test-and-watch" },
  },
  {
    slug: "sandwich-method",
    title: "The Sandwich Method: How To Use Strong Serums Without Burning",
    minutes: 2,
    icon: "circle-check",
    summary: "Place a strong serum between two thin layers of moisturiser so it stings less.",
    steps: [
      "Wash your face and pat it dry.",
      "Apply a thin layer of plain moisturiser. Wait 5 minutes.",
      "Apply a pea-sized amount of your treatment, or a few drops if it is a serum.",
      "Wait 5 minutes, then add another thin layer of moisturiser.",
      "Use it 2 to 3 nights a week, and only on nights you are not using another strong active.",
    ],
    watchFor: [
      "The Sandwich Method is for mild, brief tingling on non-reactive skin. It does not fix burning, redness or swelling.",
      "It does not make a red-flag product safe. If a product keeps stinging, stop using it.",
      "Results can come a little slower because the treatment is diluted. That is fine.",
    ],
    link: { label: "Build my routine", href: "/routine" },
  },
];
