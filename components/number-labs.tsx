"use client";

import { useState } from "react";
import { formatNumber, moneyAmount } from "@/lib/lab-math";
import { LabSlider, VisualLab } from "./visual-lab";

export function PlaceValueLab({ large = false }: { large?: boolean }) {
  const [digits, setDigits] = useState(large ? [3, 2, 7, 0, 4, 5, 6, 0, 8] : [0, 3, 7, 2]);
  const value = digits.reduce((total, digit) => total * 10 + digit, 0);
  return <VisualLab title="La fabrique des nombres" instruction="Change un chiffre. Sa colonne change sa valeur.">
    <div className="place-columns">{digits.map((digit, index) => {
      const unit = 10 ** (digits.length - index - 1);
      return <label key={index}><span>× {formatNumber(unit)}</span><select aria-label={`Chiffre des ${formatNumber(unit)}`} value={digit} onChange={(event) => setDigits((current) => current.map((old, i) => i === index ? Number(event.target.value) : old))}>{Array.from({ length: 10 }, (_, option) => <option key={option}>{option}</option>)}</select><small>{formatNumber(digit * unit)}</small></label>;
    })}</div>
    <output className="visual-result" aria-live="polite">{formatNumber(value)}<small>{digits.map((digit, index) => digit ? formatNumber(digit * 10 ** (digits.length - index - 1)) : null).filter(Boolean).join(" + ") || "0"}</small></output>
  </VisualLab>;
}

export function CalculationLab({ multiply = false }: { multiply?: boolean }) {
  const [a, setA] = useState(8);
  const [b, setB] = useState(5);
  const [operation, setOperation] = useState<"+" | "−" | "×">(multiply ? "×" : "+");
  const result = operation === "+" ? a + b : operation === "−" ? a - b : a * b;
  function changeOperation(next: typeof operation) {
    setOperation(next);
    if (next === "−") setB((current) => Math.min(current, a));
  }
  const count = operation === "+" ? a + b : operation === "−" ? a : a * b;
  return <VisualLab title="Le calcul prend forme" instruction="Ajoute, barre ou forme des rangées. Chaque point vaut 1.">
    <div className="lab-options" role="group" aria-label="Opération">{(["+", "−", "×"] as const).map((op) => <button type="button" key={op} aria-pressed={operation === op} onClick={() => changeOperation(op)}>{op}</button>)}</div>
    <div className="calculation-dots" style={{ gridTemplateColumns: `repeat(${operation === "×" ? Math.max(b, 1) : 10}, 1fr)` }} role="img" aria-label={`${a} ${operation} ${b} = ${result}`}>
      {Array.from({ length: count }, (_, index) => <span key={index} className={operation === "−" && index >= result ? "is-removed" : operation === "+" && index >= a ? "is-added" : ""}>{operation === "−" && index >= result ? "×" : "●"}</span>)}
    </div>
    <output className="visual-result" aria-live="polite">{a} {operation} {b} = {result}</output>
    <div className="visual-controls"><LabSlider label="Premier nombre" min={0} max={12} value={a} onChange={(value) => { setA(value); if (operation === "−") setB((current) => Math.min(current, value)); }} /><LabSlider label="Deuxième nombre" min={0} max={operation === "−" ? a : 12} value={b} onChange={setB} /></div>
  </VisualLab>;
}

export function NumberLineLab({ signed = false }: { signed?: boolean }) {
  const [a, setA] = useState(signed ? -3 : 5);
  const [b, setB] = useState(signed ? 5 : 12);
  const min = signed ? -10 : 0;
  const max = signed ? 10 : 20;
  const x = (n: number) => 30 + (n - min) * 24;
  return <VisualLab title="Deux nombres, une distance" instruction="Déplace A et B. Vers la droite, les nombres augmentent.">
    <svg className="lab-svg number-comparison" viewBox="0 0 540 160" role="img" aria-label={`A = ${a}, B = ${b}, distance = ${Math.abs(b - a)}`}>
      <path d="M30 95H510" className="lab-axis" />
      {Array.from({ length: 21 }, (_, i) => <g key={i}><path d={`M${30 + i * 24} 90v10`} className="lab-axis" />{i % 5 === 0 ? <text x={30 + i * 24} y={125} textAnchor="middle">{min + i}</text> : null}</g>)}
      <path d={`M${x(a)} 62H${x(b)}`} className="lab-line-accent" />
      <circle cx={x(a)} cy={95} r={7} className="lab-point-a" /><circle cx={x(b)} cy={95} r={7} className="lab-point-b" />
      <text x={x(a)} y={40} textAnchor="middle">A</text><text x={x(b)} y={150} textAnchor="middle">B</text>
    </svg>
    <output className="visual-result" aria-live="polite">{a} {a === b ? "=" : a < b ? "<" : ">"} {b}<small>De A à B : {b - a > 0 ? "+" : ""}{b - a} · Distance : {Math.abs(b - a)}</small></output>
    <div className="visual-controls"><LabSlider label="A" min={min} max={max} value={a} onChange={setA} /><LabSlider label="B" min={min} max={max} value={b} onChange={setB} /></div>
  </VisualLab>;
}

export function MeasureLab() {
  const [amount, setAmount] = useState(750);
  const [mass, setMass] = useState(false);
  return <VisualLab title="Une quantité, deux unités" instruction="Remplis les unités. Chaque grand cadre vaut 1 L ou 1 kg.">
    <div className="lab-options" role="group" aria-label="Grandeur"><button type="button" aria-pressed={!mass} onClick={() => setMass(false)}>Contenance</button><button type="button" aria-pressed={mass} onClick={() => setMass(true)}>Masse</button></div>
    <div className={`measure-vessels ${mass ? "is-mass" : ""}`} role="img" aria-label={`${amount} ${mass ? "g" : "mL"}`}>{[0, 1, 2].map((index) => <div key={index}><div className="measure-vessel"><span style={{ height: `${Math.max(0, Math.min(1000, amount - index * 1000)) / 10}%` }} />{[25, 50, 75].map((position) => <i key={position} style={{ bottom: `${position}%` }} />)}</div><small>1 {mass ? "kg" : "L"}</small></div>)}</div>
    <output className="visual-result" aria-live="polite">{formatNumber(amount)} {mass ? "g" : "mL"} = {formatNumber(amount / 1000, 2)} {mass ? "kg" : "L"}</output>
    <LabSlider label={mass ? "Masse (g)" : "Volume (mL)"} min={0} max={3000} step={50} value={amount} onChange={setAmount} />
  </VisualLab>;
}

const coins = [200, 100, 50, 20, 10, 5];
export function StoryLab() {
  const [start, setStart] = useState(12);
  const [leave, setLeave] = useState(4);
  const [arrive, setArrive] = useState(6);
  const [step, setStep] = useState(0);
  const current = step === 0 ? start : step === 1 ? start - leave : start - leave + arrive;
  const labels = ["Au départ", "Des passagers descendent", "D’autres montent"];
  return <VisualLab title="L’histoire du bus" instruction="Choisis les quantités. Avance dans l’histoire pour voir chaque calcul.">
    <div className="lab-options" role="group" aria-label="Étape">{labels.map((label, index) => <button type="button" key={label} aria-pressed={step === index} onClick={() => setStep(index)}>{index + 1}. {label}</button>)}</div>
    <div className="bus-passengers" role="img" aria-label={`${current} passagers`}>{Array.from({ length: current }, (_, index) => <span key={index} className={step === 2 && index >= start - leave ? "new-passenger" : ""}>●</span>)}</div>
    <output className="visual-result" aria-live="polite">{step === 0 ? start : step === 1 ? `${start} − ${leave} = ${current}` : `${start - leave} + ${arrive} = ${current}`}<small>{current} passagers dans le bus</small></output>
    <div className="visual-controls"><LabSlider label="Au départ" min={1} max={20} value={start} onChange={(value) => { setStart(value); setLeave((old) => Math.min(old, value)); setStep(0); }} /><LabSlider label="Descendent" min={0} max={start} value={leave} onChange={(value) => { setLeave(value); setStep(0); }} /><LabSlider label="Montent" min={0} max={12} value={arrive} onChange={(value) => { setArrive(value); setStep(0); }} /></div>
  </VisualLab>;
}

export function MoneyLab() {
  const [wallet, setWallet] = useState<number[]>([]);
  const total = wallet.reduce((sum, coin) => sum + coin, 0);
  const target = 375;
  return <VisualLab title="Le petit marché" instruction="Prépare 3,75 €. Ajoute des pièces, puis touche une pièce du porte-monnaie pour la retirer.">
    <div className="lab-options coin-options">{coins.map((coin) => <button type="button" key={coin} disabled={wallet.length >= 20} onClick={() => setWallet((current) => [...current, coin])} aria-label={`Ajouter ${moneyAmount(coin)}`}>{moneyAmount(coin)}</button>)}</div>
    <div className="coin-wallet" role="group" aria-label="Porte-monnaie">{wallet.length ? wallet.map((coin, index) => <button type="button" key={index} onClick={() => setWallet((current) => current.filter((_, i) => i !== index))} aria-label={`Retirer ${moneyAmount(coin)}, ${index + 1}`}>{coin >= 100 ? `${coin / 100} €` : `${coin} c`}</button>) : <span>Ton porte-monnaie est vide.</span>}</div>
    <output className="visual-result" aria-live="polite">{moneyAmount(total)}<small>{total === target ? "Le compte est bon !" : total < target ? `Il manque ${moneyAmount(target - total)}` : `À rendre : ${moneyAmount(total - target)}`}</small></output>
    {wallet.length === 20 ? <p role="status">20 pièces maximum : retire des pièces pour en ajouter.</p> : null}
    <button className="visual-reset" type="button" onClick={() => setWallet([])}>Vider le porte-monnaie</button>
  </VisualLab>;
}
