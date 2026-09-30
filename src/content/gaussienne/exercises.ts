import { fracTex, pick, randInt, randNonZero } from "../../lib/random";
import type { Exercise, ExerciseGenerator } from "../types";

const neg = (v: number) => (v < 0 ? `(${v})` : String(v));

// Standardization Z = (X - mu) / sigma, its inverse, and the symmetry of the bell curve.
function standardization(): Exercise {
  const mu = randInt(-10, 20);
  const sigma = randInt(1, 6);
  const given = `X \\sim \\mathcal N(${mu}, ${sigma * sigma})`;
  const kind = randInt(0, 2);
  if (kind === 0) {
    const x = mu + randInt(-3 * sigma, 3 * sigma);
    return {
      intro: "Donne la valeur centrée réduite $z = (x - \\mu)/\\sigma$ correspondant à $x$. Attention, le second paramètre est la variance.",
      promptTex: `${given} \\qquad x = ${x}`,
      answerTex: fracTex(x - mu, sigma),
      hint: "$\\sigma$ est la racine de la variance.",
      solution: [`\\sigma = ${sigma} \\qquad z = \\frac{${x} - ${neg(mu)}}{${sigma}} = ${fracTex(x - mu, sigma)}`],
    };
  }
  if (kind === 1) {
    const [p, q] = pick([[1, 2], [3, 2], [-1, 2], [-3, 2], [1, 1], [2, 1], [-1, 1], [-2, 1], [5, 2]] as [number, number][]);
    return {
      intro: "Quelle valeur $x$ se trouve à $z$ écarts types de la moyenne ?",
      promptTex: `${given} \\qquad z = ${fracTex(p, q)}`,
      answerTex: fracTex(mu * q + p * sigma, q),
      hint: "$x = \\mu + z\\sigma$, avec $\\sigma$ la racine de la variance.",
      solution: [`x = ${mu} + ${fracTex(p, q)} \\times ${sigma} = ${fracTex(mu * q + p * sigma, q)}`],
    };
  }
  const a = randInt(1, 3) * sigma;
  const [pn, pd] = pick([[3, 4], [4, 5], [7, 8], [9, 10], [5, 6], [2, 3]] as [number, number][]);
  return {
    intro: "On connaît une probabilité à droite de la moyenne. Par symétrie de la gaussienne, donne celle demandée.",
    promptTex: `${given} \\qquad P(X \\le ${mu + a}) = ${fracTex(pn, pd)} \\qquad P(X \\le ${mu - a}) = \\ ?`,
    answerTex: fracTex(pd - pn, pd),
    hint: "La densité est symétrique autour de $\\mu$ : $P(X \\le \\mu - a) = P(X \\ge \\mu + a) = 1 - P(X \\le \\mu + a)$.",
    solution: [`P(X \\le ${mu - a}) = 1 - ${fracTex(pn, pd)} = ${fracTex(pd - pn, pd)}`],
  };
}

// Linear combination of independent Gaussians: mean and variance.
function gaussianSum(): Exercise {
  const m1 = randInt(-5, 5);
  const v1 = randInt(1, 9);
  const m2 = randInt(-5, 5);
  const v2 = randInt(1, 9);
  const a = randNonZero(-3, 3);
  const b = randNonZero(-3, 3);
  const c = randInt(-5, 5);
  const zTex = `${a === 1 ? "" : a === -1 ? "-" : a}X ${b > 0 ? "+" : "-"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}Y${c === 0 ? "" : c > 0 ? ` + ${c}` : ` - ${-c}`}`;
  const given = `X \\sim \\mathcal N(${m1}, ${v1}) \\qquad Y \\sim \\mathcal N(${m2}, ${v2}) \\qquad Z = ${zTex}`;
  const mean = Math.random() < 0.5;
  const intro = `$X$ et $Y$ sont indépendantes, donc $Z$ est gaussienne. Donne ${mean ? "sa moyenne" : "sa variance"}.`;
  if (mean)
    return {
      intro,
      promptTex: given,
      answerTex: String(a * m1 + b * m2 + c),
      hint: "Moyenne de $aX + bY + c$ : $a\\mu_X + b\\mu_Y + c$.",
      solution: [`${a} \\times ${neg(m1)} + ${neg(b)} \\times ${neg(m2)} + ${neg(c)} = ${a * m1 + b * m2 + c}`],
    };
  return {
    intro,
    promptTex: given,
    answerTex: String(a * a * v1 + b * b * v2),
    hint: "Variance de $aX + bY + c$ pour des variables indépendantes : $a^2\\sigma_X^2 + b^2\\sigma_Y^2$.",
    solution: [`${a * a} \\times ${v1} + ${b * b} \\times ${v2} = ${a * a * v1 + b * b * v2}`],
  };
}

// Mahalanobis distance (x - mu)^T Σ^{-1} (x - mu), and the density ratio p(x) / p(mu).
function mahalanobis(): Exercise {
  const kind = randInt(0, 2);
  if (kind === 2) {
    const k = randInt(1, 3);
    const ans = k === 1 ? "e^{-\\frac{1}{2}}" : k === 2 ? "e^{-2}" : "e^{-\\frac{9}{2}}";
    return {
      intro: "$X$ suit une loi normale d'écart type $\\sigma$. Combien de fois la densité en $\\mu + k\\sigma$ est-elle plus petite qu'au sommet ? Donne le rapport $p(\\mu + k\\sigma) / p(\\mu)$.",
      promptTex: `k = ${k}`,
      answerTex: ans,
      hint: "Le facteur devant l'exponentielle se simplifie : il reste $\\exp(-(x - \\mu)^2 / 2\\sigma^2)$.",
      solution: [`\\exp\\left(-\\frac{(${k}\\sigma)^2}{2\\sigma^2}\\right) = ${ans}`],
    };
  }
  const mu = [randInt(-2, 2), randInt(-2, 2)];
  const x = [mu[0] + randInt(-3, 3), mu[1] + randInt(-3, 3)];
  const d = [x[0] - mu[0], x[1] - mu[1]];
  let s11: number, s12: number, s22: number;
  if (kind === 0) {
    s11 = pick([1, 2, 4, 9]);
    s22 = pick([1, 2, 4, 9]);
    s12 = 0;
  } else {
    s11 = randInt(2, 6);
    s22 = randInt(2, 6);
    s12 = randNonZero(-1, 1);
  }
  const det = s11 * s22 - s12 * s12;
  // Σ^{-1} = (1/det) [[s22, -s12], [-s12, s11]]
  const num = s22 * d[0] * d[0] - 2 * s12 * d[0] * d[1] + s11 * d[1] * d[1];
  return {
    intro: "Donne le carré de la distance de Mahalanobis $(x - \\mu)^\\top \\Sigma^{-1} (x - \\mu)$, la quantité qui apparaît dans l'exponentielle de la densité gaussienne.",
    promptTex: `\\mu = (${mu[0]}, ${mu[1]}) \\qquad \\Sigma = \\begin{pmatrix} ${s11} & ${s12} \\\\ ${s12} & ${s22} \\end{pmatrix} \\qquad x = (${x[0]}, ${x[1]})`,
    answerTex: fracTex(num, det),
    hint: kind === 0 ? "Avec $\\Sigma$ diagonale, c'est $\\sum_i (x_i - \\mu_i)^2 / \\sigma_i^2$." : "Pour une matrice $2 \\times 2$, $\\Sigma^{-1} = \\frac{1}{ad - b^2}\\begin{pmatrix} d & -b \\\\ -b & a \\end{pmatrix}$.",
    solution: [`x - \\mu = (${d[0]}, ${d[1]}) \\qquad \\det \\Sigma = ${det}`, `\\frac{${s22} \\times ${neg(d[0])}^2 - 2 \\times ${neg(s12)} \\times ${neg(d[0])} \\times ${neg(d[1])} + ${s11} \\times ${neg(d[1])}^2}{${det}} = ${fracTex(num, det)}`],
  };
}

// Cholesky factor and sampling x = mu + L z.
function cholesky(): Exercise {
  const l11 = randInt(1, 3);
  const l21 = randInt(-3, 3);
  const l22 = randInt(1, 3);
  const S = [
    [l11 * l11, l11 * l21],
    [l11 * l21, l21 * l21 + l22 * l22],
  ];
  const sigmaTex = `\\Sigma = \\begin{pmatrix} ${S[0][0]} & ${S[0][1]} \\\\ ${S[1][0]} & ${S[1][1]} \\end{pmatrix}`;
  const LTex = `L = \\begin{pmatrix} ${l11} & 0 \\\\ ${l21} & ${l22} \\end{pmatrix}`;
  const kind = randInt(0, 2);
  if (kind === 0) {
    const which = pick(["l_{21}", "l_{22}"]);
    return {
      intro: "Donne le coefficient demandé du facteur de Cholesky $L$ de $\\Sigma$ : $L$ est triangulaire inférieure, à diagonale positive, et $LL^\\top = \\Sigma$.",
      promptTex: `${sigmaTex} \\qquad ${which}`,
      answerTex: String(which === "l_{21}" ? l21 : l22),
      hint: "$LL^\\top = \\begin{pmatrix} l_{11}^2 & l_{11}l_{21} \\\\ l_{11}l_{21} & l_{21}^2 + l_{22}^2 \\end{pmatrix}$ : trouve $l_{11}$, puis $l_{21}$, puis $l_{22}$.",
      solution: [`l_{11} = \\sqrt{${S[0][0]}} = ${l11} \\qquad l_{21} = ${S[1][0]} / ${l11} = ${l21} \\qquad l_{22} = \\sqrt{${S[1][1]} - ${l21 * l21}} = ${l22}`],
    };
  }
  if (kind === 1) {
    const i = randInt(0, 1);
    const j = randInt(0, 1);
    return {
      intro: `On tire $x = \\mu + Lz$ avec $z \\sim \\mathcal N(0, I)$. Donne le coefficient $(${i + 1}, ${j + 1})$ de la matrice de covariance de $x$.`,
      promptTex: LTex,
      answerTex: String(S[i][j]),
      hint: "$V(\\mu + Lz) = L\\,V(z)\\,L^\\top = LL^\\top$.",
      solution: [`(LL^\\top)_{${i + 1}${j + 1}} = ${S[i][j]}`],
    };
  }
  const mu = [randInt(-3, 3), randInt(-3, 3)];
  const z = [randInt(-2, 2), randInt(-2, 2)];
  const x2 = mu[1] + l21 * z[0] + l22 * z[1];
  return {
    intro: "On tire $x = \\mu + Lz$ à partir d'un tirage $z$ de $\\mathcal N(0, I)$. Donne la seconde coordonnée $x_2$.",
    promptTex: `\\mu = (${mu[0]}, ${mu[1]}) \\qquad ${LTex} \\qquad z = (${z[0]}, ${z[1]})`,
    answerTex: String(x2),
    hint: "$x_2 = \\mu_2 + l_{21} z_1 + l_{22} z_2$.",
    solution: [`x_2 = ${mu[1]} + ${neg(l21)} \\times ${neg(z[0])} + ${l22} \\times ${neg(z[1])} = ${x2}`],
  };
}

// Conditional distribution of x1 given x2 for a bivariate Gaussian.
function conditional(): Exercise {
  const s22 = randInt(1, 5);
  const s11 = randInt(1, 6);
  const cmax = Math.ceil(Math.sqrt(s11 * s22)) - 1;
  const s12 = cmax >= 1 ? randNonZero(-cmax, cmax) : 0;
  const mu = [randInt(-3, 3), randInt(-3, 3)];
  const x2 = mu[1] + randNonZero(-3, 3);
  const given = `\\mu = (${mu[0]}, ${mu[1]}) \\qquad \\Sigma = \\begin{pmatrix} ${s11} & ${s12} \\\\ ${s12} & ${s22} \\end{pmatrix} \\qquad x_2 = ${x2}`;
  if (Math.random() < 0.5) {
    const num = mu[0] * s22 + s12 * (x2 - mu[1]);
    return {
      intro: "$(x_1, x_2)$ est gaussien. On observe $x_2$. Donne la moyenne conditionnelle $E(x_1 \\mid x_2)$.",
      promptTex: given,
      answerTex: fracTex(num, s22),
      hint: "$E(x_1 \\mid x_2) = \\mu_1 + \\frac{\\Sigma_{12}}{\\Sigma_{22}}(x_2 - \\mu_2)$.",
      solution: [`${mu[0]} + \\frac{${s12}}{${s22}} \\times (${x2} - ${neg(mu[1])}) = ${fracTex(num, s22)}`],
    };
  }
  return {
    intro: "$(x_1, x_2)$ est gaussien. On observe $x_2$. Donne la variance conditionnelle $V(x_1 \\mid x_2)$.",
    promptTex: given,
    answerTex: fracTex(s11 * s22 - s12 * s12, s22),
    hint: "$V(x_1 \\mid x_2) = \\Sigma_{11} - \\Sigma_{12}^2 / \\Sigma_{22}$ : elle ne dépend pas de la valeur observée.",
    solution: [`${s11} - \\frac{${neg(s12)}^2}{${s22}} = ${fracTex(s11 * s22 - s12 * s12, s22)}`],
  };
}

// sqrt(abar) = a/c and sqrt(1 - abar) = b/c for Pythagorean triples.
const TRIPLES: [number, number, number][] = [[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [8, 15, 17], [15, 8, 17]];

// Diffusion forward process: closed-form noising, preserved variance, product of the alphas.
function diffusion(): Exercise {
  const kind = randInt(0, 2);
  if (kind === 0) {
    const [a, b, c] = pick(TRIPLES);
    const x0 = randInt(-3, 3);
    const e = randNonZero(-2, 2);
    return {
      intro: "Processus de diffusion : $x_t = \\sqrt{\\bar\\alpha_t}\\, x_0 + \\sqrt{1 - \\bar\\alpha_t}\\, \\epsilon$. Donne $x_t$ pour ces valeurs.",
      promptTex: `\\bar\\alpha_t = ${fracTex(a * a, c * c)} \\qquad x_0 = ${x0} \\qquad \\epsilon = ${e}`,
      answerTex: fracTex(a * x0 + b * e, c),
      hint: "Calcule $\\sqrt{\\bar\\alpha_t}$ et $\\sqrt{1 - \\bar\\alpha_t}$ : ce sont des fractions simples ici.",
      solution: [`\\sqrt{\\bar\\alpha_t} = ${fracTex(a, c)} \\qquad \\sqrt{1 - \\bar\\alpha_t} = ${fracTex(b, c)}`, `x_t = ${fracTex(a, c)} \\times ${neg(x0)} + ${fracTex(b, c)} \\times ${neg(e)} = ${fracTex(a * x0 + b * e, c)}`],
    };
  }
  if (kind === 1) {
    const [a, , c] = pick(TRIPLES);
    const [vn, vd] = pick([[1, 3], [1, 2], [1, 4], [2, 1], [4, 1], [1, 1]] as [number, number][]);
    const A = a * a;
    const C = c * c;
    // V(x_t) = abar v + (1 - abar) = (A vn + (C - A) vd) / (C vd)
    return {
      intro: "Processus de diffusion : $x_t = \\sqrt{\\bar\\alpha_t}\\, x_0 + \\sqrt{1 - \\bar\\alpha_t}\\, \\epsilon$, avec $\\epsilon \\sim \\mathcal N(0, 1)$ indépendant de $x_0$. Donne la variance de $x_t$.",
      promptTex: `\\bar\\alpha_t = ${fracTex(A, C)} \\qquad V(x_0) = ${fracTex(vn, vd)}`,
      answerTex: fracTex(A * vn + (C - A) * vd, C * vd),
      hint: "$V(x_t) = \\bar\\alpha_t V(x_0) + (1 - \\bar\\alpha_t)$ : si $V(x_0) = 1$, elle reste 1.",
      solution: [`${fracTex(A, C)} \\times ${fracTex(vn, vd)} + ${fracTex(C - A, C)} = ${fracTex(A * vn + (C - A) * vd, C * vd)}`],
    };
  }
  const t = randInt(2, 4);
  const betas: [number, number][] = Array.from({ length: t }, () => pick([[1, 10], [1, 5], [1, 4], [1, 2], [1, 3], [2, 5]] as [number, number][]));
  let num = 1;
  let den = 1;
  for (const [p, q] of betas) {
    num *= q - p;
    den *= q;
  }
  return {
    intro: "Donne $\\bar\\alpha_t = \\prod_{s=1}^t (1 - \\beta_s)$ pour ce calendrier de bruit.",
    promptTex: betas.map(([p, q], s) => `\\beta_{${s + 1}} = ${fracTex(p, q)}`).join(" \\qquad "),
    answerTex: fracTex(num, den),
    hint: "Multiplie les $\\alpha_s = 1 - \\beta_s$.",
    solution: [`\\bar\\alpha_{${t}} = ${betas.map(([p, q]) => fracTex(q - p, q)).join(" \\times ")} = ${fracTex(num, den)}`],
  };
}

export const gaussienneGenerators: ExerciseGenerator[] = [
  { id: "standardisation", make: standardization },
  { id: "somme-gaussiennes", make: gaussianSum },
  { id: "mahalanobis", make: mahalanobis },
  { id: "cholesky-tirage", make: cholesky },
  { id: "gaussienne-conditionnelle", make: conditional },
  { id: "diffusion-bruit", make: diffusion },
];
