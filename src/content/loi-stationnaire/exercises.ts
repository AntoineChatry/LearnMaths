import { fracTex, pick, randInt } from "../../lib/random";
import type { Exercise, ExerciseGenerator } from "../types";

const dec1 = (tenths: number) => (tenths === 10 ? "1" : `0{,}${tenths}`);

// Two-state chain (Levin and Peres, example 1.1): pi(1) = q / (p + q), or the mean return time (p + q) / q.
function deuxEtats(): Exercise {
  const p = randInt(1, 9);
  const q = randInt(1, 9);
  const i = randInt(1, 2);
  const num = i === 1 ? q : p; // pi(1) = q / (p + q), pi(2) = p / (p + q)
  const P = `P = \\begin{pmatrix} ${dec1(10 - p)} & ${dec1(p)} \\\\ ${dec1(q)} & ${dec1(10 - q)} \\end{pmatrix}`;
  const piTex = fracTex(num, p + q);
  if (Math.random() < 0.6) {
    return {
      intro: "Une chaîne à deux états, 1 et 2, a la matrice de transition ci-dessous. Calcule sa loi stationnaire en l'état demandé, sous forme de fraction.",
      promptTex: `${P} \\qquad \\pi(${i}) = \\ ?`,
      answerTex: piTex,
      hint: "Écrivez $\\pi = \\pi P$ pour la première coordonnée : $\\pi(1)\\,p = \\pi(2)\\,q$, où $p = P(1, 2)$ et $q = P(2, 1)$, avec $\\pi(1) + \\pi(2) = 1$.",
      solution: [
        `\\pi(1)\\,P(1, 2) = \\pi(2)\\,P(2, 1) \\quad\\Rightarrow\\quad \\pi(1) = \\frac{P(2, 1)}{P(1, 2) + P(2, 1)}`,
        `\\pi(${i}) = \\frac{${dec1(num)}}{${dec1(p)} + ${dec1(q)}} = ${piTex}`,
      ],
    };
  }
  const ans = fracTex(p + q, num);
  return {
    intro: "Une chaîne à deux états, 1 et 2, a la matrice de transition ci-dessous. En partant de l'état demandé, combien de pas faut-il en moyenne pour y revenir ? Forme exacte.",
    promptTex: `${P} \\qquad \\mathbb E_{${i}}(\\text{retour en } ${i}) = \\ ?`,
    answerTex: ans,
    hint: "Le temps moyen de retour en $x$ vaut $1/\\pi(x)$.",
    solution: [`\\pi(${i}) = ${piTex} \\qquad \\mathbb E_{${i}}(\\text{retour}) = \\frac{1}{\\pi(${i})} = ${ans}`],
  };
}

// Three-state birth-death chain with quarters: the flows across each cut balance, pi1 P(1,2) = pi2 P(2,1), etc.
function troisEtats(): Exercise {
  const a = randInt(0, 3); // P(1,1); P(1,2) = 4 - a
  const b = randInt(1, 3); // P(2,1)
  const c = randInt(0, 3 - b); // P(2,2); P(2,3) = 4 - b - c >= 1
  const d = randInt(1, 4); // P(3,2); P(3,3) = 4 - d
  const A = [
    [a, 4 - a, 0],
    [b, c, 4 - b - c],
    [0, d, 4 - d],
  ];
  const w = [b * d, (4 - a) * d, (4 - a) * (4 - b - c)];
  const S = w[0] + w[1] + w[2];
  const k = randInt(1, 3);
  const ans = fracTex(w[k - 1], S);
  const f = (n: number) => fracTex(n, 4);
  return {
    intro: "Cette chaîne ne saute qu'entre états voisins. Calcule sa loi stationnaire en l'état demandé.",
    promptTex: `P = \\begin{pmatrix} ${A.map((r) => r.map(f).join(" & ")).join(" \\\\ ")} \\end{pmatrix} \\qquad \\pi(${k}) = \\ ?`,
    answerTex: ans,
    hint: "La première équation de $\\pi = \\pi P$ donne $\\pi(1)\\,P(1, 2) = \\pi(2)\\,P(2, 1)$, la dernière $\\pi(2)\\,P(2, 3) = \\pi(3)\\,P(3, 2)$. Exprimez tout en fonction de $\\pi(1)$, puis normalisez.",
    solution: [
      `\\pi(2) = \\pi(1)\\,\\frac{P(1, 2)}{P(2, 1)} = \\pi(1)\\,\\frac{${f(4 - a)}}{${f(b)}} \\qquad \\pi(3) = \\pi(2)\\,\\frac{P(2, 3)}{P(3, 2)} = \\pi(2)\\,\\frac{${f(4 - b - c)}}{${f(d)}}`,
      `\\pi \\propto (${w.join(",\\ ")}) \\qquad \\pi(${k}) = \\frac{${w[k - 1]}}{${S}} = ${ans}`,
    ],
  };
}

// Simple random walk on a connected graph (Levin and Peres, example 1.12): pi(v) = deg(v) / 2|E|.
function graphe(): Exercise {
  const n = randInt(4, 5);
  const edges = new Set<string>();
  // A random spanning tree keeps the graph connected, then a few extra edges.
  for (let v = 2; v <= n; v++) edges.add(`${randInt(1, v - 1)}-${v}`);
  const extra = randInt(1, 3);
  for (let t = 0; t < extra; t++) {
    const u = randInt(1, n - 1);
    const v = randInt(u + 1, n);
    edges.add(`${u}-${v}`);
  }
  const list = [...edges].map((e) => e.split("-").map(Number)).sort((x, y) => x[0] - y[0] || x[1] - y[1]);
  const deg = Array.from({ length: n + 1 }, (_, v) => list.filter(([x, y]) => x === v || y === v).length);
  const m = list.length;
  const v = randInt(1, n);
  const edgesTex = list.map(([x, y]) => `\\{${x}, ${y}\\}`).join(",\\ ");
  const intro = `On marche au hasard sur le graphe à ${n} sommets dont les arêtes sont listées : à chaque pas, on va vers un voisin choisi uniformément.`;
  if (Math.random() < 0.6) {
    const ans = fracTex(deg[v], 2 * m);
    return {
      intro: `${intro} Calcule la loi stationnaire au sommet demandé.`,
      promptTex: `\\begin{gathered} E = \\{${edgesTex}\\} \\\\ \\pi(${v}) = \\ ? \\end{gathered}`,
      answerTex: ans,
      hint: "La loi stationnaire est proportionnelle aux degrés : $\\pi(v) = \\deg(v) / 2|E|$.",
      solution: [`\\deg(${v}) = ${deg[v]} \\qquad |E| = ${m} \\qquad \\pi(${v}) = \\frac{${deg[v]}}{2 \\times ${m}} = ${ans}`],
    };
  }
  const ans = fracTex(2 * m, deg[v]);
  return {
    intro: `${intro} En partant du sommet demandé, combien de pas faut-il en moyenne pour y revenir ?`,
    promptTex: `\\begin{gathered} E = \\{${edgesTex}\\} \\\\ \\mathbb E_{${v}}(\\text{retour en } ${v}) = \\ ? \\end{gathered}`,
    answerTex: ans,
    hint: "Temps moyen de retour $= 1/\\pi(v)$, et $\\pi(v) = \\deg(v)/2|E|$.",
    solution: [`\\pi(${v}) = \\frac{${deg[v]}}{${2 * m}} \\qquad \\mathbb E_{${v}}(\\text{retour}) = \\frac{2|E|}{\\deg(${v})} = ${ans}`],
  };
}

// PageRank transition (Manning et al., section 21.2.1): P(i, j) = (1 - alpha) A_ij / out(i) + alpha / N.
function pagerank(): Exercise {
  const [aTex, an, ad] = pick([
    ["0{,}1", 1, 10],
    ["0{,}15", 3, 20],
    ["0{,}2", 1, 5],
    ["0{,}5", 1, 2],
  ] as [string, number, number][]);
  const N = pick([4, 5, 6, 8, 10]);
  const k = randInt(1, Math.min(4, N - 1));
  const linked = Math.random() < 0.7;
  // (1 - a) / k + a / N with a = an / ad, over the common denominator ad k N.
  const num = linked ? (ad - an) * N + an * k : an * k;
  const ans = fracTex(num, ad * k * N);
  return {
    intro: `Dans le modèle de Manning et al., l'internaute suit un lien sortant au hasard avec probabilité $1 - \\alpha$, et se téléporte vers l'une des $N$ pages avec probabilité $\\alpha$. La page $i$ a $k$ liens sortants, ${linked ? "dont un vers" : "aucun vers"} la page $j$. Calcule $P(i, j)$.`,
    promptTex: `N = ${N} \\qquad \\alpha = ${aTex} \\qquad k = ${k} \\qquad i \\${linked ? "to" : "not\\to"} j \\qquad P(i, j) = \\ ?`,
    answerTex: ans,
    hint: "$P(i, j) = (1 - \\alpha)\\,\\frac{A_{ij}}{k} + \\frac{\\alpha}{N}$, avec $A_{ij} = 1$ s'il y a un lien de $i$ vers $j$, et $k$ le nombre de liens sortants de $i$.",
    solution: linked
      ? [`P(i, j) = \\frac{1 - ${aTex}}{${k}} + \\frac{${aTex}}{${N}} = ${ans}`]
      : [`P(i, j) = 0 + \\frac{${aTex}}{${N}} = ${ans}`],
  };
}

export const loiStationnaireGenerators: ExerciseGenerator[] = [
  { id: "ls-deux-etats", make: deuxEtats },
  { id: "ls-trois-etats", make: troisEtats },
  { id: "ls-graphe", make: graphe },
  { id: "ls-pagerank", make: pagerank },
];
