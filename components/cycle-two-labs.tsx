"use client";

import { Minus, Plus, RotateCcw } from "lucide-react";
import { useState } from "react";

const text = {
  visualLab: "Laboratoire visuel",
  numberTitle: "Le jardin des dizaines",
  numberCopy: "Fais varier le nombre. Les fleurs se rangent automatiquement par bouquets de dix.",
  tens: "dizaines",
  ones: "unités",
  shareTitle: "Le goûter à partager",
  shareCopy: "Répartis les biscuits équitablement et observe ce qu’il reste.",
  children: "enfants",
  each: "chacun",
  remainder: "reste",
  clockTitle: "L’horloge voyageuse",
  clockCopy: "Déplace l’heure et la durée pour voir les aiguilles avancer.",
  start: "départ",
  duration: "durée",
  result: "arrivée",
  minutes: "minutes",
  shapeTitle: "Le détective des formes",
  shapeCopy: "Choisis une figure et observe les propriétés qui permettent de la reconnaitre.",
  sides: "côtés",
  vertices: "sommets",
  rightAngles: "angles droits",
  dataTitle: "L’enquête des fruits",
  dataCopy: "Ajoute un vote. Les barres gardent la même échelle : de 0 à 12 voix.",
  votes: "votes",
  reset: "Recommencer",
  lengthTitle: "La règle magique",
  lengthCopy: "Fais grandir le ruban puis lis sa mesure sur la règle.",
  measured: "longueur mesurée",
};

function LabIntro({ kicker, title, copy }: { kicker: string; title: string; copy: string }) {
  return <div className="kid-lab-intro"><span>{kicker}</span><h3>{title}</h3><p>{copy}</p></div>;
}

export function NumberGarden() {
  const [value, setValue] = useState(34);
  const t = text;
  const tens = Math.floor(value / 10);
  const ones = value % 10;

  return (
    <section className="kid-lab kid-lab--garden" aria-label={t.numberTitle}>
      <LabIntro kicker={t.visualLab} title={t.numberTitle} copy={t.numberCopy} />
      <div className="number-garden-stage">
        <div className="flower-groups" aria-hidden="true">
          {Array.from({ length: tens }, (_, group) => <span className="flower-ten" key={group}>{Array.from({ length: 10 }, (_, flower) => <i key={flower}>✿</i>)}</span>)}
          <span className="flower-ones">{Array.from({ length: ones }, (_, flower) => <i key={flower}>✿</i>)}</span>
        </div>
        <output className="place-value-readout" aria-live="polite">
          <strong>{value}</strong>
          <span><b>{tens}</b> {t.tens}</span><span>+</span><span><b>{ones}</b> {t.ones}</span>
        </output>
        <input aria-label="Nombre de fleurs" type="range" min="0" max="99" value={value} onChange={(event) => setValue(Number(event.target.value))} />
      </div>
    </section>
  );
}

export function SharingLab() {
  const [items, setItems] = useState(14);
  const [people, setPeople] = useState(4);
  const t = text;
  const each = Math.floor(items / people);
  const remainder = items % people;

  return (
    <section className="kid-lab kid-lab--sharing" aria-label={t.shareTitle}>
      <LabIntro kicker={t.visualLab} title={t.shareTitle} copy={t.shareCopy} />
      <div className="sharing-stage">
        <div className="sharing-people" aria-hidden="true">
          {Array.from({ length: people }, (_, person) => <div key={person}><span>●</span><i>{Array.from({ length: each }, (_, item) => <b key={item}>●</b>)}</i></div>)}
        </div>
        <div className="sharing-remainder" aria-label={`${remainder} ${t.remainder}`}>{Array.from({ length: remainder }, (_, index) => <span key={index} aria-hidden="true">●</span>)}<small>{remainder} {t.remainder}</small></div>
        <div className="lab-steppers">
          <Stepper label="biscuits" value={items} min={4} max={24} onChange={setItems} />
          <span aria-hidden="true">÷</span>
          <Stepper label={t.children} value={people} min={2} max={6} onChange={setPeople} />
        </div>
        <output className="sharing-result" aria-live="polite"><strong>{each}</strong> {t.each} · <strong>{remainder}</strong> {t.remainder}</output>
      </div>
    </section>
  );
}

function Stepper({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (value: number) => void }) {
  return (
    <div className="lab-stepper">
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value === min} aria-label={`− ${label}`}><Minus /></button>
      <strong>{value}<small>{label}</small></strong>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value === max} aria-label={`+ ${label}`}><Plus /></button>
    </div>
  );
}

function formatTime(minutes: number) {
  const normalized = minutes % (24 * 60);
  return `${String(Math.floor(normalized / 60)).padStart(2, "0")}:${String(normalized % 60).padStart(2, "0")}`;
}

function ClockFace({ minutes, label }: { minutes: number; label: string }) {
  const hourAngle = ((minutes / 60) % 12) * 30;
  const minuteAngle = (minutes % 60) * 6;
  return (
    <div className="clock-wrap">
      <svg viewBox="0 0 220 220" role="img" aria-label={`${label} ${formatTime(minutes)}`}>
        <circle cx="110" cy="110" r="96" className="clock-face" />
        {Array.from({ length: 12 }, (_, index) => <line key={index} x1="110" y1="27" x2="110" y2="35" className="clock-dot" transform={`rotate(${index * 30} 110 110)`} />)}
        <line x1="110" y1="110" x2="110" y2="53" className="clock-hand clock-hand--hour" transform={`rotate(${hourAngle} 110 110)`} />
        <line x1="110" y1="110" x2="110" y2="34" className="clock-hand clock-hand--minute" transform={`rotate(${minuteAngle} 110 110)`} />
        <circle cx="110" cy="110" r="6" className="clock-pin" />
      </svg>
      <strong>{formatTime(minutes)}</strong><span>{label}</span>
    </div>
  );
}

export function ClockLab() {
  const [start, setStart] = useState(8 * 60 + 15);
  const [duration, setDuration] = useState(45);
  const t = text;

  return (
    <section className="kid-lab kid-lab--clock" aria-label={t.clockTitle}>
      <LabIntro kicker={t.visualLab} title={t.clockTitle} copy={t.clockCopy} />
      <div className="clock-stage">
        <ClockFace minutes={start} label={t.start} /><span className="clock-plus">+ {duration} min</span><ClockFace minutes={start + duration} label={t.result} />
      </div>
      <div className="clock-sliders">
        <label>{t.start}<input type="range" min="360" max="1080" step="15" value={start} aria-valuetext={formatTime(start)} onChange={(event) => setStart(Number(event.target.value))} /></label>
        <label>{t.duration}: {duration} {t.minutes}<input type="range" min="15" max="180" step="15" value={duration} aria-valuetext={`${duration} ${t.minutes}`} onChange={(event) => setDuration(Number(event.target.value))} /></label>
      </div>
    </section>
  );
}

const shapes = {
  square: { sides: 4, vertices: 4, rightAngles: 4, path: "M55 35 H185 V165 H55 Z" },
  rectangle: { sides: 4, vertices: 4, rightAngles: 4, path: "M35 55 H205 V145 H35 Z" },
  triangle: { sides: 3, vertices: 3, rightAngles: 0, path: "M120 26 L212 166 H28 Z" },
  "right-triangle": { sides: 3, vertices: 3, rightAngles: 1, path: "M45 28 V168 H205 Z" },
  diamond: { sides: 4, vertices: 4, rightAngles: 0, path: "M120 22 L212 100 L120 178 L28 100 Z" },
};

const shapeLabels = { square: "carré", rectangle: "rectangle", triangle: "triangle", "right-triangle": "triangle rectangle", diamond: "losange" };

export function ShapeLab() {
  const [shape, setShape] = useState<keyof typeof shapes>("square");
  const t = text;
  const labels = shapeLabels;
  const current = shapes[shape];

  return (
    <section className="kid-lab kid-lab--shape" aria-label={t.shapeTitle}>
      <LabIntro kicker={t.visualLab} title={t.shapeTitle} copy={t.shapeCopy} />
      <div className="shape-stage">
        <svg viewBox="0 0 240 200" role="img" aria-label={labels[shape]}><path d={current.path} /></svg>
        <output><strong>{labels[shape]}</strong><span>{current.sides} {t.sides}</span><span>{current.vertices} {t.vertices}</span><span>{current.rightAngles} {t.rightAngles}</span></output>
      </div>
      <div className="shape-tabs" role="group" aria-label="Choisir une figure">
        {(Object.keys(shapes) as (keyof typeof shapes)[]).map((key) => <button type="button" className={key === shape ? "active" : ""} aria-pressed={key === shape} onClick={() => setShape(key)} key={key}>{labels[key]}</button>)}
      </div>
    </section>
  );
}

export function LengthLab() {
  const [length, setLength] = useState(7);
  const t = text;
  return (
    <section className="kid-lab kid-lab--length" aria-label={t.lengthTitle}>
      <LabIntro kicker={t.visualLab} title={t.lengthTitle} copy={t.lengthCopy} />
      <div className="ruler-stage">
        <svg className="ruler-visual" viewBox="0 0 440 110" role="img" aria-label={`${length} cm`}>
          <rect x={20} y={15} width={length * 40} height={26} rx={3} fill="#b83f30" />
          <path d="M20 60H420" stroke="#173e48" strokeWidth={2} />
          {Array.from({ length: 11 }, (_, value) => <g key={value}><path d={`M${20 + value * 40} 55v18`} stroke="#173e48" strokeWidth={2} /><text x={20 + value * 40} y={96} textAnchor="middle">{value}</text></g>)}
        </svg>
        <output aria-live="polite"><strong>{length}</strong> cm <small>{t.measured}</small></output>
        <input type="range" min="1" max="10" value={length} onChange={(event) => setLength(Number(event.target.value))} aria-label={t.measured} />
      </div>
    </section>
  );
}

export function DataLab() {
  const [values, setValues] = useState([4, 7, 3, 5]);
  const t = text;
  const fruits = ["Orange", "Fraise", "Banane", "Kiwi"];
  const icons = ["🍊", "🍓", "🍌", "🥝"];
  return (
    <section className="kid-lab kid-lab--data" aria-label={t.dataTitle}>
      <LabIntro kicker={t.visualLab} title={t.dataTitle} copy={t.dataCopy} />
      <div className="chart-stage">
        {values.map((value, index) => <button type="button" disabled={value === 12} onClick={() => setValues((current) => current.map((item, itemIndex) => itemIndex === index ? Math.min(12, item + 1) : item))} key={fruits[index]} aria-label={`+ 1 ${fruits[index]}, ${value} ${t.votes}`}><span style={{ height: `${(value / 12) * 100}%` }}><b>{value}</b></span><i>{icons[index]}</i><small>{fruits[index]}</small></button>)}
      </div>
      <output className="fruit-totals" aria-live="polite">{values.map((value, index) => `${fruits[index]} : ${value}`).join(" · ")}</output>
      <button type="button" className="lab-reset" onClick={() => setValues([4, 7, 3, 5])}><RotateCcw />{t.reset}</button>
    </section>
  );
}
