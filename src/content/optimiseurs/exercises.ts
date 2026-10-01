import { fracTex, pick, randInt, randNonZero } from "../../lib/random";
import type { Exercise, ExerciseGenerator } from "../types";

// Exact rationals [num, den], den > 0, kept reduced.
type Q = [number, number];
const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
const q = (n: number, d = 1): Q => {
  const g = gcd(n, d) || 1;
  return d < 0 ? [-n / g, -d / g] : [n / g, d / g];
};
const add = (a: Q, b: Q) => q(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
const sub = (a: Q, b: Q) => q(a[0] * b[1] - b[0] * a[1], a[1] * b[1]);
const mul = (a: Q, b: Q) => q(a[0] * b[0], a[1] * b[1]);
const div = (a: Q, b: Q) => q(a[0] * b[1], a[1] * b[0]);
const tex = (a: Q) => fracTex(a[0], a[1]);
const ptex = (a: Q) => (a[0] < 0 ? `\\left(${tex(a)}\\right)` : tex(a));
// Decimal display of a rational with a short finite expansion (0.9 → 0{,}9), else a fraction.
const dec = (a: Q) => {
  const v = a[0] / a[1];
  const s = String(v);
  return s.length <= 6 ? s.replace(".", "{,}") : tex(a);
};

// Two heavy-ball steps on f(w) = λw²/2 from w0, with z0 = 0.
function momentumSteps(): Exercise {
  const lam = q(pick([1, 2, 4]));
  const eta = pick([q(1, 2), q(1, 4), q(1, 10), q(1, 5)]);
  const beta = pick([q(1, 2), q(9, 10), q(3, 4)]);
  const w0 = q(randNonZero(-4, 4));
  const z1 = mul(lam, w0);
  const w1 = sub(w0, mul(eta, z1));
  const z2 = add(mul(beta, z1), mul(lam, w1));
  const w2 = sub(w1, mul(eta, z2));
  return {
    intro: "Fais deux pas de descente avec momentum, en partant de $z_0 = 0$. Donne $w_2$.",
    promptTex: `f(w) = ${{ 1: "\\tfrac12\\,", 2: "", 4: "2" }[lam[0]]}w^2 \\qquad w_0 = ${tex(w0)} \\qquad \\eta = ${dec(eta)},\\ \\beta = ${dec(beta)} \\qquad w_2`,
    answerTex: tex(w2),
    hint: "$f'(w) = \\lambda w$. Chaque pas : $z \\leftarrow \\beta z + f'(w)$, puis $w \\leftarrow w - \\eta z$.",
    solution: [
      `z_1 = ${tex(lam)} \\times ${ptex(w0)} = ${tex(z1)} \\qquad w_1 = ${tex(w0)} - ${dec(eta)} \\times ${ptex(z1)} = ${tex(w1)}`,
      `z_2 = ${dec(beta)} \\times ${ptex(z1)} + ${tex(lam)} \\times ${ptex(w1)} = ${tex(z2)}`,
      `w_2 = ${tex(w1)} - ${dec(eta)} \\times ${ptex(z2)} = ${tex(w2)}`,
    ],
  };
}

// Stability of momentum: 0 < ηλ < 2 + 2β for every eigenvalue.
function stability(): Exercise {
  const lams = [randInt(1, 4), randInt(5, 20)];
  const lmax = lams[1];
  const beta = pick([q(0), q(1, 2), q(9, 10), q(3, 4), q(1, 4)]);
  if (Math.random() < 0.6) {
    const ans = div(add(q(2), mul(q(2), beta)), q(lmax));
    return {
      intro: "Descente avec momentum sur une quadratique dont la hessienne a les valeurs propres ci-dessous. Au-delà de quel pas $\\eta$ diverge-t-elle ?",
      promptTex: `\\lambda \\in \\{${lams[0]},\\ ${lmax}\\} \\qquad \\beta = ${dec(beta)} \\qquad \\eta_{\\max}`,
      answerTex: tex(ans),
      hint: "Il faut $0 < \\eta\\lambda < 2 + 2\\beta$ pour chaque valeur propre ; la plus grande est la plus contraignante.",
      solution: [`\\eta\\,\\lambda_{\\max} < 2 + 2\\beta \\iff \\eta < \\frac{2 + 2 \\times ${dec(beta)}}{${lmax}} = ${tex(ans)}`],
    };
  }
  // Minimal β for a given step: β > ηλmax/2 − 1, with ηλmax between 2 and 4.
  const target = q(randInt(21, 39), 10);
  const eta = div(target, q(lmax));
  const ans = sub(div(target, q(2)), q(1));
  return {
    intro: "Le pas $\\eta$ est trop grand pour la descente de gradient simple. À partir de quel $\\beta$ la descente avec momentum converge-t-elle ?",
    promptTex: `\\lambda_{\\max} = ${lmax} \\qquad \\eta = ${tex(eta)} \\qquad \\beta_{\\min}`,
    answerTex: tex(ans),
    hint: "Condition de Goh : $\\eta\\lambda < 2 + 2\\beta$, donc $\\beta > \\eta\\lambda_{\\max}/2 - 1$.",
    solution: [
      `\\eta\\,\\lambda_{\\max} = ${tex(eta)} \\times ${lmax} = ${tex(target)} > 2`,
      `\\beta > \\frac{${tex(target)}}{2} - 1 = ${tex(ans)}`,
    ],
  };
}

// Optimal rates and settings for κ a perfect square (Goh, 2017).
function optimalRate(): Exercise {
  const r = pick([2, 3, 4, 5, 7, 10, 20]);
  const kappa = r * r;
  const kind = pick(["momentum", "gradient", "beta", "eta"]);
  if (kind === "eta") {
    const a = pick([1, 2, 3]);
    const b = a * r;
    const ans = q(4, (a + b) ** 2);
    return {
      intro: "Quel pas optimal pour la descente avec momentum, connaissant les valeurs propres extrêmes de la hessienne ?",
      promptTex: `\\lambda_{\\min} = ${a * a} \\qquad \\lambda_{\\max} = ${b * b} \\qquad \\eta^\\star`,
      answerTex: tex(ans),
      hint: "$\\eta^\\star = \\left(\\frac{2}{\\sqrt{\\lambda_{\\min}} + \\sqrt{\\lambda_{\\max}}}\\right)^2$.",
      solution: [`\\eta^\\star = \\left(\\frac{2}{${a} + ${b}}\\right)^2 = ${tex(ans)}`],
    };
  }
  const mom = q(r - 1, r + 1);
  const ans = kind === "momentum" ? mom : kind === "beta" ? mul(mom, mom) : q(kappa - 1, kappa + 1);
  const what =
    kind === "momentum"
      ? "le taux de convergence de la descente avec momentum aux réglages optimaux"
      : kind === "beta"
        ? "le $\\beta$ optimal de la descente avec momentum"
        : "le meilleur taux de convergence de la descente de gradient sans momentum";
  return {
    intro: `Le conditionnement de la hessienne vaut $\\kappa$. Donne ${what}.`,
    promptTex: `\\kappa = ${kappa} \\qquad ${kind === "beta" ? "\\beta^\\star" : "\\rho"}`,
    answerTex: tex(ans),
    hint:
      kind === "gradient"
        ? "Sans momentum : $\\rho = \\frac{\\kappa - 1}{\\kappa + 1}$."
        : "Avec momentum, $\\rho = \\sqrt{\\beta^\\star} = \\frac{\\sqrt\\kappa - 1}{\\sqrt\\kappa + 1}$.",
    solution:
      kind === "gradient"
        ? [`\\rho = \\frac{${kappa} - 1}{${kappa} + 1} = ${tex(ans)}`]
        : kind === "momentum"
          ? [`\\sqrt\\kappa = ${r} \\qquad \\rho = \\frac{${r} - 1}{${r} + 1} = ${tex(ans)}`]
          : [`\\sqrt\\kappa = ${r} \\qquad \\beta^\\star = \\left(\\frac{${r} - 1}{${r} + 1}\\right)^2 = ${tex(ans)}`],
  };
}

// Adam's first moment after two steps, raw or bias-corrected.
function adamBias(): Exercise {
  const beta = pick([q(1, 2), q(3, 4), q(9, 10)]);
  const g1 = randNonZero(-6, 6);
  const g2 = randNonZero(-6, 6);
  const oneMinus = sub(q(1), beta);
  const m1 = mul(oneMinus, q(g1));
  const m2 = add(mul(beta, m1), mul(oneMinus, q(g2)));
  const corr = sub(q(1), mul(beta, beta));
  const mhat = div(m2, corr);
  const corrected = Math.random() < 0.6;
  return {
    intro: corrected
      ? "Deux pas d'Adam : donne la moyenne du gradient corrigée du biais, $\\hat m_2$."
      : "Deux pas d'Adam : donne la moyenne mobile brute $m_2$, avant correction du biais.",
    promptTex: `m_0 = 0 \\qquad \\beta_1 = ${dec(beta)} \\qquad g_1 = ${g1},\\ g_2 = ${g2} \\qquad ${corrected ? "\\hat m_2" : "m_2"}`,
    answerTex: tex(corrected ? mhat : m2),
    hint: corrected
      ? "$m_t = \\beta_1 m_{t-1} + (1 - \\beta_1) g_t$, puis $\\hat m_2 = m_2 / (1 - \\beta_1^2)$."
      : "$m_t = \\beta_1 m_{t-1} + (1 - \\beta_1) g_t$.",
    solution: [
      `m_1 = ${tex(oneMinus)} \\times ${g1 < 0 ? `(${g1})` : g1} = ${tex(m1)}`,
      `m_2 = ${dec(beta)} \\times ${ptex(m1)} + ${tex(oneMinus)} \\times ${g2 < 0 ? `(${g2})` : g2} = ${tex(m2)}`,
      ...(corrected ? [`\\hat m_2 = \\frac{m_2}{1 - ${dec(beta)}^2} = \\frac{${tex(m2)}}{${tex(corr)}} = ${tex(mhat)}`] : []),
    ],
  };
}

// First Adam step (ε neglected): each coordinate moves by exactly η against the sign of its gradient.
function adamFirstStep(): Exercise {
  const eta = pick([q(1, 1000), q(1, 100), q(1, 10), q(3, 1000)]);
  const w0 = q(randInt(-3, 3));
  const g = randNonZero(-9, 9) * pick([1, 100, 1000]) / pick([1, 1000]);
  const scaled = Math.random() < 0.4;
  const c = pick([10, 100, 1000]);
  const ans = sub(w0, mul(eta, q(Math.sign(g))));
  const gTex = String(g).replace(".", "{,}");
  return {
    intro: scaled
      ? `Premier pas d'Adam (on néglige $\\epsilon$), mais la perte a été multipliée par ${c}. Donne la coordonnée $w_1$.`
      : "Premier pas d'Adam (on néglige $\\epsilon$). Donne la coordonnée $w_1$.",
    promptTex: `w_0 = ${tex(w0)} \\qquad g_1 = ${scaled ? `${c} \\times ${g < 0 ? `(${gTex})` : gTex}` : gTex} \\qquad \\eta = ${dec(eta)} \\qquad w_1`,
    answerTex: tex(ans),
    hint: "Au premier pas, $\\hat m_1 = g_1$ et $\\hat v_1 = g_1^2$.",
    solution: [
      `\\hat m_1 = g_1,\\ \\hat v_1 = g_1^2 \\implies \\frac{\\hat m_1}{\\sqrt{\\hat v_1}} = \\operatorname{signe}(g_1) = ${Math.sign(g)}${scaled ? " \\quad \\text{(le facteur se simplifie)}" : ""}`,
      `w_1 = ${tex(w0)} - ${dec(eta)} \\times ${Math.sign(g) < 0 ? "(-1)" : "1"} = ${tex(ans)}`,
    ],
  };
}

// Weight decay versus L2 for SGD: λ = ηλ', and one SGD step on the regularized loss.
function weightDecay(): Exercise {
  const eta = pick([q(1, 10), q(1, 100), q(1, 2), q(1, 5)]);
  const lp = pick([q(1, 10), q(1, 100), q(1), q(1, 2), q(2)]);
  if (Math.random() < 0.4) {
    const lam = mul(eta, lp);
    return {
      intro: "SGD sur la perte régularisée $f + \\frac{\\lambda'}{2}\\|w\\|^2$. Quel taux de décroissance $\\lambda$ par pas, au sens de $w \\leftarrow (1 - \\lambda) w - \\eta \\nabla f$, cela représente-t-il ?",
      promptTex: `\\eta = ${dec(eta)} \\qquad \\lambda' = ${dec(lp)} \\qquad \\lambda`,
      answerTex: tex(lam),
      hint: "Développe $w - \\eta(\\nabla f + \\lambda' w)$.",
      solution: [`w - \\eta(\\nabla f + \\lambda' w) = (1 - \\eta\\lambda')\\,w - \\eta\\nabla f \\implies \\lambda = \\eta\\lambda' = ${tex(lam)}`],
    };
  }
  const w0 = q(randNonZero(-5, 5));
  const g = q(randInt(-4, 4));
  const ans = sub(mul(sub(q(1), mul(eta, lp)), w0), mul(eta, g));
  return {
    intro: "Un pas de SGD sur la perte régularisée $f + \\frac{\\lambda'}{2}\\|w\\|^2$. Donne $w_1$.",
    promptTex: `w_0 = ${tex(w0)} \\qquad \\nabla f(w_0) = ${tex(g)} \\qquad \\eta = ${dec(eta)},\\ \\lambda' = ${dec(lp)} \\qquad w_1`,
    answerTex: tex(ans),
    hint: "Le gradient de la perte régularisée est $\\nabla f + \\lambda' w$.",
    solution: [
      `w_1 = w_0 - \\eta\\,(\\nabla f + \\lambda' w_0) = (1 - \\eta\\lambda')\\,w_0 - \\eta\\,\\nabla f`,
      `= ${tex(sub(q(1), mul(eta, lp)))} \\times ${ptex(w0)} - ${dec(eta)} \\times ${ptex(g)} = ${tex(ans)}`,
    ],
  };
}

export const optimiseursGenerators: ExerciseGenerator[] = [
  { id: "opt-momentum", make: momentumSteps },
  { id: "opt-stabilite", make: stability },
  { id: "opt-taux", make: optimalRate },
  { id: "opt-adam-biais", make: adamBias },
  { id: "opt-adam-pas", make: adamFirstStep },
  { id: "opt-weight-decay", make: weightDecay },
];
