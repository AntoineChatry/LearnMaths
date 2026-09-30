import { ComputeEngine, type BoxedExpression } from "@cortex-js/compute-engine";

export const ce = new ComputeEngine();

function valueAt(expr: BoxedExpression, x: number): number {
  const v = expr.subs({ x: ce.number(x) }).N().re;
  return typeof v === "number" ? v : NaN;
}

// Compute Engine can compare constants, but returns `undefined`
// as soon as a free variable appears: we then compare by sampling.
export function isEquivalent(answerTex: string, expectedTex: string): boolean {
  if (answerTex.trim() === "") return false;
  const a = ce.parse(answerTex);
  const b = ce.parse(expectedTex);
  if (!a.isValid) return false;

  const direct = a.isEqual(b);
  if (direct !== undefined) return direct;

  let compared = 0;
  for (let i = 0; i < 12; i++) {
    const x = Math.random() * 6 - 3;
    const va = valueAt(a, x);
    const vb = valueAt(b, x);
    if (!Number.isFinite(va) || !Number.isFinite(vb)) continue;
    compared++;
    if (Math.abs(va - vb) > 1e-9 * Math.max(1, Math.abs(va))) return false;
  }
  return compared >= 5;
}
