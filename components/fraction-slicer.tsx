"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";

export function FractionSlicer() {
  const [parts, setParts] = useState(4);
  const [slices, setSlices] = useState<number[]>([0]);
  const selected = slices.length;

  function changeParts(value: number) {
    const next = Math.min(8, Math.max(2, value));
    setParts(next);
    setSlices((current) => current.filter((index) => index < next));
  }

  return (
    <section className="fraction-widget" aria-label="Visualiseur de fractions">
      <div className="fraction-widget-copy">
        <span>Laboratoire visuel</span>
        <h3>Découpe la pizza</h3>
        <p>Choisis le nombre de parts, puis touche-les pour changer la quantité.</p>
        <div className="fraction-controls">
          <button type="button" onClick={() => changeParts(parts - 1)} disabled={parts === 2} aria-label="Moins de parts"><Minus /></button>
          <strong>{parts} <small>parts</small></strong>
          <button type="button" onClick={() => changeParts(parts + 1)} disabled={parts === 8} aria-label="Plus de parts"><Plus /></button>
        </div>
      </div>
      <div className="slicer-visual">
        <svg viewBox="0 0 260 260" role="group" aria-label={`Pizza représentant ${selected} sur ${parts}`}>
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
                aria-label={`Part ${index + 1} sur ${parts}`}
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
