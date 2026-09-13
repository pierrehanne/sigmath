"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Lightbulb, RotateCcw } from "lucide-react";

export function HomeChallenge() {
  const [selected, setSelected] = useState<number[]>([0, 1, 2]);
  const [checked, setChecked] = useState(false);
  const [hint, setHint] = useState(false);
  const correct = selected.length === 4;

  return (
    <section className="home-challenge" aria-labelledby="challenge-title">
      <div className="challenge-topline"><span>LE DÉCLIC DU JOUR</span><span>CM1–6e · 2 min</span></div>
      <h2 id="challenge-title">La moitié, ça fait combien ?</h2>
      <p>Cette tablette a 8 carrés égaux. Sélectionne la moitié de la tablette.</p>
      <div className="chocolate-grid" role="group" aria-label="Les 8 carrés de chocolat">
        {Array.from({ length: 8 }, (_, i) => (
          <button key={i} type="button" aria-label={`Carré ${i + 1}`} aria-pressed={selected.includes(i)} onClick={() => {
            setSelected((current) => current.includes(i) ? current.filter((n) => n !== i) : [...current, i]);
            setChecked(false);
          }}><span aria-hidden="true">{selected.includes(i) ? "✓" : "+"}</span></button>
        ))}
      </div>
      <p className="challenge-count" aria-live="polite"><strong>{selected.length} / 8</strong> carrés sélectionnés</p>
      <div className="challenge-actions">
        <button type="button" className="button button--primary" onClick={() => setChecked(true)}>Vérifier <ArrowRight size={16} /></button>
        <button type="button" className="challenge-hint" aria-expanded={hint} onClick={() => setHint((value) => !value)}><Lightbulb size={17} />{hint ? "Masquer l’indice" : "Un indice ?"}</button>
      </div>
      {hint && <p className="challenge-feedback">La moitié, c’est partager en deux groupes égaux. Combien font 8 ÷ 2 ?</p>}
      <div aria-live="polite">
        {checked && <div className={`challenge-feedback ${correct ? "is-correct" : ""}`}>
          <strong>{correct ? "Oui, tu as compris !" : "Pas encore, essaie à nouveau."}</strong>
          <p>{correct ? "8 ÷ 2 = 4. Tu as choisi 4 carrés sur 8 : 4/8 = 1/2. Les 4 autres forment l’autre moitié." : `Tu as choisi ${selected.length} carrés ; il en reste ${8 - selected.length}. Pour faire deux moitiés, les deux groupes doivent avoir le même nombre de carrés.`}</p>
          {correct && <Link href="/fr/cycle-3/numbers/fractions-measure-quotient">Continuer avec les fractions <ArrowRight size={15} /></Link>}
        </div>}
      </div>
      <button className="challenge-reset" type="button" onClick={() => { setSelected([]); setChecked(false); setHint(false); }}><RotateCcw size={13} />Recommencer</button>
    </section>
  );
}
