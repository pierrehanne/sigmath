import Link from "next/link";
import { ArrowUpRight, CircleDot, DraftingCompass, Orbit, Shapes } from "lucide-react";
import { copy } from "@/lib/copy";
import { tierInfo, type Locale } from "@/lib/site";

const icons = {
  kite: Shapes,
  ball: CircleDot,
  graph: DraftingCompass,
  orbit: Orbit,
};

export function TierGrid({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  const t = copy[locale];
  return (
    <div className={`tier-grid ${compact ? "tier-grid--compact" : ""}`}>
      {tierInfo.map((tier) => {
        const Icon = icons[tier.icon];
        return (
          <article className={`tier-card tier-card--${tier.tone}`} key={tier.slug} style={{ "--tier-color": tier.color } as React.CSSProperties}>
            <div className="tier-card-topline">
              <span>{tier.number}</span>
              <span>{tier.age} {locale === "fr" ? "ans" : "years"}</span>
            </div>
            <div className="tier-icon" aria-hidden="true"><Icon strokeWidth={1.5} /></div>
            <div className="tier-card-content">
              <h3>{tier.title[locale]}</h3>
              <p>{tier.description[locale]}</p>
              <div className="subject-list" role="list" aria-label={locale === "fr" ? "Matières" : "Subjects"}>
                {tier.subjects[locale].map((subject) => <span role="listitem" key={subject}>{subject}</span>)}
              </div>
            </div>
            <Link href={`/${locale}/${tier.slug}`} className="tier-link" aria-label={`${t.visit}: ${tier.title[locale]}`}>
              <span>{t.visit}</span><ArrowUpRight size={18} />
            </Link>
          </article>
        );
      })}
    </div>
  );
}
