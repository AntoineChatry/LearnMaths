import { useState } from "react";
import { ReviewItem } from "../components/ReviewItem";
import { resolveItem, type ResolvedItem } from "../content/lookup";
import { dueItems, nextDue } from "../lib/srs";
import { formatRelative } from "../lib/time";

const MAX_PER_SESSION = 20;

function buildQueue(): ResolvedItem[] {
  return dueItems()
    .map(resolveItem)
    .filter((item): item is ResolvedItem => item !== null)
    .slice(0, MAX_PER_SESSION);
}

export function Review() {
  const [queue] = useState(buildQueue);
  const [index, setIndex] = useState(0);

  if (queue.length === 0 || index >= queue.length) {
    const upcoming = nextDue();
    return (
      <main className="sheet">
        <nav className="back">
          <a href="#/">Sommaire</a>
        </nav>
        <header className="sheet-head">
          <p className="subject">Révisions</p>
          <h1>{queue.length === 0 ? "Rien à réviser" : "Révisions terminées"}</h1>
        </header>
        <p>
          {upcoming
            ? `Prochaine révision ${formatRelative(upcoming)}. Revenir au bon moment compte plus que réviser longtemps.`
            : "Termine l'entraînement d'un chapitre : ses exercices et ses cartes entreront dans tes révisions."}
        </p>
        <a className="btn btn-primary" href="#/">
          Retour au sommaire
        </a>
      </main>
    );
  }

  const item = queue[index];
  const isLast = index + 1 >= queue.length;

  return (
    <main className="sheet">
      <nav className="back">
        <a href="#/">Sommaire</a>
      </nav>
      <header className="sheet-head">
        <p className="subject">
          Révisions, {index + 1} sur {queue.length}
        </p>
        <h1>{item.node.title}</h1>
      </header>
      <div className="practice">
        <ReviewItem key={item.srsId + index} item={item} onNext={() => setIndex((i) => i + 1)} nextLabel={isLast ? "Terminer" : "Suivante"} />
      </div>
    </main>
  );
}
