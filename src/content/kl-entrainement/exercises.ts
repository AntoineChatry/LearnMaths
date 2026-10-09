import { fracTex, pick, randInt } from "../../lib/random";
import { dyadicDepths, shuffle } from "../entropie/exercises";
import type { Exercise, ExerciseGenerator } from "../types";

// Random positive integers summing to total, one per entry.
function composition(K: number, total: number): number[] {
  const n = Array.from({ length: K }, () => 1);
  for (let r = total - K; r > 0; r--) n[randInt(0, K - 1)]++;
  return n;
}

const lawTex = (p: string[]) => `\\left(${p.join(",\\ ")}\\right)`;
const powHalf = (d: number) => fracTex(1, 2 ** d);
const pow2Tex = (k: number) => (k >= 0 ? String(2 ** k) : fracTex(1, 2 ** -k));

// rational - (num/den) ln 2, written without a "1" coefficient or a leading "+".
function minusLn2(ratNum: number, ratDen: number, num: number, den: number): string {
  const rat = ratNum === 0 ? "" : fracTex(ratNum, ratDen);
  if (num === 0) return rat === "" ? "0" : rat;
  const c = fracTex(Math.abs(num), den);
  const term = `${c === "1" ? "" : c}\\ln 2`;
  if (rat === "") return num > 0 ? `-${term}` : term;
  return `${rat} ${num > 0 ? "-" : "+"} ${term}`;
}

// VAE regulariser: D(N(mu, diag sigma^2) || N(0, I)) = 1/2 sum (mu^2 + sigma^2 - 1 - ln sigma^2), sigma^2 = 2^k.
function gauss(): Exercise {
  const J = pick([1, 1, 2]);
  let mu: number[];
  let k: number[];
  do {
    mu = Array.from({ length: J }, () => randInt(-2, 2));
    k = Array.from({ length: J }, () => randInt(-2, 2));
  } while (mu.every((m, j) => m === 0 && k[j] === 0));
  // In eighths: 1/2 (mu^2 + 2^k - 1) = (4 mu^2 + 2^{k+2} - 4) / 8.
  const q = mu.reduce((s, m, j) => s + 4 * m * m + 2 ** (k[j] + 2) - 4, 0);
  const K = k.reduce((s, v) => s + v, 0);
  const ans = minusLn2(q, 8, K, 2);
  const s2 = k.map(pow2Tex);
  const term = (j: number) => `\\big(${mu[j] < 0 ? `(${mu[j]})` : mu[j]}^2 + ${s2[j]} - 1 - \\ln ${s2[j]}\\big)`;
  return {
    intro:
      J === 1
        ? "L'encodeur d'un VAE à une dimension latente donne $q = \\mathcal N(\\mu, \\sigma^2)$ pour une donnée. Donne le terme de régularisation $D_{\\mathrm{KL}}\\big(q \\,\\|\\, \\mathcal N(0, 1)\\big)$, en nats, sous forme exacte."
        : "L'encodeur d'un VAE à deux dimensions latentes donne $q = \\mathcal N(\\mu, \\operatorname{diag} \\sigma^2)$ pour une donnée. Donne le terme de régularisation $D_{\\mathrm{KL}}\\big(q \\,\\|\\, \\mathcal N(0, I)\\big)$, en nats, sous forme exacte.",
    promptTex: J === 1 ? `\\mu = ${mu[0]} \\qquad \\sigma^2 = ${s2[0]}` : `\\mu = (${mu.join(",\\ ")}) \\qquad \\sigma^2 = \\left(${s2.join(",\\ ")}\\right)`,
    answerTex: ans,
    hint: "$D_{\\mathrm{KL}} = \\frac12 \\sum_j \\big(\\mu_j^2 + \\sigma_j^2 - 1 - \\ln \\sigma_j^2\\big)$, et $\\ln 2^k = k \\ln 2$.",
    solution: [
      `D_{\\mathrm{KL}} = \\frac12 ${J === 1 ? term(0) : `\\Big[${term(0)} + ${term(1)}\\Big]`}`,
      `= ${ans}`,
    ],
  };
}

// Discrete latent variable, base-2 logs: ELBO L = sum q (log2 p(x, z) - log2 q), gap log2 p(x) - L = D(q || p(z | x)).
function elbo(): Exercise {
  const askGap = Math.random() < 0.5;
  // With K = 2 the only dyadic law is (1/2, 1/2): q could not differ from the posterior.
  const K = randInt(askGap ? 3 : 2, 4);
  const d = dyadicDepths(K); // posterior p(z | x) = 2^{-d}
  const m = randInt(1, 3); // p(x) = 2^{-m}
  let e = Math.random() < 0.5 ? shuffle(d) : dyadicDepths(K); // q(z | x) = 2^{-e}
  while (askGap && e.every((v, i) => v === d[i])) e = Math.random() < 0.5 ? shuffle(d) : dyadicDepths(K);
  const D = Math.max(...e);
  const gapNum = e.reduce((s, ei, i) => s + 2 ** (D - ei) * (d[i] - ei), 0);
  const lNum = e.reduce((s, ei, i) => s + 2 ** (D - ei) * (ei - m - d[i]), 0);
  const ans = askGap ? fracTex(gapNum, 2 ** D) : fracTex(lNum, 2 ** D);
  const sum = (f: (i: number) => number) =>
    e.map((ei, i) => `${powHalf(ei)} \\times ${f(i) < 0 ? `(${f(i)})` : f(i)}`).join(" + ");
  return {
    intro: askGap
      ? `Un modèle à variable latente $z \\in \\{1, \\dots, ${K}\\}$ donne, pour la donnée observée $x$, les probabilités jointes $p(x, z)$ ci-dessous ; l'encodeur propose $q(z \\mid x)$. Avec des logarithmes en base 2, donne l'écart $\\log_2 p(x) - \\mathcal L$ entre la log-vraisemblance et la borne, sous forme de fraction exacte.`
      : `Un modèle à variable latente $z \\in \\{1, \\dots, ${K}\\}$ donne, pour la donnée observée $x$, les probabilités jointes $p(x, z)$ ci-dessous ; l'encodeur propose $q(z \\mid x)$. Avec des logarithmes en base 2, donne la borne $\\mathcal L = \\mathbb E_q[\\log_2 p(x, z) - \\log_2 q(z \\mid x)]$, sous forme de fraction exacte.`,
    promptTex: `\\begin{gathered} p(x, z) = ${lawTex(d.map((di) => powHalf(m + di)))} \\\\ q(z \\mid x) = ${lawTex(e.map(powHalf))} \\end{gathered}`,
    answerTex: ans,
    hint: askGap
      ? "L'écart est $D_{\\mathrm{KL}}(q \\| p(z \\mid x))$. Commence par $p(x) = \\sum_z p(x, z)$, puis $p(z \\mid x) = p(x, z) / p(x)$."
      : "$\\mathcal L = \\sum_z q(z \\mid x)\\big(\\log_2 p(x, z) - \\log_2 q(z \\mid x)\\big)$ ; avec des puissances de $\\tfrac12$, chaque logarithme est un entier.",
    solution: askGap
      ? [
          `p(x) = ${fracTex(1, 2 ** m)} \\qquad p(z \\mid x) = ${lawTex(d.map(powHalf))}`,
          `D_{\\mathrm{KL}}(q \\| p(z \\mid x)) = ${sum((i) => d[i] - e[i])} = ${ans}`,
        ]
      : [
          `\\log_2 p(x, z) - \\log_2 q(z \\mid x) = (${e.map((ei, i) => ei - m - d[i]).join(",\\ ")})`,
          `\\mathcal L = ${sum((i) => e[i] - m - d[i])} = ${ans}`,
        ],
  };
}

// Distillation: gradient (q_i - p_i) / T of the soft cross-entropy, or a teacher softmax at temperature T.
function distillation(): Exercise {
  if (Math.random() < 0.5) {
    const K = randInt(3, 4);
    const den = pick([8, 10, 12]);
    const p = composition(K, den);
    let q: number[];
    do q = composition(K, den);
    while (q.every((v, i) => v === p[i]));
    const diff = q.map((v, i) => v - p[i]);
    const nz = diff.map((v, i) => (v !== 0 ? i : -1)).filter((i) => i >= 0);
    const i = pick(nz);
    const T = pick([1, 2, 4, 5]);
    const ans = fracTex(diff[i], den * T);
    return {
      intro: `On distille un professeur dans un élève à la température $T = ${T}$. Pour un exemple, les cibles douces du professeur sont $p$ et les probabilités de l'élève (à la même température) sont $q$. Donne la dérivée de la perte $H(p, q)$ par rapport au logit $z_{${i + 1}}$ de l'élève.`,
      promptTex: `\\begin{gathered} p = ${lawTex(p.map((v) => fracTex(v, den)))} \\\\ q = ${lawTex(q.map((v) => fracTex(v, den)))} \\end{gathered}`,
      answerTex: ans,
      hint: "Hinton et al., équation 2 : $\\frac{\\partial H(p, q)}{\\partial z_i} = \\frac1T (q_i - p_i)$.",
      solution: [
        `\\frac{\\partial H}{\\partial z_{${i + 1}}} = \\frac{1}{${T}}\\Big(${fracTex(q[i], den)} - ${fracTex(p[i], den)}\\Big) = ${ans}`,
      ],
    };
  }
  // Teacher logits v_i = 2 ln a_i with a_i squares: at temperature T, p_i is proportional to a_i^{2/T}.
  const K = 3;
  let a: number[];
  do a = Array.from({ length: K }, () => pick([1, 4, 9, 16]));
  while (a.every((v) => v === a[0]));
  const T = pick([1, 2, 4]);
  const w = a.map((v) => (T === 1 ? v * v : T === 2 ? v : Math.sqrt(v)));
  const S = w.reduce((s, v) => s + v, 0);
  const j = randInt(0, K - 1);
  const ans = fracTex(w[j], S);
  const vTex = a.map((v) => (v === 1 ? "0" : `2\\ln ${v}`));
  return {
    intro: `Le professeur produit les logits $v$ ci-dessous. Donne la cible douce $p_{${j + 1}}$ qu'il fournit à la température $T = ${T}$, sous forme de fraction.`,
    promptTex: `v = (${vTex.join(",\\ ")}) \\qquad T = ${T} \\qquad p_{${j + 1}}`,
    answerTex: ans,
    hint: "$p_i = e^{v_i/T} / \\sum_k e^{v_k/T}$, et $e^{c \\ln a} = a^c$.",
    solution: [
      `e^{v_i / ${T}} = \\big(${a.map((v) => `${v}^{${fracTex(2, T)}}`).join(",\\ ")}\\big) = (${w.join(",\\ ")})`,
      `p_{${j + 1}} = \\frac{${w[j]}}{${w.join(" + ")}} = ${ans}`,
    ],
  };
}

// RLHF: optimal policy pi* = pi_ref e^{r/beta} / Z, or the per-sample reward r - beta ln(pi / pi_ref).
function rlhf(): Exercise {
  if (Math.random() < 0.6) {
    const K = randInt(2, 4);
    const den = pick([4, 5, 6, 8, 10]);
    const c = composition(K, den);
    const beta = pick([0.5, 1, 2]);
    const choices = beta === 0.5 ? [0, 1] : beta === 1 ? [0, 1, 2, 3] : [0, 2, 4];
    let n: number[];
    do n = Array.from({ length: K }, () => pick(choices));
    while (n.every((v) => v === n[0]));
    const w = n.map((v, i) => c[i] * 2 ** (v / beta)); // pi_ref e^{r/beta}, times den
    const Z = w.reduce((s, v) => s + v, 0);
    const j = randInt(0, K - 1);
    const ans = fracTex(w[j], Z);
    const rTex = n.map((v) => (v === 0 ? "0" : `${v === 1 ? "" : v}\\ln 2`));
    const betaTex = beta === 0.5 ? "\\tfrac12" : String(beta);
    return {
      intro: `Un modèle de référence $\\pi_{\\text{ref}}$ donne les probabilités ci-dessous à ${K} réponses, notées $r$ par le modèle de récompense. Avec $\\beta = ${beta === 0.5 ? "1/2" : beta}$, donne la probabilité de la réponse ${j + 1} sous la politique optimale $\\pi^*$ de l'objectif $\\mathbb E_\\pi[r] - \\beta D_{\\mathrm{KL}}(\\pi \\| \\pi_{\\text{ref}})$.`,
      promptTex: `\\begin{gathered} \\pi_{\\text{ref}} = ${lawTex(c.map((v) => fracTex(v, den)))} \\\\ r = (${rTex.join(",\\ ")}) \\qquad \\beta = ${betaTex} \\end{gathered}`,
      answerTex: ans,
      hint: "$\\pi^*(y) = \\pi_{\\text{ref}}(y)\\, e^{r(y)/\\beta} / Z$, où $Z$ normalise ; $e^{k \\ln 2} = 2^k$.",
      solution: [
        `e^{r/\\beta} = (${n.map((v) => 2 ** (v / beta)).join(",\\ ")})`,
        `\\pi_{\\text{ref}}\\, e^{r/\\beta} \\propto (${w.join(",\\ ")}) \\qquad \\pi^*(y_{${j + 1}}) = \\frac{${w[j]}}{${Z}} = ${ans}`,
      ],
    };
  }
  const L = randInt(2, 4);
  let k: number[];
  do k = Array.from({ length: L }, () => randInt(-1, 2));
  while (k.reduce((s, v) => s + v, 0) === 0);
  const K = k.reduce((s, v) => s + v, 0);
  const r = randInt(1, 5);
  const bDen = pick([10, 5, 2]); // beta = 1 / bDen
  const ans = minusLn2(r, 1, K, bDen);
  const betaTex = bDen === 2 ? "0{,}5" : bDen === 5 ? "0{,}2" : "0{,}1";
  return {
    intro: `Pendant le RLHF, une réponse de ${L} tokens reçoit la note $r = ${r}$ du modèle de récompense. Pour chaque token, le rapport $\\pi / \\pi_{\\text{ref}}$ entre la politique et le modèle de référence vaut la valeur ci-dessous. Avec $\\beta = ${betaTex}$, donne la récompense pénalisée $R = r - \\beta \\sum_t \\ln \\frac{\\pi(y_t \\mid \\dots)}{\\pi_{\\text{ref}}(y_t \\mid \\dots)}$, sous forme exacte.`,
    promptTex: `\\frac{\\pi}{\\pi_{\\text{ref}}} = \\left(${k.map(pow2Tex).join(",\\ ")}\\right) \\qquad r = ${r} \\qquad \\beta = ${betaTex}`,
    answerTex: ans,
    hint: "La somme des logarithmes est le logarithme du produit, et chaque rapport est une puissance de 2.",
    solution: [
      `\\sum_t \\ln \\frac{\\pi}{\\pi_{\\text{ref}}} = (${k.map((v) => (v < 0 ? `(${v})` : v)).join(" + ")}) \\ln 2 = ${K === 1 ? "" : K === -1 ? "-" : K}\\ln 2`,
      `R = ${r} - ${betaTex} \\times ${K < 0 ? `(${K === -1 ? "-" : K}\\ln 2)` : `${K === 1 ? "" : K}\\ln 2`} = ${ans}`,
    ],
  };
}

export const klEntrainementGenerators: ExerciseGenerator[] = [
  { id: "kt-gauss", make: gauss },
  { id: "kt-elbo", make: elbo },
  { id: "kt-distillation", make: distillation },
  { id: "kt-rlhf", make: rlhf },
];
