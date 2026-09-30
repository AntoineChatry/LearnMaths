import { coef, fracTex, pick, randInt, randNonZero } from "../../lib/random";
import type { Exercise, ExerciseGenerator } from "../types";

// a/b as TeX, in parentheses when it is a fraction (for powers and products).
const paren = (num: number, den: number) => {
  const t = fracTex(num, den);
  return t.includes("frac") ? `\\left(${t}\\right)` : t;
};

// Density c x^k on [0, L]: normalizing constant, and probability of an interval on [0, 1].
function normalization(): Exercise {
  const k = randInt(1, 4);
  const kind = randInt(0, 2);
  if (kind < 2) {
    const L = kind === 0 ? 1 : 2;
    const den = L ** (k + 1);
    return {
      intro: `La fonction $f(x) = c\\,x^{${k}}$ sur $[0, ${L}]$ (et 0 ailleurs) est une densité. Donne $c$.`,
      promptTex: `f(x) = c\\,x^{${k}} \\quad \\text{sur } [0, ${L}]`,
      answerTex: fracTex(k + 1, den),
      hint: "Une densité a une intégrale égale à 1 : $\\int_0^L c\\,x^k\\,dx = c\\,L^{k+1}/(k+1)$.",
      solution: [`c \\int_0^{${L}} x^{${k}}\\,dx = c\\,\\frac{${den}}{${k + 1}} = 1 \\iff c = ${fracTex(k + 1, den)}`],
    };
  }
  const a = randInt(0, 3);
  const b = randInt(a + 1, 4);
  // P(a/4 <= X <= b/4) = (b/4)^{k+1} - (a/4)^{k+1}
  const den = 4 ** (k + 1);
  const num = b ** (k + 1) - a ** (k + 1);
  return {
    intro: `$X$ a pour densité $f(x) = ${k + 1}x^{${k}}$ sur $[0, 1]$. Donne la probabilité demandée.`,
    promptTex: `P\\left(${fracTex(a, 4)} \\le X \\le ${fracTex(b, 4)}\\right)`,
    answerTex: fracTex(num, den),
    hint: `Une primitive de $${k + 1}x^{${k}}$ est $x^{${k + 1}}$ : c'est la fonction de répartition sur $[0, 1]$.`,
    solution: [`\\left[x^{${k + 1}}\\right]_{${fracTex(a, 4)}}^{${fracTex(b, 4)}} = ${paren(b, 4)}^{${k + 1}} - ${paren(a, 4)}^{${k + 1}} = ${fracTex(num, den)}`],
  };
}

// Uniform law on [a, b]: probability of an interval, mean, variance.
function uniform(): Exercise {
  const a = randInt(-4, 3);
  const b = a + randInt(2, 8);
  const given = `X \\sim U[${a}, ${b}]`;
  const kind = randInt(0, 2);
  if (kind === 0) {
    const c = randInt(a - 2, b - 1);
    const d = randInt(Math.max(c + 1, a + 1), b + 2);
    const lo = Math.max(a, c);
    const hi = Math.min(b, d);
    return {
      intro: "$X$ suit la loi uniforme sur $[a, b]$. Donne la probabilité demandée.",
      promptTex: `${given} \\qquad P(${c} \\le X \\le ${d})`,
      answerTex: fracTex(hi - lo, b - a),
      hint: "La densité vaut $1/(b-a)$ sur $[a, b]$ et 0 ailleurs : ne garde que la partie de l'intervalle qui est dans $[a, b]$.",
      solution: [`\\frac{${hi} - ${lo < 0 ? `(${lo})` : lo}}{${b - a}} = ${fracTex(hi - lo, b - a)}`],
    };
  }
  if (kind === 1)
    return {
      intro: "$X$ suit la loi uniforme sur $[a, b]$. Donne $E(X)$.",
      promptTex: given,
      answerTex: fracTex(a + b, 2),
      hint: "Par symétrie, l'espérance est le milieu de l'intervalle.",
      solution: [`E(X) = \\frac{${a} + ${b < 0 ? `(${b})` : b}}{2} = ${fracTex(a + b, 2)}`],
    };
  return {
    intro: "$X$ suit la loi uniforme sur $[a, b]$. Donne $V(X)$.",
    promptTex: given,
    answerTex: fracTex((b - a) ** 2, 12),
    hint: "$V(X) = (b - a)^2 / 12$.",
    solution: [`V(X) = \\frac{${b - a}^2}{12} = ${fracTex((b - a) ** 2, 12)}`],
  };
}

// e^{-k}, written e^{0} = 1 when k = 0.
const expNeg = (k: number) => (k === 0 ? "1" : `e^{-${k}}`);

// Exponential law: tail, cdf, interval, memorylessness, mean, variance.
function exponential(): Exercise {
  const lambda = randInt(1, 4);
  const intro = "La durée $X$ (en secondes) entre deux requêtes suit la loi exponentielle de paramètre $\\lambda$.";
  const kind = randInt(0, 5);
  if (kind <= 1) {
    const t = randInt(1, 3);
    const k = lambda * t;
    const tail = kind === 0;
    return {
      intro: `${intro} ${tail ? "Quelle est la probabilité d'attendre plus de $t$ secondes ?" : "Quelle est la probabilité d'attendre au plus $t$ secondes ?"}`,
      promptTex: `\\lambda = ${lambda} \\qquad t = ${t}`,
      answerTex: tail ? `e^{-${k}}` : `1-e^{-${k}}`,
      hint: "$P(X > t) = \\int_t^{\\infty} \\lambda e^{-\\lambda x}\\,dx = e^{-\\lambda t}$.",
      solution: [tail ? `P(X > ${t}) = e^{-${lambda} \\times ${t}} = e^{-${k}}` : `P(X \\le ${t}) = 1 - e^{-${lambda} \\times ${t}} = 1 - e^{-${k}}`],
    };
  }
  if (kind === 2) {
    const s = randInt(0, 2);
    const t = randInt(s + 1, 3);
    return {
      intro: `${intro} Donne $P(s < X \\le t)$.`,
      promptTex: `\\lambda = ${lambda} \\qquad s = ${s} \\qquad t = ${t}`,
      answerTex: `${expNeg(lambda * s)}-e^{-${lambda * t}}`,
      hint: "$P(s < X \\le t) = F(t) - F(s) = e^{-\\lambda s} - e^{-\\lambda t}$.",
      solution: [`e^{-${lambda} \\times ${s}} - e^{-${lambda} \\times ${t}} = ${expNeg(lambda * s)} - e^{-${lambda * t}}`],
    };
  }
  if (kind === 3) {
    const r = randInt(2, 9);
    const s = randInt(1, 2);
    return {
      intro: `${intro} Aucune requête n'est arrivée depuis $r$ secondes. Quelle est la probabilité qu'il n'en arrive aucune dans les $s$ secondes suivantes ?`,
      promptTex: `\\lambda = ${lambda} \\qquad P(X > r + s \\mid X > r) \\qquad r = ${r} \\qquad s = ${s}`,
      answerTex: `e^{-${lambda * s}}`,
      hint: "La loi exponentielle est sans mémoire : $P(X > r + s \\mid X > r) = P(X > s)$.",
      solution: [`\\frac{e^{-${lambda}(${r} + ${s})}}{e^{-${lambda} \\times ${r}}} = e^{-${lambda} \\times ${s}} = e^{-${lambda * s}}`],
    };
  }
  const mean = kind === 4;
  return {
    intro: `${intro} Donne ${mean ? "l'attente moyenne $E(X)$" : "la variance $V(X)$"}.`,
    promptTex: `\\lambda = ${lambda}`,
    answerTex: fracTex(1, mean ? lambda : lambda * lambda),
    hint: mean ? "$E(X) = 1/\\lambda$." : "$V(X) = 1/\\lambda^2$.",
    solution: [mean ? `E(X) = \\frac{1}{${lambda}}` : `V(X) = \\frac{1}{${lambda}^2} = ${fracTex(1, lambda * lambda)}`],
  };
}

// Moments of the density (k+1) x^k on [0, 1].
function moments(): Exercise {
  const k = randInt(0, 4);
  const fTex = k === 0 ? "1" : `${k + 1}x${k === 1 ? "" : `^{${k}}`}`;
  const given = `f(x) = ${fTex} \\quad \\text{sur } [0, 1]`;
  const kind = randInt(0, 2);
  if (kind === 0)
    return {
      intro: "$X$ a la densité suivante. Donne $E(X)$.",
      promptTex: given,
      answerTex: fracTex(k + 1, k + 2),
      hint: "$E(X) = \\int_0^1 x\\,f(x)\\,dx$.",
      solution: [`\\int_0^1 ${k + 1}x^{${k + 1}}\\,dx = ${fracTex(k + 1, k + 2)}`],
    };
  if (kind === 1)
    return {
      intro: "$X$ a la densité suivante. Donne $E(X^2)$.",
      promptTex: given,
      answerTex: fracTex(k + 1, k + 3),
      hint: "$E(X^2) = \\int_0^1 x^2 f(x)\\,dx$.",
      solution: [`\\int_0^1 ${k + 1}x^{${k + 2}}\\,dx = ${fracTex(k + 1, k + 3)}`],
    };
  // V = (k+1)/(k+3) - (k+1)²/(k+2)² = (k+1) / ((k+3)(k+2)²)
  const vDen = (k + 3) * (k + 2) ** 2;
  return {
    intro: "$X$ a la densité suivante. Donne $V(X)$.",
    promptTex: given,
    answerTex: fracTex(k + 1, vDen),
    hint: "Calcule $E(X)$ et $E(X^2)$ par intégration, puis $V(X) = E(X^2) - E(X)^2$.",
    solution: [
      `E(X) = ${fracTex(k + 1, k + 2)} \\qquad E(X^2) = ${fracTex(k + 1, k + 3)}`,
      `V(X) = ${fracTex(k + 1, k + 3)} - \\left(${fracTex(k + 1, k + 2)}\\right)^2 = ${fracTex(k + 1, vDen)}`,
    ],
  };
}

const T_VALUES: [number, number][] = [[1, 2], [1, 3], [2, 3], [3, 4]];
const U_VALUES: [number, number, number][] = [[1, 2, 2], [3, 4, 4], [7, 8, 8], [2, 3, 3], [15, 16, 16]]; // u = a/b, 1/(1-u) = c

// Change of variable: affine image of a uniform, power of a variable, inverse transform sampling.
function changeOfVariable(): Exercise {
  const kind = randInt(0, 2);
  if (kind === 0) {
    const a = randNonZero(-3, 3);
    const b = randInt(-3, 3);
    const lo = Math.min(b, a + b);
    const hi = Math.max(b, a + b);
    // y0 strictly inside [lo, hi], on a grid of halves
    const y2 = randInt(2 * lo + 1, 2 * hi - 1);
    // P(aX + b <= y0) = P(X <= (y0 - b)/a) if a > 0, P(X >= (y0 - b)/a) if a < 0
    const xNum = y2 - 2 * b; // (y0 - b) = xNum / 2, x0 = xNum / (2a)
    const num = a > 0 ? xNum : 2 * a - xNum; // a < 0: 1 - xNum/(2a) = (2a - xNum)/(2a)
    const yTex = fracTex(y2, 2);
    const zTex = `${coef(a)}X${b === 0 ? "" : b > 0 ? ` + ${b}` : ` - ${-b}`}`;
    return {
      intro: "$X$ suit la loi uniforme sur $[0, 1]$. Donne la valeur de la fonction de répartition de $Y$ au point indiqué.",
      promptTex: `Y = ${zTex} \\qquad F_Y(${yTex}) = P(Y \\le ${yTex})`,
      answerTex: fracTex(num, 2 * a),
      hint: "Ramène l'événement à $X$ : isole $X$ dans $aX + b \\le y$, en retournant l'inégalité si $a < 0$.",
      solution: [
        a > 0
          ? `P\\left(X \\le ${fracTex(xNum, 2 * a)}\\right) = ${fracTex(num, 2 * a)}`
          : `P\\left(X \\ge ${fracTex(xNum, 2 * a)}\\right) = 1 - ${fracTex(xNum, 2 * a)} = ${fracTex(num, 2 * a)}`,
      ],
    };
  }
  if (kind === 1) {
    const k = randInt(1, 4);
    const m = randInt(2, 3);
    const [p, q] = pick(T_VALUES);
    // f_Y(y) = f_X(y^{1/m}) (1/m) y^{1/m - 1}; at y = t^m: ((k+1)/m) t^{k+1-m}
    const e = k + 1 - m;
    const num = (k + 1) * (e >= 0 ? p ** e : q ** -e);
    const den = m * (e >= 0 ? q ** e : p ** -e);
    const yTex = fracTex(p ** m, q ** m);
    return {
      intro: `$X$ a pour densité $${k + 1}x^{${k}}$ sur $[0, 1]$, et $Y = X^{${m}}$. Donne la densité de $Y$ au point indiqué.`,
      promptTex: `f_Y\\left(${yTex}\\right)`,
      answerTex: fracTex(num, den),
      hint: `$\\varphi^{-1}(y) = y^{1/${m}}$ : $f_Y(y) = f_X(y^{1/${m}}) \\cdot \\frac{1}{${m}} y^{1/${m} - 1}$.`,
      solution: [
        `y = ${yTex} \\;\\Rightarrow\\; y^{1/${m}} = ${fracTex(p, q)}`,
        `f_Y(y) = ${k + 1}\\,${paren(p, q)}^{${k}} \\cdot \\frac{1}{${m}}\\,${paren(p, q)}^{${1 - m}} = ${fracTex(num, den)}`,
      ],
    };
  }
  const lambda = randInt(1, 4);
  const [a, b, c] = pick(U_VALUES);
  const ans = lambda === 1 ? `\\ln ${c}` : `\\frac{\\ln ${c}}{${lambda}}`;
  return {
    intro: "Pour tirer selon la loi exponentielle de paramètre $\\lambda$, on tire $u$ uniforme et l'on renvoie $x = F^{-1}(u)$, où $F(x) = 1 - e^{-\\lambda x}$. Quelle valeur $x$ obtient-on ?",
    promptTex: `\\lambda = ${lambda} \\qquad u = ${fracTex(a, b)}`,
    answerTex: ans,
    hint: "Résous $1 - e^{-\\lambda x} = u$ : $x = -\\ln(1 - u)/\\lambda = \\ln\\frac{1}{1-u} / \\lambda$.",
    solution: [`e^{-${lambda}x} = 1 - ${fracTex(a, b)} = \\frac{1}{${c}}`, `x = ${ans}`],
  };
}

// Variance bookkeeping of weight initialization (Glorot and Bengio 2010, He et al. 2015).
function initialization(): Exercise {
  const kind = randInt(0, 3);
  if (kind === 0) {
    const [p, q] = pick([[1, 2], [1, 3], [1, 4], [2, 1], [3, 1], [3, 2]] as [number, number][]);
    return {
      intro: "Un poids $W$ est tiré selon la loi uniforme sur $[-a, a]$. Donne sa variance.",
      promptTex: `a = ${fracTex(p, q)}`,
      answerTex: fracTex(p * p, 3 * q * q),
      hint: "$V(W) = \\int_{-a}^{a} \\frac{w^2}{2a}\\,dw = a^2/3$.",
      solution: [`V(W) = \\frac{a^2}{3} = \\frac{${fracTex(p * p, q * q)}}{3} = ${fracTex(p * p, 3 * q * q)}`],
    };
  }
  if (kind === 1) {
    const nIn = pick([64, 128, 256, 300, 512, 784]);
    const nOut = pick([10, 32, 64, 100, 128, 256]);
    return {
      intro: "Initialisation de Glorot et Bengio : les poids d'une couche à $n_j$ entrées et $n_{j+1}$ sorties suivent la loi uniforme sur $[-a, a]$ avec $a = \\sqrt 6 / \\sqrt{n_j + n_{j+1}}$. Donne la variance d'un poids.",
      promptTex: `n_j = ${nIn} \\qquad n_{j+1} = ${nOut}`,
      answerTex: fracTex(2, nIn + nOut),
      hint: "$V(W) = a^2/3$, avec $a^2 = 6/(n_j + n_{j+1})$.",
      solution: [`V(W) = \\frac{1}{3} \\cdot \\frac{6}{${nIn} + ${nOut}} = ${fracTex(2, nIn + nOut)}`],
    };
  }
  if (kind === 2) {
    const k = randInt(2, 16);
    const n = 2 * k * k;
    const std = Math.random() < 0.5;
    return {
      intro: `Initialisation de He et al. pour une couche ReLU à $n$ entrées : poids gaussiens centrés avec $\\frac{1}{2} n\\,V(w) = 1$. Donne ${std ? "l'écart type" : "la variance"} des poids.`,
      promptTex: `n = ${n}`,
      answerTex: std ? fracTex(1, k) : fracTex(2, n),
      hint: "$V(w) = 2/n$, et l'écart type est sa racine $\\sqrt{2/n}$.",
      solution: [std ? `\\sqrt{\\frac{2}{${n}}} = \\sqrt{\\frac{1}{${k * k}}} = ${fracTex(1, k)}` : `V(w) = \\frac{2}{${n}} = ${fracTex(2, n)}`],
    };
  }
  const n = pick([16, 64, 100, 128, 256]);
  const vDen = pick([16, 32, 64, 100, 128, 256, 512]);
  const e = randInt(1, 4);
  return {
    intro: "Une couche calcule $y = \\sum_{i=1}^n w_i x_i$, avec des poids centrés, indépendants entre eux et des entrées. Donne $V(y)$.",
    promptTex: `n = ${n} \\qquad V(w) = ${fracTex(1, vDen)} \\qquad E(x^2) = ${e}`,
    answerTex: fracTex(n * e, vDen),
    hint: "$V(w_i x_i) = V(w)\\,E(x^2)$ quand $w_i$ est centré et indépendant de $x_i$, et les $n$ termes ont des covariances nulles.",
    solution: [`V(y) = n\\,V(w)\\,E(x^2) = ${n} \\times ${fracTex(1, vDen)} \\times ${e} = ${fracTex(n * e, vDen)}`],
  };
}

export const loisContinuesGenerators: ExerciseGenerator[] = [
  { id: "densite-normalisation", make: normalization },
  { id: "loi-uniforme", make: uniform },
  { id: "loi-exponentielle", make: exponential },
  { id: "moments-densite", make: moments },
  { id: "changement-variable", make: changeOfVariable },
  { id: "initialisation-poids", make: initialization },
];
