import { fracTex, pick, randInt } from "../../lib/random";
import type { Exercise, ExerciseGenerator } from "../types";

const binom = (m: number, k: number) => {
  let c = 1;
  for (let i = 1; i <= k; i++) c = (c * (m - i + 1)) / i;
  return Math.round(c);
};

// Growth function of three classes on the line, on m distinct points.
function dichotomies(): Exercise {
  const m = randInt(3, 12);
  const kind = randInt(0, 2);
  if (kind === 0) {
    return {
      intro: "Les classifieurs sont les seuils $h_t(x) = \\mathbf 1[x \\ge t]$, pour $t$ réel. Combien d'étiquetages différents réalisent-ils sur $m$ points distincts de la droite ?",
      promptTex: `m = ${m} \\qquad \\Pi_H(m) = \\ ?`,
      answerTex: String(m + 1),
      hint: "Rangez les points dans l'ordre : un seuil met des 0 à gauche et des 1 à droite. Où peut tomber la coupure ?",
      solution: [
        "\\text{La coupure tombe avant le premier point,}",
        "\\text{entre deux points voisins, ou après le dernier}",
        `m + 1 = ${m + 1}`,
      ],
    };
  }
  if (kind === 1) {
    return {
      intro: "Les classifieurs sont les demi-droites dans les deux sens : $\\mathbf 1[x \\ge t]$ ou $\\mathbf 1[x \\le t]$, pour $t$ réel. Combien d'étiquetages différents réalisent-ils sur $m$ points distincts de la droite ?",
      promptTex: `m = ${m} \\qquad \\Pi_H(m) = \\ ?`,
      answerTex: String(2 * m),
      hint: "Chaque sens donne $m + 1$ étiquetages ; lesquels sont comptés deux fois ?",
      solution: [
        "\\text{Tout à 0 et tout à 1 sont réalisés dans les deux sens}",
        `2(m + 1) - 2 = 2m = ${2 * m}`,
      ],
    };
  }
  const ans = 1 + (m * (m + 1)) / 2;
  return {
    intro: "Les classifieurs sont les intervalles $\\mathbf 1[a \\le x \\le b]$. Combien d'étiquetages différents réalisent-ils sur $m$ points distincts de la droite ?",
    promptTex: `m = ${m} \\qquad \\Pi_H(m) = \\ ?`,
    answerTex: String(ans),
    hint: "Les points marqués 1 forment un bloc de points consécutifs, éventuellement vide. Un bloc non vide est fixé par son premier et son dernier point.",
    solution: [`1 + \\binom{${m}}{1} + \\binom{${m}}{2} = 1 + ${m} + ${(m * (m - 1)) / 2} = ${ans}`],
  };
}

// VC dimension of the classes of the lesson (Mohri ex. 3.11-3.15, Vershynin ex. 8.3.2-8.3.5).
function dimension(): Exercise {
  const kind = randInt(0, 3);
  if (kind === 0) {
    const n = randInt(2, 12);
    return {
      intro: `Donne la dimension VC des demi-espaces de $\\mathbb R^{${n}}$, c'est-à-dire des classifieurs linéaires $\\mathbf 1[w \\cdot x + b \\ge 0]$ avec $w \\in \\mathbb R^{${n}}$.`,
      promptTex: `H = \\{\\mathbf 1[w \\cdot x + b \\ge 0] : w \\in \\mathbb R^{${n}},\\ b \\in \\mathbb R\\} \\qquad \\mathrm{VC}(H) = \\ ?`,
      answerTex: String(n + 1),
      hint: "Dans le plan ($n = 2$), les demi-plans pulvérisent 3 points mais jamais 4.",
      solution: [`\\mathrm{VC} = n + 1 = ${n + 1}`, `\\text{autant que de paramètres : } ${n} \\text{ pour } w, \\ 1 \\text{ pour } b`],
    };
  }
  if (kind === 1) {
    const d = randInt(3, 10);
    return {
      intro: `Donne la dimension VC des polygones convexes à ${d} sommets du plan : un point est marqué 1 s'il est dans le polygone.`,
      promptTex: `H = \\{\\text{${d}-gones convexes}\\} \\qquad \\mathrm{VC}(H) = \\ ?`,
      answerTex: String(2 * d + 1),
      hint: "Placez les points sur un cercle. Si les points marqués 1 sont peu nombreux, ils servent de sommets ; sinon, les tangentes aux points marqués 0 servent de côtés.",
      solution: [`\\mathrm{VC} = 2d + 1 = 2 \\times ${d} + 1 = ${2 * d + 1}`],
    };
  }
  const [name, def, ans, sol] = pick([
    ["les seuils $\\mathbf 1[x \\ge t]$ sur la droite", "\\{\\mathbf 1[x \\ge t] : t \\in \\mathbb R\\}", 1, ["\\text{1 point : pulvérisé}", "\\text{2 points } x_1 < x_2 \\text{ : l'étiquetage } (1, 0) \\text{ est impossible}"]],
    ["les intervalles $\\mathbf 1[a \\le x \\le b]$ sur la droite", "\\{\\mathbf 1[a \\le x \\le b] : a \\le b\\}", 2, ["\\text{2 points : pulvérisés}", "\\text{3 points : l'étiquetage } (1, 0, 1) \\text{ est impossible}"]],
    ["les rectangles du plan à côtés parallèles aux axes", "\\{\\text{rectangles parallèles aux axes}\\}", 4, ["\\text{4 points en losange : pulvérisés}", "\\text{5 points : 1 aux extrêmes (gauche, droite, haut, bas)}", "\\text{et 0 au cinquième est impossible}"]],
  ] as [string, string, number, string[]][]);
  return {
    intro: `Donne la dimension VC de la classe formée par ${name}.`,
    promptTex: `H = ${def} \\qquad \\mathrm{VC}(H) = \\ ?`,
    answerTex: String(ans),
    hint: "Trouvez le plus grand nombre de points dont tous les étiquetages sont réalisés, puis un étiquetage impossible avec un point de plus.",
    solution: [...sol, `\\mathrm{VC}(H) = ${ans}`],
  };
}

// Sauer's bound sum_{i<=d} C(m, i).
function sauer(): Exercise {
  const d = randInt(1, 4);
  const m = randInt(d + 2, 15);
  const terms = Array.from({ length: d + 1 }, (_, i) => binom(m, i));
  const ans = terms.reduce((s, t) => s + t, 0);
  return {
    intro: `Une classe a pour dimension VC $d$. Quelle majoration du nombre d'étiquetages réalisés sur $m$ points donne le lemme de Sauer ? Valeur entière.`,
    promptTex: `d = ${d} \\qquad m = ${m} \\qquad \\Pi_H(m) \\le \\ ?`,
    answerTex: String(ans),
    hint: "$\\Pi_H(m) \\le \\sum_{i=0}^{d} \\binom{m}{i}$.",
    solution: [`\\sum_{i=0}^{${d}} \\binom{${m}}{i} = ${terms.join(" + ")} = ${ans}`, `\\text{contre } 2^{${m}} = ${2 ** m} \\text{ étiquetages possibles}`],
  };
}

// Main term of the VC bound, sqrt(2d ln(em/d) / m), or the sample size below which the lower bound applies.
function borne(): Exercise {
  if (Math.random() < 0.5) {
    const d = randInt(2, 20);
    const k = pick([10, 20, 50, 100, 200, 500, 1000]);
    const m = d * k;
    const ans = `\\sqrt{\\frac{2\\ln(${k}e)}{${k}}}`;
    return {
      intro: "Donne le terme principal de la borne VC, $\\sqrt{\\frac{2d \\ln(em/d)}{m}}$, pour une classe de dimension VC $d$ et $m$ exemples. Forme exacte, simplifiée par $d$.",
      promptTex: `d = ${d} \\qquad m = ${m} \\qquad \\sqrt{\\frac{2d \\ln(em/d)}{m}} = \\ ?`,
      answerTex: ans,
      hint: "Tout ne dépend que du rapport $m/d$.",
      solution: [`\\frac{m}{d} = ${k} \\qquad \\sqrt{\\frac{2d \\ln(em/d)}{m}} = \\sqrt{\\frac{2 \\ln(${k}e)}{${k}}}`],
    };
  }
  const [epsTex, inv] = pick([
    ["0{,}1", 10],
    ["0{,}05", 20],
    ["0{,}025", 40],
  ] as [string, number][]);
  const d = randInt(2, 50);
  const ans = fracTex(d * inv * inv, 320);
  return {
    intro: "Borne inférieure (Mohri, théorème 3.23) : pour une classe de dimension VC $d$ et tout algorithme, il existe une loi des données pour laquelle l'excès de risque dépasse $\\varepsilon$ avec probabilité au moins $1/64$, tant que $m$ est sous un certain seuil. Donne ce seuil.",
    promptTex: `d = ${d} \\qquad \\varepsilon = ${epsTex} \\qquad m < \\ ?`,
    answerTex: ans,
    hint: "Le théorème garantit un excès au-delà de $\\sqrt{\\frac{d}{320m}}$ ; cherchez quand cette quantité dépasse $\\varepsilon$.",
    solution: [`\\sqrt{\\frac{d}{320m}} > \\varepsilon \\iff m < \\frac{d}{320\\,\\varepsilon^2} = \\frac{${d} \\times ${inv * inv}}{320} = ${ans}`],
  };
}

export const vcDimensionGenerators: ExerciseGenerator[] = [
  { id: "vc-dichotomies", make: dichotomies },
  { id: "vc-dimension", make: dimension },
  { id: "vc-sauer", make: sauer },
  { id: "vc-borne", make: borne },
];
