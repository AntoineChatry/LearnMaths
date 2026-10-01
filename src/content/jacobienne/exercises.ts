import { fracTex, pick, randInt, randNonZero } from "../../lib/random";
import type { Exercise, ExerciseGenerator } from "../types";

// Monomial c x^p y^q.
type Term = { c: number; p: number; q: number };
type Poly = Term[];

function termTex({ c, p, q }: Term, first: boolean): string {
  const pow = (v: string, e: number) => (e === 0 ? "" : e === 1 ? v : `${v}^${e}`);
  const body = `${pow("x", p)}${pow("y", q)}`;
  const abs = Math.abs(c);
  const mag = body === "" ? String(abs) : abs === 1 ? body : `${abs}${body}`;
  if (first) return c < 0 ? `-${mag}` : mag;
  return c < 0 ? ` - ${mag}` : ` + ${mag}`;
}

const polyTex = (f: Poly) => f.map((t, i) => termTex(t, i === 0)).join("");
const evalPoly = (f: Poly, x: number, y: number) => f.reduce((s, { c, p, q }) => s + c * x ** p * y ** q, 0);
// Partial derivative along x (v = 0) or y (v = 1).
const diffPoly = (f: Poly, v: 0 | 1): Poly =>
  f
    .filter((t) => (v === 0 ? t.p : t.q) > 0)
    .map((t) => (v === 0 ? { c: t.c * t.p, p: t.p - 1, q: t.q } : { c: t.c * t.q, p: t.p, q: t.q - 1 }));

// Two distinct monomials of total degree 1 to 3, each variable at most squared.
function randPoly(): Poly {
  const shapes: [number, number][] = [[1, 0], [0, 1], [2, 0], [0, 2], [1, 1], [2, 1], [1, 2]];
  const i = randInt(0, shapes.length - 1);
  let j = randInt(0, shapes.length - 2);
  if (j >= i) j++;
  return [shapes[i], shapes[j]].map(([p, q]) => ({ c: randNonZero(-3, 3), p, q }));
}

const mapTex = (f: Poly, g: Poly) => `f(x, y) = \\begin{pmatrix} ${polyTex(f)} \\\\ ${polyTex(g)} \\end{pmatrix}`;

function randMap() {
  const comps = [randPoly(), randPoly()];
  const x = randInt(-2, 2);
  const y = randInt(-2, 2);
  // J[i][j] = ∂f_i/∂x_j evaluated at (x, y).
  const J = comps.map((f) => [evalPoly(diffPoly(f, 0), x, y), evalPoly(diffPoly(f, 1), x, y)]);
  return { comps, x, y, J };
}

const par = (n: number) => (n < 0 ? `(${n})` : String(n));
const parFrac = (n: number, d: number) => (n < 0 ? `\\left(${fracTex(n, d)}\\right)` : fracTex(n, d));
const jTex = (J: number[][]) => `\\begin{pmatrix} ${J[0][0]} & ${J[0][1]} \\\\ ${J[1][0]} & ${J[1][1]} \\end{pmatrix}`;

// One entry of the Jacobian of a polynomial map from R² to R², at an integer point.
function jacEntry(): Exercise {
  const { comps, x, y, J } = randMap();
  const i = randInt(1, 2);
  const j = randInt(1, 2);
  const v = j === 1 ? "x" : "y";
  const d = diffPoly(comps[i - 1], (j - 1) as 0 | 1);
  return {
    intro: "Donne le coefficient $J_{ij} = \\partial f_i / \\partial x_j$ de la jacobienne au point indiqué, avec $x_1 = x$ et $x_2 = y$.",
    promptTex: `${mapTex(comps[0], comps[1])} \\qquad (x, y) = (${x}, ${y}) \\qquad J_{${i}${j}}`,
    answerTex: String(J[i - 1][j - 1]),
    hint: `Dérive la composante $f_${i}$ par rapport à $${v}$, en gelant l'autre variable, puis évalue.`,
    solution: [
      `\\frac{\\partial f_${i}}{\\partial ${v}} = ${d.length ? polyTex(d) : "0"}`,
      `J_{${i}${j}} = ${J[i - 1][j - 1]}`,
    ],
  };
}

// First-order approximation f_i(x0 + h) ≈ f_i(x0) + J_i h, with h in tenths.
function jacLinearization(): Exercise {
  const { comps, x, y, J } = randMap();
  const h1 = randNonZero(-3, 3);
  const h2 = randNonZero(-3, 3);
  const i = randInt(1, 2);
  const f0 = evalPoly(comps[i - 1], x, y);
  const num = 10 * f0 + J[i - 1][0] * h1 + J[i - 1][1] * h2; // in tenths
  return {
    intro: "Avec l'approximation linéaire $f(x_0 + h) \\approx f(x_0) + J(x_0)\\,h$, donne une valeur approchée de la composante demandée.",
    promptTex: `${mapTex(comps[0], comps[1])} \\qquad x_0 = (${x}, ${y}) \\qquad h = (${fracTex(h1, 10)},\\ ${fracTex(h2, 10)}) \\qquad f_${i}(x_0 + h) \\approx\\ ?`,
    answerTex: fracTex(num, 10),
    hint: `Calcule $f_${i}(x_0)$ et la ligne $${i}$ de la jacobienne en $x_0$, puis ajoute le produit scalaire de cette ligne avec $h$.`,
    solution: [
      `J(x_0) = ${jTex(J)} \\qquad f_${i}(x_0) = ${f0}`,
      `${f0} + ${par(J[i - 1][0])} \\times ${parFrac(h1, 10)} + ${par(J[i - 1][1])} \\times ${parFrac(h2, 10)} = ${fracTex(num, 10)}`,
    ],
  };
}

// Element-wise activation: diagonal Jacobian.
function jacActivation(): Exercise {
  const n = 3;
  const i = randInt(1, n);
  const j = Math.random() < 0.6 ? i : pick([1, 2, 3].filter((k) => k !== i));
  const kind = randInt(0, 2);
  if (kind === 0) {
    const z = Array.from({ length: n }, () => randNonZero(-5, 5));
    const ans = i === j && z[i - 1] > 0 ? 1 : 0;
    return {
      intro: "On applique ReLU, $a_k = \\max(0, z_k)$, à chaque composante de $z$. Donne le coefficient $\\partial a_i / \\partial z_j$ de la jacobienne.",
      promptTex: `z = (${z.join(",\\ ")}) \\qquad \\frac{\\partial a_{${i}}}{\\partial z_{${j}}}`,
      answerTex: String(ans),
      hint: "La jacobienne est diagonale ; sur la diagonale, la dérivée de ReLU vaut 1 si $z_k > 0$ et 0 sinon.",
      solution: [
        i === j
          ? `z_{${i}} = ${z[i - 1]} ${z[i - 1] > 0 ? "> 0" : "< 0"} \\implies \\frac{\\partial a_{${i}}}{\\partial z_{${i}}} = ${ans}`
          : `${i} \\ne ${j} : a_{${i}} \\text{ ne dépend pas de } z_{${j}}, \\text{ donc } 0`,
      ],
    };
  }
  // Activation values given as fractions; σ' = a(1 - a) for the sigmoid, tanh' = 1 - a².
  const dens = [2, 3, 4, 5];
  const vals = Array.from({ length: n }, () => {
    const d = pick(dens);
    return [randInt(1, d - 1), d] as [number, number];
  });
  if (kind === 2) vals.forEach((v) => (v[0] = pick([-1, 1]) * v[0]));
  const [p, q] = vals[i - 1];
  const name = kind === 1 ? "la sigmoïde $\\sigma$" : "$\\tanh$";
  const aTex = `a = (${vals.map(([a, b]) => fracTex(a, b)).join(",\\ ")})`;
  const ansNum = i !== j ? 0 : kind === 1 ? p * (q - p) : q * q - p * p;
  const ansTex = i !== j ? "0" : fracTex(ansNum, q * q);
  return {
    intro: `On applique ${name} à chaque composante de $z$ ; les sorties valent $a$. Donne le coefficient $\\partial a_i / \\partial z_j$ de la jacobienne.`,
    promptTex: `${aTex} \\qquad \\frac{\\partial a_{${i}}}{\\partial z_{${j}}}`,
    answerTex: ansTex,
    hint: kind === 1 ? "Jacobienne diagonale, avec $\\sigma'(z) = \\sigma(z)\\,(1 - \\sigma(z))$." : "Jacobienne diagonale, avec $\\tanh'(z) = 1 - \\tanh^2(z)$.",
    solution: [
      i !== j
        ? `${i} \\ne ${j} : a_{${i}} \\text{ ne dépend pas de } z_{${j}}, \\text{ donc } 0`
        : kind === 1
          ? `a_{${i}}(1 - a_{${i}}) = ${fracTex(p, q)} \\times ${fracTex(q - p, q)} = ${ansTex}`
          : `1 - a_{${i}}^2 = 1 - ${fracTex(p * p, q * q)} = ${ansTex}`,
    ],
  };
}

// Softmax Jacobian: ∂y_k/∂z_j = y_k (δ_kj - y_j).
function jacSoftmax(): Exercise {
  const w = Array.from({ length: 3 }, () => randInt(1, 5));
  const W = w.reduce((s, v) => s + v, 0);
  const k = randInt(1, 3);
  const j = Math.random() < 0.5 ? k : pick([1, 2, 3].filter((v) => v !== k));
  const d = k === j ? 1 : 0;
  // y_k (δ - y_j) = w_k (δ W - w_j) / W²
  const num = w[k - 1] * (d * W - w[j - 1]);
  return {
    intro: "Le softmax sort les probabilités $y$. Donne le coefficient $\\partial y_k / \\partial z_j$ de sa jacobienne.",
    promptTex: `y = (${w.map((v) => fracTex(v, W)).join(",\\ ")}) \\qquad \\frac{\\partial y_{${k}}}{\\partial z_{${j}}}`,
    answerTex: fracTex(num, W * W),
    hint: "$\\partial y_k / \\partial z_j = y_k(\\delta_{kj} - y_j)$, avec $\\delta_{kj} = 1$ si $k = j$ et 0 sinon.",
    solution: [`y_{${k}}(${d} - y_{${j}}) = ${fracTex(w[k - 1], W)} \\times \\left(${d} - ${fracTex(w[j - 1], W)}\\right) = ${fracTex(num, W * W)}`],
  };
}

// Jacobian of a ReLU layer a = ReLU(Wx + b): entry (i, j) is W_ij if z_i > 0, else 0.
function jacLayer(): Exercise {
  const W = Array.from({ length: 2 }, () => Array.from({ length: 3 }, () => randInt(-3, 3)));
  const x = Array.from({ length: 3 }, () => randInt(-2, 2));
  const b = Array.from({ length: 2 }, () => randInt(-3, 3));
  const z = W.map((row, i) => row.reduce((s, v, k) => s + v * x[k], 0) + b[i]);
  if (z.some((v) => v === 0)) return jacLayer();
  const i = randInt(1, 2);
  const j = randInt(1, 3);
  const ans = z[i - 1] > 0 ? W[i - 1][j - 1] : 0;
  const mat = `\\begin{pmatrix} ${W[0].join(" & ")} \\\\ ${W[1].join(" & ")} \\end{pmatrix}`;
  return {
    intro: "Une couche calcule $a = \\mathrm{ReLU}(Wx + b)$. Donne le coefficient $\\partial a_i / \\partial x_j$ de sa jacobienne au point $x$.",
    promptTex: `W = ${mat} \\qquad b = (${b.join(",\\ ")}) \\qquad x = (${x.join(",\\ ")}) \\qquad \\frac{\\partial a_{${i}}}{\\partial x_{${j}}}`,
    answerTex: String(ans),
    hint: "La jacobienne vaut $\\operatorname{diag}(\\mathrm{ReLU}'(z))\\,W$ avec $z = Wx + b$ : la ligne $i$ de $W$ si $z_i > 0$, une ligne de zéros sinon.",
    solution: [
      `z = Wx + b = (${z.join(",\\ ")})`,
      z[i - 1] > 0
        ? `z_{${i}} > 0 \\implies \\frac{\\partial a_{${i}}}{\\partial x_{${j}}} = W_{${i}${j}} = ${ans}`
        : `z_{${i}} < 0 \\implies a_{${i}} = 0 \\text{ au voisinage, donc } 0`,
    ],
  };
}

// Local area factor: |det J| for a linear map, polar coordinates, or a polynomial map.
function jacDet(): Exercise {
  const kind = randInt(0, 2);
  if (kind === 0) {
    let a: number, b: number, c: number, d: number;
    do {
      [a, b, c, d] = [randInt(-3, 3), randInt(-3, 3), randInt(-3, 3), randInt(-3, 3)];
    } while (a * d - b * c === 0);
    const area = randInt(1, 5);
    const det = a * d - b * c;
    return {
      intro: "L'application linéaire $x \\mapsto Ax$ transforme une région d'aire $\\mathcal A$. Donne l'aire de l'image.",
      promptTex: `A = \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix} \\qquad \\mathcal A = ${area}`,
      answerTex: String(Math.abs(det) * area),
      hint: "La jacobienne d'une application linéaire est $A$ elle-même : les aires sont multipliées par $|\\det A|$.",
      solution: [`\\det A = ${a} \\times ${par(d)} - ${par(b)} \\times ${par(c)} = ${det} \\qquad |${det}| \\times ${area} = ${Math.abs(det) * area}`],
    };
  }
  if (kind === 1) {
    const r = randInt(1, 6);
    const dr = randInt(1, 3);
    const dt = randInt(1, 3);
    return {
      intro: "En coordonnées polaires, $f(r, \\theta) = (r\\cos\\theta, r\\sin\\theta)$. Donne l'aire approchée $|\\det J|\\,\\Delta r\\,\\Delta\\theta$ de l'image d'un petit rectangle $\\Delta r \\times \\Delta\\theta$ situé en $(r, \\theta)$.",
      promptTex: `r = ${r} \\qquad \\Delta r = ${fracTex(dr, 100)} \\qquad \\Delta\\theta = ${fracTex(dt, 100)}`,
      answerTex: fracTex(r * dr * dt, 10000),
      hint: "Pour les coordonnées polaires, $\\det J = r$.",
      solution: [`r\\,\\Delta r\\,\\Delta\\theta = ${r} \\times ${fracTex(dr, 100)} \\times ${fracTex(dt, 100)} = ${fracTex(r * dr * dt, 10000)}`],
    };
  }
  const { comps, x, y, J } = randMap();
  const det = J[0][0] * J[1][1] - J[0][1] * J[1][0];
  return {
    intro: "Donne le déterminant de la jacobienne de $f$ au point indiqué : c'est le facteur (signé) par lequel $f$ multiplie les petites aires autour de ce point.",
    promptTex: `${mapTex(comps[0], comps[1])} \\qquad (x, y) = (${x}, ${y})`,
    answerTex: String(det),
    hint: "Calcule les quatre dérivées partielles au point, puis $ad - bc$.",
    solution: [`J = ${jTex(J)} \\qquad \\det J = ${J[0][0]} \\times ${par(J[1][1])} - ${par(J[0][1])} \\times ${par(J[1][0])} = ${det}`],
  };
}

export const jacobienneGenerators: ExerciseGenerator[] = [
  { id: "jac-coefficient", make: jacEntry },
  { id: "jac-linearisation", make: jacLinearization },
  { id: "jac-activation", make: jacActivation },
  { id: "jac-softmax", make: jacSoftmax },
  { id: "jac-couche", make: jacLayer },
  { id: "jac-det", make: jacDet },
];
