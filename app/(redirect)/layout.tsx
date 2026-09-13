import type { ReactNode } from "react";
import { display, sans } from "@/lib/fonts";
import "../globals.css";

export default function RedirectLayout({ children }: { children: ReactNode }) {
  return <html lang="fr" className={`${sans.variable} ${display.variable}`} data-scroll-behavior="smooth"><body>{children}</body></html>;
}
