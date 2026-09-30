import { coef, fracTex, pick, randInt, randNonZero } from "../../lib/random";
import type { Exercise, ExerciseGenerator } from "../types";

function comb(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return Math.round(r);
}

// A random law on distinct integer values, given as a table with probabilities num_i / den.
function randomLaw(): { xs: number[]; nums: number[]; den: number; table: string } {
  const size = randInt(3, 4);
  const pool = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6];
  const xs: number[] = [];
  while (xs.length < size) {
    const x = pick(pool);
    if (!xs.includes(x)) xs.push(x);
  }
  xs.sort((a, b) => a - b);
  const den = pick([4, 5, 6, 8, 10, 12]);
  const cuts = new Set<number>();
  while (cuts.size < size - 1) cuts.add(randInt(1, den - 1));
  const c = [0, ...[...cuts].sort((a, b) => a - b), den];
  const nums = xs.map((_, i) => c[i + 1] - c[i]);
  const cells = nums.map((k) => fracTex(k, den));
  const cols = "c".repeat(size);
  const table = `\\begin{array}{c|${cols}} x & ${xs.join(" & ")} \\\\ \\hline P(X = x) & ${cells.join(" & ")} \\end{array}`;
  return { xs, nums, den, table };
}

// Weighted sum written out, e.g. "(-1) \times \frac{1}{4} + 2 \times \frac{3}{4}".
function weighted(vals: number[], nums: number[], den: number): string {
  return vals.map((v, i) => `${v < 0 ? `(${v})` : v} \\times ${fracTex(nums[i], den)}`).join(" + ");
}

// Expectation of X, of X² or of aX + b, from a table.
function expectationFromTable(): Exercise {
  const { xs, nums, den, table } = randomLaw();
  const sum = (f: (x: number) => number) => xs.reduce((s, x, i) => s + f(x) * nums[i], 0);
  const kind = randInt(0, 2);
  if (kind === 0) {
    const s = sum((x) => x);
    return {
      intro: "Voici la loi d'une variable aléatoire $X$. Donne son espérance $E(X)$.",
      promptTex: table,
      answerTex: fracTex(s, den),
      hint: "$E(X) = \\sum_x x\\, P(X = x)$.",
      solution: [`E(X) = ${weighted(xs, nums, den)} = ${fracTex(s, den)}`],
    };
  }
  if (kind === 1) {
    const s = sum((x) => x * x);
    return {
      intro: "Voici la loi d'une variable aléatoire $X$. Donne $E(X^2)$.",
      promptTex: table,
      answerTex: fracTex(s, den),
      hint: "Pas besoin de la loi de $X^2$ : $E(X^2) = \\sum_x x^2\\, P(X = x)$.",
      solution: [`E(X^2) = ${weighted(xs.map((x) => x * x), nums, den)} = ${fracTex(s, den)}`],
    };
  }
  const a = randNonZero(-3, 4);
  const b = randInt(-5, 5);
  const s = sum((x) => x);
  const zTex = `${coef(a)}X${b === 0 ? "" : b > 0 ? ` + ${b}` : ` - ${-b}`}`;
  return {
    intro: "Voici la loi d'une variable aléatoire $X$. Donne l'espérance de $Y$.",
    promptTex: `${table} \\qquad Y = ${zTex}`,
    answerTex: fracTex(a * s + b * den, den),
    hint: "Linéarité : $E(aX + b) = a\\,E(X) + b$.",
    solution: [`E(X) = ${fracTex(s, den)}`, `E(Y) = ${a} \\times ${fracTex(s, den)} ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${fracTex(a * s + b * den, den)}`],
  };
}

// Variance of X from a table.
function varianceFromTable(): Exercise {
  const { xs, nums, den, table } = randomLaw();
  const m1 = xs.reduce((s, x, i) => s + x * nums[i], 0); // E(X) = m1 / den
  const m2 = xs.reduce((s, x, i) => s + x * x * nums[i], 0); // E(X²) = m2 / den
  // V = m2/den - m1²/den² = (m2 den - m1²) / den²
  const vNum = m2 * den - m1 * m1;
  return {
    intro: "Voici la loi d'une variable aléatoire $X$. Donne sa variance $V(X)$.",
    promptTex: table,
    answerTex: fracTex(vNum, den * den),
    hint: "Calcule $E(X)$ et $E(X^2)$, puis $V(X) = E(X^2) - E(X)^2$.",
    solution: [
      `E(X) = ${fracTex(m1, den)} \\qquad E(X^2) = ${fracTex(m2, den)}`,
      `V(X) = ${fracTex(m2, den)} - \\left(${fracTex(m1, den)}\\right)^2 = ${fracTex(vNum, den * den)}`,
    ],
  };
}

// Linear combinations of independent variables, and the sum of n copies versus n times one variable.
function varianceRules(): Exercise {
  const m1 = randInt(-4, 6);
  const v1 = randInt(1, 9);
  const kind = randInt(0, 3);
  if (kind >= 2) {
    const n = randInt(2, 5);
    const sum = kind === 2;
    return {
      intro: sum
        ? "$X_1, \\dots, X_n$ sont indépendantes et suivent toutes la loi de $X$. Donne la variance de leur somme $S$."
        : "Donne la variance de $T = nX$, $n$ fois une seule et même variable.",
      promptTex: `V(X) = ${v1} \\qquad n = ${n} \\qquad ${sum ? "S = X_1 + \\dots + X_n" : "T = nX"}`,
      answerTex: String(sum ? n * v1 : n * n * v1),
      hint: sum
        ? "Les variances de variables indépendantes s'ajoutent."
        : "$V(cX) = c^2 V(X)$ : les $n$ termes sont la même variable, pas des copies indépendantes.",
      solution: [sum ? `V(S) = ${n} \\times ${v1} = ${n * v1}` : `V(T) = ${n}^2 \\times ${v1} = ${n * n * v1}`],
    };
  }
  const m2 = randInt(-4, 6);
  const v2 = randInt(1, 9);
  const a = randNonZero(-3, 3);
  const b = randNonZero(-3, 3);
  const c = randInt(-5, 5);
  const zTex = `${coef(a)}X ${b > 0 ? "+" : "-"} ${coef(Math.abs(b))}Y${c === 0 ? "" : c > 0 ? ` + ${c}` : ` - ${-c}`}`;
  const given = `E(X) = ${m1},\\ V(X) = ${v1} \\qquad E(Y) = ${m2},\\ V(Y) = ${v2} \\qquad Z = ${zTex}`;
  const intro = "$X$ et $Y$ sont indépendantes.";
  if (kind === 0)
    return {
      intro: `${intro} Donne $E(Z)$.`,
      promptTex: given,
      answerTex: String(a * m1 + b * m2 + c),
      hint: "Linéarité : $E(aX + bY + c) = a\\,E(X) + b\\,E(Y) + c$.",
      solution: [`E(Z) = ${a} \\times ${m1 < 0 ? `(${m1})` : m1} + ${b < 0 ? `(${b})` : b} \\times ${m2 < 0 ? `(${m2})` : m2} + ${c < 0 ? `(${c})` : c} = ${a * m1 + b * m2 + c}`],
    };
  return {
    intro: `${intro} Donne $V(Z)$.`,
    promptTex: given,
    answerTex: String(a * a * v1 + b * b * v2),
    hint: "$V(aX + bY + c) = a^2 V(X) + b^2 V(Y)$ pour $X$, $Y$ indépendantes : la constante ne compte pas et les coefficients passent au carré.",
    solution: [`V(Z) = ${a * a} \\times ${v1} + ${b * b} \\times ${v2} = ${a * a * v1 + b * b * v2}`],
  };
}

// Expected counts computed as sums of indicator variables.
function indicators(): Exercise {
  const kind = randInt(0, 2);
  if (kind === 0) {
    const m = randInt(2, 6);
    const k = randInt(2, 5);
    const num = (m - 1) ** k;
    const den = m ** (k - 1);
    return {
      intro: "On lance $k$ balles, chacune dans l'une des $m$ boîtes au hasard, uniformément et indépendamment des autres. Quel est le nombre moyen de boîtes vides ?",
      promptTex: `m = ${m} \\qquad k = ${k}`,
      answerTex: fracTex(num, den),
      hint: "Écris le nombre de boîtes vides comme une somme de $m$ indicatrices : la boîte $j$ est vide avec probabilité $(1 - 1/m)^k$.",
      solution: [`E = m \\left(1 - \\frac{1}{m}\\right)^k = ${m} \\times \\left(${fracTex(m - 1, m)}\\right)^{${k}} = ${fracTex(num, den)}`],
    };
  }
  if (kind === 1) {
    const n = randInt(3, 5);
    const d = randInt(4, 8);
    return {
      intro: "On range $n$ clés dans une table de hachage à $d$ cases, chaque clé tombant dans une case uniformément et indépendamment. Quel est le nombre moyen de paires de clés en collision (même case) ?",
      promptTex: `n = ${n} \\qquad d = ${d}`,
      answerTex: fracTex(comb(n, 2), d),
      hint: "Une indicatrice par paire de clés : il y a $\\binom{n}{2}$ paires, et chacune est en collision avec probabilité $1/d$.",
      solution: [`E = \\binom{${n}}{2} \\times \\frac{1}{${d}} = ${fracTex(comb(n, 2), d)}`],
    };
  }
  const n = randInt(3, 6);
  return {
    intro: "On lance $n$ fois un dé équilibré. Une montée est un lancer (à partir du deuxième) strictement plus grand que le précédent. Quel est le nombre moyen de montées ?",
    promptTex: `n = ${n}`,
    answerTex: fracTex(5 * (n - 1), 12),
    hint: "Une indicatrice par position $i = 2, \\dots, n$. Deux dés : $P(b > a) = 15/36$, car sur les 30 couples de valeurs distinctes, la moitié montent.",
    solution: [`E = (n - 1) \\times \\frac{15}{36} = ${n - 1} \\times \\frac{5}{12} = ${fracTex(5 * (n - 1), 12)}`],
  };
}

const PROBS: [number, number][] = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [1, 6]];

// Mean, variance or second moment of the binomial, geometric and Poisson laws.
function usualLaws(): Exercise {
  const law = randInt(0, 2);
  if (law === 0) {
    const [a, d] = pick(PROBS);
    const n = randInt(2, 20);
    const pTex = fracTex(a, d);
    const kind = randInt(0, 2);
    const given = `X \\sim \\text{Bin}(n, p) \\qquad n = ${n} \\qquad p = ${pTex}`;
    const eNum = n * a; // E = n a / d
    const vNum = n * a * (d - a); // V = n a (d - a) / d²
    if (kind === 0)
      return {
        intro: "Donne l'espérance $E(X)$.",
        promptTex: given,
        answerTex: fracTex(eNum, d),
        hint: "$E(X) = np$ : somme de $n$ indicatrices d'espérance $p$.",
        solution: [`E(X) = ${n} \\times ${pTex} = ${fracTex(eNum, d)}`],
      };
    if (kind === 1)
      return {
        intro: "Donne la variance $V(X)$.",
        promptTex: given,
        answerTex: fracTex(vNum, d * d),
        hint: "$V(X) = np(1 - p)$ : somme de $n$ indicatrices indépendantes de variance $p(1-p)$.",
        solution: [`V(X) = ${n} \\times ${pTex} \\times ${fracTex(d - a, d)} = ${fracTex(vNum, d * d)}`],
      };
    return {
      intro: "Donne $E(X^2)$.",
      promptTex: given,
      answerTex: fracTex(vNum + eNum * eNum, d * d),
      hint: "$V(X) = E(X^2) - E(X)^2$, donc $E(X^2) = V(X) + E(X)^2$.",
      solution: [`E(X^2) = ${fracTex(vNum, d * d)} + \\left(${fracTex(eNum, d)}\\right)^2 = ${fracTex(vNum + eNum * eNum, d * d)}`],
    };
  }
  if (law === 1) {
    const [a, d] = pick(PROBS);
    const pTex = fracTex(a, d);
    const mean = Math.random() < 0.5;
    const intro = "On répète des essais indépendants de probabilité de succès $p$ jusqu'au premier succès, et $T$ est le rang de ce succès.";
    return {
      intro: `${intro} Donne ${mean ? "$E(T)$" : "$V(T)$"}.`,
      promptTex: `p = ${pTex}`,
      answerTex: mean ? fracTex(d, a) : fracTex((d - a) * d, a * a),
      hint: mean ? "$E(T) = 1/p$." : "$V(T) = (1 - p)/p^2$.",
      solution: [mean ? `E(T) = \\frac{1}{p} = ${fracTex(d, a)}` : `V(T) = \\frac{1 - p}{p^2} = ${fracTex(d - a, d)} \\times \\left(${fracTex(d, a)}\\right)^2 = ${fracTex((d - a) * d, a * a)}`],
    };
  }
  const lambda = randInt(1, 9);
  const second = Math.random() < 0.5;
  return {
    intro: `$X$ suit la loi de Poisson de paramètre $\\lambda$. Donne ${second ? "$E(X^2)$" : "$V(X)$"}.`,
    promptTex: `\\lambda = ${lambda}`,
    answerTex: String(second ? lambda + lambda * lambda : lambda),
    hint: second ? "$E(X^2) = V(X) + E(X)^2$, et pour Poisson $E(X) = V(X) = \\lambda$." : "Pour la loi de Poisson, variance et espérance valent toutes deux $\\lambda$.",
    solution: [second ? `E(X^2) = \\lambda + \\lambda^2 = ${lambda} + ${lambda * lambda} = ${lambda + lambda * lambda}` : `V(X) = \\lambda = ${lambda}`],
  };
}

// Minibatch mean of B losses drawn independently: variance sigma²/B, standard deviation sigma/sqrt(B).
function minibatch(): Exercise {
  const intro = "On estime la perte moyenne $L$ par la moyenne $\\hat L_B$ des pertes de $B$ exemples tirés uniformément et indépendamment. La perte d'un exemple tiré au hasard a pour écart type $\\sigma$.";
  const kind = randInt(0, 2);
  if (kind === 0) {
    const s2 = randInt(1, 20);
    const B = pick([2, 4, 8, 16, 32, 64]);
    return {
      intro: `${intro} Donne la variance de $\\hat L_B$.`,
      promptTex: `\\sigma^2 = ${s2} \\qquad B = ${B}`,
      answerTex: fracTex(s2, B),
      hint: "$V(\\frac{1}{B} \\sum \\ell_b) = \\frac{1}{B^2} \\times B \\sigma^2$.",
      solution: [`V(\\hat L_B) = \\frac{\\sigma^2}{B} = \\frac{${s2}}{${B}} = ${fracTex(s2, B)}`],
    };
  }
  if (kind === 1) {
    const sigma = randInt(1, 12);
    const k = randInt(2, 10);
    return {
      intro: `${intro} Donne l'écart type de $\\hat L_B$.`,
      promptTex: `\\sigma = ${sigma} \\qquad B = ${k * k}`,
      answerTex: fracTex(sigma, k),
      hint: "La variance est $\\sigma^2 / B$, donc l'écart type est $\\sigma / \\sqrt{B}$.",
      solution: [`\\frac{\\sigma}{\\sqrt{B}} = \\frac{${sigma}}{${k}} = ${fracTex(sigma, k)}`],
    };
  }
  const B0 = pick([8, 16, 32, 64]);
  const k = randInt(2, 4);
  return {
    intro: `${intro} Avec des minibatchs de taille $B_0$, quelle taille $B$ faut-il pour diviser l'écart type de l'estimation par $k$ ?`,
    promptTex: `B_0 = ${B0} \\qquad k = ${k}`,
    answerTex: String(B0 * k * k),
    hint: "L'écart type est proportionnel à $1/\\sqrt{B}$ : diviser par $k$ demande de multiplier $B$ par $k^2$.",
    solution: [`\\sigma/\\sqrt{B} = \\frac{1}{${k}} \\sigma/\\sqrt{B_0} \\iff B = ${k}^2 \\times ${B0} = ${B0 * k * k}`],
  };
}

export const esperanceGenerators: ExerciseGenerator[] = [
  { id: "esperance-loi", make: expectationFromTable },
  { id: "variance-loi", make: varianceFromTable },
  { id: "regles-variance", make: varianceRules },
  { id: "indicatrices", make: indicators },
  { id: "lois-usuelles-moments", make: usualLaws },
  { id: "minibatch", make: minibatch },
];
