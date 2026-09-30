import { fracTex, pick, randInt, randNonZero } from "../../lib/random";
import type { Exercise, ExerciseGenerator } from "../types";
import { coefLead } from "../../lib/tex";

const paren = (n: number) => (n < 0 ? `(${n})` : String(n));
const vec = (v: (number | string)[]) => `(${v.join(",\\ ")})`;

// Simplified √n: 52 → "2\sqrt{13}", 49 → "7".
export function sqrtTex(n: number): string {
  let k = 1;
  for (let d = 2; d * d <= n; d++) if (n % (d * d) === 0) k = d;
  const rest = n / (k * k);
  if (rest === 1) return String(k);
  return k === 1 ? `\\sqrt{${rest}}` : `${k}\\sqrt{${rest}}`;
}

const randVec = (n: number, lo: number, hi: number) => Array.from({ length: n }, () => randInt(lo, hi));
const dot = (a: number[], b: number[]) => a.reduce((s, ai, i) => s + ai * b[i], 0);
const dotSteps = (a: number[], b: number[]) => a.map((ai, i) => `${paren(ai)} \\times ${paren(b[i])}`).join(" + ");

function dotProduct(): Exercise {
  const a = randVec(3, -5, 5);
  const b = randVec(3, -5, 5);
  const value = dot(a, b);
  return {
    promptTex: `a = ${vec(a)} \\qquad b = ${vec(b)} \\qquad a \\cdot b = \\ ?`,
    answerTex: String(value),
    hint: "Multiplie les composantes deux à deux, puis additionne les trois produits.",
    solution: [`a \\cdot b = ${dotSteps(a, b)} = ${value}`],
  };
}

function norm(): Exercise {
  let a: number[];
  do a = randVec(pick([2, 3]), -6, 6);
  while (a.every((x) => x === 0));
  const n2 = dot(a, a);
  const answerTex = sqrtTex(n2);
  return {
    intro: "Donne la valeur exacte (tape sqrt pour √).",
    promptTex: `a = ${vec(a)} \\qquad \\|a\\| = \\ ?`,
    answerTex,
    hint: "Somme des carrés des composantes, puis racine carrée. Simplifie la racine si un carré parfait se cache dedans.",
    solution: [`\\|a\\| = \\sqrt{${a.map((x) => `${paren(x)}^2`).join(" + ")}} = \\sqrt{${n2}}${answerTex === `\\sqrt{${n2}}` ? "" : ` = ${answerTex}`}`],
  };
}

// Find the missing component k so that u ⊥ v.
function orthogonalK(): Exercise {
  const u = [randNonZero(-5, 5), randInt(-5, 5), randInt(-5, 5)];
  const v = [randInt(-5, 5), randInt(-5, 5)];
  const rest = u[1] * v[0] + u[2] * v[1];
  const answerTex = fracTex(-rest, u[0]);
  return {
    intro: "Pour quelle valeur de $k$ les vecteurs $u$ et $v$ sont-ils orthogonaux ?",
    promptTex: `u = ${vec(u)} \\qquad v = ${vec(["k", ...v])}`,
    answerTex,
    hint: "Orthogonaux veut dire produit scalaire nul. Écris $u \\cdot v$ en fonction de $k$, puis résous.",
    solution: [
      `u \\cdot v = ${paren(u[0])}\\,k + ${paren(u[1])} \\times ${paren(v[0])} + ${paren(u[2])} \\times ${paren(v[1])} = ${coefLead(u[0])}k ${rest < 0 ? "-" : "+"} ${Math.abs(rest)}`,
      `${coefLead(u[0])}k ${rest < 0 ? "-" : "+"} ${Math.abs(rest)} = 0 \\iff k = ${answerTex}`,
    ],
  };
}

// Directions at multiples of 45°, scaled by positive integers: the angle is exact.
const DIRS: [number, number][] = [
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
  [0, -1],
  [1, -1],
];
const COS_TEX: Record<number, string> = { 0: "1", 45: "\\frac{\\sqrt{2}}{2}", 90: "0", 135: "-\\frac{\\sqrt{2}}{2}", 180: "-1" };

function angle(): Exercise {
  const i = randInt(0, 7);
  const j = randInt(0, 7);
  const s = randInt(1, 3);
  const t = randInt(1, 3);
  const a = DIRS[i].map((c) => c * s);
  const b = DIRS[j].map((c) => c * t);
  let deg = (Math.abs(i - j) * 45) % 360;
  if (deg > 180) deg = 360 - deg;
  const d = dot(a, b);
  const na = sqrtTex(dot(a, a));
  const nb = sqrtTex(dot(b, b));
  return {
    intro: "Quel est l'angle entre $a$ et $b$, en degrés ?",
    promptTex: `a = ${vec(a)} \\qquad b = ${vec(b)}`,
    answerTex: String(deg),
    hint: "$\\cos\\theta = \\frac{a \\cdot b}{\\|a\\|\\,\\|b\\|}$. Les valeurs possibles ici sont celles des angles remarquables.",
    solution: [
      `a \\cdot b = ${dotSteps(a, b)} = ${d} \\qquad \\|a\\| = ${na} \\qquad \\|b\\| = ${nb}`,
      `\\cos\\theta = \\frac{${d}}{${na} \\times ${nb}} = ${COS_TEX[deg]} \\quad\\Longrightarrow\\quad \\theta = ${deg}^\\circ`,
    ],
  };
}

// Coefficient k of the projection p = k·b of a onto b.
function projectionCoef(): Exercise {
  const a = randVec(2, -6, 6);
  let b: number[];
  do b = randVec(2, -4, 4);
  while (b.every((x) => x === 0));
  const d = dot(a, b);
  const n2 = dot(b, b);
  const answerTex = fracTex(d, n2);
  return {
    intro: "Le projeté orthogonal de $a$ sur la droite portée par $b$ s'écrit $p = k\\,b$. Que vaut $k$ ?",
    promptTex: `a = ${vec(a)} \\qquad b = ${vec(b)}`,
    answerTex,
    hint: "$p = \\frac{a \\cdot b}{\\|b\\|^2}\\,b$ : calcule le produit scalaire et la norme au carré de $b$ (pas besoin de racine).",
    solution: [
      `a \\cdot b = ${dotSteps(a, b)} = ${d} \\qquad \\|b\\|^2 = ${paren(b[0])}^2 + ${paren(b[1])}^2 = ${n2}`,
      `k = \\frac{a \\cdot b}{\\|b\\|^2} = \\frac{${d}}{${n2}}${fracTex(d, n2) === `\\frac{${d}}{${n2}}` ? "" : ` = ${answerTex}`}`,
    ],
  };
}

// One component of λa + μb.
function linearCombination(): Exercise {
  const a = randVec(3, -5, 5);
  const b = randVec(3, -5, 5);
  const l = randNonZero(-3, 3);
  const m = randNonZero(-3, 3);
  const i = randInt(0, 2);
  const value = l * a[i] + m * b[i];
  const names = ["première", "deuxième", "troisième"];
  return {
    intro: `Donne la ${names[i]} composante de $v$.`,
    promptTex: `a = ${vec(a)} \\qquad b = ${vec(b)} \\qquad v = ${l === 1 ? "" : l === -1 ? "-" : l}a ${m < 0 ? "-" : "+"} ${Math.abs(m) === 1 ? "" : Math.abs(m)}b`,
    answerTex: String(value),
    hint: "Tout se fait composante par composante : seule la composante demandée de $a$ et de $b$ compte.",
    solution: [`v_${i + 1} = ${paren(l)} \\times ${paren(a[i])} + ${paren(m)} \\times ${paren(b[i])} = ${value}`],
  };
}

export const vecteursGenerators: ExerciseGenerator[] = [
  { id: "combinaison-lineaire", make: linearCombination },
  { id: "produit-scalaire", make: dotProduct },
  { id: "norme", make: norm },
  { id: "orthogonal-k", make: orthogonalK },
  { id: "angle", make: angle },
  { id: "projection-coef", make: projectionCoef },
];
