import { fracTex, pick, randInt } from "../../lib/random";
import type { Exercise, ExerciseGenerator } from "../types";

// Metropolis or Metropolis-Hastings acceptance probability (Bishop, equations 11.33 and 11.44).
function acceptation(): Exercise {
  const px = randInt(2, 12);
  // Uphill moves (answer 1) in a quarter of the cases only.
  const py = Math.random() < 0.25 ? randInt(px, 15) : randInt(1, px - 1);
  if (Math.random() < 0.5) {
    const ans = fracTex(Math.min(px, py), px);
    return {
      intro: "La proposition est symétrique. Les valeurs de la densité non normalisée $\\tilde p$ au point courant $x$ et au candidat $y$ sont données. Avec quelle probabilité accepte-t-on $y$ ?",
      promptTex: `\\tilde p(x) = ${px} \\qquad \\tilde p(y) = ${py} \\qquad A(x, y) = \\ ?`,
      answerTex: ans,
      hint: "Algorithme de Metropolis : $A = \\min\\big(1, \\tilde p(y) / \\tilde p(x)\\big)$.",
      solution: [`A(x, y) = \\min\\left(1,\\ \\frac{${py}}{${px}}\\right) = ${ans}`],
    };
  }
  // Proposal probabilities q(y | x) = 1/a and q(x | y) = 1/b, with a != b.
  const a = randInt(2, 5);
  const b = pick([2, 3, 4, 5].filter((v) => v !== a));
  const qYgX = fracTex(1, a);
  const qXgY = fracTex(1, b);
  // ratio = py q(x|y) / (px q(y|x)) = py a / (px b)
  const num = py * a;
  const den = px * b;
  const ans = num >= den ? "1" : fracTex(num, den);
  return {
    intro: "Metropolis-Hastings avec une proposition non symétrique : on donne $\\tilde p$ aux deux points et les probabilités de proposition dans les deux sens. Avec quelle probabilité accepte-t-on $y$ ?",
    promptTex: `\\begin{gathered} \\tilde p(x) = ${px} \\qquad \\tilde p(y) = ${py} \\qquad q(y \\mid x) = ${qYgX} \\qquad q(x \\mid y) = ${qXgY} \\\\ A(x, y) = \\ ? \\end{gathered}`,
    answerTex: ans,
    hint: "$A = \\min\\left(1, \\frac{\\tilde p(y)\\, q(x \\mid y)}{\\tilde p(x)\\, q(y \\mid x)}\\right)$ : le rapport de Hastings corrige le biais de la proposition.",
    solution: [
      `\\frac{\\tilde p(y)\\, q(x \\mid y)}{\\tilde p(x)\\, q(y \\mid x)} = \\frac{${py} \\times ${qXgY}}{${px} \\times ${qYgX}} = ${fracTex(num, den)}`,
      `A(x, y) = \\min\\left(1,\\ ${fracTex(num, den)}\\right) = ${ans}`,
    ],
  };
}

// Detailed balance: P(y, x) = pi(x) P(x, y) / pi(y).
function equilibre(): Exercise {
  let pxN = randInt(1, 6);
  let pyN = randInt(1, 6);
  if (pyN === pxN) pyN = pxN + 1;
  const den = pick([10, 12, 20]);
  const [a, b] = pick([[1, 2], [1, 3], [1, 4], [2, 3], [3, 4], [1, 5], [2, 5]] as [number, number][]);
  // P(y, x) = pxN a / (pyN b) must be a probability; swapping x and y fixes it, since then pxN < pyN and a < b.
  if (pxN * a > pyN * b) [pxN, pyN] = [pyN, pxN];
  const ans = fracTex(pxN * a, pyN * b);
  const piX = fracTex(pxN, den);
  const piY = fracTex(pyN, den);
  const pxyTex = fracTex(a, b);
  return {
    intro: "La chaîne est réversible pour la loi $\\pi$. Connaissant $\\pi(x)$, $\\pi(y)$ et $P(x, y)$, calcule $P(y, x)$.",
    promptTex: `\\pi(x) = ${piX} \\qquad \\pi(y) = ${piY} \\qquad P(x, y) = ${pxyTex} \\qquad P(y, x) = \\ ?`,
    answerTex: ans,
    hint: "Équilibre détaillé : $\\pi(x)\\,P(x, y) = \\pi(y)\\,P(y, x)$.",
    solution: [`P(y, x) = \\frac{\\pi(x)\\,P(x, y)}{\\pi(y)} = \\frac{${piX} \\times ${pxyTex}}{${piY}} = ${ans}`],
  };
}

// Metropolis chain on 3 states, proposal: one of the two other states with probability 1/2 each (Levin and Peres, 3.2.1).
function chaine(): Exercise {
  const h = [randInt(1, 6), randInt(1, 6), randInt(1, 6)];
  // Off-diagonal entries of row s, as [numerator, denominator]: (1/2) min(1, h_y / h_s).
  const offOf = (s: number) => [1, 2, 3].filter((y) => y !== s).map((y) => [Math.min(h[s - 1], h[y - 1]), 2 * h[s - 1]]);
  const stayOf = (s: number) => 2 * h[s - 1] - offOf(s).reduce((t, [n]) => t + n, 0);
  // The staying probability is 0 for a minimum of h, so that question picks among the states where it is positive.
  const canStay = [1, 2, 3].filter((s) => stayOf(s) > 0);
  const askStay = canStay.length > 0 && Math.random() < 0.5;
  const x = askStay ? pick(canStay) : randInt(1, 3);
  const others = [1, 2, 3].filter((s) => s !== x);
  const off = offOf(x);
  const hTex = `\\tilde p = (${h.join(",\\ ")})`;
  const intro =
    "Chaîne de Metropolis sur les états 1, 2, 3 : depuis $x$, on propose l'un des deux autres états avec probabilité 1/2 chacun, puis on accepte selon $\\tilde p$.";
  if (!askStay) {
    const y = pick(others);
    const [n, d] = off[others.indexOf(y)];
    const ans = fracTex(n, d);
    return {
      intro: `${intro} Calcule la probabilité de transition demandée.`,
      promptTex: `${hTex} \\qquad P(${x}, ${y}) = \\ ?`,
      answerTex: ans,
      hint: "Pour $y \\ne x$ : probabilité de proposer $y$, fois probabilité de l'accepter.",
      solution: [`P(${x}, ${y}) = \\frac12 \\min\\left(1,\\ \\frac{${h[y - 1]}}{${h[x - 1]}}\\right) = ${ans}`],
    };
  }
  // Staying put: 1 - sum of the moves, over the common denominator 2 h_x.
  const ans = fracTex(stayOf(x), 2 * h[x - 1]);
  return {
    intro: `${intro} Avec quelle probabilité la chaîne reste-t-elle sur place ?`,
    promptTex: `${hTex} \\qquad P(${x}, ${x}) = \\ ?`,
    answerTex: ans,
    hint: "Rester sur place, c'est voir sa proposition refusée : $P(x, x) = 1 - \\sum_{y \\ne x} P(x, y)$.",
    solution: [
      others.map((y, i) => `P(${x}, ${y}) = ${fracTex(off[i][0], off[i][1])}`).join(" \\qquad "),
      `P(${x}, ${x}) = 1 - ${fracTex(off[0][0], off[0][1])} - ${fracTex(off[1][0], off[1][1])} = ${ans}`,
    ],
  };
}

// Metropolized random walk on a graph, uniform target (Levin and Peres, example 3.3): P(x, y) = min(1/deg x, 1/deg y).
function graphe(): Exercise {
  const dx = randInt(1, 6);
  let dy = randInt(1, 6);
  if (dy === dx) dy = dx === 6 ? 5 : dx + 1;
  const kind = Math.random() < 0.5 ? "accept" : "trans";
  const intro =
    "On veut tirer un sommet uniformément en marchant sur un graphe : depuis $x$, on propose un voisin $y$ au hasard, et on accepte avec la probabilité de Metropolis-Hastings pour la loi uniforme.";
  if (kind === "accept") {
    const ans = fracTex(Math.min(dx, dy), dy);
    return {
      intro: `${intro} Avec quelle probabilité accepte-t-on le pas de $x$ vers $y$ ?`,
      promptTex: `\\deg(x) = ${dx} \\qquad \\deg(y) = ${dy} \\qquad A(x, y) = \\ ?`,
      answerTex: ans,
      hint: "$q(y \\mid x) = 1/\\deg(x)$ ; la cible est uniforme, donc le rapport se réduit à $q(x \\mid y)/q(y \\mid x) = \\deg(x)/\\deg(y)$.",
      solution: [`A(x, y) = \\min\\left(1,\\ \\frac{\\deg(x)}{\\deg(y)}\\right) = \\min\\left(1,\\ \\frac{${dx}}{${dy}}\\right) = ${ans}`],
    };
  }
  const ans = fracTex(1, Math.max(dx, dy));
  return {
    intro: `${intro} Quelle est la probabilité de passer de $x$ à son voisin $y$ en un pas ?`,
    promptTex: `\\deg(x) = ${dx} \\qquad \\deg(y) = ${dy} \\qquad P(x, y) = \\ ?`,
    answerTex: ans,
    hint: "Probabilité de proposer $y$, $1/\\deg(x)$, fois probabilité d'accepter, $\\min(1, \\deg(x)/\\deg(y))$.",
    solution: [`P(x, y) = \\frac{1}{${dx}} \\min\\left(1,\\ \\frac{${dx}}{${dy}}\\right) = ${ans}`],
  };
}

export const mcmcGenerators: ExerciseGenerator[] = [
  { id: "mc-acceptation", make: acceptation },
  { id: "mc-equilibre", make: equilibre },
  { id: "mc-chaine", make: chaine },
  { id: "mc-graphe", make: graphe },
];
