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
  return { title: getTier(tier).title, alternates: { canonical: `/${locale}/${tier}` } };
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
        <div className="tier-hub-meta"><span>{info.number}</span><span>{info.age} ans</span></div>
        <h1>{info.title}</h1>
        <p>{info.description}</p>
        <div className="tier-stats">
          <span><BookOpen />{isLive ? `${lessons.length} leçons` : "En préparation"}</span>
          <span><Layers3 />{info.subjects.length} univers</span>
        </div>
        <a className="button button--primary catalogue-jump" href="#cours">Choisir une leçon<ArrowRight size={17} /></a>
      </header>

      <div className="tier-lab-preview"><h2>Commence par une expérience</h2><LessonLab id={previewLabs[tier]} /></div>

      <section className="lesson-catalogue" id="cours">
        <div className="catalogue-heading">
          <div><p className="eyebrow"><span />Parcours</p><h2>Apprendre pas à pas</h2></div>
          <p>{isLive ? "Commence par les bases, ou choisis l’idée qui t’intrigue aujourd’hui. Ces leçons t’aident à explorer les notions du cycle ; le parcours continue de s’enrichir." : "Ce parcours est en cours de construction. Découvre les premières leçons du collège."}</p>
        </div>
        {isLive ? (
          <LessonCatalogue key={tier} lessons={lessons} locale={locale} />
        ) : (
          <div className="coming-card"><Sparkles /><h3>Ce quartier prend vie.</h3><p>Les premières leçons arrivent bientôt.</p><Link className="button button--primary" href={`/${locale}/middle-school`}>Voir le parcours Collège<ArrowRight /></Link></div>
        )}
      </section>
    </div>
  );
}
