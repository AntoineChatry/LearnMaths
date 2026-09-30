import { fracTex, randInt, randNonZero } from "../../lib/random";
import type { Exercise, ExerciseGenerator } from "../types";
import { matTex } from "../matrices/exercises";

const p = (n: number) => (n < 0 ? `(${n})` : String(n));
type M2 = number[][];
const mul = (A: M2, B: M2): M2 => A.map((r) => B[0].map((_, j) => r.reduce((s, a, k) => s + a * B[k][j], 0)));

// Integer 2×2 matrix with prescribed distinct integer eigenvalues: A = P D P⁻¹ with det P = 1.
function withEigen(l1: number, l2: number): { A: M2; P: M2 } {
  for (;;) {
    const a = randInt(-2, 2);
    const b = randInt(-2, 2);
    const P = [
      [1 + a * b, a],
      [b, 1],
    ];
    const Pinv = [
      [1, -a],
      [-b, 1 + a * b],
    ];
    const A = mul(
      mul(P, [
        [l1, 0],
        [0, l2],
      ]),
      Pinv,
    );
    // Keep entries small and avoid an already diagonal matrix.
    if (A.flat().every((x) => Math.abs(x) <= 12) && (A[0][1] !== 0 || A[1][0] !== 0)) return { A, P };
  }
}

function distinctPair(lo: number, hi: number): [number, number] {
  let l1: number, l2: number;
  do {
    l1 = randInt(lo, hi);
    l2 = randInt(lo, hi);
  } while (l1 === l2);
  return [l1, l2];
}

function eigen2x2(): Exercise {
  const [l1, l2] = distinctPair(-4, 5);
  const { A } = withEigen(l1, l2);
  const tr = A[0][0] + A[1][1];
  const det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
  const big = Math.random() < 0.5;
  const answer = big ? Math.max(l1, l2) : Math.min(l1, l2);
  return {
    intro: `Donne la ${big ? "plus grande" : "plus petite"} valeur propre de $A$.`,
    promptTex: `A = ${matTex(A)}`,
    answerTex: String(answer),
    hint: "Polynôme caractéristique : $\\lambda^2 - \\text{tr}(A)\\,\\lambda + \\det(A) = 0$.",
    solution: [
      `\\text{tr}(A) = ${tr}, \\quad \\det(A) = ${det}`,
      `\\lambda^2 ${tr < 0 ? "+" : "-"} ${Math.abs(tr)}\\lambda ${det < 0 ? "-" : "+"} ${Math.abs(det)} = (\\lambda - ${p(Math.min(l1, l2))})(\\lambda - ${p(Math.max(l1, l2))})`,
      `\\lambda \\in \\{${Math.min(l1, l2)},\\ ${Math.max(l1, l2)}\\}`,
    ],
  };
}

// Eigenvector of the form (1, k) for a given eigenvalue.
function eigenvectorK(): Exercise {
  for (;;) {
    const [l1, l2] = distinctPair(-4, 5);
    const { A, P } = withEigen(l1, l2);
    const j = randInt(0, 1);
    const [v1, v2] = [P[0][j], P[1][j]];
    if (v1 === 0) continue;
    const lam = j === 0 ? l1 : l2;
    const answerTex = fracTex(v2, v1);
    const r = [A[0][0] - lam, A[0][1]];
    return {
      intro: `$\\lambda = ${lam}$ est une valeur propre de $A$. Un vecteur propre associé s'écrit $(1, k)$ : donne $k$.`,
      promptTex: `A = ${matTex(A)}`,
      answerTex,
      hint: "Écris $(A - \\lambda I)(1, k) = 0$ : la première ligne suffit pour trouver $k$ (si son second coefficient est nul, prends la seconde).",
      solution:
        r[1] !== 0
          ? [`(A - ${p(lam)} I) = ${matTex([r, [A[1][0], A[1][1] - lam]])}`, `${p(r[0])} + ${p(r[1])}\\,k = 0 \\quad\\Longrightarrow\\quad k = ${answerTex}`]
          : [
              `(A - ${p(lam)} I) = ${matTex([r, [A[1][0], A[1][1] - lam]])}`,
              `${p(A[1][0])} + ${p(A[1][1] - lam)}\\,k = 0 \\quad\\Longrightarrow\\quad k = ${answerTex}`,
            ],
    };
  }
}

// Eigenvalues of A², A⁻¹, A + cI, and trace / determinant from the eigenvalues.
function spectrumRules(): Exercise {
  const ls = [randNonZero(-4, 4), randNonZero(-4, 4), randNonZero(-4, 4)];
  const kind = randInt(0, 4);
  const given = `\\text{Valeurs propres de } A\\ (3 \\times 3) : ${ls.join(",\\ ")}`;
  if (kind === 0) {
    return {
      intro: "Calcule le déterminant de $A$.",
      promptTex: given,
      answerTex: String(ls[0] * ls[1] * ls[2]),
      hint: "Le déterminant est le produit des valeurs propres.",
      solution: [`\\det(A) = ${ls.map(p).join(" \\times ")} = ${ls[0] * ls[1] * ls[2]}`],
    };
  }
  if (kind === 1) {
    return {
      intro: "Calcule la trace de $A$.",
      promptTex: given,
      answerTex: String(ls[0] + ls[1] + ls[2]),
      hint: "La trace est la somme des valeurs propres.",
      solution: [`\\text{tr}(A) = ${ls.map(p).join(" + ")} = ${ls[0] + ls[1] + ls[2]}`],
    };
  }
  const i = randInt(0, 2);
  const v = ls[i];
  if (kind === 2) {
    return {
      intro: `$v$ est un vecteur propre de $A$ pour la valeur propre $${v}$. Quelle est sa valeur propre pour $A^3$ ?`,
      promptTex: given,
      answerTex: String(v ** 3),
      hint: "$A^3 v = A(A(Av))$ : chaque application multiplie par $\\lambda$.",
      solution: [`A^3 v = ${p(v)}^3\\, v = ${v ** 3}\\, v`],
    };
  }
  if (kind === 3) {
    return {
      intro: `$v$ est un vecteur propre de $A$ pour la valeur propre $${v}$. Quelle est sa valeur propre pour $A^{-1}$ ?`,
      promptTex: given,
      answerTex: fracTex(1, v),
      hint: "Applique $A^{-1}$ aux deux côtés de $Av = \\lambda v$.",
      solution: [`v = A^{-1}(${v}\\, v) = ${v}\\, A^{-1} v \\quad\\Longrightarrow\\quad A^{-1} v = ${fracTex(1, v)}\\, v`],
    };
  }
  const c = randNonZero(-5, 5);
  return {
    intro: `$v$ est un vecteur propre de $A$ pour la valeur propre $${v}$. Quelle est sa valeur propre pour $A ${c < 0 ? "-" : "+"} ${Math.abs(c)}I$ ?`,
    promptTex: given,
    answerTex: String(v + c),
    hint: "$(A + cI)v = Av + cv$.",
    solution: [`(A ${c < 0 ? "-" : "+"} ${Math.abs(c)}I)v = ${v}\\,v ${c < 0 ? "-" : "+"} ${Math.abs(c)}\\,v = ${v + c}\\,v`],
  };
}

// A^k x with x = v1 + v2 written on two eigenvectors.
function powerOnEigenbasis(): Exercise {
  const [l1, l2] = distinctPair(-3, 3);
  const { A, P } = withEigen(l1, l2);
  const v1 = [P[0][0], P[1][0]];
  const v2 = [P[0][1], P[1][1]];
  const c1 = randNonZero(-2, 2);
  const c2 = randNonZero(-2, 2);
  const x = [c1 * v1[0] + c2 * v2[0], c1 * v1[1] + c2 * v2[1]];
  const k = randInt(2, 4);
  const i = randInt(0, 1);
  const answer = c1 * l1 ** k * v1[i] + c2 * l2 ** k * v2[i];
  return {
    intro: `$v_1$ et $v_2$ sont des vecteurs propres de $A$, de valeurs propres $${l1}$ et $${l2}$. Donne la ${i === 0 ? "première" : "seconde"} composante de $A^${k} x$.`,
    promptTex: `A = ${matTex(A)} \\qquad v_1 = (${v1.join(",\\ ")}) \\qquad v_2 = (${v2.join(",\\ ")}) \\qquad x = (${x.join(",\\ ")})`,
    answerTex: String(answer),
    hint: "Écris $x = c_1 v_1 + c_2 v_2$, puis $A^k x = c_1 \\lambda_1^k v_1 + c_2 \\lambda_2^k v_2$. Pas besoin de calculer $A^k$.",
    solution: [
      `x = ${c1}\\,v_1 ${c2 < 0 ? "-" : "+"} ${Math.abs(c2)}\\,v_2`,
      `A^${k} x = ${c1} \\times ${p(l1)}^${k}\\, v_1 ${c2 < 0 ? "-" : "+"} ${Math.abs(c2)} \\times ${p(l2)}^${k}\\, v_2`,
      `\\text{composante ${i + 1} : } ${c1 * l1 ** k} \\times ${p(v1[i])} + ${p(c2 * l2 ** k)} \\times ${p(v2[i])} = ${answer}`,
    ],
  };
}

// Gradient descent on ½ wᵀAw with A symmetric: stability limit and best step.
function descentStep(): Exercise {
  let l1: number, l2: number;
  do [l1, l2] = distinctPair(1, 12);
  while ((l1 + l2) % 2 !== 0);
  const lmax = Math.max(l1, l2);
  const lmin = Math.min(l1, l2);
  // A = Q diag(l1, l2) Qᵀ with Q the 45° rotation: integer entries since l1 + l2 is even.
  const A = [
    [(l1 + l2) / 2, (l1 - l2) / 2],
    [(l1 - l2) / 2, (l1 + l2) / 2],
  ];
  const kind = randInt(0, 2);
  const [what, answerTex, last] =
    kind === 0
      ? ["le plus grand pas $\\eta$ qui ne fait pas diverger la descente (la borne, exclue)", fracTex(2, lmax), `\\eta < \\frac{2}{\\lambda_{\\max}} = ${fracTex(2, lmax)}`]
      : kind === 1
        ? ["le meilleur pas $\\eta = 2 / (\\lambda_{\\max} + \\lambda_{\\min})$", fracTex(2, lmax + lmin), `\\eta = \\frac{2}{${lmax} + ${lmin}} = ${fracTex(2, lmax + lmin)}`]
        : [
            "le facteur de réduction de l'erreur par pas avec le meilleur pas, $(\\kappa - 1)/(\\kappa + 1)$",
            fracTex(lmax - lmin, lmax + lmin),
            `\\kappa = ${fracTex(lmax, lmin)}, \\quad \\frac{\\kappa - 1}{\\kappa + 1} = \\frac{${lmax} - ${lmin}}{${lmax} + ${lmin}} = ${fracTex(lmax - lmin, lmax + lmin)}`,
          ];
  return {
    intro: `Descente de gradient sur $f(w) = \\frac{1}{2} w^\\top A w$. Donne ${what}.`,
    promptTex: `A = ${matTex(A)}`,
    answerTex,
    hint: "Commence par les valeurs propres de $A$ (trace et déterminant). Chaque pas multiplie la composante propre $i$ par $1 - \\eta\\lambda_i$.",
    solution: [`\\text{tr}(A) = ${l1 + l2}, \\ \\det(A) = ${l1 * l2} \\quad\\Longrightarrow\\quad \\lambda \\in \\{${lmin},\\ ${lmax}\\}`, last],
  };
}

export const valeursPropresGenerators: ExerciseGenerator[] = [
  { id: "valeurs-propres-2x2", make: eigen2x2 },
  { id: "vecteur-propre-k", make: eigenvectorK },
  { id: "spectre-regles", make: spectrumRules },
  { id: "puissance-base-propre", make: powerOnEigenbasis },
  { id: "descente-pas", make: descentStep },
];
