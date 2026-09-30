import { signed } from "./random";

// Leading coefficient: 1 → "", -1 → "-", 3 → "3".
export function coefLead(n: number): string {
  if (n === 1) return "";
  if (n === -1) return "-";
  return String(n);
}

// Term in x with its sign, to write it after another term: 3 → "+3x", -1 → "-x", 0 → "".
export function linearTerm(c: number): string {
  if (c === 0) return "";
  if (c === 1) return "+x";
  if (c === -1) return "-x";
  return `${signed(c)}x`;
}

export function xPow(d: number): string {
  return d === 1 ? "x" : `x^{${d}}`;
}

// ax² + bx + c with integer coefficients, a ≠ 0.
export function trinomial(a: number, b: number, c: number): string {
  return `${coefLead(a)}x^2${linearTerm(b)}${signed(c)}`;
}

// Decimal number in LaTeX with a French comma, rounded to `digits` decimals.
export function texNum(n: number, digits = 2): string {
  const r = Number(n.toFixed(digits));
  const s = String(Object.is(r, -0) ? 0 : r);
  return s.replace(".", "{,}");
}
