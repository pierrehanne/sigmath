import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TierGrid } from "@/components/tier-grid";
import { isLocale } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { title: "Choisis ton parcours, du CP à la 3e", alternates: { canonical: `/${locale}/tiers` } };
}

export default async function TiersPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <div className="inner-page tiers-page">
      <header className="page-hero">
        <p className="eyebrow"><span />Tous les niveaux</p>
        <h1>Tu es dans quelle classe ?</h1>
        <p>Choisis le parcours de ta classe. Tu peux aussi revenir aux bases : chacun avance à son rythme. La 6e se trouve dans le cycle 3.</p>
      </header>
      <TierGrid locale={locale} compact />
    </div>
  );
}
