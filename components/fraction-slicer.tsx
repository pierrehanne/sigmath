"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";

export function FractionSlicer({ locale = "fr" }: { locale?: "fr" | "en" }) {
  const [parts, setParts] = useState(4);
  const [slices, setSlices] = useState<number[]>([0]);
  const selected = slices.length;

  function changeParts(value: number) {
    const next = Math.min(8, Math.max(2, value));
    setParts(next);
    setSlices((current) => current.filter((index) => index < next));
  }

  return (
    <section className="fraction-widget" aria-label={locale === "fr" ? "Visualiseur de fractions" : "Fraction visualizer"}>
      <div className="fraction-widget-copy">
        <span>{locale === "fr" ? "Laboratoire visuel" : "Visual lab"}</span>
        <h3>{locale === "fr" ? "Découpe la pizza" : "Slice the pizza"}</h3>
        <p>{locale === "fr" ? "Choisis le nombre de parts, puis touche-les pour changer la quantité." : "Choose the number of pieces, then tap them to change the amount."}</p>
        <div className="fraction-controls">
          <button type="button" onClick={() => changeParts(parts - 1)} disabled={parts === 2} aria-label={locale === "fr" ? "Moins de parts" : "Fewer slices"}><Minus /></button>
          <strong>{parts} <small>{locale === "fr" ? "parts" : "slices"}</small></strong>
          <button type="button" onClick={() => changeParts(parts + 1)} disabled={parts === 8} aria-label={locale === "fr" ? "Plus de parts" : "More slices"}><Plus /></button>
        </div>
      </div>
      <div className="slicer-visual">
        <svg viewBox="0 0 260 260" role="group" aria-label={locale === "fr" ? `Pizza représentant ${selected} sur ${parts}` : `Pizza showing ${selected} of ${parts}`}>
          <circle cx="130" cy="130" r="113" fill="#f3c14f" stroke="#d89c35" strokeWidth="9" />
          {Array.from({ length: parts }, (_, index) => {
            const angle = 360 / parts;
            const start = (index * angle - 90) * (Math.PI / 180);
            const end = ((index + 1) * angle - 90) * (Math.PI / 180);
            const x1 = 130 + 113 * Math.cos(start);
            const y1 = 130 + 113 * Math.sin(start);
            const x2 = 130 + 113 * Math.cos(end);
            const y2 = 130 + 113 * Math.sin(end);
            const selectedSlice = slices.includes(index);
            const selectSlice = () => setSlices((current) => current.includes(index) ? current.filter((slice) => slice !== index) : [...current, index]);
            return (
              <path
                key={index}
                d={`M130 130 L${x1} ${y1} A113 113 0 ${angle > 180 ? 1 : 0} 1 ${x2} ${y2} Z`}
                fill={selectedSlice ? "#ef6c4d" : "transparent"}
                stroke="#fff5db"
                strokeWidth="3"
                onClick={selectSlice}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    selectSlice();
                  }
                }}
                role="button"
                aria-pressed={selectedSlice}
                tabIndex={0}
                aria-label={locale === "fr" ? `Part ${index + 1} sur ${parts}` : `Slice ${index + 1} of ${parts}`}
                className="slicer-piece"
              />
            );
          })}
          <g fill="#b84b37" opacity=".9" pointerEvents="none" aria-hidden="true">
            <circle cx="92" cy="82" r="7" /><circle cx="165" cy="74" r="7" /><circle cx="181" cy="152" r="7" /><circle cx="94" cy="178" r="7" />
          </g>
        </svg>
        <div className="widget-fraction" aria-live="polite"><span>{selected}</span><i /><span>{parts}</span></div>
      </div>
    </section>
  );
}
