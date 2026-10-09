import { fracTex, pick, randInt } from "../../lib/random";
import type { Exercise, ExerciseGenerator } from "../types";

const binom = (n: number, k: number) => {
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return Math.round(r);
};

// Simple random walk: P(S_n = k) = C(n, (n + k)/2) / 2^n, and u_2m = C(2m, m) / 4^m (Grinstead and Snell, theorem 12.1).
function position(): Exercise {
  if (Math.random() < 0.4) {
    const m = randInt(1, 5);
    const ans = fracTex(binom(2 * m, m), 4 ** m);
    return {
      intro: "Marche aléatoire simple partie de 0, pas de +1 ou −1 avec probabilité 1/2. Quelle est la probabilité d'être en 0 au temps $2m$ ?",
      promptTex: `2m = ${2 * m} \\qquad P(S_{${2 * m}} = 0) = \\ ?`,
      answerTex: ans,
      hint: "Il faut exactement $m$ pas +1 parmi les $2m$ : $\\binom{2m}{m}$ chemins, chacun de probabilité $2^{-2m}$.",
      solution: [`P(S_{${2 * m}} = 0) = \\binom{${2 * m}}{${m}}\\, 2^{-${2 * m}} = \\frac{${binom(2 * m, m)}}{${4 ** m}} = ${ans}`],
    };
  }
  const n = randInt(2, 8);
  // k has the parity of n and |k| <= n, k != 0 here (the case k = 0 is the other kind).
  const ks = Array.from({ length: n + 1 }, (_, i) => -n + 2 * i).filter((k) => k !== 0);
  const k = pick(ks);
  const up = (n + k) / 2;
  const ans = fracTex(binom(n, up), 2 ** n);
  return {
    intro: "Marche aléatoire simple partie de 0, pas de +1 ou −1 avec probabilité 1/2. Quelle est la probabilité d'être à la position $k$ après $n$ pas ?",
    promptTex: `n = ${n} \\qquad k = ${k} \\qquad P(S_{${n}} = ${k}) = \\ ?`,
    answerTex: ans,
    hint: "Avec $u$ pas +1 et $n - u$ pas −1, on arrive en $2u - n$ : résolvez en $u$, puis comptez les chemins.",
    solution: [`u = \\frac{n + k}{2} = ${up} \\qquad P(S_{${n}} = ${k}) = \\binom{${n}}{${up}}\\, 2^{-${n}} = ${ans}`],
  };
}

// Gambler's ruin (Durrett, theorem 4.8.7; Grinstead and Snell, section 12.2).
function ruine(): Exercise {
  const kind = randInt(0, 2);
  if (kind === 2) {
    // Biased coin, a = 0: P_x(reach b) = (r^x - 1) / (r^b - 1) with r = (1 - p) / p.
    const [pTex, rn, rd] = pick([
      ["\\frac23", 1, 2],
      ["\\frac13", 2, 1],
    ] as [string, number, number][]);
    const b = randInt(3, 5);
    const x = randInt(1, b - 1);
    // (r^x - 1)/(r^b - 1) with r = rn/rd: multiply by rd^b.
    const num = (rn ** x * rd ** (b - x) - rd ** b);
    const den = rn ** b - rd ** b;
    const ans = fracTex(num, den);
    const r = fracTex(rn, rd);
    return {
      intro: "Un joueur gagne chaque coup avec probabilité $p$ et perd sinon, en misant 1 euro ; il s'arrête ruiné en 0 ou à l'objectif $b$. Probabilité d'atteindre l'objectif ?",
      promptTex: `p = ${pTex} \\qquad x = ${x} \\qquad b = ${b} \\qquad P_{${x}}(\\text{atteindre } ${b}) = \\ ?`,
      answerTex: ans,
      hint: "Avec $r = (1 - p)/p$ : $P_x(\\text{atteindre } b) = \\frac{r^x - 1}{r^b - 1}$.",
      solution: [`r = ${r} \\qquad P_{${x}} = \\frac{(${r})^{${x}} - 1}{(${r})^{${b}} - 1} = ${ans}`],
    };
  }
  const a = pick([0, 0, -2, -5]);
  const b = a + randInt(4, 12);
  const x = randInt(a + 1, b - 1);
  if (kind === 0) {
    const ans = fracTex(x - a, b - a);
    return {
      intro: "Une marche aléatoire simple équilibrée part de $x$ et s'arrête dès qu'elle touche $a$ ou $b$. Probabilité de toucher $b$ en premier ?",
      promptTex: `a = ${a} \\qquad x = ${x} \\qquad b = ${b} \\qquad P_x(b \\text{ avant } a) = \\ ?`,
      answerTex: ans,
      hint: "La position moyenne reste $x$ : $b\\,P + a\\,(1 - P) = x$.",
      solution: [`P_x(b \\text{ avant } a) = \\frac{x - a}{b - a} = \\frac{${x} - (${a})}{${b} - (${a})} = ${ans}`],
    };
  }
  const ans = String((b - x) * (x - a));
  return {
    intro: "Une marche aléatoire simple équilibrée part de $x$ et s'arrête dès qu'elle touche $a$ ou $b$. Combien de pas dure-t-elle en moyenne ?",
    promptTex: `a = ${a} \\qquad x = ${x} \\qquad b = ${b} \\qquad \\mathbb E_x(\\text{durée}) = \\ ?`,
    answerTex: ans,
    hint: "$\\mathbb E_x(\\text{durée}) = (b - x)(x - a)$.",
    solution: [`\\mathbb E_x(\\text{durée}) = (b - x)(x - a) = ${b - x} \\times ${x - a} = ${ans}`],
  };
}

// Brownian motion: Var(B_t - B_s) = t - s, Cov(B_s, B_t) = min(s, t), standard deviation sqrt(t), scaling.
function brownien(): Exercise {
  const kind = randInt(0, 3);
  if (kind === 0) {
    const s = randInt(1, 6);
    const t = s + randInt(1, 6);
    const ans = String(t - s);
    return {
      intro: "$(B_t)$ est un mouvement brownien standard. Calcule la variance de l'accroissement.",
      promptTex: `\\mathrm{Var}(B_{${t}} - B_{${s}}) = \\ ?`,
      answerTex: ans,
      hint: "$B_t - B_s \\sim N(0, t - s)$.",
      solution: [`B_{${t}} - B_{${s}} \\sim N(0,\\ ${t} - ${s}) \\qquad \\mathrm{Var} = ${ans}`],
    };
  }
  if (kind === 1) {
    const s = randInt(1, 6);
    const t = s + randInt(1, 6);
    // Var(B_s + B_t) = s + t + 2 min(s, t) = 3s + t.
    const ans = String(3 * s + t);
    return {
      intro: "$(B_t)$ est un mouvement brownien standard. Calcule la variance de la somme.",
      promptTex: `\\mathrm{Var}(B_{${s}} + B_{${t}}) = \\ ?`,
      answerTex: ans,
      hint: "Écrivez $B_t = B_s + (B_t - B_s)$, où l'accroissement est indépendant de $B_s$.",
      solution: [
        `B_{${s}} + B_{${t}} = 2B_{${s}} + (B_{${t}} - B_{${s}})`,
        `\\mathrm{Var} = 4 \\times ${s} + (${t} - ${s}) = ${ans}`,
      ],
    };
  }
  if (kind === 2) {
    const r = randInt(2, 10);
    const t = r * r;
    return {
      intro: "$(B_t)$ est un mouvement brownien standard. Quel est l'écart-type de sa position au temps $t$ ?",
      promptTex: `t = ${t} \\qquad \\sigma(B_{${t}}) = \\ ?`,
      answerTex: String(r),
      hint: "$B_t \\sim N(0, t)$ : la variance est $t$, l'écart-type $\\sqrt t$.",
      solution: [`\\sigma(B_{${t}}) = \\sqrt{${t}} = ${r}`],
    };
  }
  // Scaling: a random walk with n steps per unit time and steps of size h; Var at time 1 = n h^2.
  const n = pick([100, 400, 900, 2500, 10000]);
  const ans = fracTex(1, Math.round(Math.sqrt(n)));
  return {
    intro: `On fait ${n.toLocaleString("fr-FR")} pas de ±$h$ par unité de temps. Quelle taille de pas $h$ donne une variance égale à 1 au temps 1, comme pour un mouvement brownien ?`,
    promptTex: `n = ${n} \\qquad \\mathrm{Var}(S_n) = n h^2 = 1 \\qquad h = \\ ?`,
    answerTex: ans,
    hint: "La variance d'une somme de $n$ pas indépendants de variance $h^2$ vaut $n h^2$.",
    solution: [`h = \\frac{1}{\\sqrt n} = \\frac{1}{\\sqrt{${n}}} = ${ans}`],
  };
}

// Noise with a pull back: AR(1) chain x_t = a x_{t-1} + b eps (stationary variance b^2 / (1 - a^2)),
// the diffusion step a = sqrt(1 - beta), b = sqrt(beta), and Ornstein-Uhlenbeck q / (2 lambda).
function rappel(): Exercise {
  const kind = randInt(0, 2);
  if (kind === 0) {
    // 1 - beta is a perfect square, so that sqrt(abar) is rational.
    const [aTex, an, ad] = pick([
      ["\\frac12", 1, 2],
      ["\\frac23", 2, 3],
      ["\\frac34", 3, 4],
      ["\\frac35", 3, 5],
    ] as [string, number, number][]);
    const beta = fracTex(ad * ad - an * an, ad * ad);
    const t = randInt(1, 3);
    const x0 = pick([1, 2, 3, 4, 5, 8, 9]);
    const askMean = Math.random() < 0.5;
    const mean = fracTex(x0 * an ** t, ad ** t);
    const varTex = fracTex(ad ** (2 * t) - an ** (2 * t), ad ** (2 * t));
    return {
      intro: "La chaîne $x_t = \\sqrt{1 - \\beta}\\, x_{t-1} + \\sqrt\\beta\\, \\varepsilon_t$, avec des $\\varepsilon_t \\sim N(0, 1)$ indépendants, part de $x_0$. Calcule la quantité demandée, en notant $\\bar\\alpha_t = (1 - \\beta)^t$.",
      promptTex: `\\beta = ${beta} \\qquad x_0 = ${x0} \\qquad ${askMean ? `\\mathbb E(x_{${t}})` : `\\mathrm{Var}(x_{${t}})`} = \\ ?`,
      answerTex: askMean ? mean : varTex,
      hint: "$x_t \\mid x_0 \\sim N\\big(\\sqrt{\\bar\\alpha_t}\\, x_0,\\ 1 - \\bar\\alpha_t\\big)$.",
      solution: askMean
        ? [`\\sqrt{1 - \\beta} = ${aTex} \\qquad \\mathbb E(x_{${t}}) = (${aTex})^{${t}} \\times ${x0} = ${mean}`]
        : [`\\bar\\alpha_{${t}} = (${aTex})^{${2 * t}} \\qquad \\mathrm{Var}(x_{${t}}) = 1 - \\bar\\alpha_{${t}} = ${varTex}`],
    };
  }
  if (kind === 1) {
    const [aTex, an, ad] = pick([
      ["\\frac12", 1, 2],
      ["\\frac13", 1, 3],
      ["\\frac23", 2, 3],
      ["\\frac34", 3, 4],
    ] as [string, number, number][]);
    const b2 = pick([1, 2, 3]);
    // b^2 / (1 - a^2) = b2 ad^2 / (ad^2 - an^2)
    const ans = fracTex(b2 * ad * ad, ad * ad - an * an);
    return {
      intro: "La chaîne $x_t = a\\, x_{t-1} + b\\, \\varepsilon_t$, avec des $\\varepsilon_t \\sim N(0, 1)$ indépendants et $|a| < 1$, a une loi stationnaire gaussienne centrée. Quelle est sa variance ?",
      promptTex: `a = ${aTex} \\qquad b^2 = ${b2} \\qquad \\mathrm{Var}_\\infty = \\ ?`,
      answerTex: ans,
      hint: "À l'équilibre, $x_t$ et $x_{t-1}$ ont la même variance $v$ : $v = a^2 v + b^2$.",
      solution: [`v = a^2 v + b^2 \\quad\\Rightarrow\\quad v = \\frac{b^2}{1 - a^2} = \\frac{${b2}}{1 - (${aTex})^2} = ${ans}`],
    };
  }
  const lam = pick([[1, 2], [1, 1], [2, 1], [1, 4], [3, 1]] as [number, number][]);
  const q = randInt(1, 4);
  const lamTex = fracTex(lam[0], lam[1]);
  const ans = fracTex(q * lam[1], 2 * lam[0]);
  return {
    intro: "Le processus d'Ornstein-Uhlenbeck $dx = -\\lambda x\\, dt + dB$, où le bruit a une densité spectrale $q$, a une loi stationnaire $N(0, v)$. Calcule $v$.",
    promptTex: `\\lambda = ${lamTex} \\qquad q = ${q} \\qquad v = \\ ?`,
    answerTex: ans,
    hint: "La loi stationnaire d'Ornstein-Uhlenbeck est $N\\big(0,\\ q / 2\\lambda\\big)$ : le rappel et le bruit s'équilibrent.",
    solution: [`v = \\frac{q}{2\\lambda} = \\frac{${q}}{2 \\times ${lamTex}} = ${ans}`],
  };
}

export const marchesAleatoiresGenerators: ExerciseGenerator[] = [
  { id: "ma-position", make: position },
  { id: "ma-ruine", make: ruine },
  { id: "ma-brownien", make: brownien },
  { id: "ma-rappel", make: rappel },
];
