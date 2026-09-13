export const locales: readonly Locale[] = ["fr"];
// Retain archived translation types; only French routes are published.
export type Locale = "fr" | "en";

export const tiers = ["kids", "cycle-3", "middle-school"] as const;
export type TierSlug = (typeof tiers)[number];

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function isTier(value: string): value is TierSlug {
  return tiers.includes(value as TierSlug);
}

export type TierInfo = {
  slug: TierSlug;
  number: string;
  age: string;
  title: Record<Locale, string>;
  shortTitle: Record<Locale, string>;
  description: Record<Locale, string>;
  subjects: Record<Locale, string[]>;
  color: string;
  tone: string;
  icon: "kite" | "ball" | "graph" | "orbit";
};

export const tierInfo: TierInfo[] = [
  {
    slug: "kids",
    number: "01",
    age: "6—9",
    title: { fr: "Cycle 2 · CP à CE2", en: "Cycle 2 · CP to CE2" },
    shortTitle: { fr: "Cycle 2", en: "Cycle 2" },
    description: {
      fr: "Apprends à compter, à calculer et à reconnaître les formes avec des objets du quotidien.",
      en: "The complete French curriculum pathway: numbers, calculation, measures, geometry and data, from concrete to abstract.",
    },
    subjects: { fr: ["Nombres et calcul", "Problèmes", "Grandeurs et mesures", "Géométrie", "Données"], en: ["Numbers", "Problems", "Measures", "Geometry", "Data"] },
    color: "#ff6b4a",
    tone: "coral",
    icon: "kite",
  },
  {
    slug: "cycle-3",
    number: "02",
    age: "9—12",
    title: { fr: "Cycle 3 · CM1 à 6e", en: "Cycle 3 · CM1 to Year 7" },
    shortTitle: { fr: "Cycle 3", en: "Cycle 3" },
    description: {
      fr: "Relier fractions, décimaux, géométrie, données et premiers raisonnements algébriques.",
      en: "Connect fractions, decimals, geometry, data and early algebraic reasoning.",
    },
    subjects: { fr: ["Nombres et calcul", "Algèbre", "Mesures", "Géométrie", "Probabilités", "Algorithmique"], en: ["Numbers", "Algebra", "Measures", "Geometry", "Probability", "Algorithms"] },
    color: "#2f7f74",
    tone: "mint",
    icon: "graph",
  },
  {
    slug: "middle-school",
    number: "03",
    age: "12—15",
    title: { fr: "Cycle 4 · 5e à 3e", en: "Middle school" },
    shortTitle: { fr: "Collège", en: "Middle" },
    description: {
      fr: "Relier fractions, géométrie et premières équations au monde réel.",
      en: "Connect fractions, geometry, and first equations to real life.",
    },
    subjects: { fr: ["Fractions", "Géométrie", "Algèbre"], en: ["Fractions", "Geometry", "Algebra"] },
    color: "#6e6bdc",
    tone: "violet",
    icon: "ball",
  },
];

export function getTier(slug: TierSlug) {
  return tierInfo.find((tier) => tier.slug === slug)!;
}

const subjectNames: Record<Locale, Record<string, string>> = {
  fr: { numbers: "Nombres et calcul", geometry: "Géométrie", algebra: "Algèbre", statistics: "Données", probability: "Probabilités", proportionality: "Proportionnalité", computing: "Pensée informatique", measures: "Grandeurs et mesures", "problem-solving": "Résolution de problèmes" },
  en: { numbers: "Numbers and calculation", geometry: "Geometry", algebra: "Algebra", statistics: "Data", probability: "Probability", proportionality: "Proportionality", computing: "Computational thinking", measures: "Measures", "problem-solving": "Problem solving" },
};

export function getSubjectName(locale: Locale, subject: string) {
  return subjectNames[locale][subject] ?? subject;
}
