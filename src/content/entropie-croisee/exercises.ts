import { fracTex, pick, randInt } from "../../lib/random";
import { dyadicDepths, shuffle } from "../entropie/exercises";
import type { Exercise, ExerciseGenerator } from "../types";

// Random positive integers summing to total, one per symbol.
function composition(K: number, total: number): number[] {
  const n = Array.from({ length: K }, () => 1);
  for (let r = total - K; r > 0; r--) n[randInt(0, K - 1)]++;
  return n;
}

const lawTex = (p: string[]) => `\\left(${p.join(",\\ ")}\\right)`;
const dyadicTex = (d: number[]) => lawTex(d.map((di) => fracTex(1, 2 ** di)));

// Cross-entropy H(p, q) in bits, when q is dyadic (q_i = 2^{-d_i}) or uniform on 2^m symbols.
function croisee(): Exercise {
  if (Math.random() < 0.3) {
    const m = randInt(2, 3);
    const K = 2 ** m;
    const den = pick([8, 10, 12, 16]);
    const n = composition(K, den);
    return {
      intro: `Un code est construit pour la loi uniforme $q$ sur ${K} symboles, mais les symboles suivent la loi $p$ ci-dessous. Donne l'entropie croisée $H(p, q)$, en bits.`,
      promptTex: `p = ${lawTex(n.map((ni) => fracTex(ni, den)))} \\qquad H(p, q)`,
      answerTex: String(m),
      hint: "Chaque symbole a la même longueur $\\log_2(1/q_i)$ ; la moyenne ne dépend donc pas de $p$.",
      solution: [`H(p, q) = \\sum_i p_i \\log_2 ${K} = \\log_2 ${K} \\sum_i p_i = ${m} \\text{ bits}`],
    };
  }
  const K = randInt(3, 5);
  const d = dyadicDepths(K);
  const den = pick([8, 10, 12]);
  const n = composition(K, den);
  const num = n.reduce((s, ni, i) => s + ni * d[i], 0);
  const ans = fracTex(num, den);
  return {
    intro: "Un code est construit pour la loi $q$, avec des longueurs $\\log_2(1/q_i)$, mais les symboles suivent la loi $p$. Donne l'entropie croisée $H(p, q)$, en bits, sous forme de fraction exacte.",
    promptTex: `\\begin{gathered} p = ${lawTex(n.map((ni) => fracTex(ni, den)))} \\\\ q = ${dyadicTex(d)} \\end{gathered}`,
    answerTex: ans,
    hint: "$H(p, q) = \\sum_i p_i \\log_2(1/q_i)$ : les probabilités viennent de $p$, les longueurs de $q$.",
    solution: [
      `\\log_2 \\tfrac{1}{q} = (${d.join(",\\ ")})`,
      `H(p, q) = ${n.map((ni, i) => `${fracTex(ni, den)} \\times ${d[i]}`).join(" + ")} = ${ans} \\text{ bits}`,
    ],
  };
}

// KL divergence in bits between two dyadic laws, in a random direction.
function kl(): Exercise {
  const K = randInt(3, 5);
  const a = dyadicDepths(K);
  let b = shuffle(a);
  while (b.every((v, i) => v === a[i])) b = Math.random() < 0.5 ? shuffle(a) : dyadicDepths(K);
  const forward = Math.random() < 0.5;
  // D(P || Q) = sum P_i log2(P_i / Q_i) = sum 2^{-dP_i} (dQ_i - dP_i)
  const [dP, dQ] = forward ? [a, b] : [b, a];
  const D = Math.max(...dP);
  const num = dP.reduce((s, di, i) => s + 2 ** (D - di) * (dQ[i] - di), 0);
  const ans = fracTex(num, 2 ** D);
  const P = forward ? "p" : "q";
  const Q = forward ? "q" : "p";
  return {
    intro: `Donne la divergence $D_{\\mathrm{KL}}(${P} \\,\\|\\, ${Q})$, en bits, sous forme de fraction exacte.`,
    promptTex: `\\begin{gathered} p = ${dyadicTex(a)} \\\\ q = ${dyadicTex(b)} \\end{gathered}`,
    answerTex: ans,
    hint: `$D_{\\mathrm{KL}}(${P} \\| ${Q}) = \\sum_i ${P}_i \\log_2 \\frac{${P}_i}{${Q}_i}$, la moyenne sous $${P}$ ; avec des puissances de $\\tfrac12$, chaque logarithme est un entier.`,
    solution: [
      `\\log_2 \\frac{${P}_i}{${Q}_i} = (${dP.map((di, i) => dQ[i] - di).join(",\\ ")})`,
      `D_{\\mathrm{KL}}(${P} \\| ${Q}) = ${dP.map((di, i) => `${fracTex(1, 2 ** di)} \\times ${dQ[i] - di < 0 ? `(${dQ[i] - di})` : dQ[i] - di}`).join(" + ")} = ${ans} \\text{ bits}`,
    ],
  };
}

// Perplexity: from the probabilities given to the observed tokens, from a uniform model, or from the loss.
function perplexite(): Exercise {
  const kind = randInt(0, 2);
  if (kind === 1) {
    const K = pick([3, 5, 7, 10, 50, 100, 1000]);
    return {
      intro: `Un modèle de langage donne la même probabilité à chacun des ${K} tokens de son vocabulaire, quel que soit le contexte. Quelle est sa perplexité sur un texte quelconque ?`,
      promptTex: `q(w_i \\mid w_{<i}) = \\frac{1}{${K}} \\qquad \\mathrm{PP}`,
      answerTex: String(K),
      hint: "$\\mathrm{PP} = \\exp\\big(-\\frac1N \\sum_i \\ln q(w_i \\mid w_{<i})\\big)$.",
      solution: [`-\\frac1N \\sum_i \\ln \\frac{1}{${K}} = \\ln ${K} \\qquad \\mathrm{PP} = e^{\\ln ${K}} = ${K}`],
    };
  }
  if (kind === 2) {
    const k = randInt(1, 8);
    const nats = Math.random() < 0.5;
    return {
      intro: nats
        ? "La perte d'entraînement d'un modèle de langage, en nats par token, vaut la valeur ci-dessous. Quelle est sa perplexité ?"
        : "La perte d'un modèle de langage, en bits par token, vaut la valeur ci-dessous. Quelle est sa perplexité ?",
      promptTex: nats ? `L = ${k === 1 ? "" : k}\\ln 2 \\text{ nats/token} \\qquad \\mathrm{PP}` : `L = ${k} \\text{ bits/token} \\qquad \\mathrm{PP}`,
      answerTex: String(2 ** k),
      hint: "En nats, $\\mathrm{PP} = e^L$ ; en bits, $\\mathrm{PP} = 2^L$.",
      solution: [nats ? `\\mathrm{PP} = e^{${k === 1 ? "" : k}\\ln 2} = 2^{${k}} = ${2 ** k}` : `\\mathrm{PP} = 2^{${k}} = ${2 ** k}`],
    };
  }
  // N tokens with probabilities 2^{-d_i}, the total of the d_i a multiple of N: PP = 2^{sum d / N}.
  const N = randInt(2, 5);
  let d: number[];
  do d = Array.from({ length: N }, () => randInt(1, 6));
  while (d.reduce((s, v) => s + v, 0) % N !== 0);
  const S = d.reduce((s, v) => s + v, 0);
  return {
    intro: `Sur un texte de ${N} tokens, un modèle de langage a donné aux tokens réellement observés les probabilités ci-dessous. Quelle est sa perplexité ?`,
    promptTex: `q = ${dyadicTex(d)} \\qquad \\mathrm{PP}`,
    answerTex: String(2 ** (S / N)),
    hint: "$\\mathrm{PP} = \\big(\\prod_i q_i\\big)^{-1/N}$, ou $2$ puissance la perte moyenne en bits.",
    solution: [
      `-\\frac1N \\sum_i \\log_2 q_i = \\frac{${d.join(" + ")}}{${N}} = ${S / N} \\text{ bits/token}`,
      `\\mathrm{PP} = 2^{${S / N}} = ${2 ** (S / N)}`,
    ],
  };
}

export const entropieCroiseeGenerators: ExerciseGenerator[] = [
  { id: "ec-croisee", make: croisee },
  { id: "ec-kl", make: kl },
  { id: "ec-perplexite", make: perplexite },
];
