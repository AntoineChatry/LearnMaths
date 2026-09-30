import { fracTex, pick, randInt, randNonZero, signed } from "../../lib/random";
import { coefLead, linearTerm } from "../../lib/tex";
import type { Exercise, ExerciseGenerator } from "../types";

const paren = (n: number) => (n < 0 ? `(${n})` : String(n));

// ax + b written cleanly: 2x-3, -x+1, x.
const affine = (a: number, b: number) => `${coefLead(a)}x${signed(b)}`;

// Rational multiple of π:(1, 6) → \frac{\pi}{6}, (-2, 3) → -\frac{2\pi}{3}, (1, 1) → \pi.
function piTex(p: number, q: number): string {
  if (p === 0) return "0";
  const sign = p < 0 ? "-" : "";
  const a = Math.abs(p);
  const num = a === 1 ? "\\pi" : `${a}\\pi`;
  return q === 1 ? `${sign}${num}` : `${sign}\\frac{${num}}{${q}}`;
}

// Derivative of a composite: spot u, compute u', multiply.
function compositeDerivative(): Exercise {
  const kind = randInt(0, 4);
  if (kind === 0) {
    const a = randNonZero(-3, 3);
    const b = randInt(-5, 5);
    const u = `${coefLead(a)}x^2${signed(b)}`;
    return {
      promptTex: `f(x) = \\sin\\left(${u}\\right) \\qquad f'(x) = \\ ?`,
      answerTex: `${2 * a}x\\cos\\left(${u}\\right)`,
      hint: "C'est $\\sin(u)$ avec $u$ un polynôme : $(\\sin u)' = u' \\cos u$.",
      solution: [
        `u(x) = ${u}, \\quad u'(x) = ${2 * a}x`,
        `f'(x) = u'(x)\\cos\\big(u(x)\\big) = ${2 * a}x\\cos\\left(${u}\\right)`,
      ],
    };
  }
  if (kind === 1) {
    const a = randNonZero(-4, 4);
    const b = randNonZero(-5, 5);
    const n = randInt(3, 6);
    const u = affine(a, b);
    return {
      promptTex: `f(x) = \\left(${u}\\right)^{${n}} \\qquad f'(x) = \\ ?`,
      answerTex: `${n * a}\\left(${u}\\right)^{${n - 1}}`,
      hint: "C'est $u^n$ avec $u$ affine : $(u^n)' = n\\,u'\\,u^{n-1}$.",
      solution: [
        `u(x) = ${u}, \\quad u'(x) = ${a}`,
        `f'(x) = ${n} \\times ${paren(a)} \\times \\left(${u}\\right)^{${n - 1}} = ${n * a}\\left(${u}\\right)^{${n - 1}}`,
      ],
    };
  }
  if (kind === 2) {
    const a = randNonZero(-2, 2);
    const b = randNonZero(-4, 4);
    const u = `${coefLead(a)}x^2${linearTerm(b)}`;
    const du = `${2 * a}x${signed(b)}`;
    return {
      promptTex: `f(x) = e^{${u}} \\qquad f'(x) = \\ ?`,
      answerTex: `\\left(${du}\\right)e^{${u}}`,
      hint: "C'est $e^{u}$ : $(e^u)' = u'\\,e^u$. L'exponentielle se recopie telle quelle.",
      solution: [`u(x) = ${u}, \\quad u'(x) = ${du}`, `f'(x) = u'(x)\\,e^{u(x)} = \\left(${du}\\right)e^{${u}}`],
    };
  }
  if (kind === 3) {
    const c = randInt(1, 9);
    return {
      promptTex: `f(x) = \\ln\\left(x^2+${c}\\right) \\qquad f'(x) = \\ ?`,
      answerTex: `\\frac{2x}{x^2+${c}}`,
      hint: "C'est $\\ln(u)$ avec $u > 0$ partout : $(\\ln u)' = \\dfrac{u'}{u}$.",
      solution: [`u(x) = x^2+${c}, \\quad u'(x) = 2x`, `f'(x) = \\frac{u'(x)}{u(x)} = \\frac{2x}{x^2+${c}}`],
    };
  }
  const a = randNonZero(-5, 5);
  const ax = `${coefLead(a)}x`;
  return {
    promptTex: `f(x) = \\tan\\left(${ax}\\right) \\qquad f'(x) = \\ ?`,
    answerTex: `\\frac{${a}}{\\cos^2\\left(${ax}\\right)}`,
    hint: "$\\tan' = \\dfrac{1}{\\cos^2} = 1 + \\tan^2$, puis la règle de la chaîne avec $u = " + ax + "$.",
    solution: [
      `\\tan'(u) = \\frac{1}{\\cos^2 u} = 1 + \\tan^2 u`,
      `f'(x) = ${a} \\times \\frac{1}{\\cos^2\\left(${ax}\\right)} = \\frac{${a}}{\\cos^2\\left(${ax}\\right)} = ${a}\\left(1 + \\tan^2\\left(${ax}\\right)\\right)`,
    ],
  };
}

// Derivatives involving arctan, arcsin, arccos.
function inverseTrigDerivative(): Exercise {
  const kind = randInt(0, 4);
  if (kind === 0) {
    const a = randNonZero(-4, 4);
    const b = randInt(-3, 3);
    const u = affine(a, b);
    return {
      promptTex: `f(x) = \\arctan\\left(${u}\\right) \\qquad f'(x) = \\ ?`,
      answerTex: `\\frac{${a}}{1+\\left(${u}\\right)^2}`,
      hint: "$\\arctan'(u) = \\dfrac{1}{1+u^2}$, à multiplier par $u'$.",
      solution: [
        `u(x) = ${u}, \\quad u'(x) = ${a}`,
        `f'(x) = \\frac{u'(x)}{1+u(x)^2} = \\frac{${a}}{1+\\left(${u}\\right)^2}`,
      ],
    };
  }
  if (kind === 1 || kind === 2) {
    const a = randInt(3, 6);
    const isCos = kind === 2;
    const fn = isCos ? "\\arccos" : "\\arcsin";
    const sign = isCos ? "-" : "";
    return {
      promptTex: `f(x) = ${fn}\\left(\\frac{x}{${a}}\\right) \\quad \\text{sur } ]-${a}, ${a}[ \\qquad f'(x) = \\ ?`,
      answerTex: `${sign}\\frac{1}{\\sqrt{${a * a}-x^2}}`,
      hint: `$${fn}'(u) = ${sign}\\dfrac{1}{\\sqrt{1-u^2}}$ avec $u = x/${a}$. Pour simplifier, fais rentrer le $\\tfrac{1}{${a}}$ dans la racine.`,
      solution: [
        `f'(x) = ${sign}\\frac{1}{${a}} \\cdot \\frac{1}{\\sqrt{1-\\frac{x^2}{${a * a}}}}`,
        `${a}\\sqrt{1-\\frac{x^2}{${a * a}}} = \\sqrt{${a * a}\\left(1-\\frac{x^2}{${a * a}}\\right)} = \\sqrt{${a * a}-x^2}`,
        `f'(x) = ${sign}\\frac{1}{\\sqrt{${a * a}-x^2}}`,
      ],
    };
  }
  if (kind === 3) {
    return {
      promptTex: `f(x) = x\\arctan(x) \\qquad f'(x) = \\ ?`,
      answerTex: `\\arctan(x)+\\frac{x}{1+x^2}`,
      hint: "Un produit : $(uv)' = u'v + uv'$ avec $u = x$ et $v = \\arctan x$.",
      solution: [
        `u = x,\\ u' = 1, \\qquad v = \\arctan x,\\ v' = \\frac{1}{1+x^2}`,
        `f'(x) = 1 \\cdot \\arctan(x) + x \\cdot \\frac{1}{1+x^2} = \\arctan(x)+\\frac{x}{1+x^2}`,
      ],
    };
  }
  const n = randInt(2, 3);
  return {
    promptTex: `f(x) = \\arctan\\left(x^{${n}}\\right) \\qquad f'(x) = \\ ?`,
    answerTex: `\\frac{${n}x^{${n - 1}}}{1+x^{${2 * n}}}`,
    hint: "$\\arctan'(u) = \\dfrac{1}{1+u^2}$ avec $u = x^" + n + "$, et $(x^" + n + ")^2 = x^{" + 2 * n + "}$.",
    solution: [
      `u(x) = x^{${n}}, \\quad u'(x) = ${n}x^{${n - 1}}`,
      `f'(x) = \\frac{u'(x)}{1+u(x)^2} = \\frac{${n}x^{${n - 1}}}{1+x^{${2 * n}}}`,
    ],
  };
}

// (f⁻¹)'(y₀) = 1 / f'(c) where c is the preimage of y₀, without ever writing f⁻¹.
function inverseAtPoint(): Exercise {
  const kind = randInt(0, 2);
  if (kind === 2) {
    const a = randInt(1, 6);
    const b = randInt(-4, 4);
    const f = `e^{x}+${a === 1 ? "" : a}x${signed(b)}`;
    const y0 = 1 + b;
    const answerTex = fracTex(1, 1 + a);
    return {
      intro: "$f$ est strictement croissante sur $\\mathbb{R}$, donc elle a une réciproque $f^{-1}$.",
      promptTex: `f(x) = ${f} \\qquad (f^{-1})'(${y0}) = \\ ?`,
      answerTex,
      hint: `Trouve d'abord le $c$ tel que $f(c) = ${y0}$ (essaie $c = 0$), puis applique $(f^{-1})'(y) = \\dfrac{1}{f'(c)}$.`,
      solution: [
        `f(0) = e^0 + 0 ${signed(b)} = ${y0}, \\text{ donc } f^{-1}(${y0}) = 0`,
        `f'(x) = e^x + ${a}, \\quad f'(0) = ${1 + a}`,
        `(f^{-1})'(${y0}) = \\frac{1}{f'(0)} = ${answerTex}`,
      ],
    };
  }
  const n = kind === 0 ? 3 : 5;
  const a = randInt(1, 6);
  const b = randInt(-5, 5);
  const c = n === 3 ? randInt(-3, 3) : randInt(-2, 2);
  const y0 = c ** n + a * c + b;
  const slope = n * c ** (n - 1) + a;
  const f = `x^{${n}}${linearTerm(a)}${signed(b)}`;
  const answerTex = fracTex(1, slope);
  return {
    intro: "$f$ est strictement croissante sur $\\mathbb{R}$, donc elle a une réciproque $f^{-1}$. Inutile de la calculer.",
    promptTex: `f(x) = ${f} \\qquad (f^{-1})'(${y0}) = \\ ?`,
    answerTex,
    hint: `Cherche l'entier $c$ tel que $f(c) = ${y0}$, puis applique $(f^{-1})'(y) = \\dfrac{1}{f'(c)}$.`,
    solution: [
      `f(${c}) = ${paren(c)}^{${n}} ${a === 1 ? "+" : `+ ${a} \\times`} ${paren(c)} ${signed(b)} = ${y0}, \\text{ donc } f^{-1}(${y0}) = ${c}`,
      `f'(x) = ${n}x^{${n - 1}} + ${a}, \\quad f'(${c}) = ${slope}`,
      `(f^{-1})'(${y0}) = \\frac{1}{f'(${c})} = ${answerTex}`,
    ],
  };
}

// [LaTeX of the value, angle p/q in multiples of π]
const SIN_TABLE: [string, number, number][] = [
  ["0", 0, 1],
  ["\\frac{1}{2}", 1, 6],
  ["\\frac{\\sqrt{2}}{2}", 1, 4],
  ["\\frac{\\sqrt{3}}{2}", 1, 3],
  ["1", 1, 2],
  ["-\\frac{1}{2}", -1, 6],
  ["-\\frac{\\sqrt{2}}{2}", -1, 4],
  ["-\\frac{\\sqrt{3}}{2}", -1, 3],
  ["-1", -1, 2],
];
const COS_TABLE: [string, number, number][] = [
  ["1", 0, 1],
  ["\\frac{\\sqrt{3}}{2}", 1, 6],
  ["\\frac{\\sqrt{2}}{2}", 1, 4],
  ["\\frac{1}{2}", 1, 3],
  ["0", 1, 2],
  ["-\\frac{1}{2}", 2, 3],
  ["-\\frac{\\sqrt{2}}{2}", 3, 4],
  ["-\\frac{\\sqrt{3}}{2}", 5, 6],
  ["-1", 1, 1],
];
const TAN_TABLE: [string, number, number][] = [
  ["0", 0, 1],
  ["\\frac{\\sqrt{3}}{3}", 1, 6],
  ["1", 1, 4],
  ["\\sqrt{3}", 1, 3],
  ["-\\frac{\\sqrt{3}}{3}", -1, 6],
  ["-1", -1, 4],
  ["-\\sqrt{3}", -1, 3],
];

// Notable values of arcsin, arccos, arctan, and the arcsin(sin θ) ≠ θ trap.
function remarkableValues(): Exercise {
  const kind = randInt(0, 3);
  if (kind === 3) {
    // θ outside [−π/2, π/2]: arcsin(sin θ) = π − θ, which falls back into the interval.
    const [p, q] = pick<[number, number]>([
      [2, 3],
      [3, 4],
      [5, 6],
      [7, 6],
      [5, 4],
      [4, 3],
    ]);
    const answerTex = piTex(q - p, q);
    return {
      promptTex: `\\arcsin\\left(\\sin\\left(${piTex(p, q)}\\right)\\right) = \\ ?`,
      answerTex,
      hint: "Ce n'est pas $" + piTex(p, q) + "$ : arcsin renvoie toujours un angle de $[-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2}]$. Quel angle de cet intervalle a le même sinus ? Pense à $\\sin(\\pi - \\theta) = \\sin \\theta$.",
      solution: [
        `${piTex(p, q)} \\notin \\left[-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2}\\right]`,
        `\\sin\\left(${piTex(p, q)}\\right) = \\sin\\left(\\pi - ${piTex(p, q)}\\right) = \\sin\\left(${answerTex}\\right) \\quad\\text{et}\\quad ${answerTex} \\in \\left[-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2}\\right]`,
        `\\arcsin\\left(\\sin\\left(${piTex(p, q)}\\right)\\right) = ${answerTex}`,
      ],
    };
  }
  const [fn, fwd, range, table] = (
    [
      ["\\arcsin", "\\sin", "\\left[-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2}\\right]", SIN_TABLE],
      ["\\arccos", "\\cos", "[0, \\pi]", COS_TABLE],
      ["\\arctan", "\\tan", "\\left]-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2}\\right[", TAN_TABLE],
    ] as const
  )[kind];
  const [v, p, q] = pick(table);
  const answerTex = piTex(p, q);
  return {
    promptTex: `${fn}\\left(${v}\\right) = \\ ?`,
    answerTex,
    hint: `Cherche l'angle $\\theta \\in ${range}$ tel que $${fwd}\\theta = ${v}$. Le cercle unité est ton ami.`,
    solution: [
      `${fwd}\\left(${answerTex}\\right) = ${v} \\quad\\text{et}\\quad ${answerTex} \\in ${range}`,
      `\\text{donc } ${fn}\\left(${v}\\right) = ${answerTex}`,
    ],
  };
}

// Reduction factor r = 1 − 2aη, chosen so the iterates stay simple fractions.
const GD_STEPS: { a: number; eta: [number, number]; r: [number, number] }[] = [
  { a: 1, eta: [1, 4], r: [1, 2] },
  { a: 1, eta: [3, 4], r: [-1, 2] },
  { a: 1, eta: [1, 8], r: [3, 4] },
  { a: 2, eta: [1, 8], r: [1, 2] },
  { a: 2, eta: [3, 8], r: [-1, 2] },
  { a: 2, eta: [1, 16], r: [3, 4] },
];

const squareTex = (a: number, c: number) => `${coefLead(a)}${c === 0 ? "x^2" : `(x${signed(-c)})^2`}`;

// Distance to the minimum c: "x_k - 2", or just "x_k" if c = 0.
const gap = (v: string, c: number) => (c === 0 ? v : `(${v}${signed(-c)})`);

// 1D gradient descent on a parabola: value after k steps, or maximum step size.
function gradientDescent(): Exercise {
  if (Math.random() < 0.25) {
    const a = randInt(1, 6);
    const answerTex = fracTex(1, a);
    return {
      intro: "Descente de gradient $x \\leftarrow x - \\eta f'(x)$ avec un pas fixe $\\eta > 0$. Elle converge vers 0 depuis n'importe quel $x_0$ si et seulement si $0 < \\eta < \\eta_{\\max}$. Que vaut $\\eta_{\\max}$ ?",
      promptTex: `f(x) = ${squareTex(a, 0)} \\qquad \\eta_{\\max} = \\ ?`,
      answerTex,
      hint: "Écris un pas : $x_{k+1} = x_k - \\eta f'(x_k) = r\\,x_k$. La suite géométrique tend vers 0 si et seulement si $|r| < 1$.",
      solution: [
        `f'(x) = ${2 * a}x, \\quad x_{k+1} = x_k - ${2 * a}\\eta\\, x_k = (1 - ${2 * a}\\eta)\\,x_k`,
        `|1 - ${2 * a}\\eta| < 1 \\iff 0 < ${2 * a}\\eta < 2 \\iff 0 < \\eta < ${answerTex}`,
      ],
    };
  }
  const { a, eta, r } = pick(GD_STEPS);
  const c = randInt(-3, 3);
  let x0 = randInt(-4, 4);
  while (x0 === c) x0 = randInt(-4, 4);
  const k = randInt(1, 3);
  const [p, q] = r;
  const qk = q ** k;
  const answerTex = fracTex(c * qk + p ** k * (x0 - c), qk);
  const etaTex = fracTex(eta[0], eta[1]);
  const rTex = fracTex(p, q);
  const dfTex = c === 0 ? `${2 * a}x` : `${2 * a}(x${signed(-c)})`;
  return {
    intro: "Descente de gradient $x_{k+1} = x_k - \\eta\\, f'(x_k)$. Donne la valeur exacte de l'itéré demandé.",
    promptTex: `f(x) = ${squareTex(a, c)} \\qquad \\eta = ${etaTex} \\qquad x_0 = ${x0} \\qquad x_{${k}} = \\ ?`,
    answerTex,
    hint: `Regarde l'écart $${gap("x_k", c)}$ au minimum $${c}$ : à chaque pas, il est multiplié par $1 - ${2 * a}\\eta$.`,
    solution: [
      `f'(x) = ${dfTex}, \\quad ${gap("x_{k+1}", c)} = \\left(1 - ${2 * a} \\times ${etaTex}\\right)${gap("x_k", c)} = ${rTex}\\,${gap("x_k", c)}`,
      `${gap(`x_{${k}}`, c)} = \\left(${rTex}\\right)^{${k}} \\times ${paren(x0 - c)} = ${fracTex(p ** k * (x0 - c), qk)}`,
      `x_{${k}} = ${answerTex}`,
    ],
  };
}

// Code mode: what does this program compute? Numerical derivatives and gradient descent.
function codeDerivative(): Exercise {
  const kind = randInt(0, 3);
  if (kind === 0) {
    const a = randInt(-3, 3);
    return {
      intro: "Sans l'exécuter : vers quelle valeur exacte tend ce que ce programme affiche quand h tend vers 0 ?",
      code: `import math\n\nh = 1e-6\na = ${a}\nprint((math.atan(a + h) - math.atan(a - h)) / (2 * h))`,
      promptTex: "\\lim_{h \\to 0} \\ ?",
      answerTex: fracTex(1, 1 + a * a),
      hint: "C'est un taux de variation centré de arctan en $a$ : il tend vers $\\arctan'(a)$.",
      solution: [`\\arctan'(a) = \\frac{1}{1+a^2}`, `\\arctan'(${a}) = \\frac{1}{1+${paren(a)}^2} = ${fracTex(1, 1 + a * a)}`],
    };
  }
  if (kind === 1) {
    const k = randInt(1, 5);
    const zLine = k === 1 ? "z = 0" : `z = math.log(${k})`;
    const answerTex = fracTex(k, (k + 1) ** 2);
    return {
      intro: "Sans l'exécuter : vers quelle valeur exacte tend ce que ce programme affiche quand h tend vers 0 ?",
      code: `import math\n\ndef sigma(z):\n    return 1 / (1 + math.exp(-z))\n\nh = 1e-6\n${zLine}\nprint((sigma(z + h) - sigma(z - h)) / (2 * h))`,
      promptTex: "\\lim_{h \\to 0} \\ ?",
      answerTex,
      hint: "C'est $\\sigma'(z)$, et $\\sigma' = \\sigma(1-\\sigma)$. Calcule d'abord $\\sigma(z)$ : $e^{-\\ln k} = \\tfrac{1}{k}$.",
      solution: [
        k === 1 ? `\\sigma(0) = \\frac{1}{1+1} = \\frac{1}{2}` : `\\sigma(\\ln ${k}) = \\frac{1}{1+\\frac{1}{${k}}} = \\frac{${k}}{${k + 1}}`,
        `\\sigma'(z) = \\sigma(z)\\big(1-\\sigma(z)\\big) = \\frac{${k}}{${k + 1}} \\times \\frac{1}{${k + 1}} = ${answerTex}`,
      ],
    };
  }
  if (kind === 2) {
    const [p, q, root] = pick<[number, number, number | null]>([
      [0, 1, 1],
      [1, 2, null],
      [3, 5, 4],
      [4, 5, 3],
      [-3, 5, 4],
      [5, 13, 12],
      [12, 13, 5],
    ]);
    const x = p === 0 ? "0" : p < 0 ? `-${-p}/${q}` : `${p}/${q}`;
    const xTex = fracTex(p, q);
    const d = q * q - p * p;
    const answerTex = root === null ? `\\frac{${q}}{\\sqrt{${d}}}` : fracTex(q, root);
    return {
      intro: "Sans l'exécuter : vers quelle valeur exacte tend ce que ce programme affiche quand h tend vers 0 ?",
      code: `import math\n\nh = 1e-6\nx = ${x}\nprint((math.asin(x + h) - math.asin(x - h)) / (2 * h))`,
      promptTex: "\\lim_{h \\to 0} \\ ?",
      answerTex,
      hint: "C'est $\\arcsin'(x) = \\dfrac{1}{\\sqrt{1-x^2}}$. Mets $1 - x^2$ au même dénominateur.",
      solution: [
        `1 - \\left(${xTex}\\right)^2 = \\frac{${q * q} - ${p * p}}{${q * q}} = \\frac{${d}}{${q * q}}`,
        `\\arcsin'\\left(${xTex}\\right) = \\frac{1}{\\sqrt{\\frac{${d}}{${q * q}}}} = \\frac{${q}}{\\sqrt{${d}}}${root === null ? "" : ` = ${answerTex}`}`,
      ],
    };
  }
  const { eta, r } = pick(GD_STEPS.filter((s) => s.a === 1));
  const etaDec = eta[0] / eta[1];
  const c = randInt(-3, 3);
  let x0 = randInt(-4, 4);
  while (x0 === c) x0 = randInt(-4, 4);
  const k = randInt(2, 3);
  const [p, q] = r;
  const qk = q ** k;
  const answerTex = fracTex(c * qk + p ** k * (x0 - c), qk);
  const gradLine = c === 0 ? "grad = 2 * x" : `grad = 2 * (x ${c > 0 ? "-" : "+"} ${Math.abs(c)})`;
  return {
    intro: "Sans l'exécuter : quelle valeur exacte ce programme affiche-t-il ?",
    code: `x = ${x0}\neta = ${etaDec}\nfor step in range(${k}):\n    ${gradLine}\n    x = x - eta * grad\nprint(x)`,
    promptTex: `\\text{Descente de gradient sur } f(x) = ${squareTex(1, c)} \\qquad x_{${k}} = \\ ?`,
    answerTex,
    hint: "Chaque pas multiplie l'écart au minimum par $1 - 2\\eta$.",
    solution: [
      `${gap("x_{k+1}", c)} = \\left(1 - 2 \\times ${fracTex(eta[0], eta[1])}\\right)${gap("x_k", c)} = ${fracTex(p, q)}\\,${gap("x_k", c)}`,
      `x_{${k}} = ${c === 0 ? "" : `${c} + `}\\left(${fracTex(p, q)}\\right)^{${k}} \\times ${paren(x0 - c)} = ${answerTex}`,
    ],
  };
}

export const derivationGenerators: ExerciseGenerator[] = [
  { id: "derivee-composee", make: compositeDerivative },
  { id: "derivee-trigo-reciproque", make: inverseTrigDerivative },
  { id: "reciproque-en-un-point", make: inverseAtPoint },
  { id: "valeurs-remarquables", make: remarkableValues },
  { id: "descente-gradient", make: gradientDescent },
  { id: "code-derivee", make: codeDerivative },
];
