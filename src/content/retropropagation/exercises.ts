import { pick, randInt, randNonZero } from "../../lib/random";
import type { Exercise, ExerciseGenerator } from "../types";

const par = (n: number) => (n < 0 ? `(${n})` : String(n));
const vecTex = (v: number[]) => `(${v.join(",\\ ")})`;
const matTex = (M: number[][]) => `\\begin{pmatrix} ${M.map((r) => r.join(" & ")).join(" \\\\ ")} \\end{pmatrix}`;
const dfd = (v: string) => `\\frac{\\partial f}{\\partial ${v}}`;
const inputs = (x: number, y: number, z: number) => `x = ${x} \\quad y = ${y} \\quad z = ${z}`;

// Chain graph p = x ∘ y, q = p + z, f = q²: one path from each input to f.
function nodeChain(): Exercise {
  const [x, y, z] = [randInt(-3, 3), randInt(-3, 3), randInt(-3, 3)];
  const product = Math.random() < 0.6;
  const p = product ? x * y : x - y;
  const q = p + z;
  const dq = 2 * q;
  const target = pick(["x", "y", "z"]);
  const local = target === "z" ? 1 : product ? (target === "x" ? y : x) : target === "x" ? 1 : -1;
  const ans = dq * local;
  const localTex = target === "z" ? "\\frac{\\partial q}{\\partial z} = 1" : `\\frac{\\partial p}{\\partial ${target}} = ${local}`;
  return {
    intro: "Fais la passe avant, puis remonte le graphe. Donne la dérivée demandée.",
    promptTex: `\\begin{gathered} ${inputs(x, y, z)} \\\\ p = ${product ? "xy" : "x - y"},\\ q = p + z,\\ f = q^2 \\qquad ${dfd(target)} \\end{gathered}`,
    answerTex: String(ans),
    hint: "Passe arrière : $\\frac{\\partial f}{\\partial q} = 2q$, puis multiplie par la dérivée locale de chaque arête jusqu'à l'entrée.",
    solution: [
      `\\text{avant : } p = ${p},\\ q = ${q},\\ f = ${q * q}`,
      `\\text{arrière : } \\frac{\\partial f}{\\partial q} = 2q = ${dq}${target === "z" ? "" : ` \\qquad \\frac{\\partial f}{\\partial p} = ${dq}`}`,
      `${localTex} \\qquad ${dfd(target)} = ${dq} \\times ${par(local)} = ${ans}`,
    ],
  };
}

// a = xy is used twice, in b = az and in f = b + a²: its gradient is a sum over its two children.
function nodeShared(): Exercise {
  const [x, y, z] = [randNonZero(-3, 3), randNonZero(-3, 3), randInt(-3, 3)];
  const a = x * y;
  const b = a * z;
  const da = z + 2 * a;
  const target = pick(["x", "y", "z", "a"]);
  const ans = target === "a" ? da : target === "z" ? a : target === "x" ? da * y : da * x;
  const lastStep =
    target === "a"
      ? ""
      : target === "z"
        ? `\\frac{\\partial f}{\\partial z} = \\frac{\\partial f}{\\partial b}\\cdot a = 1 \\times ${par(a)} = ${ans}`
        : `${dfd(target)} = \\frac{\\partial f}{\\partial a}\\cdot ${target === "x" ? "y" : "x"} = ${da} \\times ${par(target === "x" ? y : x)} = ${ans}`;
  return {
    intro: "Le nœud $a$ sert deux fois. Fais la passe avant, puis remonte le graphe et donne la dérivée demandée.",
    promptTex: `\\begin{gathered} ${inputs(x, y, z)} \\\\ a = xy,\\ b = az,\\ f = b + a^2 \\qquad ${dfd(target)} \\end{gathered}`,
    answerTex: String(ans),
    hint: "$a$ a deux enfants, $b$ et $f$ : $\\frac{\\partial f}{\\partial a} = \\frac{\\partial f}{\\partial b}\\,\\frac{\\partial b}{\\partial a} + 2a$, somme des deux chemins.",
    solution: [
      `\\text{avant : } a = ${a},\\ b = ${b},\\ f = ${b + a * a}`,
      `\\frac{\\partial f}{\\partial b} = 1 \\qquad \\frac{\\partial f}{\\partial a} = \\underbrace{1 \\cdot z}_{\\text{via } b} + \\underbrace{2a}_{\\text{direct}} = ${z} + ${par(2 * a)} = ${da}`,
      ...(lastStep ? [lastStep] : []),
    ],
  };
}

// Cost of a product u A B in both orders, or number of passes for a full Jacobian.
function modeCost(): Exercise {
  if (Math.random() < 0.3) {
    const n = pick([2, 3, 5, 10, 100, 1000]);
    const m = pick([1, 2, 3, 10]);
    const mode = pick(["inverse", "direct"]);
    return {
      intro: `Une passe inverse donne une ligne de la jacobienne, une passe directe une colonne. Combien de passes en mode ${mode} pour obtenir toute la jacobienne de $f$ ?`,
      promptTex: `f : \\mathbb R^{${n}} \\to \\mathbb R^{${m}} \\qquad \\text{passes en mode ${mode}}`,
      answerTex: String(mode === "inverse" ? m : n),
      hint: "La jacobienne a une ligne par sortie et une colonne par entrée.",
      solution: [`J_f \\in \\mathbb R^{${m} \\times ${n}} : ${m} \\text{ lignes},\\ ${n} \\text{ colonnes} \\implies ${mode === "inverse" ? m : n} \\text{ passes}`],
    };
  }
  const [k, m, n] = [randInt(2, 9) * 10, randInt(2, 9) * 10, randInt(2, 9) * 10];
  const reverse = Math.random() < 0.5;
  const ans = reverse ? k * m + m * n : k * m * n + k * n;
  return {
    intro: `$u$ est une ligne, $A$ et $B$ des matrices. Multiplier une matrice $p \\times q$ par une $q \\times r$ coûte $pqr$ multiplications. Combien coûte le produit dans l'ordre indiqué (mode ${reverse ? "inverse" : "direct"}) ?`,
    promptTex: `u \\in \\mathbb R^{1 \\times ${k}},\\ A \\in \\mathbb R^{${k} \\times ${m}},\\ B \\in \\mathbb R^{${m} \\times ${n}} \\qquad ${reverse ? "(uA)B" : "u(AB)"}`,
    answerTex: String(ans),
    hint: reverse ? "$uA$ est une ligne $1 \\times m$ : deux produits ligne fois matrice." : "$AB$ est une matrice $k \\times n$, puis on la multiplie par la ligne $u$.",
    solution: reverse
      ? [`uA : 1 \\times ${k} \\times ${m} = ${k * m} \\qquad (uA)B : 1 \\times ${m} \\times ${n} = ${m * n} \\qquad \\text{total } ${ans}`]
      : [`AB : ${k} \\times ${m} \\times ${n} = ${k * m * n} \\qquad u(AB) : 1 \\times ${k} \\times ${n} = ${k * n} \\qquad \\text{total } ${ans}`],
  };
}

// One backward step through z(l) -> ReLU -> W(l+1): δ(l) = relu'(z) ⊙ (Wᵀ δ(l+1)).
function layerStep(): Exercise {
  const j = randInt(1, 3);
  let W: number[][];
  let d: number[];
  let back: number;
  // Redraw until the transported gradient is nonzero: a zero then only comes from an inactive unit.
  do {
    W = Array.from({ length: 2 }, () => Array.from({ length: 3 }, () => randInt(-3, 3)));
    d = [randNonZero(-3, 3), randNonZero(-3, 3)];
    back = W[0][j - 1] * d[0] + W[1][j - 1] * d[1];
  } while (back === 0);
  const z = Array.from({ length: 3 }, () => (Math.random() < 0.75 ? randInt(1, 4) : -randInt(1, 4)));
  const active = z[j - 1] > 0;
  const ans = active ? back : 0;
  return {
    intro: "Couche cachée $h^{(l)} = \\operatorname{ReLU}(z^{(l)})$, suivie de $z^{(l+1)} = W h^{(l)} + b$. On connaît $\\delta^{(l+1)} = \\partial L / \\partial z^{(l+1)}$. Donne la composante demandée de $\\delta^{(l)} = \\partial L / \\partial z^{(l)}$.",
    promptTex: `\\begin{gathered} W = ${matTex(W)} \\qquad \\delta^{(l+1)} = ${vecTex(d)} \\\\ z^{(l)} = ${vecTex(z)} \\qquad \\delta^{(l)}_{${j}} \\end{gathered}`,
    answerTex: String(ans),
    hint: "$\\delta^{(l)} = \\operatorname{ReLU}'(z^{(l)}) \\odot (W^\\top \\delta^{(l+1)})$ : produit scalaire de la colonne $j$ de $W$ avec $\\delta^{(l+1)}$, puis $0$ si l'unité est inactive.",
    solution: [
      `(W^\\top \\delta^{(l+1)})_{${j}} = ${W[0][j - 1]} \\times ${par(d[0])} + ${par(W[1][j - 1])} \\times ${par(d[1])} = ${back}`,
      `z^{(l)}_{${j}} = ${z[j - 1]} ${active ? "> 0 \\implies \\delta^{(l)}_{" + j + "} = " + back : "< 0 \\implies \\delta^{(l)}_{" + j + "} = 0"}`,
    ],
  };
}

// Tiny network: scalar input, two ReLU units, scalar output, L = ½(ŷ - y)².
function tinyNet(): Exercise {
  const x = randNonZero(-2, 2);
  let w: number[];
  let b: number[];
  // Keep every pre-activation away from the ReLU kink, with at least one active unit.
  const pre = (k: number) => w[k] * x + b[k];
  do {
    w = [randNonZero(-2, 2), randNonZero(-2, 2)];
    b = [randInt(-2, 2), randInt(-2, 2)];
  } while (pre(0) === 0 || pre(1) === 0 || (pre(0) < 0 && pre(1) < 0));
  const v = [randNonZero(-3, 3), randNonZero(-3, 3)];
  const c = randInt(-2, 2);
  const zs = [0, 1].map(pre);
  const h = zs.map((s) => Math.max(s, 0));
  const out = v[0] * h[0] + v[1] * h[1] + c;
  // A nonzero error, so that most answers are not 0.
  const y = out + randNonZero(-3, 3);
  const e = out - y;
  // Mostly an active unit; an inactive one now and then, to see the gradient stop there.
  const k = zs[0] > 0 && zs[1] > 0 ? randInt(1, 2) : Math.random() < 0.8 ? (zs[0] > 0 ? 1 : 2) : zs[0] > 0 ? 2 : 1;
  const dz = zs[k - 1] > 0 ? e * v[k - 1] : 0;
  const target = pick(["v", "w", "b", "c"]);
  const ans = target === "c" ? e : target === "v" ? e * h[k - 1] : target === "w" ? dz * x : dz;
  const name = target === "c" ? "c" : `${target}_{${k}}`;
  const steps = [
    `\\text{avant : } z = ${vecTex(zs)},\\ h = ${vecTex(h)},\\ \\hat y = ${out} \\qquad \\delta_{\\text{sortie}} = \\hat y - y = ${e}`,
  ];
  if (target === "v") steps.push(`\\frac{\\partial L}{\\partial v_{${k}}} = \\delta_{\\text{sortie}}\\, h_{${k}} = ${e} \\times ${par(h[k - 1])} = ${ans}`);
  if (target === "c") steps.push(`\\frac{\\partial L}{\\partial c} = \\delta_{\\text{sortie}} = ${ans}`);
  if (target === "w" || target === "b") {
    steps.push(
      `\\delta_{${k}} = \\frac{\\partial L}{\\partial z_{${k}}} = ${zs[k - 1] > 0 ? `\\delta_{\\text{sortie}}\\, v_{${k}} = ${e} \\times ${par(v[k - 1])} = ${dz}` : `0 \\quad (z_{${k}} < 0)`}`,
    );
    steps.push(target === "w" ? `\\frac{\\partial L}{\\partial w_{${k}}} = \\delta_{${k}}\\, x = ${dz} \\times ${par(x)} = ${ans}` : `\\frac{\\partial L}{\\partial b_{${k}}} = \\delta_{${k}} = ${ans}`);
  }
  return {
    intro: "Réseau à deux unités cachées : $z = wx + b$, $h = \\operatorname{ReLU}(z)$, $\\hat y = v \\cdot h + c$, perte $L = \\frac12(\\hat y - y)^2$. Donne la dérivée demandée.",
    promptTex: `\\begin{gathered} x = ${x} \\quad w = ${vecTex(w)} \\quad b = ${vecTex(b)} \\\\ v = ${vecTex(v)} \\quad c = ${c} \\quad y = ${y} \\qquad \\frac{\\partial L}{\\partial ${name}} \\end{gathered}`,
    answerTex: String(ans),
    hint: "Passe avant, puis $\\delta_{\\text{sortie}} = \\hat y - y$. Vers une unité cachée : multiplier par $v_k$, puis par $0$ ou $1$ selon le signe de $z_k$.",
    solution: steps,
  };
}

export const retropropagationGenerators: ExerciseGenerator[] = [
  { id: "retro-noeud", make: nodeChain },
  { id: "retro-partage", make: nodeShared },
  { id: "retro-cout", make: modeCost },
  { id: "retro-couche", make: layerStep },
  { id: "retro-reseau", make: tinyNet },
];
