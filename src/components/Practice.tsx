import { useState } from "react";
import type { Exercise, ExerciseGenerator } from "../content/types";
import { recordSession, type NodeProgress } from "../lib/progress";
import { pick } from "../lib/random";
import { enroll, itemId, Rating, review } from "../lib/srs";
import { ExerciseView } from "./ExerciseView";

const SESSION_LENGTH = 5;

type Props = { nodeId: string; generators: ExerciseGenerator[]; cardIds: string[] };

type Item = { genId: string; exercise: Exercise };

function buildSession(generators: ExerciseGenerator[]): Item[] {
  // Each exercise type comes up at least once before picking at random.
  const order = [...generators].sort(() => Math.random() - 0.5);
  while (order.length < SESSION_LENGTH) order.push(pick(generators));
  return order.slice(0, SESSION_LENGTH).map((g) => ({ genId: g.id, exercise: g.make() }));
}

export function Practice({ nodeId, generators, cardIds }: Props) {
  const [session, setSession] = useState(() => buildSession(generators));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState<NodeProgress | null>(null);

  const item = session[index];
  const isLast = index + 1 >= session.length;

  const onResult = (ok: boolean) => {
    review(itemId(nodeId, "ex", item.genId), ok ? Rating.Good : Rating.Again);
    if (ok) setScore((s) => s + 1);
  };

  const next = () => {
    if (isLast) {
      // The chapter enters the reviews: all its exercise types and its cards.
      enroll([
        ...generators.map((g) => itemId(nodeId, "ex", g.id)),
        ...cardIds.map((id) => itemId(nodeId, "card", id)),
      ]);
      setResult(recordSession(nodeId, score, session.length));
      return;
    }
    setIndex(index + 1);
  };

  const restart = () => {
    setSession(buildSession(generators));
    setIndex(0);
    setScore(0);
    setResult(null);
  };

  if (result) {
    return (
      <div className="practice practice-done">
        <p className="practice-score">
          {score} / {session.length}
        </p>
        <p>
          {result.mastered
            ? "Chapitre acquis : il est surligné dans le sommaire."
            : "Il faut 4 bonnes réponses sur 5 pour valider le chapitre. Relis la correction des questions ratées, puis relance une série."}
        </p>
        <p>
          Les exercices et les cartes de ce chapitre reviendront dans tes révisions, espacés selon ce que tu
          retiens.
        </p>
        <button type="button" className="btn btn-primary" onClick={restart}>
          Nouvelle série
        </button>
      </div>
    );
  }

  return (
    <div className="practice">
      <ol className="practice-dots" aria-label={`Question ${index + 1} sur ${session.length}`}>
        {session.map((_, i) => (
          <li key={i} className={i < index ? "done" : i === index ? "current" : ""} />
        ))}
      </ol>
      <ExerciseView
        key={index}
        exercise={item.exercise}
        onResult={onResult}
        onNext={next}
        nextLabel={isLast ? "Voir le bilan" : "Question suivante"}
      />
    </div>
  );
}
