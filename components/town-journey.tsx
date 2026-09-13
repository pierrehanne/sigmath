"use client";

import Link from "next/link";
import { ArrowRight, MousePointer2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { copy } from "@/lib/copy";
import { getTier, type Locale, type TierSlug } from "@/lib/site";

type Stage = {
  tier: TierSlug;
  place: Record<Locale, string>;
  headline: Record<Locale, string>;
  body: Record<Locale, string>;
  hotspot: Record<Locale, string>;
  href: string;
};

const stages: Stage[] = [
  {
    tier: "kids",
    place: { fr: "Le parc · 08:15", en: "The park · 8:15 am" },
    headline: { fr: "Jouer, c’est déjà calculer.", en: "Playing is already calculating." },
    body: { fr: "Compter les bonds, partager un goûter, reconnaître une symétrie : les premières idées se trouvent au bout du toboggan.", en: "Count jumps, share a snack, spot a symmetry: the first big ideas are waiting at the end of the slide." },
    hotspot: { fr: "Formes & partage", en: "Shapes & sharing" },
    href: "/kids",
  },
  {
    tier: "cycle-3",
    place: { fr: "La cour · 12:30", en: "The courtyard · 12:30 pm" },
    headline: { fr: "Une pizza. Plusieurs façons de voir.", en: "One pizza. Many ways to see it." },
    body: { fr: "Parts, proportions, angles : le déjeuner devient un laboratoire pour comprendre les fractions.", en: "Parts, proportions, angles: lunchtime becomes a laboratory for understanding fractions." },
    hotspot: { fr: "Explorer les fractions", en: "Explore fractions" },
    href: "/cycle-3/numbers/fractions-measure-quotient",
  },
  {
    tier: "middle-school",
    place: { fr: "La salle de sciences · 15:10", en: "The science room · 3:10 pm" },
    headline: { fr: "Le mouvement laisse une courbe.", en: "Movement leaves a curve." },
    body: { fr: "Observer une trajectoire, modéliser sa vitesse, anticiper la suite : les fonctions mettent le monde en mouvement.", en: "Observe a path, model its speed, predict what comes next: functions put the world in motion." },
    hotspot: { fr: "Fonctions & variations", en: "Functions & change" },
    href: "/middle-school/algebra/equations",
  },
  {
    tier: "middle-school",
    place: { fr: "Le laboratoire · 21:40", en: "The lab · 9:40 pm" },
    headline: { fr: "Voir la structure derrière le monde.", en: "See the structure behind the world." },
    body: { fr: "Données, vecteurs, modèles : les mêmes idées gagnent en profondeur et ouvrent de nouvelles questions.", en: "Data, vectors, models: familiar ideas gain depth and open entirely new questions." },
    hotspot: { fr: "Algèbre linéaire", en: "Linear algebra" },
    href: "/middle-school/statistics/probability",
  },
];

export function TownJourney({ locale }: { locale: Locale }) {
  const [active, setActive] = useState(0);
  const triggers = useRef<Array<HTMLDivElement | null>>([]);
  const t = copy[locale];

  useEffect(() => {
    const nodes = triggers.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(Number((visible.target as HTMLElement).dataset.stage));
      },
      { threshold: [0.42, 0.62, 0.82] },
    );
    nodes.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="scene-journey" aria-label={locale === "fr" ? "Voyage dans la ville mathématique" : "Journey through the mathematics town"}>
      <div className={`scene-sticky scene-stage-${active}`}>
        <TownIllustration active={active} locale={locale} />
        <div className={`scene-hero scene-panel ${active === 0 ? "is-active" : ""}`}>
          <p className="eyebrow"><span />{t.eyebrow}</p>
          <h1><span>{t.heroTitleA}</span><em>{t.heroTitleB}</em></h1>
          <p className="hero-lede">{t.heroBody}</p>
          <div className="hero-actions">
            <Link className="button button--primary" href={`/${locale}/games`}>{t.begin}<ArrowRight size={17} /></Link>
            <Link className="button button--ghost" href={`/${locale}/tiers`}>{t.levels}</Link>
          </div>
        </div>

        {stages.map((stage, index) => {
          const tier = getTier(stage.tier);
          const stageIndex = index + 1;
          return (
            <article className={`scene-story scene-panel ${active === stageIndex ? "is-active" : ""}`} key={stage.href}>
              <div className="story-meta">
                <span>{t.chapter} {stageIndex.toString().padStart(2, "0")}</span>
                <span style={{ color: tier.color }}>{stage.place[locale]}</span>
              </div>
              <h2>{stage.headline[locale]}</h2>
              <p>{stage.body[locale]}</p>
              <div className="story-bottom">
                <span className="story-age" style={{ "--stage-color": tier.color } as React.CSSProperties}>{tier.age}</span>
                <Link href={`/${locale}${stage.href}`}>{stage.hotspot[locale]}<ArrowRight size={17} /></Link>
              </div>
            </article>
          );
        })}

        <div className="scene-progress" aria-hidden="true">
          <span>{String(active + 1).padStart(2, "0")}</span>
          <div>{[0, 1, 2, 3, 4].map((stage) => <i className={active === stage ? "active" : ""} key={stage} />)}</div>
          <span>05</span>
        </div>
        <div className={`scroll-cue ${active === 0 ? "is-visible" : ""}`}><MousePointer2 size={14} />{t.scroll}</div>
      </div>
      <div className="scene-triggers" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((stage) => (
          <div
            id={stage === 1 ? "journey-1" : undefined}
            className="scene-trigger"
            data-stage={stage}
            key={stage}
            ref={(node) => { triggers.current[stage] = node; }}
          />
        ))}
      </div>
    </section>
  );
}

function TownIllustration({ active, locale }: { active: number; locale: Locale }) {
  const hotspotLabel = locale === "fr" ? "Ouvrir la leçon" : "Open lesson";
  return (
    <div className="town-viewport" aria-hidden="true">
      <div className="town-sun" />
      <svg className="town-world" viewBox="0 0 1200 800" role="presentation" focusable="false">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={active === 4 ? "#192b52" : "#beded6"} />
            <stop offset="100%" stopColor={active === 4 ? "#6e6bdc" : "#f7d9a7"} />
          </linearGradient>
          <linearGradient id="grass" x1="0" x2="1">
            <stop stopColor="#789d70" /><stop offset="1" stopColor="#9ab17d" />
          </linearGradient>
          <pattern id="windows" width="28" height="34" patternUnits="userSpaceOnUse">
            <rect width="13" height="18" rx="2" fill="#285868" opacity=".8" />
          </pattern>
          <filter id="soft"><feGaussianBlur stdDeviation="18" /></filter>
        </defs>
        <rect width="1200" height="800" fill="url(#sky)" />
        <g className="stars">
          <circle cx="130" cy="120" r="2" /><circle cx="390" cy="92" r="2.5" /><circle cx="755" cy="112" r="2" /><circle cx="990" cy="70" r="3" /><circle cx="1080" cy="175" r="2" />
        </g>
        <path className="cloud cloud-a" d="M92 170c20-34 64-22 66 5 28-20 66 1 58 31H68c-3-19 7-31 24-36Z" />
        <path className="cloud cloud-b" d="M860 150c18-31 58-21 62 3 25-17 58 2 52 29H840c-3-16 5-27 20-32Z" />
        <g className="hills">
          <path d="M0 390Q175 235 358 386T720 366T1200 350V590H0Z" fill="#7f9c83" />
          <path d="M0 455Q170 350 324 440T655 420T940 425T1200 405V620H0Z" fill="#a8b48a" />
          <path d="M0 515Q210 425 420 510T806 490T1200 480V800H0Z" fill="url(#grass)" />
        </g>

        <g className="university" transform="translate(690 235)">
          <rect x="0" y="88" width="350" height="270" rx="4" fill="#e8d8bd" />
          <path d="M-14 93 175 0 365 93Z" fill="#d5b26b" />
          <path d="M70 88h212v-42L176 0 70 51Z" fill="#efd597" />
          <rect x="36" y="132" width="278" height="188" fill="url(#windows)" />
          <rect x="145" y="218" width="64" height="140" rx="32 32 0 0" fill="#334c5b" />
          <g className="lab-window">
            <rect x="228" y="123" width="76" height="72" rx="4" fill="#173d53" />
            <path d="M240 173c12-29 26-29 39 0" fill="none" stroke="#efc354" strokeWidth="3" />
            <circle cx="260" cy="148" r="5" fill="#f2785c" /><circle cx="283" cy="158" r="4" fill="#75d3c2" />
          </g>
          <g className="orbit-mark" transform="translate(176 65)">
            <ellipse rx="24" ry="9" fill="none" stroke="#274f5e" strokeWidth="2" transform="rotate(22)" />
            <ellipse rx="24" ry="9" fill="none" stroke="#274f5e" strokeWidth="2" transform="rotate(-22)" />
            <circle r="4" fill="#f26d50" />
          </g>
        </g>

        <g className="school" transform="translate(370 330)">
          <rect x="0" y="76" width="330" height="232" rx="3" fill="#f0c979" />
          <path d="M-18 79 165 0l182 79Z" fill="#cf6549" />
          <rect x="136" y="169" width="62" height="139" rx="31 31 0 0" fill="#486775" />
          <g fill="#dff0e7" stroke="#486775" strokeWidth="6">
            <rect x="38" y="119" width="64" height="62" rx="2" /><rect x="229" y="119" width="64" height="62" rx="2" />
          </g>
          <path d="M70 119v62m191-62v62M38 150h64m127 0h64" stroke="#486775" strokeWidth="4" />
          <circle cx="164" cy="56" r="24" fill="#fbf2db" stroke="#405f67" strokeWidth="4" />
          <path d="M164 42v14l10 8" stroke="#405f67" strokeWidth="3" fill="none" />
        </g>

        <g className="workshop" transform="translate(955 438)">
          <rect width="215" height="160" fill="#637b76" />
          <path d="M-12 3 42-40H224V3Z" fill="#455f5d" />
          <rect x="27" y="42" width="67" height="57" fill="#f7c766" />
          <rect x="125" y="36" width="58" height="124" fill="#283f46" />
          <path d="M44 88 78 52m-25 2 27 28" stroke="#314e55" strokeWidth="5" />
        </g>

        <g className="playground" transform="translate(60 490)">
          <ellipse cx="162" cy="185" rx="220" ry="78" fill="#b8a57c" opacity=".45" />
          <g className="slide">
            <path d="M60 148 135 25l71 123" fill="none" stroke="#e85847" strokeWidth="14" strokeLinecap="round" />
            <path d="M134 28v128m-30-80h61" stroke="#485e65" strokeWidth="8" />
            <path d="M134 35h89c0 55-30 87-67 112" fill="none" stroke="#f2b737" strokeWidth="24" strokeLinecap="round" />
          </g>
          <g className="swing" transform="translate(210 20)" stroke="#455c61" fill="none">
            <path d="M0 148 48 0l48 148M26 0h97l42 148" strokeWidth="9" />
            <path d="M61 8v88m46-88v88" strokeWidth="3" />
            <path d="M48 97h27m46 0h-27" stroke="#e45e4f" strokeWidth="8" />
          </g>
          <g className="ball" transform="translate(385 175)">
            <circle r="22" fill="#f2ede1" stroke="#465f68" strokeWidth="3" />
            <path d="M-21 2h42M0-21c-12 12-12 30 0 42M0-21c12 12 12 30 0 42" fill="none" stroke="#465f68" strokeWidth="2" />
          </g>
          <g className="kite" transform="translate(32 -54)">
            <path d="M0 0 28 32 0 68-28 32Z" fill="#705fd3" /><path d="M0 0v68M-28 32h56" stroke="#f5dfaa" strokeWidth="2" />
            <path d="M0 68q20 35 2 67" fill="none" stroke="#554563" strokeWidth="2" />
          </g>
        </g>

        <g className="road">
          <path d="M-50 765C260 610 530 665 700 735s330 78 550 6" fill="none" stroke="#decfae" strokeWidth="105" />
          <path d="M-50 765C260 610 530 665 700 735s330 78 550 6" fill="none" stroke="#f0e2c4" strokeWidth="78" />
          <path d="M-30 761C260 630 510 676 680 742" fill="none" stroke="#fff7df" strokeWidth="4" strokeDasharray="24 22" />
        </g>

        <g className="people" stroke="#2e4d56" strokeWidth="7" strokeLinecap="round">
          <g transform="translate(316 650)"><circle cy="-39" r="13" fill="#814b34" stroke="none" /><path d="M0-23v46m0-3-17 34m17-34 20 32M0-12l-20 20M0-10l18 10" /><path d="M-14-24h28v35h-28z" fill="#f46d50" stroke="none" /></g>
          <g transform="translate(745 648)"><circle cy="-42" r="13" fill="#684735" stroke="none" /><path d="M0-27v50m0-1-18 34m18-34 17 34M0-12l-21 18M0-10l19 16" /><path d="M-15-27h30v38h-30z" fill="#6c69cf" stroke="none" /></g>
          <g transform="translate(862 595)"><circle cy="-42" r="13" fill="#9a5f3f" stroke="none" /><path d="M0-27v50m0-1-18 34m18-34 17 34M0-12l-19 18M0-10l21 12" /><path d="M-15-27h30v38h-30z" fill="#16867d" stroke="none" /></g>
        </g>

        <g className="trees">
          {[{x:350,y:480,s:1},{x:1040,y:410,s:.8},{x:70,y:430,s:.7},{x:760,y:430,s:.75}].map((tree, i) => (
            <g key={i} transform={`translate(${tree.x} ${tree.y}) scale(${tree.s})`}>
              <rect x="-8" y="32" width="16" height="80" rx="6" fill="#68533e" /><circle cy="10" r="45" fill={i % 2 ? "#62836b" : "#4f7c67"} /><circle cx="-28" cy="25" r="30" fill="#709274" /><circle cx="24" cy="24" r="33" fill="#789775" />
            </g>
          ))}
        </g>

        <g className="pizza-table" transform="translate(590 668)">
          <ellipse rx="55" ry="18" fill="#47636a" /><path d="M-36 8-50 65M36 8l50 57" stroke="#47636a" strokeWidth="8" />
          <circle cy="-8" r="32" fill="#e8a43b" stroke="#f7d88c" strokeWidth="5" />
          <path d="M0-8 28-24M0-8l28 16M0-8v32M0-8l-28 16M0-8l-28-16M0-8v-32" stroke="#b74e3c" strokeWidth="2" />
          <circle cx="10" cy="-19" r="4" fill="#b64534" /><circle cx="-14" cy="4" r="4" fill="#b64534" />
        </g>

        <g className="hotspot hotspot-kids" transform="translate(225 550)">
          <circle r="20" className="hotspot-ring" /><circle r="6" className="hotspot-core" />
        </g>
        <g className="hotspot hotspot-middle" transform="translate(590 650)">
          <circle r="20" className="hotspot-ring" /><circle r="6" className="hotspot-core" />
          <title>{hotspotLabel}</title>
        </g>
        <g className="hotspot hotspot-high" transform="translate(625 445)">
          <circle r="20" className="hotspot-ring" /><circle r="6" className="hotspot-core" />
        </g>
        <g className="hotspot hotspot-college" transform="translate(956 373)">
          <circle r="20" className="hotspot-ring" /><circle r="6" className="hotspot-core" />
        </g>
      </svg>
      <div className="scene-grain" />
    </div>
  );
}
