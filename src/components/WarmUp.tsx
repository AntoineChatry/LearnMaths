import { useState } from "react";
import { resolveItem, type ResolvedItem } from "../content/lookup";
import { dueItems } from "../lib/srs";
import { ReviewItem } from "./ReviewItem";

const MAX_ITEMS = 3;

// Up to three due items from other chapters, asked when a chapter is opened.
// Only items whose review date has come: spacing is FSRS's job, not a daily streak.
export function WarmUp({ nodeId }: { nodeId: string }) {
  const [queue] = useState(() =>
    dueItems()
      .map(resolveItem)
      .filter((item): item is ResolvedItem => item !== null && item.node.id !== nodeId)
      .slice(0, MAX_ITEMS),
  );
  const [index, setIndex] = useState(0);
  const [skipped, setSkipped] = useState(false);

  if (queue.length === 0 || skipped || index >= queue.length) return null;

  const item = queue[index];
  const isLast = index + 1 >= queue.length;
  return (
    <section className="warmup" aria-label="Échauffement">
      <div className="warmup-head">
        <p className="warmup-title">
          Échauffement, {index + 1} sur {queue.length} : {item.node.title}
        </p>
        <button type="button" className="btn btn-quiet" onClick={() => setSkipped(true)}>
          Passer
        </button>
      </div>
      <div className="practice">
        <ReviewItem key={item.srsId} item={item} onNext={() => setIndex((i) => i + 1)} nextLabel={isLast ? "Commencer le chapitre" : "Suivante"} />
      </div>
    </section>
  );
}
