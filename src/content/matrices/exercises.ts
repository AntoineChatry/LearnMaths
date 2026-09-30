import { pick, randInt } from "../../lib/random";
import type { Exercise, ExerciseGenerator } from "../types";

const paren = (n: number) => (n < 0 ? `(${n})` : String(n));
const randMat = (m: number, n: number, lo = -4, hi = 4) =>
  Array.from({ length: m }, () => Array.from({ length: n }, () => randInt(lo, hi)));
export const matTex = (A: number[][]) => `\\begin{pmatrix} ${A.map((r) => r.join(" & ")).join(" \\\\ ")} \\end{pmatrix}`;
const colTex = (v: number[]) => matTex(v.map((x) => [x]));
const rowDot = (r: number[], x: number[]) => r.reduce((s, a, i) => s + a * x[i], 0);
const dotSteps = (r: number[], x: number[]) => r.map((a, i) => `${paren(a)} \\times ${paren(x[i])}`).join(" + ");
const ORD = ["première", "deuxième", "troisième"];

// One component of Ax, read by rows.
function matVec(): Exercise {
  const m = randInt(2, 3);
  const n = randInt(2, 3);
  const A = randMat(m, n);
  const x = randMat(n, 1).map((r) => r[0]);
  const i = randInt(0, m - 1);
  const value = rowDot(A[i], x);
  return {
    intro: `Donne la ${ORD[i]} composante de $Ax$.`,
    promptTex: `A = ${matTex(A)} \\qquad x = ${colTex(x)}`,
    answerTex: String(value),
    hint: `La composante $${i + 1}$ de $Ax$ est le produit scalaire de la ligne $${i + 1}$ de $A$ avec $x$.`,
    solution: [`(Ax)_${i + 1} = ${dotSteps(A[i], x)} = ${value}`],
  };
}

// One entry of AB.
function matProduct(): Exercise {
  const m = randInt(2, 3);
  const n = randInt(2, 3);
  const p = randInt(2, 3);
  const A = randMat(m, n, -3, 3);
  const B = randMat(n, p, -3, 3);
  const i = randInt(0, m - 1);
  const j = randInt(0, p - 1);
  const col = B.map((r) => r[j]);
  const value = rowDot(A[i], col);
  return {
    intro: `Calcule le coefficient ligne $${i + 1}$, colonne $${j + 1}$ du produit $AB$.`,
    promptTex: `A = ${matTex(A)} \\qquad B = ${matTex(B)} \\qquad (AB)_{${i + 1}${j + 1}} = \\ ?`,
    answerTex: String(value),
    hint: `Ligne $${i + 1}$ de $A$, produit scalaire avec la colonne $${j + 1}$ de $B$.`,
    solution: [`(AB)_{${i + 1}${j + 1}} = ${dotSteps(A[i], col)} = ${value}`],
  };
}

// The columns are the images of e1 and e2.
function imageFromColumns(): Exercise {
  const c1 = [randInt(-4, 4), randInt(-4, 4)];
  const c2 = [randInt(-4, 4), randInt(-4, 4)];
  const x = [randInt(-4, 4), randInt(-4, 4)];
  const i = randInt(0, 1);
  const value = x[0] * c1[i] + x[1] * c2[i];
  return {
    intro: `L'application linéaire $f$ envoie $e_1 = (1, 0)$ sur $(${c1[0]}, ${c1[1]})$ et $e_2 = (0, 1)$ sur $(${c2[0]}, ${c2[1]})$. Donne la ${ORD[i]} composante de $f(${x[0]}, ${x[1]})$.`,
    promptTex: `f(${x[0]}, ${x[1]}) = \\ ?`,
    answerTex: String(value),
    hint: `$(${x[0]}, ${x[1]}) = ${x[0]}\\,e_1 + ${paren(x[1])}\\,e_2$, et $f$ respecte les combinaisons linéaires.`,
    solution: [
      `f(${x[0]}, ${x[1]}) = ${paren(x[0])}\\,f(e_1) + ${paren(x[1])}\\,f(e_2) = ${paren(x[0])} ${colTex(c1)} + ${paren(x[1])} ${colTex(c2)} = ${colTex([x[0] * c1[0] + x[1] * c2[0], x[0] * c1[1] + x[1] * c2[1]])}`,
    ],
  };
}

// One component of Aᵀx: column i of A dotted with x.
function transposeVec(): Exercise {
  const m = randInt(2, 3);
  const n = randInt(2, 3);
  const A = randMat(m, n);
  const x = randMat(m, 1).map((r) => r[0]);
  const i = randInt(0, n - 1);
  const col = A.map((r) => r[i]);
  const value = rowDot(col, x);
  return {
    intro: `Donne la ${ORD[i]} composante de $A^\\top x$.`,
    promptTex: `A = ${matTex(A)} \\qquad x = ${colTex(x)}`,
    answerTex: String(value),
    hint: `La ligne $${i + 1}$ de $A^\\top$ est la colonne $${i + 1}$ de $A$.`,
    solution: [`(A^\\top x)_${i + 1} = (\\text{colonne } ${i + 1} \\text{ de } A) \\cdot x = ${dotSteps(col, x)} = ${value}`],
  };
}

// Number of parameters of a small multilayer perceptron.
function paramCount(): Exercise {
  const sizes = [pick([2, 3, 4, 8, 10]), pick([4, 8, 16, 32]), pick([1, 2, 3, 10])];
  const two = Math.random() < 0.5;
  const layers = two ? sizes : [sizes[0], sizes[2]];
  let total = 0;
  const parts: string[] = [];
  for (let k = 0; k + 1 < layers.length; k++) {
    const p = layers[k + 1] * layers[k] + layers[k + 1];
    total += p;
    parts.push(`${layers[k + 1]} \\times ${layers[k]} + ${layers[k + 1]} = ${p}`);
  }
  return {
    intro: two
      ? `Un réseau a ${layers[0]} entrées, une couche cachée dense de ${layers[1]} neurones, puis une couche de sortie dense de ${layers[2]} neurones, avec biais. Combien de paramètres au total ?`
      : `Une couche dense a ${layers[0]} entrées et ${layers[1]} sorties, avec biais. Combien de paramètres ?`,
    promptTex: two ? `x \\in \\mathbb{R}^{${layers[0]}} \\to \\mathbb{R}^{${layers[1]}} \\to \\mathbb{R}^{${layers[2]}}` : `x \\in \\mathbb{R}^{${layers[0]}} \\to \\mathbb{R}^{${layers[1]}}`,
    answerTex: String(total),
    hint: "Chaque couche a une matrice $W$ de taille (sorties × entrées), plus un biais par sortie.",
    solution: [...parts, ...(two ? [`\\text{total} = ${total}`] : [])],
  };
}

export const matricesGenerators: ExerciseGenerator[] = [
  { id: "matrice-vecteur", make: matVec },
  { id: "image-colonnes", make: imageFromColumns },
  { id: "produit-coef", make: matProduct },
  { id: "transposee-vecteur", make: transposeVec },
  { id: "parametres", make: paramCount },
];
