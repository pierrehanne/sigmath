"use client";

import { useState } from "react";
import { formatNumber, moneyAmount } from "@/lib/lab-math";
import type { Locale } from "@/lib/site";
import { LabSlider, VisualLab } from "./visual-lab";

type Props = { locale: Locale };

export function PlaceValueLab({ locale, large = false }: Props & { large?: boolean }) {
  const [digits, setDigits] = useState(large ? [3, 2, 7, 0, 4, 5, 6, 0, 8] : [0, 3, 7, 2]);
  const value = digits.reduce((total, digit) => total * 10 + digit, 0);
  const fr = locale === "fr";
  return <VisualLab locale={locale} title={fr ? "La fabrique des nombres" : "The number factory"} instruction={fr ? "Change un chiffre. Sa colonne change sa valeur." : "Change a digit. Its column changes its value."}>
    <div className="place-columns">{digits.map((digit, index) => {
      const unit = 10 ** (digits.length - index - 1);
      return <label key={index}><span>× {formatNumber(unit, locale)}</span><select aria-label={fr ? `Chiffre des ${formatNumber(unit, locale)}` : `Digit in the ${formatNumber(unit, locale)} place`} value={digit} onChange={(event) => setDigits((current) => current.map((old, i) => i === index ? Number(event.target.value) : old))}>{Array.from({ length: 10 }, (_, option) => <option key={option}>{option}</option>)}</select><small>{formatNumber(digit * unit, locale)}</small></label>;
    })}</div>
    <output className="visual-result" aria-live="polite">{formatNumber(value, locale)}<small>{digits.map((digit, index) => digit ? formatNumber(digit * 10 ** (digits.length - index - 1), locale) : null).filter(Boolean).join(" + ") || "0"}</small></output>
  </VisualLab>;
}

export function CalculationLab({ locale, multiply = false }: Props & { multiply?: boolean }) {
  const [a, setA] = useState(8);
  const [b, setB] = useState(5);
  const [operation, setOperation] = useState<"+" | "−" | "×">(multiply ? "×" : "+");
  const fr = locale === "fr";
  const result = operation === "+" ? a + b : operation === "−" ? a - b : a * b;
  function changeOperation(next: typeof operation) {
    setOperation(next);
    if (next === "−") setB((current) => Math.min(current, a));
  }
  const count = operation === "+" ? a + b : operation === "−" ? a : a * b;
  return <VisualLab locale={locale} title={fr ? "Le calcul prend forme" : "See the calculation"} instruction={fr ? "Ajoute, barre ou forme des rangées. Chaque point vaut 1." : "Add, cross out or arrange rows. Each dot is 1."}>
    <div className="lab-options" role="group" aria-label={fr ? "Opération" : "Operation"}>{(["+", "−", "×"] as const).map((op) => <button type="button" key={op} aria-pressed={operation === op} onClick={() => changeOperation(op)}>{op}</button>)}</div>
    <div className="calculation-dots" style={{ gridTemplateColumns: `repeat(${operation === "×" ? Math.max(b, 1) : 10}, 1fr)` }} role="img" aria-label={`${a} ${operation} ${b} = ${result}`}>
      {Array.from({ length: count }, (_, index) => <span key={index} className={operation === "−" && index >= result ? "is-removed" : operation === "+" && index >= a ? "is-added" : ""}>{operation === "−" && index >= result ? "×" : "●"}</span>)}
    </div>
    <output className="visual-result" aria-live="polite">{a} {operation} {b} = {result}</output>
    <div className="visual-controls"><LabSlider label={fr ? "Premier nombre" : "First number"} min={0} max={12} value={a} onChange={(value) => { setA(value); if (operation === "−") setB((current) => Math.min(current, value)); }} /><LabSlider label={fr ? "Deuxième nombre" : "Second number"} min={0} max={operation === "−" ? a : 12} value={b} onChange={setB} /></div>
  </VisualLab>;
}

export function NumberLineLab({ locale, signed = false }: Props & { signed?: boolean }) {
  const [a, setA] = useState(signed ? -3 : 5);
  const [b, setB] = useState(signed ? 5 : 12);
  const min = signed ? -10 : 0;
  const max = signed ? 10 : 20;
  const x = (n: number) => 30 + (n - min) * 24;
  const fr = locale === "fr";
  return <VisualLab locale={locale} title={fr ? "Deux nombres, une distance" : "Two numbers, one distance"} instruction={fr ? "Déplace A et B. Vers la droite, les nombres augmentent." : "Move A and B. Numbers increase to the right."}>
    <svg className="lab-svg number-comparison" viewBox="0 0 540 160" role="img" aria-label={`A = ${a}, B = ${b}, ${fr ? "distance" : "distance"} = ${Math.abs(b - a)}`}>
      <path d="M30 95H510" className="lab-axis" />
      {Array.from({ length: 21 }, (_, i) => <g key={i}><path d={`M${30 + i * 24} 90v10`} className="lab-axis" />{i % 5 === 0 ? <text x={30 + i * 24} y={125} textAnchor="middle">{min + i}</text> : null}</g>)}
      <path d={`M${x(a)} 62H${x(b)}`} className="lab-line-accent" />
      <circle cx={x(a)} cy={95} r={7} className="lab-point-a" /><circle cx={x(b)} cy={95} r={7} className="lab-point-b" />
      <text x={x(a)} y={40} textAnchor="middle">A</text><text x={x(b)} y={150} textAnchor="middle">B</text>
    </svg>
    <output className="visual-result" aria-live="polite">{a} {a === b ? "=" : a < b ? "<" : ">"} {b}<small>{fr ? "De A à B" : "From A to B"} : {b - a > 0 ? "+" : ""}{b - a} · {fr ? "Distance" : "Distance"} : {Math.abs(b - a)}</small></output>
    <div className="visual-controls"><LabSlider label="A" min={min} max={max} value={a} onChange={setA} /><LabSlider label="B" min={min} max={max} value={b} onChange={setB} /></div>
  </VisualLab>;
}

export function MeasureLab({ locale }: Props) {
  const [amount, setAmount] = useState(750);
  const [mass, setMass] = useState(false);
  const fr = locale === "fr";
  return <VisualLab locale={locale} title={fr ? "Une quantité, deux unités" : "One amount, two units"} instruction={fr ? "Remplis les unités. Chaque grand cadre vaut 1 L ou 1 kg." : "Fill the units. Each large frame is 1 L or 1 kg."}>
    <div className="lab-options" role="group" aria-label={fr ? "Grandeur" : "Measurement"}><button type="button" aria-pressed={!mass} onClick={() => setMass(false)}>{fr ? "Contenance" : "Capacity"}</button><button type="button" aria-pressed={mass} onClick={() => setMass(true)}>{fr ? "Masse" : "Mass"}</button></div>
    <div className={`measure-vessels ${mass ? "is-mass" : ""}`} role="img" aria-label={`${amount} ${mass ? "g" : "mL"}`}>{[0, 1, 2].map((index) => <div key={index}><div className="measure-vessel"><span style={{ height: `${Math.max(0, Math.min(1000, amount - index * 1000)) / 10}%` }} />{[25, 50, 75].map((position) => <i key={position} style={{ bottom: `${position}%` }} />)}</div><small>1 {mass ? "kg" : "L"}</small></div>)}</div>
    <output className="visual-result" aria-live="polite">{formatNumber(amount, locale)} {mass ? "g" : "mL"} = {formatNumber(amount / 1000, locale, 2)} {mass ? "kg" : "L"}</output>
    <LabSlider label={mass ? (fr ? "Masse (g)" : "Mass (g)") : (fr ? "Volume (mL)" : "Volume (mL)")} min={0} max={3000} step={50} value={amount} onChange={setAmount} />
  </VisualLab>;
}

const coins = [200, 100, 50, 20, 10, 5];
export function StoryLab({ locale }: Props) {
  const [start, setStart] = useState(12);
  const [leave, setLeave] = useState(4);
  const [arrive, setArrive] = useState(6);
  const [step, setStep] = useState(0);
  const fr = locale === "fr";
  const current = step === 0 ? start : step === 1 ? start - leave : start - leave + arrive;
  const labels = fr ? ["Au départ", "Des passagers descendent", "D’autres montent"] : ["At the start", "Some passengers leave", "Others get on"];
  return <VisualLab locale={locale} title={fr ? "L’histoire du bus" : "The bus story"} instruction={fr ? "Choisis les quantités. Avance dans l’histoire pour voir chaque calcul." : "Choose the amounts. Step through the story to see each calculation."}>
    <div className="lab-options" role="group" aria-label={fr ? "Étape" : "Step"}>{labels.map((label, index) => <button type="button" key={label} aria-pressed={step === index} onClick={() => setStep(index)}>{index + 1}. {label}</button>)}</div>
    <div className="bus-passengers" role="img" aria-label={`${current} ${fr ? "passagers" : "passengers"}`}>{Array.from({ length: current }, (_, index) => <span key={index} className={step === 2 && index >= start - leave ? "new-passenger" : ""}>●</span>)}</div>
    <output className="visual-result" aria-live="polite">{step === 0 ? start : step === 1 ? `${start} − ${leave} = ${current}` : `${start - leave} + ${arrive} = ${current}`}<small>{current} {fr ? "passagers dans le bus" : "passengers on the bus"}</small></output>
    <div className="visual-controls"><LabSlider label={fr ? "Au départ" : "At the start"} min={1} max={20} value={start} onChange={(value) => { setStart(value); setLeave((old) => Math.min(old, value)); setStep(0); }} /><LabSlider label={fr ? "Descendent" : "Getting off"} min={0} max={start} value={leave} onChange={(value) => { setLeave(value); setStep(0); }} /><LabSlider label={fr ? "Montent" : "Getting on"} min={0} max={12} value={arrive} onChange={(value) => { setArrive(value); setStep(0); }} /></div>
  </VisualLab>;
}

export function MoneyLab({ locale }: Props) {
  const [wallet, setWallet] = useState<number[]>([]);
  const total = wallet.reduce((sum, coin) => sum + coin, 0);
  const target = 375;
  const fr = locale === "fr";
  return <VisualLab locale={locale} title={fr ? "Le petit marché" : "The little market"} instruction={fr ? "Prépare 3,75 €. Ajoute des pièces, puis touche une pièce du porte-monnaie pour la retirer." : "Make €3.75. Add coins, then tap a coin in the wallet to remove it."}>
    <div className="lab-options coin-options">{coins.map((coin) => <button type="button" key={coin} disabled={wallet.length >= 20} onClick={() => setWallet((current) => [...current, coin])} aria-label={`${fr ? "Ajouter" : "Add"} ${moneyAmount(coin, locale)}`}>{moneyAmount(coin, locale)}</button>)}</div>
    <div className="coin-wallet" role="group" aria-label={fr ? "Porte-monnaie" : "Wallet"}>{wallet.length ? wallet.map((coin, index) => <button type="button" key={index} onClick={() => setWallet((current) => current.filter((_, i) => i !== index))} aria-label={`${fr ? "Retirer" : "Remove"} ${moneyAmount(coin, locale)}, ${index + 1}`}>{coin >= 100 ? `${coin / 100} €` : `${coin} c`}</button>) : <span>{fr ? "Ton porte-monnaie est vide." : "Your wallet is empty."}</span>}</div>
    <output className="visual-result" aria-live="polite">{moneyAmount(total, locale)}<small>{total === target ? (fr ? "Le compte est bon !" : "Exactly right!") : total < target ? `${fr ? "Il manque" : "Still needed"} ${moneyAmount(target - total, locale)}` : `${fr ? "À rendre" : "Change"} : ${moneyAmount(total - target, locale)}`}</small></output>
    {wallet.length === 20 ? <p role="status">{fr ? "20 pièces maximum : retire des pièces pour en ajouter." : "20 coins maximum: remove coins to add more."}</p> : null}
    <button className="visual-reset" type="button" onClick={() => setWallet([])}>{fr ? "Vider le porte-monnaie" : "Empty wallet"}</button>
  </VisualLab>;
}
