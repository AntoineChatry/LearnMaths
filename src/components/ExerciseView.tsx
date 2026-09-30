import { useCallback, useState } from "react";
import type { Exercise } from "../content/types";
import { isEquivalent } from "../lib/checkAnswer";
import { MathInput } from "./MathInput";
import { RichText } from "./RichText";
import { Tex } from "./Tex";

type Phase = "answering" | "correct" | "wrong";

type Props = {
  exercise: Exercise;
  // Called only once, at verification time.
  onResult: (ok: boolean) => void;
  onNext: () => void;
  nextLabel: string;
};

export function ExerciseView({ exercise, onResult, onNext, nextLabel }: Props) {
  const [answer, setAnswer] = useState("");
  const [phase, setPhase] = useState<Phase>("answering");
  const [showHint, setShowHint] = useState(false);

  const check = useCallback(() => {
    if (phase !== "answering" || answer.trim() === "") return;
    const ok = isEquivalent(answer, exercise.answerTex);
    setPhase(ok ? "correct" : "wrong");
    onResult(ok);
  }, [answer, exercise, phase, onResult]);

  return (
    <>
      {exercise.intro && (
        <p className="practice-intro">
          <RichText>{exercise.intro}</RichText>
        </p>
      )}
      {exercise.code && (
        <pre className="practice-code">
          <code>{exercise.code}</code>
        </pre>
      )}
      <Tex block>{exercise.promptTex}</Tex>

      <div className={`answer-row answer-${phase}`}>
        <MathInput
          label="Ta réponse"
          value={answer}
          onChange={setAnswer}
          onSubmit={phase === "answering" ? check : onNext}
          disabled={phase !== "answering"}
        />
        {phase === "answering" ? (
          <button type="button" className="btn btn-primary" onClick={check} disabled={answer.trim() === ""}>
            Vérifier
          </button>
        ) : (
          <button type="button" className="btn btn-primary" onClick={onNext}>
            {nextLabel}
          </button>
        )}
      </div>
      <p className="answer-tip">
        Tape <kbd>infty</kbd> pour ∞, <kbd>/</kbd> pour une fraction. Entrée pour valider.
      </p>

      {phase === "answering" && !showHint && (
        <button type="button" className="btn btn-quiet" onClick={() => setShowHint(true)}>
          Afficher un indice
        </button>
      )}
      {phase === "answering" && showHint && (
        <p className="hint">
          <RichText>{exercise.hint}</RichText>
        </p>
      )}

      {phase === "correct" && <p className="verdict verdict-ok">Juste.</p>}
      {phase === "wrong" && (
        <div className="verdict verdict-ko">
          <p>
            Pas tout à fait. La réponse attendue était <Tex>{exercise.answerTex}</Tex>.
          </p>
        </div>
      )}
      {phase !== "answering" && (
        <div className="solution">
          {exercise.solution.map((step, i) => (
            <Tex key={i} block>
              {step}
            </Tex>
          ))}
        </div>
      )}
    </>
  );
}
