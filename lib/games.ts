export type GameId = "fractions" | "number-line" | "area";

type FractionChallenge = { kind: "fractions"; numerator: number; denominator: number; parts: number };
// Integer tenths keep decimal answers exact, including 0.3 and 0.7.
type LineChallenge = { kind: "number-line"; tenths: number };
type AreaChallenge = { kind: "area"; area: number };
export type Challenge = FractionChallenge | LineChallenge | AreaChallenge;

export const games = [
  { id: "fractions", title: "Le goûter à partager", concept: "Fractions · CM1–6e", description: "Colorie des parts et découvre les fractions équivalentes.", lesson: "cycle-3/numbers/fractions-measure-quotient" },
  { id: "number-line", title: "Le saut des décimaux", concept: "Décimaux · CM1–6e", description: "Place un nombre et vois sa distance à zéro.", lesson: "cycle-3/numbers/decimal-numbers" },
  { id: "area", title: "Le jardin quadrillé", concept: "Aires · CM1–6e", description: "Construis un rectangle et compte les mètres carrés.", lesson: "cycle-3/measures/areas" },
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

export function decimal(tenths: number) {
  return (tenths / 10).toFixed(1).replace(".", ",");
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

export function challengePrompt(challenge: Challenge) {
  switch (challenge.kind) {
    case "fractions": return `Colorie ${challenge.numerator}/${challenge.denominator} du goûter.`;
    case "number-line": return `Place le repère sur ${decimal(challenge.tenths)}.`;
    case "area": return `Construis un jardin de ${challenge.area} m².`;
  }
}

export function challengeHint(challenge: Challenge) {
  switch (challenge.kind) {
    case "fractions": return `Les ${challenge.parts} parts sont égales. Partage-les en ${challenge.denominator} groupes égaux, puis prends ${challenge.numerator} groupe(s).`;
    case "number-line": return "Entre deux entiers, il y a 10 petits pas. Chaque pas vaut un dixième (0,1).";
    case "area": return `Chaque case mesure 1 m². Cherche deux nombres dont le produit vaut ${challenge.area}. Plusieurs rectangles peuvent convenir !`;
  }
}

export function answerFeedback(challenge: Challenge, first: number, second: number) {
  const correct = evaluateAnswer(challenge, first, second);
  switch (challenge.kind) {
    case "fractions":
      if (correct) return `${first}/${challenge.parts} = ${challenge.numerator}/${challenge.denominator} : la même quantité, avec des parts plus petites.`;
      return `Tu as colorié ${first} part(s) sur ${challenge.parts}. ${first * challenge.denominator < challenge.numerator * challenge.parts ? "Ajoute" : "Retire"} des parts pour atteindre ${challenge.numerator}/${challenge.denominator}.`;
    case "number-line":
      if (correct) return `${decimal(first)} = ${first}/10 : ${first} pas d’un dixième depuis zéro.`;
      return `Ton repère est sur ${decimal(first)}. Avance vers la ${first < challenge.tenths ? "droite" : "gauche"} pour atteindre ${decimal(challenge.tenths)}.`;
    case "area":
      if (correct) return `${first} × ${second} = ${challenge.area} m². L’aire compte les cases à l’intérieur ; le périmètre mesure le contour (${2 * (first + second)} m ici).`;
      return `Ton jardin contient ${first} × ${second} = ${first * second} cases de 1 m². C’est ${first * second < challenge.area ? "moins" : "plus"} que ${challenge.area} : ajuste ses côtés.`;
  }
}
