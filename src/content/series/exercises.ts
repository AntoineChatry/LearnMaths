import { fracTex, pick, randInt } from "../../lib/random";
import type { Exercise, ExerciseGenerator } from "../types";

function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

// (p/r) in LaTeX, in parentheses when it is a fraction or a negative.
function ratioTex(p: number, r: number): string {
  const t = fracTex(p, r);
  return r === 1 && p > 0 ? t : `\\left(${t}\\right)`;
}

// Ratio q = p/r with |q| < 1, irreducible fraction.
function smallRatio(): [number, number] {
  const r = pick([2, 3, 4, 5, 10]);
  let p = 0;
  while (p === 0 || gcd(p, r) !== 1) p = randInt(-(r - 1), r - 1);
  return [p, r];
}

// Σ_{n=m}^{∞} a·q^n : first term over (1 − ratio), or +∞ if q ≥ 1 and a > 0.
function geometricSum(): Exercise {
  const m = randInt(0, 2);
  if (Math.random() < 0.2) {
    const [p, r] = pick([
      [2, 1],
      [3, 1],
      [3, 2],
      [5, 4],
    ] as const);
    const a = randInt(1, 5);
    const coef = a === 1 ? "" : `${a} \\cdot `;
    return {
      promptTex: `\\sum_{n=${m}}^{+\\infty} ${coef}${ratioTex(p, r)}^{n}`,
      answerTex: "+\\infty",
      hint: "Regarde d'abord la raison : la formule 1/(1 − q) ne vaut que si $|q| < 1$.",
      solution: [
        `q = ${fracTex(p, r)} \\ge 1 : \\text{ les termes ne tendent pas vers } 0`,
        `\\text{Termes positifs et } \\ge ${a} : \\text{ les sommes partielles dépassent tout plafond, la série vaut } +\\infty`,
      ],
    };
  }
  const [p, r] = smallRatio();
  let a = 0;
  while (a === 0) a = randInt(-5, 5);
  const coef = a === 1 ? "" : a === -1 ? "-" : `${a} \\cdot `;
  // a·q^m / (1 − q) = a·p^m·r / (r^m·(r − p))
  const answerTex = fracTex(a * p ** m * r, r ** m * (r - p));
  const first = fracTex(a * p ** m, r ** m);
  return {
    promptTex: `\\sum_{n=${m}}^{+\\infty} ${coef}${ratioTex(p, r)}^{n}`,
    answerTex,
    hint: "Série géométrique : premier terme sur (1 − raison). Attention, le premier terme dépend de l'indice de départ.",
    solution: [
      `q = ${fracTex(p, r)}, \\quad |q| < 1 : \\text{la série converge}`,
      `\\text{Premier terme } (n = ${m}) : \\ ${first}`,
      `\\frac{${first}}{1 - ${ratioTex(p, r)}} = \\frac{${first}}{${fracTex(r - p, r)}} = ${answerTex}`,
    ],
  };
}

// S_N = Σ_{k=0}^{N} a·q^k, finite sum: formula (1 − q^{N+1})/(1 − q).
function partialGeometric(): Exercise {
  const [p, r] = pick([
    [2, 1],
    [3, 1],
    [-2, 1],
    [-3, 1],
    [1, 2],
    [-1, 2],
    [1, 3],
  ] as const);
  const N = randInt(3, r === 1 && Math.abs(p) === 3 ? 5 : 7);
  const a = randInt(1, 4);
  const coef = a === 1 ? "" : `${a} \\cdot `;
  // a·(1 − q^{N+1})/(1 − q) = a·(r^{N+1} − p^{N+1}) / (r^N·(r − p))
  const answerTex = fracTex(a * (r ** (N + 1) - p ** (N + 1)), r ** N * (r - p));
  const q = fracTex(p, r);
  return {
    promptTex: `S_{${N}} = \\sum_{k=0}^{${N}} ${coef}${ratioTex(p, r)}^{k} = \\ ?`,
    answerTex,
    hint: "Somme finie de termes géométriques : $S_N = a \\cdot \\frac{1 - q^{N+1}}{1 - q}$. Compte bien les termes : de k = 0 à k = N, il y en a N + 1.",
    solution: [
      `a = ${a}, \\quad q = ${q}, \\quad N + 1 = ${N + 1} \\text{ termes}`,
      `S_{${N}} = ${a} \\times \\frac{1 - ${ratioTex(p, r)}^{${N + 1}}}{1 - ${ratioTex(p, r)}} = ${answerTex}`,
    ],
  };
}

// Smallest index N from which the sequence stays within ε of its limit.
function epsilonRank(): Exercise {
  if (Math.random() < 0.5) {
    const L = randInt(-3, 5);
    const c = randInt(1, 9);
    const m = pick([10, 100, 1000]);
    const num = `${L === 0 ? "" : L === 1 ? "n" : L === -1 ? "-n" : `${L}n`}${L === 0 ? c : `+${c}`}`;
    return {
      intro: `La suite ci-dessous tend vers ${L}. Donne le plus petit entier N tel que, pour tout n ≥ N, $|u_n - ${L < 0 ? `(${L})` : L}| < \\frac{1}{${m}}$.`,
      promptTex: `u_n = \\frac{${num}}{n} \\qquad N = \\ ?`,
      answerTex: String(c * m + 1),
      hint: `Écris $u_n - ${L < 0 ? `(${L})` : L}$ le plus simplement possible, puis résous l'inégalité en n.`,
      solution: [
        `u_n - ${L < 0 ? `(${L})` : L} = \\frac{${c}}{n}`,
        `\\frac{${c}}{n} < \\frac{1}{${m}} \\iff n > ${c * m}`,
        `\\text{La distance décroît avec } n, \\text{ donc } N = ${c * m + 1}`,
      ],
    };
  }
  const b = pick([2, 3, 5]);
  const d = randInt(1, 6);
  let N = 0;
  while (b ** N <= 10 ** d) N++;
  return {
    intro: `Cette suite tend vers 0. Donne le plus petit entier N tel que, pour tout n ≥ N, $u_n < 10^{-${d}}$.`,
    promptTex: `u_n = \\left(\\frac{1}{${b}}\\right)^{n} \\qquad N = \\ ?`,
    answerTex: String(N),
    hint: `Cherche la première puissance de ${b} qui dépasse $10^{${d}}$. La suite est décroissante, donc une fois sous le seuil, elle y reste.`,
    solution: [
      `\\left(\\tfrac{1}{${b}}\\right)^n < 10^{-${d}} \\iff ${b}^n > 10^{${d}}`,
      `${b}^{${N - 1}} = ${b ** (N - 1)} \\le 10^{${d}} < ${b}^{${N}} = ${b ** N}`,
      `N = ${N}`,
    ],
  };
}

// Σ_{n=m}^{∞} c/(n(n+k)) : telescoping series.
function telescoping(): Exercise {
  const k = pick([1, 1, 2]);
  const m = randInt(1, 5);
  const c = randInt(1, 6);
  // Sum = (c/k)·(1/m + … + 1/(m+k−1)); accumulated as an exact fraction.
  let num = 0;
  let den = 1;
  for (let j = m; j < m + k; j++) {
    num = num * j + den;
    den = den * j;
  }
  const answerTex = fracTex(c * num, k * den);
  const denomTex = `n(n+${k})`;
  const cTex = c === 1 ? "1" : String(c);
  const kept = Array.from({ length: k }, (_, i) => `\\frac{1}{${m + i}}`).join(" + ");
  return {
    promptTex: `\\sum_{n=${m}}^{+\\infty} \\frac{${cTex}}{${denomTex}}`,
    answerTex,
    hint: `Décompose : $\\frac{1}{n(n+${k})} = ${k === 1 ? "" : `\\frac{1}{${k}}`}\\left(\\frac{1}{n} - \\frac{1}{n+${k}}\\right)$, puis écris les premiers termes de la somme partielle : presque tout s'annule.`,
    solution: [
      `\\frac{${cTex}}{${denomTex}} = ${fracTex(c, k)}\\left(\\frac{1}{n} - \\frac{1}{n+${k}}\\right)`,
      `\\text{Dans la somme partielle, chaque } -\\tfrac{1}{n+${k}} \\text{ annule un terme positif plus loin : il ne reste que } ${kept} \\text{ et des termes qui tendent vers } 0`,
      `\\sum_{n=${m}}^{+\\infty} \\frac{${cTex}}{${denomTex}} = ${fracTex(c, k)}\\left(${kept}\\right) = ${answerTex}`,
    ],
  };
}

// Ratio test (d'Alembert): compute ℓ = lim a_{n+1}/a_n.
function ratioTest(): Exercise {
  const kind = randInt(0, 4);
  const verdict = (l: string, lt1: boolean | null) =>
    lt1 === null ? `\\ell = ${l}` : `\\ell = ${l} ${lt1 ? "< 1 : \\text{la série converge}" : "> 1 : \\text{la série diverge}"}`;
  if (kind === 0) {
    const k = randInt(1, 4);
    const b = randInt(2, 9);
    return {
      intro: "Test de d'Alembert : calcule $\\ell = \\lim \\frac{a_{n+1}}{a_n}$.",
      promptTex: `a_n = \\frac{n^{${k}}}{${b}^{n}} \\qquad \\ell = \\ ?`,
      answerTex: fracTex(1, b),
      hint: "Écris le quotient, puis sépare la partie « puissance de n » de la partie « exponentielle ».",
      solution: [
        `\\frac{a_{n+1}}{a_n} = \\left(\\frac{n+1}{n}\\right)^{${k}} \\times \\frac{1}{${b}}`,
        `\\left(1 + \\tfrac1n\\right)^{${k}} \\to 1, \\text{ donc } ${verdict(fracTex(1, b), true)}`,
      ],
    };
  }
  if (kind === 1) {
    const b = randInt(2, 9);
    return {
      intro: "Test de d'Alembert : calcule $\\ell = \\lim \\frac{a_{n+1}}{a_n}$.",
      promptTex: `a_n = \\frac{${b}^{n}}{n!} \\qquad \\ell = \\ ?`,
      answerTex: "0",
      hint: "$(n+1)! = (n+1) \\times n!$",
      solution: [
        `\\frac{a_{n+1}}{a_n} = \\frac{${b}^{n+1}}{(n+1)!} \\times \\frac{n!}{${b}^{n}} = \\frac{${b}}{n+1}`,
        `\\frac{${b}}{n+1} \\to 0, \\text{ donc } ${verdict("0", true)}`,
      ],
    };
  }
  if (kind === 2) {
    const b = randInt(2, 9);
    return {
      intro: "Test de d'Alembert : calcule $\\ell = \\lim \\frac{a_{n+1}}{a_n}$.",
      promptTex: `a_n = \\frac{n!}{${b}^{n}} \\qquad \\ell = \\ ?`,
      answerTex: "+\\infty",
      hint: "$(n+1)! = (n+1) \\times n!$",
      solution: [
        `\\frac{a_{n+1}}{a_n} = \\frac{(n+1)!}{${b}^{n+1}} \\times \\frac{${b}^{n}}{n!} = \\frac{n+1}{${b}}`,
        `\\frac{n+1}{${b}} \\to +\\infty > 1 : \\text{ la série diverge}`,
      ],
    };
  }
  if (kind === 3) {
    const c = randInt(1, 9);
    let d = randInt(1, 9);
    while (d === c) d = randInt(1, 9);
    const k = randInt(1, 3);
    const l = fracTex(c, d);
    return {
      intro: "Test de d'Alembert : calcule $\\ell = \\lim \\frac{a_{n+1}}{a_n}$.",
      promptTex: `a_n = \\frac{n^{${k}} \\cdot ${c}^{n}}{${d}^{n}} \\qquad \\ell = \\ ?`,
      answerTex: l,
      hint: "La puissance de n donne un facteur qui tend vers 1 ; seul le rapport des exponentielles compte.",
      solution: [
        `\\frac{a_{n+1}}{a_n} = \\left(\\frac{n+1}{n}\\right)^{${k}} \\times \\frac{${c}}{${d}}`,
        verdict(l, c < d),
      ],
    };
  }
  return {
    intro: "Test de d'Alembert : calcule $\\ell = \\lim \\frac{a_{n+1}}{a_n}$.",
    promptTex: `a_n = \\frac{(2n)!}{(n!)^2} \\qquad \\ell = \\ ?`,
    answerTex: "4",
    hint: "$(2n+2)! = (2n+2)(2n+1) \\times (2n)!$ et $((n+1)!)^2 = (n+1)^2 \\times (n!)^2$.",
    solution: [
      "\\frac{a_{n+1}}{a_n} = \\frac{(2n+2)(2n+1)}{(n+1)^2} = \\frac{2(2n+1)}{n+1}",
      "\\frac{4n + 2}{n + 1} \\to 4 > 1 : \\text{ la série diverge}",
    ],
  };
}

// Code mode: what does the loop's output tend to?
function codeSeries(): Exercise {
  const kind = randInt(0, 5);
  const intro = "Sans l'exécuter : vers quelle valeur exacte tend ce que ce programme affiche ? (réponds +∞ si ça grandit sans limite)";
  if (kind === 0) {
    const [p, r] = smallRatio();
    const a = randInt(1, 5);
    const answerTex = fracTex(a * r, r - p);
    return {
      intro,
      code: `s = 0\nfor k in range(1000):\n    s += ${a} * (${p}/${r}) ** k\nprint(s)`,
      promptTex: `\\text{valeur affichée} \\approx \\ ?`,
      answerTex,
      hint: "Somme partielle d'une série géométrique à 1000 termes : on est déjà collé à la limite.",
      solution: [
        `\\sum_{k=0}^{+\\infty} ${a}\\,${ratioTex(p, r)}^{k} = \\frac{${a}}{1 - ${ratioTex(p, r)}} = ${answerTex}`,
      ],
    };
  }
  if (kind === 1) {
    const r = randInt(2, 9);
    return {
      intro,
      code: `terme, s = 1, 0\nwhile terme > 1e-15:\n    s += terme\n    terme = terme / ${r}\nprint(s)`,
      promptTex: `\\text{valeur affichée} \\approx \\ ?`,
      answerTex: fracTex(r, r - 1),
      hint: "Chaque terme vaut le précédent divisé par la même constante : quelle série reconnais-tu ?",
      solution: [`1 + \\frac{1}{${r}} + \\frac{1}{${r}^2} + \\cdots = \\frac{1}{1 - \\frac{1}{${r}}} = ${fracTex(r, r - 1)}`],
    };
  }
  if (kind === 2) {
    const c = randInt(1, 6);
    const g = gcd(c, 6);
    const num = c / g === 1 ? "\\pi^2" : `${c / g}\\pi^2`;
    const answerTex = 6 / g === 1 ? num : `\\frac{${num}}{${6 / g}}`;
    return {
      intro,
      code: `s = 0\nfor n in range(1, 10**6):\n    s += ${c} / n**2\nprint(s)`,
      promptTex: `\\text{valeur affichée} \\approx \\ ?`,
      answerTex,
      hint: "C'est le problème de Bâle, à une constante près.",
      solution: [`${c} \\sum_{n=1}^{+\\infty} \\frac{1}{n^2} = ${c} \\times \\frac{\\pi^2}{6} = ${answerTex}`],
    };
  }
  if (kind === 3) {
    const expo = pick(["1", "0.5"]);
    return {
      intro: "Sans l'exécuter : quand on remplace 10**6 par des nombres de plus en plus grands, vers quoi tend la valeur affichée ?",
      code: `s = 0\nfor n in range(1, 10**6):\n    s += 1 / n**${expo}\nprint(s)`,
      promptTex: `\\text{limite} = \\ ?`,
      answerTex: "+\\infty",
      hint: "Règle vue avec les intégrales : $\\sum \\frac{1}{n^p}$ converge seulement si $p > 1$.",
      solution: [
        expo === "1"
          ? "\\sum \\frac{1}{n} \\text{ est la série harmonique : elle diverge, très lentement}"
          : "\\frac{1}{\\sqrt n} \\ge \\frac{1}{n} \\text{ et } \\sum \\frac1n \\text{ diverge, donc } \\sum \\frac{1}{\\sqrt n} \\text{ diverge}",
        "\\text{Termes positifs : la somme tend vers } +\\infty",
      ],
    };
  }
  if (kind === 4) {
    return {
      intro,
      code: `s = 0\nfor n in range(1, 10**6):\n    s += 1 / (n * (n + 1))\nprint(s)`,
      promptTex: `\\text{valeur affichée} \\approx \\ ?`,
      answerTex: "1",
      hint: "$\\frac{1}{n(n+1)} = \\frac{1}{n} - \\frac{1}{n+1}$ : la somme se télescope.",
      solution: [
        "\\sum_{n=1}^{N} \\left(\\frac1n - \\frac{1}{n+1}\\right) = 1 - \\frac{1}{N+1}",
        "\\xrightarrow[N \\to +\\infty]{} 1",
      ],
    };
  }
  return {
    intro,
    code: `s = 0\nfor n in range(1, 200):\n    s += n / 2**n\nprint(s)`,
    promptTex: `\\text{valeur affichée} \\approx \\ ?`,
    answerTex: "2",
    hint: "C'est l'exemple de la leçon pour le test de d'Alembert : $\\sum \\frac{n}{2^n}$.",
    solution: [
      "\\frac{a_{n+1}}{a_n} = \\frac{n+1}{2n} \\to \\frac12 < 1 : \\text{la série converge}",
      "\\sum_{n=1}^{+\\infty} \\frac{n}{2^n} = 2",
    ],
  };
}

export const seriesGenerators: ExerciseGenerator[] = [
  { id: "serie-geometrique", make: geometricSum },
  { id: "somme-partielle-geometrique", make: partialGeometric },
  { id: "rang-epsilon-n", make: epsilonRank },
  { id: "serie-telescopique", make: telescoping },
  { id: "rapport-dalembert", make: ratioTest },
  { id: "code-serie", make: codeSeries },
];
