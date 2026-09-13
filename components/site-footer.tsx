import Link from "next/link";
import { ArrowUpRight, GitFork } from "lucide-react";
import { Brand } from "./brand";
import { copy } from "@/lib/copy";
import type { Locale } from "@/lib/site";

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = copy;
  return (
    <footer className="site-footer" id="contribute">
      <div className="footer-top">
        <div>
          <Brand locale={locale} inverted />
          <p>{t.footerTagline}</p>
        </div>
        <div className="footer-links">
          <div>
            <span>Apprendre</span>
            <Link href={`/${locale}/tiers`}>{t.nav.explore}</Link>
            <Link href={`/${locale}/middle-school`}>{t.nav.lessons}</Link>
          </div>
          <div>
            <span>Participer</span>
            <a href="https://github.com/pierrehanne/sigmath" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={13} /></a>
            <Link href={`/${locale}#mission`}>{t.nav.about}</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 SigMath</span>
        <span className="open-source"><GitFork size={14} /> {t.openSource} · MIT + CC BY-SA</span>
      </div>
    </footer>
  );
}
