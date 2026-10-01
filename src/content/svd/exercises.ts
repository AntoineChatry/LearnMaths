import { fracTex, pick, randInt } from "../../lib/random";
import type { Exercise, ExerciseGenerator } from "../types";
import { matTex } from "../matrices/exercises";
import { sqrtTex } from "../vecteurs/exercises";

const p = (n: number) => (n < 0 ? `(${n})` : String(n));
const isSquare = (n: number) => n >= 0 && Math.round(Math.sqrt(n)) ** 2 === n;

// Singular values of an integer 2×2 matrix whose AᵀA has integer eigenvalues (redrawn until it does).
function singular2x2(): Exercise {
  for (;;) {
    const A = [
      [randInt(-4, 4), randInt(-4, 4)],
      [randInt(-4, 4), randInt(-4, 4)],
    ];
    const pp = A[0][0] ** 2 + A[1][0] ** 2;
    const q = A[0][0] * A[0][1] + A[1][0] * A[1][1];
    const r = A[0][1] ** 2 + A[1][1] ** 2;
    const det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
    // Eigenvalues of AᵀA: (tr ± √disc) / 2 with disc = tr² - 4 det(AᵀA) = (p - r)² + 4q².
    const tr = pp + r;
    const disc = (pp - r) ** 2 + 4 * q * q;
    if (det === 0 || q === 0 || !isSquare(disc) || (tr + Math.sqrt(disc)) % 2 !== 0) continue;
    const l1 = (tr + Math.sqrt(disc)) / 2;
    const l2 = (tr - Math.sqrt(disc)) / 2;
    const big = Math.random() < 0.5;
    return {
      intro: `Donne la ${big ? "plus grande" : "plus petite"} valeur singulière de $A$.`,
      promptTex: `A = ${matTex(A)}`,
      answerTex: sqrtTex(big ? l1 : l2),
      hint: "Les valeurs singulières sont les racines carrées des valeurs propres de $A^\\top A$ (trace et déterminant).",
      solution: [
        `A^\\top A = ${matTex([
          [pp, q],
          [q, r],
        ])}, \\quad \\text{tr} = ${tr}, \\ \\det = ${pp * r - q * q}`,
        `\\lambda \\in \\{${l1},\\ ${l2}\\} \\quad\\Longrightarrow\\quad \\sigma_${big ? 1 : 2} = \\sqrt{${big ? l1 : l2}} = ${sqrtTex(big ? l1 : l2)}`,
      ],
    };
  }
}

// What the singular values say: norm, condition number, |det|, rank, Eckart-Young error, κ(XᵀX).
function readSigma(): Exercise {
  const n = randInt(3, 5);
  const s = Array.from({ length: n }, () => randInt(1, 12)).sort((a, b) => b - a);
  const zeros = randInt(0, 2);
  for (let i = 0; i < zeros; i++) s[n - 1 - i] = 0;
  const rank = s.filter((x) => x > 0).length;
  const given = `\\sigma = ${s.join(",\\ ")} \\qquad (A \\in \\mathbb{R}^{${n} \\times ${n}})`;
  const kind = randInt(0, 4);
  if (kind === 0) {
    return {
      intro: "Voici toutes les valeurs singulières de $A$. Donne la norme spectrale $\\|A\\|_2$ (le plus grand étirement $\\|Ax\\| / \\|x\\|$).",
      promptTex: given,
      answerTex: String(s[0]),
      hint: "Le plus grand étirement est la plus grande valeur singulière.",
      solution: [`\\|A\\|_2 = \\sigma_1 = ${s[0]}`],
    };
  }
  if (kind === 1) {
    return {
      intro: "Voici toutes les valeurs singulières de $A$. Donne son rang.",
      promptTex: given,
      answerTex: String(rank),
      hint: "Le rang est le nombre de valeurs singulières non nulles.",
      solution: [`\\text{rg}(A) = ${rank}`],
    };
  }
  if (kind === 2) {
    const k = randInt(1, rank - 1 || 1);
    const err = s[k] ?? 0;
    return {
      intro: `Voici toutes les valeurs singulières de $A$. $A_${k}$ est la meilleure approximation de rang ${k} (SVD tronquée). Donne $\\|A - A_${k}\\|_2$.`,
      promptTex: given,
      answerTex: String(err),
      hint: "Eckart-Young : l'erreur est la première valeur singulière qu'on a laissée de côté.",
      solution: [`\\|A - A_${k}\\|_2 = \\sigma_${k + 1} = ${err}`],
    };
  }
  // Square invertible cases: |det| and condition numbers.
  const t = Array.from({ length: n }, () => randInt(1, 6)).sort((a, b) => b - a);
  const invGiven = `\\sigma = ${t.join(",\\ ")} \\qquad (A \\in \\mathbb{R}^{${n} \\times ${n}})`;
  if (kind === 3) {
    const prod = t.reduce((a, b) => a * b, 1);
    return {
      intro: "Voici toutes les valeurs singulières de la matrice carrée $A$. Donne $|\\det A|$.",
      promptTex: invGiven,
      answerTex: String(prod),
      hint: "$A = U\\Sigma V^\\top$ avec $\\det U, \\det V = \\pm 1$.",
      solution: [`|\\det A| = ${t.join(" \\times ")} = ${prod}`],
    };
  }
  const squared = Math.random() < 0.5;
  const kap = fracTex(t[0], t[n - 1]);
  return {
    intro: squared
      ? "Voici toutes les valeurs singulières de $X$. Donne le conditionnement de $X^\\top X$."
      : "Voici toutes les valeurs singulières de $A$. Donne son conditionnement $\\kappa(A)$.",
    promptTex: squared ? invGiven.replace("A \\in", "X \\in") : invGiven,
    answerTex: squared ? fracTex(t[0] ** 2, t[n - 1] ** 2) : kap,
    hint: squared
      ? "$X^\\top X = V\\Sigma^\\top\\Sigma V^\\top$ : ses valeurs singulières sont les $\\sigma_i^2$."
      : "$\\kappa = \\sigma_{\\max} / \\sigma_{\\min}$.",
    solution: squared
      ? [`\\kappa(X^\\top X) = \\kappa(X)^2 = \\left(${kap}\\right)^2 = ${fracTex(t[0] ** 2, t[n - 1] ** 2)}`]
      : [`\\kappa(A) = \\frac{${t[0]}}{${t[n - 1]}} = ${kap}`],
  };
}

// Entry of the rank-1 term σ u vᵀ with unit u, v from Pythagorean triples.
function rankOne(): Exercise {
  const triples = [
    [3, 4, 5],
    [4, 3, 5],
    [5, 12, 13],
    [12, 5, 13],
  ];
  const [a, b, h] = pick(triples);
  const [c, d, g] = pick(triples);
  const u = [a * pick([1, -1]), b * pick([1, -1])];
  const v = [c * pick([1, -1]), d * pick([1, -1])];
  const sigma = randInt(1, 6) * h * g;
  const i = randInt(0, 1);
  const j = randInt(0, 1);
  const value = (sigma * u[i] * v[j]) / (h * g);
  return {
    intro: `Donne le coefficient $(${i + 1}, ${j + 1})$ de la matrice de rang 1 $\\sigma\\, u v^\\top$.`,
    promptTex: `\\sigma = ${sigma} \\qquad u = \\tfrac{1}{${h}}(${u.join(",\\ ")}) \\qquad v = \\tfrac{1}{${g}}(${v.join(",\\ ")})`,
    answerTex: String(value),
    hint: "Le coefficient $(i, j)$ de $u v^\\top$ est $u_i v_j$.",
    solution: [`\\sigma\\, u_${i + 1} v_${j + 1} = ${sigma} \\times \\frac{${u[i]}}{${h}} \\times \\frac{${v[j]}}{${g}} = ${value}`],
  };
}

// PCA from the singular values of the centered data matrix.
function pcaVariance(): Exercise {
  const N = pick([10, 20, 25, 50, 100]);
  const s = Array.from({ length: 4 }, () => randInt(1, 10)).sort((a, b) => b - a);
  const sq = s.map((x) => x * x);
  const total = sq.reduce((a, b) => a + b, 0);
  const kind = randInt(0, 1);
  const given = `N = ${N} \\qquad \\sigma = ${s.join(",\\ ")}`;
  if (kind === 0) {
    return {
      intro: "$X$ contient $N$ points centrés (un par ligne), et voici ses valeurs singulières. Donne la variance des données le long de la première composante principale, avec la convention $\\frac1N$ de la leçon ($S = X^\\top X / N$).",
      promptTex: given,
      answerTex: fracTex(sq[0], N),
      hint: "Les variances le long des composantes principales sont les valeurs propres de $S = X^\\top X / N$, soit $\\sigma_i^2 / N$.",
      solution: [`\\lambda_1 = \\frac{\\sigma_1^2}{N} = \\frac{${sq[0]}}{${N}} = ${fracTex(sq[0], N)}`],
    };
  }
  const k = randInt(1, 2);
  const kept = sq.slice(0, k).reduce((a, b) => a + b, 0);
  return {
    intro: `$X$ contient des points centrés, et voici ses valeurs singulières. Quelle fraction de la variance totale les ${k === 1 ? "première composante principale capture" : `${k} premières composantes principales capturent`} ?`,
    promptTex: `\\sigma = ${s.join(",\\ ")}`,
    answerTex: fracTex(kept, total),
    hint: "La variance le long de la composante $i$ est proportionnelle à $\\sigma_i^2$.",
    solution: [`\\frac{${sq.slice(0, k).join(" + ")}}{${sq.join(" + ")}} = \\frac{${kept}}{${total}} = ${fracTex(kept, total)}`],
  };
}

// The unit disk is sent to an ellipse with semi-axes σ1, σ2.
function ellipse(): Exercise {
  for (;;) {
    const A = [
      [randInt(-5, 5), randInt(-5, 5)],
      [randInt(-5, 5), randInt(-5, 5)],
    ];
    const det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
    if (det === 0) continue;
    if (Math.random() < 0.5) {
      return {
        intro: "$A$ envoie le disque unité sur une ellipse pleine. Donne son aire.",
        promptTex: `A = ${matTex(A)}`,
        answerTex: `${Math.abs(det) === 1 ? "" : Math.abs(det)}\\pi`,
        hint: "Une ellipse de demi-axes $\\sigma_1, \\sigma_2$ a pour aire $\\pi \\sigma_1 \\sigma_2$, et $\\sigma_1 \\sigma_2 = |\\det A|$.",
        solution: [`\\det A = ${A[0][0]} \\times ${p(A[1][1])} - ${p(A[0][1])} \\times ${p(A[1][0])} = ${det}`, `\\text{aire} = \\pi\\, \\sigma_1 \\sigma_2 = ${Math.abs(det)}\\pi`],
      };
    }
    return {
      intro: "Sans calculer les valeurs singulières de $A$, donne leur produit $\\sigma_1 \\sigma_2$.",
      promptTex: `A = ${matTex(A)}`,
      answerTex: String(Math.abs(det)),
      hint: "$A = U\\Sigma V^\\top$ avec $\\det U, \\det V = \\pm 1$.",
      solution: [`\\sigma_1 \\sigma_2 = |\\det A| = |${A[0][0]} \\times ${p(A[1][1])} - ${p(A[0][1])} \\times ${p(A[1][0])}| = ${Math.abs(det)}`],
    };
  }
}

export const svdGenerators: ExerciseGenerator[] = [
  { id: "valeurs-singulieres-2x2", make: singular2x2 },
  { id: "lecture-sigma", make: readSigma },
  { id: "rang-un", make: rankOne },
  { id: "pca-variance", make: pcaVariance },
  { id: "ellipse-image", make: ellipse },
];
