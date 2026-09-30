import { useState } from "react";
import type { ConceptCard } from "../content/types";
import { Rating, review, type Grade } from "../lib/srs";
import { RichText } from "./RichText";

type Props = {
  card: ConceptCard;
  srsId: string;
  // Called after the self-assessment (useful in a review queue).
  onGraded?: () => void;
};

const GRADES: { grade: Grade; label: string }[] = [
  { grade: Rating.Again, label: "À revoir" },
  { grade: Rating.Hard, label: "Hésitant" },
  { grade: Rating.Good, label: "Je savais" },
];

export function ConceptCardView({ card, srsId, onGraded }: Props) {
  const [revealed, setRevealed] = useState(false);
  const [graded, setGraded] = useState<string | null>(null);

  const grade = (g: Grade, label: string) => {
    review(srsId, g);
    setGraded(label);
    onGraded?.();
  };

  return (
    <div className="concept-card">
      <p className="concept-front">
        <RichText>{card.front}</RichText>
      </p>
      {!revealed ? (
        <button type="button" className="btn btn-quiet" onClick={() => setRevealed(true)}>
          Réponds de tête, puis révèle
        </button>
      ) : (
        <>
          <p className="concept-back">
            <RichText>{card.back}</RichText>
          </p>
          {graded ? (
            <p className="concept-graded">Noté : {graded.toLowerCase()}.</p>
          ) : (
            <div className="concept-grades" role="group" aria-label="Est-ce que tu savais ?">
              {GRADES.map(({ grade: g, label }) => (
                <button key={label} type="button" className="btn btn-grade" onClick={() => grade(g, label)}>
                  {label}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
