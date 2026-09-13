import Link from "next/link";

export default function NotFound() {
  return (
    <div className="not-found">
      <span>404</span><h1>Cette page n’existe pas.</h1><p>Retrouve les cours et les jeux du CP à la 3e sur la page d’accueil.</p><Link className="button button--primary" href="/fr">Retour à SigMath</Link>
    </div>
  );
}
