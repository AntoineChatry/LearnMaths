import { fracTex, pick, randInt, randNonZero } from "../../lib/random";
import type { Exercise, ExerciseGenerator } from "../types";
import { matTex } from "../matrices/exercises";

const p = (n: number) => (n < 0 ? `(${n})` : String(n));
const sgn = (n: number) => (n < 0 ? "-" : "+");

// Matrix with symbolic entries such as "t".
const symMatTex = (A: (number | string)[][]) => `\\begin{pmatrix} ${A.map((r) => r.join(" & ")).join(" \\\\ ")} \\end{pmatrix}`;

// Sum of integer multiples of monomials, zero terms dropped: [[2, "x"], [-1, "y"], [3, ""]] → "2x - y + 3".
function sumTex(terms: [number, string][]): string {
  let out = "";
  for (const [k, v] of terms) {
    if (k === 0) continue;
    const abs = Math.abs(k) === 1 && v ? "" : String(Math.abs(k));
    out += out ? ` ${sgn(k)} ${abs}${v}` : `${k < 0 ? "-" : ""}${abs}${v}`;
  }
  return out || "0";
}

// a x² + b2 xy + c y².
const quadTex = (a: number, b2: number, c: number) =>
  sumTex([
    [a, "x^2"],
    [b2, "xy"],
    [c, "y^2"],
  ]);

// Symmetric integer 2×2 matrix with integer eigenvalues l1 > l2, built from a Pythagorean direction.
function symWithEigen(): { A: number[][]; l1: number; l2: number } {
  const s = randInt(1, 2);
  const l1 = randInt(-3, 8);
  const flip = pick([1, -1]);
  if (Math.random() < 0.3) {
    // Eigenvectors (1, 1) and (1, -1): a = c, eigenvalues a ± b.
    const b = flip * s * randInt(1, 2);
    const a = l1 - Math.abs(b);
    return { A: [[a, b], [b, a]], l1, l2: a - Math.abs(b) };
  }
  // (a - c, 2b, l1 - l2) = s (3, 4, 5): a = l1 - s, c = l1 - 4s, b = ±2s (or a and c swapped).
  const swap = Math.random() < 0.5;
  const a = swap ? l1 - 4 * s : l1 - s;
  const c = swap ? l1 - s : l1 - 4 * s;
  return { A: [[a, flip * 2 * s], [flip * 2 * s, c]], l1, l2: l1 - 5 * s };
}

// xᵀAx for an integer vector, or the matrix entry of a polynomial.
function quadraticForm(): Exercise {
  const a = randInt(-4, 5);
  const b = randNonZero(-4, 4);
  const c = randInt(-4, 5);
  if (Math.random() < 0.5) {
    const x = randNonZero(-3, 3);
    const y = randNonZero(-3, 3);
    const value = a * x * x + 2 * b * x * y + c * y * y;
    return {
      intro: "Calcule $x^\\top A x$.",
      promptTex: `A = ${matTex([[a, b], [b, c]])} \\qquad x = (${x},\\ ${y})`,
      answerTex: String(value),
      hint: "$x^\\top A x = a x_1^2 + 2b\\, x_1 x_2 + c x_2^2$ pour $A = \\begin{pmatrix} a & b \\\\ b & c \\end{pmatrix}$.",
      solution: [`x^\\top A x = ${a} \\times ${p(x)}^2 + 2 \\times ${p(b)} \\times ${p(x)} \\times ${p(y)} + ${p(c)} \\times ${p(y)}^2 = ${value}`],
    };
  }
  const b2 = randNonZero(-9, 9);
  const aa = a === 0 ? 1 : a;
  return {
    intro: "Cette forme quadratique s'écrit $x^\\top A x$ avec $A$ symétrique. Donne le coefficient $a_{12}$ de $A$.",
    promptTex: `q(x, y) = ${quadTex(aa, b2, c)}`,
    answerTex: fracTex(b2, 2),
    hint: "Le terme croisé $2b\\,xy$ se partage en deux moitiés : $a_{12} = a_{21} = b$.",
    solution: [`2\\,a_{12} = ${b2} \\quad\\Longrightarrow\\quad a_{12} = ${fracTex(b2, 2)}`, `A = ${symMatTex([[aa, fracTex(b2, 2)], [fracTex(b2, 2), c]])}`],
  };
}

// A = λ1 q1 q1ᵀ + λ2 q2 q2ᵀ with q1 = (p, q)/h, q2 = (-q, p)/h.
function spectralSum(): Exercise {
  const [pp, qq, h] = pick([
    [3, 4, 5],
    [4, 3, 5],
    [5, 12, 13],
    [12, 5, 13],
    [8, 15, 17],
  ]);
  const s = pick([1, -1]);
  const [u1, u2] = [pp, s * qq];
  const l1 = randNonZero(-5, 5);
  let l2: number;
  do l2 = randInt(-5, 5);
  while (l2 === l1);
  const h2 = h * h;
  const entries = [
    ["a_{11}", l1 * u1 * u1 + l2 * u2 * u2, `${l1} \\times ${u1 * u1} + ${p(l2)} \\times ${u2 * u2}`],
    ["a_{12}", l1 * u1 * u2 - l2 * u1 * u2, `${l1} \\times ${p(u1 * u2)} + ${p(l2)} \\times ${p(-u1 * u2)}`],
    ["a_{22}", l1 * u2 * u2 + l2 * u1 * u1, `${l1} \\times ${u2 * u2} + ${p(l2)} \\times ${u1 * u1}`],
  ] as const;
  const [name, num, detail] = pick([...entries]);
  return {
    intro: `$A$ est symétrique, de valeurs propres $${l1}$ et $${l2}$, de vecteurs propres unitaires $q_1$ et $q_2$. Donne $${name}$.`,
    promptTex: `q_1 = \\tfrac{1}{${h}}(${u1},\\ ${u2}) \\qquad q_2 = \\tfrac{1}{${h}}(${-u2},\\ ${u1})`,
    answerTex: fracTex(num, h2),
    hint: "$A = \\lambda_1 q_1 q_1^\\top + \\lambda_2 q_2 q_2^\\top$, et le coefficient $(i, j)$ de $q q^\\top$ est $q_i q_j$.",
    solution: [
      `A = ${l1}\\, q_1 q_1^\\top ${sgn(l2)} ${Math.abs(l2)}\\, q_2 q_2^\\top`,
      `${name} = \\frac{${detail}}{${h2}} = ${fracTex(num, h2)}`,
    ],
  };
}

// Extremes of xᵀAx on the unit circle.
function rayleigh(): Exercise {
  const { A, l1, l2 } = symWithEigen();
  const max = Math.random() < 0.5;
  const tr = A[0][0] + A[1][1];
  const det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
  return {
    intro: `Donne la valeur ${max ? "maximale" : "minimale"} de $x^\\top A x$ sur les vecteurs unitaires ($\\|x\\| = 1$).`,
    promptTex: `A = ${matTex(A)}`,
    answerTex: String(max ? l1 : l2),
    hint: "Pour $\\|x\\| = 1$, $x^\\top A x$ est comprise entre la plus petite et la plus grande valeur propre, atteintes sur les vecteurs propres.",
    solution: [
      `\\text{tr}(A) = ${tr}, \\quad \\det(A) = ${det} \\quad\\Longrightarrow\\quad \\lambda \\in \\{${l2},\\ ${l1}\\}`,
      `${max ? "\\max" : "\\min"}_{\\|x\\| = 1} x^\\top A x = \\lambda_{${max ? "\\max" : "\\min"}} = ${max ? l1 : l2}`,
    ],
  };
}

// Threshold on a parameter for positive definiteness (a > 0 and ac - b² > 0).
function definiteThreshold(): Exercise {
  if (Math.random() < 0.5) {
    const b = randNonZero(-6, 6);
    const c = randInt(1, 6);
    return {
      intro: "$A$ est définie positive exactement quand $t$ dépasse un seuil. Donne ce seuil.",
      promptTex: `A = ${symMatTex([["t", b], [b, c]])}`,
      answerTex: fracTex(b * b, c),
      hint: "Test en $2 \\times 2$ : $a_{11} > 0$ et $\\det(A) > 0$.",
      solution: [`\\det(A) = ${c}\\,t - ${b * b} > 0 \\quad\\Longleftrightarrow\\quad t > ${fracTex(b * b, c)}`, `\\text{et alors } t > 0 \\text{ aussi}`],
    };
  }
  const [a, c] = pick([
    [1, 4],
    [4, 1],
    [1, 9],
    [9, 1],
    [2, 8],
    [8, 2],
    [4, 9],
    [9, 4],
    [3, 12],
    [1, 16],
    [4, 4],
    [9, 9],
  ]);
  const r = Math.sqrt(a * c);
  return {
    intro: "$A$ est définie positive exactement quand $|t|$ reste sous un seuil. Donne ce seuil.",
    promptTex: `A = ${symMatTex([[a, "t"], ["t", c]])}`,
    answerTex: String(r),
    hint: "Test en $2 \\times 2$ : $a_{11} > 0$ et $\\det(A) > 0$.",
    solution: [`${a} > 0 \\text{ et } \\det(A) = ${a * c} - t^2 > 0 \\quad\\Longleftrightarrow\\quad |t| < ${r}`],
  };
}

// Critical points: a quadratic with an integer critical point, or the cubic x³ - 3p²x + c y².
function hessianCritical(): Exercise {
  if (Math.random() < 0.5) {
    for (;;) {
      const a = randNonZero(-3, 3);
      const b = randInt(-3, 3);
      const c = randNonZero(-3, 3);
      const H = [
        [2 * a, b],
        [b, 2 * c],
      ];
      const det = H[0][0] * H[1][1] - b * b;
      if (det === 0) continue;
      const x0 = randInt(-3, 3);
      const y0 = randInt(-3, 3);
      const d = -(H[0][0] * x0 + b * y0);
      const e = -(b * x0 + H[1][1] * y0);
      const askX = Math.random() < 0.5;
      const kind = det > 0 ? (a > 0 ? "un minimum" : "un maximum") : "un point selle";
      return {
        intro: `$f$ a un seul point critique $(x_0, y_0)$ (c'est ${kind}). Donne $${askX ? "x_0" : "y_0"}$.`,
        promptTex: `f(x, y) = ${sumTex([
          [a, "x^2"],
          [b, "xy"],
          [c, "y^2"],
          [d, "x"],
          [e, "y"],
        ])}`,
        answerTex: String(askX ? x0 : y0),
        hint: "Annule les deux dérivées partielles : c'est un système linéaire $2 \\times 2$, de matrice la hessienne.",
        solution: [
          `\\frac{\\partial f}{\\partial x} = ${sumTex([
            [2 * a, "x"],
            [b, "y"],
            [d, ""],
          ])} = 0, \\quad \\frac{\\partial f}{\\partial y} = ${sumTex([
            [b, "x"],
            [2 * c, "y"],
            [e, ""],
          ])} = 0`,
          `(x_0, y_0) = (${x0},\\ ${y0}), \\qquad H = ${matTex(H)}, \\ \\det H = ${det}`,
        ],
      };
    }
  }
  const pp = randInt(1, 3);
  const c = randNonZero(-3, 3);
  const cands = c > 0 ? ["minimum local", "point selle"] : ["maximum local", "point selle"];
  const which = pick(cands);
  // Hessian diag(6x, 2c): at (p, 0) the signs are (+, c), at (-p, 0) they are (-, c).
  const answer = which === "point selle" ? (c > 0 ? -pp : pp) : c > 0 ? pp : -pp;
  return {
    intro: `Les points critiques de $f$ sont $(${pp}, 0)$ et $(${-pp}, 0)$. Donne l'abscisse de celui qui est un ${which}.`,
    promptTex: `f(x, y) = ${sumTex([
      [1, "x^3"],
      [-3 * pp * pp, "x"],
      [c, "y^2"],
    ])}`,
    answerTex: String(answer),
    hint: "Calcule la hessienne en chaque point critique et regarde les signes de ses valeurs propres (elle est diagonale ici).",
    solution: [
      `H(x, y) = ${symMatTex([
        ["6x", 0],
        [0, 2 * c],
      ])}`,
      `H(${pp}, 0) = \\text{diag}(${6 * pp},\\ ${2 * c}), \\qquad H(${-pp}, 0) = \\text{diag}(${-6 * pp},\\ ${2 * c})`,
      `\\text{${which} en } x = ${answer}`,
    ],
  };
}

// Cholesky factor of A = L Lᵀ.
function cholesky(): Exercise {
  const l11 = randInt(1, 4);
  const l21 = randNonZero(-4, 4);
  const l22 = randInt(1, 4);
  const A = [
    [l11 * l11, l11 * l21],
    [l11 * l21, l21 * l21 + l22 * l22],
  ];
  const [name, value] = pick([
    ["l_{21}", l21],
    ["l_{22}", l22],
  ] as const);
  return {
    intro: `Écris $A = LL^\\top$ avec $L = \\begin{pmatrix} l_{11} & 0 \\\\ l_{21} & l_{22} \\end{pmatrix}$ et $l_{11}, l_{22} > 0$ (Cholesky). Donne $${name}$.`,
    promptTex: `A = ${matTex(A)}`,
    answerTex: String(value),
    hint: "$LL^\\top = \\begin{pmatrix} l_{11}^2 & l_{11} l_{21} \\\\ l_{11} l_{21} & l_{21}^2 + l_{22}^2 \\end{pmatrix}$ : identifie dans l'ordre $l_{11}$, $l_{21}$, $l_{22}$.",
    solution: [
      `l_{11} = \\sqrt{${A[0][0]}} = ${l11}, \\quad l_{21} = \\frac{${A[0][1]}}{${l11}} = ${l21}`,
      `l_{22} = \\sqrt{${A[1][1]} - ${p(l21)}^2} = \\sqrt{${l22 * l22}} = ${l22}`,
    ],
  };
}

export const symetriquesGenerators: ExerciseGenerator[] = [
  { id: "forme-quadratique", make: quadraticForm },
  { id: "somme-spectrale", make: spectralSum },
  { id: "extremes-rayleigh", make: rayleigh },
  { id: "seuil-definie", make: definiteThreshold },
  { id: "hessienne-point-critique", make: hessianCritical },
  { id: "cholesky-2x2", make: cholesky },
];
