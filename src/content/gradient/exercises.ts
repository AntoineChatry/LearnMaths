import { fracTex, pick, randInt, randNonZero } from "../../lib/random";
import type { Exercise, ExerciseGenerator } from "../types";

const paren = (n: number) => (n < 0 ? `(${n})` : String(n));

// Polynomial in x and y written cleanly: [[3, "x^2 y"], [-1, "y"], [2, ""]] → "3x^2 y - y + 2".
function polyXY(terms: [number, string][]): string {
  let out = "";
  for (const [c, m] of terms) {
    if (c === 0) continue;
    const abs = Math.abs(c);
    const coef = m && abs === 1 ? "" : String(abs);
    if (!out) out = `${c < 0 ? "-" : ""}${coef}${m}`;
    else out += ` ${c < 0 ? "-" : "+"} ${coef}${m}`;
  }
  return out || "0";
}

// Simplified √n: 52 → "2\sqrt{13}", 49 → "7".
function sqrtTex(n: number): string {
  let k = 1;
  for (let d = 2; d * d <= n; d++) if (n % (d * d) === 0) k = d;
  const rest = n / (k * k);
  if (rest === 1) return String(k);
  return k === 1 ? `\\sqrt{${rest}}` : `${k}\\sqrt{${rest}}`;
}

// f(x, y) = a·x²y + b·xy² + c·x² + d·y : value of a partial derivative at a point.
function partialAtPoint(): Exercise {
  const a = randNonZero(-3, 3);
  const b = randNonZero(-3, 3);
  const c = randInt(-4, 4);
  const d = randInt(-5, 5);
  const x0 = randInt(-3, 3);
  const y0 = randInt(-3, 3);
  const f = polyXY([
    [a, "x^2 y"],
    [b, "x y^2"],
    [c, "x^2"],
    [d, "y"],
  ]);
  if (Math.random() < 0.5) {
    const expr = polyXY([
      [2 * a, "x y"],
      [b, "y^2"],
      [2 * c, "x"],
    ]);
    const value = 2 * a * x0 * y0 + b * y0 * y0 + 2 * c * x0;
    return {
      promptTex: `f(x, y) = ${f} \\qquad \\frac{\\partial f}{\\partial x}(${x0}, ${y0}) = \\ ?`,
      answerTex: String(value),
      hint: `Gèle $y$ : traite-le comme une constante, et dérive en $x$ comme d'habitude.${d !== 0 ? " Le terme en $y$ seul disparaît." : ""}`,
      solution: [
        `\\frac{\\partial f}{\\partial x}(x, y) = ${expr}`,
        `\\frac{\\partial f}{\\partial x}(${x0}, ${y0}) = ${2 * a} \\times ${paren(x0)} \\times ${paren(y0)} + ${paren(b)} \\times ${paren(y0)}^2 + ${paren(2 * c)} \\times ${paren(x0)} = ${value}`,
      ],
    };
  }
  const expr = polyXY([
    [a, "x^2"],
    [2 * b, "x y"],
    [d, ""],
  ]);
  const value = a * x0 * x0 + 2 * b * x0 * y0 + d;
  return {
    promptTex: `f(x, y) = ${f} \\qquad \\frac{\\partial f}{\\partial y}(${x0}, ${y0}) = \\ ?`,
    answerTex: String(value),
    hint: `Gèle $x$ : traite-le comme une constante, et dérive en $y$.${c !== 0 ? " Le terme en $x^2$ seul disparaît." : ""}`,
    solution: [
      `\\frac{\\partial f}{\\partial y}(x, y) = ${expr}`,
      `\\frac{\\partial f}{\\partial y}(${x0}, ${y0}) = ${a} \\times ${paren(x0)}^2 + ${paren(2 * b)} \\times ${paren(x0)} \\times ${paren(y0)} + ${paren(d)} = ${value}`,
    ],
  };
}

// f(x, y) = a·x² + b·xy + c·y² : norm of the gradient, i.e. the steepest slope.
function gradientNorm(): Exercise {
  let a = 1, b = 0, c = 1, x0 = 0, y0 = 0, gx = 0, gy = 0;
  do {
    a = randNonZero(-3, 3);
    b = randInt(-3, 3);
    c = randNonZero(-3, 3);
    x0 = randInt(-2, 2);
    y0 = randInt(-2, 2);
    gx = 2 * a * x0 + b * y0;
    gy = b * x0 + 2 * c * y0;
  } while (gx === 0 && gy === 0);
  const n2 = gx * gx + gy * gy;
  const answerTex = sqrtTex(n2);
  return {
    intro: "Quelle est la plus forte pente de $f$ au point indiqué ? Donne la valeur exacte (tape sqrt pour √).",
    promptTex: `f(x, y) = ${polyXY([
      [a, "x^2"],
      [b, "x y"],
      [c, "y^2"],
    ])} \\qquad \\text{au point } (${x0}, ${y0})`,
    answerTex,
    hint: "La dérivée directionnelle $\\nabla f \\cdot u$ est maximale quand $u$ pointe comme $\\nabla f$, et vaut alors $\\|\\nabla f\\|$.",
    solution: [
      `\\nabla f(x, y) = \\left(${polyXY([
        [2 * a, "x"],
        [b, "y"],
      ])},\\ ${polyXY([
        [b, "x"],
        [2 * c, "y"],
      ])}\\right)`,
      `\\nabla f(${x0}, ${y0}) = (${gx},\\ ${gy})`,
      `\\|\\nabla f\\| = \\sqrt{${paren(gx)}^2 + ${paren(gy)}^2} = \\sqrt{${n2}} = ${answerTex}`,
    ],
  };
}

// Directional derivative ∇f·u with a unit vector u with simple coordinates.
function directionalDerivative(): Exercise {
  const a = randNonZero(-3, 3);
  const b = randInt(-3, 3);
  const c = randInt(-3, 3);
  const d = randInt(-4, 4);
  const e = randInt(-4, 4);
  const x0 = randInt(-2, 2);
  const y0 = randInt(-2, 2);
  // u = (p/q, r/q), with p² + r² = q².
  const [p, r, q] = pick<[number, number, number]>([
    [3, 4, 5],
    [4, 3, 5],
    [-3, 4, 5],
    [4, -3, 5],
    [-4, -3, 5],
    [1, 0, 1],
    [0, -1, 1],
    [5, 12, 13],
  ]);
  const f = polyXY([
    [a, "x^2"],
    [b, "x y"],
    [c, "y^2"],
    [d, "x"],
    [e, "y"],
  ]);
  const gx = 2 * a * x0 + b * y0 + d;
  const gy = b * x0 + 2 * c * y0 + e;
  const answerTex = fracTex(gx * p + gy * r, q);
  const uTex = q === 1 ? `(${p},\\ ${r})` : `\\left(${fracTex(p, q)},\\ ${fracTex(r, q)}\\right)`;
  return {
    intro: "Dérivée de $f$ au point indiqué, dans la direction du vecteur unitaire $u$ ?",
    promptTex: `f(x, y) = ${f} \\qquad \\text{point } (${x0}, ${y0}) \\qquad u = ${uTex} \\qquad D_u f = \\ ?`,
    answerTex,
    hint: "Calcule le gradient au point, puis fais le produit scalaire avec $u$ : $D_u f = \\frac{\\partial f}{\\partial x} u_1 + \\frac{\\partial f}{\\partial y} u_2$.",
    solution: [
      `\\nabla f(x, y) = \\left(${polyXY([
        [2 * a, "x"],
        [b, "y"],
        [d, ""],
      ])},\\ ${polyXY([
        [b, "x"],
        [2 * c, "y"],
        [e, ""],
      ])}\\right) \\quad\\Rightarrow\\quad \\nabla f(${x0}, ${y0}) = (${gx},\\ ${gy})`,
      `D_u f = ${gx} \\times ${q === 1 ? paren(p) : fracTex(p, q)} + ${paren(gy)} \\times ${q === 1 ? paren(r) : fracTex(r, q)} = ${answerTex}`,
    ],
  };
}

// One gradient descent step: new coordinate.
function descentStep(): Exercise {
  const a = randInt(1, 4);
  const c = randInt(1, 4);
  const b = randInt(-2, 2);
  const x0 = randNonZero(-3, 3);
  const y0 = randNonZero(-3, 3);
  const [ep, eq] = pick<[number, number]>([
    [1, 10],
    [1, 5],
    [1, 4],
    [1, 2],
  ]);
  const gx = 2 * a * x0 + b * y0;
  const gy = b * x0 + 2 * c * y0;
  const f = polyXY([
    [a, "x^2"],
    [b, "x y"],
    [c, "y^2"],
  ]);
  const askX = Math.random() < 0.5;
  const v0 = askX ? x0 : y0;
  const g = askX ? gx : gy;
  const answerTex = fracTex(eq * v0 - ep * g, eq);
  const name = askX ? "x" : "y";
  return {
    intro: `Un pas de descente de gradient depuis le point indiqué, avec le pas $\\eta$ donné. Que vaut la nouvelle coordonnée $${name}$ ?`,
    promptTex: `\\begin{gathered} f(x, y) = ${f} \\\\[1ex] (x_0, y_0) = (${x0}, ${y0}) \\qquad \\eta = \\frac{${ep}}{${eq}} \\qquad ${name}_1 = \\ ? \\end{gathered}`,
    answerTex,
    hint: `$(x_1, y_1) = (x_0, y_0) - \\eta\\,\\nabla f(x_0, y_0)$. Seule la composante en $${name}$ du gradient compte ici.`,
    solution: [
      `\\nabla f(x, y) = \\left(${polyXY([
        [2 * a, "x"],
        [b, "y"],
      ])},\\ ${polyXY([
        [b, "x"],
        [2 * c, "y"],
      ])}\\right) \\quad\\Rightarrow\\quad \\nabla f(${x0}, ${y0}) = (${gx},\\ ${gy})`,
      `${name}_1 = ${v0} - \\frac{${ep}}{${eq}} \\times ${paren(g)} = ${answerTex}`,
    ],
  };
}

// Linear regression with bias: w* or b* via the normal equations.
function normalEquations(): Exercise {
  const xs = pick([
    [0, 1, 2],
    [1, 2, 3],
    [-1, 0, 1],
    [1, 2, 4],
    [0, 1, 2, 3],
    [1, 2, 3, 4],
    [-1, 0, 2],
  ]);
  const ys = xs.map(() => randInt(-2, 7));
  const n = xs.length;
  const sx = xs.reduce((s, x) => s + x, 0);
  const sy = ys.reduce((s, y) => s + y, 0);
  const sxx = xs.reduce((s, x) => s + x * x, 0);
  const sxy = xs.reduce((s, x, i) => s + x * ys[i], 0);
  const det = n * sxx - sx * sx;
  const wNum = n * sxy - sx * sy;
  const bNum = sxx * sy - sx * sxy;
  const askW = Math.random() < 0.5;
  const answerTex = askW ? fracTex(wNum, det) : fracTex(bNum, det);
  const cols = "c".repeat(n);
  return {
    intro: `Régression linéaire avec biais sur ces ${n} exemples. ${askW ? "Quelle pente $w^*$" : "Quel biais $b^*$"} minimise la perte ?`,
    promptTex: `\\begin{array}{c|${cols}} x_i & ${xs.join(" & ")} \\\\ \\hline y_i & ${ys.join(" & ")} \\end{array} \\qquad \\text{TrainLoss}(w, b) = \\frac{1}{${n}}\\sum_{i=1}^{${n}}(w x_i + b - y_i)^2 \\qquad ${askW ? "w^*" : "b^*"} = \\ ?`,
    answerTex,
    hint: "Annule les deux dérivées partielles : $w \\sum x_i^2 + b \\sum x_i = \\sum x_i y_i$ et $w \\sum x_i + n\\,b = \\sum y_i$. Puis résous ce système 2×2.",
    solution: [
      `n = ${n},\\ \\textstyle\\sum x_i = ${sx},\\ \\sum x_i^2 = ${sxx},\\ \\sum y_i = ${sy},\\ \\sum x_i y_i = ${sxy}`,
      `\\begin{cases} ${sxx}\\,w + ${paren(sx)}\\,b = ${sxy} \\\\ ${paren(sx)}\\,w + ${n}\\,b = ${sy} \\end{cases}`,
      `\\text{Déterminant : } ${n} \\times ${sxx} - ${paren(sx)}^2 = ${det}`,
      askW
        ? `w^* = \\frac{${n} \\times ${paren(sxy)} - ${paren(sx)} \\times ${paren(sy)}}{${det}} = ${answerTex}`
        : `b^* = \\frac{${sxx} \\times ${paren(sy)} - ${paren(sx)} \\times ${paren(sxy)}}{${det}} = ${answerTex}`,
    ],
  };
}

// Minimal exact fraction, to follow the SGD steps without rounding error.
type Q = [number, number];
const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
function q(n: number, d = 1): Q {
  const g = gcd(n, d) || 1;
  return d < 0 ? [-n / g, -d / g] : [n / g, d / g];
}
const qAdd = (a: Q, b: Q) => q(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
const qMul = (a: Q, b: Q) => q(a[0] * b[0], a[1] * b[1]);
const qTex = (a: Q) => fracTex(a[0], a[1]);
const qParen = (a: Q) => (a[0] < 0 ? `\\left(${qTex(a)}\\right)` : qTex(a));

// Code mode: two SGD steps by hand.
function codeSgd(): Exercise {
  // |x| ≤ 2 and η ≤ 0,1: each step gets closer to the example without overshooting it, like a well-tuned SGD.
  const x1 = randNonZero(-2, 2);
  const y1 = randInt(-3, 4);
  let x2 = x1;
  let y2 = y1;
  while (x2 === x1 && y2 === y1) {
    x2 = randNonZero(-2, 2);
    y2 = randInt(-3, 4);
  }
  const [etaCode, eta] = pick<[string, Q]>([
    ["0.1", q(1, 10)],
    ["0.05", q(1, 20)],
  ]);
  const askW = Math.random() < 0.5;
  const two = q(2);
  // Step 1, from w = b = 0.
  const r1 = q(-y1);
  const w1 = qAdd(q(0), qMul(q(-1), qMul(eta, qMul(two, qMul(r1, q(x1))))));
  const b1 = qAdd(q(0), qMul(q(-1), qMul(eta, qMul(two, r1))));
  // Step 2.
  const r2 = qAdd(qAdd(qMul(w1, q(x2)), b1), q(-y2));
  const w2 = qAdd(w1, qMul(q(-1), qMul(eta, qMul(two, qMul(r2, q(x2))))));
  const b2 = qAdd(b1, qMul(q(-1), qMul(eta, qMul(two, r2))));
  const answer = askW ? w2 : b2;
  const code = `data = [(${x1}, ${y1}), (${x2}, ${y2})]   # exemples (x, y)
w, b = 0.0, 0.0
eta = ${etaCode}

for x, y in data:
    r = w * x + b - y           # résidu
    w = w - eta * 2 * r * x
    b = b - eta * 2 * r

print(${askW ? "w" : "b"})`;
  return {
    intro: `Sans l'exécuter : quelle valeur exacte ce programme affiche-t-il (aux arrondis de flottants près) ?`,
    code,
    promptTex: `${askW ? "w" : "b"} = \\ ?`,
    answerTex: qTex(answer),
    hint: "C'est la SGD de la perte $(w x + b - y)^2$ : un exemple à la fois. Fais le premier tour de boucle, note $w$ et $b$, puis le second.",
    solution: [
      `\\text{Tour 1 : } r = 0 - ${paren(y1)} = ${qTex(r1)},\\quad w = ${qTex(w1)},\\quad b = ${qTex(b1)}`,
      `\\text{Tour 2 : } r = ${qParen(w1)} \\times ${paren(x2)} + ${qParen(b1)} - ${paren(y2)} = ${qTex(r2)}`,
      `w = ${qTex(w2)},\\quad b = ${qTex(b2)}`,
    ],
  };
}

export const gradientGenerators: ExerciseGenerator[] = [
  { id: "derivee-partielle-point", make: partialAtPoint },
  { id: "norme-gradient", make: gradientNorm },
  { id: "derivee-directionnelle", make: directionalDerivative },
  { id: "pas-descente-gradient", make: descentStep },
  { id: "equations-normales", make: normalEquations },
  { id: "code-sgd", make: codeSgd },
];
