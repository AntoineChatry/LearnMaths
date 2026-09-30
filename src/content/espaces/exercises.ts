import { fracTex, pick, randInt, randNonZero } from "../../lib/random";
import type { Exercise, ExerciseGenerator } from "../types";
import { matTex } from "../matrices/exercises";

const p = (n: number) => (n < 0 ? `(${n})` : String(n));
const vec = (v: number[]) => `(${v.join(",\\ ")})`;

// Rank by elimination with partial pivoting (small integer matrices: a 1e-9 tolerance is exact enough).
export function rank(M: number[][]): number {
  const A = M.map((r) => [...r]);
  const m = A.length;
  const n = A[0].length;
  let r = 0;
  for (let c = 0; c < n && r < m; c++) {
    let piv = r;
    for (let i = r + 1; i < m; i++) if (Math.abs(A[i][c]) > Math.abs(A[piv][c])) piv = i;
    if (Math.abs(A[piv][c]) < 1e-9) continue;
    [A[r], A[piv]] = [A[piv], A[r]];
    for (let i = r + 1; i < m; i++) {
      const f = A[i][c] / A[r][c];
      for (let j = c; j < n; j++) A[i][j] -= f * A[r][j];
    }
    r++;
  }
  return r;
}

// 3×3 matrix of prescribed rank: sum of r outer products of small integer vectors.
function rankOf3x3(): Exercise {
  let A: number[][], target: number;
  do {
    target = pick([1, 2, 2, 3]);
    A = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    for (let k = 0; k < target; k++) {
      const u = [randInt(-2, 2), randInt(-2, 2), randInt(-2, 2)];
      const v = [randInt(-2, 2), randInt(-2, 2), randInt(-2, 2)];
      for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) A[i][j] += u[i] * v[j];
    }
  } while (rank(A) !== target || A.flat().some((a) => Math.abs(a) > 9));
  const cols = [0, 1, 2].map((j) => A.map((r) => r[j]));
  return {
    intro: "Quel est le rang de $A$ ?",
    promptTex: `A = ${matTex(A)}`,
    answerTex: String(target),
    hint: "Élimine et compte les pivots. Ou cherche directement des colonnes (ou des lignes) qui sont combinaisons des autres.",
    solution: [
      `\\text{colonnes : } ${cols.map(vec).join(",\\ ")}`,
      target === 3
        ? "\\text{L'élimination trouve 3 pivots : les 3 colonnes sont indépendantes, } \\text{rg}(A) = 3"
        : `\\text{L'élimination trouve ${target} pivot${target > 1 ? "s" : ""} : } \\text{rg}(A) = ${target}`,
    ],
  };
}

// Rank–nullity: dimension of the kernel, or of the solution set of Ax = b.
function rankNullity(): Exercise {
  const m = randInt(2, 6);
  const n = randInt(2, 7);
  const r = randInt(1, Math.min(m, n));
  const answer = n - r;
  const kind = Math.random() < 0.5;
  return {
    intro: kind
      ? `$A$ est une matrice $${m} \\times ${n}$ de rang $${r}$. Quelle est la dimension de son noyau ?`
      : `$A$ est une matrice $${m} \\times ${n}$ de rang $${r}$, et $Ax = b$ a au moins une solution. Combien de variables libres a la solution générale (c'est la dimension de la famille de solutions) ?`,
    promptTex: `\\dim \\ker(A) = \\ ?`,
    answerTex: String(answer),
    hint: "Théorème du rang : $\\dim \\ker(A) + \\text{rg}(A) = n$, où $n$ est le nombre de colonnes (d'inconnues).",
    solution: [`\\dim \\ker(A) = n - \\text{rg}(A) = ${n} - ${r} = ${answer}`],
  };
}

// v3 = a·v1 + b·v2: recover a coefficient.
function dependenceCoef(): Exercise {
  let v1: number[], v2: number[];
  do {
    v1 = [randInt(-3, 3), randInt(-3, 3), randInt(-3, 3)];
    v2 = [randInt(-3, 3), randInt(-3, 3), randInt(-3, 3)];
  } while (rank([v1, v2]) < 2);
  const a = randNonZero(-3, 3);
  const b = randNonZero(-3, 3);
  const v3 = v1.map((x, i) => a * x + b * v2[i]);
  const askA = Math.random() < 0.5;
  return {
    intro: `Les trois vecteurs sont liés : $v_3 = \\alpha\\,v_1 + \\beta\\,v_2$. Donne $${askA ? "\\alpha" : "\\beta"}$.`,
    promptTex: `v_1 = ${vec(v1)} \\qquad v_2 = ${vec(v2)} \\qquad v_3 = ${vec(v3)}`,
    answerTex: String(askA ? a : b),
    hint: "Écris l'égalité composante par composante : trois équations, deux inconnues $\\alpha$ et $\\beta$. Deux équations suffisent, la troisième vérifie.",
    solution: [
      `\\begin{cases} ${v1.map((x, i) => `${p(x)}\\,\\alpha + ${p(v2[i])}\\,\\beta = ${v3[i]}`).join(" \\\\ ")} \\end{cases}`,
      `\\alpha = ${a},\\quad \\beta = ${b}`,
    ],
  };
}

// (a, b) and (c, k) collinear: a·k − b·c = 0.
function collinearK(): Exercise {
  const a = randNonZero(-5, 5);
  const b = randInt(-5, 5);
  const c = randNonZero(-5, 5);
  const answerTex = fracTex(b * c, a);
  return {
    intro: "Pour quelle valeur de $k$ les vecteurs $u$ et $v$ sont-ils liés ?",
    promptTex: `u = (${a},\\ ${b}) \\qquad v = (${c},\\ k)`,
    answerTex,
    hint: "Deux vecteurs du plan sont liés quand l'un est un multiple de l'autre : $v = t\\,u$. Trouve $t$ avec la première composante.",
    solution: [`v = t\\,u \\text{ avec } t = \\frac{${c}}{${a}}`, `k = t \\times ${p(b)} = ${answerTex}`],
  };
}

// Coordinates of b in the basis (u, v) of the plane.
function coordinates(): Exercise {
  let u: number[], v: number[];
  do {
    u = [randInt(-3, 3), randInt(-3, 3)];
    v = [randInt(-3, 3), randInt(-3, 3)];
  } while (u[0] * v[1] - u[1] * v[0] === 0);
  const l = randInt(-3, 3);
  const m = randInt(-3, 3);
  const b = [l * u[0] + m * v[0], l * u[1] + m * v[1]];
  const first = Math.random() < 0.5;
  return {
    intro: `$(u, v)$ est une base du plan, et $b = \\lambda u + \\mu v$. Donne $${first ? "\\lambda" : "\\mu"}$.`,
    promptTex: `u = ${vec(u)} \\qquad v = ${vec(v)} \\qquad b = ${vec(b)}`,
    answerTex: String(first ? l : m),
    hint: "C'est un système $2 \\times 2$ : une équation par composante, d'inconnues $\\lambda$ et $\\mu$.",
    solution: [
      `\\begin{cases} ${p(u[0])}\\,\\lambda + ${p(v[0])}\\,\\mu = ${b[0]} \\\\ ${p(u[1])}\\,\\lambda + ${p(v[1])}\\,\\mu = ${b[1]} \\end{cases}`,
      `\\lambda = ${l},\\quad \\mu = ${m}`,
    ],
  };
}

// Trainable parameters with LoRA versus full fine-tuning.
function loraParams(): Exercise {
  const d = pick([256, 512, 768, 1024, 4096]);
  const k = pick([256, 512, 768, 1024, 4096]);
  const r = pick([1, 2, 4, 8, 16]);
  return {
    intro: `Une matrice de poids est de taille $${d} \\times ${k}$. Combien de paramètres LoRA entraîne-t-il avec un rang $r = ${r}$ ?`,
    promptTex: `W_0 \\in \\mathbb{R}^{${d} \\times ${k}},\\ \\Delta W = BA,\\ B \\in \\mathbb{R}^{${d} \\times ${r}},\\ A \\in \\mathbb{R}^{${r} \\times ${k}}`,
    answerTex: String(r * (d + k)),
    hint: "On n'entraîne que $B$ et $A$ : compte leurs coefficients.",
    solution: [`${d} \\times ${r} + ${r} \\times ${k} = ${r * (d + k)} \\quad \\text{(au lieu de } ${d * k} \\text{)}`],
  };
}

export const espacesGenerators: ExerciseGenerator[] = [
  { id: "coef-dependance", make: dependenceCoef },
  { id: "colineaires-k", make: collinearK },
  { id: "coordonnees-base", make: coordinates },
  { id: "rang-3x3", make: rankOf3x3 },
  { id: "theoreme-rang", make: rankNullity },
  { id: "lora-parametres", make: loraParams },
];
