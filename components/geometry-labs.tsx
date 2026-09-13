"use client";

import { useState } from "react";
import { formatNumber, triangleAngles } from "@/lib/lab-math";
import { LabSlider, VisualLab } from "./visual-lab";

export function SolidLab() {
  const [width, setWidth] = useState(3);
  const [depth, setDepth] = useState(2);
  const [height, setHeight] = useState(2);
  const [layer, setLayer] = useState(2);
  // Draw back to front and bottom to top so each cube occludes its neighbours correctly.
  const cubes = Array.from({ length: width * depth * layer }, (_, i) => ({ x: i % width, y: Math.floor(i / width) % depth, z: Math.floor(i / (width * depth)) })).sort((a, b) => a.z - b.z || a.x + a.y - b.x - b.y);
  return <VisualLab title="Construis avec des cubes" instruction="Change les dimensions, puis révèle les couches. Chaque cube vaut 1 cm³.">
    <svg className="lab-svg solid-view" viewBox="0 0 340 320" role="img" aria-label={`${width} × ${depth} × ${height} = ${width * depth * height} cm³, ${layer} couches visibles`}>
      {cubes.map(({ x, y, z }) => {
        const px = 170 + (x - y) * 26;
        const py = 170 + (x + y) * 13 - z * 28;
        return <g key={`${x}-${y}-${z}`} data-cube="true"><path className="cube-top" d={`M${px} ${py - 26}l26 13 -26 13 -26 -13Z`} /><path className="cube-left" d={`M${px - 26} ${py - 13}l26 13v28l-26 -13Z`} /><path className="cube-right" d={`M${px} ${py}l26 -13v28l-26 13Z`} /></g>;
      })}
    </svg>
    <output className="visual-result" aria-live="polite">{width} × {depth} × {height} = {width * depth * height} cm³<small>{layer}/{height} couches visibles · {width === depth && depth === height ? "Cube" : "Pavé droit"} · 6 faces, 12 arêtes, 8 sommets</small></output>
    <div className="visual-controls"><LabSlider label="Longueur" min={1} max={4} value={width} onChange={setWidth} /><LabSlider label="Profondeur" min={1} max={4} value={depth} onChange={setDepth} /><LabSlider label="Hauteur" min={1} max={4} value={height} onChange={(value) => { setHeight(value); setLayer(value); }} /><LabSlider label="Couches visibles" min={1} max={height} value={layer} onChange={setLayer} /></div>
  </VisualLab>;
}

export function SymmetryLab() {
  const [cells, setCells] = useState<number[]>([1, 5, 6, 9]);
  return <VisualLab title="Le miroir des formes" instruction="Colorie à gauche. L’image se construit à la même distance de l’axe, à droite.">
    <div className="symmetry-grid" role="group" aria-label="Grille de symétrie">{Array.from({ length: 32 }, (_, index) => {
      const row = Math.floor(index / 8);
      const col = index % 8;
      const cell = row * 4 + (col < 4 ? col : 7 - col);
      const filled = cells.includes(cell);
      return col < 4 ? <button className={filled ? "filled" : ""} type="button" key={index} aria-pressed={filled} aria-label={`Ligne ${row + 1}, colonne ${col + 1}`} onClick={() => setCells((current) => current.includes(cell) ? current.filter((value) => value !== cell) : [...current, cell])}>{filled ? "●" : ""}</button> : <span key={index} className={filled ? "filled mirror" : "mirror"} aria-hidden="true">{filled ? "●" : ""}</span>;
    })}</div>
    <output className="visual-result" aria-live="polite">{cells.length} ↔ {cells.length}<small>Autant de cases de chaque côté de l’axe.</small></output>
    <button className="visual-reset" type="button" onClick={() => setCells([])}>Tout effacer</button>
  </VisualLab>;
}

export function TriangleLab() {
  const [x, setX] = useState(50);
  const [height, setHeight] = useState(65);
  const angles = triangleAngles(x, height);
  const labels = angles.map((angle) => `${formatNumber(angle, 1)}°`);
  return <VisualLab title="Le triangle qui se transforme" instruction="Déplace le sommet C. Les trois angles gardent une somme de 180°.">
    <svg className="lab-svg" viewBox="0 0 360 280" role="img" aria-label={`A ${labels[0]}, B ${labels[1]}, C ${labels[2]}`}><path d={`M40 230H320L${40 + x * 2.8} ${230 - height * 2}Z`} className="triangle-fill" /><text x={25} y={255}>A</text><text x={322} y={255}>B</text><text x={40 + x * 2.8} y={215 - height * 2} textAnchor="middle">C</text></svg>
    <div className="triangle-angle-bar" aria-hidden="true">{angles.map((angle, index) => <span key={index} style={{ flex: angle }}>{["A", "B", "C"][index]}</span>)}</div>
    <output className="visual-result" aria-live="polite"><span className="triangle-sum">{labels.join(" + ")} = 180°</span><small>Mesures arrondies au dixième de degré.</small></output>
    <div className="visual-controls"><LabSlider label="Position horizontale de C" min={0} max={100} value={x} onChange={setX} /><LabSlider label="Hauteur de C" min={20} max={90} value={height} onChange={setHeight} /></div>
  </VisualLab>;
}
