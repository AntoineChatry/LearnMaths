import { fracTex, pick, randInt, randNonZero } from "../../lib/random";
import type { Exercise, ExerciseGenerator } from "../types";

const VARS = ["x", "y", "z"];

// Left-hand side of a linear equation: [2, -1, 0] → "2x - y".
function lhsTex(row: number[]): string {
  let out = "";
  row.forEach((c, j) => {
    if (c === 0) return;
    const abs = Math.abs(c);
    const term = `${abs === 1 ? "" : abs}${VARS[j]}`;
    out += out ? ` ${c < 0 ? "-" : "+"} ${term}` : `${c < 0 ? "-" : ""}${term}`;
  });
  return out || "0";
}
const systemTex = (A: number[][], b: (number | string)[]) =>
  `\\begin{cases} ${A.map((r, i) => `${lhsTex(r)} = ${b[i]}`).join(" \\\\ ")} \\end{cases}`;
const mulVec = (A: number[][], x: number[]) => A.map((r) => r.reduce((s, a, j) => s + a * x[j], 0));

const p = (n: number) => (n < 0 ? `(${n})` : String(n));

// 2×2 system built as A = LU with an integer multiplier: every step stays in integers.
function solve2(): Exercise {
  let A: number[][], l: number, p1: number, u12: number, p2: number;
  do {
    l = randInt(-3, 3);
    p1 = randNonZero(-4, 4);
    u12 = randInt(-4, 4);
    p2 = randNonZero(-4, 4);
    A = [
      [p1, u12],
      [l * p1, l * u12 + p2],
    ];
  } while (A.flat().some((a) => Math.abs(a) > 9));
  const x = [randInt(-5, 5), randInt(-5, 5)];
  const b = mulVec(A, x);
  const c2 = b[1] - l * b[0];
  const k = randInt(0, 1);
  return {
    intro: `Résous le système et donne $${VARS[k]}$.`,
    promptTex: systemTex(A, b),
    answerTex: String(x[k]),
    hint: "Élimine $x$ de la seconde équation : retranche-lui un multiple de la première. Le multiplicateur est le coefficient de $x$ en ligne 2 divisé par celui de la ligne 1.",
    solution: [
      `\\ell = \\frac{${A[1][0]}}{${p1}} = ${l} \\qquad \\text{ligne } 2 - ${p(l)} \\times \\text{ligne } 1 : \\quad ${lhsTex([0, p2])} = ${c2}`,
      `y = \\frac{${c2}}{${p2}} = ${x[1]} \\qquad ${p1}\\,x = ${b[0]} - ${p(u12)} \\times ${p(x[1])} \\;\\Rightarrow\\; x = ${x[0]}`,
    ],
  };
}

// Upper triangular 3×3 system: back substitution.
function backSubstitution(): Exercise {
  const U = [
    [randNonZero(-3, 3), randInt(-3, 3), randInt(-3, 3)],
    [0, randNonZero(-3, 3), randInt(-3, 3)],
    [0, 0, randNonZero(-3, 3)],
  ];
  const x = [randInt(-4, 4), randInt(-4, 4), randInt(-4, 4)];
  const b = mulVec(U, x);
  return {
    intro: "Le système est déjà triangulaire. Remonte-le et donne $x$.",
    promptTex: systemTex(U, b),
    answerTex: String(x[0]),
    hint: "Commence par la dernière équation, qui ne contient que $z$, puis remonte.",
    solution: [
      `z = \\frac{${b[2]}}{${U[2][2]}} = ${x[2]}`,
      `${U[1][1]}\\,y = ${b[1]} - (${U[1][2]}) \\times (${x[2]}) \\;\\Rightarrow\\; y = ${x[1]}`,
      `${U[0][0]}\\,x = ${b[0]} - (${U[0][1]}) \\times (${x[1]}) - (${U[0][2]}) \\times (${x[2]}) \\;\\Rightarrow\\; x = ${x[0]}`,
    ],
  };
}

// Second pivot of a 2×2 matrix: a22 − (a21/a11)·a12.
function secondPivot(): Exercise {
  const a11 = randNonZero(-5, 5);
  const a12 = randInt(-5, 5);
  const a21 = randNonZero(-5, 5);
  const a22 = randInt(-5, 5);
  const answerTex = fracTex(a22 * a11 - a21 * a12, a11);
  return {
    intro: "On élimine sans échanger les lignes. Quel est le second pivot ?",
    promptTex: `A = \\begin{pmatrix} ${a11} & ${a12} \\\\ ${a21} & ${a22} \\end{pmatrix}`,
    answerTex,
    hint: "Multiplicateur : $\\ell = a_{21} / a_{11}$. Le second pivot est ce qui reste en position $(2, 2)$ après avoir retranché $\\ell$ fois la ligne 1.",
    solution: [
      `\\ell = \\frac{${a21}}{${a11}}${fracTex(a21, a11) === `\\frac{${a21}}{${a11}}` ? "" : ` = ${fracTex(a21, a11)}`}`,
      `a_{22} - \\ell\\,a_{12} = ${a22} - ${fracTex(a21, a11).startsWith("-") ? `\\left(${fracTex(a21, a11)}\\right)` : fracTex(a21, a11)} \\times ${a12 < 0 ? `(${a12})` : a12} = ${answerTex}`,
    ],
  };
}

// The third equation is a combination of the first two: which right-hand side keeps solutions?
function compatibility(): Exercise {
  let r1: number[], r2: number[];
  do {
    r1 = [randNonZero(-3, 3), randInt(-3, 3), randInt(-3, 3)];
    r2 = [randInt(-3, 3), randNonZero(-3, 3), randInt(-3, 3)];
  } while (r1[0] * r2[1] - r1[1] * r2[0] === 0);
  const al = randNonZero(-2, 2);
  const be = randNonZero(-2, 2);
  const r3 = r1.map((c, j) => al * c + be * r2[j]);
  const c1 = randInt(-6, 6);
  const c2 = randInt(-6, 6);
  const c = al * c1 + be * c2;
  const A = [r1, r2, r3];
  return {
    intro: "La troisième ligne est une combinaison des deux premières. Pour quelle valeur de $c$ le système a-t-il des solutions ?",
    promptTex: systemTex(A, [c1, c2, "c"]),
    answerTex: String(c),
    hint: "Trouve $\\alpha$ et $\\beta$ tels que la ligne 3 soit $\\alpha$ (ligne 1) $+ \\beta$ (ligne 2), en regardant les coefficients de $x$ et de $y$. Le second membre doit suivre la même combinaison.",
    solution: [
      `\\text{ligne } 3 = ${al} \\times \\text{ligne } 1 + ${be < 0 ? `(${be})` : be} \\times \\text{ligne } 2`,
      `\\text{L'élimination donne } 0 = c - (${al} \\times ${c1 < 0 ? `(${c1})` : c1} + ${be < 0 ? `(${be})` : be} \\times ${c2 < 0 ? `(${c2})` : c2}) = c - ${c < 0 ? `(${c})` : c}, \\text{ donc } c = ${c}`,
    ],
  };
}

// Full 3×3 system built as A = LU with integer multipliers and pivots: elimination stays in integers.
function solve3(): Exercise {
  let L: number[][], U: number[][], A: number[][];
  do {
    L = [
      [1, 0, 0],
      [randInt(-2, 2), 1, 0],
      [randInt(-2, 2), randInt(-2, 2), 1],
    ];
    U = [
      [randNonZero(-3, 3), randInt(-3, 3), randInt(-3, 3)],
      [0, randNonZero(-3, 3), randInt(-3, 3)],
      [0, 0, randNonZero(-3, 3)],
    ];
    A = L.map((r) => [0, 1, 2].map((j) => r.reduce((s, lik, k) => s + lik * U[k][j], 0)));
  } while (A.flat().some((a) => Math.abs(a) > 9));
  const x = [randInt(-3, 3), randInt(-3, 3), randInt(-3, 3)];
  const b = mulVec(A, x);
  // Right-hand side after elimination: c = L⁻¹ b (forward substitution).
  const c = [b[0], b[1] - L[1][0] * b[0], 0];
  c[2] = b[2] - L[2][0] * b[0] - L[2][1] * c[1];
  // Row 3 after the first column only: A₃ − ℓ₃₁·A₁.
  const r3 = A[2].map((a, j) => a - L[2][0] * A[0][j]);
  const k = pick([0, 1, 2]);
  return {
    intro: `Résous le système par élimination et donne $${VARS[k]}$.`,
    promptTex: systemTex(A, b),
    answerTex: String(x[k]),
    hint: "Élimine $x$ des lignes 2 et 3 avec la ligne 1, puis $y$ de la ligne 3 avec la nouvelle ligne 2, puis remonte.",
    solution: [
      `\\ell_{21} = ${L[1][0]},\\ \\ell_{31} = ${L[2][0]} : \\quad ${systemTex([A[0], U[1], r3], [b[0], c[1], b[2] - L[2][0] * b[0]])}`,
      `\\ell_{32} = ${L[2][1]} : \\quad ${systemTex(U, c)}`,
      `z = ${x[2]},\\quad y = ${x[1]},\\quad x = ${x[0]}`,
    ],
  };
}

export const systemesGenerators: ExerciseGenerator[] = [
  { id: "systeme-2x2", make: solve2 },
  { id: "remontee", make: backSubstitution },
  { id: "second-pivot", make: secondPivot },
  { id: "compatibilite", make: compatibility },
  { id: "systeme-3x3", make: solve3 },
];
