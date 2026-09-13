import type { Metadata } from "next";
import Link from "next/link";
import { display, sans } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Page introuvable · SigMath",
  description: "Cette page n’existe pas.",
};

export default function RootNotFound() {
  return (
    <html lang="fr" className={`${sans.variable} ${display.variable}`}>
      <body>
        <div className="not-found">
          <span>404</span>
          <h1>Cette page n’existe pas.</h1>
          <p>Retrouve les cours et les jeux du CP à la 3e sur la page d’accueil.</p>
          <Link className="button button--primary" href="/fr">Retour à SigMath</Link>
        </div>
      </body>
    </html>
  );
}
