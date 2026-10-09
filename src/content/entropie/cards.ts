import type { ConceptCard } from "../types";

export const entropieCards: ConceptCard[] = [
  {
    id: "en-surprise",
    section: 1,
    front: "Quantité d'information d'un événement de probabilité $p$ : formule, et pourquoi un logarithme ?",
    back: "$h = \\log_2(1/p)$ bits. On veut 0 pour un événement certain, plus pour un événement rare, et une somme pour deux événements indépendants ; or leurs probabilités se multiplient, et seul le logarithme change les produits en sommes. En nats (log naturel), on multiplie par $\\ln 2$.",
  },
  {
    id: "en-definition",
    section: 2,
    front: "Définition de l'entropie, et ses bornes pour $K$ issues possibles ?",
    back: "$H(X) = \\sum_x p(x) \\log_2 \\frac{1}{p(x)}$, la surprise moyenne. $0 \\le H \\le \\log_2 K$ : 0 si et seulement si l'issue est certaine, $\\log_2 K$ si et seulement si la loi est uniforme.",
  },
  {
    id: "en-etapes",
    section: 2,
    front: "Comment l'entropie se comporte-t-elle quand on révèle l'issue en plusieurs étapes, ou pour deux variables indépendantes ?",
    back: "Elle s'additionne : entropie du premier choix, plus l'entropie du second pondérée par la probabilité qu'il ait lieu. Exemple de Shannon : $H(\\tfrac12, \\tfrac13, \\tfrac16) = H(\\tfrac12, \\tfrac12) + \\tfrac12 H(\\tfrac23, \\tfrac13)$. Pour $X$ et $Y$ indépendantes, $H(X, Y) = H(X) + H(Y)$.",
  },
  {
    id: "en-codage",
    section: 3,
    front: "Que dit le théorème du codage de source sur la longueur moyenne $L$ d'un code ?",
    back: "Tout code décodable vérifie $L \\ge H$, avec égalité seulement si $l_i = \\log_2(1/p_i)$. Avec des longueurs entières $l_i = \\lceil \\log_2(1/p_i) \\rceil$, l'inégalité de Kraft $\\sum 2^{-l_i} \\le 1$ reste vraie et $H \\le L < H + 1$.",
  },
  {
    id: "en-huffman",
    section: 3,
    front: "Comment l'algorithme de Huffman construit-il un code optimal ?",
    back: "On fusionne les deux symboles les moins probables (ils auront les deux mots les plus longs, qui ne diffèrent que par le dernier bit), puis on recommence avec le symbole fusionné. Chaque fusion ajoute un bit aux mots des symboles fusionnés.",
  },
  {
    id: "en-maximum",
    section: 4,
    front: "Pourquoi la loi uniforme maximise-t-elle l'entropie, et que fait la température d'un softmax à l'entropie ?",
    back: "Lagrange : annuler la dérivée de $-\\sum p_i \\ln p_i + \\lambda(\\sum p_i - 1)$ donne $\\ln p_i = \\lambda - 1$, la même valeur pour tous, donc $p_i = 1/K$. Quand $T \\to 0$, le softmax devient un argmax et $H \\to 0$ ; quand $T$ grandit, il tend vers l'uniforme et $H \\to \\log_2 K$.",
  },
];
