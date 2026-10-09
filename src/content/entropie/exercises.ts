import { fracTex, pick, randInt } from "../../lib/random";
import type { Exercise, ExerciseGenerator } from "../types";

export const shuffle = <T>(a: T[]): T[] => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};

// Surprise of an event: powers of 1/2, independent events, the reverse question, and nats.
function surprise(): Exercise {
  const kind = randInt(0, 3);
  if (kind === 1) {
    const a = randInt(1, 6);
    const b = randInt(1, 6);
    return {
      intro: "Deux événements indépendants ont les probabilités $p_1$ et $p_2$. Quelle quantité d'information, en bits, apporte le fait d'apprendre que les deux se sont produits ?",
      promptTex: `p_1 = \\frac{1}{${2 ** a}} \\qquad p_2 = \\frac{1}{${2 ** b}} \\qquad h`,
      answerTex: String(a + b),
      hint: "Les probabilités de deux événements indépendants se multiplient, donc leurs surprises s'additionnent.",
      solution: [
        `h = \\log_2 \\frac{1}{p_1 p_2} = \\log_2 ${2 ** a} + \\log_2 ${2 ** b} = ${a} + ${b} = ${a + b} \\text{ bits}`,
      ],
    };
  }
  const k = randInt(1, 10);
  if (kind === 2)
    return {
      intro: "Apprendre qu'un événement s'est produit apporte $h$ bits d'information. Quelle était sa probabilité ?",
      promptTex: `h = ${k} \\text{ bits} \\qquad p`,
      answerTex: fracTex(1, 2 ** k),
      hint: "$h = \\log_2(1/p)$, donc $p = 2^{-h}$.",
      solution: [`p = 2^{-${k}} = ${fracTex(1, 2 ** k)}`],
    };
  if (kind === 3)
    return {
      intro: "Quelle est la quantité d'information d'un événement de probabilité $p$, mesurée en nats (logarithme naturel) ?",
      promptTex: `p = \\frac{1}{${2 ** k}} \\qquad h \\text{ (en nats)}`,
      answerTex: k === 1 ? "\\ln 2" : `${k}\\ln 2`,
      hint: "En nats, $h = \\ln(1/p)$ ; et $\\ln(2^k) = k \\ln 2$.",
      solution: [`h = \\ln ${2 ** k} = \\ln\\left(2^{${k}}\\right) = ${k === 1 ? "" : k}\\ln 2 \\text{ nats}`],
    };
  return {
    intro: "Quelle quantité d'information, en bits, apporte un événement de probabilité $p$ ?",
    promptTex: `p = \\frac{1}{${2 ** k}} \\qquad h`,
    answerTex: String(k),
    hint: "$h = \\log_2(1/p)$.",
    solution: [`h = \\log_2 ${2 ** k} = ${k} \\text{ bits}`],
  };
}

// Random dyadic distribution: split a random leaf of a binary tree in two until there are K leaves.
// Returns the depths d_i, so that p_i = 2^{-d_i}.
export function dyadicDepths(K: number): number[] {
  const d = [0];
  while (d.length < K) {
    const i = randInt(0, d.length - 1);
    const depth = d[i] + 1;
    if (depth > 5) continue;
    d.splice(i, 1, depth, depth);
  }
  return shuffle(d);
}

// Entropy of a distribution whose probabilities are powers of 1/2: an exact fraction of bits.
function entropieDyadique(): Exercise {
  const K = randInt(3, 6);
  const d = dyadicDepths(K);
  const D = Math.max(...d);
  // H = sum d_i 2^{-d_i} = (sum d_i 2^{D - d_i}) / 2^D
  const num = d.reduce((s, di) => s + di * 2 ** (D - di), 0);
  const ans = fracTex(num, 2 ** D);
  return {
    intro: "Calcule l'entropie, en bits, d'une variable qui prend $K$ valeurs avec les probabilités suivantes. Donne une fraction exacte.",
    promptTex: `p = \\left(${d.map((di) => fracTex(1, 2 ** di)).join(",\\ ")}\\right) \\qquad H`,
    answerTex: ans,
    hint: "$H = \\sum_i p_i \\log_2(1/p_i)$, et $\\log_2 2^k = k$.",
    solution: [
      `H = ${d.map((di) => `${fracTex(1, 2 ** di)} \\times ${di}`).join(" + ")}`,
      `H = \\frac{${num}}{${2 ** D}} = ${ans} \\text{ bits}`,
    ],
  };
}

// Uniform variable on K outcomes: log2 K bits, or ln K nats.
function entropieUniforme(): Exercise {
  const K = pick([2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 26, 32, 64, 100]);
  const nats = Math.random() < 0.3;
  const m = Math.log2(K);
  const pow2 = Number.isInteger(m);
  const ans = nats ? `\\ln ${K}` : pow2 ? String(m) : `\\log_2 ${K}`;
  return {
    intro: nats
      ? "Une variable est uniforme sur $K$ valeurs. Donne son entropie en nats (logarithme naturel), sous forme exacte."
      : "Une variable est uniforme sur $K$ valeurs. Donne son entropie en bits, sous forme exacte.",
    promptTex: `K = ${K} \\qquad H`,
    answerTex: ans,
    hint: "Chaque issue a la probabilité $1/K$ et la même surprise : l'entropie est cette surprise.",
    solution: [
      nats
        ? `H = \\sum_{i=1}^{${K}} \\frac{1}{${K}} \\ln ${K} = \\ln ${K} \\text{ nats}`
        : `H = \\sum_{i=1}^{${K}} \\frac{1}{${K}} \\log_2 ${K} = \\log_2 ${K}${pow2 ? ` = ${m}` : ""} \\text{ bits}`,
    ],
  };
}

// Entropy revealed in two stages: which group, then which symbol inside the group (Shannon section 6, MacKay 2.43).
function decomposition(): Exercise {
  const q = pick([
    [2, 2],
    [2, 4, 4],
    [4, 2, 4],
    [4, 4, 4, 4],
    [2, 4, 8, 8],
  ]); // group g has probability 1/q[g]
  const a = q.map(() => randInt(0, 4)); // group g holds 2^a[g] equally likely symbols
  const names = ["A", "B", "C", "D"];
  // H = sum (1/q) log2 q + sum (1/q) a, over the common denominator 8
  const groupNum = q.reduce((s, qi) => s + (8 / qi) * Math.log2(qi), 0);
  const insideNum = q.reduce((s, qi, i) => s + (8 / qi) * a[i], 0);
  const ans = fracTex(groupNum + insideNum, 8);
  return {
    intro: `Un symbole est tiré en deux temps : d'abord un groupe, avec les probabilités indiquées, puis un symbole uniformément dans ce groupe. Les groupes n'ont aucun symbole en commun. Calcule l'entropie du symbole, en bits.`,
    promptTex: `\\begin{gathered} ${q.map((qi, i) => `P(${names[i]}) = ${fracTex(1, qi)},\\ ${2 ** a[i]} \\text{ symbole${2 ** a[i] > 1 ? "s" : ""}}`).join(" \\\\ ")} \\end{gathered}`,
    answerTex: ans,
    hint: "Entropie du choix du groupe, plus la moyenne, pondérée par les probabilités des groupes, de l'entropie à l'intérieur de chaque groupe ($\\log_2$ du nombre de symboles).",
    solution: [
      `H(\\text{groupe}) = ${q.map((qi) => `${fracTex(1, qi)} \\log_2 ${qi}`).join(" + ")} = ${fracTex(groupNum, 8)}`,
      `\\sum_g P(g)\\, H(\\text{symbole} \\mid g) = ${q.map((qi, i) => `${fracTex(1, qi)} \\times ${a[i]}`).join(" + ")} = ${fracTex(insideNum, 8)}`,
      `H = ${fracTex(groupNum, 8)} + ${fracTex(insideNum, 8)} = ${ans} \\text{ bits}`,
    ],
  };
}

// Huffman code lengths for integer counts; returns the lengths and the merges, for the written solution.
function huffman(w: number[]): { lengths: number[]; merges: string[] } {
  let nodes = w.map((wi, i) => ({ w: wi, order: i, members: [i] }));
  const lengths = w.map(() => 0);
  const merges: string[] = [];
  while (nodes.length > 1) {
    nodes.sort((x, y) => x.w - y.w || x.order - y.order);
    const [x, y] = nodes;
    for (const i of [...x.members, ...y.members]) lengths[i]++;
    merges.push(`${x.w} + ${y.w} = ${x.w + y.w}`);
    nodes = [{ w: x.w + y.w, order: x.order, members: [...x.members, ...y.members] }, ...nodes.slice(2)];
  }
  return { lengths, merges };
}

// Expected length of the Huffman code for a small source given by counts.
function huffmanLength(): Exercise {
  const K = randInt(4, 5);
  const w = Array.from({ length: K }, () => randInt(1, 9)).sort((x, y) => y - x);
  const W = w.reduce((s, v) => s + v, 0);
  const { lengths, merges } = huffman(w);
  const total = w.reduce((s, wi, i) => s + wi * lengths[i], 0);
  const ans = fracTex(total, W);
  return {
    intro: `Sur un texte de $N = ${W}$ symboles, on a compté les occurrences $n_i$ de chacun des ${K} symboles. Construis un code de Huffman et donne sa longueur moyenne $L$ en bits par symbole (fraction exacte).`,
    promptTex: `n = (${w.join(",\\ ")}) \\qquad L`,
    answerTex: ans,
    hint: "Fusionne à chaque étape les deux poids les plus petits ; chaque fusion ajoute un bit aux symboles qu'elle contient. Puis $L = \\sum_i n_i\\, l_i / N$.",
    solution: [
      `\\text{fusions : } ${merges.join(" \\quad ")}`,
      `l = (${lengths.join(",\\ ")})`,
      `L = \\frac{${w.map((wi, i) => `${wi} \\times ${lengths[i]}`).join(" + ")}}{${W}} = ${ans}`,
    ],
  };
}

export const entropieGenerators: ExerciseGenerator[] = [
  { id: "en-surprise", make: surprise },
  { id: "en-dyadique", make: entropieDyadique },
  { id: "en-uniforme", make: entropieUniforme },
  { id: "en-decomposition", make: decomposition },
  { id: "en-huffman", make: huffmanLength },
];
