"use client";

import Link from "next/link";
import { Menu, Moon, Sun, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { Brand } from "./brand";
import { copy } from "@/lib/copy";
import type { Locale } from "@/lib/site";

export function SiteHeader({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const onLessons = new RegExp(`^/${locale}/(tiers|kids|cycle-3|middle-school)(/|$)`).test(pathname);
  const t = copy;

  function toggleTheme() {
    const nextDark = document.documentElement.dataset.theme !== "dark";
    document.documentElement.dataset.theme = nextDark ? "dark" : "light";
    try { window.localStorage.setItem("sigmath-theme", nextDark ? "dark" : "light"); } catch { /* Keep the choice for this page. */ }
  }

  return (
    <header className="site-header" onKeyDown={(event) => { if (event.key === "Escape" && menuOpen) { setMenuOpen(false); menuButton.current?.focus(); } }}>
      <div className="header-inner">
        <Brand locale={locale} />
        <nav className="desktop-nav" aria-label="Navigation principale">
          <Link href={`/${locale}/tiers`} aria-current={onLessons ? "page" : undefined}>{t.nav.lessons}</Link>
          <Link href={`/${locale}/games`} aria-current={pathname === `/${locale}/games` ? "page" : undefined}>{t.nav.games}</Link>
          <Link href={`/${locale}#mission`}>{t.nav.about}</Link>
          <Link href={`/${locale}#contribute`}>{t.nav.contribute}</Link>
        </nav>
        <div className="header-actions">
          <span className="header-school-range">CP → 3e</span>
          <button className="icon-button" type="button" onClick={toggleTheme} aria-label={t.theme}>
            <Sun className="theme-sun" size={17} />
            <Moon className="theme-moon" size={17} />
          </button>
          <button
            className="icon-button menu-button"
            ref={menuButton}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Fermer le menu" : t.menu}
            aria-controls="mobile-navigation"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav id="mobile-navigation" className="mobile-nav" aria-label="Navigation mobile">
          <Link onClick={() => setMenuOpen(false)} href={`/${locale}/tiers`} aria-current={onLessons ? "page" : undefined}>{t.nav.lessons}</Link>
          <Link onClick={() => setMenuOpen(false)} href={`/${locale}/games`} aria-current={pathname === `/${locale}/games` ? "page" : undefined}>{t.nav.games}</Link>
          <Link onClick={() => setMenuOpen(false)} href={`/${locale}#mission`}>{t.nav.about}</Link>
          <Link onClick={() => setMenuOpen(false)} href={`/${locale}#contribute`}>{t.nav.contribute}</Link>
        </nav>
      )}
    </header>
  );
}
