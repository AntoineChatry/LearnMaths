import { fracTex, pick, randInt } from "../../lib/random";
import type { Exercise, ExerciseGenerator } from "../types";

type Q = [number, number]; // fraction num/den, den > 0

function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}
function reduce([p, q]: Q): Q {
  if (p === 0) return [0, 1];
  const g = gcd(p, q);
  return q < 0 ? [-p / g, -q / g] : [p / g, q / g];
}
const fact = (k: number): number => (k <= 1 ? 1 : k * fact(k - 1));

type Kind = "exp" | "sin" | "cos" | "ln" | "geo";

// Coefficient of x^k in the expansion at 0 of f(ax).
function coef(kind: Kind, a: number, k: number): Q {
  const ak = a ** k;
  switch (kind) {
    case "exp":
      return reduce([ak, fact(k)]);
    case "sin":
      return k % 2 === 1 ? reduce([(-1) ** ((k - 1) / 2) * ak, fact(k)]) : [0, 1];
    case "cos":
      return k % 2 === 0 ? reduce([(-1) ** (k / 2) * ak, fact(k)]) : [0, 1];
    case "ln":
      return k === 0 ? [0, 1] : reduce([(-1) ** (k + 1) * ak, k]);
    case "geo":
      return [ak, 1];
  }
}

// f(ax) in LaTeX: e^{2x}, \sin(3x), \ln(1-2x), \frac{1}{1+x}…
function fTex(kind: Kind, a: number): string {
  const ax = a === 1 ? "x" : a === -1 ? "-x" : `${a}x`;
  const inner = (s: number) => (Math.abs(a) === 1 ? `${s * a < 0 ? "-" : "+"}x` : `${s * a < 0 ? "-" : "+"}${Math.abs(a)}x`);
  switch (kind) {
    case "exp":
      return `e^{${ax}}`;
    case "sin":
      return a === 1 ? "\\sin x" : `\\sin(${ax})`;
    case "cos":
      return a === 1 ? "\\cos x" : `\\cos(${ax})`;
    case "ln":
      return `\\ln(1${inner(1)})`;
    case "geo":
      return `\\frac{1}{1${inner(-1)}}`;
  }
}

// Polynomial Σ c_k x^k in LaTeX, zero terms omitted.
function polyTex(coefs: Q[]): string {
  let out = "";
  coefs.forEach(([p, q], k) => {
    if (p === 0) return;
    const neg = p < 0;
    const abs = Math.abs(p);
    const xk = k === 0 ? "" : k === 1 ? "x" : `x^{${k}}`;
    let body: string;
    if (q === 1) body = k > 0 && abs === 1 ? xk : `${abs}${xk}`;
    else body = `\\frac{${k > 0 && abs === 1 ? "" : abs}${xk}}{${q}}`;
    out += neg ? `-${body}` : out ? `+${body}` : body;
  });
  return out || "0";
}

const randA = () => pick([-3, -2, -1, 1, 2, 3]);

// French scientific notation: 1,23 × 10^{-4}.
function sci(v: number): string {
  return v
    .toExponential(2)
    .replace(".", "{,}")
    .replace(/e([+-]\d+)/, (_, e: string) => ` \\times 10^{${Number(e)}}`);
}

// Decimal number in LaTeX: 0,3 → "0{,}3".
const dec = (v: number) => String(v).replace(".", "{,}");

const KINDS: Kind[] = ["exp", "sin", "cos", "ln", "geo"];
const BASE: Record<Kind, string> = {
  exp: "e^u = 1 + u + \\frac{u^2}{2!} + \\frac{u^3}{3!} + \\cdots",
  sin: "\\sin u = u - \\frac{u^3}{3!} + \\frac{u^5}{5!} - \\cdots",
  cos: "\\cos u = 1 - \\frac{u^2}{2!} + \\frac{u^4}{4!} - \\cdots",
  ln: "\\ln(1+u) = u - \\frac{u^2}{2} + \\frac{u^3}{3} - \\cdots \\quad (-1 < u \\le 1)",
  geo: "\\frac{1}{1-u} = 1 + u + u^2 + u^3 + \\cdots \\quad (|u| < 1)",
};
const uTex = (a: number) => (a === 1 ? "x" : a === -1 ? "-x" : `${a}x`);

// Coefficient of x^k in the expansion of f(ax).
function coefficient(): Exercise {
  const kind = pick(KINDS);
  const a = randA();
  let k = randInt(2, 5);
  // For sin and cos, mostly aim for an exponent of the right parity (otherwise the answer is 0).
  if (kind === "sin" && k % 2 === 0 && Math.random() < 0.8) k += 1;
  if (kind === "cos" && k % 2 === 1 && Math.random() < 0.8) k -= 1;
  const c = coef(kind, a, k);
  const answerTex = fracTex(c[0], c[1]);
  const base = coef(kind, 1, k);
  return {
    intro: `Coefficient de $x^{${k}}$ dans le développement de Taylor en 0 de :`,
    promptTex: `${fTex(kind, a)}`,
    answerTex,
    hint: `Pars du développement usuel en $u$, puis remplace $u$ par $${uTex(a)}$ : le terme en $u^{${k}}$ devient un terme en $x^{${k}}$ multiplié par $(${a})^{${k}}$.`,
    solution: [
      BASE[kind],
      `u = ${uTex(a)} : \\ u^{${k}} = (${a})^{${k}}\\,x^{${k}} = ${a ** k}\\,x^{${k}}`,
      c[0] === 0
        ? `\\text{Ce développement n'a pas de terme en } x^{${k}} \\text{ (mauvaise parité) : coefficient } 0`
        : `\\text{Coefficient de } x^{${k}} : \\ ${fracTex(base[0], base[1])} \\times ${a ** k < 0 ? `(${a ** k})` : a ** k} = ${answerTex}`,
    ],
  };
}

// Taylor polynomial of order n at 0, to be written out in full.
function taylorPolynomial(): Exercise {
  const kind = pick(KINDS);
  const a = pick([-2, -1, 1, 2]);
  const n = randInt(2, kind === "sin" || kind === "cos" ? 4 : 3);
  const coefs = Array.from({ length: n + 1 }, (_, k) => coef(kind, a, k));
  const answerTex = polyTex(coefs);
  return {
    intro: `Donne le polynôme de Taylor d'ordre ${n} en 0 (tous les termes jusqu'à $x^{${n}}$ inclus) de :`,
    promptTex: `${fTex(kind, a)}`,
    answerTex,
    hint: `Écris le développement usuel en $u$ jusqu'à $u^{${n}}$, remplace $u$ par $${uTex(a)}$ et développe chaque puissance.`,
    solution: [BASE[kind], `u = ${uTex(a)}`, `P_{${n}}(x) = ${answerTex}`],
  };
}

// Approximate value f(h) ≈ P_n(h), chosen so that the result is an exact decimal.
function approximation(): Exercise {
  const cases: { kind: Kind; n: number; hs: number[] }[] = [
    { kind: "exp", n: 2, hs: [1, 2, -1, -2] },
    { kind: "exp", n: 3, hs: [3, 6, -3] },
    { kind: "cos", n: 2, hs: [1, 2, 3, 4] },
    { kind: "sin", n: 3, hs: [3, 6, -3] },
    { kind: "ln", n: 2, hs: [1, 2, -1, 3] },
    { kind: "geo", n: 3, hs: [1, 2, -1, -2] },
  ];
  const { kind, n, hs } = pick(cases);
  const h10 = pick(hs); // h = h10 / 10
  // P_n(h) = Σ c_k h^k, as an exact fraction.
  let num = 0;
  let den = 1;
  for (let k = 0; k <= n; k++) {
    const [p, q] = coef(kind, 1, k);
    const tp = p * h10 ** k;
    const tq = q * 10 ** k;
    num = num * tq + tp * den;
    den = den * tq;
    [num, den] = reduce([num, den]);
  }
  const answerTex = fracTex(num, den);
  const decimal = dec(Number((num / den).toFixed(8)));
  const h = h10 / 10;
  const hTex = dec(h);
  const hAbs = dec(Math.abs(h));
  const coefs = Array.from({ length: n + 1 }, (_, k) => coef(kind, 1, k));
  const promptTex = {
    exp: `e^{${hTex}}`,
    sin: `\\sin(${hTex})`,
    cos: `\\cos(${hTex})`,
    ln: `\\ln(1 ${h < 0 ? "-" : "+"} ${hAbs})`,
    geo: `\\frac{1}{1 ${h < 0 ? "+" : "-"} ${hAbs}}`,
  }[kind];
  return {
    intro: `Avec le polynôme de Taylor d'ordre ${n} en 0 de la fonction usuelle, donne une valeur approchée de ce nombre. Réponds par la valeur exacte de $P_{${n}}(${hTex})$, qui est un nombre décimal.`,
    promptTex,
    answerTex,
    hint: "Écris $P_n$ pour la fonction usuelle, puis remplace x par la valeur. Les puissances d'un petit nombre deviennent vite minuscules.",
    solution: [
      `P_{${n}}(x) = ${polyTex(coefs)}`,
      `P_{${n}}(${hTex}) = ${decimal}`,
    ],
  };
}

// Limits resolved by a Taylor expansion.
function limitByTaylor(): Exercise {
  const a = pick([-3, -2, -1, 1, 2, 3, 4]);
  const ax = uTex(a);
  const lin = a === 1 ? "x" : a === -1 ? "(-x)" : `${a}x`;
  const variants: Exercise[] = [
    {
      promptTex: `\\lim_{x \\to 0} \\frac{e^{${ax}} - 1 ${a < 0 ? "+" : "-"} ${Math.abs(a) === 1 ? "" : Math.abs(a)}x}{x^2}`,
      answerTex: fracTex(a * a, 2),
      hint: "Développe l'exponentielle jusqu'à l'ordre 2 : les termes d'ordre 0 et 1 s'annulent.",
      solution: [
        `e^{${ax}} = 1 ${a < 0 ? "-" : "+"} ${Math.abs(a) === 1 ? "" : Math.abs(a)}x + \\frac{(${a})^2 x^2}{2} + (\\text{négligeable devant } x^2)`,
        `\\text{Le numérateur vaut } \\frac{${a * a}}{2}x^2 + \\dots, \\text{ donc la limite vaut } ${fracTex(a * a, 2)}`,
      ],
    },
    {
      promptTex: `\\lim_{x \\to 0} \\frac{1 - ${a === 1 ? "\\cos x" : `\\cos(${ax})`}}{x^2}`,
      answerTex: fracTex(a * a, 2),
      hint: "Développe le cosinus jusqu'à l'ordre 2.",
      solution: [
        `\\cos(${ax}) = 1 - \\frac{(${a})^2 x^2}{2} + (\\text{négligeable devant } x^2)`,
        `1 - \\cos(${ax}) = \\frac{${a * a}}{2}x^2 + \\dots \\ \\Rightarrow\\ ${fracTex(a * a, 2)}`,
      ],
    },
    {
      promptTex: `\\lim_{x \\to 0} \\frac{\\ln(1${a < 0 ? "-" : "+"}${Math.abs(a) === 1 ? "" : Math.abs(a)}x) ${a < 0 ? "+" : "-"} ${Math.abs(a) === 1 ? "" : Math.abs(a)}x}{x^2}`,
      answerTex: fracTex(-a * a, 2),
      hint: "Développe $\\ln(1+u)$ jusqu'à l'ordre 2 avec $u = " + ax + "$.",
      solution: [
        `\\ln(1 + u) = u - \\frac{u^2}{2} + \\dots \\quad\\text{avec } u = ${ax}`,
        `\\text{Le numérateur vaut } -\\frac{${a * a}}{2}x^2 + \\dots \\ \\Rightarrow\\ ${fracTex(-a * a, 2)}`,
      ],
    },
    {
      promptTex: `\\lim_{x \\to 0} \\frac{${a === 1 ? "\\sin x" : `\\sin(${ax})`} ${a < 0 ? "+" : "-"} ${Math.abs(a) === 1 ? "" : Math.abs(a)}x}{x^3}`,
      answerTex: fracTex(-(a ** 3), 6),
      hint: "Développe le sinus jusqu'à l'ordre 3.",
      solution: [
        `\\sin(${ax}) = ${lin} - \\frac{(${a})^3 x^3}{6} + (\\text{négligeable devant } x^3)`,
        `\\text{Le numérateur vaut } ${fracTex(-(a ** 3), 6)}\\,x^3 + \\dots \\ \\Rightarrow\\ ${fracTex(-(a ** 3), 6)}`,
      ],
    },
  ];
  return pick(variants);
}

// Smallest n such that P_n(h) approximates e^h to within 10^{-d}.
function precisionRank(): Exercise {
  let h: number, hTex: string, d: number, n: number, partial: number, term: number;
  // Discard cases where the error falls just under the threshold (e.g. h = 1, d = 2: 0,00995 < 0,01).
  do {
    [h, hTex] = pick([
      [1, "1"],
      [0.5, "\\tfrac12"],
    ] as const);
    d = randInt(2, 6);
    n = 0;
    partial = 1;
    term = 1;
    while (Math.abs(Math.exp(h) - partial) >= 10 ** -d) {
      n++;
      term *= h / n;
      partial += term;
    }
  } while (
    Math.abs(Math.exp(h) - partial) > 0.9 * 10 ** -d ||
    Math.abs(Math.exp(h) - (partial - term)) < 1.1 * 10 ** -d
  );
  const next = (h ** (n + 1)) / fact(n + 1);
  return {
    intro: `Plus petit entier n tel que $|e^{${hTex}} - P_n(${hTex})| < 10^{-${d}}$, où $P_n$ est le polynôme de Taylor d'ordre n de $e^x$ en 0.`,
    promptTex: `n = \\ ?`,
    answerTex: String(n),
    hint: "L'erreur est un peu plus grande que le premier terme oublié, $\\frac{h^{n+1}}{(n+1)!}$. Calcule ces termes un par un.",
    solution: [
      `e^{${hTex}} - P_n(${hTex}) = \\frac{h^{n+1}}{(n+1)!} + \\frac{h^{n+2}}{(n+2)!} + \\cdots \\quad (h = ${hTex})`,
      `n = ${n - 1} : \\text{ l'erreur vaut environ } ${sci(Math.exp(h) - (partial - term))} \\ge 10^{-${d}}`,
      `n = ${n} : \\text{ l'erreur vaut environ } ${sci(Math.exp(h) - partial)} < 10^{-${d}} \\quad (\\text{premier terme oublié : } ${sci(next)})`,
    ],
  };
}

// Code mode: which polynomial does this function return?
function codePolynomial(): Exercise {
  const kind = pick(["exp", "exp2", "cos", "sin", "geo", "ln"] as const);
  const n = randInt(3, 4);
  let code: string;
  let coefs: Q[];
  let hint: string;
  if (kind === "exp" || kind === "exp2") {
    const a = kind === "exp" ? 1 : 2;
    code = `def f(x):\n    s, terme = 0, 1\n    for k in range(${n}):\n        s += terme\n        terme *= ${a === 1 ? "x" : "2 * x"} / (k + 1)\n    return s`;
    coefs = Array.from({ length: n }, (_, k) => coef("exp", a, k));
    hint = `Déroule la boucle à la main : note la valeur de terme à chaque tour. Il y a ${n} tours.`;
  } else if (kind === "cos") {
    code = `def f(x):\n    s, terme = 0, 1\n    for k in range(${n - 1}):\n        s += terme\n        terme *= -x * x / ((2*k + 1) * (2*k + 2))\n    return s`;
    coefs = Array.from({ length: 2 * (n - 2) + 1 }, (_, k) => coef("cos", 1, k));
    hint = "Déroule la boucle : terme vaut 1, puis est multiplié par $-\\frac{x^2}{1 \\times 2}$, puis par $-\\frac{x^2}{3 \\times 4}$…";
  } else if (kind === "sin") {
    code = `def f(x):\n    s, terme = 0, x\n    for k in range(${n - 1}):\n        s += terme\n        terme *= -x * x / ((2*k + 2) * (2*k + 3))\n    return s`;
    coefs = Array.from({ length: 2 * (n - 2) + 2 }, (_, k) => coef("sin", 1, k));
    hint = "Déroule la boucle : terme vaut x, puis est multiplié par $-\\frac{x^2}{2 \\times 3}$, puis par $-\\frac{x^2}{4 \\times 5}$…";
  } else if (kind === "geo") {
    code = `def f(x):\n    s = 0\n    for k in range(${n + 1}):\n        s += x**k\n    return s`;
    coefs = Array.from({ length: n + 1 }, (_, k) => coef("geo", 1, k));
    hint = `range(${n + 1}) donne k = 0, 1, …, ${n}.`;
  } else {
    code = `def f(x):\n    s = 0\n    for k in range(1, ${n + 1}):\n        s += (-1)**(k + 1) * x**k / k\n    return s`;
    coefs = Array.from({ length: n + 1 }, (_, k) => coef("ln", 1, k));
    hint = `range(1, ${n + 1}) donne k = 1, …, ${n}. Attention au signe $(-1)^{k+1}$.`;
  }
  const answerTex = polyTex(coefs);
  const name: Record<typeof kind, string> = {
    exp: "e^x",
    exp2: "e^{2x}",
    cos: "\\cos x",
    sin: "\\sin x",
    geo: "\\frac{1}{1-x}",
    ln: "\\ln(1+x)",
  };
  return {
    intro: "Sans l'exécuter : quel polynôme en x cette fonction renvoie-t-elle ? Écris-le en entier.",
    code,
    promptTex: "f(x) = \\ ?",
    answerTex,
    hint,
    solution: [
      `\\text{C'est un polynôme de Taylor de } ${name[kind]} \\text{ en } 0`,
      `f(x) = ${answerTex}`,
    ],
  };
}

export const taylorGenerators: ExerciseGenerator[] = [
  { id: "coefficient-dl", make: coefficient },
  { id: "polynome-taylor", make: taylorPolynomial },
  { id: "approximation-taylor", make: approximation },
  { id: "limite-par-dl", make: limitByTaylor },
  { id: "rang-precision-exp", make: precisionRank },
  { id: "code-polynome", make: codePolynomial },
];
