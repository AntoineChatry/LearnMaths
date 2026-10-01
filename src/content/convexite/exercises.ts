import { fracTex, pick, randInt, randNonZero } from "../../lib/random";
import { trinomial } from "../../lib/tex";
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
const ptex = (a: Q) => (a[0] < 0 ? `\\left(${tex(a)}\\right)` : tex(a));
const par = (n: number) => (n < 0 ? `(${n})` : String(n));

// Jensen gap of the chord inequality for a quadratic: θf(x) + (1−θ)f(y) − f(θx + (1−θ)y) = aθ(1−θ)(x−y)².
function chordGap(): Exercise {
  const a = randInt(1, 3);
  const b = randInt(-4, 4);
  const c = randInt(-5, 5);
  const x = randInt(-4, 4);
  let y = randInt(-4, 4);
  while (y === x) y = randInt(-4, 4);
  const th = pick([q(1, 2), q(1, 3), q(2, 3), q(1, 4), q(3, 4)]);
  const f = (t: Q) => add(add(mul(q(a), mul(t, t)), mul(q(b), t)), q(c));
  const z = add(mul(th, q(x)), mul(sub(q(1), th), q(y)));
  const chord = add(mul(th, f(q(x))), mul(sub(q(1), th), f(q(y))));
  const ans = sub(chord, f(z));
  return {
    intro: "Calcule l'écart entre la corde et le graphe au point $\\theta x + (1-\\theta)y$ : $\\theta f(x) + (1-\\theta) f(y) - f(\\theta x + (1-\\theta) y)$.",
    promptTex: `f(t) = ${trinomial(a, b, c).replace(/x/g, "t")} \\qquad x = ${x},\\ y = ${y},\\ \\theta = ${tex(th)}`,
    answerTex: tex(ans),
    hint: "Calcule le point $z = \\theta x + (1-\\theta) y$, puis $f(z)$, et la moyenne $\\theta f(x) + (1-\\theta) f(y)$.",
    solution: [
      `z = ${tex(th)} \\times ${par(x)} + ${tex(sub(q(1), th))} \\times ${par(y)} = ${tex(z)} \\qquad f(z) = ${tex(f(z))}`,
      `\\theta f(x) + (1-\\theta) f(y) = ${tex(th)} \\times ${ptex(f(q(x)))} + ${tex(sub(q(1), th))} \\times ${ptex(f(q(y)))} = ${tex(chord)}`,
      `\\text{écart} = ${tex(chord)} - ${ptex(f(z))} = ${tex(ans)} \\qquad \\big(= a\\,\\theta(1-\\theta)(x-y)^2\\big)`,
    ],
  };
}

// Convexity of f(x, y) = ax² + bxy + cy²: Hessian [[2a, b], [b, 2c]] ⪰ 0 ⇔ a, c ≥ 0 and 4ac ≥ b².
function quadraticHessian(): Exercise {
  if (Math.random() < 0.5) {
    const a = randInt(1, 4);
    const b = randNonZero(-6, 6);
    const ans = q(b * b, 4 * a);
    return {
      intro: "Pour quelles valeurs de $c$ cette fonction est-elle convexe ? Donne la plus petite.",
      promptTex: `f(x, y) = ${a === 1 ? "" : a}x^2 ${b < 0 ? "-" : "+"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}xy + c\\,y^2 \\qquad c_{\\min}`,
      answerTex: tex(ans),
      hint: "La hessienne est $\\begin{pmatrix} 2a & b \\\\ b & 2c \\end{pmatrix}$ : semi-définie positive si ses coefficients diagonaux et son déterminant sont $\\ge 0$.",
      solution: [
        `\\nabla^2 f = \\begin{pmatrix} ${2 * a} & ${b} \\\\ ${b} & 2c \\end{pmatrix} \\qquad \\det = ${4 * a}c - ${b * b}`,
        `${4 * a}c - ${b * b} \\ge 0 \\iff c \\ge ${tex(ans)} \\quad (\\text{et alors } 2c \\ge 0)`,
      ],
    };
  }
  // ac a perfect square, so that b_max = 2√(ac) is an integer.
  const [a, c] = pick([
    [1, 1],
    [1, 4],
    [4, 1],
    [1, 9],
    [2, 2],
    [2, 8],
    [3, 3],
    [4, 9],
    [3, 12],
    [2, 18],
  ]);
  const ans = 2 * Math.sqrt(a * c);
  return {
    intro: "Jusqu'à quelle valeur de $b \\ge 0$ cette fonction est-elle convexe ? Donne la plus grande.",
    promptTex: `f(x, y) = ${a === 1 ? "" : a}x^2 + b\\,xy + ${c === 1 ? "" : c}y^2 \\qquad b_{\\max}`,
    answerTex: String(ans),
    hint: "La hessienne est $\\begin{pmatrix} 2a & b \\\\ b & 2c \\end{pmatrix}$ ; ici la diagonale est positive, il reste le déterminant.",
    solution: [
      `\\nabla^2 f = \\begin{pmatrix} ${2 * a} & b \\\\ b & ${2 * c} \\end{pmatrix} \\qquad \\det = ${4 * a * c} - b^2`,
      `b^2 \\le ${4 * a * c} \\iff b \\le ${ans}`,
    ],
  };
}

// First-order condition: the tangent plane is a global underestimator of a convex function.
function tangentBound(): Exercise {
  const x0 = [randInt(-3, 3), randInt(-3, 3)];
  const y = [randInt(-3, 3), randInt(-3, 3)];
  if (y[0] === x0[0] && y[1] === x0[1]) y[0] = x0[0] + 1;
  const g = [randNonZero(-5, 5), randInt(-5, 5)];
  const fx = randInt(-6, 10);
  const d = [y[0] - x0[0], y[1] - x0[1]];
  const dot = g[0] * d[0] + g[1] * d[1];
  const ans = fx + dot;
  return {
    intro: "$f$ est convexe et dérivable. On connaît seulement sa valeur et son gradient en $x_0$. Donne le meilleur minorant de $f(y)$ que cela garantit.",
    promptTex: `f(x_0) = ${fx} \\qquad \\nabla f(x_0) = (${g[0]}, ${g[1]}) \\qquad x_0 = (${x0[0]}, ${x0[1]}),\\ y = (${y[0]}, ${y[1]})`,
    answerTex: String(ans),
    hint: "Pour $f$ convexe : $f(y) \\ge f(x_0) + \\nabla f(x_0)^\\top (y - x_0)$.",
    solution: [
      `y - x_0 = (${d[0]}, ${d[1]}) \\qquad \\nabla f(x_0)^\\top (y - x_0) = ${g[0]} \\times ${par(d[0])} + ${par(g[1])} \\times ${par(d[1])} = ${dot}`,
      `f(y) \\ge ${fx} + ${par(dot)} = ${ans}`,
    ],
  };
}

// Strong convexity (Boyd 9.9 and 9.11): f(x) − p* ≤ ‖∇f‖²/(2m), ‖x − x*‖ ≤ 2‖∇f‖/m.
function strongConvexity(): Exercise {
  const m = pick([q(1, 2), q(1), q(2), q(3), q(4), q(5)]);
  if (Math.random() < 0.5) {
    const g = [randNonZero(-4, 4), randInt(-4, 4)];
    const n2 = g[0] * g[0] + g[1] * g[1];
    const fx = randInt(-5, 20);
    const gap = div(q(n2), mul(q(2), m));
    const ans = sub(q(fx), gap);
    return {
      intro: "$f$ vérifie $\\nabla^2 f \\succeq mI$ partout. Donne le minorant de $p^\\star = \\min f$ que garantit la forte convexité.",
      promptTex: `m = ${tex(m)} \\qquad f(x) = ${fx} \\qquad \\nabla f(x) = (${g[0]}, ${g[1]}) \\qquad p^\\star \\ge\\ ?`,
      answerTex: tex(ans),
      hint: "Boyd, équation 9.9 : $p^\\star \\ge f(x) - \\frac{1}{2m}\\|\\nabla f(x)\\|^2$.",
      solution: [
        `\\|\\nabla f(x)\\|^2 = ${g[0] * g[0]} + ${g[1] * g[1]} = ${n2}`,
        `p^\\star \\ge ${fx} - \\frac{${n2}}{2 \\times ${tex(m)}} = ${fx} - ${ptex(gap)} = ${tex(ans)}`,
      ],
    };
  }
  const [a, b, n] = pick([
    [3, 4, 5],
    [6, 8, 10],
    [5, 12, 13],
    [0, 2, 2],
    [1, 0, 1],
    [8, 6, 10],
  ]);
  const g = [a * pick([1, -1]), b * pick([1, -1])];
  const ans = div(q(2 * n), m);
  return {
    intro: "$f$ vérifie $\\nabla^2 f \\succeq mI$ partout. À quelle distance au plus du minimiseur $x^\\star$ se trouve $x$ ?",
    promptTex: `m = ${tex(m)} \\qquad \\nabla f(x) = (${g[0]}, ${g[1]}) \\qquad \\|x - x^\\star\\| \\le\\ ?`,
    answerTex: tex(ans),
    hint: "Boyd, équation 9.11 : $\\|x - x^\\star\\| \\le \\frac 2m \\|\\nabla f(x)\\|$.",
    solution: [
      `\\|\\nabla f(x)\\| = \\sqrt{${a * a} + ${b * b}} = ${n}`,
      `\\|x - x^\\star\\| \\le \\frac{2 \\times ${n}}{${tex(m)}} = ${tex(ans)}`,
    ],
  };
}

// Ridge: the Hessian 2XᵀX + 2λI has eigenvalues 2(μ + λ); rate bound c = 1 − m/M or κ = M/m.
function ridgeConditioning(): Exercise {
  const mu = [pick([0, 0, 1, 2, 4]), randInt(5, 20)];
  const lam = pick([q(1, 2), q(1), q(2), q(3), q(5)]);
  const m = mul(q(2), add(q(mu[0]), lam));
  const M = mul(q(2), add(q(mu[1]), lam));
  const kind = pick(["kappa", "c"]);
  const ans = kind === "kappa" ? div(M, m) : sub(q(1), div(m, M));
  return {
    intro:
      kind === "kappa"
        ? "Moindres carrés avec ridge, $\\|Xw - y\\|^2 + \\lambda\\|w\\|^2$. Les valeurs propres de $X^\\top X$ sont données. Donne le conditionnement $\\kappa = M/m$ de la hessienne."
        : "Moindres carrés avec ridge, $\\|Xw - y\\|^2 + \\lambda\\|w\\|^2$. Les valeurs propres de $X^\\top X$ sont données. Donne le facteur $c = 1 - m/M$ de la borne de Boyd.",
    promptTex: `\\operatorname{spec}(X^\\top X) = \\{${mu[0]},\\ ${mu[1]}\\} \\qquad \\lambda = ${tex(lam)} \\qquad ${kind === "kappa" ? "\\kappa" : "c"}`,
    answerTex: tex(ans),
    hint: "La hessienne est $2X^\\top X + 2\\lambda I$ : chaque valeur propre $\\mu$ de $X^\\top X$ donne $2(\\mu + \\lambda)$.",
    solution: [
      `m = 2(${mu[0]} + ${tex(lam)}) = ${tex(m)} \\qquad M = 2(${mu[1]} + ${tex(lam)}) = ${tex(M)}`,
      kind === "kappa" ? `\\kappa = \\frac{${tex(M)}}{${tex(m)}} = ${tex(ans)}` : `c = 1 - \\frac{${tex(m)}}{${tex(M)}} = ${tex(ans)}`,
    ],
  };
}

// Jensen gap for f(x) = ax² + bx: E[f(X)] − f(E[X]) = a Var(X).
function jensenGap(): Exercise {
  const a = randInt(1, 3);
  const b = randInt(-3, 3);
  const vals = [randInt(-3, 0), randInt(1, 2), randInt(3, 5)];
  const probs = pick([
    [q(1, 3), q(1, 3), q(1, 3)],
    [q(1, 2), q(1, 4), q(1, 4)],
    [q(1, 4), q(1, 2), q(1, 4)],
    [q(1, 5), q(2, 5), q(2, 5)],
    [q(1, 6), q(1, 2), q(1, 3)],
  ]);
  const f = (t: Q) => add(mul(q(a), mul(t, t)), mul(q(b), t));
  const mean = vals.reduce((s, v, i) => add(s, mul(probs[i], q(v))), q(0));
  const ef = vals.reduce((s, v, i) => add(s, mul(probs[i], f(q(v)))), q(0));
  const ans = sub(ef, f(mean));
  const fTex = `${a === 1 ? "" : a}t^2${b === 0 ? "" : ` ${b < 0 ? "-" : "+"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}t`}`;
  const law = vals.map((v, i) => `P(X = ${v}) = ${tex(probs[i])}`).join(",\\ ");
  return {
    intro: "Calcule l'écart de Jensen $\\mathbb E[f(X)] - f(\\mathbb E[X])$.",
    promptTex: `\\begin{gathered} f(t) = ${fTex} \\\\ ${law} \\end{gathered}`,
    answerTex: tex(ans),
    hint: "Calcule $\\mathbb E[X]$, puis $\\mathbb E[f(X)] = \\sum_i p_i f(x_i)$. Raccourci : l'écart vaut $a\\,\\operatorname{Var}(X)$.",
    solution: [
      `\\mathbb E[X] = ${tex(mean)} \\qquad f(\\mathbb E[X]) = ${tex(f(mean))}`,
      `\\mathbb E[f(X)] = ${vals.map((v, i) => `${tex(probs[i])} \\times ${ptex(f(q(v)))}`).join(" + ")} = ${tex(ef)}`,
      `\\text{écart} = ${tex(ef)} - ${ptex(f(mean))} = ${tex(ans)}`,
    ],
  };
}

export const convexiteGenerators: ExerciseGenerator[] = [
  { id: "cvx-corde", make: chordGap },
  { id: "cvx-hessienne", make: quadraticHessian },
  { id: "cvx-tangente", make: tangentBound },
  { id: "cvx-forte", make: strongConvexity },
  { id: "cvx-ridge", make: ridgeConditioning },
  { id: "cvx-jensen", make: jensenGap },
];
