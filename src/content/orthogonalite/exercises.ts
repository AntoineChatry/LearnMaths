import { fracTex, pick, randInt } from "../../lib/random";
import type { Exercise, ExerciseGenerator } from "../types";
import { matTex } from "../matrices/exercises";

const p = (n: number) => (n < 0 ? `(${n})` : String(n));
const vec = (v: number[]) => `(${v.join(",\\ ")})`;
const dot = (u: number[], v: number[]) => u.reduce((s, x, i) => s + x * v[i], 0);
const dotSteps = (u: number[], v: number[]) => u.map((x, i) => `${p(x)} \\times ${p(v[i])}`).join(" + ");
// Zero exactly when u and v are collinear (including u = 0).
const cross = (u: number[], v: number[]) => [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
const randVec =(n: number, lo: number, hi: number) => Array.from({ length: n }, () => randInt(lo, hi));
const TRIPLES: [number, number, number][] = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
];
const COMP = ["première", "deuxième", "troisième"];

// Coordinates in an orthonormal basis of the plane built from a Pythagorean triple: λᵢ = qᵢ · x.
function orthonormalCoords(): Exercise {
  const [a, b, c] = pick(TRIPLES);
  const s = pick([1, -1]);
  const q1 = [a, b];
  const q2 = [-s * b, s * a];
  const x = randVec(2, -6, 6);
  const first = Math.random() < 0.5;
  const q = first ? q1 : q2;
  const answerTex = fracTex(dot(q, x), c);
  return {
    intro: `$(q_1, q_2)$ est une base orthonormée du plan. Donne la coordonnée $${first ? "\\lambda_1" : "\\lambda_2"}$ de $x$ dans cette base.`,
    promptTex: `q_1 = \\tfrac{1}{${c}}${vec(q1)} \\qquad q_2 = \\tfrac{1}{${c}}${vec(q2)} \\qquad x = ${vec(x)}`,
    answerTex,
    hint: "Dans une base orthonormée, pas de système à résoudre : $\\lambda_i = q_i \\cdot x$.",
    solution: [`${first ? "\\lambda_1 = q_1" : "\\lambda_2 = q_2"} \\cdot x = \\frac{${dotSteps(q, x)}}{${c}} = ${answerTex}`],
  };
}

// Component of the projection of x on the line spanned by b, in R³.
function projectionLine(): Exercise {
  let b: number[];
  do b = randVec(3, -3, 3);
  while (dot(b, b) === 0);
  const x = randVec(3, -5, 5);
  const i = randInt(0, 2);
  const bx = dot(b, x);
  const bb = dot(b, b);
  const answerTex = fracTex(bx * b[i], bb);
  return {
    intro: `Donne la ${COMP[i]} composante de la projection orthogonale $p$ de $x$ sur la droite engendrée par $b$.`,
    promptTex: `b = ${vec(b)} \\qquad x = ${vec(x)}`,
    answerTex,
    hint: "$p = \\dfrac{b \\cdot x}{b \\cdot b}\\, b$ (chapitre 1, ou l'équation normale avec une seule colonne).",
    solution: [
      `b \\cdot x = ${bx}, \\quad b \\cdot b = ${bb}`,
      `p = ${fracTex(bx, bb)}\\, ${vec(b)}, \\quad p_${i + 1} = ${fracTex(bx, bb)} \\times ${p(b[i])} = ${answerTex}`,
    ],
  };
}

// Second Gram–Schmidt vector u₂ = b₂ − (b₁·b₂ / b₁·b₁) b₁ (not normalized).
function gramSchmidt(): Exercise {
  let b1: number[], b2: number[];
  do {
    b1 = randVec(3, -2, 2);
    b2 = randVec(3, -3, 3);
  } while (cross(b1, b2).every((x) => x === 0));
  const n = dot(b1, b2);
  const d = dot(b1, b1);
  const i = randInt(0, 2);
  const answerTex = fracTex(b2[i] * d - n * b1[i], d);
  return {
    intro: `Gram-Schmidt : $u_1 = b_1$, puis $u_2$ est $b_2$ moins sa projection sur $u_1$ (sans normaliser). Donne la ${COMP[i]} composante de $u_2$.`,
    promptTex: `b_1 = ${vec(b1)} \\qquad b_2 = ${vec(b2)}`,
    answerTex,
    hint: "$u_2 = b_2 - \\dfrac{u_1 \\cdot b_2}{u_1 \\cdot u_1}\\, u_1$.",
    solution: [
      `u_1 \\cdot b_2 = ${n}, \\quad u_1 \\cdot u_1 = ${d}`,
      `u_2 = ${vec(b2)} - ${n < 0 ? `\\left(${fracTex(n, d)}\\right)` : fracTex(n, d)}\\, ${vec(b1)}, \\quad \\text{composante } ${i + 1} : ${p(b2[i])} - ${n < 0 ? `\\left(${fracTex(n, d)}\\right)` : fracTex(n, d)} \\times ${p(b1[i])} = ${answerTex}`,
    ],
  };
}

// Solve Qx = b with Q orthogonal: x = Qᵀ b. Q is a signed column permutation of a fixed orthogonal matrix.
function orthogonalSystem(): Exercise {
  const three = Math.random() < 0.5;
  let base: number[][], c: number;
  if (three) {
    base = [
      [1, 2, 2],
      [2, 1, -2],
      [2, -2, 1],
    ];
    c = 3;
  } else {
    const [a, bb, cc] = pick(TRIPLES);
    base = [
      [a, -bb],
      [bb, a],
    ];
    c = cc;
  }
  const n = base.length;
  const perm = [...Array(n).keys()].sort(() => Math.random() - 0.5);
  const signs = perm.map(() => pick([1, -1]));
  const M = base.map((r) => perm.map((j, k) => signs[k] * r[j]));
  const b = randVec(n, -4, 4);
  const i = randInt(0, n - 1);
  const col = M.map((r) => r[i]);
  const answerTex = fracTex(dot(col, b), c);
  return {
    intro: `$Q$ est une matrice orthogonale. Résous $Qx = b$ et donne $x_${i + 1}$.`,
    promptTex: `Q = \\frac{1}{${c}} ${matTex(M)} \\qquad b = ${vec(b)}`,
    answerTex,
    hint: "$Q^{-1} = Q^\\top$, donc $x = Q^\\top b$ : $x_i$ est le produit scalaire de la $i$-ème colonne de $Q$ avec $b$.",
    solution: [`x_${i + 1} = \\frac{1}{${c}}\\left(${dotSteps(col, b)}\\right) = ${answerTex}`],
  };
}

// Least-squares line y = a + b t through 3 or 4 points, via the normal equations.
function leastSquares(): Exercise {
  const n = pick([3, 4]);
  const ts = [0, 1, 2, 3, 4].sort(() => Math.random() - 0.5).slice(0, n).sort((u, v) => u - v);
  const ys = ts.map(() => randInt(-3, 6));
  const St = ts.reduce((s, t) => s + t, 0);
  const Stt = ts.reduce((s, t) => s + t * t, 0);
  const Sy = ys.reduce((s, y) => s + y, 0);
  const Sty = ts.reduce((s, t, k) => s + t * ys[k], 0);
  const D = n * Stt - St * St;
  const bNum = n * Sty - St * Sy;
  const aNum = Stt * Sy - St * Sty;
  const askB = Math.random() < 0.5;
  const answerTex = askB ? fracTex(bNum, D) : fracTex(aNum, D);
  return {
    intro: `Droite des moindres carrés $y = a + b\\,t$ pour ces points. Donne $${askB ? "b" : "a"}$.`,
    promptTex: ts.map((t, k) => `(${t},\\ ${ys[k]})`).join(" \\quad "),
    answerTex,
    hint: "Équation normale $A^\\top A\\,(a, b) = A^\\top y$ avec $A$ de colonnes $1$ et $t_i$ : $n\\,a + (\\sum t_i)\\,b = \\sum y_i$ et $(\\sum t_i)\\,a + (\\sum t_i^2)\\,b = \\sum t_i y_i$.",
    solution: [
      `\\begin{cases} ${n}\\,a + ${St}\\,b = ${Sy} \\\\ ${St}\\,a + ${Stt}\\,b = ${Sty} \\end{cases}`,
      `a = ${fracTex(aNum, D)}, \\quad b = ${fracTex(bNum, D)}`,
    ],
  };
}

export const orthogonaliteGenerators: ExerciseGenerator[] = [
  { id: "coordonnees-bon", make: orthonormalCoords },
  { id: "projection-droite", make: projectionLine },
  { id: "gram-schmidt", make: gramSchmidt },
  { id: "systeme-orthogonal", make: orthogonalSystem },
  { id: "moindres-carres", make: leastSquares },
];
