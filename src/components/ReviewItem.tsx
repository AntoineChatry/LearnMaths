import { useState } from "react";
import type { ResolvedItem } from "../content/lookup";
import { Rating, review } from "../lib/srs";
import { ConceptCardView } from "./ConceptCardView";
import { ExerciseView } from "./ExerciseView";

// The exercise is drawn only once, on mount: a re-render must not change the question.
function ReviewExercise({
  item,
  onNext,
  nextLabel,
}: {
  item: Extract<ResolvedItem, { kind: "ex" }>;
  onNext: () => void;
  nextLabel: string;
}) {
  const [exercise] = useState(() => item.generator.make());
  return (
    <ExerciseView
      exercise={exercise}
      onResult={(ok) => review(item.srsId, ok ? Rating.Good : Rating.Again)}
      onNext={onNext}
      nextLabel={nextLabel}
    />
  );
}

// One spaced-repetition item (exercise or card) with its "next" button. Mount it with a key per item.
export function ReviewItem({ item, onNext, nextLabel }: { item: ResolvedItem; onNext: () => void; nextLabel: string }) {
  const [cardGraded, setCardGraded] = useState(false);
  if (item.kind === "ex") return <ReviewExercise item={item} onNext={onNext} nextLabel={nextLabel} />;
  return (
    <>
      <ConceptCardView card={item.card} srsId={item.srsId} onGraded={() => setCardGraded(true)} />
      {cardGraded && (
        <button type="button" className="btn btn-primary review-next" onClick={onNext}>
          {nextLabel}
        </button>
      )}
    </>
  );
}
