"use client";

import { useEffect } from "react";

export default function LocaleError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="not-found">
      <span>Oups</span>
      <h1>Une erreur est survenue.</h1>
      <p>Réessaie, ou retourne à l’accueil si le problème persiste.</p>
      <button type="button" className="button button--primary" onClick={() => retry()}>Réessayer</button>
    </div>
  );
}
