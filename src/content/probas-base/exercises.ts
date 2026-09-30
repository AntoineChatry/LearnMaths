import { fracTex, pick, randInt } from "../../lib/random";
import type { Exercise, ExerciseGenerator } from "../types";

function comb(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return Math.round(r);
}

const fact = (n: number): number => (n <= 1 ? 1 : n * fact(n - 1));
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

// Two dice, or k dice: sum, maximum, at least one six.
function dice(): Exercise {
  const kind = randInt(0, 2);
  if (kind === 0) {
    const s = randInt(2, 12);
    const n = 6 - Math.abs(s - 7);
    return {
      intro: "On lance deux dés équilibrés. Donne la probabilité que la somme vaille $s$.",
      promptTex: `s = ${s}`,
      answerTex: fracTex(n, 36),
      hint: "Distingue les deux dés : il y a 36 couples $(a, b)$ également probables. Compte ceux dont la somme vaut $s$.",
      solution: [`\\text{couples de somme } ${s} : ${n}`, `P = \\frac{${n}}{36} = ${fracTex(n, 36)}`],
    };
  }
  if (kind === 1) {
    const m = randInt(1, 6);
    return {
      intro: "On lance deux dés équilibrés. Donne la probabilité que le plus grand des deux résultats vaille $m$.",
      promptTex: `m = ${m}`,
      answerTex: fracTex(2 * m - 1, 36),
      hint: "« max $\\le m$ » contient $m^2$ couples. « max $= m$ », c'est « max $\\le m$ » sans « max $\\le m - 1$ ».",
      solution: [`|\\{\\max = ${m}\\}| = ${m}^2 - ${m - 1}^2 = ${2 * m - 1}`, `P = ${fracTex(2 * m - 1, 36)}`],
    };
  }
  const k = randInt(2, 4);
  return {
    intro: "On lance $k$ dés équilibrés. Donne la probabilité d'obtenir au moins un 6.",
    promptTex: `k = ${k}`,
    answerTex: fracTex(6 ** k - 5 ** k, 6 ** k),
    hint: "Passe au complémentaire : « aucun 6 ». Chaque dé a alors 5 faces possibles sur 6.",
    solution: [`P(\\text{aucun } 6) = \\frac{5^${k}}{6^${k}} = \\frac{${5 ** k}}{${6 ** k}}`, `P(\\text{au moins un } 6) = 1 - \\frac{${5 ** k}}{${6 ** k}} = ${fracTex(6 ** k - 5 ** k, 6 ** k)}`],
  };
}

const WORDS = ["ANANAS", "PAPA", "BANANE", "ELLE", "RADAR", "ASSASSIN", "MAMAN", "COCO", "KAYAK", "ALPAGA"];

// Counting: with / without replacement, subsets, anagrams.
function counting(): Exercise {
  const kind = randInt(0, 3);
  if (kind === 0) {
    const n = pick([10, 26, 36]);
    const k = randInt(3, 5);
    const what = n === 10 ? "chiffres" : n === 26 ? "lettres minuscules" : "caractères (26 lettres minuscules et 10 chiffres)";
    return {
      intro: `Combien de codes de longueur $k$ peut-on former avec des ${what}, les répétitions étant permises ?`,
      promptTex: `n = ${n} \\qquad k = ${k}`,
      answerTex: String(n ** k),
      hint: "Chaque position a $n$ choix, quel que soit le reste : principe multiplicatif, avec remise.",
      solution: [`n^k = ${n}^${k} = ${n ** k}`],
    };
  }
  if (kind === 1) {
    const n = randInt(5, 12);
    const k = randInt(2, 4);
    let a = 1;
    for (let i = 0; i < k; i++) a *= n - i;
    return {
      intro: "Une course a $n$ participants, sans ex æquo. De combien de façons les $k$ premières places peuvent-elles être attribuées (qui est 1er, qui est 2e, etc.) ?",
      promptTex: `n = ${n} \\qquad k = ${k}`,
      answerTex: String(a),
      hint: "L'ordre compte et un coureur ne peut occuper qu'une place : tirage sans remise.",
      solution: [`${Array.from({ length: k }, (_, i) => n - i).join(" \\times ")} = ${a}`],
    };
  }
  if (kind === 2) {
    const n = randInt(5, 15);
    const k = randInt(2, Math.min(5, n - 1));
    return {
      intro: `Combien de comités de $k$ personnes peut-on former dans un groupe de $n$ ?`,
      promptTex: `n = ${n} \\qquad k = ${k}`,
      answerTex: String(comb(n, k)),
      hint: "L'ordre ne compte pas : c'est $\\binom{n}{k}$, le nombre de suites sans remise divisé par $k!$.",
      solution: [`\\binom{${n}}{${k}} = \\frac{${Array.from({ length: k }, (_, i) => n - i).join(" \\times ")}}{${k}!} = ${comb(n, k)}`],
    };
  }
  const w = pick(WORDS);
  const counts = new Map<string, number>();
  for (const c of w) counts.set(c, (counts.get(c) ?? 0) + 1);
  const reps = [...counts.values()].filter((c) => c > 1);
  const total = fact(w.length) / reps.reduce((acc, c) => acc * fact(c), 1);
  return {
    intro: "Combien de mots différents (anagrammes, ayant un sens ou non) peut-on écrire avec toutes les lettres de ce mot ?",
    promptTex: `\\text{${w}}`,
    answerTex: String(total),
    hint: "Numérote les lettres répétées pour les rendre distinctes : $n!$ ordres. Chaque mot a alors été compté une fois par façon de permuter les lettres identiques entre elles.",
    solution: [`\\frac{${w.length}!}{${reps.map((c) => `${c}!`).join(" \\, ")}} = ${total}`],
  };
}

// Probability of at least one coincidence among k draws from N equally likely values.
function birthday(): Exercise {
  const [N, what] = pick([
    [6, "On lance $k$ dés équilibrés. Donne la probabilité qu'au moins deux dés montrent la même face."],
    [12, "$k$ personnes sont nées des mois équiprobables et indépendants. Donne la probabilité qu'au moins deux soient nées le même mois."],
    [10, "$k$ personnes choisissent chacune un chiffre au hasard (de 0 à 9), indépendamment. Donne la probabilité qu'au moins deux aient choisi le même."],
  ] as [number, string][]);
  const k = randInt(2, 4);
  let no = 1;
  for (let i = 0; i < k; i++) no *= N - i;
  const all = N ** k;
  return {
    intro: what,
    promptTex: `k = ${k}`,
    answerTex: fracTex(all - no, all),
    hint: "Passe au complémentaire : aucune coïncidence, c'est un tirage sans remise parmi un total de $N^k$ tirages avec remise.",
    solution: [
      `P(\\text{aucune}) = \\frac{${Array.from({ length: k }, (_, i) => N - i).join(" \\times ")}}{${N}^${k}} = \\frac{${no}}{${all}}`,
      `P(\\text{au moins une}) = 1 - \\frac{${no}}{${all}} = ${fracTex(all - no, all)}`,
    ],
  };
}

// Union, complement, difference from P(A), P(B), P(A ∩ B).
function unionRules(): Exercise {
  const d = pick([10, 12, 20]);
  for (;;) {
    const a = randInt(1, d - 1);
    const b = randInt(1, d - 1);
    const c = randInt(0, Math.min(a, b));
    if (a + b - c > d) continue;
    const given = `P(A) = ${fracTex(a, d)} \\qquad P(B) = ${fracTex(b, d)} \\qquad P(A \\cap B) = ${fracTex(c, d)}`;
    const kind = randInt(0, 2);
    if (kind === 0)
      return {
        intro: "Donne $P(A \\cup B)$.",
        promptTex: given,
        answerTex: fracTex(a + b - c, d),
        hint: "$P(A) + P(B)$ compte deux fois $A \\cap B$.",
        solution: [`P(A \\cup B) = P(A) + P(B) - P(A \\cap B) = \\frac{${a} + ${b} - ${c}}{${d}} = ${fracTex(a + b - c, d)}`],
      };
    if (kind === 1)
      return {
        intro: "Donne la probabilité que ni $A$ ni $B$ ne se réalise.",
        promptTex: given,
        answerTex: fracTex(d - (a + b - c), d),
        hint: "« Ni $A$ ni $B$ » est le complémentaire de $A \\cup B$.",
        solution: [`P(A \\cup B) = ${fracTex(a + b - c, d)}`, `P(A^c \\cap B^c) = 1 - P(A \\cup B) = ${fracTex(d - (a + b - c), d)}`],
      };
    return {
      intro: "Donne la probabilité que $A$ se réalise mais pas $B$.",
      promptTex: given,
      answerTex: fracTex(a - c, d),
      hint: "$A$ est la réunion disjointe de $A \\cap B$ et de $A \\cap B^c$.",
      solution: [`P(A \\cap B^c) = P(A) - P(A \\cap B) = ${fracTex(a - c, d)}`],
    };
  }
}

// Random integer in 1..N divisible by p or q (or r): inclusion-exclusion.
function divisible(): Exercise {
  const N = pick([60, 100, 120, 200, 360]);
  const three = Math.random() < 0.35;
  const divs = three ? pick([[2, 3, 5], [2, 3, 7], [3, 5, 7]]) : pick([[2, 3], [2, 5], [3, 5], [2, 7], [3, 4], [4, 6], [6, 10]]);
  const lcm = (a: number, b: number) => (a * b) / gcd(a, b);
  const f = (m: number) => Math.floor(N / m);
  let count: number;
  let steps: string;
  if (!three) {
    const [p, q] = divs;
    const l = lcm(p, q);
    count = f(p) + f(q) - f(l);
    steps = `${f(p)} + ${f(q)} - ${f(l)} = ${count} \\quad (\\text{multiples de } ${p}, ${q}, ${l})`;
  } else {
    const [p, q, r] = divs;
    count = f(p) + f(q) + f(r) - f(lcm(p, q)) - f(lcm(p, r)) - f(lcm(q, r)) + f(lcm(lcm(p, q), r));
    steps = `${f(p)} + ${f(q)} + ${f(r)} - ${f(lcm(p, q))} - ${f(lcm(p, r))} - ${f(lcm(q, r))} + ${f(lcm(lcm(p, q), r))} = ${count}`;
  }
  return {
    intro: `On tire un entier au hasard, uniformément, entre 1 et $N$. Donne la probabilité qu'il soit divisible par ${divs
      .slice(0, -1)
      .map((x) => `$${x}$`)
      .join(", ")} ou $${divs[divs.length - 1]}$.`,
    promptTex: `N = ${N}`,
    answerTex: fracTex(count, N),
    hint: "Inclusion-exclusion : un nombre divisible par $a$ et par $b$ est divisible par leur ppcm. Entre 1 et $N$, il y a $\\lfloor N/m \\rfloor$ multiples de $m$.",
    solution: [steps, `P = ${fracTex(count, N)}`],
  };
}

// Cards drawn without order from a 52-card deck.
function cards(): Exercise {
  const k = randInt(2, 5);
  const total = comb(52, k);
  const kind = randInt(0, 2);
  if (kind === 0)
    return {
      intro: "On tire $k$ cartes d'un jeu de 52 bien mélangé. Donne la probabilité qu'elles soient toutes des cœurs.",
      promptTex: `k = ${k}`,
      answerTex: fracTex(comb(13, k), total),
      hint: "Toutes les mains de $k$ cartes sont également probables : $\\binom{52}{k}$ mains, dont $\\binom{13}{k}$ de cœurs.",
      solution: [`\\frac{\\binom{13}{${k}}}{\\binom{52}{${k}}} = \\frac{${comb(13, k)}}{${total}} = ${fracTex(comb(13, k), total)}`],
    };
  if (kind === 1)
    return {
      intro: "On tire $k$ cartes d'un jeu de 52 bien mélangé. Donne la probabilité d'avoir au moins un as.",
      promptTex: `k = ${k}`,
      answerTex: fracTex(total - comb(48, k), total),
      hint: "Complémentaire : aucune carte parmi les 4 as, donc les $k$ cartes sont parmi les 48 autres.",
      solution: [`1 - \\frac{\\binom{48}{${k}}}{\\binom{52}{${k}}} = 1 - \\frac{${comb(48, k)}}{${total}} = ${fracTex(total - comb(48, k), total)}`],
    };
  const fav = 4 * comb(48, k - 1);
  return {
    intro: "On tire $k$ cartes d'un jeu de 52 bien mélangé. Donne la probabilité d'avoir exactement un as.",
    promptTex: `k = ${k}`,
    answerTex: fracTex(fav, total),
    hint: "Choisis l'as (4 façons), puis les $k - 1$ autres cartes parmi les 48 qui ne sont pas des as.",
    solution: [`\\frac{4 \\binom{48}{${k - 1}}}{\\binom{52}{${k}}} = \\frac{${fav}}{${total}} = ${fracTex(fav, total)}`],
  };
}

// de Montmort: at least one card at its own position among n shuffled cards.
function matching(): Exercise {
  const n = randInt(3, 6);
  // P(win) = sum_{j=1}^{n} (-1)^{j+1} / j!, on the common denominator n!.
  let num = 0;
  for (let j = 1; j <= n; j++) num += ((j % 2 === 1 ? 1 : -1) * fact(n)) / fact(j);
  const terms = Array.from({ length: n }, (_, i) => `${i % 2 === 0 ? (i === 0 ? "" : "+") : "-"} \\frac{1}{${i + 1}!}`).join(" ");
  if (Math.random() < 0.5)
    return {
      intro: "On mélange $n$ cartes numérotées de 1 à $n$. Donne la probabilité qu'au moins une carte soit à la position de son numéro.",
      promptTex: `n = ${n}`,
      answerTex: fracTex(num, fact(n)),
      hint: "Inclusion-exclusion sur les événements $A_i$ = « la carte $i$ est en position $i$ » : $P(A_{i_1} \\cap \\cdots \\cap A_{i_j}) = (n - j)!/n!$.",
      solution: [`P = ${terms}`, `= ${fracTex(num, fact(n))}`],
    };
  return {
    intro: "On mélange $n$ cartes numérotées de 1 à $n$. Combien d'ordres ne placent aucune carte à la position de son numéro ?",
    promptTex: `n = ${n}`,
    answerTex: String(fact(n) - num),
    hint: "Compte d'abord les ordres avec au moins une carte à sa place, par inclusion-exclusion, puis retire-les des $n!$ ordres.",
    solution: [`n! \\left(1 - \\left(${terms}\\right)\\right) = ${fact(n)} - ${num} = ${fact(n) - num}`],
  };
}

export const probasBaseGenerators: ExerciseGenerator[] = [
  { id: "des", make: dice },
  { id: "denombrement", make: counting },
  { id: "anniversaires-petits", make: birthday },
  { id: "union-complementaire", make: unionRules },
  { id: "inclusion-exclusion-divisibilite", make: divisible },
  { id: "cartes", make: cards },
  { id: "rencontres", make: matching },
];
