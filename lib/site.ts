export const siteUrl = "https://sigmath.org";

export const locales: readonly Locale[] = ["fr"];
export type Locale = "fr";

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
  title: string;
  shortTitle: string;
  description: string;
  subjects: string[];
  color: string;
  tone: string;
  icon: "kite" | "ball" | "graph" | "orbit";
};

export const tierInfo: TierInfo[] = [
  {
    slug: "kids",
    number: "01",
    age: "6—9",
    title: "Cycle 2 · CP à CE2",
    shortTitle: "Cycle 2",
    description: "Apprends à compter, à calculer et à reconnaître les formes avec des objets du quotidien.",
    subjects: ["Nombres et calcul", "Problèmes", "Grandeurs et mesures", "Géométrie", "Données"],
    color: "#ff6b4a",
    tone: "coral",
    icon: "kite",
  },
  {
    slug: "cycle-3",
    number: "02",
    age: "9—12",
    title: "Cycle 3 · CM1 à 6e",
    shortTitle: "Cycle 3",
    description: "Relier fractions, décimaux, géométrie, données et premiers raisonnements algébriques.",
    subjects: ["Nombres et calcul", "Algèbre", "Mesures", "Géométrie", "Probabilités", "Algorithmique"],
    color: "#2f7f74",
    tone: "mint",
    icon: "graph",
  },
  {
    slug: "middle-school",
    number: "03",
    age: "12—15",
    title: "Cycle 4 · 5e à 3e",
    shortTitle: "Collège",
    description: "Relier fractions, géométrie et premières équations au monde réel.",
    subjects: ["Fractions", "Géométrie", "Algèbre"],
    color: "#6e6bdc",
    tone: "violet",
    icon: "ball",
  },
];

export function getTier(slug: TierSlug) {
  return tierInfo.find((tier) => tier.slug === slug)!;
}

const subjectNames: Record<string, string> = {
  numbers: "Nombres et calcul",
  geometry: "Géométrie",
  algebra: "Algèbre",
  statistics: "Données",
  probability: "Probabilités",
  proportionality: "Proportionnalité",
  computing: "Pensée informatique",
  measures: "Grandeurs et mesures",
  "problem-solving": "Résolution de problèmes",
};

export function getSubjectName(subject: string) {
  return subjectNames[subject] ?? subject;
}
