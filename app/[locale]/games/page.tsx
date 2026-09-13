import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MathPlayground } from "@/components/math-playground";
import { isLocale } from "@/lib/site";
import "@/app/games.css";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: "Jouer pour comprendre les maths",
    description: "Des jeux gratuits, du CM1 à la 6e : manipule les fractions, place les décimaux et construis des aires. Des indices, sans chrono ni inscription.",
    alternates: { canonical: `/${locale}/games` },
  };
}

export default async function GamesPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <div className="games-page">
      <header className="games-intro">
        <p className="eyebrow"><span />Le terrain de jeu des maths · CM1–6e</p>
        <h1>Essaie. Observe.<em>Et comprends.</em></h1>
        <p>Une idée, un petit défi, une image qui t’aide. Manipule les maths à ton rythme : chaque essai te fait avancer.</p>
        <div className="games-promises"><span>Gratuit, sans inscription</span><span>Sans chrono</span><span>Des indices si tu bloques</span></div>
      </header>
      <noscript><p>Active JavaScript pour manipuler les jeux. Les cours restent accessibles depuis le menu Cours.</p></noscript>
      <MathPlayground locale={locale} />
    </div>
  );
}
