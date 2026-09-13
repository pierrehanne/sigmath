"use client";

import { ArrowUp, Dice5, Play, RotateCcw, StepForward } from "lucide-react";
import { useState } from "react";
import { angleFamily, angleGeometry, initialRobot, robotStep, type RobotInstruction } from "@/lib/lab-math";

type LabProps = { locale?: "fr" | "en" };

const labText = {
  fr: {
    lab: "Laboratoire interactif",
    fractionTitle: "La fraction prend sa place",
    fractionCopy: "Modifie le numérateur et le dénominateur : une fraction est un nombre, même au-delà de 1.",
    numerator: "Numérateur",
    denominator: "Dénominateur",
    decimalTitle: "La loupe des décimaux",
    decimalCopy: "Observe le même nombre sous forme décimale, fractionnaire et sur une grille de centièmes.",
    hundredths: "centièmes",
    balanceTitle: "La balance de l’inconnue",
    balanceCopy: "Cherche la valeur qui maintient l’égalité. Les deux membres doivent peser autant.",
    guess: "Valeur proposée",
    balanced: "Équilibre trouvé !",
    tryAgain: "Les deux côtés ne sont pas encore égaux.",
    areaTitle: "L’atelier aire et périmètre",
    areaCopy: "Change les dimensions : l’aire remplit la surface, le périmètre suit le contour.",
    width: "Largeur",
    height: "Longueur",
    area: "Aire",
    perimeter: "Périmètre",
    angleTitle: "Le rapporteur vivant",
    angleCopy: "Ouvre l’angle et observe comment sa mesure détermine sa famille.",
    acute: "angle aigu",
    zero: "angle nul",
    right: "angle droit",
    obtuse: "angle obtus",
    straight: "angle plat",
    probabilityTitle: "Le dé qui ne se souvient pas",
    probabilityCopy: "Lance le dé. Compare les fréquences à 1/6 : elles fluctuent, le prochain résultat reste incertain.",
    roll: "Lancer 10 fois",
    rolls: "lancers",
    reset: "Recommencer",
    proportionTitle: "La recette qui grandit",
    proportionCopy: "Agrandis la recette : si le nombre de personnes est multiplié, chaque quantité l’est aussi.",
    servings: "personnes",
    flour: "g de farine",
    milk: "cL de lait",
    eggs: "œufs",
    algorithmTitle: "Programme le robot",
    algorithmCopy: "Construis une séquence. Chaque instruction change l’état du robot, dans un ordre précis.",
    forward: "Avancer",
    turnLeft: "Tourner à gauche",
    turnRight: "Tourner à droite",
    run: "Exécuter",
    program: "Programme",
    empty: "Ajoute des instructions pour commencer.",
  },
  en: {
    lab: "Interactive lab",
    fractionTitle: "Put the fraction on the line",
    fractionCopy: "Change numerator and denominator: a fraction is a number, even beyond 1.",
    numerator: "Numerator",
    denominator: "Denominator",
    decimalTitle: "The decimal magnifier",
    decimalCopy: "See the same number as a decimal, a fraction and on a hundredths grid.",
    hundredths: "hundredths",
    balanceTitle: "The unknown balance",
    balanceCopy: "Find the value that keeps the equality balanced. Both sides must weigh the same.",
    guess: "Your value",
    balanced: "Balance found!",
    tryAgain: "The two sides are not equal yet.",
    areaTitle: "Area and perimeter studio",
    areaCopy: "Change the dimensions: area fills the surface, perimeter follows the boundary.",
    width: "Width",
    height: "Length",
    area: "Area",
    perimeter: "Perimeter",
    angleTitle: "The living protractor",
    angleCopy: "Open the angle and watch how its measure determines its family.",
    acute: "acute angle",
    zero: "zero angle",
    right: "right angle",
    obtuse: "obtuse angle",
    straight: "straight angle",
    probabilityTitle: "The die with no memory",
    probabilityCopy: "Roll the die. Compare frequencies with 1/6: they fluctuate and the next outcome stays uncertain.",
    roll: "Roll 10 times",
    rolls: "rolls",
    reset: "Reset",
    proportionTitle: "The growing recipe",
    proportionCopy: "Scale the recipe: when the number of people is multiplied, every quantity is too.",
    servings: "people",
    flour: "g flour",
    milk: "cL milk",
    eggs: "eggs",
    algorithmTitle: "Program the robot",
    algorithmCopy: "Build a sequence. Each instruction changes the robot’s state in a precise order.",
    forward: "Forward",
    turnLeft: "Turn left",
    turnRight: "Turn right",
    run: "Run",
    program: "Program",
    empty: "Add instructions to begin.",
  },
};

function LabIntro({ kicker, title, copy }: { kicker: string; title: string; copy: string }) {
  return <div className="cycle3-lab-intro"><span>{kicker}</span><h3>{title}</h3><p>{copy}</p></div>;
}

export function FractionLineLab({ locale = "fr" }: LabProps) {
  const [numerator, setNumerator] = useState(7);
  const [denominator, setDenominator] = useState(4);
  const t = labText[locale];
  const value = numerator / denominator;
  const max = 3;
  const mixedWhole = Math.floor(value);
  const remainder = numerator % denominator;

  return (
    <section className="cycle3-lab cycle3-lab--fraction" aria-label={t.fractionTitle}>
      <LabIntro kicker={t.lab} title={t.fractionTitle} copy={t.fractionCopy} />
      <div className="fraction-line-stage">
        <div className="fraction-line" aria-hidden="true">
          {Array.from({ length: max * denominator + 1 }, (_, index) => <i key={index} className={index % denominator === 0 ? "major" : ""} style={{ left: `${(index / (max * denominator)) * 100}%` }} />)}
          <span className="fraction-marker" style={{ left: `${Math.min(100, (value / max) * 100)}%` }} />
        </div>
        <div className="fraction-line-labels" aria-hidden="true"><span>0</span><span>1</span><span>2</span><span>3</span></div>
        <output aria-live="polite"><strong>{numerator}/{denominator}</strong><span>=</span><strong>{remainder === 0 ? mixedWhole : `${mixedWhole} + ${remainder}/${denominator}`}</strong></output>
        <div className="cycle3-sliders">
          <label>{t.numerator}: {numerator}<input type="range" min="0" max={max * denominator} value={numerator} onChange={(event) => setNumerator(Number(event.target.value))} /></label>
          <label>{t.denominator}: {denominator}<input type="range" min="2" max="12" value={denominator} onChange={(event) => { const next = Number(event.target.value); setDenominator(next); setNumerator((current) => Math.min(current, max * next)); }} /></label>
        </div>
      </div>
    </section>
  );
}

export function DecimalGridLab({ locale = "fr" }: LabProps) {
  const [hundredths, setHundredths] = useState(137);
  const t = labText[locale];
  const whole = Math.floor(hundredths / 100);
  const part = hundredths % 100;
  const rawDecimal = (hundredths / 100).toFixed(2);
  const decimal = locale === "fr" ? rawDecimal.replace(".", ",") : rawDecimal;
  return (
    <section className="cycle3-lab cycle3-lab--decimal" aria-label={t.decimalTitle}>
      <LabIntro kicker={t.lab} title={t.decimalTitle} copy={t.decimalCopy} />
      <div className="decimal-stage">
        <div className="decimal-grids" aria-hidden="true">{[0, 1, 2].map((unit) => <div key={unit}><div className="hundred-grid">{Array.from({ length: 100 }, (_, index) => <i className={unit * 100 + index < hundredths ? "filled" : ""} key={index} />)}</div><small>1 {locale === "fr" ? "unité" : "whole"}</small></div>)}</div>
        <output aria-live="polite"><strong>{decimal}</strong><span>{whole} + {part}/100</span><span>{hundredths} {t.hundredths}</span></output>
      </div>
      <input aria-label={t.hundredths} aria-valuetext={decimal} type="range" min="0" max="300" value={hundredths} onChange={(event) => setHundredths(Number(event.target.value))} />
    </section>
  );
}

const equations = [
  { factor: 1, add: 8, target: 20 },
  { factor: 2, add: 3, target: 17 },
  { factor: 3, add: 0, target: 18 },
];

export function BalanceLab({ locale = "fr" }: LabProps) {
  const [equationIndex, setEquationIndex] = useState(1);
  const [guess, setGuess] = useState(5);
  const t = labText[locale];
  const equation = equations[equationIndex];
  const left = equation.factor * guess + equation.add;
  const balanced = left === equation.target;
  const unknownTerm = equation.factor === 1 ? "□" : `${equation.factor} × □`;
  return (
    <section className="cycle3-lab cycle3-lab--balance" aria-label={t.balanceTitle}>
      <LabIntro kicker={t.lab} title={t.balanceTitle} copy={t.balanceCopy} />
      <div className={`balance-stage ${balanced ? "is-balanced" : left < equation.target ? "leans-right" : "leans-left"}`}>
        <div className="balance-beam"><span>{unknownTerm}{equation.add ? ` + ${equation.add}` : ""}<b>{left}</b></span><i /><span>{equation.target}<b>{equation.target}</b></span></div>
        <div className="balance-stand" />
      </div>
      <div className="equation-tabs" role="group" aria-label={locale === "fr" ? "Choisir une égalité" : "Choose an equality"}>{equations.map((item, index) => <button type="button" aria-pressed={equationIndex === index} className={equationIndex === index ? "active" : ""} onClick={() => { setEquationIndex(index); setGuess(5); }} key={item.target}>{item.factor === 1 ? "□" : `${item.factor} × □`}{item.add ? ` + ${item.add}` : ""} = {item.target}</button>)}</div>
      <label className="balance-guess">{t.guess}: <strong>{guess}</strong><input type="range" min="0" max="20" value={guess} onChange={(event) => setGuess(Number(event.target.value))} /></label>
      <output className={balanced ? "success" : ""} aria-live="polite">{balanced ? t.balanced : t.tryAgain}</output>
    </section>
  );
}

export function AreaLab({ locale = "fr" }: LabProps) {
  const [width, setWidth] = useState(6);
  const [height, setHeight] = useState(4);
  const t = labText[locale];
  return (
    <section className="cycle3-lab cycle3-lab--area" aria-label={t.areaTitle}>
      <LabIntro kicker={t.lab} title={t.areaTitle} copy={t.areaCopy} />
      <div className="area-stage">
        <svg className="area-unit-grid" viewBox="0 0 280 230" role="img" aria-label={`${width} × ${height} = ${width * height} cm²`}>
          {Array.from({ length: width * height }, (_, index) => <rect key={index} x={30 + index % width * 22} y={25 + Math.floor(index / width) * 22} width={22} height={22} fill="#fffbe8" stroke="#527460" />)}
          <rect x={30} y={25} width={width * 22} height={height * 22} fill="none" stroke="#a13e38" strokeWidth={3} />
          <text x={30 + width * 11} y={17} textAnchor="middle">{width} cm</text><text x={30 + width * 11} y={height * 22 + 48} textAnchor="middle">{locale === "fr" ? "1 case = 1 cm²" : "1 square = 1 cm²"}</text>
        </svg>
        <output aria-live="polite"><span>{t.area}<strong>{width * height} cm²</strong></span><span>{t.perimeter}<strong>{2 * (width + height)} cm</strong></span></output>
      </div>
      <div className="cycle3-sliders"><label>{t.width}: {width} cm<input type="range" min="1" max="10" value={width} onChange={(event) => setWidth(Number(event.target.value))} /></label><label>{t.height}: {height} cm<input type="range" min="1" max="8" value={height} onChange={(event) => setHeight(Number(event.target.value))} /></label></div>
    </section>
  );
}

export function AngleLab({ locale = "fr" }: LabProps) {
  const [angle, setAngle] = useState(65);
  const t = labText[locale];
  const family = t[angleFamily(angle)];
  const ray = angleGeometry(angle);
  return (
    <section className="cycle3-lab cycle3-lab--angle" aria-label={t.angleTitle}>
      <LabIntro kicker={t.lab} title={t.angleTitle} copy={t.angleCopy} />
      <div className="angle-stage">
        <svg viewBox="0 0 320 190" role="img" aria-label={`${angle}°, ${family}`}>
          <path d="M30 160A130 130 0 0 1 290 160" fill="none" stroke="#7674a5" strokeDasharray="3 5" />
          <path d="M160 160H290" className="angle-base" /><path d={`M160 160L${ray.x} ${ray.y}`} className="angle-ray" />
          {angle > 0 ? <path d={`M205 160A45 45 0 0 0 ${ray.arcX} ${ray.arcY}`} fill="none" stroke="#a23855" strokeWidth={3} /> : null}<circle cx="160" cy="160" r="6" />
        </svg>
        <output aria-live="polite"><strong>{angle}°</strong><span>{family}</span></output>
      </div>
      <input aria-label={locale === "fr" ? "Mesure de l’angle" : "Angle measure"} type="range" min="0" max="180" step="5" value={angle} onChange={(event) => setAngle(Number(event.target.value))} />
    </section>
  );
}

export function ProbabilityLab({ locale = "fr" }: LabProps) {
  const [counts, setCounts] = useState([0, 0, 0, 0, 0, 0]);
  const t = labText[locale];
  const total = counts.reduce((sum, count) => sum + count, 0);
  function roll() {
    // Generate outside the state updater: Strict Mode may call updaters twice.
    const batch = [0, 0, 0, 0, 0, 0];
    for (let index = 0; index < 10; index += 1) batch[Math.floor(Math.random() * 6)] += 1;
    setCounts((current) => current.map((count, index) => count + batch[index]));
  }
  return (
    <section className="cycle3-lab cycle3-lab--probability" aria-label={t.probabilityTitle}>
      <LabIntro kicker={t.lab} title={t.probabilityTitle} copy={t.probabilityCopy} />
      <svg className="probability-plot" viewBox="0 0 420 250" role="img" aria-label={counts.map((count, index) => `${index + 1} : ${count}/${total}`).join(", ")}>
        <path d="M40 20V200H400" fill="none" stroke="#173e48" /><text x={4} y={28}>100%</text><text x={12} y={204}>0%</text>
        {counts.map((count, index) => <g key={index}><rect x={55 + index * 55} y={200 - (total ? count / total * 180 : 0)} width={30} height={total ? count / total * 180 : 0} fill="#6554aa" /><text x={70 + index * 55} y={222} textAnchor="middle">{index + 1}</text></g>)}
        <path d="M40 170H400" stroke="#a23855" strokeDasharray="5 4" /><text x={400} y={160} textAnchor="end">1/6 ≈ 16,7%</text>
      </svg>
      <output className="dice-counts" aria-live="polite">{counts.map((count, index) => <span key={index}>{index + 1} : <b>{count}</b></span>)}</output>
      <div className="probability-actions"><span><Dice5 />{total} {t.rolls}</span><button type="button" onClick={roll}><Play />{t.roll}</button><button type="button" onClick={() => setCounts([0, 0, 0, 0, 0, 0])}><RotateCcw />{t.reset}</button></div>
    </section>
  );
}

export function ProportionLab({ locale = "fr" }: LabProps) {
  const [servings, setServings] = useState(4);
  const t = labText[locale];
  return (
    <section className="cycle3-lab cycle3-lab--proportion" aria-label={t.proportionTitle}>
      <LabIntro kicker={t.lab} title={t.proportionTitle} copy={t.proportionCopy} />
      <div className="recipe-stage"><output aria-live="polite"><strong>{servings}</strong><span>{t.servings}</span></output><div><span><b>{75 * servings}</b>{t.flour}</span><span><b>{5 * servings}</b>{t.milk}</span><span><b>{servings / 2}</b>{t.eggs}</span></div></div>
      <div className="recipe-groups" aria-hidden="true">{Array.from({ length: servings / 2 }, (_, index) => <span key={index}>🌾 150 g<br />🥛 10 cL<br />🥚 1</span>)}</div>
      <input aria-label={t.servings} type="range" min="2" max="12" step="2" value={servings} onChange={(event) => setServings(Number(event.target.value))} />
    </section>
  );
}

export function AlgorithmLab({ locale = "fr" }: LabProps) {
  const [program, setProgram] = useState<RobotInstruction[]>([]);
  const [robot, setRobot] = useState(initialRobot);
  const [cursor, setCursor] = useState(0);
  const [visited, setVisited] = useState<number[]>([12]);
  const t = labText[locale];
  const fr = locale === "fr";
  const directions = fr ? ["nord", "est", "sud", "ouest"] : ["north", "east", "south", "west"];
  function restart() {
    setRobot(initialRobot);
    setCursor(0);
    setVisited([12]);
  }
  function addInstruction(instruction: RobotInstruction) {
    setProgram((current) => current.length < 10 ? [...current, instruction] : current);
    restart();
  }
  function run() {
    let next = initialRobot;
    let executed = 0;
    const path = [12];
    for (const instruction of program) {
      next = robotStep(next, instruction);
      executed++;
      path.push(next.y * 4 + next.x);
      if (next.blocked) break;
    }
    setRobot(next);
    setVisited(path);
    setCursor(executed);
  }
  function step() {
    if (cursor >= program.length || robot.blocked) return;
    const next = robotStep(robot, program[cursor]);
    setRobot(next);
    setCursor((current) => current + 1);
    setVisited((current) => [...current, next.y * 4 + next.x]);
  }
  const instructionLabel = (instruction: RobotInstruction) => instruction === "forward" ? t.forward : instruction === "left" ? t.turnLeft : t.turnRight;
  return (
    <section className="cycle3-lab cycle3-lab--algorithm" aria-label={t.algorithmTitle}>
      <LabIntro kicker={t.lab} title={t.algorithmTitle} copy={t.algorithmCopy} />
      <div className="algorithm-stage">
        <div><div className="robot-grid" role="img" aria-label={`${fr ? "Colonne" : "Column"} ${robot.x + 1}, ${fr ? "ligne" : "row"} ${robot.y + 1}, ${directions[robot.direction]}`}>{Array.from({ length: 16 }, (_, index) => <i key={index} className={visited.includes(index) ? "visited" : ""}>{index === robot.y * 4 + robot.x ? <ArrowUp style={{ transform: `rotate(${robot.direction * 90}deg)` }} /> : null}</i>)}</div><p className="robot-status" role="status">{robot.blocked ? (fr ? "Un mur ! Modifie le programme ou recommence." : "A wall! Edit the program or restart.") : `${cursor}/${program.length} ${fr ? "instructions exécutées" : "instructions executed"}`}</p></div>
        <div className="program-panel"><strong>{t.program} · {program.length}/10</strong><ol className="robot-instructions">{program.map((instruction, index) => <li key={index} aria-current={index === cursor - 1 ? "step" : undefined}>{instructionLabel(instruction)}</li>)}</ol>{program.length === 0 ? <p>{t.empty}</p> : null}
          <div><button type="button" disabled={program.length === 10} onClick={() => addInstruction("forward")}><StepForward />{t.forward}</button><button type="button" disabled={program.length === 10} onClick={() => addInstruction("left")}>↶ {t.turnLeft}</button><button type="button" disabled={program.length === 10} onClick={() => addInstruction("right")}>↷ {t.turnRight}</button></div>
          {program.length === 10 ? <p role="status">{fr ? "10 instructions maximum. Retire la dernière pour modifier." : "10 instructions maximum. Remove the last one to edit."}</p> : null}
          <button type="button" disabled={cursor >= program.length || robot.blocked} onClick={step}><StepForward />{fr ? "Un pas" : "One step"}</button>
          <button type="button" className="run-program" disabled={!program.length} onClick={run}><Play />{t.run}</button>
          <button type="button" disabled={!program.length} onClick={() => { setProgram((current) => current.slice(0, -1)); restart(); }}>{fr ? "Retirer la dernière" : "Remove last"}</button>
          <button type="button" className="reset-program" onClick={() => { setProgram([]); restart(); }}><RotateCcw />{t.reset}</button></div>
      </div>
    </section>
  );
}
