import { fracTex, pick, randInt } from "../../lib/random";
import type { Exercise, ExerciseGenerator } from "../types";

// Stochastic rows for 3-state chains, as numerators over 4.
const ROWS = [
  [2, 1, 1],
  [1, 2, 1],
  [1, 1, 2],
  [0, 2, 2],
  [2, 0, 2],
  [2, 2, 0],
  [3, 1, 0],
  [1, 3, 0],
  [0, 1, 3],
  [1, 0, 3],
  [3, 0, 1],
  [0, 3, 1],
];

const randomMatrix = () => [pick(ROWS), pick(ROWS), pick(ROWS)];
const matTex = (A: number[][], den: number) =>
  `P = \\begin{pmatrix} ${A.map((r) => r.map((a) => fracTex(a, den)).join(" & ")).join(" \\\\ ")} \\end{pmatrix}`;
// Decimal with a French comma, from an integer count of hundredths: 58 -> "0{,}58".
const dec = (h: number) => {
  const s = (h / 100).toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
  return s.replace(".", "{,}");
};

// Two-step transition probability (Grinstead and Snell, theorem 11.1; Levin and Peres, equations 1.4-1.5).
function deuxPas(): Exercise {
  if (Math.random() < 0.35) {
    // Two-state chain with tenths, as the frog of Levin and Peres.
    const p = randInt(1, 9);
    const q = randInt(1, 9);
    const A = [
      [10 - p, p],
      [q, 10 - q],
    ];
    const i = randInt(0, 1);
    const j = randInt(0, 1);
    const terms = [0, 1].map((k) => [A[i][k], A[k][j]]);
    const ans = dec(terms.reduce((s, [a, b]) => s + a * b, 0));
    const P = `P = \\begin{pmatrix} ${A.map((r) => r.map((a) => dec(10 * a)).join(" & ")).join(" \\\\ ")} \\end{pmatrix}`;
    return {
      intro: "Une chaîne à deux états, 1 et 2, a la matrice de transition ci-dessous. Calcule la probabilité demandée, en écriture décimale.",
      promptTex: `${P} \\qquad P(X_2 = ${j + 1} \\mid X_0 = ${i + 1}) = \\ ?`,
      answerTex: ans,
      hint: "Sommez sur l'état intermédiaire $X_1$ : chaque chemin a pour probabilité le produit de ses deux transitions.",
      solution: [
        `P(X_2 = ${j + 1} \\mid X_0 = ${i + 1}) = \\sum_k P(${i + 1}, k)\\,P(k, ${j + 1})`,
        `= ${terms.map(([a, b]) => `${dec(10 * a)} \\times ${dec(10 * b)}`).join(" + ")} = ${ans}`,
      ],
    };
  }
  const A = randomMatrix();
  const i = randInt(0, 2);
  const j = randInt(0, 2);
  const terms = [0, 1, 2].map((k) => [A[i][k], A[k][j]]);
  const ans = fracTex(terms.reduce((s, [a, b]) => s + a * b, 0), 16);
  return {
    intro: "Une chaîne à trois états, 1, 2 et 3, a la matrice de transition ci-dessous. Calcule la probabilité d'être en $j$ deux pas après être parti de $i$.",
    promptTex: `${matTex(A, 4)} \\qquad P(X_2 = ${j + 1} \\mid X_0 = ${i + 1}) = \\ ?`,
    answerTex: ans,
    hint: "C'est le coefficient $(i, j)$ de $P^2$ : la ligne $i$ de $P$ scalaire la colonne $j$.",
    solution: [
      `(P^2)_{${i + 1}${j + 1}} = \\sum_k P(${i + 1}, k)\\,P(k, ${j + 1})`,
      `= ${terms.map(([a, b]) => `${fracTex(a, 4)} \\cdot ${fracTex(b, 4)}`).join(" + ")} = ${ans}`,
    ],
  };
}

// Initial laws over 3 states, as numerators over 4.
const LAWS = [
  [1, 1, 2],
  [1, 2, 1],
  [2, 1, 1],
  [2, 2, 0],
  [0, 2, 2],
  [2, 0, 2],
  [3, 1, 0],
  [0, 1, 3],
  [1, 0, 3],
];

// Law after one step: (uP)_j = sum_i u_i P(i, j) (Levin and Peres, equation 1.6; Bishop, equation 11.38).
function loi(): Exercise {
  const A = randomMatrix();
  const u = pick(LAWS);
  const j = randInt(0, 2);
  const terms = [0, 1, 2].map((i) => [u[i], A[i][j]]);
  const ans = fracTex(terms.reduce((s, [a, b]) => s + a * b, 0), 16);
  return {
    intro: "L'état $X_0$ est tiré selon la loi $u$, puis la chaîne fait un pas avec la matrice $P$. Calcule $P(X_1 = j)$.",
    promptTex: `u = (${u.map((a) => fracTex(a, 4)).join(",\\ ")}) \\qquad ${matTex(A, 4)} \\qquad P(X_1 = ${j + 1}) = \\ ?`,
    answerTex: ans,
    hint: "$P(X_1 = j) = (uP)_j$ : le vecteur ligne $u$ scalaire la colonne $j$ de $P$.",
    solution: [
      `P(X_1 = ${j + 1}) = \\sum_i u_i\\,P(i, ${j + 1})`,
      `= ${terms.map(([a, b]) => `${fracTex(a, 4)} \\cdot ${fracTex(b, 4)}`).join(" + ")} = ${ans}`,
    ],
  };
}

// Probability of a path: u(x0) P(x0, x1) ... P(x_{n-1}, x_n).
function trajectoire(): Exercise {
  const A = randomMatrix();
  const u = pick(LAWS.filter((l) => l.every((a) => a > 0)));
  const len = randInt(2, 3); // number of steps
  const path = [randInt(0, 2)];
  // A path through a forbidden transition (probability 0) in 10 % of cases only.
  const blocked = Math.random() < 0.1;
  for (let t = 0; t < len; t++) {
    const row = A[path[t]];
    const allowed = [0, 1, 2].filter((k) => row[k] > 0);
    path.push(pick(allowed));
  }
  if (blocked) {
    const t = randInt(0, len - 1);
    const zeros = [0, 1, 2].filter((k) => A[path[t]][k] === 0);
    // Every row of ROWS has at most one zero; rows without one keep the path allowed.
    if (zeros.length > 0) path[t + 1] = zeros[0];
  }
  const factors = [fracTex(u[path[0]], 4), ...path.slice(1).map((y, t) => fracTex(A[path[t]][y], 4))];
  const num = u[path[0]] * path.slice(1).reduce((s, y, t) => s * A[path[t]][y], 1);
  const ans = fracTex(num, 4 ** (len + 1));
  const names = path.map((x) => x + 1).join(", ");
  return {
    intro: "L'état $X_0$ suit la loi $u$, et la chaîne évolue avec la matrice $P$. Calcule la probabilité que la chaîne suive exactement la trajectoire indiquée.",
    promptTex: `\\begin{gathered} u = (${u.map((a) => fracTex(a, 4)).join(",\\ ")}) \\qquad ${matTex(A, 4)} \\\\ P\\big((X_0, \\dots, X_${len}) = (${names})\\big) = \\ ? \\end{gathered}`,
    answerTex: ans,
    hint: "Multipliez la probabilité de l'état de départ par les probabilités de chaque transition.",
    solution: [`u(${path[0] + 1})${path.slice(1).map((y, t) => `\\,P(${path[t] + 1}, ${y + 1})`).join("")} = ${factors.join(" \\cdot ")} = ${ans}`],
  };
}

const WORDS: [string, string][] = [
  ["le", "chat"],
  ["la", "maison"],
  ["je", "suis"],
  ["il", "fait"],
  ["the", "cat"],
  ["I", "am"],
  ["de", "la"],
  ["un", "peu"],
];

// Bigram model (Jurafsky and Martin, equations 3.9 and 3.11): count ratio, or probability of a sentence.
function bigramme(): Exercise {
  if (Math.random() < 0.5) {
    const [a, b] = pick(WORDS);
    const ca = pick([20, 40, 50, 60, 80, 120, 200, 300]);
    const cab = pick([2, 3, 4, 5, 6, 10, 12, 15].filter((c) => c < ca));
    const ans = fracTex(cab, ca);
    return {
      intro: `Dans un corpus, le mot « ${a} » apparaît ${ca} fois comme premier mot d'une paire, et la paire « ${a} ${b} » ${cab} fois. Estime $P(\\text{${b}} \\mid \\text{${a}})$ par comptage, sous forme de fraction.`,
      promptTex: `C(\\text{${a}}) = ${ca} \\qquad C(\\text{${a} ${b}}) = ${cab} \\qquad P(\\text{${b}} \\mid \\text{${a}}) = \\ ?`,
      answerTex: ans,
      hint: "L'estimation par maximum de vraisemblance divise le nombre de paires par le nombre d'apparitions du premier mot.",
      solution: [`P(\\text{${b}} \\mid \\text{${a}}) = \\frac{C(\\text{${a} ${b}})}{C(\\text{${a}})} = \\frac{${cab}}{${ca}} = ${ans}`],
    };
  }
  // Sentence <s> w1 w2 </s> with given bigram probabilities.
  const s = pick([
    ["je", "dors"],
    ["il", "pleut"],
    ["Sam", "rit"],
    ["on", "joue"],
  ]);
  const words = ["<s>", ...s, "</s>"];
  const probs = [0, 1, 2].map(() => pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5]] as [number, number][]));
  const ans = fracTex(
    probs.reduce((x, [n]) => x * n, 1),
    probs.reduce((x, [, d]) => x * d, 1),
  );
  const t = (w: string) => (w.startsWith("<") ? `\\texttt{${w}}` : `\\text{${w}}`);
  const given = probs.map(([n, d], k) => `P(${t(words[k + 1])} \\mid ${t(words[k])}) = ${fracTex(n, d)}`);
  return {
    intro: "Un modèle bigramme a les probabilités de transition ci-dessous. Calcule la probabilité qu'il donne à la phrase complète, symboles de début et de fin compris.",
    promptTex: `\\begin{gathered} ${given.join(" \\qquad ")} \\\\ P(${words.map(t).join("\\ ")}) = \\ ? \\end{gathered}`,
    answerTex: ans,
    hint: "La probabilité d'une phrase est le produit des probabilités de transition, comme pour une trajectoire.",
    solution: [`P = ${probs.map(([n, d]) => fracTex(n, d)).join(" \\cdot ")} = ${ans}`],
  };
}

export const chainesMarkovGenerators: ExerciseGenerator[] = [
  { id: "mk-deux-pas", make: deuxPas },
  { id: "mk-loi", make: loi },
  { id: "mk-trajectoire", make: trajectoire },
  { id: "mk-bigramme", make: bigramme },
];
