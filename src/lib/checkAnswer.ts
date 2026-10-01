import { ComputeEngine, type BoxedExpression } from "@cortex-js/compute-engine";

export const ce = new ComputeEngine();

// Real value at x, or NaN when the expression is undefined there or not real
// (taking only the real part would accept ln(x) for ln|x|, or 2x + i for 2x).
function valueAt(expr: BoxedExpression, x: number): number {
  const v = expr.subs({ x: ce.number(x) }).N();
  const re = v.re;
  const im = v.im;
  if (typeof re !== "number" || !Number.isFinite(re)) return NaN;
  if (typeof im === "number" && Math.abs(im) > 1e-12 * Math.max(1, Math.abs(re))) return NaN;
  return re;
}

// French decimal comma: MathLive emits "0,5" (or "0{,}5"). Compute Engine reads the
// first as a tuple and the second as the digit-grouped 05, so rewrite both as "0.5".
// No exercise expects a comma-separated list, so a comma between digits is always decimal.
export function normalizeDecimalComma(tex: string): string {
  return tex.replace(/(\d)\s*(?:\{,\}|,)\s*(?=\d)/g, "$1.");
}

const DEGREE = /\^\{?\\circ\}?|°|\\degree/g;

// Deterministic sample points: the same answer always gets the same verdict.
// Most points in [-3, 3], where the exercises live, a few further out so that
// an answer that only agrees on a small window is still caught.
const SAMPLES = (() => {
  let s = 0x9e3779b9;
  const rand = () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return Array.from({ length: 16 }, (_, i) => (i < 11 ? rand() * 6 - 3 : rand() * 20 - 10));
})();

function compare(a: BoxedExpression, b: BoxedExpression): boolean {
  const direct = a.isEqual(b);
  if (direct !== undefined) return direct;

  // Compute Engine returns `undefined` as soon as a free variable appears: compare by sampling.
  let compared = 0;
  for (const x of SAMPLES) {
    const va = valueAt(a, x);
    const vb = valueAt(b, x);
    const fa = Number.isFinite(va);
    const fb = Number.isFinite(vb);
    // Defined for one and not the other: the two functions have different domains.
    if (fa !== fb) return false;
    if (!fa) continue;
    compared++;
    if (Math.abs(va - vb) > 1e-9 * Math.max(1, Math.abs(va))) return false;
  }
  return compared >= 5;
}

export function isEquivalent(answerTex: string, expectedTex: string): boolean {
  if (answerTex.trim() === "") return false;
  const answer = normalizeDecimalComma(answerTex);
  const a = ce.parse(answer);
  const b = ce.parse(normalizeDecimalComma(expectedTex));
  if (!a.isValid) return false;
  if (compare(a, b)) return true;
  // "135°" is read as 3π/4 radians; for a question asked in degrees, also try the bare number.
  const bareTex = answer.replace(DEGREE, "");
  if (bareTex === answer) return false;
  const bare = ce.parse(bareTex);
  return bare.isValid && compare(bare, b);
}
