import { fracTex, pick, randInt, randNonZero } from "../../lib/random";
import type { Exercise, ExerciseGenerator } from "../types";

// Exact rationals [num, den], den > 0, kept reduced.
type Q = [number, number];
const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
const q = (n: number, d = 1): Q => {
  const g = gcd(n, d) || 1;
  return d < 0 ? [-n / g, -d / g] : [n / g, d / g];
};
const add = (a: Q, b: Q) => q(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
const mul = (a: Q, b: Q) => q(a[0] * b[0], a[1] * b[1]);
const div = (a: Q, b: Q) => q(a[0] * b[1], a[1] * b[0]);
const tex = (a: Q) => fracTex(a[0], a[1]);
const ptex = (a: Q) => (a[0] < 0 ? `\\left(${tex(a)}\\right)` : tex(a));
// Square of a rational: parentheses around any fraction or negative number.
const sqTex = (a: Q) => (a[0] < 0 || a[1] !== 1 ? `\\left(${tex(a)}\\right)^2` : `${tex(a)}^2`);
const coefTex = (n: number, v: string) => `${n === 1 ? "" : n === -1 ? "-" : n}${v}`;
const plusTerm = (n: number, v: string) => `${n < 0 ? "-" : "+"} ${Math.abs(n) === 1 ? "" : Math.abs(n)}${v}`;

// min ax² + by² subject to px + qy = c. With ∇f = λ∇h: x = λp/(2a), y = λq/(2b), λ = c / (p²/(2a) + q²/(2b)).
function linearConstraint(): Exercise {
  const a = randInt(1, 4);
  const b = randInt(1, 4);
  const p = randNonZero(-3, 3);
  const qq = randNonZero(-3, 3);
  const c = randNonZero(-6, 6);
  const K = add(q(p * p, 2 * a), q(qq * qq, 2 * b));
  const lam = div(q(c), K);
  const x = mul(lam, q(p, 2 * a));
  const y = mul(lam, q(qq, 2 * b));
  const val = mul(q(c), div(lam, q(2)));
  const kind = pick(["x", "y", "lambda", "val"] as const);
  const target = { x: "x^\\star", y: "y^\\star", lambda: "\\lambda", val: "\\min f" }[kind];
  const ans = { x, y, lambda: lam, val }[kind];
  return {
    intro: "Minimise $f$ sous la contrainte, avec la convention $\\nabla f = \\lambda \\nabla h$.",
    promptTex: `f(x, y) = ${coefTex(a, "x^2")} + ${coefTex(b, "y^2")} \\qquad ${coefTex(p, "x")} ${plusTerm(qq, "y")} = ${c} \\qquad ${target}`,
    answerTex: tex(ans),
    hint: "$\\nabla f = (2ax,\\ 2by) = \\lambda\\,(p, q)$ exprime $x$ et $y$ en fonction de $\\lambda$ ; reporte dans la contrainte pour trouver $\\lambda$.",
    solution: [
      `(${2 * a}x,\\ ${2 * b}y) = \\lambda\\,(${p}, ${qq}) \\implies x = ${tex(q(p, 2 * a))}\\,\\lambda,\\quad y = ${tex(q(qq, 2 * b))}\\,\\lambda`,
      `${p} \\times ${tex(q(p, 2 * a))}\\,\\lambda + ${qq < 0 ? `(${qq})` : qq} \\times ${tex(q(qq, 2 * b))}\\,\\lambda = ${tex(K)}\\,\\lambda = ${c} \\implies \\lambda = ${tex(lam)}`,
      `x^\\star = ${tex(x)},\\quad y^\\star = ${tex(y)},\\quad \\min f = ${a} \\times ${sqTex(x)} + ${b} \\times ${sqTex(y)} = ${tex(val)}`,
    ],
  };
}

// Extremes of px + qy on the circle x² + y² = r²: ±r‖(p, q)‖, and λ = ‖(p, q)‖/(2r) at the maximum.
function circle(): Exercise {
  const [a, b, n] = pick([
    [3, 4, 5],
    [4, 3, 5],
    [6, 8, 10],
    [5, 12, 13],
    [12, 5, 13],
    [8, 15, 17],
  ]);
  const p = a * pick([1, -1]);
  const qq = b * pick([1, -1]);
  const r = randInt(1, 4);
  const kind = pick(["max", "min", "lambda"]);
  const ans = kind === "max" ? q(r * n) : kind === "min" ? q(-r * n) : q(n, 2 * r);
  const target = kind === "max" ? "\\max f" : kind === "min" ? "\\min f" : "\\lambda \\text{ au maximum}";
  return {
    intro:
      kind === "lambda"
        ? "Au point où $f$ atteint son maximum sur le cercle, donne le multiplicateur $\\lambda$ (convention $\\nabla f = \\lambda \\nabla h$, $h = x^2 + y^2$)."
        : `Donne le ${kind === "max" ? "maximum" : "minimum"} de $f$ sur le cercle.`,
    promptTex: `f(x, y) = ${coefTex(p, "x")} ${plusTerm(qq, "y")} \\qquad x^2 + y^2 = ${r * r} \\qquad ${target}`,
    answerTex: tex(ans),
    hint: "$(p, q) = \\lambda\\,(2x, 2y)$ : le point optimal est aligné avec $(p, q)$, sur le cercle de rayon $r$.",
    solution: [
      `(${p}, ${qq}) = 2\\lambda\\,(x, y) \\implies (x, y) = \\pm ${r}\\,\\frac{(${p}, ${qq})}{${n}} \\quad (\\|(${p}, ${qq})\\| = ${n})`,
      kind === "lambda"
        ? `\\text{au maximum : } ${n} = 2\\lambda \\times ${r} \\implies \\lambda = ${tex(ans)}`
        : `f = \\pm ${r} \\times \\frac{${p * p + qq * qq}}{${n}} = \\pm ${r * n} \\implies ${target} = ${tex(ans)}`,
    ],
  };
}

// Max / min of xᵀSx on the unit circle: the extreme eigenvalues of S (PCA: the variance along the first component).
function rayleigh(): Exercise {
  let a = 0;
  let b = 0;
  let d = 0;
  let disc = -1;
  // Symmetric 2×2 with integer eigenvalues: (a − d)² + 4b² must be a perfect square.
  while (disc < 0 || Math.sqrt(disc) % 1 !== 0 || b === 0) {
    a = randInt(1, 9);
    d = randInt(1, 9);
    b = randNonZero(-4, 4);
    disc = (a - d) ** 2 + 4 * b * b;
  }
  const s = Math.sqrt(disc);
  const hi = (a + d + s) / 2;
  const lo = (a + d - s) / 2;
  const kind = pick(["max", "min", "pca"]);
  const ans = kind === "min" ? lo : hi;
  const S = `\\begin{pmatrix} ${a} & ${b} \\\\ ${b} & ${d} \\end{pmatrix}`;
  return {
    intro:
      kind === "pca"
        ? "Les données ont la matrice de covariance $S$. Quelle est la plus grande variance possible de leur projection sur une direction unitaire $u$ ?"
        : `Donne le ${kind === "max" ? "maximum" : "minimum"} de $u^\\top S u$ sous la contrainte $\\|u\\| = 1$.`,
    promptTex: `S = ${S} \\qquad ${kind === "pca" ? "\\max_{\\|u\\| = 1} u^\\top S u" : kind === "max" ? "\\max u^\\top S u" : "\\min u^\\top S u"}`,
    answerTex: String(ans),
    hint: "Lagrange donne $Su = \\lambda u$ et $u^\\top S u = \\lambda$ : les candidats sont les valeurs propres de $S$.",
    solution: [
      `\\operatorname{tr} S = ${a + d},\\quad \\det S = ${a * d - b * b} \\implies \\lambda^2 - ${a + d}\\lambda ${a * d - b * b < 0 ? "-" : "+"} ${Math.abs(a * d - b * b)} = 0`,
      `\\lambda \\in \\{${lo},\\ ${hi}\\} \\implies ${kind === "min" ? "\\min" : "\\max"} u^\\top S u = ${ans}`,
    ],
  };
}

// Sensitivity: p*(c + δ) ≈ p*(c) + λδ.
function sensitivity(): Exercise {
  const c = randInt(2, 10);
  const delta = pick([q(1, 10), q(-1, 10), q(1, 2), q(1, 100), q(-1, 2)]);
  const product = Math.random() < 0.5;
  // max xy s.t. x + y = c: x = y = c/2, λ = c/2, p* = c²/4. min x² + y² s.t. x + y = c: x = y = c/2, λ = c, p* = c²/2.
  const lam = product ? q(c, 2) : q(c);
  const pstar = product ? q(c * c, 4) : q(c * c, 2);
  const ans = add(pstar, mul(lam, delta));
  const f = product ? "xy" : "x^2 + y^2";
  return {
    intro: `On ${product ? "maximise" : "minimise"} $f$ sous $x + y = c$. Estime la nouvelle valeur optimale quand $c$ devient $c + \\delta$, à l'aide du multiplicateur (convention $\\nabla f = \\lambda \\nabla h$).`,
    promptTex: `f(x, y) = ${f} \\qquad c = ${c} \\qquad \\delta = ${tex(delta)} \\qquad p^\\star(c + \\delta) \\approx\\ ?`,
    answerTex: tex(ans),
    hint: "Résous d'abord le problème pour $c$ (par symétrie $x = y$), trouve $\\lambda$, puis $p^\\star(c + \\delta) \\approx p^\\star(c) + \\lambda\\delta$.",
    solution: [
      product
        ? `(y, x) = \\lambda\\,(1, 1) \\implies x = y = \\tfrac c2 = ${tex(q(c, 2))},\\quad \\lambda = ${tex(lam)},\\quad p^\\star = ${tex(pstar)}`
        : `(2x, 2y) = \\lambda\\,(1, 1) \\implies x = y = \\tfrac c2 = ${tex(q(c, 2))},\\quad \\lambda = ${tex(lam)},\\quad p^\\star = ${tex(pstar)}`,
      `p^\\star(c + \\delta) \\approx ${tex(pstar)} + ${tex(lam)} \\times ${ptex(delta)} = ${tex(ans)}`,
    ],
  };
}

// Softmax at temperature T maximizes p·z + T H(p) under Σp = 1: log(p_i / p_j) = (z_i − z_j)/T.
function softmaxRatio(): Exercise {
  const z = [randInt(-3, 4), randInt(-3, 4), randInt(-3, 4)];
  const T = pick([q(1), q(2), q(1, 2), q(3), q(1, 4)]);
  const i = randInt(0, 2);
  const j = (i + randInt(1, 2)) % 3;
  // Two distinct scores for the pair asked about (the loop terminates since z[i] is redrawn).
  while (z[i] === z[j]) z[i] = randInt(-3, 4);
  const ans = div(q(z[i] - z[j]), T);
  return {
    intro: "La distribution $p$ maximise $\\sum_k p_k z_k + T\\,H(p)$ sous la contrainte $\\sum_k p_k = 1$. Donne $\\log(p_i / p_j)$.",
    promptTex: `z = (${z.join(", ")}) \\qquad T = ${tex(T)} \\qquad \\log \\frac{p_${i + 1}}{p_${j + 1}}`,
    answerTex: tex(ans),
    hint: "Le lagrangien donne $z_k - T(\\log p_k + 1) - \\lambda = 0$, donc $\\log p_k = z_k / T + \\text{constante}$.",
    solution: [
      `p_k = \\frac{e^{z_k / T}}{\\sum_l e^{z_l / T}} \\implies \\log \\frac{p_${i + 1}}{p_${j + 1}} = \\frac{z_${i + 1} - z_${j + 1}}{T}`,
      `= \\frac{${z[i]} - ${z[j] < 0 ? `(${z[j]})` : z[j]}}{${tex(T)}} = ${tex(ans)}`,
    ],
  };
}

export const lagrangeGenerators: ExerciseGenerator[] = [
  { id: "lg-lineaire", make: linearConstraint },
  { id: "lg-cercle", make: circle },
  { id: "lg-rayleigh", make: rayleigh },
  { id: "lg-sensibilite", make: sensitivity },
  { id: "lg-softmax", make: softmaxRatio },
];
