import { fracTex, pick, randInt } from "../../lib/random";
import type { Exercise, ExerciseGenerator } from "../types";

const sum = (a: number[]) => a.reduce((s, v) => s + v, 0);

// Maximum likelihood for Bernoulli, Poisson and exponential samples.
function mleSimple(): Exercise {
  const kind = randInt(0, 2);
  if (kind === 0) {
    const n = randInt(4, 30);
    // 0 < k < n: for k = 0 or n the likelihood is monotonic, the derivative never vanishes
    // and the maximum sits on the boundary θ = 0 or 1, which the solution below would not describe.
    const k = randInt(1, n - 1);
    return {
      intro: "On observe $k$ succès sur $n$ essais indépendants de probabilité inconnue $\\theta$. Donne l'estimateur du maximum de vraisemblance $\\hat\\theta$.",
      promptTex: `n = ${n} \\qquad k = ${k}`,
      answerTex: fracTex(k, n),
      hint: "Annule la dérivée de $k \\log\\theta + (n - k)\\log(1 - \\theta)$.",
      solution: [`\\frac{k}{\\theta} = \\frac{n - k}{1 - \\theta} \\iff \\hat\\theta = \\frac{${k}}{${n}} = ${fracTex(k, n)}`],
    };
  }
  const N = randInt(3, 6);
  if (kind === 1) {
    const xs = Array.from({ length: N }, () => randInt(0, 8));
    // All-zero counts: e^{-Nλ} has no maximum on λ > 0, the MLE does not exist.
    if (sum(xs) === 0) return mleSimple();
    return {
      intro: "Des comptes indépendants suivent une loi de Poisson de paramètre $\\lambda$ inconnu. Donne l'estimateur du maximum de vraisemblance $\\hat\\lambda$.",
      promptTex: `x = (${xs.join(",\\ ")})`,
      answerTex: fracTex(sum(xs), N),
      hint: "$-\\log L(\\lambda) = N\\lambda - (\\sum x_n)\\log\\lambda + \\text{constante}$ : annule la dérivée.",
      solution: [`N - \\frac{\\sum x_n}{\\lambda} = 0 \\iff \\hat\\lambda = \\frac{${sum(xs)}}{${N}} = ${fracTex(sum(xs), N)}`],
    };
  }
  const xs = Array.from({ length: N }, () => randInt(1, 9));
  return {
    intro: "Des durées indépendantes suivent une loi exponentielle de paramètre $\\lambda$ inconnu, de densité $\\lambda e^{-\\lambda x}$. Donne l'estimateur du maximum de vraisemblance $\\hat\\lambda$.",
    promptTex: `x = (${xs.join(",\\ ")})`,
    answerTex: fracTex(N, sum(xs)),
    hint: "$-\\log L(\\lambda) = -N\\log\\lambda + \\lambda \\sum x_n$ : annule la dérivée.",
    solution: [`-\\frac{N}{\\lambda} + \\sum x_n = 0 \\iff \\hat\\lambda = \\frac{${N}}{${sum(xs)}} = ${fracTex(N, sum(xs))}`],
  };
}

// Gaussian maximum likelihood: mean, biased variance, unbiased variance.
function mleGaussian(): Exercise {
  const N = randInt(3, 6);
  const xs = Array.from({ length: N }, () => randInt(-4, 8));
  const s = sum(xs);
  // sum of squared deviations = sum x² - s²/N = (N sum x² - s²) / N
  const ssNum = N * sum(xs.map((x) => x * x)) - s * s;
  // Identical data: the likelihood grows without bound as σ² → 0, the variance MLE degenerates.
  if (ssNum === 0) return mleGaussian();
  const data = `x = (${xs.join(",\\ ")})`;
  const kind = randInt(0, 2);
  if (kind === 0)
    return {
      intro: "Des données sont supposées tirées d'une loi normale $\\mathcal N(\\mu, \\sigma^2)$. Donne l'estimateur du maximum de vraisemblance $\\hat\\mu$.",
      promptTex: data,
      answerTex: fracTex(s, N),
      hint: "Pour une gaussienne, $\\hat\\mu$ est la moyenne empirique.",
      solution: [`\\hat\\mu = \\frac{${s}}{${N}} = ${fracTex(s, N)}`],
    };
  const biased = kind === 1;
  return {
    intro: biased
      ? "Des données sont supposées tirées d'une loi normale. Donne l'estimateur du maximum de vraisemblance de la variance, $\\hat\\sigma^2_{\\text{ML}} = \\frac1N \\sum (x_n - \\hat\\mu)^2$."
      : "Des données sont supposées tirées d'une loi normale. Donne l'estimateur sans biais de la variance, $\\frac{1}{N-1} \\sum (x_n - \\hat\\mu)^2$.",
    promptTex: data,
    answerTex: fracTex(ssNum, biased ? N * N : N * (N - 1)),
    hint: "Calcule la moyenne, puis la somme des carrés des écarts à la moyenne.",
    solution: [
      `\\hat\\mu = ${fracTex(s, N)} \\qquad \\sum (x_n - \\hat\\mu)^2 = ${fracTex(ssNum, N)}`,
      `${biased ? `\\frac{1}{${N}}` : `\\frac{1}{${N - 1}}`} \\times ${fracTex(ssNum, N)} = ${fracTex(ssNum, biased ? N * N : N * (N - 1))}`,
    ],
  };
}

// Cross-entropy: loss of a batch, and gradient with respect to the logits.
function crossEntropy(): Exercise {
  if (Math.random() < 0.5) {
    // Probabilities given to the correct class, all powers of 1/2 so the loss is a multiple of ln 2.
    const N = randInt(2, 4);
    const ks = Array.from({ length: N }, () => randInt(0, 3)); // p = 2^{-k}
    const total = sum(ks);
    const coefTex = fracTex(total, N);
    const ans = total === 0 ? "0" : coefTex === "1" ? "\\ln 2" : `${coefTex}\\ln 2`;
    return {
      intro: "Un classifieur donne les probabilités suivantes à la bonne classe de $N$ exemples. Donne l'entropie croisée moyenne $-\\frac1N \\sum_n \\ln p_n$, sous la forme d'un multiple de $\\ln 2$.",
      promptTex: `p = (${ks.map((k) => fracTex(1, 2 ** k)).join(",\\ ")})`,
      answerTex: ans,
      hint: "$-\\ln(1/2^k) = k \\ln 2$.",
      solution: [`-\\frac{1}{${N}}\\left(${ks.map((k) => (k === 0 ? "\\ln 1" : `\\ln \\frac{1}{${2 ** k}}`)).join(" + ")}\\right) = \\frac{${total}}{${N}}\\ln 2 = ${ans}`],
    };
  }
  const K = 3;
  const w = Array.from({ length: K }, () => randInt(1, 5)); // softmax output proportional to w
  const W = sum(w);
  const c = randInt(1, K);
  const j = randInt(1, K);
  const t = j === c ? 1 : 0;
  return {
    intro: "Le softmax d'un classifieur sort les probabilités $y$ ; la vraie classe est $c$. Donne la dérivée de l'entropie croisée $-\\ln y_c$ par rapport au logit $z_j$.",
    promptTex: `y = (${w.map((v) => fracTex(v, W)).join(",\\ ")}) \\qquad c = ${c} \\qquad j = ${j}`,
    answerTex: fracTex(w[j - 1] - t * W, W),
    hint: "Pour softmax et entropie croisée, $\\partial E / \\partial z_j = y_j - t_j$, avec $t$ le codage one-hot de la vraie classe.",
    solution: [`y_{${j}} - t_{${j}} = ${fracTex(w[j - 1], W)} - ${t} = ${fracTex(w[j - 1] - t * W, W)}`],
  };
}

// Beta prior on a coin: posterior parameters, posterior mean, MAP.
function betaPosterior(): Exercise {
  const a = randInt(1, 5);
  const b = randInt(1, 5);
  const n = randInt(1, 20);
  const k = randInt(0, n);
  const given = `\\theta \\sim \\text{Beta}(${a}, ${b}) \\qquad k = ${k} \\qquad n = ${n}`;
  const intro = "A priori $\\text{Beta}(\\alpha, \\beta)$ sur la probabilité $\\theta$ de pile ; on observe $k$ piles sur $n$ lancers.";
  const kind = randInt(0, 2);
  if (kind === 0) {
    const which = pick(["\\alpha'", "\\beta'"]);
    return {
      intro: `${intro} L'a posteriori est $\\text{Beta}(\\alpha', \\beta')$. Donne le paramètre demandé.`,
      promptTex: `${given} \\qquad ${which}`,
      answerTex: String(which === "\\alpha'" ? a + k : b + n - k),
      hint: "Conjugaison : $\\alpha' = \\alpha + k$ et $\\beta' = \\beta + n - k$.",
      solution: [`\\alpha' = ${a} + ${k} = ${a + k} \\qquad \\beta' = ${b} + ${n - k} = ${b + n - k}`],
    };
  }
  if (kind === 1)
    return {
      intro: `${intro} Donne l'espérance a posteriori de $\\theta$.`,
      promptTex: given,
      answerTex: fracTex(a + k, a + b + n),
      hint: "$E(\\theta \\mid \\text{données}) = (\\alpha + k)/(\\alpha + \\beta + n)$.",
      solution: [`\\frac{${a} + ${k}}{${a} + ${b} + ${n}} = ${fracTex(a + k, a + b + n)}`],
    };
  // MAP: mode of Beta(a', b') = (a' - 1)/(a' + b' - 2), valid when a', b' > 1.
  const a2 = Math.max(a, 2);
  const b2 = Math.max(b, 2);
  return {
    intro: `${intro} Donne l'estimation du maximum a posteriori (le mode de l'a posteriori).`,
    promptTex: `\\theta \\sim \\text{Beta}(${a2}, ${b2}) \\qquad k = ${k} \\qquad n = ${n}`,
    answerTex: fracTex(a2 + k - 1, a2 + b2 + n - 2),
    hint: "L'a posteriori est proportionnel à $\\theta^{\\alpha + k - 1}(1 - \\theta)^{\\beta + n - k - 1}$ : annule la dérivée de son logarithme.",
    solution: [`\\hat\\theta_{\\text{MAP}} = \\frac{\\alpha + k - 1}{\\alpha + \\beta + n - 2} = \\frac{${a2 + k - 1}}{${a2 + b2 + n - 2}} = ${fracTex(a2 + k - 1, a2 + b2 + n - 2)}`],
  };
}

// One-parameter regression y ≈ θ x: MLE (least squares) and MAP with a Gaussian prior (ridge).
function mapRidge(): Exercise {
  const N = randInt(3, 5);
  const xs = Array.from({ length: N }, () => randInt(-3, 3) || 1);
  const ys = Array.from({ length: N }, () => randInt(-6, 6));
  const sxx = sum(xs.map((x) => x * x));
  const sxy = sum(xs.map((x, i) => x * ys[i]));
  const data = `x = (${xs.join(",\\ ")}) \\qquad y = (${ys.join(",\\ ")})`;
  if (Math.random() < 0.4)
    return {
      intro: "Modèle $y_n = \\theta x_n + \\varepsilon_n$, bruit gaussien. Donne l'estimateur du maximum de vraisemblance $\\hat\\theta$ (moindres carrés).",
      promptTex: data,
      answerTex: fracTex(sxy, sxx),
      hint: "Minimise $\\sum (y_n - \\theta x_n)^2$ : $\\hat\\theta = \\sum x_n y_n / \\sum x_n^2$.",
      solution: [`\\sum x_n y_n = ${sxy} \\qquad \\sum x_n^2 = ${sxx} \\qquad \\hat\\theta = ${fracTex(sxy, sxx)}`],
    };
  const [s2, t2n, t2d] = pick([[1, 1, 1], [1, 1, 2], [1, 1, 4], [4, 1, 1], [2, 1, 1], [1, 2, 1]] as [number, number, number][]);
  // lambda = sigma² / tau² = s2 t2d / t2n
  const lamNum = s2 * t2d;
  const lamDen = t2n;
  return {
    intro: "Modèle $y_n = \\theta x_n + \\varepsilon_n$ avec $\\varepsilon_n \\sim \\mathcal N(0, \\sigma^2)$ et a priori $\\theta \\sim \\mathcal N(0, \\tau^2)$. Donne l'estimation du maximum a posteriori.",
    promptTex: `${data} \\qquad \\sigma^2 = ${s2} \\qquad \\tau^2 = ${fracTex(t2n, t2d)}`,
    answerTex: fracTex(sxy * lamDen, sxx * lamDen + lamNum),
    hint: "Minimise $\\frac{1}{2\\sigma^2}\\sum (y_n - \\theta x_n)^2 + \\frac{\\theta^2}{2\\tau^2}$ : $\\hat\\theta = \\sum x_n y_n / (\\sum x_n^2 + \\lambda)$ avec $\\lambda = \\sigma^2/\\tau^2$.",
    solution: [`\\lambda = ${fracTex(lamNum, lamDen)} \\qquad \\hat\\theta = \\frac{${sxy}}{${sxx} + ${fracTex(lamNum, lamDen)}} = ${fracTex(sxy * lamDen, sxx * lamDen + lamNum)}`],
  };
}

export const vraisemblanceGenerators: ExerciseGenerator[] = [
  { id: "mle-simple", make: mleSimple },
  { id: "mle-gaussienne", make: mleGaussian },
  { id: "entropie-croisee", make: crossEntropy },
  { id: "beta-posterieur", make: betaPosterior },
  { id: "map-ridge", make: mapRidge },
];
