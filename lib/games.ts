export type GameId = "fractions" | "number-line" | "area";
export type GameLocale = "fr" | "en";

type FractionChallenge = { kind: "fractions"; numerator: number; denominator: number; parts: number };
// Integer tenths keep decimal answers exact, including 0.3 and 0.7.
type LineChallenge = { kind: "number-line"; tenths: number };
type AreaChallenge = { kind: "area"; area: number };
export type Challenge = FractionChallenge | LineChallenge | AreaChallenge;

export const games = [
  { id: "fractions", title: { fr: "Le goûter à partager", en: "Sharing a snack" }, concept: { fr: "Fractions · CM1–6e", en: "Fractions · ages 9–12" }, description: { fr: "Colorie des parts et découvre les fractions équivalentes.", en: "Colour pieces and discover equivalent fractions." }, lesson: "cycle-3/numbers/fractions-measure-quotient" },
  { id: "number-line", title: { fr: "Le saut des décimaux", en: "The decimal jump" }, concept: { fr: "Décimaux · CM1–6e", en: "Decimals · ages 9–12" }, description: { fr: "Place un nombre et vois sa distance à zéro.", en: "Place a number and see its distance from zero." }, lesson: "cycle-3/numbers/decimal-numbers" },
  { id: "area", title: { fr: "Le jardin quadrillé", en: "The grid garden" }, concept: { fr: "Aires · CM1–6e", en: "Area · ages 9–12" }, description: { fr: "Construis un rectangle et compte les mètres carrés.", en: "Build a rectangle and count its square metres." }, lesson: "cycle-3/measures/areas" },
] as const;

export const challenges: Record<GameId, readonly Challenge[]> = {
  fractions: [
    { kind: "fractions", numerator: 1, denominator: 2, parts: 4 },
    { kind: "fractions", numerator: 3, denominator: 4, parts: 8 },
    { kind: "fractions", numerator: 2, denominator: 3, parts: 6 },
  ],
  "number-line": [
    { kind: "number-line", tenths: 7 },
    { kind: "number-line", tenths: 13 },
    { kind: "number-line", tenths: 18 },
  ],
  area: [
    { kind: "area", area: 12 },
    { kind: "area", area: 18 },
    { kind: "area", area: 24 },
  ],
};

export function decimal(tenths: number, locale: GameLocale) {
  return (tenths / 10).toFixed(1).replace(".", locale === "fr" ? "," : ".");
}

export function evaluateAnswer(challenge: Challenge, first: number, second = 1) {
  if (!Number.isInteger(first) || !Number.isInteger(second)) return false;
  switch (challenge.kind) {
    case "fractions":
      return first >= 0 && first <= challenge.parts && first * challenge.denominator === challenge.numerator * challenge.parts;
    case "number-line":
      return first >= 0 && first <= 20 && first === challenge.tenths;
    case "area":
      return first >= 1 && first <= 8 && second >= 1 && second <= 8 && first * second === challenge.area;
  }
}

export function challengePrompt(challenge: Challenge, locale: GameLocale) {
  const fr = locale === "fr";
  switch (challenge.kind) {
    case "fractions": return fr ? `Colorie ${challenge.numerator}/${challenge.denominator} du goûter.` : `Colour ${challenge.numerator}/${challenge.denominator} of the snack.`;
    case "number-line": return fr ? `Place le repère sur ${decimal(challenge.tenths, locale)}.` : `Place the marker at ${decimal(challenge.tenths, locale)}.`;
    case "area": return fr ? `Construis un jardin de ${challenge.area} m².` : `Build a garden of ${challenge.area} m².`;
  }
}

export function challengeHint(challenge: Challenge, locale: GameLocale) {
  const fr = locale === "fr";
  switch (challenge.kind) {
    case "fractions": return fr ? `Les ${challenge.parts} parts sont égales. Partage-les en ${challenge.denominator} groupes égaux, puis prends ${challenge.numerator} groupe(s).` : `The ${challenge.parts} pieces are equal. Split them into ${challenge.denominator} equal groups, then take ${challenge.numerator} group(s).`;
    case "number-line": return fr ? "Entre deux entiers, il y a 10 petits pas. Chaque pas vaut un dixième (0,1)." : "There are 10 small steps between whole numbers. Each step is one tenth (0.1).";
    case "area": return fr ? `Chaque case mesure 1 m². Cherche deux nombres dont le produit vaut ${challenge.area}. Plusieurs rectangles peuvent convenir !` : `Each square measures 1 m². Find two numbers whose product is ${challenge.area}. More than one rectangle can work!`;
  }
}

export function answerFeedback(challenge: Challenge, first: number, second: number, locale: GameLocale) {
  const fr = locale === "fr";
  const correct = evaluateAnswer(challenge, first, second);
  switch (challenge.kind) {
    case "fractions":
      if (correct) return fr ? `${first}/${challenge.parts} = ${challenge.numerator}/${challenge.denominator} : la même quantité, avec des parts plus petites.` : `${first}/${challenge.parts} = ${challenge.numerator}/${challenge.denominator}: the same amount, with smaller pieces.`;
      return fr ? `Tu as colorié ${first} part(s) sur ${challenge.parts}. ${first * challenge.denominator < challenge.numerator * challenge.parts ? "Ajoute" : "Retire"} des parts pour atteindre ${challenge.numerator}/${challenge.denominator}.` : `You coloured ${first} of ${challenge.parts} pieces. ${first * challenge.denominator < challenge.numerator * challenge.parts ? "Add" : "Remove"} pieces to reach ${challenge.numerator}/${challenge.denominator}.`;
    case "number-line":
      if (correct) return fr ? `${decimal(first, locale)} = ${first}/10 : ${first} pas d’un dixième depuis zéro.` : `${decimal(first, locale)} = ${first}/10: ${first} steps of one tenth from zero.`;
      return fr ? `Ton repère est sur ${decimal(first, locale)}. Avance vers la ${first < challenge.tenths ? "droite" : "gauche"} pour atteindre ${decimal(challenge.tenths, locale)}.` : `Your marker is at ${decimal(first, locale)}. Move ${first < challenge.tenths ? "right" : "left"} to reach ${decimal(challenge.tenths, locale)}.`;
    case "area":
      if (correct) return fr ? `${first} × ${second} = ${challenge.area} m². L’aire compte les cases à l’intérieur ; le périmètre mesure le contour (${2 * (first + second)} m ici).` : `${first} × ${second} = ${challenge.area} m². Area counts squares inside; perimeter measures the boundary (${2 * (first + second)} m here).`;
      return fr ? `Ton jardin contient ${first} × ${second} = ${first * second} cases de 1 m². C’est ${first * second < challenge.area ? "moins" : "plus"} que ${challenge.area} : ajuste ses côtés.` : `Your garden has ${first} × ${second} = ${first * second} squares of 1 m². That is ${first * second < challenge.area ? "less" : "more"} than ${challenge.area}: adjust its sides.`;
  }
}
