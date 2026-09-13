"use client";

import { Check, Lightbulb, RotateCcw } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

export function Callout({ title, children }: { title: string; children: ReactNode }) {
  return <aside className="lesson-callout"><Lightbulb /><div><strong>{title}</strong><div className="callout-body">{children}</div></div></aside>;
}

export function QuickCheck({ answer }: { answer: string }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className={`quick-check ${revealed ? "is-revealed" : ""}`}>
      <div><span>Vérification rapide</span><strong>{revealed ? answer : "?"}</strong></div>
      <button type="button" onClick={() => setRevealed((value) => !value)}>
        {revealed ? <RotateCcw /> : <Check />}
        {revealed ? "Masquer" : "Voir la réponse"}
      </button>
    </div>
  );
}
