import { fracTex, pick, randInt } from "../../lib/random";
import type { Exercise, ExerciseGenerator } from "../types";

// Markov (mean only) or Chebyshev (variance), as an exact fraction.
function markov(): Exercise {
  const kind = randInt(0, 2);
  if (kind === 0) {
    const m = randInt(1, 6);
    const t = m + randInt(1, 12);
    const ans = fracTex(m, t);
    return {
      intro: `Le temps de réponse $X$ d'un serveur, en secondes, est positif et vaut ${m} en moyenne. Que donne l'inégalité de Markov pour la probabilité qu'une requête prenne au moins ${t} secondes ?`,
      promptTex: `X \\ge 0 \\qquad \\mathbb E[X] = ${m} \\qquad P(X \\ge ${t}) \\le \\ ?`,
      answerTex: ans,
      hint: "Markov : $P(X \\ge t) \\le \\mathbb E[X] / t$.",
      solution: [`P(X \\ge ${t}) \\le \\frac{\\mathbb E[X]}{${t}} = ${ans}`],
    };
  }
  if (kind === 1) {
    const v = randInt(1, 9);
    const t = randInt(2, 6);
    const mu = randInt(0, 20);
    if (v >= t * t) return markov();
    const ans = fracTex(v, t * t);
    return {
      intro: `Une variable $X$ a pour espérance ${mu} et pour variance ${v}. Que donne l'inégalité de Tchebychev pour la probabilité que $X$ s'écarte d'au moins ${t} de son espérance ?`,
      promptTex: `\\mathbb E[X] = ${mu} \\qquad \\operatorname{Var}(X) = ${v} \\qquad P(|X - ${mu}| \\ge ${t}) \\le \\ ?`,
      answerTex: ans,
      hint: "Tchebychev : $P(|X - \\mu| \\ge t) \\le \\operatorname{Var}(X) / t^2$.",
      solution: [`P(|X - ${mu}| \\ge ${t}) \\le \\frac{${v}}{${t}^2} = ${ans}`],
    };
  }
  // Coin: S ~ Bin(N, 1/2), Var = N/4, deviation t = k - N/2.
  const N = pick([16, 20, 36, 40, 64, 100]);
  const t = randInt(Math.ceil(Math.sqrt(N / 4)) + 1, N / 2);
  const k = N / 2 + t;
  const ans = fracTex(N, 4 * t * t);
  return {
    intro: `On lance ${N} fois une pièce équilibrée ; $S$ est le nombre de piles. Que donne l'inégalité de Tchebychev pour la probabilité d'obtenir au moins ${k} piles (en bornant par l'écart $|S - ${N / 2}| \\ge ${t}$) ?`,
    promptTex: `S \\sim \\mathcal B(${N}, \\tfrac12) \\qquad P(S \\ge ${k}) \\le \\ ?`,
    answerTex: ans,
    hint: "$\\mathbb E[S] = N/2$ et $\\operatorname{Var}(S) = N/4$ ; puis $P(S \\ge k) \\le P(|S - N/2| \\ge k - N/2)$.",
    solution: [
      `\\operatorname{Var}(S) = \\frac{${N}}{4} = ${fracTex(N, 4)} \\qquad P(|S - ${N / 2}| \\ge ${t}) \\le \\frac{${fracTex(N, 4)}}{${t}^2} = ${ans}`,
    ],
  };
}

// Hoeffding bound e^{-2N eps^2 / (b - a)^2}, one- or two-sided, with an integer exponent.
function hoeffding(): Exercise {
  const setting = pick([
    { eps: "\\tfrac1{10}", e2: [1, 100], range: [0, 1], step: 50 },
    { eps: "\\tfrac14", e2: [1, 16], range: [0, 1], step: 8 },
    { eps: "\\tfrac15", e2: [1, 25], range: [0, 1], step: 25 },
    { eps: "\\tfrac12", e2: [1, 4], range: [-1, 1], step: 8 },
    { eps: "1", e2: [1, 1], range: [0, 4], step: 8 },
  ]);
  const w = setting.range[1] - setting.range[0];
  // exponent k = 2 N eps^2 / w^2 ; N = step * m gives k = 2 step m e2 / w^2
  const m = randInt(1, 6);
  const N = setting.step * m;
  const k = (2 * N * setting.e2[0]) / (setting.e2[1] * w * w);
  const two = Math.random() < 0.5;
  const ans = `${two ? "2" : ""}e^{-${k}}`;
  return {
    intro: `On mesure la moyenne $\\bar X$ de ${N} variables indépendantes à valeurs dans $[${setting.range[0]}, ${setting.range[1]}]$, d'espérance $\\mu$. Donne la borne de Hoeffding pour la probabilité ci-dessous, sous forme exacte.`,
    promptTex: two ? `P\\big(|\\bar X - \\mu| \\ge ${setting.eps}\\big) \\le \\ ?` : `P\\big(\\bar X - \\mu \\ge ${setting.eps}\\big) \\le \\ ?`,
    answerTex: ans,
    hint: "$P(\\bar X - \\mu \\ge \\varepsilon) \\le e^{-2N\\varepsilon^2/(b - a)^2}$ ; la version bilatérale ajoute un facteur 2.",
    solution: [
      `\\frac{2N\\varepsilon^2}{(b - a)^2} = \\frac{2 \\times ${N} \\times ${fracTex(setting.e2[0], setting.e2[1])}}{${w}^2} = ${k}`,
      `P \\le ${ans}`,
    ],
  };
}

// Test-set size N >= ln(2K/delta) / (2 eps^2), exact.
function taille(): Exercise {
  const [epsTex, c] = pick([
    ["0{,}1", 50],
    ["0{,}05", 200],
    ["0{,}02", 1250],
    ["0{,}01", 5000],
  ] as [string, number][]);
  const [deltaTex, inv] = pick([
    ["0{,}1", 10],
    ["0{,}05", 20],
    ["0{,}01", 100],
  ] as [string, number][]);
  const K = pick([1, 1, 10, 100, 1000]);
  const arg = 2 * K * inv;
  const ans = `${c}\\ln ${arg}`;
  return {
    intro:
      K === 1
        ? `On veut mesurer la précision d'un modèle à $\\pm ${epsTex}$ près avec une probabilité au moins $1 - \\delta$. D'après Hoeffding, combien d'exemples de test suffisent ? Donne la valeur exacte de la borne, avec un logarithme, avant arrondi.`
        : `On évalue ${K} modèles sur le même jeu de test et on veut que toutes les précisions mesurées soient à $\\pm ${epsTex}$ près, avec une probabilité au moins $1 - \\delta$. D'après Hoeffding et la borne de la réunion, combien d'exemples suffisent ? Donne la valeur exacte, avec un logarithme, avant arrondi.`,
    promptTex: `\\varepsilon = ${epsTex} \\qquad \\delta = ${deltaTex}${K === 1 ? "" : ` \\qquad K = ${K}`} \\qquad N \\ge \\ ?`,
    answerTex: ans,
    hint: "Il faut $2K e^{-2N\\varepsilon^2} \\le \\delta$, soit $N \\ge \\frac{\\ln(2K/\\delta)}{2\\varepsilon^2}$.",
    solution: [`N \\ge \\frac{\\ln(2 \\times ${K} / ${deltaTex})}{2 \\times ${epsTex}^2} = ${c}\\ln ${arg}`],
  };
}

// Chernoff bound e^{-N D(q || p)} for Bernoulli, as an exact fraction: (p/q)^{Nq} ((1-p)/(1-q))^{N(1-q)}.
function chernoff(): Exercise {
  const pairs: [number, number, number, number][] = [
    // p = a/b, q = c/d with q > p
    [1, 2, 3, 4],
    [1, 2, 1, 1],
    [1, 3, 2, 3],
    [1, 4, 1, 2],
    [1, 2, 2, 3],
    [1, 3, 1, 2],
    [1, 4, 3, 4],
  ];
  const [a, b, c, d] = pick(pairs);
  const N = d * randInt(1, d === 1 ? 6 : d === 2 ? 3 : 2); // N q integer
  const k = (N * c) / d;
  // e^{-N D} = a^k (b - a)^{N - k} d^N / (b^N c^k (d - c)^{N - k})
  const num = a ** k * (b - a) ** (N - k) * d ** N;
  const den = b ** N * c ** k * (d - c) ** (N - k);
  const ans = fracTex(num, den);
  const pTex = fracTex(a, b);
  const qTex = fracTex(c, d);
  return {
    intro: `On tire ${N} variables de Bernoulli indépendantes de paramètre $p$ ; $\\hat p$ est la proportion de succès. Donne la borne de Chernoff $e^{-N D_{\\mathrm{KL}}(q \\| p)}$ de la probabilité ci-dessous, sous forme de fraction.`,
    promptTex: `p = ${pTex} \\qquad P\\big(\\hat p \\ge ${qTex}\\big) \\le \\ ?`,
    answerTex: ans,
    hint: "$e^{-N D_{\\mathrm{KL}}(q \\| p)} = \\left(\\frac pq\\right)^{Nq} \\left(\\frac{1 - p}{1 - q}\\right)^{N(1 - q)}$, avec la convention $0^0 = 1$.",
    solution: [
      c === d
        ? `e^{-N D_{\\mathrm{KL}}(1 \\| p)} = p^{N} = \\left(${pTex}\\right)^{${N}} = ${ans}`
        : `e^{-N D_{\\mathrm{KL}}(q \\| p)} = \\left(\\frac{${pTex}}{${qTex}}\\right)^{${k}} \\left(\\frac{${fracTex(b - a, b)}}{${fracTex(d - c, d)}}\\right)^{${N - k}} = ${ans}`,
    ],
  };
}

export const hoeffdingGenerators: ExerciseGenerator[] = [
  { id: "cc-markov", make: markov },
  { id: "cc-hoeffding", make: hoeffding },
  { id: "cc-taille", make: taille },
  { id: "cc-chernoff", make: chernoff },
];
