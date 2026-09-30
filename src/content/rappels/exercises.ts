import { fracTex, pick, randInt, randNonZero, signed } from "../../lib/random";
import { coefLead, linearTerm } from "../../lib/tex";
import type { Exercise, ExerciseGenerator } from "../types";

// ax + b written cleanly: (2, -3) → "2x-3", (-1, 0) → "-x".
const lin = (a: number, b: number) => `${coefLead(a)}x${signed(b)}`;

// kx as an exponent: 1 → "x", -1 → "-x", 3 → "3x".
const kx = (k: number) => `${coefLead(k)}x`;

// Coefficient written in front of a parenthesis or a function, from a fraction: 1 → "", -1 → "-", 3/2 → "\frac{3}{2}".
function coefFrac(num: number, den: number): string {
  const c = fracTex(num, den);
  if (c === "1") return "";
  if (c === "-1") return "-";
  return c;
}

// Sum of terms (num/den)·x^p, zero terms are omitted.
function polyFrac(terms: [number, number, number][]): string {
  let out = "";
  for (const [num, den, p] of terms) {
    if (num === 0) continue;
    const power = p === 0 ? "" : p === 1 ? "x" : `x^{${p}}`;
    const c = p === 0 ? fracTex(num, den) : coefFrac(num, den);
    const body = `${c}${power}`;
    out += out === "" || body.startsWith("-") ? body : `+${body}`;
  }
  return out || "0";
}

const eTex = (c: number) => (c === 1 ? "e" : `e^{${c}}`);

// Derivative of a composite f(ax + b) or e^{u}.
function derivativeComposite(): Exercise {
  const a = randNonZero(-4, 4);
  const b = randNonZero(-5, 5);
  const u = lin(a, b);
  const kind = randInt(0, 5);
  let f: string, ans: string, rule: string;
  if (kind === 0) {
    f = `e^{${u}}`;
    ans = `${coefLead(a)}e^{${u}}`;
    rule = "(e^u)' = u'\\,e^u";
  } else if (kind === 1) {
    const n = randInt(2, 5);
    f = `(${u})^{${n}}`;
    ans = `${n * a}(${u})${n - 1 === 1 ? "" : `^{${n - 1}}`}`;
    rule = `(u^{${n}})' = ${n}\\,u'\\,u^{${n - 1}}`;
  } else if (kind === 2) {
    f = `\\ln(${u})`;
    ans = `\\frac{${a}}{${u}}`;
    rule = "(\\ln u)' = \\frac{u'}{u}";
  } else if (kind === 3) {
    f = `\\sin(${u})`;
    ans = `${coefLead(a)}\\cos(${u})`;
    rule = "(\\sin u)' = u'\\cos u";
  } else if (kind === 4) {
    f = `\\cos(${u})`;
    ans = `${coefLead(-a)}\\sin(${u})`;
    rule = "(\\cos u)' = -u'\\sin u";
  } else {
    const c = randInt(-4, 4);
    const inner = `x^2${linearTerm(c)}`;
    f = `e^{${inner}}`;
    ans = `(2x${signed(c)})e^{${inner}}`;
    return {
      intro: "Dérive f. Réponse en fonction de $x$.",
      promptTex: `f(x) = ${f} \\qquad f'(x) = \\ ?`,
      answerTex: ans,
      hint: "C'est $e^{u}$ avec $u$ un polynôme : $(e^u)' = u' e^u$.",
      solution: [`u(x) = ${inner},\\quad u'(x) = 2x${signed(c)}`, `f'(x) = u'(x)\\,e^{u(x)} = ${ans}`],
    };
  }
  return {
    intro: "Dérive f. Réponse en fonction de $x$.",
    promptTex: `f(x) = ${f} \\qquad f'(x) = \\ ?`,
    answerTex: ans,
    hint: `Pose $u(x) = ${u}$, donc $u'(x) = ${a}$, et applique $${rule}$.`,
    solution: [`u(x) = ${u},\\quad u'(x) = ${a}`, `${rule}`, `f'(x) = ${ans}`],
  };
}

// Derivative of a product or a quotient.
function derivativeProductQuotient(): Exercise {
  const kind = randInt(0, 2);
  if (kind === 0) {
    const a = randNonZero(-4, 4);
    const b = randInt(-5, 5);
    const k = randNonZero(-3, 3);
    const u = lin(a, b);
    const ans = `(${lin(k * a, a + k * b)})e^{${kx(k)}}`;
    return {
      intro: "Dérive f. Réponse en fonction de $x$.",
      promptTex: `f(x) = (${u})e^{${kx(k)}} \\qquad f'(x) = \\ ?`,
      answerTex: ans,
      hint: "Produit $uv$ avec $u = $ le facteur affine et $v = e^{kx}$ : $(uv)' = u'v + uv'$, puis factorise par l'exponentielle.",
      solution: [
        `u = ${u},\\ u' = ${a} \\qquad v = e^{${kx(k)}},\\ v' = ${k}e^{${kx(k)}}`,
        `f'(x) = ${a}e^{${kx(k)}} + (${u}) \\times ${k < 0 ? `(${k})` : k}e^{${kx(k)}}`,
        `f'(x) = \\big(${a}${linearTerm(k * a)}${signed(k * b)}\\big)e^{${kx(k)}} = ${ans}`,
      ],
    };
  }
  if (kind === 1) {
    const n = randInt(2, 3);
    const trig = pick(["sin", "cos"] as const);
    const low = n - 1 === 1 ? "x" : `x^{${n - 1}}`;
    const ans =
      trig === "sin" ? `${n}${low}\\sin(x)+x^{${n}}\\cos(x)` : `${n}${low}\\cos(x)-x^{${n}}\\sin(x)`;
    return {
      intro: "Dérive f. Réponse en fonction de $x$.",
      promptTex: `f(x) = x^{${n}}\\${trig}(x) \\qquad f'(x) = \\ ?`,
      answerTex: ans,
      hint: "Produit de deux fonctions : $(uv)' = u'v + uv'$.",
      solution: [
        `u = x^{${n}},\\ u' = ${n}${low} \\qquad v = \\${trig} x,\\ v' = ${trig === "sin" ? "\\cos x" : "-\\sin x"}`,
        `f'(x) = u'v + uv' = ${ans}`,
      ],
    };
  }
  let a = 0, b = 0, c = 0, d = 0;
  do {
    a = randNonZero(-4, 4);
    b = randInt(-5, 5);
    c = randNonZero(-3, 3);
    d = randNonZero(-5, 5);
  } while (a * d - b * c === 0);
  const det = a * d - b * c;
  const ans = `\\frac{${det}}{(${lin(c, d)})^2}`;
  return {
    intro: "Dérive f. Réponse en fonction de $x$.",
    promptTex: `f(x) = \\frac{${lin(a, b)}}{${lin(c, d)}} \\qquad f'(x) = \\ ?`,
    answerTex: ans,
    hint: "Quotient : $\\left(\\frac{u}{v}\\right)' = \\frac{u'v - uv'}{v^2}$. Au numérateur, les termes en $x$ se simplifient.",
    solution: [
      `u = ${lin(a, b)},\\ u' = ${a} \\qquad v = ${lin(c, d)},\\ v' = ${c}`,
      `f'(x) = \\frac{${a}(${lin(c, d)}) - (${lin(a, b)}) \\times ${c < 0 ? `(${c})` : c}}{(${lin(c, d)})^2}`,
      `\\text{Numérateur : } ${lin(a * c, a * d)}${linearTerm(-a * c)}${signed(-b * c)} = ${det}`,
      `f'(x) = ${ans}`,
    ],
  };
}

// Antiderivative vanishing at 0: the constant matters.
function primitiveCondition(): Exercise {
  const kind = randInt(0, 3);
  let f: string, F: string, steps: string[];
  if (kind === 0) {
    const al = randNonZero(-5, 5);
    const be = randInt(-6, 6);
    const ga = randInt(-6, 6);
    f = `${coefLead(al)}x^2${linearTerm(be)}${signed(ga)}`;
    F = polyFrac([
      [al, 3, 3],
      [be, 2, 2],
      [ga, 1, 1],
    ]);
    steps = [`F(x) = ${F} + C`, `F(0) = C = 0`];
  } else if (kind === 1) {
    const A = randNonZero(-5, 5);
    const w = randInt(2, 4);
    f = `${coefLead(A)}\\cos(${w}x)`;
    F = `${coefFrac(A, w)}\\sin(${w}x)`;
    steps = [`F(x) = ${F} + C`, `F(0) = ${coefFrac(A, w)}\\sin 0 + C = C = 0`];
  } else if (kind === 2) {
    const A = randNonZero(-5, 5);
    const w = randInt(2, 4);
    f = `${coefLead(A)}\\sin(${w}x)`;
    const c = fracTex(A, w);
    F = `${coefFrac(A, w)}\\left(1-\\cos(${w}x)\\right)`;
    steps = [
      `F(x) = ${coefFrac(-A, w)}\\cos(${w}x) + C`,
      `F(0) = ${fracTex(-A, w)} + C = 0 \\iff C = ${c}`,
      `F(x) = ${F}`,
    ];
  } else {
    const k = randNonZero(-4, 4);
    f = `e^{${kx(k)}}`;
    F = k > 0 ? `\\frac{e^{${kx(k)}}-1}{${k}}` : `\\frac{1-e^{${kx(k)}}}{${-k}}`;
    if (k === 1) F = "e^{x}-1";
    if (k === -1) F = "1-e^{-x}";
    steps = [
      `F(x) = ${coefFrac(1, k)}e^{${kx(k)}} + C`,
      `F(0) = ${fracTex(1, k)} + C = 0 \\iff C = ${fracTex(-1, k)}`,
      `F(x) = ${F}`,
    ];
  }
  return {
    intro: "Trouve la primitive $F$ de $f$ qui vérifie $F(0) = 0$. Réponse en fonction de $x$.",
    promptTex: `f(x) = ${f} \\qquad F(0) = 0 \\qquad F(x) = \\ ?`,
    answerTex: F,
    hint: "Prends une primitive de la table, ajoute une constante $C$, puis choisis $C$ pour que $F(0) = 0$.",
    solution: steps,
  };
}

// Integral of a degree-2 polynomial: F(b) − F(a).
function polynomialIntegral(): Exercise {
  const al = randNonZero(-4, 4);
  const be = randInt(-5, 5);
  const ga = randInt(-5, 5);
  const a = randInt(-2, 2);
  const b = a + randInt(1, 3);
  const f = `${coefLead(al)}x^2${linearTerm(be)}${signed(ga)}`;
  const F = polyFrac([
    [al, 3, 3],
    [be, 2, 2],
    [ga, 1, 1],
  ]);
  const num = 2 * al * (b ** 3 - a ** 3) + 3 * be * (b ** 2 - a ** 2) + 6 * ga * (b - a);
  const Fat = (t: number) => fracTex(2 * al * t ** 3 + 3 * be * t ** 2 + 6 * ga * t, 6);
  const ans = fracTex(num, 6);
  return {
    promptTex: `\\int_{${a}}^{${b}} \\left(${f}\\right) dx = \\ ?`,
    answerTex: ans,
    hint: "Trouve une primitive $F$ terme à terme, puis calcule $F(b) - F(a)$.",
    solution: [
      `F(x) = ${F}`,
      `F(${b}) = ${Fat(b)} \\qquad F(${a}) = ${Fat(a)}`,
      `\\int_{${a}}^{${b}} = F(${b}) - F(${a}) = ${ans}`,
    ],
  };
}

// Equations with exp and ln, and algebraic properties of ln.
function expLnEquation(): Exercise {
  const kind = randInt(0, 2);
  if (kind === 0) {
    const a = randNonZero(-4, 4);
    const b = randInt(-5, 5);
    const c = pick([2, 3, 5, 6, 7, 10]);
    const numer = a > 0 ? `\\ln ${c}${signed(-b)}` : `${b === 0 ? "" : b}-\\ln ${c}`;
    const ans = Math.abs(a) === 1 ? numer : `\\frac{${numer}}{${Math.abs(a)}}`;
    return {
      intro: "Résous dans $\\mathbb{R}$ (valeur exacte).",
      promptTex: `e^{${lin(a, b)}} = ${c}`,
      answerTex: ans,
      hint: "Applique $\\ln$ des deux côtés : $\\ln(e^{X}) = X$.",
      solution: [`${lin(a, b)} = \\ln ${c}`, `x = \\frac{\\ln ${c}${signed(-b)}}{${a}} = ${ans}`],
    };
  }
  if (kind === 1) {
    const a = randNonZero(-4, 4);
    const b = randInt(-5, 5);
    const c = randInt(-2, 3);
    let ans: string;
    if (c === 0) ans = fracTex(1 - b, a);
    else {
      const numer = a > 0 ? `${eTex(c)}${signed(-b)}` : `${b === 0 ? "" : b}-${eTex(c)}`;
      ans = Math.abs(a) === 1 ? numer : `\\frac{${numer}}{${Math.abs(a)}}`;
    }
    return {
      intro: "Résous dans $\\mathbb{R}$ (valeur exacte).",
      promptTex: `\\ln(${lin(a, b)}) = ${c}`,
      answerTex: ans,
      hint: "Applique $\\exp$ des deux côtés : $e^{\\ln X} = X$ pour $X > 0$.",
      solution: [
        `${lin(a, b)} = e^{${c}}${c === 0 ? " = 1" : ""} \\quad (\\text{positif, donc la solution est valable})`,
        `x = \\frac{e^{${c}}${signed(-b)}}{${a}} = ${ans}`,
      ],
    };
  }
  const base = pick([2, 3, 5]);
  const p = randInt(1, 4);
  const q = randInt(1, 3);
  const r = randInt(1, 3);
  const k = p + q - r;
  return {
    intro: `Écris ce nombre sous la forme $k \\ln ${base}$. Que vaut $k$ ?`,
    promptTex: `\\ln ${base ** p} + \\ln ${base ** q} - \\ln ${base ** r} = k \\ln ${base} \\qquad k = \\ ?`,
    answerTex: String(k),
    hint: `Écris chaque nombre comme une puissance de ${base}, puis utilise $\\ln(a^n) = n \\ln a$.`,
    solution: [
      `${base ** p} = ${base}^{${p}},\\quad ${base ** q} = ${base}^{${q}},\\quad ${base ** r} = ${base}^{${r}}`,
      `${p}\\ln ${base} + ${q}\\ln ${base} - ${r}\\ln ${base} = ${k}\\ln ${base}`,
    ],
  };
}

// Code mode: a threshold found by a loop, predicted by an inequality with ln.
function codeThreshold(): Exercise {
  if (Math.random() < 0.5) {
    const q = pick([0.5, 0.8, 0.9, 0.95, 0.99]);
    const s = pick([0.1, 0.01, 0.001]);
    const ratio = Math.log(s) / Math.log(q);
    const n = Math.floor(ratio) + 1;
    return {
      intro: "Sans l'exécuter : quelle valeur ce programme affiche-t-il ?",
      code: `u = 1.0\nn = 0\nwhile u >= ${s}:\n    u = u * ${q}\n    n = n + 1\nprint(n)`,
      promptTex: "\\text{Valeur affichée : } n = \\ ?",
      answerTex: String(n),
      hint: `Après $n$ tours, $u = ${q}^n$. La boucle s'arrête au premier $n$ tel que $${q}^n < ${s}$ : passe au $\\ln$, et attention au signe de $\\ln ${q}$.`,
      solution: [
        `${q}^n < ${s} \\iff n \\ln ${q} < \\ln ${s}`,
        `\\ln ${q} < 0 \\text{ : le sens change} \\iff n > \\frac{\\ln ${s}}{\\ln ${q}} \\approx ${ratio.toFixed(2)}`,
        `\\text{Premier entier : } n = ${n}`,
      ],
    };
  }
  const q = pick([1.02, 1.05, 1.1, 1.2, 1.5]);
  const s = pick([2, 3, 10]);
  const ratio = Math.log(s) / Math.log(q);
  const n = Math.ceil(ratio);
  return {
    intro: "Sans l'exécuter : quelle valeur ce programme affiche-t-il ?",
    code: `u = 1.0\nn = 0\nwhile u < ${s}:\n    u = u * ${q}\n    n = n + 1\nprint(n)`,
    promptTex: "\\text{Valeur affichée : } n = \\ ?",
    answerTex: String(n),
    hint: `Après $n$ tours, $u = ${q}^n$. La boucle s'arrête au premier $n$ tel que $${q}^n \\ge ${s}$ : passe au $\\ln$.`,
    solution: [
      `${q}^n \\ge ${s} \\iff n \\ln ${q} \\ge \\ln ${s} \\iff n \\ge \\frac{\\ln ${s}}{\\ln ${q}} \\approx ${ratio.toFixed(2)} \\quad (\\ln ${q} > 0)`,
      `\\text{Premier entier : } n = ${n}`,
    ],
  };
}

export const rappelsGenerators: ExerciseGenerator[] = [
  { id: "derivee-composee", make: derivativeComposite },
  { id: "derivee-produit-quotient", make: derivativeProductQuotient },
  { id: "primitive-f0-nulle", make: primitiveCondition },
  { id: "integrale-polynome", make: polynomialIntegral },
  { id: "equation-exp-ln", make: expLnEquation },
  { id: "code-seuil-ln", make: codeThreshold },
];
