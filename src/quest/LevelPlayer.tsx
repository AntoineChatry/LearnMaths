import { useEffect, useRef, useState } from "react";
import { RichText } from "../components/RichText";
import { CodeEditor } from "./CodeEditor";
import { getCode, saveCode, saveSolved, saveStars } from "./progress";
import { ensureReady, runPython, type RunResult } from "./runner";
import type { Level, Verdict } from "./types";

const STEP_MS = 350;
const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const starText = (n: number) => "★".repeat(n) + "☆".repeat(3 - n);

type Props = { level: Level<unknown>; nextHref?: string; nextLabel?: string };

export function LevelPlayer({ level, nextHref, nextLabel = "Niveau suivant" }: Props) {
  const [code, setCode] = useState(() => getCode(level.id) ?? level.starter);
  const [ctx] = useState(() => level.newContext());
  const [pyState, setPyState] = useState<"loading" | "ready" | "running">("loading");
  const [result, setResult] = useState<RunResult | null>(null);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [step, setStep] = useState(0);
  const [fails, setFails] = useState(0);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    let alive = true;
    ensureReady(level.packages).then(() => alive && setPyState("ready"));
    return () => {
      alive = false;
      window.clearInterval(timer.current);
    };
  }, []);

  const replaying = result !== null && step < result.trace.length;

  const run = async () => {
    if (pyState !== "ready" || replaying) return;
    saveCode(level.id, code);
    window.clearInterval(timer.current);
    setResult(null);
    setVerdict(null);
    setPyState("running");
    const judge = (world: unknown, res: RunResult): Verdict =>
      res.timedOut
        ? {
            ok: false,
            stars: 0,
            message: `Ton code tourne depuis plus de ${(level.timeoutMs ?? 5000) / 1000} secondes : sans doute une boucle qui ne s'arrête jamais.`,
          }
        : level.judge(world, res.trace, res.error);
    const exec = (world: unknown) => runPython(level.prelude, code, world, { postlude: level.postlude, timeoutMs: level.timeoutMs });
    // The code runs on the world on screen, which never changes, so every attempt replays the same scenario.
    // A success is then re-checked on other random worlds, so hard-coded values are caught.
    const r = await exec(ctx);
    let v = judge(ctx, r);
    for (let i = 0; v.ok && i < (level.checks ?? 0); i++) {
      const other = level.newContext();
      const v2 = judge(other, await exec(other));
      if (!v2.ok) {
        v = {
          ...v2,
          message: `Ton code réussit sur cette carte, mais échoue sur une autre carte tirée au hasard, où les tourelles sont ailleurs : ${v2.message} Il doit lire les positions avec le scanner plutôt que recopier des valeurs.`,
        };
      } else if (v2.stars < v.stars) {
        v = { ...v, stars: v2.stars, message: `${v.message} Sur une autre carte tirée au hasard, ton code a moins bien fait : ${v2.message}` };
      }
    }
    setPyState("ready");
    setResult(r);
    const finish = () => {
      setVerdict(v);
      if (v.ok) {
        saveStars(level.id, v.stars);
        saveSolved(level.id, code);
      }
      else setFails((n) => n + 1);
    };
    if (reduceMotion() || r.trace.length === 0) {
      setStep(r.trace.length);
      finish();
      return;
    }
    setStep(0);
    // The counter lives here, not in a state updater: React may call updaters twice, which would call finish twice.
    let s = 0;
    timer.current = window.setInterval(() => {
      s += 1;
      setStep(s);
      if (s >= r.trace.length) {
        window.clearInterval(timer.current);
        finish();
      }
    }, level.stepMs ?? STEP_MS);
  };

  const reset = () => {
    setCode(level.starter);
    saveCode(level.id, level.starter);
  };

  const Scene = level.Scene;
  const done = result !== null && !replaying;

  return (
    <div className="level">
      <div className="level-story">
        {level.story.map((p, i) => (
          <p key={i}>
            <RichText>{p}</RichText>
          </p>
        ))}
      </div>

      <figure className="viz level-scene" aria-label="Le monde du niveau">
        <Scene ctx={ctx} trace={result?.trace ?? []} step={step} done={done} />
      </figure>

      <dl className="level-api">
        {level.api.map((a) => (
          <div key={a.sig}>
            <dt>
              <code>{a.sig}</code>
            </dt>
            <dd>{a.doc}</dd>
          </div>
        ))}
      </dl>

      <CodeEditor value={code} onChange={setCode} onRun={run} />
      <div className="level-actions">
        <button type="button" className="btn btn-primary" onClick={run} disabled={pyState !== "ready" || replaying}>
          {pyState === "loading" ? "Chargement de Python…" : pyState === "running" ? "Exécution…" : "Exécuter"}
        </button>
        <span className="level-shortcut">Ctrl + Entrée</span>
        <button type="button" className="btn btn-quiet" onClick={reset}>
          Remettre le code de départ
        </button>
      </div>

      {result && (result.stdout || result.error) && (
        <pre className={`level-console${result.error ? " has-error" : ""}`}>
          {result.stdout}
          {result.error}
        </pre>
      )}

      {verdict && (
        <div className="level-verdict" aria-live="polite">
          <p className={verdict.ok ? "viz-verdict-ok" : "viz-verdict-ko"}>
            {verdict.ok ? `Réussi ${starText(verdict.stars)}` : "Pas encore"}
          </p>
          <p>
            <RichText>{verdict.message}</RichText>
          </p>
          {!verdict.ok && fails >= 2 && (
            <p className="game-hint">
              <RichText>{level.hint}</RichText>
            </p>
          )}
          {verdict.ok && nextHref && (
            <a className="btn btn-primary" href={nextHref}>
              {nextLabel}
            </a>
          )}
        </div>
      )}
    </div>
  );
}
