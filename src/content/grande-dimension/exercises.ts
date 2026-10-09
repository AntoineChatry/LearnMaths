import { fracTex, pick, randInt } from "../../lib/random";
import type { Exercise, ExerciseGenerator } from "../types";

// Coordinate variances, as [TeX, numerator, denominator].
const VARS: [string, number, number][] = [
  ["1", 1, 1],
  ["4", 4, 1],
  ["9", 9, 1],
  ["\\frac14", 1, 4],
  ["\\frac19", 1, 9],
];

// E||X||^2 = d sigma^2, the typical norm sqrt(d) sigma, or E||X - Y||^2 = 2 d sigma^2.
function norme(): Exercise {
  const [vTex, vn, vd] = pick(VARS);
  const kind = randInt(0, 2);
  if (kind === 1) {
    const r = pick([10, 20, 30, 50, 100]);
    const d = r * r;
    const ans = fracTex(r * Math.sqrt(vn), Math.sqrt(vd)); // r sigma, exact: vn and vd are perfect squares
    return {
      intro: `Les ${d.toLocaleString("fr-FR")} coordonnées de $X$ sont indépendantes, centrées, de variance $\\sigma^2$. Autour de quelle valeur la norme $\\|X\\|$ se concentre-t-elle ?`,
      promptTex: `d = ${d} \\qquad \\sigma^2 = ${vTex} \\qquad \\|X\\| \\approx \\ ?`,
      answerTex: ans,
      hint: "$\\mathbb E\\,\\|X\\|^2 = d\\sigma^2$, et la norme s'écarte peu de la racine de cette valeur.",
      solution: [`\\|X\\| \\approx \\sqrt{d\\,\\sigma^2} = \\sqrt{${d}} \\times \\sqrt{${vTex}} = ${ans}`],
    };
  }
  const d = pick([10, 50, 100, 300, 768, 1000, 4096]);
  if (kind === 0) {
    const ans = fracTex(d * vn, vd);
    return {
      intro: "Les coordonnées de $X \\in \\mathbb R^d$ sont indépendantes, centrées, de variance $\\sigma^2$. Calcule $\\mathbb E\\,\\|X\\|^2$.",
      promptTex: `d = ${d} \\qquad \\sigma^2 = ${vTex} \\qquad \\mathbb E\\,\\|X\\|^2 = \\ ?`,
      answerTex: ans,
      hint: "$\\|X\\|^2 = \\sum_i X_i^2$, et $\\mathbb E\\,X_i^2 = \\sigma^2$ pour une variable centrée.",
      solution: [`\\mathbb E\\,\\|X\\|^2 = \\sum_{i=1}^{${d}} \\mathbb E\\,X_i^2 = ${d} \\times ${vTex} = ${ans}`],
    };
  }
  const ans = fracTex(2 * d * vn, vd);
  return {
    intro: "$X$ et $Y$ sont indépendants dans $\\mathbb R^d$, à coordonnées indépendantes, centrées, de variance $\\sigma^2$. Calcule $\\mathbb E\\,\\|X - Y\\|^2$.",
    promptTex: `d = ${d} \\qquad \\sigma^2 = ${vTex} \\qquad \\mathbb E\\,\\|X - Y\\|^2 = \\ ?`,
    answerTex: ans,
    hint: "Les coordonnées $X_i - Y_i$ sont centrées, et les variances de variables indépendantes s'additionnent.",
    solution: [`\\mathrm{Var}(X_i - Y_i) = 2\\sigma^2 \\qquad \\mathbb E\\,\\|X - Y\\|^2 = ${d} \\times 2 \\times ${vTex} = ${ans}`],
  };
}

// Vaswani note 4: Var(q . k) = d_k sigma_q^2 sigma_k^2; standard deviation before or after the 1/sqrt(d_k) scaling.
function attention(): Exercise {
  const dk = pick([16, 64, 128, 256, 512, 1024]);
  const [qTex, qn, qd] = pick(VARS.slice(0, 3));
  const [kTex, kn, kd] = pick(VARS.slice(0, 3));
  const kind = randInt(0, 2);
  const given = `d_k = ${dk} \\qquad \\mathrm{Var}(q_i) = ${qTex} \\qquad \\mathrm{Var}(k_i) = ${kTex}`;
  const intro =
    "Les composantes de la requête $q$ et de la clé $k$ sont indépendantes et centrées, avec les variances ci-dessous.";
  const varTex = fracTex(dk * qn * kn, qd * kd);
  if (kind === 0) {
    return {
      intro: `${intro} Calcule la variance du score brut $q \\cdot k$.`,
      promptTex: `${given} \\qquad \\mathrm{Var}(q \\cdot k) = \\ ?`,
      answerTex: varTex,
      hint: "$q \\cdot k = \\sum_i q_i k_i$, termes indépendants ; pour $q_i$, $k_i$ indépendants et centrés, $\\mathrm{Var}(q_i k_i) = \\mathrm{Var}(q_i)\\,\\mathrm{Var}(k_i)$.",
      solution: [`\\mathrm{Var}(q \\cdot k) = d_k\\,\\mathrm{Var}(q_i)\\,\\mathrm{Var}(k_i) = ${dk} \\times ${qTex} \\times ${kTex} = ${varTex}`],
    };
  }
  const sq = Math.sqrt(qn * kn); // 1, 2, 3, 4, 6 or 9
  if (kind === 1) {
    if (!Number.isInteger(Math.sqrt(dk))) return attention(); // the standard deviation must be an integer
    const ans = String(Math.sqrt(dk) * sq);
    return {
      intro: `${intro} Donne l'écart-type du score brut $q \\cdot k$, sans division.`,
      promptTex: `${given} \\qquad \\sigma(q \\cdot k) = \\ ?`,
      answerTex: ans,
      hint: "Commencez par la variance de $q \\cdot k$, puis prenez la racine.",
      solution: [`\\sigma(q \\cdot k) = \\sqrt{d_k\\,\\mathrm{Var}(q_i)\\,\\mathrm{Var}(k_i)} = \\sqrt{${varTex}} = ${ans}`],
    };
  }
  return {
    intro: `${intro} Donne l'écart-type du score mis à l'échelle $q \\cdot k / \\sqrt{d_k}$, comme dans un Transformer.`,
    promptTex: `${given} \\qquad \\sigma\\Big(\\frac{q \\cdot k}{\\sqrt{d_k}}\\Big) = \\ ?`,
    answerTex: String(sq),
    hint: "Diviser par $\\sqrt{d_k}$ divise la variance par $d_k$.",
    solution: [`\\mathrm{Var}\\Big(\\frac{q \\cdot k}{\\sqrt{d_k}}\\Big) = \\frac{${varTex}}{${dk}} = ${qn * kn} \\qquad \\sigma = ${sq}`],
  };
}

// Two independent uniform directions: E<X,Y>^2 = 1/d, typical |cos| = 1/sqrt(d); unnormalized: E<X,Y>^2 = d.
function cosinus(): Exercise {
  const kind = randInt(0, 2);
  if (kind === 0) {
    const d = pick([3, 10, 50, 100, 512, 768, 1000]);
    return {
      intro: "$X$ et $Y$ sont deux vecteurs unitaires indépendants de $\\mathbb R^d$, de direction uniforme. Calcule $\\mathbb E\\,\\langle X, Y \\rangle^2$.",
      promptTex: `d = ${d} \\qquad \\|X\\| = \\|Y\\| = 1 \\qquad \\mathbb E\\,\\langle X, Y \\rangle^2 = \\ ?`,
      answerTex: fracTex(1, d),
      hint: "Fixez $X$ ; par symétrie, les $d$ coordonnées de $Y$ ont le même carré moyen, et leurs carrés somment à 1.",
      solution: [`\\mathbb E\\,Y_i^2 = \\frac1d \\qquad \\mathbb E\\,\\langle X, Y \\rangle^2 = \\sum_i X_i^2\\, \\mathbb E\\,Y_i^2 = \\frac{1}{${d}}`],
    };
  }
  if (kind === 1) {
    const r = pick([10, 20, 25, 50, 100]);
    const d = r * r;
    return {
      intro: "$X$ et $Y$ sont deux directions indépendantes et uniformes de $\\mathbb R^d$. Quel est l'ordre de grandeur typique de $|\\cos \\theta|$, au sens de $\\sqrt{\\mathbb E \\cos^2 \\theta}$ ?",
      promptTex: `d = ${d} \\qquad \\sqrt{\\mathbb E \\cos^2\\theta} = \\ ?`,
      answerTex: fracTex(1, r),
      hint: "Pour des vecteurs unitaires, $\\cos\\theta = \\langle X, Y \\rangle$, et $\\mathbb E\\,\\langle X, Y \\rangle^2 = 1/d$.",
      solution: [`\\sqrt{\\mathbb E \\cos^2\\theta} = \\frac{1}{\\sqrt d} = \\frac{1}{\\sqrt{${d}}} = \\frac{1}{${r}}`],
    };
  }
  const d = pick([10, 64, 100, 512, 1000]);
  return {
    intro: "$X$ et $Y$ sont indépendants dans $\\mathbb R^d$, à coordonnées indépendantes de loi $N(0, 1)$, sans normalisation. Calcule $\\mathbb E\\,\\langle X, Y \\rangle^2$.",
    promptTex: `d = ${d} \\qquad X_i, Y_i \\sim N(0, 1) \\qquad \\mathbb E\\,\\langle X, Y \\rangle^2 = \\ ?`,
    answerTex: String(d),
    hint: "$\\langle X, Y \\rangle = \\sum_i X_i Y_i$ est centré ; sa variance est la somme des $\\mathrm{Var}(X_i Y_i) = 1$.",
    solution: [`\\mathbb E\\,\\langle X, Y \\rangle^2 = \\mathrm{Var}\\Big(\\sum_i X_i Y_i\\Big) = ${d} \\times 1 = ${d}`],
  };
}

// Johnson-Lindenstrauss: k = 20 ln N / eps^2 (Mohri lemma 15.4), or E||Pz||^2 = (m/n) ||z||^2 (Vershynin lemma 5.3.2).
function jl(): Exercise {
  if (Math.random() < 0.6) {
    const [epsTex, inv] = pick([
      ["0{,}1", 10],
      ["0{,}2", 5],
      ["0{,}25", 4],
      ["0{,}05", 20],
    ] as [string, number][]);
    const N = pick([100, 1000, 10000, 1000000]);
    const c = 20 * inv * inv;
    const ans = `${c}\\ln ${N}`;
    return {
      intro: `On veut projeter ${N.toLocaleString("fr-FR")} points en conservant toutes leurs distances au carré à un facteur $1 \\pm \\varepsilon$ près. Quelle dimension $k$ donne la formule du lemme de Johnson-Lindenstrauss de Mohri ? Forme exacte.`,
      promptTex: `N = ${N} \\qquad \\varepsilon = ${epsTex} \\qquad k = \\ ?`,
      answerTex: ans,
      hint: "$k = \\frac{20 \\ln N}{\\varepsilon^2}$, quelle que soit la dimension de départ.",
      solution: [`k = \\frac{20 \\ln ${N}}{${epsTex}^2} = 20 \\times ${inv * inv} \\ln ${N} = ${ans}`],
    };
  }
  const n = pick([1000, 2000, 5000, 10000]);
  const m = pick([10, 50, 100, 200, 500]);
  const z2 = pick([1, 4, 25, 100]);
  const ans = fracTex(m * z2, n);
  return {
    intro: "On projette un vecteur fixé $z \\in \\mathbb R^n$ sur un sous-espace aléatoire de dimension $m$, de loi uniforme. Calcule $\\mathbb E\\,\\|Pz\\|^2$.",
    promptTex: `n = ${n} \\qquad m = ${m} \\qquad \\|z\\|^2 = ${z2} \\qquad \\mathbb E\\,\\|Pz\\|^2 = \\ ?`,
    answerTex: ans,
    hint: "Tourner le sous-espace revient à tourner $z$ : chacune des $m$ coordonnées gardées porte en moyenne $1/n$ de $\\|z\\|^2$.",
    solution: [`\\mathbb E\\,\\|Pz\\|^2 = \\frac{m}{n}\\,\\|z\\|^2 = \\frac{${m}}{${n}} \\times ${z2} = ${ans}`],
  };
}

export const grandeDimensionGenerators: ExerciseGenerator[] = [
  { id: "gd-norme", make: norme },
  { id: "gd-attention", make: attention },
  { id: "gd-cosinus", make: cosinus },
  { id: "gd-jl", make: jl },
];
