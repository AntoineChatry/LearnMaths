import { fracTex, pick, randInt } from "../../lib/random";
import type { Exercise, ExerciseGenerator } from "../types";

// abar with sqrt(abar) and sqrt(1 - abar) both rational: [sqrt(abar), sqrt(1 - abar)] over a common denominator.
const PYTH: [number, number, number][] = [
  [3, 4, 5],
  [4, 3, 5],
  [5, 12, 13],
  [12, 5, 13],
  [8, 6, 10],
  [6, 8, 10],
];

// Forward process (Ho et al., equation 4): x_t | x_0 ~ N(sqrt(abar) x_0, 1 - abar), and abar as a product of alphas.
function avant(): Exercise {
  if (Math.random() < 0.35) {
    // abar_t = alpha_1 ... alpha_t with telescoping fractions (k - 1)/k.
    const start = randInt(5, 10);
    const t = randInt(2, 4);
    const alphas = Array.from({ length: t }, (_, i) => [start + i - 1, start + i]);
    const ans = fracTex(start - 1, start + t - 1);
    return {
      intro: "Calcule $\\bar\\alpha_t = \\alpha_1 \\cdots \\alpha_t$, la part de variance du signal qui reste après $t$ pas, avec $\\alpha_s = 1 - \\beta_s$.",
      promptTex: `${alphas.map(([n, d], i) => `\\alpha_${i + 1} = ${fracTex(n, d)}`).join(" \\qquad ")} \\qquad \\bar\\alpha_${t} = \\ ?`,
      answerTex: ans,
      hint: "Multipliez les fractions : les numérateurs et dénominateurs voisins se simplifient.",
      solution: [`\\bar\\alpha_${t} = ${alphas.map(([n, d]) => fracTex(n, d)).join(" \\times ")} = ${ans}`],
    };
  }
  const [p, q, r] = pick(PYTH);
  const abar = fracTex(p * p, r * r);
  const x0 = randInt(1, 6) * pick([1, -1]);
  const kind = randInt(0, 2);
  const intro = "D'après l'équation 4 de Ho et al., $x_t \\mid x_0 \\sim N\\big(\\sqrt{\\bar\\alpha_t}\\, x_0,\\ 1 - \\bar\\alpha_t\\big)$. Calcule la quantité demandée.";
  if (kind === 0) {
    const ans = fracTex(p * x0, r);
    return {
      intro,
      promptTex: `\\bar\\alpha_t = ${abar} \\qquad x_0 = ${x0} \\qquad \\mathbb E(x_t \\mid x_0) = \\ ?`,
      answerTex: ans,
      hint: "La moyenne est $\\sqrt{\\bar\\alpha_t}\\, x_0$.",
      solution: [`\\mathbb E(x_t \\mid x_0) = \\sqrt{${abar}} \\times (${x0}) = ${ans}`],
    };
  }
  if (kind === 1) {
    const ans = fracTex(q * q, r * r);
    return {
      intro,
      promptTex: `\\bar\\alpha_t = ${abar} \\qquad \\mathrm{Var}(x_t \\mid x_0) = \\ ?`,
      answerTex: ans,
      hint: "La variance est $1 - \\bar\\alpha_t$, quel que soit $x_0$.",
      solution: [`\\mathrm{Var}(x_t \\mid x_0) = 1 - ${abar} = ${ans}`],
    };
  }
  const ans = fracTex(q, r);
  return {
    intro,
    promptTex: `\\bar\\alpha_t = ${abar} \\qquad \\sigma(x_t \\mid x_0) = \\ ?`,
    answerTex: ans,
    hint: "L'écart-type est la racine de la variance $1 - \\bar\\alpha_t$.",
    solution: [`\\sigma = \\sqrt{1 - ${abar}} = \\sqrt{${fracTex(q * q, r * r)}} = ${ans}`],
  };
}

// Reparameterization x_t = sqrt(abar) x_0 + sqrt(1 - abar) eps, in both directions.
function bruit(): Exercise {
  const [p, q, r] = pick(PYTH);
  const abar = fracTex(p * p, r * r);
  const x0 = randInt(1, 5) * pick([1, -1]);
  const eps = randInt(1, 3) * pick([1, -1]);
  const xtNum = p * x0 + q * eps; // x_t = (p x0 + q eps) / r
  const xt = fracTex(xtNum, r);
  if (Math.random() < 0.5) {
    return {
      intro: "On bruite la donnée $x_0$ avec le bruit $\\varepsilon$ donné : $x_t = \\sqrt{\\bar\\alpha_t}\\, x_0 + \\sqrt{1 - \\bar\\alpha_t}\\, \\varepsilon$. Calcule $x_t$.",
      promptTex: `\\bar\\alpha_t = ${abar} \\qquad x_0 = ${x0} \\qquad \\varepsilon = ${eps} \\qquad x_t = \\ ?`,
      answerTex: xt,
      hint: "Calculez d'abord $\\sqrt{\\bar\\alpha_t}$ et $\\sqrt{1 - \\bar\\alpha_t}$.",
      solution: [`x_t = ${fracTex(p, r)} \\times (${x0}) + ${fracTex(q, r)} \\times (${eps}) = ${xt}`],
    };
  }
  return {
    intro: "Le réseau a prédit le bruit $\\varepsilon$ contenu dans $x_t$. Quelle donnée $x_0$ en déduit-on, en inversant $x_t = \\sqrt{\\bar\\alpha_t}\\, x_0 + \\sqrt{1 - \\bar\\alpha_t}\\, \\varepsilon$ ?",
    promptTex: `\\bar\\alpha_t = ${abar} \\qquad x_t = ${xt} \\qquad \\varepsilon = ${eps} \\qquad x_0 = \\ ?`,
    answerTex: String(x0),
    hint: "$x_0 = \\big(x_t - \\sqrt{1 - \\bar\\alpha_t}\\, \\varepsilon\\big) / \\sqrt{\\bar\\alpha_t}$.",
    solution: [`x_0 = \\frac{${xt} - ${fracTex(q, r)} \\times (${eps})}{${fracTex(p, r)}} = ${x0}`],
  };
}

// Posterior q(x_{t-1} | x_t, x_0) (Ho et al., equations 6 and 7): variance beta_tilde and the x_t coefficient.
function posterieur(): Exercise {
  const [ab1Tex, an, ad] = pick([
    ["\\frac12", 1, 2],
    ["\\frac23", 2, 3],
    ["\\frac34", 3, 4],
    ["\\frac45", 4, 5],
    ["\\frac13", 1, 3],
  ] as [string, number, number][]);
  const [bTex, bn, bd] = pick([
    ["\\frac15", 1, 5],
    ["\\frac14", 1, 4],
    ["\\frac1{10}", 1, 10],
    ["\\frac13", 1, 3],
  ] as [string, number, number][]);
  // abar_t = (1 - beta) abar_{t-1}
  const abN = (bd - bn) * an;
  const abD = bd * ad;
  const abTex = fracTex(abN, abD);
  // beta_tilde = (1 - abar_{t-1}) / (1 - abar_t) * beta
  const num = (ad - an) * abD * bn;
  const den = ad * (abD - abN) * bd;
  const ans = fracTex(num, den);
  return {
    intro: "On connaît $\\bar\\alpha_{t-1}$ et $\\beta_t$, donc $\\bar\\alpha_t = (1 - \\beta_t)\\,\\bar\\alpha_{t-1}$. Calcule la variance $\\tilde\\beta_t$ du pas inverse $q(x_{t-1} \\mid x_t, x_0)$.",
    promptTex: `\\bar\\alpha_{t-1} = ${ab1Tex} \\qquad \\beta_t = ${bTex} \\qquad \\tilde\\beta_t = \\ ?`,
    answerTex: ans,
    hint: "$\\tilde\\beta_t = \\frac{1 - \\bar\\alpha_{t-1}}{1 - \\bar\\alpha_t}\\, \\beta_t$ : elle est plus petite que $\\beta_t$.",
    solution: [
      `\\bar\\alpha_t = (1 - ${bTex}) \\times ${ab1Tex} = ${abTex}`,
      `\\tilde\\beta_t = \\frac{1 - ${ab1Tex}}{1 - ${abTex}} \\times ${bTex} = ${ans}`,
    ],
  };
}

// Score of a Gaussian, and the ideal noise predictor eps* = -sqrt(1 - abar) grad log q_t.
function score(): Exercise {
  const kind = randInt(0, 2);
  if (kind === 0) {
    const m = randInt(-3, 3);
    const v = pick([1, 2, 4, 1 / 2, 1 / 4]);
    let x = randInt(-4, 4);
    if (x === m) x = m + 1; // a zero score is a trivial answer
    const vTex = v >= 1 ? String(v) : fracTex(1, 1 / v);
    const ans = v >= 1 ? fracTex(m - x, v) : String((m - x) / v);
    return {
      intro: "Calcule le score $\\nabla_x \\log p(x) = \\frac{d}{dx} \\log p(x)$ de la loi normale $N(m, v)$ au point $x$.",
      promptTex: `m = ${m} \\qquad v = ${vTex} \\qquad x = ${x} \\qquad \\nabla_x \\log p(x) = \\ ?`,
      answerTex: ans,
      hint: "$\\log p(x) = -\\frac{(x - m)^2}{2v} + \\text{constante}$ ; dérivez en $x$.",
      solution: [`\\nabla_x \\log p(x) = -\\frac{x - m}{v} = -\\frac{${x} - (${m})}{${vTex}} = ${ans}`],
    };
  }
  const [p, q, r] = pick(PYTH);
  const abar = fracTex(p * p, r * r);
  if (kind === 1) {
    // Data N(0, 1): q_t = N(0, 1) for all t, so eps* = sqrt(1 - abar) x.
    const x = randInt(1, 6) * pick([1, -1]);
    const ans = fracTex(q * x, r);
    return {
      intro: "Les données suivent exactement $N(0, 1)$, donc la loi bruitée $q_t$ reste $N(0, 1)$ à chaque pas. Que vaut le meilleur prédicteur du bruit $\\varepsilon^\\star(x_t) = -\\sqrt{1 - \\bar\\alpha_t}\\, \\nabla \\log q_t(x_t)$ ?",
      promptTex: `\\bar\\alpha_t = ${abar} \\qquad x_t = ${x} \\qquad \\varepsilon^\\star(x_t) = \\ ?`,
      answerTex: ans,
      hint: "Pour $N(0, 1)$, le score vaut $-x$.",
      solution: [`\\nabla \\log q_t(x_t) = -x_t \\qquad \\varepsilon^\\star = \\sqrt{1 - ${abar}} \\times (${x}) = ${ans}`],
    };
  }
  // A single data point c: q_t = N(sqrt(abar) c, 1 - abar), eps* = (x - sqrt(abar) c) / sqrt(1 - abar).
  const c = randInt(1, 4) * pick([1, -1]);
  let x = randInt(-5, 5);
  // (x - p c / r) / (q / r) = (r x - p c) / q; a zero answer is moved off by one step.
  if (r * x === p * c) x += 1;
  const n = r * x - p * c;
  const ans = fracTex(n, q);
  return {
    intro: "Toutes les données valent $c$. La loi bruitée est alors $q_t = N\\big(\\sqrt{\\bar\\alpha_t}\\, c,\\ 1 - \\bar\\alpha_t\\big)$. Que vaut le meilleur prédicteur du bruit $\\varepsilon^\\star(x_t) = -\\sqrt{1 - \\bar\\alpha_t}\\, \\nabla \\log q_t(x_t)$ ?",
    promptTex: `\\bar\\alpha_t = ${abar} \\qquad c = ${c} \\qquad x_t = ${x} \\qquad \\varepsilon^\\star(x_t) = \\ ?`,
    answerTex: ans,
    hint: "Le score de $N(m, v)$ est $-(x - m)/v$ ; ici le bruit se retrouve exactement.",
    solution: [`\\varepsilon^\\star = \\frac{x_t - \\sqrt{\\bar\\alpha_t}\\, c}{\\sqrt{1 - \\bar\\alpha_t}} = \\frac{${x} - ${fracTex(p, r)} \\times (${c})}{${fracTex(q, r)}} = ${ans}`],
  };
}

export const diffusionGenerators: ExerciseGenerator[] = [
  { id: "di-avant", make: avant },
  { id: "di-bruit", make: bruit },
  { id: "di-posterieur", make: posterieur },
  { id: "di-score", make: score },
];
