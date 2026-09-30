import { fracTex, pick, randInt, randNonZero } from "../../lib/random";
import { trinomial } from "../../lib/tex";
import type { Exercise, ExerciseGenerator } from "../types";

const paren = (n: number) => (n < 0 ? `(${n})` : String(n));

function isPerfectSquare(n: number): boolean {
  if (n < 0) return false;
  const r = Math.round(Math.sqrt(n));
  return r * r === n;
}

function discriminantValue(): Exercise {
  const a = randNonZero(-4, 4);
  const b = randInt(-8, 8);
  const c = randInt(-8, 8);
  const delta = b * b - 4 * a * c;
  return {
    promptTex: `f(x) = ${trinomial(a, b, c)} \\qquad \\Delta = \\ ?`,
    answerTex: String(delta),
    hint: "Δ = b² − 4ac. Attention aux signes quand a ou c est négatif.",
    solution: [`a = ${a},\\ b = ${b},\\ c = ${c}`, `\\Delta = ${paren(b)}^2 - 4 \\times ${paren(a)} \\times ${paren(c)} = ${b * b} ${-4 * a * c >= 0 ? "+" : "-"} ${Math.abs(4 * a * c)} = ${delta}`],
  };
}

function rootCount(): Exercise {
  let a: number, b: number, c: number;
  const kind = randInt(0, 2);
  if (kind === 1) {
    // Perfect square a(x − r)²: Δ = 0.
    a = randNonZero(-3, 3);
    const r = randInt(-5, 5);
    b = -2 * a * r;
    c = a * r * r;
  } else {
    a = randNonZero(-4, 4);
    b = randInt(-8, 8);
    c = randInt(-8, 8);
  }
  const delta = b * b - 4 * a * c;
  const count = delta > 0 ? 2 : delta === 0 ? 1 : 0;
  return {
    intro: "Combien de racines réelles distinctes ?",
    promptTex: `${trinomial(a, b, c)} = 0`,
    answerTex: String(count),
    hint: "Seul le signe du discriminant compte.",
    solution: [
      `\\Delta = ${paren(b)}^2 - 4 \\times ${paren(a)} \\times ${paren(c)} = ${delta}`,
      delta > 0
        ? "\\Delta > 0 : \\text{deux racines réelles distinctes}"
        : delta === 0
          ? "\\Delta = 0 : \\text{une racine double}"
          : "\\Delta < 0 : \\text{aucune racine réelle}",
    ],
  };
}

function integerRoots(): Exercise {
  const a = pick([-2, -1, 1, 2]);
  const r1 = randInt(-6, 6);
  let r2 = randInt(-6, 6);
  while (r2 === r1) r2 = randInt(-6, 6);
  const b = -a * (r1 + r2);
  const c = a * r1 * r2;
  const delta = b * b - 4 * a * c;
  const [lo, hi] = [Math.min(r1, r2), Math.max(r1, r2)];
  return {
    intro: "Donne la plus grande des deux racines.",
    promptTex: `${trinomial(a, b, c)} = 0`,
    answerTex: String(hi),
    hint: "Calcule Δ : ici c'est un carré parfait, les racines sont entières. Vérifie avec la somme −b/a.",
    solution: [
      `\\Delta = ${paren(b)}^2 - 4 \\times ${paren(a)} \\times ${paren(c)} = ${delta} = ${Math.sqrt(delta)}^2`,
      `x_{1,2} = \\frac{${-b} \\pm ${Math.sqrt(delta)}}{${2 * a}} \\quad\\Rightarrow\\quad ${lo} \\text{ et } ${hi}`,
      `\\text{Vérification : } ${lo} + ${paren(hi)} = ${lo + hi} = -\\tfrac{b}{a}`,
    ],
  };
}

function irrationalRoot(): Exercise {
  let a = 1, b = 0, c = 0, delta = 0;
  // We want Δ > 0 but not a perfect square, so that √Δ stays in the answer.
  do {
    a = randInt(1, 3);
    b = randInt(-7, 7);
    c = randInt(-6, 6);
    delta = b * b - 4 * a * c;
  } while (delta <= 0 || isPerfectSquare(delta));
  const numerator = b === 0 ? `\\sqrt{${delta}}` : `${-b} + \\sqrt{${delta}}`;
  const answerTex = `\\frac{${numerator}}{${2 * a}}`;
  return {
    intro: "Donne la plus grande racine, en valeur exacte (tape sqrt pour √, puis flèche → pour sortir de la racine).",
    promptTex: `${trinomial(a, b, c)} = 0`,
    answerTex,
    hint: "a > 0 : la plus grande racine est celle avec + devant √Δ.",
    solution: [
      `\\Delta = ${paren(b)}^2 - 4 \\times ${a} \\times ${paren(c)} = ${delta} > 0`,
      `x_2 = \\frac{-b + \\sqrt{\\Delta}}{2a} = ${answerTex}`,
    ],
  };
}

function vertex(): Exercise {
  const a = randNonZero(-3, 3);
  const b = randInt(-8, 8);
  const c = randInt(-8, 8);
  const delta = b * b - 4 * a * c;
  const f = trinomial(a, b, c);
  if (Math.random() < 0.5) {
    const alpha = fracTex(-b, 2 * a);
    return {
      intro: "Abscisse du sommet de la parabole ?",
      promptTex: `f(x) = ${f}`,
      answerTex: alpha,
      hint: "α = −b / (2a), tiré de la forme canonique.",
      solution: [`\\alpha = -\\frac{b}{2a} = -\\frac{${b}}{${2 * a}} = ${alpha}`],
    };
  }
  const beta = fracTex(-delta, 4 * a);
  return {
    intro: a > 0 ? "Valeur minimale de f sur ℝ ?" : "Valeur maximale de f sur ℝ ?",
    promptTex: `f(x) = ${f}`,
    answerTex: beta,
    hint: `L'extremum est atteint au sommet : c'est β = −Δ / (4a). Ici a ${a > 0 ? "> 0, c'est un minimum" : "< 0, c'est un maximum"}.`,
    solution: [`\\Delta = ${delta}`, `\\beta = -\\frac{\\Delta}{4a} = -\\frac{${delta}}{${4 * a}} = ${beta}`],
  };
}

function leastSquares(): Exercise {
  const xs = pick([
    [1, 2, 3],
    [1, 2, 4],
    [-1, 1, 2],
    [2, 3, 4],
    [-2, 1, 3],
  ]);
  const ys = xs.map(() => randInt(-3, 8));
  const sxx = xs.reduce((s, x) => s + x * x, 0);
  const sxy = xs.reduce((s, x, i) => s + x * ys[i], 0);
  const answerTex = fracTex(sxy, sxx);
  return {
    intro: "Régression linéaire à une feature, sans biais, sur ces trois exemples. Quel w minimise la perte ?",
    promptTex: `\\begin{array}{c|ccc} x_i & ${xs.join(" & ")} \\\\ \\hline y_i & ${ys.join(" & ")} \\end{array} \\qquad \\text{TrainLoss}(w) = \\frac{1}{3}\\sum_{i=1}^{3}(w x_i - y_i)^2`,
    answerTex,
    hint: "La perte est un trinôme en w : son minimum est au sommet, w* = Σ xᵢyᵢ / Σ xᵢ².",
    solution: [
      `\\textstyle\\sum x_i^2 = ${xs.map((x) => `${paren(x)}^2`).join(" + ")} = ${sxx}`,
      `\\textstyle\\sum x_i y_i = ${xs.map((x, i) => `${paren(x)} \\times ${paren(ys[i])}`).join(" + ")} = ${sxy}`,
      `w^* = \\frac{${sxy}}{${sxx}} = ${answerTex}`,
    ],
  };
}

export const secondDegreGenerators: ExerciseGenerator[] = [
  { id: "discriminant", make: discriminantValue },
  { id: "nombre-racines", make: rootCount },
  { id: "racines-entieres", make: integerRoots },
  { id: "racine-irrationnelle", make: irrationalRoot },
  { id: "sommet", make: vertex },
  { id: "moindres-carres", make: leastSquares },
];
