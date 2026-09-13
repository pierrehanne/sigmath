import Link from "next/link";
import { ArrowRight, BookOpen, GitFork, Globe2, HeartHandshake, Sparkles } from "lucide-react";
import { copy } from "@/lib/copy";
import type { Locale } from "@/lib/site";
import { TierGrid } from "./tier-grid";

export function HomeSections({ locale }: { locale: Locale }) {
  const t = copy;
  return (
    <>
      <section className="home-play-banner" aria-labelledby="home-play-title">
        <div>
          <p className="eyebrow"><span />À toi de jouer · CM1–6e</p>
          <h2 id="home-play-title">Une petite expérience. Un vrai déclic.</h2>
          <p>Partage un goûter, saute entre les décimaux, dessine un jardin. Trois jeux pour voir ce que les nombres veulent dire.</p>
        </div>
        <Link className="button button--primary" href={`/${locale}/games`}>Choisir un jeu<ArrowRight size={17} /></Link>
      </section>
      <section className="tiers-section" id="tiers">
        <div className="section-heading">
          <p className="eyebrow"><span />{t.tierIntro}</p>
          <div>
            <h2>{t.tierTitle}</h2>
            <p>{t.tierBody}</p>
          </div>
        </div>
        <TierGrid locale={locale} />
      </section>

      <section className="featured-lesson">
        <div className="featured-copy">
          <p className="eyebrow eyebrow--light"><span />{t.lessonEyebrow}</p>
          <h2>{t.lessonTitle}</h2>
          <p>{t.lessonBody}</p>
          <Link className="button button--cream" href={`/${locale}/cycle-3/numbers/fractions-measure-quotient`}>
            {t.lessonCta}<ArrowRight size={17} />
          </Link>
        </div>
        <div className="fraction-art" aria-hidden="true">
          <div className="fraction-note fraction-note--one"><span>1</span><i /><span>4</span></div>
          <div className="pizza-plate">
            <div className="pizza-whole">
              <i /><i /><i /><i /><i /><i />
              <span className="pizza-cut pizza-cut--a" /><span className="pizza-cut pizza-cut--b" />
            </div>
            <div className="pizza-slice"><i /><i /></div>
          </div>
          <div className="fraction-note fraction-note--two"><span>2</span><i /><span>8</span></div>
          <svg className="lesson-squiggle" viewBox="0 0 250 100"><path d="M3 77c48-87 111 43 158-35 24-40 58-37 86-15" /></svg>
          <span className="art-label">Même quantité !</span>
        </div>
      </section>

      <section className="mission-section" id="mission">
        <div className="mission-symbol" aria-hidden="true">Σ</div>
        <div className="mission-copy">
          <p className="eyebrow"><span />{t.missionEyebrow}</p>
          <h2>{t.missionTitle}</h2>
          <p>{t.missionBody}</p>
          <a className="text-link" href="https://github.com/pierrehanne/sigmath" target="_blank" rel="noreferrer">
            <GitFork size={18} />Voir le projet sur GitHub<ArrowRight size={16} />
          </a>
        </div>
        <div className="mission-values">
          <div><BookOpen /><span>Cours libres</span></div>
          <div><Globe2 /><span>100 % en français</span></div>
          <div><HeartHandshake /><span>Construit ensemble</span></div>
          <div><Sparkles /><span>Du CP à la 3e</span></div>
        </div>
      </section>
    </>
  );
}
