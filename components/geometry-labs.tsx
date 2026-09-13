"use client";

import { useState } from "react";
import { formatNumber, triangleAngles } from "@/lib/lab-math";
import type { Locale } from "@/lib/site";
import { LabSlider, VisualLab } from "./visual-lab";

type Props = { locale: Locale };

export function SolidLab({ locale }: Props) {
  const [width, setWidth] = useState(3);
  const [depth, setDepth] = useState(2);
  const [height, setHeight] = useState(2);
  const [layer, setLayer] = useState(2);
  const fr = locale === "fr";
  // Draw back to front and bottom to top so each cube occludes its neighbours correctly.
  const cubes = Array.from({ length: width * depth * layer }, (_, i) => ({ x: i % width, y: Math.floor(i / width) % depth, z: Math.floor(i / (width * depth)) })).sort((a, b) => a.z - b.z || a.x + a.y - b.x - b.y);
  return <VisualLab locale={locale} title={fr ? "Construis avec des cubes" : "Build with cubes"} instruction={fr ? "Change les dimensions, puis révèle les couches. Chaque cube vaut 1 cm³." : "Change the dimensions, then reveal the layers. Each cube is 1 cm³."}>
    <svg className="lab-svg solid-view" viewBox="0 0 340 320" role="img" aria-label={`${width} × ${depth} × ${height} = ${width * depth * height} cm³, ${layer} ${fr ? "couches visibles" : "visible layers"}`}>
      {cubes.map(({ x, y, z }) => {
        const px = 170 + (x - y) * 26;
        const py = 170 + (x + y) * 13 - z * 28;
        return <g key={`${x}-${y}-${z}`} data-cube="true"><path className="cube-top" d={`M${px} ${py - 26}l26 13 -26 13 -26 -13Z`} /><path className="cube-left" d={`M${px - 26} ${py - 13}l26 13v28l-26 -13Z`} /><path className="cube-right" d={`M${px} ${py}l26 -13v28l-26 13Z`} /></g>;
      })}
    </svg>
    <output className="visual-result" aria-live="polite">{width} × {depth} × {height} = {width * depth * height} cm³<small>{layer}/{height} {fr ? "couches visibles" : "visible layers"} · {width === depth && depth === height ? (fr ? "Cube" : "Cube") : (fr ? "Pavé droit" : "Cuboid")} · 6 {fr ? "faces" : "faces"}, 12 {fr ? "arêtes" : "edges"}, 8 {fr ? "sommets" : "vertices"}</small></output>
    <div className="visual-controls"><LabSlider label={fr ? "Longueur" : "Length"} min={1} max={4} value={width} onChange={setWidth} /><LabSlider label={fr ? "Profondeur" : "Depth"} min={1} max={4} value={depth} onChange={setDepth} /><LabSlider label={fr ? "Hauteur" : "Height"} min={1} max={4} value={height} onChange={(value) => { setHeight(value); setLayer(value); }} /><LabSlider label={fr ? "Couches visibles" : "Visible layers"} min={1} max={height} value={layer} onChange={setLayer} /></div>
  </VisualLab>;
}

export function SymmetryLab({ locale }: Props) {
  const [cells, setCells] = useState<number[]>([1, 5, 6, 9]);
  const fr = locale === "fr";
  return <VisualLab locale={locale} title={fr ? "Le miroir des formes" : "The shape mirror"} instruction={fr ? "Colorie à gauche. L’image se construit à la même distance de l’axe, à droite." : "Colour on the left. The image appears at the same distance from the axis on the right."}>
    <div className="symmetry-grid" role="group" aria-label={fr ? "Grille de symétrie" : "Symmetry grid"}>{Array.from({ length: 32 }, (_, index) => {
      const row = Math.floor(index / 8);
      const col = index % 8;
      const cell = row * 4 + (col < 4 ? col : 7 - col);
      const filled = cells.includes(cell);
      return col < 4 ? <button className={filled ? "filled" : ""} type="button" key={index} aria-pressed={filled} aria-label={`${fr ? "Ligne" : "Row"} ${row + 1}, ${fr ? "colonne" : "column"} ${col + 1}`} onClick={() => setCells((current) => current.includes(cell) ? current.filter((value) => value !== cell) : [...current, cell])}>{filled ? "●" : ""}</button> : <span key={index} className={filled ? "filled mirror" : "mirror"} aria-hidden="true">{filled ? "●" : ""}</span>;
    })}</div>
    <output className="visual-result" aria-live="polite">{cells.length} ↔ {cells.length}<small>{fr ? "Autant de cases de chaque côté de l’axe." : "The same number of squares on each side of the axis."}</small></output>
    <button className="visual-reset" type="button" onClick={() => setCells([])}>{fr ? "Tout effacer" : "Clear all"}</button>
  </VisualLab>;
}

export function TriangleLab({ locale }: Props) {
  const [x, setX] = useState(50);
  const [height, setHeight] = useState(65);
  const angles = triangleAngles(x, height);
  const fr = locale === "fr";
  const labels = angles.map((angle) => `${formatNumber(angle, locale, 1)}°`);
  return <VisualLab locale={locale} title={fr ? "Le triangle qui se transforme" : "The changing triangle"} instruction={fr ? "Déplace le sommet C. Les trois angles gardent une somme de 180°." : "Move vertex C. The three angles still add up to 180°."}>
    <svg className="lab-svg" viewBox="0 0 360 280" role="img" aria-label={`A ${labels[0]}, B ${labels[1]}, C ${labels[2]}`}><path d={`M40 230H320L${40 + x * 2.8} ${230 - height * 2}Z`} className="triangle-fill" /><text x={25} y={255}>A</text><text x={322} y={255}>B</text><text x={40 + x * 2.8} y={215 - height * 2} textAnchor="middle">C</text></svg>
    <div className="triangle-angle-bar" aria-hidden="true">{angles.map((angle, index) => <span key={index} style={{ flex: angle }}>{["A", "B", "C"][index]}</span>)}</div>
    <output className="visual-result" aria-live="polite"><span className="triangle-sum">{labels.join(" + ")} = 180°</span><small>{fr ? "Mesures arrondies au dixième de degré." : "Measurements rounded to one decimal place."}</small></output>
    <div className="visual-controls"><LabSlider label={fr ? "Position horizontale de C" : "Horizontal position of C"} min={0} max={100} value={x} onChange={setX} /><LabSlider label={fr ? "Hauteur de C" : "Height of C"} min={20} max={90} value={height} onChange={setHeight} /></div>
  </VisualLab>;
}

export function FunctionLab({ locale }: Props) {
  const [a, setA] = useState(2);
  const [b, setB] = useState(1);
  const [x, setX] = useState(1);
  const y = a * x + b;
  const px = (value: number) => 180 + value * 44;
  const py = (value: number) => 160 - value * 11;
  const fr = locale === "fr";
  return <VisualLab locale={locale} title={fr ? "La machine à fonctions" : "The function machine"} instruction={fr ? "Change a et b, puis choisis x. Le point relie l’entrée x à la sortie ax + b." : "Change a and b, then choose x. The point links input x to output ax + b."}>
    <svg className="lab-svg" viewBox="0 0 360 330" role="img" aria-label={`f(${x}) = ${y}`}>
      {[-3, -2, -1, 1, 2, 3].map((n) => <g key={n}><path d={`M${px(n)} 28V292`} className="lab-gridline" /><text x={px(n)} y={178} textAnchor="middle">{n}</text></g>)}
      {[-12, -6, 6, 12].map((n) => <g key={n}><path d={`M48 ${py(n)}H312`} className="lab-gridline" /><text x={164} y={py(n) + 5} textAnchor="end">{n}</text></g>)}
      <path d="M35 160H328M180 20V302" className="lab-axis" /><text x={330} y={156}>x</text><text x={192} y={20}>y</text>
      <path d={`M${px(-3)} ${py(a * -3 + b)}L${px(3)} ${py(a * 3 + b)}`} className="lab-line-accent" />
      <path d={`M${px(x)} 160V${py(y)}H180`} className="lab-projection" /><circle cx={px(x)} cy={py(y)} r={7} className="lab-point-b" />
    </svg>
    <output className="visual-result" aria-live="polite">{x} → {a} × ({x}) {b < 0 ? "−" : "+"} {Math.abs(b)} → {y}<small>f(x) = {a}x {b < 0 ? "−" : "+"} {Math.abs(b)}</small></output>
    <div className="visual-controls"><LabSlider label="a" min={-3} max={3} value={a} onChange={setA} /><LabSlider label="b" min={-3} max={3} value={b} onChange={setB} /><LabSlider label="x" min={-3} max={3} value={x} onChange={setX} /></div>
  </VisualLab>;
}

export function VectorLab({ locale }: Props) {
  const [ux, setUx] = useState(3);
  const [uy, setUy] = useState(1);
  const [vx, setVx] = useState(-1);
  const [vy, setVy] = useState(2);
  const fr = locale === "fr";
  const px = (value: number) => 180 + value * 22;
  const py = (value: number) => 180 - value * 22;
  const vector = (x1: number, y1: number, x2: number, y2: number, className: string) => {
    const angle = Math.atan2(py(y2) - py(y1), px(x2) - px(x1));
    return <g className={className}><path d={`M${px(x1)} ${py(y1)}L${px(x2)} ${py(y2)}`} />{x1 !== x2 || y1 !== y2 ? <path d={`M${px(x2) - 9 * Math.cos(angle - .5)} ${py(y2) - 9 * Math.sin(angle - .5)}L${px(x2)} ${py(y2)}L${px(x2) - 9 * Math.cos(angle + .5)} ${py(y2) - 9 * Math.sin(angle + .5)}`} /> : <circle cx={px(x2)} cy={py(y2)} r={4} />}</g>;
  };
  return <VisualLab locale={locale} title={fr ? "Additionner des déplacements" : "Add displacements"} instruction={fr ? "Place v au bout de u. La somme relie le départ à l’arrivée." : "Place v at the tip of u. The sum links the start to the finish."}>
    <svg className="lab-svg" viewBox="0 0 360 360" role="img" aria-label={`u (${ux}, ${uy}), v (${vx}, ${vy}), u + v (${ux + vx}, ${uy + vy})`}>
      {Array.from({ length: 13 }, (_, i) => <g key={i}><path d={`M${px(i - 6)} 48V312M48 ${py(i - 6)}H312`} className="lab-gridline" />{i % 3 === 0 ? <><text x={px(i - 6)} y={333} textAnchor="middle">{i - 6}</text><text x={29} y={py(i - 6) + 5} textAnchor="middle">{i - 6}</text></> : null}</g>)}
      <path d="M35 180H325M180 35V325" className="lab-axis" />
      {vector(0, 0, ux + vx, uy + vy, "vector-sum")}{vector(0, 0, ux, uy, "vector-u")}{vector(ux, uy, ux + vx, uy + vy, "vector-v")}
    </svg>
    <div className="vector-legend"><span>u</span><span>v</span><span>u + v</span></div>
    <output className="visual-result" aria-live="polite">({ux} ; {uy}) + ({vx} ; {vy}) = ({ux + vx} ; {uy + vy})</output>
    <div className="visual-controls"><LabSlider label="u : x" min={-3} max={3} value={ux} onChange={setUx} /><LabSlider label="u : y" min={-3} max={3} value={uy} onChange={setUy} /><LabSlider label="v : x" min={-3} max={3} value={vx} onChange={setVx} /><LabSlider label="v : y" min={-3} max={3} value={vy} onChange={setVy} /></div>
  </VisualLab>;
}
