import { fracTex, pick, randInt, randNonZero } from "../../lib/random";
import type { Exercise, ExerciseGenerator } from "../types";

const par = (n: number) => (n < 0 ? `(${n})` : String(n));
const vecTex = (v: number[]) => `(${v.join(",\\ ")})`;
const matTex = (M: number[][]) => `\\begin{pmatrix} ${M.map((r) => r.join(" & ")).join(" \\\\ ")} \\end{pmatrix}`;
const randMat = (m: number, n: number, lo = -3, hi = 3) => Array.from({ length: m }, () => Array.from({ length: n }, () => randInt(lo, hi)));
const matVec = (M: number[][], v: number[]) => M.map((r) => r.reduce((s, a, j) => s + a * v[j], 0));

// a t + b, written in t.
function affineTex(a: number, b: number): string {
  const lead = a === 1 ? "t" : a === -1 ? "-t" : `${a}t`;
  return b === 0 ? lead : `${lead} ${b > 0 ? "+" : "-"} ${Math.abs(b)}`;
}

// df/dt along a straight path x(t) = a t + b, y(t) = c t + d, for f(x, y) = p x² + q xy + r y².
function chainPath(): Exercise {
  const [p, q, r] = [randInt(-2, 2), randNonZero(-3, 3), randInt(-2, 2)];
  const [a, b, c, d] = [randNonZero(-3, 3), randInt(-2, 2), randNonZero(-3, 3), randInt(-2, 2)];
  const t0 = randInt(-2, 2);
  const x0 = a * t0 + b;
  const y0 = c * t0 + d;
  const fx = 2 * p * x0 + q * y0;
  const fy = q * x0 + 2 * r * y0;
  const ans = fx * a + fy * c;
  const terms: string[] = [];
  const push = (k: number, body: string) => {
    if (k === 0) return;
    const mag = `${Math.abs(k) === 1 ? "" : Math.abs(k)}${body}`;
    terms.push(terms.length === 0 ? (k < 0 ? `-${mag}` : mag) : `${k < 0 ? "-" : "+"} ${mag}`);
  };
  push(p, "x^2");
  push(q, "xy");
  push(r, "y^2");
  return {
    intro: "Un point se déplace sur le chemin $(x(t), y(t))$. Avec la règle de la chaîne, donne la dérivée de $f(x(t), y(t))$ par rapport à $t$ à l'instant indiqué.",
    promptTex: `f(x, y) = ${terms.join(" ")} \\qquad x(t) = ${affineTex(a, b)} \\qquad y(t) = ${affineTex(c, d)} \\qquad t = ${t0}`,
    answerTex: String(ans),
    hint: "$\\frac{df}{dt} = \\frac{\\partial f}{\\partial x}\\,x'(t) + \\frac{\\partial f}{\\partial y}\\,y'(t)$, dérivées partielles évaluées au point $(x(t), y(t))$.",
    solution: [
      `(x, y) = (${x0}, ${y0}) \\qquad x'(t) = ${a} \\qquad y'(t) = ${c}`,
      `\\frac{\\partial f}{\\partial x} = ${2 * p} \\times ${par(x0)} + ${par(q)} \\times ${par(y0)} = ${fx} \\qquad \\frac{\\partial f}{\\partial y} = ${q} \\times ${par(x0)} + ${par(2 * r)} \\times ${par(y0)} = ${fy}`,
      `\\frac{df}{dt} = ${fx} \\times ${par(a)} + ${par(fy)} \\times ${par(c)} = ${ans}`,
    ],
  };
}

// Coefficient of the product J_g J_f, and its size.
function chainProduct(): Exercise {
  const [n, m, p] = [randInt(2, 3), 2, randInt(2, 3)];
  const Jf = randMat(m, n);
  const Jg = randMat(p, m);
  if (Math.random() < 0.25) {
    const which = pick(["lignes", "colonnes"]);
    return {
      intro: `$f : \\mathbb R^{${n}} \\to \\mathbb R^{${m}}$ et $g : \\mathbb R^{${m}} \\to \\mathbb R^{${p}}$. Combien de ${which} a la jacobienne de $g \\circ f$ ?`,
      promptTex: `J_{g \\circ f} = J_g\\,J_f \\qquad \\text{nombre de ${which}}`,
      answerTex: String(which === "lignes" ? p : n),
      hint: "Une ligne par sortie de $g \\circ f$, une colonne par entrée.",
      solution: [`J_g \\in \\mathbb R^{${p} \\times ${m}},\\ J_f \\in \\mathbb R^{${m} \\times ${n}} \\implies J_g J_f \\in \\mathbb R^{${p} \\times ${n}}`],
    };
  }
  const i = randInt(1, p);
  const j = randInt(1, n);
  const ans = Jg[i - 1][0] * Jf[0][j - 1] + Jg[i - 1][1] * Jf[1][j - 1];
  return {
    intro: "On connaît les jacobiennes $J_f(x_0)$ et $J_g(f(x_0))$. Donne le coefficient $(i, j)$ de la jacobienne de $g \\circ f$ en $x_0$.",
    promptTex: `J_g = ${matTex(Jg)} \\qquad J_f = ${matTex(Jf)} \\qquad (i, j) = (${i}, ${j})`,
    answerTex: String(ans),
    hint: "$J_{g \\circ f} = J_g\\,J_f$ : produit scalaire de la ligne $i$ de $J_g$ avec la colonne $j$ de $J_f$.",
    solution: [`${Jg[i - 1][0]} \\times ${par(Jf[0][j - 1])} + ${par(Jg[i - 1][1])} \\times ${par(Jf[1][j - 1])} = ${ans}`],
  };
}

// Gradient identities: quadratic form x^T B x, and least squares ||y - Φθ||².
function gradIdentities(): Exercise {
  const k = randInt(1, 2);
  if (Math.random() < 0.5) {
    const B = randMat(2, 2);
    const x = [randInt(-3, 3), randInt(-3, 3)];
    const S = [
      [2 * B[0][0], B[0][1] + B[1][0]],
      [B[0][1] + B[1][0], 2 * B[1][1]],
    ];
    const g = matVec(S, x);
    return {
      intro: "Donne la composante demandée du gradient de $q(x) = x^\\top B x$ au point $x$.",
      promptTex: `B = ${matTex(B)} \\qquad x = ${vecTex(x)} \\qquad \\frac{\\partial q}{\\partial x_{${k}}}`,
      answerTex: String(g[k - 1]),
      hint: "$\\frac{\\partial\\, x^\\top B x}{\\partial x} = x^\\top(B + B^\\top)$ : attention, $B$ n'est pas forcément symétrique.",
      solution: [`B + B^\\top = ${matTex(S)} \\qquad (B + B^\\top)\\,x = ${vecTex(g)}`],
    };
  }
  const Phi = randMat(3, 2, -2, 2);
  const theta = [randInt(-2, 2), randInt(-2, 2)];
  const y = [randInt(-3, 3), randInt(-3, 3), randInt(-3, 3)];
  const r = matVec(Phi, theta).map((v, n) => v - y[n]);
  const g = [0, 1].map((d) => 2 * r.reduce((s, v, n) => s + v * Phi[n][d], 0));
  return {
    intro: "Moindres carrés : donne la composante demandée du gradient de $L(\\theta) = \\|y - \\Phi\\theta\\|^2$.",
    promptTex: `\\Phi = ${matTex(Phi)} \\qquad y = ${vecTex(y)} \\qquad \\theta = ${vecTex(theta)} \\qquad \\frac{\\partial L}{\\partial \\theta_{${k}}}`,
    answerTex: String(g[k - 1]),
    hint: "En colonne, $\\nabla_\\theta L = 2\\Phi^\\top(\\Phi\\theta - y)$ : calcule d'abord le résidu $\\Phi\\theta - y$.",
    solution: [`\\Phi\\theta - y = ${vecTex(r)} \\qquad 2\\Phi^\\top(\\Phi\\theta - y) = ${vecTex(g)}`],
  };
}

// ∂L/∂W = δ x^T for one example, a squared loss, or a minibatch of two.
function gradMatrix(): Exercise {
  const kind = randInt(0, 2);
  const i = randInt(1, 2);
  const j = randInt(1, 3);
  if (kind === 0) {
    const delta = [randNonZero(-4, 4), randNonZero(-4, 4)];
    const x = [randInt(-3, 3), randInt(-3, 3), randInt(-3, 3)];
    return {
      intro: "Dans une couche $z = Wx + b$, la suite du réseau renvoie $\\delta = \\partial L / \\partial z$. Donne le coefficient $\\partial L / \\partial W_{ij}$.",
      promptTex: `\\delta = ${vecTex(delta)} \\qquad x = ${vecTex(x)} \\qquad \\frac{\\partial L}{\\partial W_{${i}${j}}}`,
      answerTex: String(delta[i - 1] * x[j - 1]),
      hint: "$\\partial L / \\partial W = \\delta\\, x^\\top$, donc $\\partial L / \\partial W_{ij} = \\delta_i x_j$.",
      solution: [`\\delta_{${i}}\\, x_{${j}} = ${delta[i - 1]} \\times ${par(x[j - 1])} = ${delta[i - 1] * x[j - 1]}`],
    };
  }
  if (kind === 1) {
    const W = randMat(2, 3, -2, 2);
    const x = [randInt(-2, 2), randInt(-2, 2), randInt(-2, 2)];
    const b = [randInt(-2, 2), randInt(-2, 2)];
    const y = [randInt(-3, 3), randInt(-3, 3)];
    const delta = matVec(W, x).map((v, k) => v + b[k] - y[k]);
    return {
      intro: "Perte $L = \\frac12 \\|Wx + b - y\\|^2$. Donne le coefficient $\\partial L / \\partial W_{ij}$.",
      promptTex: `W = ${matTex(W)} \\qquad b = ${vecTex(b)} \\qquad x = ${vecTex(x)} \\qquad y = ${vecTex(y)} \\qquad \\frac{\\partial L}{\\partial W_{${i}${j}}}`,
      answerTex: String(delta[i - 1] * x[j - 1]),
      hint: "Ici $\\delta = \\partial L / \\partial z = Wx + b - y$, puis $\\partial L / \\partial W_{ij} = \\delta_i x_j$.",
      solution: [`\\delta = Wx + b - y = ${vecTex(delta)}`, `\\delta_{${i}}\\, x_{${j}} = ${delta[i - 1]} \\times ${par(x[j - 1])} = ${delta[i - 1] * x[j - 1]}`],
    };
  }
  const d1 = [randNonZero(-3, 3), randNonZero(-3, 3)];
  const d2 = [randNonZero(-3, 3), randNonZero(-3, 3)];
  const x1 = [randInt(-3, 3), randInt(-3, 3), randInt(-3, 3)];
  const x2 = [randInt(-3, 3), randInt(-3, 3), randInt(-3, 3)];
  const ans = d1[i - 1] * x1[j - 1] + d2[i - 1] * x2[j - 1];
  return {
    intro: "Un minibatch de deux exemples traverse la couche $z = Wx + b$ ; la perte est la somme des deux pertes. Donne le coefficient $\\partial L / \\partial W_{ij}$.",
    promptTex: `\\delta_1 = ${vecTex(d1)},\\ x_1 = ${vecTex(x1)} \\qquad \\delta_2 = ${vecTex(d2)},\\ x_2 = ${vecTex(x2)} \\qquad \\frac{\\partial L}{\\partial W_{${i}${j}}}`,
    answerTex: String(ans),
    hint: "Les gradients s'additionnent : $\\partial L / \\partial W = \\delta_1 x_1^\\top + \\delta_2 x_2^\\top$.",
    solution: [`${d1[i - 1]} \\times ${par(x1[j - 1])} + ${par(d2[i - 1])} \\times ${par(x2[j - 1])} = ${ans}`],
  };
}

// Softmax layer with cross-entropy: ∂L/∂W = (y - t) x^T, ∂L/∂b = y - t.
function gradSoftmax(): Exercise {
  const w = Array.from({ length: 3 }, () => randInt(1, 5));
  const W = w.reduce((s, v) => s + v, 0);
  const c = randInt(1, 3);
  const i = randInt(1, 3);
  const x = [randInt(-3, 3), randInt(-3, 3)];
  const e = w[i - 1] - (i === c ? W : 0); // (y_i - t_i) W
  const onBias = Math.random() < 0.3;
  const j = randInt(1, 2);
  const num = onBias ? e : e * x[j - 1];
  const target = onBias ? `\\frac{\\partial L}{\\partial b_{${i}}}` : `\\frac{\\partial L}{\\partial W_{${i}${j}}}`;
  return {
    intro: "Couche $z = Wx + b$, puis $y = \\operatorname{softmax}(z)$ et $L = -\\log y_c$. Donne la dérivée demandée.",
    promptTex: `y = (${w.map((v) => fracTex(v, W)).join(",\\ ")}) \\qquad c = ${c} \\qquad x = ${vecTex(x)} \\qquad ${target}`,
    answerTex: fracTex(num, W),
    hint: "$\\delta = \\partial L / \\partial z = y - t$ ($t$ : one-hot de la vraie classe), puis $\\partial L / \\partial W = \\delta x^\\top$ et $\\partial L / \\partial b = \\delta$.",
    solution: [
      `\\delta_{${i}} = y_{${i}} - t_{${i}} = ${fracTex(w[i - 1], W)} - ${i === c ? 1 : 0} = ${fracTex(e, W)}`,
      onBias ? `\\frac{\\partial L}{\\partial b_{${i}}} = ${fracTex(e, W)}` : `\\delta_{${i}}\\, x_{${j}} = ${fracTex(e, W)} \\times ${par(x[j - 1])} = ${fracTex(num, W)}`,
    ],
  };
}

export const chaineGenerators: ExerciseGenerator[] = [
  { id: "chaine-chemin", make: chainPath },
  { id: "chaine-produit", make: chainProduct },
  { id: "chaine-identites", make: gradIdentities },
  { id: "chaine-grad-matrice", make: gradMatrix },
  { id: "chaine-softmax", make: gradSoftmax },
];
