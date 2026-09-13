"use client";

import Link from "next/link";
import { ArrowRight, Check, Grid2X2, Lightbulb, MoveHorizontal, Plus, Minus, RotateCcw, Star } from "lucide-react";
import { useRef, useState } from "react";
import { answerFeedback, challengeHint, challengePrompt, challenges, decimal, evaluateAnswer, games, type GameId } from "@/lib/games";
import type { Locale } from "@/lib/site";

const gameIcons = [Star, MoveHorizontal, Grid2X2];

export function MathPlayground({ locale }: { locale: Locale }) {
  const [active, setActive] = useState<GameId>("fractions");
  const [solved, setSolved] = useState<string[]>([]);
  const fr = locale === "fr";

  function recordSuccess(id: string) {
    setSolved((current) => current.includes(id) ? current : [...current, id]);
  }

  return (
    <div className="playground">
      <div className="game-picker" role="group" aria-label={fr ? "Choisis un jeu" : "Choose a game"}>
        {games.map((game, index) => {
          const Icon = gameIcons[index];
          const completed = solved.filter((id) => id.startsWith(`${game.id}:`)).length;
          return (
            <button key={game.id} type="button" aria-pressed={active === game.id} aria-controls="active-game" className="game-choice" onClick={() => setActive(game.id)}>
              <span className="game-choice-top"><Icon size={23} aria-hidden="true" /><span>{completed}/3 {fr ? "réussis" : "solved"}</span></span>
              <small>{game.concept[locale]}</small>
              <strong>{game.title[locale]}</strong>
              <span>{game.description[locale]}</span>
            </button>
          );
        })}
      </div>
      <GameSession key={active} gameId={active} locale={locale} onSuccess={recordSuccess} />
      <p className="game-session-note">{fr ? `${solved.length}/9 défis réussis pendant cette visite. Tu peux changer de jeu à tout moment. Le défi en cours reprend au début.` : `${solved.length}/9 challenges solved during this visit. Switch games any time. The current game restarts from the beginning.`}</p>
    </div>
  );
}

function GameSession({ gameId, locale, onSuccess }: { gameId: GameId; locale: Locale; onSuccess: (id: string) => void }) {
  const [round, setRound] = useState(0);
  const [first, setFirst] = useState(gameId === "area" ? 1 : 0);
  const [second, setSecond] = useState(1);
  const [pieces, setPieces] = useState<number[]>([]);
  const [hint, setHint] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "retry" | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const game = games.find((item) => item.id === gameId)!;
  const challenge = challenges[gameId][round];
  const fr = locale === "fr";
  const complete = round === challenges[gameId].length;
  const correct = feedback === "correct";
  const answer = gameId === "fractions" ? pieces.length : first;

  function reset(nextRound: number) {
    setRound(nextRound);
    setFirst(gameId === "area" ? 1 : 0);
    setSecond(1);
    setPieces([]);
    setHint(false);
    setFeedback(null);
    heading.current?.focus();
  }

  function verify() {
    if (correct || complete) return;
    const success = evaluateAnswer(challenge, answer, second);
    setFeedback(success ? "correct" : "retry");
    if (success) onSuccess(`${gameId}:${round}`);
  }

  return (
    <section id="active-game" className={`game-board game-board--${gameId}`} aria-labelledby="game-heading">
      <div className="game-board-top"><span>{game.title[locale]}</span><span>{complete ? (fr ? "Parcours terminé" : "Game complete") : `${fr ? "Défi" : "Challenge"} ${round + 1} / 3`}</span></div>
      <div className="game-progress" aria-hidden="true">{[0, 1, 2].map((index) => <span key={index} className={index < round || (index === round && correct) ? "is-complete" : ""} />)}</div>
      <h2 id="game-heading" ref={heading} tabIndex={-1}>{complete ? (fr ? "Trois défis, une idée plus claire !" : "Three challenges, a clearer idea!") : challengePrompt(challenge, locale)}</h2>
      {complete ? (
        <div className="game-completion">
          <div className="game-completion-icon" aria-hidden="true"><Check size={36} /></div>
          <p>{fr ? "Tu as manipulé, essayé et vérifié. Continue avec la leçon pour retrouver ce que tu viens de comprendre." : "You explored, tried and checked. Continue with the lesson to revisit what you discovered."}</p>
          <div className="game-actions">
            <Link className="button button--primary" href={`/${locale}/${game.lesson}`}>{fr ? "Comprendre avec la leçon" : "Explore the lesson"}<ArrowRight size={17} /></Link>
            <button type="button" className="button game-secondary" onClick={() => reset(0)}><RotateCcw size={17} />{fr ? "Rejouer" : "Play again"}</button>
          </div>
        </div>
      ) : (
        <>
          <p className="game-instruction">{challenge.kind === "fractions" ? (fr ? "Touche une part pour la colorier ou l’enlever. Toutes les parts ont la même taille." : "Tap a piece to colour or clear it. All pieces have the same size.") : challenge.kind === "number-line" ? (fr ? "Déplace le curseur. Les flèches du clavier fonctionnent aussi." : "Move the slider. You can also use the arrow keys.") : (fr ? "Change les deux côtés du jardin. Une case représente 1 m²." : "Change both sides of the garden. One square represents 1 m².")}</p>
          <fieldset className="game-workspace" disabled={correct}>
            <legend className="game-sr-only">{fr ? "Ta proposition" : "Your answer"}</legend>
            {challenge.kind === "fractions" ? (
              <div className="game-fractions">
                <div className="snack-grid" style={{ gridTemplateColumns: `repeat(${challenge.parts / 2}, 1fr)` }}>
                  {Array.from({ length: challenge.parts }, (_, index) => (
                    <button type="button" key={index} className="snack-piece" aria-pressed={pieces.includes(index)} aria-label={fr ? `Part ${index + 1} sur ${challenge.parts}` : `Piece ${index + 1} of ${challenge.parts}`} onClick={() => {
                      setPieces((current) => current.includes(index) ? current.filter((piece) => piece !== index) : [...current, index]);
                      setFeedback(null);
                    }}><span aria-hidden="true">{pieces.includes(index) ? <Check size={24} /> : index + 1}</span></button>
                  ))}
                </div>
                <output className="game-equation" aria-live="polite">{pieces.length}/{challenge.parts} <small>{fr ? "du goûter colorié" : "of the snack coloured"}</small></output>
              </div>
            ) : challenge.kind === "number-line" ? (
              <div className="game-number-line">
                <NumberLine value={first} locale={locale} />
                <label className="game-slider-label">{fr ? "Position du repère" : "Marker position"}<strong>{decimal(first, locale)}</strong>
                  <input type="range" min={0} max={20} step={1} value={first} aria-valuetext={decimal(first, locale)} onChange={(event) => { setFirst(Number(event.target.value)); setFeedback(null); }} />
                </label>
                <p className="game-equation">{first}/10 = {decimal(first, locale)}</p>
              </div>
            ) : (
              <div className="game-area">
                <svg viewBox="0 0 320 320" role="img" aria-label={fr ? `Jardin de ${first} m sur ${second} m, soit ${first * second} mètres carrés` : `Garden ${first} by ${second} metres, covering ${first * second} square metres`}>
                  {Array.from({ length: 64 }, (_, index) => {
                    const x = index % 8;
                    const y = Math.floor(index / 8);
                    return <rect key={index} x={x * 36 + 16} y={y * 36 + 16} width={34} height={34} rx={3} className={x < first && y < second ? "garden-cell is-filled" : "garden-cell"} />;
                  })}
                  <rect x={15} y={15} width={first * 36} height={second * 36} rx={4} fill="none" className="garden-outline" strokeWidth={3} />
                </svg>
                <div className="game-area-controls">
                  <Stepper label={fr ? "Côté horizontal" : "Horizontal side"} value={first} locale={locale} onChange={(value) => { setFirst(value); setFeedback(null); }} />
                  <Stepper label={fr ? "Côté vertical" : "Vertical side"} value={second} locale={locale} onChange={(value) => { setSecond(value); setFeedback(null); }} />
                  <output className="game-equation" aria-live="polite">{first} × {second} = {first * second} m²<small>{fr ? "Aire du jardin" : "Garden area"}</small></output>
                </div>
              </div>
            )}
          </fieldset>
          <div className="game-feedback" role="status" aria-atomic="true" data-result={feedback ?? "waiting"}>
            {feedback ? <><strong>{correct ? (fr ? "Bien joué !" : "Well done!") : (fr ? "Essaie encore, tu peux ajuster." : "Try again, you can adjust it.")}</strong><p>{answerFeedback(challenge, answer, second, locale)}</p></> : <p>{fr ? "À toi d’essayer. Tu peux te tromper autant que nécessaire." : "Your turn. You can try as many times as you need."}</p>}
          </div>
          <div className="game-actions">
            {correct ? <button type="button" className="button button--primary" onClick={() => reset(round + 1)}>{round === 2 ? (fr ? "Voir mon bilan" : "See my summary") : (fr ? "Défi suivant" : "Next challenge")}<ArrowRight size={17} /></button> : <button type="button" className="button button--primary" onClick={verify}>{fr ? "Vérifier" : "Check my answer"}<Check size={17} /></button>}
            <button type="button" className="button game-secondary" aria-expanded={hint} aria-controls="game-hint" onClick={() => setHint((current) => !current)}><Lightbulb size={17} />{hint ? (fr ? "Masquer l’indice" : "Hide hint") : (fr ? "Un indice" : "A hint")}</button>
            <button type="button" className="game-reset" onClick={() => reset(round)}><RotateCcw size={16} />{fr ? "Recommencer ce défi" : "Restart challenge"}</button>
          </div>
          <p id="game-hint" className="game-hint" hidden={!hint}>{challengeHint(challenge, locale)}</p>
        </>
      )}
    </section>
  );
}

function Stepper({ label, value, locale, onChange }: { label: string; value: number; locale: Locale; onChange: (value: number) => void }) {
  return <div className="game-stepper"><span>{label}</span><div><button type="button" disabled={value === 1} aria-label={`${locale === "fr" ? "Réduire" : "Decrease"} : ${label}`} onClick={() => onChange(value - 1)}><Minus size={18} /></button><output>{value} m</output><button type="button" disabled={value === 8} aria-label={`${locale === "fr" ? "Augmenter" : "Increase"} : ${label}`} onClick={() => onChange(value + 1)}><Plus size={18} /></button></div></div>;
}

function NumberLine({ value, locale }: { value: number; locale: Locale }) {
  return (
    <svg viewBox="0 0 640 130" role="img" aria-label={locale === "fr" ? `Droite graduée de 0 à 2, repère sur ${decimal(value, locale)}` : `Number line from 0 to 2, marker at ${decimal(value, locale)}`}>
      <path d="M30 70H610" className="number-line-track" strokeWidth={3} />
      <path d={`M30 70H${30 + value * 29}`} className="number-line-distance" strokeWidth={7} />
      {Array.from({ length: 21 }, (_, index) => <g key={index}><path d={`M${30 + index * 29} ${index % 10 === 0 ? 56 : 63}V84`} className="number-line-track" strokeWidth={2} />{index % 5 === 0 ? <text x={30 + index * 29} y={112} textAnchor="middle">{decimal(index, locale)}</text> : null}</g>)}
      <path d={`M${30 + value * 29} 60l-9 -15h18Z`} className="number-line-marker" />
      <text x={30 + value * 29} y={30} textAnchor="middle" fontWeight={800}>{decimal(value, locale)}</text>
    </svg>
  );
}
