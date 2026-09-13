"use client";

import { Check, Lightbulb, RotateCcw } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

export function Callout({ title, children }: { title: string; children: ReactNode }) {
  return <aside className="lesson-callout"><Lightbulb /><div><strong>{title}</strong><div className="callout-body">{children}</div></div></aside>;
}

export function QuickCheck({ answer, locale = "fr" }: { answer: string; locale?: "fr" | "en" }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className={`quick-check ${revealed ? "is-revealed" : ""}`}>
      <div><span>{locale === "fr" ? "Vérification rapide" : "Quick check"}</span><strong>{revealed ? answer : "?"}</strong></div>
      <button type="button" onClick={() => setRevealed((value) => !value)}>
        {revealed ? <RotateCcw /> : <Check />}
        {revealed ? (locale === "fr" ? "Masquer" : "Hide") : (locale === "fr" ? "Voir la réponse" : "Reveal answer")}
      </button>
    </div>
  );
}
