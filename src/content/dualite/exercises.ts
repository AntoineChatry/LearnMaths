import { fracTex, pick, randInt } from "../../lib/random";
import type { Exercise, ExerciseGenerator } from "../types";

// Exact rationals [num, den], den > 0, kept reduced.
type Q = [number, number];
const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
const q = (n: number, d = 1): Q => {
  const g = gcd(n, d) || 1;
  return d < 0 ? [-n / g, -d / g] : [n / g, d / g];
};
const add = (a: Q, b: Q) => q(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
const sub = (a: Q, b: Q) => q(a[0] * b[1] - b[0] * a[1], a[1] * b[1]);
const mul = (a: Q, b: Q) => q(a[0] * b[0], a[1] * b[1]);
const div = (a: Q, b: Q) => q(a[0] * b[1], a[1] * b[0]);
const tex = (a: Q) => fracTex(a[0], a[1]);
const par = (n: number) => (n < 0 ? `(${n})` : String(n));
const TRIPLES = [
  [3, 4, 5],
  [4, 3, 5],
  [6, 8, 10],
  [8, 6, 10],
  [5, 12, 13],
  [12, 5, 13],
  [0, 5, 5],
  [4, 0, 4],
];

// min (x − a)² subject to x ≤ b or x ≥ b. Stationarity 2(x − a) ± λ = 0, λ ≥ 0, λ(constraint) = 0.
function oneDimensional(): Exercise {
  const a = randInt(-6, 6);
  const b = randInt(-5, 5);
  const upper = Math.random() < 0.5; // constraint x ≤ b, else x ≥ b
  const x = upper ? Math.min(a, b) : Math.max(a, b);
  const lam = 2 * Math.abs(a - x);
  // Keep inactive constraints (λ = 0) as a minority of the draws.
  if (lam === 0 && Math.random() < 0.6) return oneDimensional();
  const askLam = Math.random() < 0.5;
  const g = upper ? `x - ${par(b)}` : `${par(b)} - x`;
  return {
    intro: askLam
      ? `Minimise $(x - a)^2$ sous la contrainte, écrite $g(x) = ${g} \\le 0$. Donne le multiplicateur $\\lambda$ des conditions KKT.`
      : "Minimise $(x - a)^2$ sous la contrainte. Donne $x^\\star$.",
    promptTex: `f(x) = ${a === 0 ? "x^2" : `(x ${a < 0 ? "+" : "-"} ${Math.abs(a)})^2`} \\qquad x ${upper ? "\\le" : "\\ge"} ${b} \\qquad ${askLam ? "\\lambda" : "x^\\star"}`,
    answerTex: String(askLam ? lam : x),
    hint: "Si le minimum sans contrainte $x = a$ est admissible, la contrainte est inactive et $\\lambda = 0$. Sinon, $x^\\star = b$ et la stationnarité $f'(x^\\star) + \\lambda g'(x^\\star) = 0$ donne $\\lambda$.",
    solution:
      x === a
        ? [`a = ${a} \\text{ vérifie } x ${upper ? "\\le" : "\\ge"} ${b} \\implies x^\\star = ${a},\\ \\text{contrainte inactive},\\ \\lambda = 0`]
        : [
            `a = ${a} \\text{ ne vérifie pas } x ${upper ? "\\le" : "\\ge"} ${b} \\implies \\text{contrainte active},\\ x^\\star = ${b}`,
            `f'(x^\\star) + \\lambda g'(x^\\star) = 2(${b} - ${par(a)}) ${upper ? "+" : "-"} \\lambda = 0 \\implies \\lambda = ${lam}`,
          ],
  };
}

// Projection of p onto the disk ‖x‖ ≤ R: x* = p/(1 + λ), λ = ‖p‖/R − 1 when p is outside (g = ‖x‖² − R²).
function projection(): Exercise {
  const [u, v, n] = pick(TRIPLES);
  const p = [u * pick([1, -1]), v * pick([1, -1])];
  const R = randInt(1, 12);
  const outside = n > R;
  if (!outside && Math.random() < 0.6) return projection();
  const lam = outside ? sub(q(n, R), q(1)) : q(0);
  const kind = pick(["lambda", "x1", "x2"] as const);
  const coord = (c: number) => (outside ? q(c * R, n) : q(c));
  const ans = kind === "lambda" ? lam : coord(kind === "x1" ? p[0] : p[1]);
  const target = kind === "lambda" ? "\\lambda" : kind === "x1" ? "x_1^\\star" : "x_2^\\star";
  return {
    intro: "Projette $p$ sur le disque : minimise $\\|x - p\\|^2$ sous $g(x) = \\|x\\|^2 - R^2 \\le 0$.",
    promptTex: `p = (${p[0]}, ${p[1]}) \\qquad R = ${R} \\qquad ${target}`,
    answerTex: tex(ans),
    hint: "Si $\\|p\\| \\le R$, alors $x^\\star = p$ et $\\lambda = 0$. Sinon, $2(x - p) + 2\\lambda x = 0$ donne $x^\\star = p/(1 + \\lambda)$ sur le cercle, donc $1 + \\lambda = \\|p\\|/R$.",
    solution: outside
      ? [
          `\\|p\\| = ${n} > ${R} \\implies \\text{contrainte active} \\qquad 1 + \\lambda = \\frac{${n}}{${R}} \\implies \\lambda = ${tex(lam)}`,
          `x^\\star = \\frac{${R}}{${n}}\\,(${p[0]}, ${p[1]}) = \\left(${tex(coord(p[0]))},\\ ${tex(coord(p[1]))}\\right)`,
        ]
      : [`\\|p\\| = ${n} \\le ${R} \\implies x^\\star = p = (${p[0]}, ${p[1]}),\\ \\lambda = 0`],
  };
}

// Dual of min ax² s.t. x ≥ c (c > 0): D(λ) = λc − λ²/(4a), λ* = 2ac, d* = p* = ac².
function dualFunction(): Exercise {
  const a = randInt(1, 4);
  const c = randInt(1, 5);
  const kind = pick(["D", "lambda", "d"] as const);
  const l0 = randInt(1, 10);
  const D = sub(q(l0 * c), q(l0 * l0, 4 * a));
  const ans = kind === "D" ? D : kind === "lambda" ? q(2 * a * c) : q(a * c * c);
  const target = kind === "D" ? `D(${l0})` : kind === "lambda" ? "\\lambda^\\star" : "d^\\star";
  return {
    intro:
      kind === "D"
        ? "Calcule la fonction duale $D(\\lambda) = \\min_x L(x, \\lambda)$ au point indiqué : c'est une borne inférieure de $p^\\star$."
        : kind === "lambda"
          ? "Quel $\\lambda$ maximise la fonction duale $D(\\lambda) = \\min_x L(x, \\lambda)$ ?"
          : "Donne la valeur optimale du dual, $d^\\star = \\max_{\\lambda \\ge 0} D(\\lambda)$.",
    promptTex: `\\min ${a === 1 ? "" : a}x^2 \\ \\text{ sous } \\ g(x) = ${c} - x \\le 0 \\qquad ${target}`,
    answerTex: tex(ans),
    hint: "$L(x, \\lambda) = ax^2 + \\lambda(c - x)$ est minimal en $x = \\lambda / (2a)$, d'où $D(\\lambda) = \\lambda c - \\frac{\\lambda^2}{4a}$.",
    solution: [
      `\\partial_x L = ${2 * a}x - \\lambda = 0 \\implies x = \\frac{\\lambda}{${2 * a}} \\implies D(\\lambda) = ${c}\\lambda - \\frac{\\lambda^2}{${4 * a}}`,
      kind === "D"
        ? `D(${l0}) = ${c * l0} - \\frac{${l0 * l0}}{${4 * a}} = ${tex(D)} \\quad (\\le p^\\star = ${a * c * c})`
        : kind === "lambda"
          ? `D'(\\lambda) = ${c} - \\frac{\\lambda}{${2 * a}} = 0 \\implies \\lambda^\\star = ${2 * a * c}`
          : `d^\\star = D(${2 * a * c}) = ${2 * a * c * c} - ${a * c * c} = ${a * c * c} = p^\\star`,
    ],
  };
}

// Margin 2/‖w‖, slack ξ = max(0, 1 − t y(x)), or λ = 1/(2C).
function svmMargin(): Exercise {
  const kind = pick(["width", "slack", "lambda"] as const);
  if (kind === "lambda") {
    const C = pick([q(1), q(10), q(1, 2), q(5), q(100), q(1, 10)]);
    const ans = div(q(1), mul(q(2), C));
    return {
      intro: "La SVM à marge souple minimise $C \\sum_n \\xi_n + \\frac12 \\|w\\|^2$. Quel coefficient $\\lambda$ de la forme perte charnière $+\\ \\lambda \\|w\\|^2$ lui correspond ?",
      promptTex: `C = ${tex(C)} \\qquad \\lambda`,
      answerTex: tex(ans),
      hint: "Divise l'objectif par $C$ (PRML, équation 7.44).",
      solution: [`\\frac1C\\Big(C \\sum_n \\xi_n + \\tfrac12 \\|w\\|^2\\Big) = \\sum_n \\xi_n + \\frac{1}{2C}\\|w\\|^2 \\implies \\lambda = \\frac{1}{2 \\times ${tex(C)}} = ${tex(ans)}`],
    };
  }
  const [u, v, n] = pick(TRIPLES.filter((tr) => tr[0] !== 0 && tr[1] !== 0));
  const w = [u * pick([1, -1]), v * pick([1, -1])];
  if (kind === "width") {
    const ans = q(2, n);
    return {
      intro: "Largeur de la marge d'une SVM : distance entre les hyperplans $y(x) = 1$ et $y(x) = -1$.",
      promptTex: `w = (${w[0]}, ${w[1]}) \\qquad \\frac{2}{\\|w\\|}`,
      answerTex: tex(ans),
      hint: "Chaque hyperplan de marge est à la distance $1/\\|w\\|$ de la frontière $y(x) = 0$.",
      solution: [`\\|w\\| = \\sqrt{${u * u} + ${v * v}} = ${n} \\implies \\frac{2}{\\|w\\|} = ${tex(ans)}`],
    };
  }
  const x = [randInt(-3, 3), randInt(-3, 3)];
  const b = randInt(-5, 5);
  const t = pick([1, -1]);
  const y = w[0] * x[0] + w[1] * x[1] + b;
  const xi = Math.max(0, 1 - t * y);
  if (xi === 0 && Math.random() < 0.6) return svmMargin();
  return {
    intro: "Calcule la variable d'écart $\\xi_n = \\max(0,\\ 1 - t_n y(x_n))$ de ce point, pour $y(x) = w^\\top x + b$.",
    promptTex: `w = (${w[0]}, ${w[1]}),\\ b = ${b} \\qquad x_n = (${x[0]}, ${x[1]}),\\ t_n = ${t} \\qquad \\xi_n`,
    answerTex: String(xi),
    hint: "$\\xi_n = 0$ si le point est au-delà de sa marge ; entre 0 et 1 s'il est dans la marge du bon côté ; au-delà de 1 s'il est mal classé.",
    solution: [
      `y(x_n) = ${w[0]} \\times ${par(x[0])} + ${par(w[1])} \\times ${par(x[1])} + ${par(b)} = ${y} \\qquad t_n y(x_n) = ${t * y}`,
      `\\xi_n = \\max(0,\\ 1 - ${par(t * y)}) = ${xi}`,
    ],
  };
}

const det3 = (m: number[][]) =>
  m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
  m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
  m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);

// Three support vectors of a genuine hard-margin SVM: pick (w, b), three points on the margins
// t_n(wᵀx_n + b) = 1, then solve Σ a_n t_n = 0 (PRML 7.9) and Σ a_n t_n x_n = w (PRML 7.8) for a.
// With every a_n > 0, the KKT conditions (PRML 7.14–7.16) hold, so b is the same from any of the points.
function svmSupport(): { pts: number[][]; ts: number[]; as: Q[]; w: number[]; b: number } {
  for (;;) {
    const w = [randInt(-2, 2), randInt(-2, 2)];
    if (w[0] === 0 && w[1] === 0) continue;
    const b = randInt(-3, 3);
    const onMargin: number[][] = [];
    for (let x1 = -3; x1 <= 3; x1++)
      for (let x2 = -3; x2 <= 3; x2++) {
        const y = w[0] * x1 + w[1] * x2 + b;
        if (y === 1 || y === -1) onMargin.push([x1, x2, y]);
      }
    if (onMargin.length < 3) continue;
    const chosen: number[][] = [];
    while (chosen.length < 3) {
      const p = pick(onMargin);
      if (!chosen.includes(p)) chosen.push(p);
    }
    const ts = chosen.map((p) => p[2]);
    if (!ts.includes(1) || !ts.includes(-1)) continue;
    const pts = chosen.map((p) => [p[0], p[1]]);
    // Columns n: (t_n, t_n x_n1, t_n x_n2); right-hand side (0, w1, w2). Cramer's rule.
    const M = [ts, ts.map((t, n) => t * pts[n][0]), ts.map((t, n) => t * pts[n][1])];
    const D = det3(M);
    if (D === 0) continue;
    const rhs = [0, w[0], w[1]];
    const as = [0, 1, 2].map((n) => q(det3(M.map((row, i) => row.map((v, j) => (j === n ? rhs[i] : v)))), D));
    if (as.some((a) => a[0] <= 0 || a[1] > 8 || a[0] > 6 * a[1])) continue;
    return { pts, ts, as, w, b };
  }
}

// w = Σ a_n t_n x_n over the support vectors (PRML 7.8), then b = t_n − wᵀx_n on one of them.
function svmWeights(): Exercise {
  const { pts, ts, as } = svmSupport();
  const w = [0, 1].map((k) => as.reduce((acc, a, n) => add(acc, mul(a, q(ts[n] * pts[n][k]))), q(0)));
  const k = randInt(0, 1);
  const askB = Math.random() < 0.4;
  const n0 = randInt(0, 2);
  const b = sub(sub(q(ts[n0]), mul(w[0], q(pts[n0][0]))), mul(w[1], q(pts[n0][1])));
  const ans = askB ? b : w[k];
  const rows = pts.map((p, n) => `x_${n + 1} = (${p[0]}, ${p[1]}),\\ t_${n + 1} = ${ts[n]},\\ a_${n + 1} = ${tex(as[n])}`);
  return {
    intro: askB
      ? `On donne trois points avec leurs multiplicateurs duaux $a_n$ (qui vérifient $\\sum_n a_n t_n = 0$). Calcule $w = \\sum_n a_n t_n x_n$, puis $b$ : comme $a_${n0 + 1} > 0$, la complémentarité place $x_${n0 + 1}$ sur la marge, $t_${n0 + 1}\\,y(x_${n0 + 1}) = 1$.`
      : "On donne trois points avec leurs multiplicateurs duaux $a_n$ (qui vérifient $\\sum_n a_n t_n = 0$). Calcule la composante demandée de $w = \\sum_n a_n t_n x_n$.",
    promptTex: `\\begin{gathered} ${rows.join(" \\\\ ")} \\\\ ${askB ? "b" : `w_${k + 1}`} \\end{gathered}`,
    answerTex: tex(ans),
    hint: askB
      ? "Comme $t_n^2 = 1$, $t_n(w^\\top x_n + b) = 1$ donne $b = t_n - w^\\top x_n$."
      : "Somme sur les trois points de $a_n t_n$ fois la coordonnée demandée de $x_n$.",
    solution: [
      `w = ${as.map((a, n) => `${tex(a)} \\times ${par(ts[n])} \\times (${pts[n][0]}, ${pts[n][1]})`).join(" + ")} = \\left(${tex(w[0])},\\ ${tex(w[1])}\\right)`,
      ...(askB
        ? [`b = t_${n0 + 1} - w^\\top x_${n0 + 1} = ${ts[n0]} - \\left(${tex(w[0])} \\times ${par(pts[n0][0])} + ${w[1][0] < 0 ? `\\left(${tex(w[1])}\\right)` : tex(w[1])} \\times ${par(pts[n0][1])}\\right) = ${tex(b)}`]
        : []),
    ],
  };
}

export const dualiteGenerators: ExerciseGenerator[] = [
  { id: "kkt-1d", make: oneDimensional },
  { id: "kkt-projection", make: projection },
  { id: "kkt-dual", make: dualFunction },
  { id: "kkt-svm-marge", make: svmMargin },
  { id: "kkt-svm-poids", make: svmWeights },
];
