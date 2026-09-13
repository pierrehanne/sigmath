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
    title: locale === "fr" ? "Jouer pour comprendre les maths" : "Play to understand maths",
    description: locale === "fr" ? "Des jeux gratuits, du CM1 à la 6e : manipule les fractions, place les décimaux et construis des aires. Des indices, sans chrono ni inscription." : "Free visual maths games: explore fractions, decimals and area. With hints, no timer and no sign-up.",
    alternates: { canonical: `/${locale}/games`, languages: { fr: "/fr/games", en: "/en/games" } },
  };
}

export default async function GamesPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const fr = locale === "fr";
  return (
    <div className="games-page">
      <header className="games-intro">
        <p className="eyebrow"><span />{fr ? "Le terrain de jeu des maths · CM1–6e" : "The maths playground · ages 9–12"}</p>
        <h1>{fr ? "Essaie. Observe." : "Try. Observe."}<em>{fr ? "Et comprends." : "And understand."}</em></h1>
        <p>{fr ? "Une idée, un petit défi, une image qui t’aide. Manipule les maths à ton rythme : chaque essai te fait avancer." : "One idea, a small challenge, a picture to help. Explore maths at your own pace: every attempt helps you learn."}</p>
        <div className="games-promises"><span>{fr ? "Gratuit, sans inscription" : "Free, no sign-up"}</span><span>{fr ? "Sans chrono" : "No timer"}</span><span>{fr ? "Des indices si tu bloques" : "Hints when you need them"}</span></div>
      </header>
      <noscript><p>{fr ? "Active JavaScript pour manipuler les jeux. Les cours restent accessibles depuis le menu Cours." : "Enable JavaScript to interact with the games. Lessons remain available from the Lessons menu."}</p></noscript>
      <MathPlayground locale={locale} />
    </div>
  );
}
