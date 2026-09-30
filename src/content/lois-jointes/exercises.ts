import { fracTex, pick, randInt, randNonZero } from "../../lib/random";
import type { Exercise, ExerciseGenerator } from "../types";

// Random joint law on xs × ys with probabilities num / den (all positive).
function randomJoint(xs: number[], ys: number[]): { cells: number[][]; den: number; table: string } {
  const k = xs.length * ys.length;
  const den = pick(k === 4 ? [10, 12, 16, 20] : [12, 16, 18, 20, 24]);
  const cuts = new Set<number>();
  while (cuts.size < k - 1) cuts.add(randInt(1, den - 1));
  const c = [0, ...[...cuts].sort((a, b) => a - b), den];
  const flat = Array.from({ length: k }, (_, i) => c[i + 1] - c[i]);
  const cells = xs.map((_, i) => ys.map((_, j) => flat[i * ys.length + j]));
  const rows = xs.map((x, i) => `X = ${x} & ${cells[i].map((n) => fracTex(n, den)).join(" & ")}`);
  const table = `\\begin{array}{c|${"c".repeat(ys.length)}} & ${ys.map((y) => `Y = ${y}`).join(" & ")} \\\\ \\hline ${rows.join(" \\\\ ")} \\end{array}`;
  return { cells, den, table };
}

const sumOf = (a: number[]) => a.reduce((s, v) => s + v, 0);

// Marginal, conditional and event probabilities from a joint table.
function jointTable(): Exercise {
  const xs = [0, 1];
  const ys = pick([[0, 1], [0, 1, 2]]);
  const { cells, den, table } = randomJoint(xs, ys);
  const kind = randInt(0, 2);
  if (kind === 0) {
    const j = randInt(0, ys.length - 1);
    const num = cells[0][j] + cells[1][j];
    return {
      intro: "Voici la loi jointe de $X$ et $Y$. Donne la probabilité marginale demandée.",
      promptTex: `${table} \\qquad P(Y = ${ys[j]})`,
      answerTex: fracTex(num, den),
      hint: "Règle de la somme : $P(Y = y) = \\sum_x P(X = x, Y = y)$, on additionne la colonne.",
      solution: [`P(Y = ${ys[j]}) = ${fracTex(cells[0][j], den)} + ${fracTex(cells[1][j], den)} = ${fracTex(num, den)}`],
    };
  }
  if (kind === 1) {
    const i = randInt(0, 1);
    const j = randInt(0, ys.length - 1);
    const row = sumOf(cells[i]);
    return {
      intro: "Voici la loi jointe de $X$ et $Y$. Donne la probabilité conditionnelle demandée.",
      promptTex: `${table} \\qquad P(Y = ${ys[j]} \\mid X = ${xs[i]})`,
      answerTex: fracTex(cells[i][j], row),
      hint: "$P(Y = y \\mid X = x) = P(X = x, Y = y) / P(X = x)$, et $P(X = x)$ est la somme de la ligne.",
      solution: [`P(X = ${xs[i]}) = ${fracTex(row, den)}`, `P(Y = ${ys[j]} \\mid X = ${xs[i]}) = \\frac{${fracTex(cells[i][j], den)}}{${fracTex(row, den)}} = ${fracTex(cells[i][j], row)}`],
    };
  }
  let num = 0;
  const terms: string[] = [];
  xs.forEach((x, i) =>
    ys.forEach((y, j) => {
      if (x === y) {
        num += cells[i][j];
        terms.push(fracTex(cells[i][j], den));
      }
    }),
  );
  return {
    intro: "Voici la loi jointe de $X$ et $Y$. Donne $P(X = Y)$.",
    promptTex: table,
    answerTex: fracTex(num, den),
    hint: "Additionne les cases où les deux valeurs sont égales.",
    solution: [`P(X = Y) = ${terms.join(" + ")} = ${fracTex(num, den)}`],
  };
}

const PROBS: [number, number][] = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [1, 6], [5, 6]];

// Independence: the joint law is the product of the marginals.
function independence(): Exercise {
  const [a, b] = pick(PROBS);
  const [c, d] = pick(PROBS);
  const x = randInt(0, 1);
  const y = randInt(0, 1);
  const px = x === 1 ? a : b - a;
  const py = y === 1 ? c : d - c;
  return {
    intro: "$X$ et $Y$ valent 0 ou 1 et sont indépendantes. Donne la probabilité jointe demandée.",
    promptTex: `P(X = 1) = ${fracTex(a, b)} \\qquad P(Y = 1) = ${fracTex(c, d)} \\qquad P(X = ${x}, Y = ${y})`,
    answerTex: fracTex(px * py, b * d),
    hint: "Indépendance : $P(X = x, Y = y) = P(X = x)\\,P(Y = y)$. Pense au complémentaire pour la valeur 0.",
    solution: [`P(X = ${x}) \\times P(Y = ${y}) = ${fracTex(px, b)} \\times ${fracTex(py, d)} = ${fracTex(px * py, b * d)}`],
  };
}

// Covariance (or E(XY)) from a joint table.
function covarianceTable(): Exercise {
  const xs = [0, 1];
  const ys = pick([[0, 1], [0, 1, 2], [-1, 0, 1]]);
  const { cells, den, table } = randomJoint(xs, ys);
  let exy = 0;
  let ex = 0;
  let ey = 0;
  xs.forEach((x, i) =>
    ys.forEach((y, j) => {
      exy += x * y * cells[i][j];
      ex += x * cells[i][j];
      ey += y * cells[i][j];
    }),
  );
  if (Math.random() < 0.3)
    return {
      intro: "Voici la loi jointe de $X$ et $Y$. Donne $E(XY)$.",
      promptTex: table,
      answerTex: fracTex(exy, den),
      hint: "$E(XY) = \\sum_{x, y} x\\,y\\,P(X = x, Y = y)$ : seules les cases où $xy \\ne 0$ comptent.",
      solution: [`E(XY) = ${fracTex(exy, den)}`],
    };
  // Cov = exy/den - (ex/den)(ey/den) = (exy den - ex ey) / den²
  const cNum = exy * den - ex * ey;
  return {
    intro: "Voici la loi jointe de $X$ et $Y$. Donne $\\text{Cov}(X, Y)$.",
    promptTex: table,
    answerTex: fracTex(cNum, den * den),
    hint: "$\\text{Cov}(X, Y) = E(XY) - E(X)\\,E(Y)$, avec $E(X)$ et $E(Y)$ tirées des marginales.",
    solution: [
      `E(XY) = ${fracTex(exy, den)} \\qquad E(X) = ${fracTex(ex, den)} \\qquad E(Y) = ${fracTex(ey, den)}`,
      `\\text{Cov}(X, Y) = ${fracTex(exy, den)} - ${fracTex(ex, den)} \\times ${ey < 0 ? `\\left(${fracTex(ey, den)}\\right)` : fracTex(ey, den)} = ${fracTex(cNum, den * den)}`,
    ],
  };
}

// Variance of a linear combination with a covariance term, and correlation.
function varianceWithCov(): Exercise {
  const kind = randInt(0, 2);
  if (kind === 2) {
    const [vx, vy] = pick([[4, 9], [1, 4], [9, 16], [4, 25], [16, 9], [1, 9], [25, 4]] as [number, number][]);
    const s = Math.sqrt(vx * vy);
    const c = randNonZero(-s + 1, s - 1);
    return {
      intro: "Donne la corrélation de $X$ et $Y$.",
      promptTex: `V(X) = ${vx} \\qquad V(Y) = ${vy} \\qquad \\text{Cov}(X, Y) = ${c}`,
      answerTex: fracTex(c, s),
      hint: "$\\text{corr}(X, Y) = \\text{Cov}(X, Y) / \\sqrt{V(X)\\,V(Y)}$.",
      solution: [`\\frac{${c}}{\\sqrt{${vx} \\times ${vy}}} = \\frac{${c}}{${s}} = ${fracTex(c, s)}`],
    };
  }
  const vx = randInt(1, 9);
  const vy = randInt(1, 9);
  // |c| < sqrt(vx vy) keeps the covariance matrix positive definite.
  const cmax = Math.ceil(Math.sqrt(vx * vy)) - 1;
  const c = cmax >= 1 ? randInt(-cmax, cmax) : 0;
  const a = kind === 0 ? 1 : randNonZero(-3, 3);
  const b = kind === 0 ? pick([1, -1]) : randNonZero(-3, 3);
  const zTex = `${a === 1 ? "" : a === -1 ? "-" : a}X ${b > 0 ? "+" : "-"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}Y`;
  const v = a * a * vx + b * b * vy + 2 * a * b * c;
  return {
    intro: "Donne la variance de $Z$.",
    promptTex: `V(X) = ${vx} \\qquad V(Y) = ${vy} \\qquad \\text{Cov}(X, Y) = ${c} \\qquad Z = ${zTex}`,
    answerTex: String(v),
    hint: "$V(aX + bY) = a^2 V(X) + b^2 V(Y) + 2ab\\,\\text{Cov}(X, Y)$ : le terme croisé garde le signe de $ab$.",
    solution: [`V(Z) = ${a * a} \\times ${vx} + ${b * b} \\times ${vy} + 2 \\times ${a < 0 ? `(${a})` : a} \\times ${b < 0 ? `(${b})` : b} \\times ${c < 0 ? `(${c})` : c} = ${v}`],
  };
}

// Covariance matrix: variance of a projection a^T x, entry of A Σ A^T.
function covarianceMatrix(): Exercise {
  const s11 = randInt(1, 9);
  const s22 = randInt(1, 9);
  const cmax = Math.ceil(Math.sqrt(s11 * s22)) - 1;
  const s12 = cmax >= 1 ? randInt(-cmax, cmax) : 0;
  const sigma = `\\Sigma = \\begin{pmatrix} ${s11} & ${s12} \\\\ ${s12} & ${s22} \\end{pmatrix}`;
  const quad = (u: number[], v: number[]) => u[0] * (s11 * v[0] + s12 * v[1]) + u[1] * (s12 * v[0] + s22 * v[1]);
  if (Math.random() < 0.5) {
    const a = [randInt(-3, 3), randNonZero(-3, 3)];
    const r = quad(a, a);
    return {
      intro: "Le vecteur aléatoire $x \\in \\mathbb{R}^2$ a pour matrice de covariance $\\Sigma$. Donne la variance de $a^\\top x$.",
      promptTex: `${sigma} \\qquad a = (${a[0]}, ${a[1]})`,
      answerTex: String(r),
      hint: "$V(a^\\top x) = a^\\top \\Sigma a = a_1^2 \\Sigma_{11} + 2a_1a_2 \\Sigma_{12} + a_2^2 \\Sigma_{22}$.",
      solution: [`a^\\top \\Sigma a = ${a[0] * a[0]} \\times ${s11} + 2 \\times ${a[0] * a[1] < 0 ? `(${a[0] * a[1]})` : a[0] * a[1]} \\times ${s12 < 0 ? `(${s12})` : s12} + ${a[1] * a[1]} \\times ${s22} = ${r}`],
    };
  }
  const A = [
    [randInt(-2, 2), randInt(-2, 2)],
    [randInt(-2, 2), randInt(-2, 2)],
  ];
  if (A[0][0] === 0 && A[0][1] === 0) A[0][0] = 1;
  if (A[1][0] === 0 && A[1][1] === 0) A[1][1] = 1;
  const i = randInt(0, 1);
  const j = randInt(0, 1);
  const r = quad(A[i], A[j]);
  return {
    intro: `$x$ a pour matrice de covariance $\\Sigma$ et $y = Ax + b$. Donne le coefficient $(${i + 1}, ${j + 1})$ de la matrice de covariance de $y$.`,
    promptTex: `${sigma} \\qquad A = \\begin{pmatrix} ${A[0][0]} & ${A[0][1]} \\\\ ${A[1][0]} & ${A[1][1]} \\end{pmatrix} \\qquad (A \\Sigma A^\\top)_{${i + 1}${j + 1}}`,
    answerTex: String(r),
    hint: "$V(Ax + b) = A \\Sigma A^\\top$, et le coefficient $(i, j)$ vaut $a_i^\\top \\Sigma a_j$, où $a_i$ est la ligne $i$ de $A$.",
    solution: [`a_{${i + 1}}^\\top \\Sigma\\, a_{${j + 1}} = ${r}`],
  };
}

// Conditional expectation: law of total expectation, and E(Y | X = x) from a joint table.
function conditionalExpectation(): Exercise {
  if (Math.random() < 0.5) {
    const groups = randInt(2, 3);
    const den = pick([4, 5, 10]);
    const cuts = new Set<number>();
    while (cuts.size < groups - 1) cuts.add(randInt(1, den - 1));
    const c = [0, ...[...cuts].sort((a, b) => a - b), den];
    const w = Array.from({ length: groups }, (_, i) => c[i + 1] - c[i]);
    const m = Array.from({ length: groups }, () => randInt(1, 12));
    const num = sumOf(w.map((wi, i) => wi * m[i]));
    const names = ["A", "B", "C"].slice(0, groups);
    return {
      intro: "Un jeu de test mélange plusieurs sources. On connaît la proportion de chaque source et la perte moyenne du modèle sur chacune. Donne la perte moyenne sur tout le jeu.",
      promptTex: names.map((n, i) => `P(${n}) = ${fracTex(w[i], den)},\\ E(L \\mid ${n}) = ${m[i]}`).join(" \\qquad "),
      answerTex: fracTex(num, den),
      hint: "Espérance totale : $E(L) = \\sum_j E(L \\mid F_j)\\,P(F_j)$.",
      solution: [`E(L) = ${names.map((_, i) => `${m[i]} \\times ${fracTex(w[i], den)}`).join(" + ")} = ${fracTex(num, den)}`],
    };
  }
  const xs = [0, 1];
  const ys = pick([[0, 1, 2], [1, 2, 3], [-1, 0, 1]]);
  const { cells, table } = randomJoint(xs, ys);
  const i = randInt(0, 1);
  const row = sumOf(cells[i]); // the common denominator cancels out
  const num = sumOf(ys.map((y, j) => y * cells[i][j]));
  return {
    intro: "Voici la loi jointe de $X$ et $Y$. Donne l'espérance conditionnelle demandée.",
    promptTex: `${table} \\qquad E(Y \\mid X = ${xs[i]})`,
    answerTex: fracTex(num, row),
    hint: "Utilise la loi conditionnelle $P(Y = y \\mid X = x) = P(X = x, Y = y) / P(X = x)$, puis pondère les valeurs de $Y$.",
    solution: [`E(Y \\mid X = ${xs[i]}) = \\frac{${ys.map((y, j) => `${y < 0 ? `(${y})` : y} \\times ${cells[i][j]}`).join(" + ")}}{${row}} = ${fracTex(num, row)}`],
  };
}

export const loisJointesGenerators: ExerciseGenerator[] = [
  { id: "table-jointe", make: jointTable },
  { id: "independance-produit", make: independence },
  { id: "covariance-table", make: covarianceTable },
  { id: "variance-covariance", make: varianceWithCov },
  { id: "matrice-covariance", make: covarianceMatrix },
  { id: "esperance-conditionnelle", make: conditionalExpectation },
];
