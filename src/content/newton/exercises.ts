import { fracTex, pick, randInt, randNonZero } from "../../lib/random";
import type { Exercise, ExerciseGenerator } from "../types";

const par = (n: number) => (n < 0 ? `(${n})` : String(n));
const matTex = (M: number[][]) => `\\begin{pmatrix} ${M.map((r) => r.join(" & ")).join(" \\\\ ")} \\end{pmatrix}`;
const colTex = (v: number[]) => `\\begin{pmatrix} ${v.join(" \\\\ ")} \\end{pmatrix}`;
const poly = (terms: [number, string][]) => {
  const s = terms
    .filter(([c]) => c !== 0)
    .map(([c, t], i) => {
      const body = t === "" ? String(Math.abs(c)) : `${Math.abs(c) === 1 ? "" : Math.abs(c)}${t}`;
      return `${i === 0 ? (c < 0 ? "-" : "") : c < 0 ? " - " : " + "}${body}`;
    })
    .join("");
  return s === "" ? "0" : s;
};

// One Newton step in one variable on a cubic or a quartic: x1 = x0 - f'(x0)/f''(x0).
function newton1d(): Exercise {
  const quartic = Math.random() < 0.4;
  let x0: number, b: number, c: number, fTex: string, d1Tex: string, d2Tex: string, d1: number, d2: number;
  do {
    x0 = randInt(-3, 3);
    b = randInt(-4, 4);
    c = randInt(-6, 6);
    if (quartic) {
      // f = x⁴ + b x² + c x
      fTex = poly([[1, "x^4"], [b, "x^2"], [c, "x"]]);
      d1Tex = poly([[4, "x^3"], [2 * b, "x"], [c, ""]]);
      d2Tex = poly([[12, "x^2"], [2 * b, ""]]);
      d1 = 4 * x0 ** 3 + 2 * b * x0 + c;
      d2 = 12 * x0 * x0 + 2 * b;
    } else {
      // f = x³ + b x² + c x
      fTex = poly([[1, "x^3"], [b, "x^2"], [c, "x"]]);
      d1Tex = poly([[3, "x^2"], [2 * b, "x"], [c, ""]]);
      d2Tex = poly([[6, "x"], [2 * b, ""]]);
      d1 = 3 * x0 * x0 + 2 * b * x0 + c;
      d2 = 6 * x0 + 2 * b;
    }
  } while (d2 <= 0 || d1 === 0);
  const ans = fracTex(x0 * d2 - d1, d2);
  return {
    intro: "Fais un pas de la méthode de Newton en une variable, depuis $x_0$. Donne $x_1$ (fraction exacte).",
    promptTex: `f(x) = ${fTex} \\qquad x_0 = ${x0} \\qquad x_1`,
    answerTex: ans,
    hint: "Le pas saute au sommet de la parabole osculatrice : $x_1 = x_0 - f'(x_0)/f''(x_0)$.",
    solution: [
      `f'(x) = ${d1Tex} \\qquad f''(x) = ${d2Tex}`,
      `f'(${x0}) = ${d1} \\qquad f''(${x0}) = ${d2} > 0`,
      `x_1 = ${x0} - \\frac{${d1}}{${d2}} = ${ans}`,
    ],
  };
}

// Random 2×2 symmetric positive definite integer matrix, with a nonzero off-diagonal term most of the time.
function spd(): number[][] {
  let a: number, b: number, d: number;
  do {
    a = randInt(1, 5);
    d = randInt(1, 5);
    b = Math.random() < 0.8 ? randNonZero(-2, 2) : 0;
  } while (a * d - b * b <= 0);
  return [
    [a, b],
    [b, d],
  ];
}

// Newton step -H⁻¹g for a 2×2 SPD Hessian, by Cramer: returns numerators over det.
function stepNum(H: number[][], g: number[]): [number, number, number] {
  const [[a, b], [, d]] = H;
  const det = a * d - b * b;
  return [-(d * g[0] - b * g[1]), -(-b * g[0] + a * g[1]), det];
}

// One component of the Newton step in 2D; for a quadratic it lands on the minimizer.
function newton2d(): Exercise {
  const H = spd();
  let g: number[];
  do g = [randInt(-4, 4), randInt(-4, 4)];
  while (g[0] === 0 && g[1] === 0);
  const [n1, n2, det] = stepNum(H, g);
  const i = pick([1, 2]);
  const ans = fracTex(i === 1 ? n1 : n2, det);
  const [[a, b], [, d]] = H;
  return {
    intro: `Au point courant, le gradient vaut $g$ et la hessienne $H$. Donne la composante ${i} du pas de Newton $\\Delta x_{\\text{nt}}$.`,
    promptTex: `g = ${colTex(g)} \\qquad H = ${matTex(H)} \\qquad (\\Delta x_{\\text{nt}})_${i}`,
    answerTex: ans,
    hint: "Résous $H v = -g$. En $2 \\times 2$ : $\\begin{pmatrix} a & b \\\\ b & d \\end{pmatrix}^{-1} = \\frac{1}{ad - b^2}\\begin{pmatrix} d & -b \\\\ -b & a \\end{pmatrix}$.",
    solution: [
      `\\det H = ${a} \\times ${d} - ${par(b)}^2 = ${det} \\qquad H^{-1} = \\frac{1}{${det}} ${matTex([
        [d, -b],
        [-b, a],
      ])}`,
      `\\Delta x_{\\text{nt}} = -H^{-1} g = \\frac{1}{${det}} ${colTex([n1, n2])}`,
      `(\\Delta x_{\\text{nt}})_${i} = ${ans}`,
    ],
  };
}

// Newton decrement: the decrease predicted by the quadratic model, λ²/2 = gᵀH⁻¹g / 2.
function decrement(): Exercise {
  const H = spd();
  let g: number[];
  do g = [randInt(-3, 3), randInt(-3, 3)];
  while (g[0] === 0 && g[1] === 0);
  const [n1, n2, det] = stepNum(H, g);
  // gᵀH⁻¹g = -gᵀΔx = -(g1 n1 + g2 n2)/det
  const quad = -(g[0] * n1 + g[1] * n2);
  const ans = fracTex(quad, 2 * det);
  return {
    intro: "Au point courant, le gradient vaut $g$ et la hessienne $H$. De combien le modèle quadratique prédit-il que $f$ baisse après un pas de Newton plein ?",
    promptTex: `g = ${colTex(g)} \\qquad H = ${matTex(H)} \\qquad f(x) - \\hat f(x + \\Delta x_{\\text{nt}})`,
    answerTex: ans,
    hint: "C'est la moitié du décrément de Newton au carré : $\\lambda^2/2 = \\tfrac12\\, g^\\top H^{-1} g = -\\tfrac12\\, g^\\top \\Delta x_{\\text{nt}}$.",
    solution: [
      `\\Delta x_{\\text{nt}} = -H^{-1} g = \\frac{1}{${det}} ${colTex([n1, n2])}`,
      `\\lambda^2 = -g^\\top \\Delta x_{\\text{nt}} = -\\frac{${g[0]} \\times ${par(n1)} + ${par(g[1])} \\times ${par(n2)}}{${det}} = ${fracTex(quad, det)}`,
      `\\frac{\\lambda^2}{2} = ${ans}`,
    ],
  };
}

// Pure Newton (t = 1) on f = sqrt(a² + x²): x1 = -x0³/a², it converges only if |x0| < a.
function pureNewton(): Exercise {
  const a = pick([1, 2, 3]);
  const p = randNonZero(-3, 3);
  const q = pick([1, 2, 2, 3]);
  const x0 = fracTex(p, q);
  const ans = fracTex(-(p ** 3), q ** 3 * a * a);
  return {
    intro: "Un pas de Newton pur (pas $t = 1$, sans recherche linéaire), depuis $x_0$. Donne $x_1$.",
    promptTex: `f(x) = \\sqrt{${a * a} + x^2} \\qquad x_0 = ${x0} \\qquad x_1`,
    answerTex: ans,
    hint: `Avec $s = ${a * a} + x^2$ : $f'(x) = x / \\sqrt s$ et $f''(x) = ${a * a} / s^{3/2}$.`,
    solution: [
      `f'(x) = \\frac{x}{\\sqrt{s}} \\qquad f''(x) = \\frac{\\sqrt s - x \\cdot x/\\sqrt s}{s} = \\frac{${a * a}}{s^{3/2}}`,
      `x_1 = x_0 - \\frac{f'(x_0)}{f''(x_0)} = x_0 - \\frac{x_0\\, s}{${a * a}} = -\\frac{x_0^3}{${a * a}} = ${ans}`,
      `|x_1| = |x_0| \\cdot \\frac{x_0^2}{${a * a}} : \\text{ le point se rapproche de 0 seulement si } |x_0| < ${a}`,
    ],
  };
}

// Size of the Hessian: n² entries, n(n+1)/2 distinct ones, or its memory in float32.
function hessianSize(): Exercise {
  const kind = pick(["total", "distinct", "memoire"]);
  if (kind === "memoire") {
    const e = pick([4, 5, 6]);
    const gb = 4 * 10 ** (2 * e - 9);
    const ans = gb < 1 ? String(gb).replace(".", "{,}") : String(gb);
    return {
      intro: "Un modèle a $n$ paramètres. Combien de gigaoctets ($10^9$ octets) faut-il pour stocker sa hessienne complète en float32 (4 octets par coefficient) ?",
      promptTex: `n = 10^{${e}} \\qquad \\text{Go}`,
      answerTex: ans,
      hint: "La hessienne est $n \\times n$.",
      solution: [`n^2 = 10^{${2 * e}} \\text{ coefficients} \\qquad 4 \\times 10^{${2 * e}} \\text{ octets} = ${ans} \\text{ Go}`],
    };
  }
  const n = pick([20, 50, 100, 200, 500, 1000]);
  const ans = kind === "total" ? n * n : (n * (n + 1)) / 2;
  return {
    intro:
      kind === "total"
        ? "Combien de coefficients a la hessienne d'une fonction de $n$ variables ?"
        : "La hessienne est symétrique. Combien de coefficients distincts faut-il calculer, diagonale comprise ?",
    promptTex: `n = ${n}`,
    answerTex: String(ans),
    hint: kind === "total" ? "Une ligne et une colonne par variable." : "La diagonale, plus la moitié des $n^2 - n$ termes hors diagonale.",
    solution:
      kind === "total"
        ? [`n^2 = ${n}^2 = ${ans}`]
        : [`n + \\frac{n^2 - n}{2} = \\frac{n(n+1)}{2} = \\frac{${n} \\times ${n + 1}}{2} = ${ans}`],
  };
}

export const newtonGenerators: ExerciseGenerator[] = [
  { id: "newton-1d", make: newton1d },
  { id: "newton-2d", make: newton2d },
  { id: "newton-decrement", make: decrement },
  { id: "newton-pur", make: pureNewton },
  { id: "newton-taille", make: hessianSize },
];
