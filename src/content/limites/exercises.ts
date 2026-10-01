import { fracTex, pick, randInt, randNonZero, signed } from "../../lib/random";
import { coefLead, linearTerm, xPow } from "../../lib/tex";
import type { Exercise, ExerciseGenerator } from "../types";

// Polynomial a·x^d + b·x^e + c, written cleanly.
function poly(lead: number, degree: number, lowCoef: number, constant: number): string {
  const head = degree === 1 ? `${coefLead(lead)}x` : `${coefLead(lead)}x^{${degree}}`;
  const low = degree >= 2 ? linearTerm(lowCoef) : "";
  return head + low + signed(constant);
}

// lim_{x→a} (x−a)(x+b)/(x−a) : 0/0 form resolved by factoring.
function holeLimit(): Exercise {
  const a = randNonZero(-5, 5);
  let b = randInt(-6, 6);
  while (b === -a) b = randInt(-6, 6);
  const num = `x^2${linearTerm(b - a)}${signed(-a * b)}`;
  const den = `x${signed(-a)}`;
  return {
    promptTex: `\\lim_{x \\to ${a}} \\frac{${num}}{${den}}`,
    answerTex: String(a + b),
    hint: `En x = ${a}, numérateur et dénominateur s'annulent tous les deux : ${a} est donc une racine du numérateur. Factorise-le par (x ${a > 0 ? "−" : "+"} ${Math.abs(a)}).`,
    solution: [
      `\\text{En } x = ${a} : \\ \\tfrac{0}{0}, \\text{ forme indéterminée.}`,
      `${num} = (${den})(x${signed(b)})`,
      `\\frac{(${den})(x${signed(b)})}{${den}} = x${signed(b)} \\xrightarrow[x \\to ${a}]{} ${a}${signed(b)} = ${a + b}`,
    ],
  };
}

// lim_{x→+∞} P(x)/Q(x) : compare the dominant terms.
function infinityRational(): Exercise {
  const m = randInt(1, 3);
  const n = randInt(1, 3);
  const p = randNonZero(-6, 6);
  const q = randNonZero(-6, 6);
  const num = poly(p, m, randInt(-5, 5), randInt(-9, 9));
  const den = poly(q, n, randInt(-5, 5), randNonZero(-9, 9));

  let answerTex: string;
  let conclusion: string;
  if (m === n) {
    answerTex = fracTex(p, q);
    conclusion = `\\text{Même degré : } \\frac{${p}}{${q}} = ${answerTex}`;
  } else if (m < n) {
    answerTex = "0";
    conclusion = `\\frac{${coefLead(p)}${xPow(m)}}{${coefLead(q)}${xPow(n)}} = \\frac{${p}}{${coefLead(q)}${xPow(n - m)}} \\to 0`;
  } else {
    answerTex = p / q > 0 ? "+\\infty" : "-\\infty";
    conclusion = `\\frac{${coefLead(p)}${xPow(m)}}{${coefLead(q)}${xPow(n)}} = \\frac{${p}}{${q}}\\,${xPow(m - n)} \\to ${answerTex} \\text{ (signe de } \\tfrac{${p}}{${q}}\\text{)}`;
  }
  return {
    promptTex: `\\lim_{x \\to +\\infty} \\frac{${num}}{${den}}`,
    answerTex,
    hint: "Ne garde que le terme de plus haut degré en haut et en bas, puis simplifie.",
    solution: [
      `\\text{En } +\\infty, \\text{ le quotient se comporte comme } \\frac{${coefLead(p)}${xPow(m)}}{${coefLead(q)}${xPow(n)}}`,
      conclusion,
    ],
  };
}

// ε-δ for an affine function: the largest δ is ε/|k|.
function epsilonDeltaAffine(): Exercise {
  const k = randNonZero(-6, 6);
  const c = randInt(-5, 5);
  const a = randInt(-4, 4);
  const epsDen = pick([10, 20, 100]);
  const fx = `${coefLead(k)}x${signed(c)}`;
  const answerTex = fracTex(1, epsDen * Math.abs(k));
  return {
    intro: `Soit f(x) = ${fx.replace(/\+-/g, "−")} et a = ${a}. L'adversaire choisit la tolérance ε ci-dessous.`,
    promptTex: `\\varepsilon = \\frac{1}{${epsDen}} \\qquad \\text{Plus grand } \\delta \\text{ tel que } |x - ${a < 0 ? `(${a})` : a}| < \\delta \\implies |f(x) - f(${a})| < \\varepsilon \\ ?`,
    answerTex,
    hint: "Calcule f(x) − f(a) : pour une fonction affine, le terme constant disparaît.",
    solution: [
      `|f(x) - f(${a})| = |${k}(x - ${a < 0 ? `(${a})` : a})| = ${Math.abs(k)}\\,|x - ${a < 0 ? `(${a})` : a}|`,
      `${Math.abs(k)}\\,\\delta \\le \\frac{1}{${epsDen}} \\iff \\delta \\le ${answerTex}`,
    ],
  };
}

// Comparative growth: ln ≪ power ≪ exponential.
function comparedGrowth(): Exercise {
  const n = randInt(2, 9);
  return pick<Exercise>([
    {
      promptTex: `\\lim_{x \\to +\\infty} x^{${n}}\\,e^{-x}`,
      answerTex: "0",
      hint: "Qui gagne entre une puissance et une exponentielle ?",
      solution: [
        `x^{${n}} e^{-x} = \\frac{x^{${n}}}{e^{x}}`,
        `e^x \\gg x^{${n}} \\text{ en } +\\infty, \\text{ donc le quotient tend vers } 0`,
      ],
    },
    {
      promptTex: `\\lim_{x \\to +\\infty} \\frac{e^{x}}{x^{${n}}}`,
      answerTex: "+\\infty",
      hint: "Qui gagne entre une puissance et une exponentielle ?",
      solution: [`e^x \\gg x^{${n}} \\text{ en } +\\infty, \\text{ donc } \\frac{e^x}{x^{${n}}} \\to +\\infty`],
    },
    {
      promptTex: `\\lim_{x \\to +\\infty} \\frac{\\ln x}{x^{${n}}}`,
      answerTex: "0",
      hint: "Le logarithme est le plus lent de tous en +∞.",
      solution: [`\\ln x \\ll x^{${n}} \\text{ en } +\\infty, \\text{ donc le quotient tend vers } 0`],
    },
    {
      promptTex: `\\lim_{x \\to +\\infty} \\left(x^{${n}} - e^{x}\\right)`,
      answerTex: "-\\infty",
      hint: "Forme ∞ − ∞ : mets le terme dominant en facteur.",
      solution: [
        `x^{${n}} - e^{x} = e^{x}\\left(\\frac{x^{${n}}}{e^{x}} - 1\\right)`,
        `\\frac{x^{${n}}}{e^{x}} \\to 0, \\text{ donc la parenthèse tend vers } -1 \\text{ et le tout vers } -\\infty`,
      ],
    },
  ]);
}

// Code mode: what does this program compute? A limit disguised as a numerical computation.
function codeLimit(): Exercise {
  const a = randInt(2, 6);
  return pick<Exercise>([
    {
      intro: "Sans l'exécuter : vers quelle valeur exacte tend ce que ce programme affiche ?",
      code: `import math\n\nh = 1e-8\nprint(math.sin(h) / h)`,
      promptTex: "\\lim_{h \\to 0} \\ ?",
      answerTex: "1",
      hint: "Près de 0, la courbe de sin se confond avec sa tangente en 0. Quelle est la pente de cette tangente ?",
      solution: [
        "\\frac{\\sin h}{h} = \\frac{\\sin h - \\sin 0}{h - 0} \\xrightarrow[h \\to 0]{} \\sin'(0) = \\cos 0 = 1",
      ],
    },
    {
      intro: "Sans l'exécuter : vers quelle valeur exacte tend ce que ce programme affiche ?",
      code: `h = 1e-6\nprint(((${a} + h)**2 - ${a}**2) / h)`,
      promptTex: "\\lim_{h \\to 0} \\ ?",
      answerTex: String(2 * a),
      hint: "C'est un taux de variation de x ↦ x² en un point : un nombre dérivé.",
      solution: [
        `\\frac{(${a}+h)^2 - ${a}^2}{h} = \\frac{${2 * a}h + h^2}{h} = ${2 * a} + h \\xrightarrow[h \\to 0]{} ${2 * a}`,
      ],
    },
    {
      intro: "Sans l'exécuter : vers quelle valeur exacte tend ce que ce programme affiche ?",
      code: `import math\n\nh = 1e-8\nprint((math.exp(h) - 1) / h)`,
      promptTex: "\\lim_{h \\to 0} \\ ?",
      answerTex: "1",
      hint: "C'est le taux de variation de exp en 0. Que vaut exp'(0) ?",
      solution: ["\\frac{e^h - e^0}{h - 0} \\xrightarrow[h \\to 0]{} \\exp'(0) = e^0 = 1"],
    },
    {
      intro: "Sans l'exécuter : vers quelle valeur exacte tend ce que ce programme affiche quand n grandit ?",
      code: `n = 10**7\nprint((1 + 1/n) ** n)`,
      promptTex: "\\lim_{n \\to +\\infty} \\left(1 + \\tfrac{1}{n}\\right)^n = \\ ?",
      answerTex: "e",
      hint: "Passe au logarithme : n·ln(1 + 1/n), puis pose h = 1/n.",
      solution: [
        "\\left(1 + \\tfrac1n\\right)^n = e^{\\,n \\ln(1 + 1/n)}",
        "n \\ln\\left(1 + \\tfrac1n\\right) = \\frac{\\ln(1 + h) - \\ln 1}{h} \\xrightarrow[h \\to 0]{} \\ln'(1) = 1",
        "\\text{donc la limite vaut } e^1 = e",
      ],
    },
  ]);
}

export const limitesGenerators: ExerciseGenerator[] = [
  { id: "trou-0-sur-0", make: holeLimit },
  { id: "rationnelle-infini", make: infinityRational },
  { id: "epsilon-delta-affine", make: epsilonDeltaAffine },
  { id: "croissance-comparee", make: comparedGrowth },
  { id: "code-limite", make: codeLimit },
];
