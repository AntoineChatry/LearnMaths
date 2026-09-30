import { fracTex, pick, randInt, randNonZero } from "../../lib/random";
import type { Exercise, ExerciseGenerator } from "../types";
import { matTex } from "../matrices/exercises";

const p = (n: number) => (n < 0 ? `(${n})` : String(n));
const det2 = (a: number, b: number, c: number, d: number) => a * d - b * c;
const vmat = (A: number[][]) => `\\begin{vmatrix} ${A.map((r) => r.join(" & ")).join(" \\\\ ")} \\end{vmatrix}`;
const ORD = ["première", "deuxième", "troisième"];

function det2x2(): Exercise {
  const [a, b, c, d] = [randInt(-6, 6), randInt(-6, 6), randInt(-6, 6), randInt(-6, 6)];
  const answer = det2(a, b, c, d);
  return {
    intro: "Calcule le déterminant.",
    promptTex: `\\det ${matTex([
      [a, b],
      [c, d],
    ])}`,
    answerTex: String(answer),
    hint: "$\\det = ad - bc$ : produit de la diagonale moins produit de l'autre diagonale.",
    solution: [`${p(a)} \\times ${p(d)} - ${p(b)} \\times ${p(c)} = ${a * d} - ${p(b * c)} = ${answer}`],
  };
}

// 3×3 by Laplace expansion along the first row.
function det3x3(): Exercise {
  const A = [0, 1, 2].map(() => [randInt(-3, 3), randInt(-3, 3), randInt(-3, 3)]);
  const minor = (j: number) => A.slice(1).map((r) => r.filter((_, k) => k !== j));
  const minors = [0, 1, 2].map((j) => {
    const M = minor(j);
    return det2(M[0][0], M[0][1], M[1][0], M[1][1]);
  });
  const answer = A[0][0] * minors[0] - A[0][1] * minors[1] + A[0][2] * minors[2];
  return {
    intro: "Calcule le déterminant (par exemple en développant selon la première ligne).",
    promptTex: `\\det ${matTex(A)}`,
    answerTex: String(answer),
    hint: "Développement selon la première ligne : $a_{11}$ fois le déterminant $2 \\times 2$ obtenu en rayant sa ligne et sa colonne, moins $a_{12}$ fois le suivant, plus $a_{13}$ fois le dernier.",
    solution: [
      `${p(A[0][0])} ${vmat(minor(0))} - ${p(A[0][1])} ${vmat(minor(1))} + ${p(A[0][2])} ${vmat(minor(2))}`,
      `= ${p(A[0][0])} \\times ${p(minors[0])} - ${p(A[0][1])} \\times ${p(minors[1])} + ${p(A[0][2])} \\times ${p(minors[2])} = ${answer}`,
    ],
  };
}

function detTriangular(): Exercise {
  const n = pick([3, 4]);
  const upper = Math.random() < 0.5;
  const A = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? randInt(-3, 3) : (upper ? j > i : j < i) ? randInt(-5, 5) : 0)),
  );
  const diag = A.map((r, i) => r[i]);
  const answer = diag.reduce((s, x) => s * x, 1);
  return {
    intro: "Calcule le déterminant.",
    promptTex: `\\det ${matTex(A)}`,
    answerTex: String(answer),
    hint: "La matrice est triangulaire : les coefficients hors de la diagonale ne comptent pas.",
    solution: [`\\text{Triangulaire : produit de la diagonale } ${diag.map(p).join(" \\times ")} = ${answer}`],
  };
}

// Rules: det(λA), det(A⁻¹), det(Aᵀ), det(AB), row swap, row addition.
function detRules(): Exercise {
  const n = pick([2, 3, 4]);
  const d = randNonZero(-5, 5);
  const kind = randInt(0, 5);
  const given = `A \\text{ est de taille } ${n} \\times ${n},\\ \\det(A) = ${d}`;
  if (kind === 0) {
    const l = pick([2, 3, -1, -2]);
    const answer = l ** n * d;
    return {
      intro: "Calcule le déterminant demandé.",
      promptTex: `${given} \\qquad \\det(${l}A) = \\ ?`,
      answerTex: String(answer),
      hint: `Multiplier $A$ par $\\lambda$, c'est multiplier chacune de ses ${n} lignes par $\\lambda$.`,
      solution: [`\\det(${l}A) = ${p(l)}^{${n}} \\times ${p(d)} = ${answer}`],
    };
  }
  if (kind === 1) {
    return {
      intro: "Calcule le déterminant demandé.",
      promptTex: `${given} \\qquad \\det(A^{-1}) = \\ ?`,
      answerTex: fracTex(1, d),
      hint: "$A A^{-1} = I$ : prends le déterminant des deux côtés.",
      solution: [`\\det(A)\\det(A^{-1}) = \\det(I) = 1 \\quad\\Longrightarrow\\quad \\det(A^{-1}) = ${fracTex(1, d)}`],
    };
  }
  if (kind === 2) {
    const e = randNonZero(-5, 5);
    return {
      intro: `$B$ est aussi de taille $${n} \\times ${n}$, avec $\\det(B) = ${e}$. Calcule le déterminant demandé.`,
      promptTex: `${given} \\qquad \\det(A^\\top B) = \\ ?`,
      answerTex: String(d * e),
      hint: "Le déterminant d'un produit est le produit des déterminants, et la transposée ne change pas le déterminant.",
      solution: [`\\det(A^\\top B) = \\det(A^\\top)\\det(B) = ${p(d)} \\times ${p(e)} = ${d * e}`],
    };
  }
  if (kind === 3) {
    return {
      intro: "Calcule le déterminant demandé.",
      promptTex: `${given} \\qquad \\det(A^3) = \\ ?`,
      answerTex: String(d ** 3),
      hint: "$A^3 = AAA$, et le déterminant d'un produit est le produit des déterminants.",
      solution: [`\\det(A^3) = \\det(A)^3 = ${p(d)}^3 = ${d ** 3}`],
    };
  }
  if (kind === 4) {
    return {
      intro: `On obtient $A'$ en échangeant la première et la ${ORD[n === 2 ? 1 : pick([1, 2])]} ligne de $A$. Calcule le déterminant demandé.`,
      promptTex: `${given} \\qquad \\det(A') = \\ ?`,
      answerTex: String(-d),
      hint: "Quel est l'effet d'un échange de lignes ?",
      solution: [`\\text{Un échange de lignes change le signe : } \\det(A') = ${-d}`],
    };
  }
  const k = randNonZero(-4, 4);
  return {
    intro: `On obtient $A'$ en ajoutant ${k} fois la première ligne de $A$ à la deuxième. Calcule le déterminant demandé.`,
    promptTex: `${given} \\qquad \\det(A') = \\ ?`,
    answerTex: String(d),
    hint: "Quel est l'effet d'un ajout d'un multiple d'une ligne à une autre ?",
    solution: [`\\text{Ajouter un multiple d'une ligne ne change pas le déterminant : } \\det(A') = ${d}`],
  };
}

// One coefficient of the inverse of a 2×2 matrix.
function inverseCoef(): Exercise {
  let a: number, b: number, c: number, d: number;
  do {
    [a, b, c, d] = [randInt(-5, 5), randInt(-5, 5), randInt(-5, 5), randInt(-5, 5)];
  } while (det2(a, b, c, d) === 0 || Math.abs(det2(a, b, c, d)) > 12);
  const D = det2(a, b, c, d);
  const adj = [
    [d, -b],
    [-c, a],
  ];
  const i = randInt(0, 1);
  const j = randInt(0, 1);
  const answerTex = fracTex(adj[i][j], D);
  return {
    intro: `Donne le coefficient de $A^{-1}$ situé ligne ${i + 1}, colonne ${j + 1}.`,
    promptTex: `A = ${matTex([
      [a, b],
      [c, d],
    ])}`,
    answerTex,
    hint: "$A^{-1} = \\frac{1}{ad - bc} \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$ : échange la diagonale, change le signe des deux autres, divise par le déterminant.",
    solution: [
      `\\det(A) = ${p(a)} \\times ${p(d)} - ${p(b)} \\times ${p(c)} = ${D}`,
      `A^{-1} = \\frac{1}{${D}} ${matTex(adj)}, \\quad \\text{coefficient } (${i + 1}, ${j + 1}) : ${answerTex}`,
    ],
  };
}

// Area of the image of a region under a 2×2 matrix.
function imageArea(): Exercise {
  let a: number, b: number, c: number, d: number;
  do {
    [a, b, c, d] = [randInt(-4, 4), randInt(-4, 4), randInt(-4, 4), randInt(-4, 4)];
  } while (det2(a, b, c, d) === 0);
  const S = randInt(2, 9);
  const D = det2(a, b, c, d);
  const answer = Math.abs(D) * S;
  return {
    intro: `Une figure du plan a une aire de ${S}. Quelle est l'aire de son image par $A$ ?`,
    promptTex: `A = ${matTex([
      [a, b],
      [c, d],
    ])}`,
    answerTex: String(answer),
    hint: "Toutes les aires sont multipliées par le même facteur. Attention au signe.",
    solution: [`\\det(A) = ${p(a)} \\times ${p(d)} - ${p(b)} \\times ${p(c)} = ${D}`, `|${D}| \\times ${S} = ${answer}`],
  };
}

export const determinantGenerators: ExerciseGenerator[] = [
  { id: "det-2x2", make: det2x2 },
  { id: "det-3x3", make: det3x3 },
  { id: "det-triangulaire", make: detTriangular },
  { id: "det-proprietes", make: detRules },
  { id: "inverse-coef", make: inverseCoef },
  { id: "aire-image", make: imageArea },
];
