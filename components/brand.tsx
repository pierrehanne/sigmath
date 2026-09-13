import Link from "next/link";
import type { Locale } from "@/lib/site";

export function Brand({ locale, inverted = false }: { locale: Locale; inverted?: boolean }) {
  return (
    <Link className={`brand ${inverted ? "brand--inverted" : ""}`} href={`/${locale}`} aria-label="SigMath — accueil">
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 32 32" role="img">
          <path d="M22.8 7.25H9.1l7 8.75-7 8.75h13.7" />
          <circle cx="25.1" cy="7.2" r="2.25" />
        </svg>
      </span>
      <span>SigMath</span>
    </Link>
  );
}
