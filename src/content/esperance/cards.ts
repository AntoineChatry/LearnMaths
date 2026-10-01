import type { ConceptCard } from "../types";

export const esperanceCards: ConceptCard[] = [
  {
    id: "esp-definition",
    section: 1,
    front: "Espérance d'une variable discrète, et espérance d'une fonction $g(X)$ ?",
    back: "$E(X) = \\sum_x x\\, p(x)$ (si la série converge absolument). $E(g(X)) = \\sum_x g(x)\\, p(x)$, sans chercher la loi de $g(X)$. En général $E(g(X)) \\ne g(E(X))$.",
  },
  {
    id: "esp-geometrique",
    section: 1,
    front: "Nombre moyen d'essais jusqu'au premier succès, de probabilité $p$ ?",
    back: "$E(T) = 1/p$ : 6 lancers en moyenne pour obtenir un 6. Variance $(1-p)/p^2$.",
  },
  {
    id: "esp-linearite",
    section: 2,
    front: "Linéarité de l'espérance : énoncé, et hypothèse à ne pas oublier ?",
    back: "$E(X + Y) = E(X) + E(Y)$ et $E(cX) = c\\,E(X)$, sans aucune hypothèse d'indépendance (il suffit que $E(X)$ et $E(Y)$ existent). Le produit $E(XY) = E(X)E(Y)$, lui, est faux en général : l'indépendance le garantit, mais il suffit que $X$ et $Y$ soient non corrélées.",
  },
  {
    id: "esp-indicatrices",
    section: 2,
    front: "Comment calculer l'espérance d'un compte sans connaître sa loi ?",
    back: "L'écrire comme une somme d'indicatrices et utiliser $E(I_A) = P(A)$. Ex. : points fixes d'une permutation de $n$ éléments, $n \\times 1/n = 1$ en moyenne.",
  },
  {
    id: "esp-variance",
    section: 3,
    front: "Variance : définition, formule de calcul, et règles pour $cX + b$ et $X + Y$ ?",
    back: "$V(X) = E((X-\\mu)^2) = E(X^2) - \\mu^2$. $V(cX + b) = c^2 V(X)$. $V(X + Y) = V(X) + V(Y) + 2(E(XY) - E(X)E(Y))$ : les variances s'ajoutent exactement si $X$, $Y$ sont non corrélées, en particulier si elles sont indépendantes (et $V(X - Y)$ aussi).",
  },
  {
    id: "esp-moments-usuels",
    section: 3,
    front: "Espérance et variance de $\\text{Bin}(n, p)$ et de Poisson($\\lambda$) ?",
    back: "Binomiale : $np$ et $np(1-p)$. Poisson : $\\lambda$ et $\\lambda$.",
  },
  {
    id: "esp-instabilite",
    section: 3,
    front: "Pourquoi éviter de calculer une variance par « moyenne des carrés moins carré de la moyenne » en flottants ?",
    back: "Si les deux termes sont énormes et presque égaux, la soustraction perd toute la précision : sur des données proches de $10^9$, on peut obtenir une variance négative. Mieux vaut centrer d'abord (deux passes).",
  },
  {
    id: "esp-minibatch",
    section: 4,
    front: "Moyenne des pertes sur un minibatch de $B$ exemples tirés indépendamment : espérance et écart type ?",
    back: "Espérance : la perte complète $L$ (estimation sans biais). Écart type : $\\sigma/\\sqrt{B}$, donc quadrupler $B$ ne divise le bruit que par 2.",
  },
];
