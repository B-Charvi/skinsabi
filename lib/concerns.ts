/**
 * The one list of "main concern" choices. The signup form, profile, routine builder, recommender and routine plan all
 * read from here, so a new concern only has to be added in this file and then given its rules.
 *
 * The first four names are stored in people's profiles already, so they must not be renamed.
 */
export const CONCERNS = [
  "Acne",
  "Dark Spots",
  "Both",
  "Sunburn or tan marks",
  "Dull or uneven tone",
  "Dry, flaky or tight skin",
  "Healthy skin, just maintenance",
  "Something else",
] as const;

export type ConcernName = (typeof CONCERNS)[number];

/** Same list as plain strings, for dropdowns and matchOption(). */
export const concernOptions: string[] = [...CONCERNS];

/** Every concern except the ones named. Used to say who a product or treatment is for, by listing who it is NOT for. */
export const allConcernsExcept = (...keep: ConcernName[]): ConcernName[] => CONCERNS.filter(c => !keep.includes(c));

/** Concerns where a treatment product (an active ingredient) has a real reason to be offered. */
export const TREATMENT_CONCERNS: ConcernName[] = ["Acne", "Dark Spots", "Both", "Sunburn or tan marks", "Dull or uneven tone"];

/** Concerns where the skin is already irritated or dry, so fragranced products are left out whatever the skin type. */
export const GENTLE_CONCERNS: ConcernName[] = ["Sunburn or tan marks", "Dry, flaky or tight skin"];

/** Concerns about marks or tone: here sun makes things worse, so sunscreen is the most useful buy. */
export const MARK_CONCERNS: ConcernName[] = ["Dark Spots", "Both", "Sunburn or tan marks", "Dull or uneven tone"];
