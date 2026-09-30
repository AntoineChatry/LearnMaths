import { fracTex, pick, randInt } from "../../lib/random";
import type { Exercise, ExerciseGenerator } from "../types";

// Chebyshev inequality: bound for a deviation, bound in standard deviations, sample size for a guarantee.
function chebyshev(): Exercise {
  const kind = randInt(0, 2);
  if (kind === 0) {
    const v = randInt(1, 20);
    let e = randInt(2, 10);
    while (e * e <= v) e += 1;
    return {
      intro: "Avec l'inégalité de Tchebychev, donne une borne supérieure de $P(|X - \\mu| \\ge \\varepsilon)$.",
      promptTex: `V(X) = ${v} \\qquad \\varepsilon = ${e}`,
      answerTex: fracTex(v, e * e),
      hint: "$P(|X - \\mu| \\ge \\varepsilon) \\le V(X) / \\varepsilon^2$.",
      solution: [`\\frac{${v}}{${e}^2} = ${fracTex(v, e * e)}`],
    };
  }
  if (kind === 1) {
    const [p, q] = pick([[3, 2], [2, 1], [5, 2], [3, 1], [4, 1], [5, 1], [10, 1]] as [number, number][]);
    return {
      intro: "Quelle que soit la loi de $X$, quelle borne l'inégalité de Tchebychev donne-t-elle pour la probabilité de s'écarter de la moyenne d'au moins $k$ écarts types ?",
      promptTex: `k = ${fracTex(p, q)}`,
      answerTex: fracTex(q * q, p * p),
      hint: "Prends $\\varepsilon = k\\sigma$ : la borne devient $1/k^2$.",
      solution: [`\\frac{\\sigma^2}{(k\\sigma)^2} = \\frac{1}{k^2} = ${fracTex(q * q, p * p)}`],
    };
  }
  const s2 = pick([1, 2, 4, 9]);
  const [en, ed] = pick([[1, 10], [1, 5], [1, 2], [1, 4]] as [number, number][]);
  const [dn, dd] = pick([[1, 10], [1, 20], [1, 100], [1, 4]] as [number, number][]);
  // n = s2 / (eps² delta) = s2 ed² dd / (en² dn)
  const n = (s2 * ed * ed * dd) / (en * en * dn);
  return {
    intro: "On estime $\\mu$ par la moyenne $A_n$ de $n$ tirages indépendants de variance $\\sigma^2$. D'après Tchebychev, combien de tirages suffisent pour garantir $P(|A_n - \\mu| \\ge \\varepsilon) \\le \\delta$ ?",
    promptTex: `\\sigma^2 = ${s2} \\qquad \\varepsilon = ${fracTex(en, ed)} \\qquad \\delta = ${fracTex(dn, dd)}`,
    answerTex: String(n),
    hint: "$V(A_n) = \\sigma^2 / n$, donc la borne est $\\sigma^2 / (n\\varepsilon^2)$ : résous $\\sigma^2/(n\\varepsilon^2) = \\delta$.",
    solution: [`n = \\frac{\\sigma^2}{\\varepsilon^2 \\delta} = \\frac{${s2}}{${fracTex(en * en, ed * ed)} \\times ${fracTex(dn, dd)}} = ${n}`],
  };
}

// Mean of n independent draws: expectation, variance, standard deviation.
function sampleMean(): Exercise {
  const mu = randInt(-5, 10);
  const kind = randInt(0, 2);
  if (kind === 0) {
    const s2 = randInt(1, 30);
    const n = pick([2, 4, 5, 10, 25, 50, 100]);
    return {
      intro: "$A_n$ est la moyenne de $n$ variables indépendantes d'espérance $\\mu$ et de variance $\\sigma^2$. Donne $V(A_n)$.",
      promptTex: `\\mu = ${mu} \\qquad \\sigma^2 = ${s2} \\qquad n = ${n}`,
      answerTex: fracTex(s2, n),
      hint: "$V(A_n) = \\sigma^2 / n$ : la moyenne n'a pas d'effet sur la variance.",
      solution: [`V(A_n) = \\frac{${s2}}{${n}} = ${fracTex(s2, n)}`],
    };
  }
  if (kind === 1) {
    const sigma = randInt(1, 12);
    const k = randInt(2, 10);
    return {
      intro: "$A_n$ est la moyenne de $n$ variables indépendantes d'écart type $\\sigma$. Donne l'écart type de $A_n$.",
      promptTex: `\\sigma = ${sigma} \\qquad n = ${k * k}`,
      answerTex: fracTex(sigma, k),
      hint: "L'écart type de la moyenne est $\\sigma / \\sqrt n$.",
      solution: [`\\frac{${sigma}}{\\sqrt{${k * k}}} = ${fracTex(sigma, k)}`],
    };
  }
  const n0 = pick([100, 1000, 400, 2500]);
  const k = randInt(2, 10);
  return {
    intro: "Une estimation de Monte-Carlo moyenne $n_0$ tirages. Combien de tirages faut-il pour diviser son erreur typique (son écart type) par $k$ ?",
    promptTex: `n_0 = ${n0} \\qquad k = ${k}`,
    answerTex: String(n0 * k * k),
    hint: "L'erreur typique est $\\sigma/\\sqrt n$ : la diviser par $k$ demande $k^2$ fois plus de tirages.",
    solution: [`n = k^2 n_0 = ${k * k} \\times ${n0} = ${n0 * k * k}`],
  };
}

// Normal approximation of a sum of dice or of a Bernoulli count.
function cltSum(): Exercise {
  const kind = randInt(0, 2);
  if (kind < 2) {
    const n = pick([12, 24, 36, 60, 120, 240, 420]);
    const mean = kind === 0;
    return {
      intro: `On lance $n$ dés équilibrés et $S_n$ est la somme. Le théorème central limite l'approche par une gaussienne. Donne ${mean ? "sa moyenne" : "sa variance"}.`,
      promptTex: `n = ${n}`,
      answerTex: mean ? fracTex(7 * n, 2) : fracTex(35 * n, 12),
      hint: "Un dé : $\\mu = 7/2$, $\\sigma^2 = 35/12$. La somme : $n\\mu$ et $n\\sigma^2$.",
      solution: [mean ? `n\\mu = ${n} \\times \\frac{7}{2} = ${fracTex(7 * n, 2)}` : `n\\sigma^2 = ${n} \\times \\frac{35}{12} = ${fracTex(35 * n, 12)}`],
    };
  }
  // Bernoulli count: standardized value of an observed count.
  const [p, q, n] = pick([[1, 2, 100], [1, 2, 400], [1, 5, 100], [1, 5, 400], [1, 10, 900], [1, 2, 64]] as [number, number, number][]);
  const mean = (n * p) / q;
  const sd = Math.sqrt((n * p * (q - p)) / (q * q));
  let j = randInt(-3, 3);
  if ((j * sd) % 2 !== 0) j += j < 3 ? 1 : -1; // keep the observed count an integer
  const s = mean + j * (sd / 2);
  const sTex = String(s);
  // z = (s - mean) / sd, both multiples of sd/2 → z is a multiple of 1/2
  const zNum = Math.round(((s - mean) / sd) * 2);
  return {
    intro: "On compte les succès $S_n$ en $n$ essais indépendants de probabilité $p$. Donne la valeur standardisée $z = (s - np)/\\sqrt{np(1-p)}$ du compte observé $s$.",
    promptTex: `n = ${n} \\qquad p = ${fracTex(p, q)} \\qquad s = ${sTex}`,
    answerTex: fracTex(zNum, 2),
    hint: "$np$ est la moyenne, $\\sqrt{np(1-p)}$ l'écart type.",
    solution: [`np = ${mean} \\qquad \\sqrt{np(1-p)} = ${sd}`, `z = \\frac{${sTex} - ${mean}}{${sd}} = ${fracTex(zNum, 2)}`],
  };
}

// 95 % confidence interval for an accuracy, and the sample size for a guaranteed margin.
function confidence(): Exercise {
  if (Math.random() < 0.6) {
    const [pn, pd, rn, rd] = pick([[1, 2, 1, 2], [1, 5, 2, 5], [4, 5, 2, 5], [1, 10, 3, 10], [9, 10, 3, 10]] as [number, number, number, number][]);
    // sqrt(p(1-p)) = rn/rd
    const k = pick([10, 20, 25, 40, 50, 100]);
    return {
      intro: "Un modèle obtient une précision mesurée $\\hat p$ sur $n$ exemples de test. Donne la demi-largeur de l'intervalle de confiance à 95 %, $2\\sqrt{\\hat p(1 - \\hat p)/n}$.",
      promptTex: `\\hat p = ${fracTex(pn, pd)} \\qquad n = ${k * k}`,
      answerTex: fracTex(2 * rn, rd * k),
      hint: "Calcule $\\hat p(1 - \\hat p)$, divise par $n$, prends la racine et multiplie par 2.",
      solution: [`\\hat p(1 - \\hat p) = ${fracTex(pn * (pd - pn), pd * pd)} \\qquad 2\\sqrt{\\frac{${fracTex(pn * (pd - pn), pd * pd)}}{${k * k}}} = 2 \\times \\frac{${fracTex(rn, rd)}}{${k}} = ${fracTex(2 * rn, rd * k)}`],
    };
  }
  const m = pick([10, 20, 25, 50, 100]);
  return {
    intro: "Combien d'exemples de test faut-il pour que la demi-largeur $2\\sqrt{p(1-p)/n}$ de l'intervalle à 95 % soit au plus $1/m$, quelle que soit la précision $p$ ?",
    promptTex: `m = ${m}`,
    answerTex: String(m * m),
    hint: "Au pire $p(1-p) = 1/4$, et la demi-largeur vaut alors $1/\\sqrt n$.",
    solution: [`2\\sqrt{\\frac{1/4}{n}} = \\frac{1}{\\sqrt n} \\le \\frac{1}{${m}} \\iff n \\ge ${m * m}`],
  };
}

// Gradient noise scale (McCandlish et al. 2018): B_simple, relative error, expected progress per step.
function gradientNoise(): Exercise {
  const kind = randInt(0, 2);
  if (kind === 0) {
    const vars = [randInt(1, 9), randInt(1, 9), randInt(1, 9)];
    const g = [randInt(-3, 3), randInt(-3, 3), randInt(1, 3)];
    const g2 = g.reduce((s, v) => s + v * v, 0);
    const tr = vars.reduce((s, v) => s + v, 0);
    return {
      intro: "Les gradients par exemple ont une covariance diagonale $\\Sigma$ et le vrai gradient est $G$. Donne l'échelle de bruit $B_{\\text{simple}} = \\text{tr}(\\Sigma)/\\|G\\|^2$.",
      promptTex: `\\Sigma = \\text{diag}(${vars.join(", ")}) \\qquad G = (${g.join(", ")})`,
      answerTex: fracTex(tr, g2),
      hint: "La trace est la somme des variances ; $\\|G\\|^2$ la somme des carrés des composantes.",
      solution: [`\\frac{${vars.join(" + ")}}{${g.map((v) => (v < 0 ? `(${v})^2` : `${v}^2`)).join(" + ")}} = \\frac{${tr}}{${g2}} = ${fracTex(tr, g2)}`],
    };
  }
  const bs = pick([4, 10, 16, 32, 100, 250, 1000]);
  const B = pick([1, 2, 4, 8, 16, 64, 256, 1024]);
  if (kind === 1)
    return {
      intro: "Avec une échelle de bruit $B_{\\text{simple}}$, donne l'erreur relative moyenne $E(\\|G_{\\text{est}} - G\\|^2)/\\|G\\|^2$ d'un minibatch de taille $B$.",
      promptTex: `B_{\\text{simple}} = ${bs} \\qquad B = ${B}`,
      answerTex: fracTex(bs, B),
      hint: "La covariance du gradient de minibatch est $\\Sigma/B$ : l'erreur relative vaut $B_{\\text{simple}}/B$.",
      solution: [`\\frac{${bs}}{${B}} = ${fracTex(bs, B)}`],
    };
  return {
    intro: "Selon McCandlish et al., le progrès espéré d'un pas optimal avec un minibatch de taille $B$ vaut $\\Delta L_{\\max}/(1 + B_{\\text{noise}}/B)$. Quelle fraction de $\\Delta L_{\\max}$ obtient-on ?",
    promptTex: `B_{\\text{noise}} = ${bs} \\qquad B = ${B}`,
    answerTex: fracTex(B, B + bs),
    hint: "$\\frac{1}{1 + B_{\\text{noise}}/B} = \\frac{B}{B + B_{\\text{noise}}}$.",
    solution: [`\\frac{${B}}{${B} + ${bs}} = ${fracTex(B, B + bs)}`],
  };
}

export const grandsNombresGenerators: ExerciseGenerator[] = [
  { id: "tchebychev", make: chebyshev },
  { id: "moyenne-empirique", make: sampleMean },
  { id: "tcl-somme", make: cltSum },
  { id: "intervalle-confiance", make: confidence },
  { id: "bruit-gradient", make: gradientNoise },
];
