import { Children, createContext, useContext, useState, type ReactNode } from "react";
import type { ConceptCard } from "../content/types";
import { itemId } from "../lib/srs";
import { ConceptCardView } from "./ConceptCardView";

type LessonContextValue = {
  nodeId: string;
  cards: ConceptCard[];
  // Rendered once every section is unlocked (practice, remaining cards…).
  tail: ReactNode;
};

export const LessonContext = createContext<LessonContextValue | null>(null);

const KEY = "learnmaths.unlocked.v1";

// Highest section reached per chapter, so a re-read is not gated again.
function loadUnlocked(nodeId: string): number {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}")[nodeId] ?? 1;
  } catch {
    return 1;
  }
}

function saveUnlocked(nodeId: string, n: number) {
  try {
    const all = JSON.parse(localStorage.getItem(KEY) ?? "{}");
    all[nodeId] = Math.max(all[nodeId] ?? 1, n);
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    // Storage unavailable: the gate will come back on the next visit.
  }
}

function Checkpoint({ nodeId, cards, onDone }: { nodeId: string; cards: ConceptCard[]; onDone: () => void }) {
  const [graded, setGraded] = useState(0);
  const grade = () => {
    const n = graded + 1;
    setGraded(n);
    if (n === cards.length) onDone();
  };
  return (
    <aside className="checkpoint" aria-label="Questions sur la section">
      <p className="checkpoint-title">Sans remonter le texte</p>
      <ul className="concept-list">
        {cards.map((card) => (
          <li key={card.id}>
            <ConceptCardView card={card} srsId={itemId(nodeId, "card", card.id)} onGraded={grade} />
          </li>
        ))}
      </ul>
    </aside>
  );
}

// Lays out a lesson's sections with a retrieval checkpoint after each one that has cards.
// The next section stays hidden until the checkpoint is answered.
export function LessonFlow({ children }: { children: ReactNode }) {
  const ctx = useContext(LessonContext);
  if (!ctx) throw new Error("LessonFlow must be rendered inside a LessonContext");
  const { nodeId, cards, tail } = ctx;
  const [unlocked, setUnlocked] = useState(() => loadUnlocked(nodeId));
  const sections = Children.toArray(children);

  const unlock = (n: number) => {
    saveUnlocked(nodeId, n);
    setUnlocked((u) => Math.max(u, n));
  };

  const out: ReactNode[] = [];
  let gated = false;
  for (let i = 0; i < sections.length && !gated; i++) {
    const num = i + 1;
    out.push(sections[i]);
    const checks = cards.filter((c) => c.section === num);
    if (checks.length === 0) continue;
    out.push(<Checkpoint key={`cp-${num}`} nodeId={nodeId} cards={checks} onDone={() => unlock(num + 1)} />);
    gated = unlocked <= num;
  }
  // Same tree shape in both states: otherwise React remounts the lesson (cards and graphs lose their state).
  return (
    <>
      {out}
      {gated ? (
        <p className="checkpoint-gate">La suite s'affiche quand tu as répondu.</p>
      ) : (
        tail
      )}
    </>
  );
}
