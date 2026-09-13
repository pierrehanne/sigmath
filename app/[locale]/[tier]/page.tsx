import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpen, Layers3, Sparkles } from "lucide-react";
import { getLessons } from "@/lib/content";
import { getTier, isLocale, isTier, locales, tiers } from "@/lib/site";
import { LessonCatalogue } from "@/components/lesson-catalogue";
import { LessonLab } from "@/components/lesson-lab";
import type { LabId } from "@/lib/labs";
import "@/app/labs.css";

type Props = { params: Promise<{ locale: string; tier: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) => tiers.map((tier) => ({ locale, tier })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, tier } = await params;
  if (!isLocale(locale) || !isTier(tier)) return {};
  return { title: getTier(tier).title[locale] };
}

export default async function TierPage({ params }: Props) {
  const { locale, tier } = await params;
  if (!isLocale(locale) || !isTier(tier)) notFound();
  const info = getTier(tier);
  const lessons = await getLessons(locale, tier);
  const isLive = lessons.length > 0;
  const previewLabs: Record<string, LabId> = { kids: "garden", "cycle-3": "fraction", "middle-school": "balance" };
  return (
    <div className="tier-hub" style={{ "--tier-color": info.color } as React.CSSProperties}>
      <header className={`tier-hub-hero tier-hub-hero--${info.tone}`}>
        <div className="tier-hub-orbit" aria-hidden="true"><i /><i /><i /></div>
        <div className="tier-hub-meta"><span>{info.number}</span><span>{info.age} {locale === "fr" ? "ans" : "years"}</span></div>
        <h1>{info.title[locale]}</h1>
        <p>{info.description[locale]}</p>
        <div className="tier-stats">
          <span><BookOpen />{isLive ? `${lessons.length} ${locale === "fr" ? "leçons" : "lessons"}` : (locale === "fr" ? "En préparation" : "In preparation")}</span>
          <span><Layers3 />{info.subjects[locale].length} {locale === "fr" ? "univers" : "subjects"}</span>
        </div>
        <a className="button button--primary catalogue-jump" href="#cours">Choisir une leçon<ArrowRight size={17} /></a>
      </header>

      <div className="tier-lab-preview"><h2>{locale === "fr" ? "Commence par une expérience" : "Start with an experiment"}</h2><LessonLab id={previewLabs[tier]} locale={locale} /></div>

      <section className="lesson-catalogue" id="cours">
        <div className="catalogue-heading">
          <div><p className="eyebrow"><span />{locale === "fr" ? "Parcours" : "Pathway"}</p><h2>{locale === "fr" ? "Apprendre pas à pas" : "Learn step by step"}</h2></div>
          <p>{isLive ? "Commence par les bases, ou choisis l’idée qui t’intrigue aujourd’hui. Ces leçons t’aident à explorer les notions du cycle ; le parcours continue de s’enrichir." : "Ce parcours est en cours de construction. Découvre les premières leçons du collège."}</p>
        </div>
        {isLive ? (
          <LessonCatalogue key={tier} lessons={lessons} locale={locale} />
        ) : (
          <div className="coming-card"><Sparkles /><h3>{locale === "fr" ? "Ce quartier prend vie." : "This neighbourhood is coming alive."}</h3><p>{locale === "fr" ? "Les premières leçons arrivent bientôt." : "The first lessons are on their way."}</p><Link className="button button--primary" href={`/${locale}/middle-school`}>{locale === "fr" ? "Voir le parcours Collège" : "See Middle school"}<ArrowRight /></Link></div>
        )}
      </section>
    </div>
  );
}
