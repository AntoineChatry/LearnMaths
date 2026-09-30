import { coef, fracTex, pick, randInt, randNonZero, signed } from "../../lib/random";
import { coefLead, xPow } from "../../lib/tex";
import type { Exercise, ExerciseGenerator } from "../types";

const dx = "\\,\\mathrm{d}x";
const integral = (lo: string, hi: string, integrand: string) => `\\int_{${lo}}^{${hi}} ${integrand}${dx}`;
const paren = (n: number) => (n < 0 ? `(${n})` : String(n));
// e^m written cleanly: 1 → "e", 2 → "e^{2}".
const expTex = (m: number) => (m === 1 ? "e" : `e^{${m}}`);
// TeX coefficient in front of a term: "1" → "", "-1" → "-".
const cf = (s: string) => (s === "1" ? "" : s === "-1" ? "-" : s);
// Negative term put in parentheses, to write "a − (−b)" rather than "a − −b".
const par = (t: string) => (t.startsWith("-") ? `\\left(${t}\\right)` : t);
// u^n, with u^1 written u.
const uPow = (n: number) => (n === 1 ? "u" : `u^{${n}}`);

// (num/den) × (inner), where inner is a sum: 1 → inner, -1 → -(inner), 3/2 → \frac{3}{2}(inner).
function scaled(num: number, den: number, inner: string): string {
  const s = fracTex(num, den);
  if (s === "1") return inner;
  if (s === "-1") return `-\\left(${inner}\\right)`;
  return `${s}\\left(${inner}\\right)`;
}

// Polynomial from its coefficients (coeffs[k] in front of x^k), from highest degree to lowest.
function polyTex(coeffs: number[]): string {
  let out = "";
  for (let k = coeffs.length - 1; k >= 0; k--) {
    const c = coeffs[k];
    if (c === 0) continue;
    if (k === 0) out += out ? signed(c) : String(c);
    else out += out ? (c > 0 ? "+" : "-") + coef(Math.abs(c)) + xPow(k) : coefLead(c) + xPow(k);
  }
  return out || "0";
}

// Antiderivative of a polynomial: each c·x^k becomes (c/(k+1))·x^{k+1}.
function polyPrimitiveTex(coeffs: number[]): string {
  let out = "";
  for (let k = coeffs.length - 1; k >= 0; k--) {
    const c = coeffs[k];
    if (c === 0) continue;
    const f = fracTex(c, k + 1);
    const neg = f.startsWith("-");
    const abs = neg ? f.slice(1) : f;
    const term = (abs === "1" ? "" : abs) + xPow(k + 1);
    out += neg ? `-${term}` : out ? `+${term}` : term;
  }
  return out || "0";
}

// Antiderivative evaluated at t, multiplied by 12 (common denominator of 1, 1/2, 1/3, 1/4) to stay an integer.
function polyPrimitiveTimes12(coeffs: number[], t: number): number {
  return coeffs.reduce((s, c, k) => s + (c * 12 * t ** (k + 1)) / (k + 1), 0);
}

// ---------- 1. Direct definite integrals (and average value) ----------

function definiteIntegral(): Exercise {
  const kind = randInt(0, 3);

  if (kind === 0) {
    const degree = randInt(2, 3);
    const coeffs = Array.from({ length: degree + 1 }, () => randInt(-4, 4));
    coeffs[degree] = randNonZero(-4, 4);
    const a = randInt(-2, 1);
    const b = randInt(a + 1, 3);
    const Fb = polyPrimitiveTimes12(coeffs, b);
    const Fa = polyPrimitiveTimes12(coeffs, a);
    const answerTex = fracTex(Fb - Fa, 12);
    return {
      promptTex: integral(String(a), String(b), `\\left(${polyTex(coeffs)}\\right)`),
      answerTex,
      hint: "Trouve une primitive terme à terme ($x^k$ devient $\\frac{x^{k+1}}{k+1}$), puis calcule $F(b) - F(a)$.",
      solution: [
        `F(x) = ${polyPrimitiveTex(coeffs)}`,
        `\\int_{${a}}^{${b}} = F(${b}) - F(${a}) = ${fracTex(Fb, 12)} - ${Fa < 0 ? `\\left(${fracTex(Fa, 12)}\\right)` : fracTex(Fa, 12)} = ${answerTex}`,
      ],
    };
  }

  if (kind === 1) {
    const k = randNonZero(-4, 4);
    const m = pick([-2, -1, 1, 2, 3]);
    const b = pick([1, 2]);
    const inner = `${expTex(m * b)}-1`;
    const answerTex = scaled(k, m, inner);
    const mx = m === 1 ? "x" : m === -1 ? "-x" : `${m}x`;
    return {
      promptTex: integral("0", String(b), `${coefLead(k)}e^{${mx}}`),
      answerTex,
      hint: "Une primitive de $e^{mx}$ est $\\frac{1}{m}e^{mx}$ (c'est $u'e^u$ à une constante près).",
      solution: [
        `F(x) = ${cf(fracTex(k, m))}e^{${mx}}`,
        `F(${b}) - F(0) = ${cf(fracTex(k, m))}${expTex(m * b)} - ${par(`${cf(fracTex(k, m))}e^{0}`)} = ${answerTex}`,
      ],
    };
  }

  if (kind === 2) {
    const k = randNonZero(-4, 4);
    const m = randInt(1, 3);
    const mx = m === 1 ? "x" : `${m}x`;
    if (Math.random() < 0.5) {
      const hi = `\\frac{\\pi}{${2 * m}}`;
      const answerTex = fracTex(k, m);
      return {
        promptTex: integral("0", hi, `${coefLead(k)}\\cos(${mx})`),
        answerTex,
        hint: "Une primitive de $\\cos(mx)$ est $\\frac{1}{m}\\sin(mx)$.",
        solution: [
          `F(x) = ${cf(fracTex(k, m))}\\sin(${mx})`,
          `F\\left(${hi}\\right) - F(0) = ${cf(fracTex(k, m))}\\sin\\left(\\frac{\\pi}{2}\\right) - ${par(`${cf(fracTex(k, m))}\\sin 0`)} = ${answerTex}`,
        ],
      };
    }
    const hi = m === 1 ? "\\pi" : `\\frac{\\pi}{${m}}`;
    const answerTex = fracTex(2 * k, m);
    return {
      promptTex: integral("0", hi, `${coefLead(k)}\\sin(${mx})`),
      answerTex,
      hint: "Une primitive de $\\sin(mx)$ est $-\\frac{1}{m}\\cos(mx)$. Attention au signe.",
      solution: [
        `F(x) = ${cf(fracTex(-k, m))}\\cos(${mx})`,
        `F\\left(${hi}\\right) - F(0) = ${cf(fracTex(-k, m))}\\cos\\pi - ${par(`${cf(fracTex(-k, m))}\\cos 0`)} = ${fracTex(k, m)} ${k > 0 ? "+" : ""} ${fracTex(k, m)} = ${answerTex}`,
      ],
    };
  }

  // Average value.
  if (Math.random() < 0.6) {
    const p = randNonZero(-4, 4);
    const q = randInt(-5, 5);
    const b = randInt(2, 3);
    const answerTex = fracTex(p * b * b + 3 * q, 3);
    const f = polyTex([q, 0, p]);
    return {
      intro: `Valeur moyenne de $f(x) = ${f}$ sur $[0, ${b}]$.`,
      promptTex: `\\mu = \\frac{1}{${b}}${integral("0", String(b), `\\left(${f}\\right)`)}`,
      answerTex,
      hint: "Calcule l'intégrale, puis divise par la longueur de l'intervalle.",
      solution: [
        `${integral("0", String(b), `\\left(${f}\\right)`)} = \\left[${polyPrimitiveTex([q, 0, p])}\\right]_0^{${b}} = ${fracTex(p * b ** 3 + 3 * q * b, 3)}`,
        `\\mu = \\frac{1}{${b}} \\times ${par(fracTex(p * b ** 3 + 3 * q * b, 3))} = ${answerTex}`,
      ],
    };
  }
  const k = randNonZero(-4, 4);
  const answerTex = k < 0 ? `-\\frac{${-2 * k}}{\\pi}` : `\\frac{${2 * k}}{\\pi}`;
  return {
    intro: `Valeur moyenne de $f(x) = ${coefLead(k)}\\sin x$ sur $[0, \\pi]$.`,
    promptTex: `\\mu = \\frac{1}{\\pi}${integral("0", "\\pi", `${coefLead(k)}\\sin(x)`)}`,
    answerTex,
    hint: "Une primitive de $\\sin$ est $-\\cos$. Ne divise pas par 2 : la longueur de l'intervalle est $\\pi$.",
    solution: [
      `${integral("0", "\\pi", `${coefLead(k)}\\sin(x)`)} = \\left[${coefLead(-k)}\\cos x\\right]_0^{\\pi} = ${2 * k}`,
      `\\mu = \\frac{1}{\\pi} \\times ${par(String(2 * k))} = ${answerTex}`,
    ],
  };
}

// ---------- 2. Riemann sum for a given n ----------

const METHOD_TEXT = {
  gauche: "au bord gauche",
  droite: "au bord droit",
  milieu: "au milieu",
} as const;

function riemannSum(): Exercise {
  const method = pick(["gauche", "droite", "milieu"] as const);
  const n = randInt(2, 4);
  const h2 = pick([1, 2]); // width h = h2 / 2
  const a = randInt(-1, 1);
  const b2 = 2 * a + n * h2; // b = b2 / 2
  const p = randNonZero(-3, 3);
  const r = randInt(-3, 3);
  const q = randInt(-4, 4);
  const coeffs = Math.random() < 0.3 ? [q, p] : [q, r, p];
  const f = (x: number) => coeffs.reduce((s, c, k) => s + c * x ** k, 0);

  const offset = method === "gauche" ? 0 : method === "droite" ? 1 : 0.5;
  const xs = Array.from({ length: n }, (_, i) => a + ((i + offset) * h2) / 2);
  const sum = xs.reduce((s, x) => s + f(x) * (h2 / 2), 0);
  // x is a multiple of 1/4, x² of 1/16, h of 1/2: the sum is a multiple of 1/32.
  const num = Math.round(sum * 64);
  if (Math.abs(sum * 64 - num) > 1e-9) throw new Error("somme de Riemann non dyadique");
  const answerTex = fracTex(num, 64);
  const hTex = fracTex(h2, 2);
  const xsTex = xs.map((x) => fracTex(Math.round(x * 4), 4));

  return {
    intro: `On découpe l'intervalle en $n = ${n}$ bandes de même largeur, et chaque rectangle prend la hauteur de $f$ ${METHOD_TEXT[method]} de sa bande. Donne la somme exacte des aires.`,
    promptTex: `f(x) = ${polyTex(coeffs)} \\quad \\text{sur} \\quad \\left[${a},\\ ${fracTex(b2, 2)}\\right] \\qquad S_{${n}}^{\\text{${method}}} = \\ ?`,
    answerTex,
    hint: `La largeur vaut $h = \\frac{b-a}{n}$. Liste les ${n} abscisses où tu lis $f$, puis calcule $h \\times$ (somme des hauteurs).`,
    solution: [
      `h = \\frac{${fracTex(b2, 2)} - ${paren(a)}}{${n}} = ${hTex}`,
      `\\text{Abscisses : } ${xsTex.join(",\\ ")}`,
      `S_{${n}} = ${hTex} \\times \\left(${xs
        .map((x, i) => {
          const t = fracTex(Math.round(f(x) * 16), 16);
          return i === 0 ? t : t.startsWith("-") ? ` ${t}` : ` + ${t}`;
        })
        .join("")}\\right) = ${answerTex}`,
    ],
  };
}

// ---------- 3. Integration by parts ----------

function byParts(): Exercise {
  const kind = randInt(0, 2);

  if (kind === 0) {
    const a = randInt(1, 3);
    const ax = a === 1 ? "x" : `${a}x`;
    const answerTex = a === 1 ? "1" : `\\frac{${a === 2 ? "" : a - 1}e^{${a}}+1}{${a * a}}`;
    const inv = a === 1 ? "" : fracTex(1, a);
    const inv2 = a === 1 ? "" : fracTex(1, a * a);
    return {
      promptTex: integral("0", "1", `xe^{${ax}}`),
      answerTex,
      hint: "Pose $u = x$ (qui se simplifie en le dérivant) et $v' = e^{ax}$.",
      solution: [
        `u = x,\\ u' = 1 \\qquad v' = e^{${ax}},\\ v = ${inv}e^{${ax}}`,
        `= \\left[${inv}\\,x e^{${ax}}\\right]_0^1 - ${inv}\\int_0^1 e^{${ax}}${dx} = ${inv}${expTex(a)} - ${inv2}\\left(${expTex(a)} - 1\\right)`,
        `= ${answerTex}`,
      ],
    };
  }

  if (kind === 1) {
    const n = randInt(1, 3);
    const answerTex = `\\frac{${n === 1 ? "" : n}e^{${n + 1}}+1}{${(n + 1) ** 2}}`;
    return {
      promptTex: integral("1", "e", `${xPow(n)}\\ln x`),
      answerTex,
      hint: "Pose $u = \\ln x$ (sa dérivée $\\frac1x$ est plus simple) et $v' = x^n$.",
      solution: [
        `u = \\ln x,\\ u' = \\frac1x \\qquad v' = ${xPow(n)},\\ v = \\frac{x^{${n + 1}}}{${n + 1}}`,
        `= \\left[\\frac{x^{${n + 1}}}{${n + 1}}\\ln x\\right]_1^e - \\int_1^e \\frac{${xPow(n)}}{${n + 1}}${dx} = \\frac{e^{${n + 1}}}{${n + 1}} - \\frac{e^{${n + 1}} - 1}{${(n + 1) ** 2}}`,
        `= ${answerTex}`,
      ],
    };
  }

  const k = randInt(1, 3);
  const kx = k === 1 ? "x" : `${k}x`;
  const kc = coefLead(k);
  const variant = randInt(0, 3);
  if (variant === 0) {
    const answerTex = `${coefLead(k)}\\pi`;
    return {
      promptTex: integral("0", "\\pi", `${kx}\\sin(x)`),
      answerTex,
      hint: "Pose $u$ égal à la partie polynomiale et $v' = \\sin x$, donc $v = -\\cos x$.",
      solution: [
        `u = ${kx},\\ u' = ${k} \\qquad v' = \\sin x,\\ v = -\\cos x`,
        `= \\left[-${kx}\\cos x\\right]_0^{\\pi} + ${kc}\\int_0^{\\pi} \\cos x${dx} = ${kc}\\pi + ${kc}\\left[\\sin x\\right]_0^{\\pi} = ${answerTex}`,
      ],
    };
  }
  if (variant === 1) {
    const answerTex = String(-2 * k);
    return {
      promptTex: integral("0", "\\pi", `${kx}\\cos(x)`),
      answerTex,
      hint: "Pose $u$ égal à la partie polynomiale et $v' = \\cos x$, donc $v = \\sin x$.",
      solution: [
        `u = ${kx},\\ u' = ${k} \\qquad v' = \\cos x,\\ v = \\sin x`,
        `= \\left[${kx}\\sin x\\right]_0^{\\pi} - ${kc}\\int_0^{\\pi} \\sin x${dx} = 0 - ${kc}\\left[-\\cos x\\right]_0^{\\pi} = -${k} \\times 2 = ${answerTex}`,
      ],
    };
  }
  if (variant === 2) {
    const answerTex = String(k);
    return {
      promptTex: integral("0", "\\frac{\\pi}{2}", `${kx}\\sin(x)`),
      answerTex,
      hint: "Pose $u$ égal à la partie polynomiale et $v' = \\sin x$, donc $v = -\\cos x$.",
      solution: [
        `u = ${kx},\\ u' = ${k} \\qquad v' = \\sin x,\\ v = -\\cos x`,
        `= \\left[-${kx}\\cos x\\right]_0^{\\pi/2} + ${kc}\\int_0^{\\pi/2} \\cos x${dx} = 0 + ${kc}\\left[\\sin x\\right]_0^{\\pi/2} = ${answerTex}`,
      ],
    };
  }
  const answerTex = k === 1 ? "\\frac{\\pi}{2}-1" : k === 2 ? "\\pi-2" : "\\frac{3\\pi}{2}-3";
  return {
    promptTex: integral("0", "\\frac{\\pi}{2}", `${kx}\\cos(x)`),
    answerTex,
    hint: "Pose $u$ égal à la partie polynomiale et $v' = \\cos x$, donc $v = \\sin x$.",
    solution: [
      `u = ${kx},\\ u' = ${k} \\qquad v' = \\cos x,\\ v = \\sin x`,
      `= \\left[${kx}\\sin x\\right]_0^{\\pi/2} - ${kc}\\int_0^{\\pi/2} \\sin x${dx} = \\frac{${kc}\\pi}{2} - ${kc}\\left[-\\cos x\\right]_0^{\\pi/2} = ${answerTex}`,
    ],
  };
}

// ---------- 4. Change of variable ----------

const PYTHAGOREAN: [number, number, number][] = [
  [3, 4, 5],
  [4, 3, 5],
  [5, 12, 13],
  [12, 5, 13],
  [6, 8, 10],
  [8, 6, 10],
];

function substitution(): Exercise {
  const kind = randInt(0, 3);

  if (kind === 0) {
    const n = randInt(1, 3);
    const m = randInt(1, 3);
    const answerTex = fracTex(m ** (n + 1), n + 1);
    const num = n === 1 ? "\\ln x" : `(\\ln x)^{${n}}`;
    return {
      promptTex: integral("1", expTex(m), `\\frac{${num}}{x}`),
      answerTex,
      hint: "Pose $u = \\ln x$ : alors $\\mathrm{d}u = \\frac{\\mathrm{d}x}{x}$. N'oublie pas de changer les bornes.",
      solution: [
        `u = \\ln x,\\quad \\mathrm{d}u = \\frac{\\mathrm{d}x}{x},\\quad x = 1 \\mapsto u = 0,\\quad x = ${expTex(m)} \\mapsto u = ${m}`,
        `= \\int_0^{${m}} ${uPow(n)}\\,\\mathrm{d}u = \\left[\\frac{u^{${n + 1}}}{${n + 1}}\\right]_0^{${m}} = ${answerTex}`,
      ],
    };
  }

  if (kind === 1) {
    const n = randInt(1, 5);
    const k = randInt(1, 4);
    const answerTex = fracTex(k, n + 1);
    const sinPow = n === 1 ? "\\sin(x)" : `(\\sin x)^{${n}}`;
    return {
      promptTex: integral("0", "\\frac{\\pi}{2}", `${coefLead(k)}${sinPow}\\cos(x)`),
      answerTex,
      hint: "Pose $u = \\sin x$ : alors $\\mathrm{d}u = \\cos x\\,\\mathrm{d}x$.",
      solution: [
        `u = \\sin x,\\quad \\mathrm{d}u = \\cos x${dx},\\quad x = 0 \\mapsto u = 0,\\quad x = \\tfrac{\\pi}{2} \\mapsto u = 1`,
        `= ${coefLead(k)}\\int_0^1 ${uPow(n)}\\,\\mathrm{d}u = ${coefLead(k)}\\left[\\frac{u^{${n + 1}}}{${n + 1}}\\right]_0^1 = ${answerTex}`,
      ],
    };
  }

  if (kind === 2) {
    const m = randInt(1, 3);
    const k = randInt(1, 4);
    const answerTex = scaled(k, 2, `${expTex(m)}-1`);
    const hi = m === 1 ? "1" : `\\sqrt{${m}}`;
    return {
      promptTex: integral("0", hi, `${coefLead(k)}xe^{x^{2}}`),
      answerTex,
      hint: "Pose $u = x^2$ : alors $\\mathrm{d}u = 2x\\,\\mathrm{d}x$, donc $x\\,\\mathrm{d}x = \\frac{\\mathrm{d}u}{2}$.",
      solution: [
        `u = x^2,\\quad \\mathrm{d}u = 2x${dx},\\quad x = 0 \\mapsto u = 0,\\quad x = ${hi} \\mapsto u = ${m}`,
        `= ${cf(fracTex(k, 2))}\\int_0^{${m}} e^{u}\\,\\mathrm{d}u = ${cf(fracTex(k, 2))}\\left[e^u\\right]_0^{${m}} = ${answerTex}`,
      ],
    };
  }

  const [r, c, hyp] = pick(PYTHAGOREAN);
  const answerTex = String(hyp - c);
  return {
    promptTex: integral("0", String(r), `\\frac{x}{\\sqrt{x^{2}+${c * c}}}`),
    answerTex,
    hint: `Pose $u = x^2 + ${c * c}$ : alors $\\mathrm{d}u = 2x\\,\\mathrm{d}x$. Une primitive de $\\frac{1}{2\\sqrt{u}}$ est $\\sqrt{u}$.`,
    solution: [
      `u = x^2 + ${c * c},\\quad \\mathrm{d}u = 2x${dx},\\quad x = 0 \\mapsto u = ${c * c},\\quad x = ${r} \\mapsto u = ${r * r + c * c}`,
      `= \\int_{${c * c}}^{${r * r + c * c}} \\frac{\\mathrm{d}u}{2\\sqrt{u}} = \\left[\\sqrt{u}\\right]_{${c * c}}^{${r * r + c * c}} = ${hyp} - ${c} = ${answerTex}`,
    ],
  };
}

// ---------- 5. Improper integrals ----------

function improper(): Exercise {
  const kind = randInt(0, 2);

  if (kind === 0) {
    const k = randInt(1, 5);
    // p = pNum / 2
    const pNum = pick([1, 2, 3, 4, 6, 8]);
    const integrand =
      pNum === 1
        ? `\\frac{${k}}{\\sqrt{x}}`
        : pNum === 2
          ? `\\frac{${k}}{x}`
          : pNum === 3
            ? `\\frac{${k}}{x\\sqrt{x}}`
            : `\\frac{${k}}{x^{${pNum / 2}}}`;
    const pTex = fracTex(pNum, 2);
    const converges = pNum > 2;
    const answerTex = converges ? fracTex(2 * k, pNum - 2) : "+\\infty";
    return {
      intro: "Donne la valeur de l'intégrale, ou $+\\infty$ si elle diverge.",
      promptTex: integral("1", "+\\infty", integrand),
      answerTex,
      hint: "Écris l'intégrande sous la forme $k\\,x^{-p}$ et souviens-toi : $\\int_1^{+\\infty} \\frac{\\mathrm{d}x}{x^p}$ converge si et seulement si $p > 1$.",
      solution: converges
        ? [
            `${integrand} = ${coefLead(k)}x^{-${pTex}}, \\quad p = ${pTex} > 1`,
            `\\int_1^A ${coefLead(k)}x^{-${pTex}}${dx} = ${coefLead(k)}\\left[\\frac{x^{1-${pTex}}}{1-${pTex}}\\right]_1^A = ${scaled(2 * k, pNum - 2, `1 - A^{1-${pTex}}`)} \\xrightarrow[A \\to +\\infty]{} ${answerTex}`,
          ]
        : pNum === 2
          ? [`\\int_1^A \\frac{${k}}{x}${dx} = ${coefLead(k)}\\ln A \\xrightarrow[A \\to +\\infty]{} +\\infty`]
          : [
              `\\frac{${k}}{\\sqrt{x}} = ${coefLead(k)}x^{-1/2}, \\quad p = \\tfrac12 \\le 1`,
              `\\int_1^A ${coefLead(k)}x^{-1/2}${dx} = ${2 * k}\\left(\\sqrt{A} - 1\\right) \\xrightarrow[A \\to +\\infty]{} +\\infty`,
            ],
    };
  }

  if (kind === 1) {
    const k = randInt(1, 6);
    const m = randInt(1, 4);
    const mx = m === 1 ? "x" : `${m}x`;
    const answerTex = fracTex(k, m);
    return {
      intro: "Donne la valeur de l'intégrale, ou $+\\infty$ si elle diverge.",
      promptTex: integral("0", "+\\infty", `${coefLead(k)}e^{-${mx}}`),
      answerTex,
      hint: "Intègre jusqu'à $A$, puis fais tendre $A$ vers $+\\infty$ : $e^{-mA} \\to 0$.",
      solution: [
        `\\int_0^A ${coefLead(k)}e^{-${mx}}${dx} = \\left[${cf(fracTex(-k, m))}e^{-${mx}}\\right]_0^A = ${scaled(k, m, `1 - e^{-${m === 1 ? "" : m}A}`)}`,
        `\\xrightarrow[A \\to +\\infty]{} ${answerTex}`,
      ],
    };
  }

  const m = randInt(1, 3);
  const mx = m === 1 ? "x" : `${m}x`;
  const answerTex = fracTex(1, m * m);
  return {
    intro: "Donne la valeur de l'intégrale, ou $+\\infty$ si elle diverge.",
    promptTex: integral("0", "+\\infty", `xe^{-${mx}}`),
    answerTex,
    hint: "Intégration par parties avec $u = x$, puis limite en $+\\infty$ : $A e^{-mA} \\to 0$ par croissance comparée.",
    solution: [
      `\\int_0^A xe^{-${mx}}${dx} = \\left[${cf(fracTex(-1, m))}x e^{-${mx}}\\right]_0^A + ${cf(fracTex(1, m))}\\int_0^A e^{-${mx}}${dx}`,
      `= ${cf(fracTex(-1, m))}A e^{-${m === 1 ? "" : m}A} + ${scaled(1, m * m, `1 - e^{-${m === 1 ? "" : m}A}`)} \\xrightarrow[A \\to +\\infty]{} ${answerTex}`,
    ],
  };
}

// ---------- 6. Code mode: what does this loop compute? ----------

type CodeCase = { fx: string; a: string; b: string; answerTex: string; integralTex: string; primitive: string };

function codeCase(): CodeCase {
  const kind = randInt(0, 5);
  if (kind === 0) {
    const k = randInt(1, 3);
    const b = randInt(1, 3);
    const answerTex = fracTex(b ** (k + 1), k + 1);
    return {
      fx: k === 1 ? "x" : `x**${k}`,
      a: "0",
      b: String(b),
      answerTex,
      integralTex: integral("0", String(b), xPow(k)),
      primitive: `\\left[\\frac{x^{${k + 1}}}{${k + 1}}\\right]_0^{${b}} = ${answerTex}`,
    };
  }
  if (kind === 1) {
    const m = randInt(1, 2);
    return {
      fx: "math.exp(x)",
      a: "0",
      b: String(m),
      answerTex: `${expTex(m)}-1`,
      integralTex: integral("0", String(m), "e^{x}"),
      primitive: `\\left[e^x\\right]_0^{${m}} = ${expTex(m)}-1`,
    };
  }
  if (kind === 2) {
    return {
      fx: "math.sin(x)",
      a: "0",
      b: "math.pi",
      answerTex: "2",
      integralTex: integral("0", "\\pi", "\\sin(x)"),
      primitive: "\\left[-\\cos x\\right]_0^{\\pi} = 1 + 1 = 2",
    };
  }
  if (kind === 3) {
    return {
      fx: "math.cos(x)",
      a: "0",
      b: "math.pi / 2",
      answerTex: "1",
      integralTex: integral("0", "\\frac{\\pi}{2}", "\\cos(x)"),
      primitive: "\\left[\\sin x\\right]_0^{\\pi/2} = 1",
    };
  }
  if (kind === 4) {
    const m = pick([2, 3, 5, 10]);
    return {
      fx: "1 / x",
      a: "1",
      b: String(m),
      answerTex: `\\ln ${m}`,
      integralTex: integral("1", String(m), "\\frac{1}{x}"),
      primitive: `\\left[\\ln x\\right]_1^{${m}} = \\ln ${m}`,
    };
  }
  return {
    fx: "x * math.exp(x)",
    a: "0",
    b: "1",
    answerTex: "1",
    integralTex: integral("0", "1", "xe^{x}"),
    primitive: "\\left[xe^x\\right]_0^1 - \\int_0^1 e^x\\,\\mathrm{d}x = e - (e - 1) = 1 \\quad \\text{(par parties)}",
  };
}

function codeIntegration(): Exercise {
  const c = codeCase();
  return {
    intro: "Sans l'exécuter : ce programme affiche une approximation d'un nombre. Lequel, en valeur exacte ?",
    code: `import math

def f(x):
    return ${c.fx}

a, b = ${c.a}, ${c.b}
n = 100_000
h = (b - a) / n
s = 0
for i in range(n):
    s += f(a + (i + 0.5) * h) * h
print(s)`,
    promptTex: "s \\approx \\ ?",
    answerTex: c.answerTex,
    hint: "La boucle additionne des rectangles de largeur $h$ lus au milieu de chaque bande : c'est une somme de Riemann. Quelle intégrale approche-t-elle ?",
    solution: [
      `s = \\sum_{i=0}^{n-1} f\\big(a + (i + \\tfrac12)h\\big)\\,h \\approx ${c.integralTex}`,
      `${c.integralTex} = ${c.primitive}`,
    ],
  };
}

export const integrationGenerators: ExerciseGenerator[] = [
  { id: "integrale-definie", make: definiteIntegral },
  { id: "somme-riemann", make: riemannSum },
  { id: "integration-par-parties", make: byParts },
  { id: "changement-de-variable", make: substitution },
  { id: "integrale-impropre", make: improper },
  { id: "code-integration", make: codeIntegration },
];
