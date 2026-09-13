import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomeSections } from "@/components/home-sections";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { HomeChallenge } from "@/components/home-challenge";
import { isLocale } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Les maths, un déclic à la fois",
    alternates: { canonical: `/${locale}` },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <>
      <section className="learning-hero">
        <div className="learning-hero-copy">
          <p className="eyebrow"><span />DU CP À LA 3e · EN FRANÇAIS</p>
          <h1>Les maths,<br />un <em>déclic</em><br />à la fois.</h1>
          <p className="learning-lede">Et si tu comprenais vraiment ? Manipule, essaie, trompe-toi et recommence. Ici, les idées prennent forme et tu avances à ton rythme.</p>
          <div className="hero-actions"><Link href="#tiers" className="button button--primary">Choisir mon parcours<ArrowRight size={17} /></Link><Link href="/fr/games" className="button button--ghost">Apprendre en jouant<ArrowRight size={17} /></Link></div>
          <div className="learning-promises"><span><Check size={15} />Gratuit</span><span><Check size={15} />Sans inscription</span><span><Check size={15} />Le droit d’essayer</span></div>
        </div>
        <HomeChallenge />
      </section>
      <section className="learning-method" aria-label="Comment apprendre avec SigMath">
        <div><span>01</span><p><strong>Observe une idée</strong>Une image pour rendre les maths concrètes.</p></div>
        <div><span>02</span><p><strong>À toi de manipuler</strong>Fais varier les nombres et vois ce qui change.</p></div>
        <div><span>03</span><p><strong>Comprends le pourquoi</strong>Une explication pour avancer avec confiance.</p></div>
      </section>
      <HomeSections locale={locale} />
    </>
  );
}
