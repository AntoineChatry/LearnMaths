import { fracTex, pick, randInt, randNonZero, signed } from "../../lib/random";
import { coefLead, linearTerm } from "../../lib/tex";
import type { Exercise, ExerciseGenerator } from "../types";

const lin = (a: number, b: number) => `${coefLead(a)}x${signed(b)}`;
const paren = (n: number) => (n < 0 ? `(${n})` : String(n));

function cases(left: string, leftCond: string, right: string, rightCond: string): string {
  return `\\begin{cases} ${left} & \\text{si } x ${leftCond} \\\\ ${right} & \\text{si } x ${rightCond} \\end{cases}`;
}

// Find k so that a piecewise function is continuous.
function continuityParameter(): Exercise {
  const kind = randInt(0, 2);
  const intro = "Pour quelle valeur de $k$ la fonction $f$ est-elle continue sur $\\mathbb{R}$ ?";
  if (kind === 0) {
    const x0 = randNonZero(-3, 3);
    const al = randNonZero(-4, 4);
    const be = randInt(-5, 5);
    const ga = randInt(-5, 5);
    const leftVal = al * x0 + be;
    const k = fracTex(leftVal - ga, x0);
    return {
      intro,
      promptTex: `f(x) = ${cases(lin(al, be), `< ${x0}`, `kx${signed(ga)}`, `\\ge ${x0}`)} \\qquad k = \\ ?`,
      answerTex: k,
      hint: `Chaque morceau est continu. Il reste le raccord en $x = ${x0}$ : la limite à gauche doit valoir $f(${x0})$.`,
      solution: [
        `\\lim_{x \\to ${x0}^-} f(x) = ${al} \\times ${paren(x0)}${signed(be)} = ${leftVal}`,
        `f(${x0}) = ${x0}k${signed(ga)}`,
        `${x0}k${signed(ga)} = ${leftVal} \\iff k = \\frac{${leftVal - ga}}{${x0}} = ${k}`,
      ],
    };
  }
  if (kind === 1) {
    const x0 = randInt(-3, 3);
    const be = randInt(-4, 4);
    const ga = randNonZero(-4, 4);
    const leftVal = x0 * x0 + be * x0;
    const k = leftVal - ga * x0;
    return {
      intro,
      promptTex: `f(x) = ${cases(`x^2${linearTerm(be)}`, `< ${x0}`, `${coefLead(ga)}x+k`, `\\ge ${x0}`)} \\qquad k = \\ ?`,
      answerTex: String(k),
      hint: `Égale la limite à gauche en $${x0}$ et la valeur $f(${x0})$ donnée par le morceau de droite.`,
      solution: [
        `\\lim_{x \\to ${x0}^-} f(x) = ${paren(x0)}^2${be === 0 ? "" : ` ${be < 0 ? "-" : "+"} ${Math.abs(be)} \\times ${paren(x0)}`} = ${leftVal}`,
        `f(${x0}) = ${ga} \\times ${paren(x0)} + k = ${ga * x0} + k`,
        `${ga * x0} + k = ${leftVal} \\iff k = ${k}`,
      ],
    };
  }
  if (Math.random() < 0.5) {
    const c = randNonZero(-5, 5);
    return {
      intro,
      promptTex: `f(x) = ${cases(`\\frac{x^2 - ${c * c}}{x${signed(-c)}}`, `\\neq ${c}`, "k", `= ${c}`)} \\qquad k = \\ ?`,
      answerTex: String(2 * c),
      hint: `En $x = ${c}$, la fraction est une forme $\\frac{0}{0}$ : factorise le numérateur pour trouver sa limite.`,
      solution: [
        `\\frac{x^2 - ${c * c}}{x${signed(-c)}} = \\frac{(x${signed(-c)})(x${signed(c)})}{x${signed(-c)}} = x${signed(c)} \\quad (x \\neq ${c})`,
        `\\lim_{x \\to ${c}} f(x) = ${c}${signed(c)} = ${2 * c}`,
        `f \\text{ continue en } ${c} \\iff k = ${2 * c}`,
      ],
    };
  }
  const a = randNonZero(-4, 4);
  const ax = `${coefLead(a)}x`;
  return {
    intro,
    promptTex: `f(x) = ${cases(`\\frac{e^{${ax}} - 1}{x}`, "\\neq 0", "k", "= 0")} \\qquad k = \\ ?`,
    answerTex: String(a),
    hint: `$\\frac{e^{${ax}} - 1}{x}$ est le taux de variation de $x \\mapsto e^{${ax}}$ entre 0 et $x$. Sa limite est un nombre dérivé.`,
    solution: [
      `\\frac{e^{${ax}} - 1}{x} = \\frac{g(x) - g(0)}{x - 0} \\quad\\text{avec}\\quad g(x) = e^{${ax}}`,
      `\\lim_{x \\to 0} \\frac{e^{${ax}} - 1}{x} = g'(0) = ${a}e^{0} = ${a}`,
      `f \\text{ continue en } 0 \\iff k = ${a}`,
    ],
  };
}

// Height of the jump at a junction point: right limit minus left limit.
function jumpHeight(): Exercise {
  const x0 = randInt(-2, 3);
  let leftTex = "", leftVal = 0, leftStep = "";
  const kind = randInt(0, 2);
  if (kind === 0) {
    const al = randNonZero(-4, 4);
    const be = randInt(-5, 5);
    leftTex = lin(al, be);
    leftVal = al * x0 + be;
    leftStep = `${al} \\times ${paren(x0)}${signed(be)}`;
  } else if (kind === 1) {
    const be = randInt(-5, 5);
    leftTex = `x^2${signed(be)}`;
    leftVal = x0 * x0 + be;
    leftStep = `${paren(x0)}^2${signed(be)}`;
  } else {
    const be = randInt(-4, 4);
    leftTex = `e^{x${signed(-x0)}}${signed(be)}`;
    leftVal = 1 + be;
    leftStep = `e^{0}${signed(be)}`;
  }
  let ga = 0, de = 0;
  do {
    ga = randNonZero(-4, 4);
    de = randInt(-6, 6);
  } while (ga * x0 + de === leftVal);
  const rightVal = ga * x0 + de;
  const jump = rightVal - leftVal;
  return {
    intro: `$f$ est définie par morceaux. Calcule la hauteur du saut en $x = ${x0}$.`,
    promptTex: `f(x) = ${cases(leftTex, `< ${x0}`, lin(ga, de), `\\ge ${x0}`)} \\qquad \\lim_{x \\to ${x0}^+} f(x) - \\lim_{x \\to ${x0}^-} f(x) = \\ ?`,
    answerTex: String(jump),
    hint: "Chaque morceau est continu : sa limite au point de raccord s'obtient en y remplaçant $x$.",
    solution: [
      `\\lim_{x \\to ${x0}^-} f(x) = ${leftStep} = ${leftVal}`,
      `\\lim_{x \\to ${x0}^+} f(x) = ${ga} \\times ${paren(x0)}${signed(de)} = ${rightVal}`,
      `\\text{Saut} = ${rightVal} - ${paren(leftVal)} = ${jump}`,
    ],
  };
}

// Locate the unique root of a strictly increasing polynomial between two integers.
function rootInterval(): Exercise {
  const p = randInt(1, 4);
  const n = randInt(-3, 2);
  const g = (x: number) => x ** 3 + p * x;
  // q strictly between −g(n+1) and −g(n): f(n) < 0 < f(n+1).
  const q = randInt(-g(n + 1) + 1, -g(n) - 1);
  const f = (x: number) => g(x) + q;
  const fTex = `x^3${linearTerm(p)}${signed(q)}`;
  return {
    intro: `$f$ est strictement croissante sur $\\mathbb{R}$, car $f'(x) = 3x^2 + ${p} > 0$. Elle a donc au plus une racine. Trouve l'entier $n$ tel que cette racine soit dans $]n, n+1[$.`,
    promptTex: `f(x) = ${fTex} \\qquad n = \\ ?`,
    answerTex: String(n),
    hint: "Calcule $f$ en quelques entiers et cherche où elle change de signe.",
    solution: [
      `f(${n}) = ${f(n)} < 0 \\qquad f(${n + 1}) = ${f(n + 1)} > 0`,
      `f \\text{ continue et } f(${n})\\,f(${n + 1}) < 0 : \\text{ le TVI donne une racine dans } ]${n}, ${n + 1}[`,
      `f \\text{ strictement croissante : c'est la seule, donc } n = ${n}`,
    ],
  };
}

// Bisection by hand: one bound after n steps.
function bisectionBound(): Exercise {
  const cube = Math.random() < 0.4;
  let c = 0;
  let root = 0;
  do {
    c = cube ? randInt(2, 60) : randInt(2, 40);
    root = cube ? Math.cbrt(c) : Math.sqrt(c);
  } while (Number.isInteger(Math.round(root * 1e9) / 1e9));
  const lo = Math.floor(root);
  const steps = randInt(2, 4);
  const which = pick(["a", "b"] as const);
  const f = (x: number) => (cube ? x ** 3 - c : x ** 2 - c);
  const fTex = cube ? `x^3 - ${c}` : `x^2 - ${c}`;

  let a = lo;
  let b = lo + 1;
  const lines: string[] = [];
  for (let i = 1; i <= steps; i++) {
    const m = (a + b) / 2;
    const left = f(a) * f(m) <= 0;
    const mTex = fracTex(m * 2 ** i, 2 ** i);
    lines.push(
      `m = ${mTex},\\ f(m) ${f(m) < 0 ? "< 0" : "> 0"} \\ \\Rightarrow\\ [a_{${i}}, b_{${i}}] = ${left ? `[${fracTex(a * 2 ** i, 2 ** i)}, ${mTex}]` : `[${mTex}, ${fracTex(b * 2 ** i, 2 ** i)}]`}`,
    );
    if (left) b = m;
    else a = m;
  }
  const value = which === "a" ? a : b;
  return {
    intro:
      "Applique la dichotomie à $f$ sur $[a_0, b_0]$. À chaque étape : $m = \\frac{a+b}{2}$ ; si $f(a) \\times f(m) \\le 0$, on garde $[a, m]$, sinon on garde $[m, b]$. Réponse en fraction exacte.",
    promptTex: `f(x) = ${fTex} \\qquad [a_0, b_0] = [${lo}, ${lo + 1}] \\qquad \\text{après } ${steps} \\text{ étapes : } ${which}_{${steps}} = \\ ?`,
    answerTex: fracTex(value * 2 ** steps, 2 ** steps),
    hint: `$f(${lo}) < 0 < f(${lo + 1})$. Il suffit de regarder le signe de $f(m)$ : comme $f(a) < 0$ tout au long de l'algorithme, $f(a) \\times f(m) \\le 0$ revient à $f(m) \\ge 0$.`,
    solution: [`f(${lo}) = ${f(lo)} < 0,\\quad f(${lo + 1}) = ${f(lo + 1)} > 0`, ...lines],
  };
}

// Minimum number of steps: ⌈log2((b − a)/ε)⌉.
function bisectionIterations(): Exercise {
  const a = randInt(-5, 3);
  const L = randInt(1, 10);
  const b = a + L;
  if (Math.random() < 0.65) {
    const p = randInt(1, 6);
    const ratio = L * 10 ** p;
    const n = Math.ceil(Math.log2(ratio));
    return {
      intro: "Combien d'étapes de dichotomie faut-il, au minimum, pour que l'intervalle mesure au plus $\\varepsilon$ ?",
      promptTex: `[a, b] = [${a}, ${b}] \\qquad \\varepsilon = 10^{-${p}} \\qquad n = \\ ?`,
      answerTex: String(n),
      hint: "Après $n$ étapes, la longueur vaut $\\frac{b-a}{2^n}$. Résous $\\frac{b-a}{2^n} \\le \\varepsilon$ avec $\\ln$.",
      solution: [
        `\\frac{${L}}{2^n} \\le 10^{-${p}} \\iff 2^n \\ge ${ratio}`,
        `n \\ge \\frac{\\ln ${ratio}}{\\ln 2} \\approx ${Math.log2(ratio).toFixed(3)}`,
        `n = ${n} \\quad (2^{${n - 1}} = ${2 ** (n - 1)} < ${ratio} \\le 2^{${n}} = ${2 ** n})`,
      ],
    };
  }
  const q = randInt(3, 12);
  const n = Math.ceil(Math.log2(L)) + q;
  return {
    intro: "Combien d'étapes de dichotomie faut-il, au minimum, pour que l'intervalle mesure au plus $\\varepsilon$ ?",
    promptTex: `[a, b] = [${a}, ${b}] \\qquad \\varepsilon = 2^{-${q}} \\qquad n = \\ ?`,
    answerTex: String(n),
    hint: "Après $n$ étapes, la longueur vaut $\\frac{b-a}{2^n}$. Compare les puissances de 2.",
    solution: [
      `\\frac{${L}}{2^n} \\le 2^{-${q}} \\iff 2^{n - ${q}} \\ge ${L}`,
      `\\text{Plus petite puissance de 2 supérieure ou égale à } ${L} : 2^{${n - q}}`,
      `n - ${q} = ${n - q} \\iff n = ${n}`,
    ],
  };
}

// Code mode: the number of rounds of a bisection depends only on b − a and eps.
function codeBisection(): Exercise {
  let c = 0;
  do c = randInt(2, 60);
  while (Number.isInteger(Math.round(Math.cbrt(c) * 1e9) / 1e9));
  const r = Math.cbrt(c);
  const a = Math.floor(r) - randInt(0, 2);
  const b = Math.ceil(r) + randInt(0, 3);
  const L = b - a;
  const [epsCode, p] = pick([
    ["0.1", 1],
    ["0.01", 2],
    ["0.001", 3],
    ["1e-4", 4],
    ["1e-5", 5],
    ["1e-6", 6],
  ] as const);
  const ratio = L * 10 ** p;
  const n = Math.ceil(Math.log2(ratio));
  return {
    intro: "Sans l'exécuter : quelle valeur ce programme affiche-t-il ?",
    code: `def f(x):\n    return x**3 - ${c}\n\na, b = ${a}, ${b}\neps = ${epsCode}\nn = 0\nwhile b - a > eps:\n    m = (a + b) / 2\n    if f(a) * f(m) <= 0:\n        b = m\n    else:\n        a = m\n    n += 1\nprint(n)`,
    promptTex: "\\text{Valeur affichée : } n = \\ ?",
    answerTex: String(n),
    hint: "Inutile de suivre $f$ : chaque tour divise $b - a$ par 2, quel que soit le côté gardé. Cherche le premier $n$ tel que $\\frac{b-a}{2^n} \\le$ eps.",
    solution: [
      `b - a = ${L} \\text{ au départ, puis } \\frac{${L}}{2^n} \\text{ après } n \\text{ tours}`,
      `\\frac{${L}}{2^n} \\le 10^{-${p}} \\iff 2^n \\ge ${ratio} \\iff n \\ge \\log_2 ${ratio} \\approx ${Math.log2(ratio).toFixed(3)}`,
      `n = ${n}`,
    ],
  };
}

export const continuiteGenerators: ExerciseGenerator[] = [
  { id: "k-par-morceaux", make: continuityParameter },
  { id: "hauteur-saut", make: jumpHeight },
  { id: "racine-entre-entiers", make: rootInterval },
  { id: "dichotomie-borne", make: bisectionBound },
  { id: "dichotomie-iterations", make: bisectionIterations },
  { id: "code-dichotomie", make: codeBisection },
];
