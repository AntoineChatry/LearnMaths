import { fracTex, pick, randInt } from "../../lib/random";
import { dyadicDepths, shuffle } from "../entropie/exercises";
import type { Exercise, ExerciseGenerator } from "../types";

// Joint table p(x, y) as a KaTeX array: rows x, columns y; probabilities given as 2^{-d} (null for 0).
function tableTex(d: (number | null)[][]): string {
  const cols = d[0].length;
  const head = Array.from({ length: cols }, (_, j) => `y_${j + 1}`).join(" & ");
  const rows = d.map((row, i) => `x_${i + 1} & ${row.map((v) => (v === null ? "0" : fracTex(1, 2 ** v))).join(" & ")}`);
  return `\\begin{array}{c|${"c".repeat(cols)}} & ${head} \\\\ \\hline ${rows.join(" \\\\ ")} \\end{array}`;
}

// Entropy of a dyadic law given by its depths, over the common denominator 2^D: returns [numerator, 2^D].
function dyadicEntropy(depths: number[], D: number): number {
  return depths.reduce((s, di) => s + di * 2 ** (D - di), 0);
}

// Conditional or joint entropy of a table built as p(x) p(y | x), both dyadic.
function conditionnelle(): Exercise {
  const Kx = randInt(2, 3);
  const Ky = randInt(2, 4);
  const dx = dyadicDepths(Kx);
  // Each row: a dyadic law on a random subset of the Ky columns (at least one column).
  let rows: { dyx: number[]; full: (number | null)[] }[];
  do
    rows = dx.map(() => {
      const k = randInt(1, Ky);
      const dyx = dyadicDepths(k);
      const cols = shuffle(Array.from({ length: Ky }, (_, j) => j)).slice(0, k);
      const full: (number | null)[] = Array(Ky).fill(null);
      cols.forEach((c, i) => (full[c] = dyx[i]));
      return { dyx, full };
    });
  while (Array.from({ length: Ky }, (_, j) => j).some((j) => rows.every((r) => r.full[j] === null))); // no empty column
  const table = rows.map((r, i) => r.full.map((v) => (v === null ? null : v + dx[i])));
  const D = 10;
  // H(Y | X) = sum_x p(x) H(Y | x), all over 2^D
  const condNum = rows.reduce((s, r, i) => s + 2 ** (D - dx[i]) * (dyadicEntropy(r.dyx, D) / 2 ** D), 0);
  const hx = dyadicEntropy(dx, D);
  const joint = Math.random() < 0.4;
  const num = joint ? hx + condNum : condNum;
  const ans = fracTex(num, 2 ** D);
  const hRows = rows.map((r) => fracTex(dyadicEntropy(r.dyx, D), 2 ** D));
  return {
    intro: joint
      ? "Voici la loi jointe de deux variables $X$ et $Y$. Calcule l'entropie jointe $H(X, Y)$, en bits, sous forme de fraction exacte."
      : "Voici la loi jointe de deux variables $X$ et $Y$. Calcule l'entropie conditionnelle $H(Y \\mid X)$, en bits, sous forme de fraction exacte.",
    promptTex: tableTex(table),
    answerTex: ans,
    hint: joint
      ? "Directement, $H(X, Y) = \\sum p(x, y) \\log_2 \\frac{1}{p(x, y)}$ ; ou par la règle de la chaîne, $H(X) + H(Y \\mid X)$."
      : "Pour chaque ligne, divise par $p(x)$ pour obtenir la loi de $Y$ sachant $x$, prends son entropie, puis la moyenne pondérée par $p(x)$.",
    solution: [
      `p(x) = (${dx.map((v) => fracTex(1, 2 ** v)).join(",\\ ")}) \\qquad H(Y \\mid x) = (${hRows.join(",\\ ")})`,
      `H(Y \\mid X) = ${dx.map((v, i) => `${fracTex(1, 2 ** v)} \\times ${hRows[i]}`).join(" + ")} = ${fracTex(condNum, 2 ** D)}`,
      ...(joint ? [`H(X, Y) = H(X) + H(Y \\mid X) = ${fracTex(hx, 2 ** D)} + ${fracTex(condNum, 2 ** D)} = ${ans}`] : []),
    ],
  };
}

// Mutual information: a symmetric channel (rows are shifts of one dyadic law), an independent table, or the identities.
function mutuelle(): Exercise {
  const r = Math.random();
  const kind = r < 0.45 ? 0 : r < 0.6 ? 1 : 2; // independent tables (answer 0) stay a minority
  if (kind === 0) {
    const K = pick([4, 8]);
    const lk = Math.log2(K);
    let d: number[];
    do d = dyadicDepths(K);
    while (d.every((v) => v === lk)); // a uniform row would make I = 0 every time
    const lx = Math.log2(K);
    // p(x) = 1/K, p(y | x) = the law d shifted by x: Y is uniform, H(Y) = log2 K, H(Y | X) = H(d).
    const table = Array.from({ length: K }, (_, x) => Array.from({ length: K }, (_, y) => d[(y - x + K) % K] + lx));
    const D = 10;
    const hd = dyadicEntropy(d, D);
    const num = lx * 2 ** D - hd;
    const ans = fracTex(num, 2 ** D);
    return {
      intro: "Voici la loi jointe de deux variables $X$ et $Y$. Calcule l'information mutuelle $I(X ; Y)$, en bits, sous forme de fraction exacte.",
      promptTex: tableTex(table),
      answerTex: ans,
      hint: "Calcule les marges : ici $Y$ est uniforme. Puis $I(X ; Y) = H(Y) - H(Y \\mid X)$, et chaque ligne a la même entropie.",
      solution: [
        `p(y) = (${Array(K).fill(fracTex(1, K)).join(",\\ ")}) \\qquad H(Y) = ${lx}`,
        `H(Y \\mid X) = H(${d.map((v) => fracTex(1, 2 ** v)).join(",\\ ")}) = ${fracTex(hd, 2 ** D)}`,
        `I(X ; Y) = ${lx} - ${fracTex(hd, 2 ** D)} = ${ans} \\text{ bits}`,
      ],
    };
  }
  if (kind === 1) {
    const dx = dyadicDepths(randInt(2, 3));
    const dy = dyadicDepths(randInt(2, 3));
    return {
      intro: "Voici la loi jointe de deux variables $X$ et $Y$. Calcule l'information mutuelle $I(X ; Y)$, en bits.",
      promptTex: tableTex(dx.map((a) => dy.map((b) => a + b))),
      answerTex: "0",
      hint: "Compare chaque case au produit des marges $p(x)\\, p(y)$.",
      solution: [
        `p(x) = (${dx.map((v) => fracTex(1, 2 ** v)).join(",\\ ")}) \\qquad p(y) = (${dy.map((v) => fracTex(1, 2 ** v)).join(",\\ ")})`,
        `p(x, y) = p(x)\\, p(y) \\text{ partout : indépendance, donc } I(X ; Y) = 0`,
      ],
    };
  }
  // Identities: from three of H(X), H(Y), H(X, Y), give I or a conditional entropy, all in eighths.
  const hx = randInt(4, 24);
  const hy = randInt(4, 24);
  const i = randInt(1, Math.min(hx, hy));
  const hxy = hx + hy - i;
  const ask = pick(["I", "HXsY", "HYsX"]);
  const ans = ask === "I" ? fracTex(i, 8) : ask === "HXsY" ? fracTex(hx - i, 8) : fracTex(hy - i, 8);
  const target = ask === "I" ? "I(X ; Y)" : ask === "HXsY" ? "H(X \\mid Y)" : "H(Y \\mid X)";
  return {
    intro: `On connaît les entropies ci-dessous, en bits. Donne $${target}$.`,
    promptTex: `H(X) = ${fracTex(hx, 8)} \\qquad H(Y) = ${fracTex(hy, 8)} \\qquad H(X, Y) = ${fracTex(hxy, 8)} \\qquad ${target}`,
    answerTex: ans,
    hint: "$I(X ; Y) = H(X) + H(Y) - H(X, Y)$, et la règle de la chaîne $H(X, Y) = H(Y) + H(X \\mid Y)$.",
    solution:
      ask === "I"
        ? [`I(X ; Y) = ${fracTex(hx, 8)} + ${fracTex(hy, 8)} - ${fracTex(hxy, 8)} = ${ans}`]
        : ask === "HXsY"
          ? [`H(X \\mid Y) = H(X, Y) - H(Y) = ${fracTex(hxy, 8)} - ${fracTex(hy, 8)} = ${ans}`]
          : [`H(Y \\mid X) = H(X, Y) - H(X) = ${fracTex(hxy, 8)} - ${fracTex(hx, 8)} = ${ans}`],
  };
}

// Information gain of a split, on a balanced node, with children either pure or balanced.
function gainInfo(): Exercise {
  const k = randInt(2, 4); // number of children
  let children: [number, number][];
  do {
    children = Array.from({ length: k }, () => {
      const t = randInt(0, 2);
      const n = randInt(1, 6);
      return t === 0 ? [n, 0] : t === 1 ? [0, n] : [n, n];
    });
  } while (
    children.reduce((s, c) => s + c[0], 0) !== children.reduce((s, c) => s + c[1], 0) ||
    children.every((c) => c[0] === c[1])
  );
  const N = children.reduce((s, c) => s + c[0] + c[1], 0);
  const mixed = children.filter((c) => c[0] === c[1]).reduce((s, c) => s + 2 * c[0], 0);
  const ans = fracTex(N - mixed, N);
  const names = ["a", "b", "c", "d"];
  return {
    intro: `Un nœud d'arbre de décision contient ${N} exemples, autant de chaque classe. Un attribut les répartit en ${k} branches, avec les effectifs (classe P, classe N) ci-dessous. Calcule le gain d'information de cet attribut, en bits.`,
    promptTex: children.map((c, i) => `${names[i]} : (${c[0]}, ${c[1]})`).join(" \\qquad "),
    answerTex: ans,
    hint: "Le nœud a une entropie de 1 bit. Une branche pure a une entropie nulle, une branche moitié-moitié 1 bit ; pondère par la part des exemples dans chaque branche.",
    solution: [
      `H(C) = 1 \\qquad H(C \\mid A) = ${children.map((c) => `\\frac{${c[0] + c[1]}}{${N}} \\times ${c[0] === c[1] ? 1 : 0}`).join(" + ")} = ${fracTex(mixed, N)}`,
      `\\mathrm{gain}(A) = 1 - ${fracTex(mixed, N)} = ${ans} \\text{ bit}`,
    ],
  };
}

// Data processing: X uniform on m bits, a function of X keeps some of them; information about X, or about one bit.
function traitement(): Exercise {
  const m = randInt(3, 6);
  const j = randInt(1, m - 1);
  const shift = Math.random() < 0.5; // floor(X / 2^j) keeps the high bits, X mod 2^j the low ones
  const g = shift ? `\\left\\lfloor X / ${2 ** j} \\right\\rfloor` : `X \\bmod ${2 ** j}`;
  const kept = shift ? m - j : j;
  if (Math.random() < 0.5)
    return {
      intro: `$X$ est uniforme sur les entiers de $0$ à $${2 ** m - 1}$. Quelle information, en bits, la variable ci-dessous contient-elle sur $X$ ?`,
      promptTex: `I\\big(X ; ${g}\\big)`,
      answerTex: String(kept),
      hint: "Pour une fonction de $X$, $I(X ; g(X)) = H(g(X)) - H(g(X) \\mid X) = H(g(X))$ : compte les valeurs équiprobables qu'elle peut prendre.",
      solution: [`${g} \\text{ est uniforme sur } ${2 ** kept} \\text{ valeurs : } I = H = \\log_2 ${2 ** kept} = ${kept}`],
    };
  const b = randInt(0, m - 1); // the label is bit b of X
  const keeps = shift ? b >= j : b < j;
  return {
    intro: `$X$ est uniforme sur les entiers de $0$ à $${2 ** m - 1}$, et l'étiquette $C$ est le bit de poids $2^{${b}}$ de $X$. Quelle information, en bits, la représentation ci-dessous garde-t-elle sur $C$ ?`,
    promptTex: `I\\big(C ; ${g}\\big)`,
    answerTex: keeps ? "1" : "0",
    hint: `${shift ? `Diviser par $${2 ** j}$ jette les ${j} bits de poids faible` : `Le reste modulo $${2 ** j}$ garde les ${j} bits de poids faible`} ; le bit de l'étiquette survit-il ?`,
    solution: [
      keeps
        ? `\\text{le bit } 2^{${b}} \\text{ est conservé : } C \\text{ se lit dans } ${g}, \\text{ donc } I = H(C) = 1`
        : `\\text{le bit } 2^{${b}} \\text{ est perdu : } ${g} \\text{ est indépendant de } C, \\text{ donc } I = 0`,
    ],
  };
}

export const informationMutuelleGenerators: ExerciseGenerator[] = [
  { id: "im-conditionnelle", make: conditionnelle },
  { id: "im-mutuelle", make: mutuelle },
  { id: "im-gain", make: gainInfo },
  { id: "im-traitement", make: traitement },
];
