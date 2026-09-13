import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { display, sans } from "@/lib/fonts";
import { isLocale, locales, siteUrl } from "@/lib/site";
import "katex/dist/katex.min.css";
import "../globals.css";
import "../learning.css";
import "../ui.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "SigMath — Les maths, du CP à la 3e", template: "%s · SigMath" },
  description: "Comprends les maths avec des expériences visuelles, des cours en français et des petits défis, du primaire au collège.",
  openGraph: { title: "SigMath", description: "Les maths, un déclic à la fois. Du CP à la 3e, en français.", locale: "fr_FR", type: "website" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#f5f1e8" };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const themeScript = `try{var t=localStorage.getItem("sigmath-theme");var d=t?t==="dark":matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.dataset.theme=d?"dark":"light"}catch(e){}`;

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html lang={locale} className={`${sans.variable} ${display.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a className="skip-link" href="#main-content">Aller au contenu</a>
        <SiteHeader locale={locale} />
        <main id="main-content">{children}</main>
        <SiteFooter locale={locale} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
