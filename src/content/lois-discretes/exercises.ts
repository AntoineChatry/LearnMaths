import { fracTex, pick, randInt } from "../../lib/random";
import type { Exercise, ExerciseGenerator } from "../types";

function comb(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return Math.round(r);
}

function factorial(n: number): number {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

const fr = (x: number) => String(x).replace(".", "{,}");

// Law of a function of two dice, by counting the 36 equally likely outcomes.
function diceLaw(): Exercise {
  const pairs: [number, number][] = [];
  for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) pairs.push([a, b]);
  const kind = randInt(0, 3);
  let intro: string;
  let prompt: string;
  let event: (p: [number, number]) => boolean;
  let hint: string;
  if (kind === 0) {
    const s = randInt(2, 12);
    intro = "On lance deux dés équilibrés et $S$ est leur somme. Donne $P(S = s)$.";
    prompt = `s = ${s}`;
    event = ([a, b]) => a + b === s;
    hint = "Compte les couples $(a, b)$ parmi les 36 dont la somme vaut $s$.";
  } else if (kind === 1) {
    const m = randInt(1, 6);
    intro = "On lance deux dés équilibrés et $M$ est le plus grand des deux résultats. Donne $P(M = m)$.";
    prompt = `m = ${m}`;
    event = ([a, b]) => Math.max(a, b) === m;
    hint = "$M = m$ : un dé vaut $m$ et l'autre au plus $m$. Compte les couples, sans compter $(m, m)$ deux fois.";
  } else if (kind === 2) {
    const d = randInt(0, 5);
    intro = "On lance deux dés équilibrés et $D$ est l'écart entre les deux résultats, $D = |a - b|$. Donne $P(D = d)$.";
    prompt = `d = ${d}`;
    event = ([a, b]) => Math.abs(a - b) === d;
    hint = "Compte les couples $(a, b)$ tels que $|a - b| = d$ : chaque paire de valeurs distinctes compte deux fois, dans les deux ordres.";
  } else {
    const s = randInt(3, 11);
    intro = "On lance deux dés équilibrés et $S$ est leur somme. Donne la valeur de sa fonction de répartition en $s$.";
    prompt = `F_S(${s}) = P(S \\le ${s})`;
    event = ([a, b]) => a + b <= s;
    hint = "Additionne les $P(S = t)$ pour $t \\le s$, ou compte directement les couples de somme au plus $s$.";
  }
  const n = pairs.filter(event).length;
  return {
    intro,
    promptTex: prompt,
    answerTex: fracTex(n, 36),
    hint,
    solution: [`${n} \\text{ couples sur } 36`, `${fracTex(n, 36)}`],
  };
}

// A probability mass function given as a table: cumulative distribution function, interval, missing value.
function cdfTable(): Exercise {
  const den = pick([6, 8, 10, 12]);
  const start = randInt(0, 1);
  const xs = [start, start + 1, start + 2, start + 3];
  // Four positive numerators that add up to den.
  const cuts = new Set<number>();
  while (cuts.size < 3) cuts.add(randInt(1, den - 1));
  const c = [0, ...[...cuts].sort((a, b) => a - b), den];
  const nums = xs.map((_, i) => c[i + 1] - c[i]);
  const kind = randInt(0, 2);
  const missing = kind === 2 ? randInt(0, 3) : -1;
  const cells = nums.map((k, i) => (i === missing ? "c" : fracTex(k, den)));
  const table = `\\begin{array}{c|cccc} x & ${xs.join(" & ")} \\\\ \\hline P(X = x) & ${cells.join(" & ")} \\end{array}`;
  if (kind === 0) {
    const i = randInt(0, 2);
    const x = xs[i] + 0.5;
    const num = nums.slice(0, i + 1).reduce((a, b) => a + b, 0);
    return {
      intro: "Voici la loi d'une variable aléatoire $X$. Donne la valeur demandée de sa fonction de répartition.",
      promptTex: `${table} \\qquad F_X(${fr(x)})`,
      answerTex: fracTex(num, den),
      hint: "$F_X(x) = P(X \\le x)$ : additionne les probabilités des valeurs inférieures ou égales à $x$, même si $x$ n'est pas une valeur de $X$.",
      solution: [`F_X(${fr(x)}) = P(X \\le ${xs[i]}) = ${nums.slice(0, i + 1).map((k) => fracTex(k, den)).join(" + ")} = ${fracTex(num, den)}`],
    };
  }
  if (kind === 1) {
    const i = randInt(0, 2);
    const j = randInt(i + 1, 3);
    const num = nums.slice(i + 1, j + 1).reduce((a, b) => a + b, 0);
    return {
      intro: "Voici la loi d'une variable aléatoire $X$. Donne la probabilité demandée.",
      promptTex: `${table} \\qquad P(${xs[i]} < X \\le ${xs[j]})`,
      answerTex: fracTex(num, den),
      hint: "$P(a < X \\le b) = F_X(b) - F_X(a)$ : la borne de gauche est exclue, celle de droite incluse.",
      solution: [`P(${xs[i]} < X \\le ${xs[j]}) = ${nums.slice(i + 1, j + 1).map((k) => fracTex(k, den)).join(" + ")} = ${fracTex(num, den)}`],
    };
  }
  return {
    intro: "Voici la loi d'une variable aléatoire $X$, dont une probabilité est inconnue. Donne $c$.",
    promptTex: table,
    answerTex: fracTex(nums[missing], den),
    hint: "Une fonction de masse a une somme égale à 1.",
    solution: [`c = 1 - (${nums.filter((_, i) => i !== missing).map((k) => fracTex(k, den)).join(" + ")}) = ${fracTex(nums[missing], den)}`],
  };
}

const PROBS: [number, number][] = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [1, 6]];

// Binomial law: exactly k successes, at least one, at most one.
function binomial(): Exercise {
  const [a, d] = pick(PROBS);
  const n = randInt(2, 6);
  const b = d - a;
  const pTex = fracTex(a, d);
  const qTex = fracTex(b, d);
  const given = `X \\sim \\text{Bin}(n, p) \\qquad n = ${n} \\qquad p = ${pTex}`;
  const kind = randInt(0, 2);
  if (kind === 0) {
    const k = randInt(0, n);
    const num = comb(n, k) * a ** k * b ** (n - k);
    return {
      intro: "Donne $P(X = k)$.",
      promptTex: `${given} \\qquad k = ${k}`,
      answerTex: fracTex(num, d ** n),
      hint: "$P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}$.",
      solution: [`\\binom{${n}}{${k}} \\left(${pTex}\\right)^{${k}} \\left(${qTex}\\right)^{${n - k}} = ${comb(n, k)} \\times \\frac{${a ** k * b ** (n - k)}}{${d ** n}} = ${fracTex(num, d ** n)}`],
    };
  }
  if (kind === 1)
    return {
      intro: "Donne la probabilité d'au moins un succès, $P(X \\ge 1)$.",
      promptTex: given,
      answerTex: fracTex(d ** n - b ** n, d ** n),
      hint: "Passe au complémentaire : $P(X \\ge 1) = 1 - P(X = 0)$.",
      solution: [`1 - \\left(${qTex}\\right)^{${n}} = 1 - \\frac{${b ** n}}{${d ** n}} = ${fracTex(d ** n - b ** n, d ** n)}`],
    };
  const num = b ** n + n * a * b ** (n - 1);
  return {
    intro: "Donne la probabilité d'au plus un succès, $P(X \\le 1)$.",
    promptTex: given,
    answerTex: fracTex(num, d ** n),
    hint: "$P(X \\le 1) = P(X = 0) + P(X = 1)$.",
    solution: [`\\left(${qTex}\\right)^{${n}} + ${n} \\times ${pTex} \\times \\left(${qTex}\\right)^{${n - 1}} = \\frac{${b ** n} + ${n * a * b ** (n - 1)}}{${d ** n}} = ${fracTex(num, d ** n)}`],
  };
}

// Hypergeometric law: draws without replacement from an urn or a deck.
function hypergeometric(): Exercise {
  if (Math.random() < 0.35) {
    const n = randInt(2, 4);
    const x = randInt(0, n);
    const num = comb(13, x) * comb(39, n - x);
    const den = comb(52, n);
    return {
      intro: "On tire $n$ cartes sans remise dans un jeu de 52. Quelle est la probabilité d'obtenir exactement $x$ cœurs ?",
      promptTex: `n = ${n} \\qquad x = ${x}`,
      answerTex: fracTex(num, den),
      hint: "Loi hypergéométrique avec $N = 52$ cartes, dont $K = 13$ cœurs.",
      solution: [`\\frac{\\binom{13}{${x}} \\binom{39}{${n - x}}}{\\binom{52}{${n}}} = \\frac{${num}}{${den}} = ${fracTex(num, den)}`],
    };
  }
  const N = randInt(6, 12);
  const K = randInt(2, N - 2);
  const n = randInt(2, Math.min(4, N - 1));
  const x = randInt(Math.max(0, n - (N - K)), Math.min(n, K));
  const num = comb(K, x) * comb(N - K, n - x);
  const den = comb(N, n);
  return {
    intro: "Une urne contient $N$ boules dont $K$ rouges. On en tire $n$ sans remise. Quelle est la probabilité d'obtenir exactement $x$ rouges ?",
    promptTex: `N = ${N} \\qquad K = ${K} \\qquad n = ${n} \\qquad x = ${x}`,
    answerTex: fracTex(num, den),
    hint: "$P(X = x) = \\binom{K}{x}\\binom{N-K}{n-x} / \\binom{N}{n}$ : on choisit les rouges parmi les rouges, les autres parmi les autres.",
    solution: [`\\frac{\\binom{${K}}{${x}} \\binom{${N - K}}{${n - x}}}{\\binom{${N}}{${n}}} = \\frac{${num}}{${den}} = ${fracTex(num, den)}`],
  };
}

// Geometric law (rank of the first success, from 1): point mass, tail, memorylessness.
function geometric(): Exercise {
  const [a, d] = pick(PROBS);
  const b = d - a;
  const pTex = fracTex(a, d);
  const qTex = fracTex(b, d);
  const given = `P(\\text{succès}) = ${pTex}`;
  const intro = "On répète des essais indépendants jusqu'au premier succès, et $T$ est le rang de ce succès ($T \\ge 1$).";
  const kind = randInt(0, 3);
  if (kind === 0) {
    const n = randInt(1, 5);
    return {
      intro: `${intro} Donne $P(T = n)$.`,
      promptTex: `${given} \\qquad n = ${n}`,
      answerTex: fracTex(b ** (n - 1) * a, d ** n),
      hint: "$T = n$ : $n - 1$ échecs puis un succès.",
      solution: [`\\left(${qTex}\\right)^{${n - 1}} \\times ${pTex} = ${fracTex(b ** (n - 1) * a, d ** n)}`],
    };
  }
  if (kind === 1) {
    const k = randInt(1, 5);
    return {
      intro: `${intro} Donne $P(T > k)$.`,
      promptTex: `${given} \\qquad k = ${k}`,
      answerTex: fracTex(b ** k, d ** k),
      hint: "$T > k$ signifie que les $k$ premiers essais ont tous échoué.",
      solution: [`P(T > ${k}) = \\left(${qTex}\\right)^{${k}} = ${fracTex(b ** k, d ** k)}`],
    };
  }
  if (kind === 2) {
    const k = randInt(1, 5);
    return {
      intro: `${intro} Donne $P(T \\le k)$, la probabilité d'avoir réussi au plus tard à l'essai $k$.`,
      promptTex: `${given} \\qquad k = ${k}`,
      answerTex: fracTex(d ** k - b ** k, d ** k),
      hint: "Complémentaire : $P(T \\le k) = 1 - P(T > k)$.",
      solution: [`1 - \\left(${qTex}\\right)^{${k}} = ${fracTex(d ** k - b ** k, d ** k)}`],
    };
  }
  const r = randInt(2, 10);
  const s = randInt(1, 3);
  return {
    intro: `${intro} Les $r$ premiers essais ont échoué. Quelle est la probabilité que les $s$ suivants échouent aussi ?`,
    promptTex: `${given} \\qquad P(T > r + s \\mid T > r) \\qquad r = ${r} \\qquad s = ${s}`,
    answerTex: fracTex(b ** s, d ** s),
    hint: "La loi géométrique est sans mémoire : $P(T > r + s \\mid T > r) = P(T > s)$.",
    solution: [`\\frac{(${qTex})^{${r + s}}}{(${qTex})^{${r}}} = \\left(${qTex}\\right)^{${s}} = ${fracTex(b ** s, d ** s)}`],
  };
}

// e^{-λ} times a rational coefficient, written without a coefficient 1.
function expTimes(num: number, den: number, lambda: number): string {
  const c = fracTex(num, den);
  return `${c === "1" ? "" : c}e^{-${lambda}}`;
}

// Poisson law: point mass, at most one, at least one, and the approximation of a binomial.
function poisson(): Exercise {
  const kind = randInt(0, 3);
  if (kind === 3) {
    const lambda = randInt(1, 4);
    const n = pick([1000, 2000, 5000]);
    const k = randInt(0, 3);
    return {
      intro: `Chacun des $n$ utilisateurs d'un service le signale en panne, indépendamment des autres, avec probabilité $p$. Avec l'approximation de Poisson, quelle est la probabilité d'exactement $k$ signalements ?`,
      promptTex: `n = ${n} \\qquad p = ${fr(lambda / n)} \\qquad k = ${k}`,
      answerTex: expTimes(lambda ** k, factorial(k), lambda),
      hint: "$n$ grand et $p$ petit : $\\text{Bin}(n, p)$ est proche de la loi de Poisson de paramètre $\\lambda = np$.",
      solution: [`\\lambda = np = ${lambda}`, `P(X = ${k}) \\approx e^{-${lambda}} \\frac{${lambda}^{${k}}}{${k}!} = ${expTimes(lambda ** k, factorial(k), lambda)}`],
    };
  }
  const lambda = randInt(1, 5);
  const intro = "Le nombre $X$ de requêtes reçues par un serveur en une seconde suit une loi de Poisson de paramètre $\\lambda$.";
  if (kind === 0) {
    const k = randInt(0, 4);
    return {
      intro: `${intro} Donne $P(X = k)$, sous la forme d'un nombre fois $e^{-\\lambda}$.`,
      promptTex: `\\lambda = ${lambda} \\qquad k = ${k}`,
      answerTex: expTimes(lambda ** k, factorial(k), lambda),
      hint: "$P(X = k) = e^{-\\lambda} \\lambda^k / k!$.",
      solution: [`e^{-${lambda}} \\frac{${lambda}^{${k}}}{${k}!} = ${expTimes(lambda ** k, factorial(k), lambda)}`],
    };
  }
  if (kind === 1)
    return {
      intro: `${intro} Donne $P(X \\le 1)$, sous la forme d'un nombre fois $e^{-\\lambda}$.`,
      promptTex: `\\lambda = ${lambda}`,
      answerTex: expTimes(1 + lambda, 1, lambda),
      hint: "$P(X \\le 1) = P(X = 0) + P(X = 1)$.",
      solution: [`e^{-${lambda}} + ${lambda} e^{-${lambda}} = ${expTimes(1 + lambda, 1, lambda)}`],
    };
  return {
    intro: `${intro} Donne la probabilité de recevoir au moins une requête.`,
    promptTex: `\\lambda = ${lambda}`,
    answerTex: `1-e^{-${lambda}}`,
    hint: "Complémentaire : $P(X \\ge 1) = 1 - P(X = 0)$.",
    solution: [`1 - P(X = 0) = 1 - e^{-${lambda}}`],
  };
}

// Softmax with temperature on logits z_i = ln a_i, so that e^{z_i / T} = a_i^{1/T} stays rational.
function softmaxTemperature(): Exercise {
  const t = pick(["1", "1/2", "2"]);
  const pool = t === "1" ? [1, 2, 3, 4, 5, 6] : t === "1/2" ? [1, 2, 3, 4] : [1, 4, 9, 16];
  const a = [pick(pool), pick(pool), pick(pool)];
  const weight = (x: number) => (t === "1" ? x : t === "1/2" ? x * x : Math.round(Math.sqrt(x)));
  const w = a.map(weight);
  const j = randInt(1, 3);
  const total = w[0] + w[1] + w[2];
  const zTex = a.map((x) => (x === 1 ? "0" : `\\ln ${x}`)).join(",\\ ");
  const tTex = t === "1/2" ? "\\frac{1}{2}" : t;
  const power = t === "1" ? "" : t === "1/2" ? "^2" : "^{1/2}";
  return {
    intro: "Un modèle donne les logits $z$ de trois tokens. Avec la température $T$, quelle probabilité le softmax donne-t-il au token numéro $j$ ?",
    promptTex: `z = (${zTex}) \\qquad T = ${tTex} \\qquad j = ${j}`,
    answerTex: fracTex(w[j - 1], total),
    hint: "$p_j = e^{z_j / T} / \\sum_i e^{z_i / T}$, et $e^{\\ln a / T} = a^{1/T}$.",
    solution: [
      `e^{z_i / T} = a_i${power} : \\quad ${w.join(",\\ ")}`,
      `p_{${j}} = \\frac{${w[j - 1]}}{${w.join(" + ")}} = ${fracTex(w[j - 1], total)}`,
    ],
  };
}

export const loisDiscretesGenerators: ExerciseGenerator[] = [
  { id: "loi-des", make: diceLaw },
  { id: "fonction-repartition", make: cdfTable },
  { id: "binomiale", make: binomial },
  { id: "hypergeometrique", make: hypergeometric },
  { id: "geometrique", make: geometric },
  { id: "poisson", make: poisson },
  { id: "softmax-temperature", make: softmaxTemperature },
];
