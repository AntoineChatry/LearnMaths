import { fracTex, pick, randInt } from "../../lib/random";
import type { Exercise, ExerciseGenerator } from "../types";

// Two dice: a conditional probability computed by restricting to the outcomes of the condition.
function diceGiven(): Exercise {
  const pairs: [number, number][] = [];
  for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) pairs.push([a, b]);
  const kind = randInt(0, 2);
  let intro: string;
  let prompt: string;
  let cond: (p: [number, number]) => boolean;
  let event: (p: [number, number]) => boolean;
  if (kind === 0) {
    const s = randInt(7, 11);
    intro = "On lance deux dés équilibrés. Sachant que la somme vaut au moins $s$, quelle est la probabilité qu'au moins un dé montre 6 ?";
    prompt = `s = ${s}`;
    cond = ([a, b]) => a + b >= s;
    event = ([a, b]) => a === 6 || b === 6;
  } else if (kind === 1) {
    const s = randInt(3, 11);
    intro = "On lance deux dés équilibrés. Sachant qu'au moins un dé montre 6, quelle est la probabilité que la somme vaille au moins $s$ ?";
    prompt = `s = ${s}`;
    cond = ([a, b]) => a === 6 || b === 6;
    event = ([a, b]) => a + b >= s;
  } else {
    const s = randInt(4, 10);
    intro = "On lance deux dés équilibrés. Sachant que la somme vaut $s$, quelle est la probabilité que les deux dés montrent la même valeur ?";
    prompt = `s = ${s}`;
    cond = ([a, b]) => a + b === s;
    event = ([a, b]) => a === b;
  }
  const inB = pairs.filter(cond);
  const inAB = inB.filter(event);
  return {
    intro,
    promptTex: prompt,
    answerTex: fracTex(inAB.length, inB.length),
    hint: "Garde seulement les couples $(a, b)$ qui réalisent la condition : ils restent équiprobables. Compte ceux qui réalisent aussi l'événement.",
    solution: [`|B| = ${inB.length}, \\quad |A \\cap B| = ${inAB.length}`, `P(A \\mid B) = \\frac{${inAB.length}}{${inB.length}} = ${fracTex(inAB.length, inB.length)}`],
  };
}

const CATEGORIES = [
  { name: "un cœur", count: 13 },
  { name: "un as", count: 4 },
  { name: "rouge", count: 26 },
  { name: "une figure (valet, dame ou roi)", count: 12 },
];

// Second card given the first one, without replacement.
function cardsGiven(): Exercise {
  const kind = randInt(0, 2);
  if (kind === 0) {
    const c = pick(CATEGORIES);
    return {
      intro: `On tire deux cartes sans remise dans un jeu de 52. Sachant que la première est ${c.name}, quelle est la probabilité que la seconde soit aussi ${c.name} ?`,
      promptTex: `\\text{catégorie : ${c.count} cartes sur 52}`,
      answerTex: fracTex(c.count - 1, 51),
      hint: "Une fois la première carte tirée, il reste 51 cartes également probables. Combien sont encore dans la catégorie ?",
      solution: [`P = \\frac{${c.count} - 1}{51} = ${fracTex(c.count - 1, 51)}`],
    };
  }
  if (kind === 1) {
    const n = randInt(2, 4);
    let num = 1;
    let den = 1;
    const factors: string[] = [];
    for (let i = 0; i < n; i++) {
      num *= 4 - i;
      den *= 52 - i;
      factors.push(`\\frac{${4 - i}}{${52 - i}}`);
    }
    return {
      intro: "On tire des cartes une à une, sans remise, dans un jeu de 52. Quelle est la probabilité que les $n$ premières soient toutes des as ?",
      promptTex: `n = ${n}`,
      answerTex: fracTex(num, den),
      hint: "Règle de chaînage : $P(A_1)\\,P(A_2 \\mid A_1)\\,P(A_3 \\mid A_1, A_2) \\cdots$",
      solution: [`${factors.join(" \\times ")} = ${fracTex(num, den)}`],
    };
  }
  // B&H example 2.2.2 pattern: first card is a heart, second is red; P(first heart | second red).
  const firstHeart = Math.random() < 0.5;
  return firstHeart
    ? {
        intro: "On tire deux cartes sans remise dans un jeu de 52. Sachant que la seconde est rouge, quelle est la probabilité que la première soit un cœur ?",
        promptTex: "P(\\text{1re cœur} \\mid \\text{2e rouge})",
        answerTex: fracTex(25, 102),
        hint: "$P(\\text{1re cœur et 2e rouge}) = \\frac{13 \\times 25}{52 \\times 51}$, et par symétrie la seconde carte est rouge avec probabilité $1/2$.",
        solution: ["P(A \\cap B) = \\frac{13 \\times 25}{52 \\times 51} = \\frac{25}{204}", "P(A \\mid B) = \\frac{25/204}{1/2} = \\frac{25}{102}"],
      }
    : {
        intro: "On tire deux cartes sans remise dans un jeu de 52. Sachant que la seconde est un as, quelle est la probabilité que la première soit aussi un as ?",
        promptTex: "P(\\text{1re as} \\mid \\text{2e as})",
        answerTex: fracTex(3, 51),
        hint: "$P(\\text{deux as}) = \\frac{4 \\times 3}{52 \\times 51}$, et par symétrie la seconde carte est un as avec probabilité $4/52$.",
        solution: ["P(A \\cap B) = \\frac{4 \\times 3}{52 \\times 51}", "P(A \\mid B) = \\frac{12/2652}{4/52} = \\frac{3}{51} = \\frac{1}{17}"],
      };
}

// Diagnostic test: posterior of disease given a positive or negative result.
function diseaseTest(): Exercise {
  const prevDen = pick([10, 20, 50, 100, 1000]);
  const sens = pick([80, 90, 95, 98, 99]);
  const spec = pick([80, 90, 95, 98, 99]);
  const positive = Math.random() < 0.7;
  // Work on the common denominator prevDen × 100.
  const sick = 1;
  const healthy = prevDen - 1;
  const num = positive ? sick * sens : sick * (100 - sens);
  const other = positive ? healthy * (100 - spec) : healthy * spec;
  return {
    intro: `Une maladie touche une personne sur ${prevDen}. Le test détecte ${sens} % des malades (sensibilité) et donne un résultat négatif pour ${spec} % des personnes saines (spécificité). Une personne a un test ${positive ? "positif" : "négatif"} : quelle est la probabilité qu'elle soit malade ?`,
    promptTex: `P(M) = \\frac{1}{${prevDen}} \\qquad P(+ \\mid M) = ${sens / 100} \\qquad P(- \\mid M^c) = ${spec / 100}`.replace(/(\d)\.(\d)/g, "$1{,}$2"),
    answerTex: fracTex(num, num + other),
    hint: `Bayes, avec les probabilités totales au dénominateur : $P(M \\mid ${positive ? "+" : "-"}) = \\frac{P(${positive ? "+" : "-"} \\mid M) P(M)}{P(${positive ? "+" : "-"} \\mid M) P(M) + P(${positive ? "+" : "-"} \\mid M^c) P(M^c)}$.`,
    solution: [
      `P(M \\mid ${positive ? "+" : "-"}) = \\frac{${num / 100} \\times \\frac{1}{${prevDen}}}{${num / 100} \\times \\frac{1}{${prevDen}} + ${(positive ? 100 - spec : spec) / 100} \\times \\frac{${healthy}}{${prevDen}}}`.replace(/(\d)\.(\d)/g, "$1{,}$2"),
      `= \\frac{${num}}{${num} + ${other}} = ${fracTex(num, num + other)}`,
    ],
  };
}

// Two urns chosen with given probabilities: total probability of red, or Bayes back to the urn.
function urns(): Exercise {
  const p1 = pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4]]);
  const r1 = randInt(1, 5);
  const b1 = randInt(1, 5);
  const r2 = randInt(1, 5);
  const b2 = randInt(1, 5);
  const [a, d] = p1;
  const n1 = r1 + b1;
  const n2 = r2 + b2;
  // P(red) = a/d * r1/n1 + (d-a)/d * r2/n2 = (a r1 n2 + (d-a) r2 n1) / (d n1 n2)
  const redNum = a * r1 * n2 + (d - a) * r2 * n1;
  const redDen = d * n1 * n2;
  const given = `P(U_1) = ${fracTex(a, d)} \\qquad U_1 : ${r1}\\text{ R}, ${b1}\\text{ B} \\qquad U_2 : ${r2}\\text{ R}, ${b2}\\text{ B}`;
  if (Math.random() < 0.5)
    return {
      intro: "On choisit l'urne $U_1$ avec la probabilité donnée, sinon l'urne $U_2$, puis on y tire une boule au hasard (R : rouge, B : bleue). Quelle est la probabilité de tirer une boule rouge ?",
      promptTex: given,
      answerTex: fracTex(redNum, redDen),
      hint: "Probabilités totales : $P(R) = P(R \\mid U_1) P(U_1) + P(R \\mid U_2) P(U_2)$.",
      solution: [`P(R) = \\frac{${r1}}{${n1}} \\times ${fracTex(a, d)} + \\frac{${r2}}{${n2}} \\times ${fracTex(d - a, d)} = ${fracTex(redNum, redDen)}`],
    };
  const num = a * r1 * n2;
  return {
    intro: "On choisit l'urne $U_1$ avec la probabilité donnée, sinon l'urne $U_2$, puis on y tire une boule au hasard (R : rouge, B : bleue). La boule est rouge : quelle est la probabilité qu'elle vienne de $U_1$ ?",
    promptTex: given,
    answerTex: fracTex(num, redNum),
    hint: "Bayes : $P(U_1 \\mid R) = \\frac{P(R \\mid U_1) P(U_1)}{P(R)}$, avec $P(R)$ par les probabilités totales.",
    solution: [
      `P(R \\mid U_1) P(U_1) = \\frac{${r1}}{${n1}} \\times ${fracTex(a, d)} = ${fracTex(a * r1, d * n1)}`,
      `P(R) = ${fracTex(redNum, redDen)} \\quad\\Longrightarrow\\quad P(U_1 \\mid R) = ${fracTex(num, redNum)}`,
    ],
  };
}

// A fair coin or a biased one, picked at random; n heads observed.
function coins(): Exercise {
  const [bn, bd] = pick([[3, 4], [2, 3], [4, 5], [3, 5]]);
  const n = randInt(1, 4);
  // P(n heads | fair) = 1/2^n, P(n heads | biased) = bn^n / bd^n; common denominator 2^n bd^n.
  const fair = bd ** n;
  const biased = bn ** n * 2 ** n;
  const given = `\\text{biais : } P(\\text{pile}) = ${fracTex(bn, bd)} \\qquad ${n} \\text{ pile${n > 1 ? "s" : ""} de suite}`;
  if (Math.random() < 0.5)
    return {
      intro: "On choisit au hasard (une chance sur deux) une pièce équilibrée ou une pièce biaisée, puis on la lance. Elle donne pile à chaque lancer. Quelle est la probabilité qu'elle soit équilibrée ?",
      promptTex: given,
      answerTex: fracTex(fair, fair + biased),
      hint: "Bayes : les priors valent $1/2$ et se simplifient. Compare $(1/2)^n$ à $p^n$.",
      solution: [`P(E \\mid \\text{piles}) = \\frac{(1/2)^${n}}{(1/2)^${n} + (${fracTex(bn, bd)})^${n}} = ${fracTex(fair, fair + biased)}`],
    };
  // P(next head | data) = 1/2 * P(E|data) + p * P(B|data)
  const num = fair * bd + 2 * bn * biased;
  const den = 2 * bd * (fair + biased);
  return {
    intro: "On choisit au hasard (une chance sur deux) une pièce équilibrée ou une pièce biaisée, puis on la lance. Elle donne pile à chaque lancer. Quelle est la probabilité que le lancer suivant donne encore pile ?",
    promptTex: given,
    answerTex: fracTex(num, den),
    hint: "Calcule d'abord $P(E \\mid \\text{piles})$ par Bayes, puis les probabilités totales avec ces probabilités a posteriori.",
    solution: [
      `P(E \\mid \\text{piles}) = ${fracTex(fair, fair + biased)}`,
      `P(\\text{pile}) = \\frac{1}{2} \\times ${fracTex(fair, fair + biased)} + ${fracTex(bn, bd)} \\times ${fracTex(biased, fair + biased)} = ${fracTex(num, den)}`,
    ],
  };
}

// Independence: product rule for independent events.
function independence(): Exercise {
  const d = pick([4, 5, 6, 10]);
  const a = randInt(1, d - 1);
  const b = randInt(1, d - 1);
  const given = `P(A) = ${fracTex(a, d)} \\qquad P(B) = ${fracTex(b, d)} \\qquad A \\text{ et } B \\text{ indépendants}`;
  const kind = randInt(0, 2);
  if (kind === 0)
    return {
      intro: "Donne $P(A \\cup B)$.",
      promptTex: given,
      answerTex: fracTex(a * d + b * d - a * b, d * d),
      hint: "Par indépendance, $P(A \\cap B) = P(A) P(B)$.",
      solution: [`P(A \\cup B) = ${fracTex(a, d)} + ${fracTex(b, d)} - ${fracTex(a, d)} \\times ${fracTex(b, d)} = ${fracTex(a * d + b * d - a * b, d * d)}`],
    };
  if (kind === 1)
    return {
      intro: "Donne la probabilité que ni $A$ ni $B$ ne se réalise.",
      promptTex: given,
      answerTex: fracTex((d - a) * (d - b), d * d),
      hint: "Si $A$ et $B$ sont indépendants, $A^c$ et $B^c$ le sont aussi.",
      solution: [`P(A^c \\cap B^c) = \\left(1 - ${fracTex(a, d)}\\right)\\left(1 - ${fracTex(b, d)}\\right) = ${fracTex((d - a) * (d - b), d * d)}`],
    };
  return {
    intro: "Donne la probabilité qu'exactement un des deux événements se réalise.",
    promptTex: given,
    answerTex: fracTex(a * (d - b) + (d - a) * b, d * d),
    hint: "« Exactement un », c'est $(A \\cap B^c) \\cup (A^c \\cap B)$, deux événements disjoints.",
    solution: [`${fracTex(a, d)} \\times ${fracTex(d - b, d)} + ${fracTex(d - a, d)} \\times ${fracTex(b, d)} = ${fracTex(a * (d - b) + (d - a) * b, d * d)}`],
  };
}

// Chain rule on an urn without replacement: first red ball at draw j.
function firstRed(): Exercise {
  const r = randInt(1, 4);
  const b = randInt(2, 5);
  const j = randInt(1, Math.min(b + 1, 4));
  let num = 1;
  let den = 1;
  const factors: string[] = [];
  for (let i = 0; i < j - 1; i++) {
    num *= b - i;
    den *= r + b - i;
    factors.push(`\\frac{${b - i}}{${r + b - i}}`);
  }
  num *= r;
  den *= r + b - (j - 1);
  factors.push(`\\frac{${r}}{${r + b - (j - 1)}}`);
  return {
    intro: "Une urne contient $r$ boules rouges et $b$ bleues. On tire les boules une à une, sans remise. Quelle est la probabilité que la première rouge sorte au tirage numéro $j$ ?",
    promptTex: `r = ${r} \\qquad b = ${b} \\qquad j = ${j}`,
    answerTex: fracTex(num, den),
    hint: "Les $j - 1$ premières sont bleues, puis une rouge : règle de chaînage, en retirant chaque boule tirée.",
    solution: [`${factors.join(" \\times ")} = ${fracTex(num, den)}`],
  };
}

export const conditionnellesGenerators: ExerciseGenerator[] = [
  { id: "des-conditionnels", make: diceGiven },
  { id: "cartes-conditionnelles", make: cardsGiven },
  { id: "test-diagnostique", make: diseaseTest },
  { id: "urnes-bayes", make: urns },
  { id: "piece-biaisee", make: coins },
  { id: "independance", make: independence },
  { id: "premiere-rouge", make: firstRed },
];
