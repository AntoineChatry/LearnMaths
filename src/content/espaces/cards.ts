import type { ConceptCard } from "../types";

export const espacesCards: ConceptCard[] = [
  {
    id: "independance-definition",
    section: 1,
    front: "Que veut dire « $v_1, \\dots, v_k$ sont linéairement indépendants » ?",
    back: "La seule combinaison $\\lambda_1 v_1 + \\dots + \\lambda_k v_k$ égale à 0 est celle où tous les $\\lambda_i$ sont nuls. Aucun vecteur ne s'exprime avec les autres : pas de redondance.",
  },
  {
    id: "independance-test",
    section: 1,
    front: "Comment tester si des vecteurs sont indépendants ?",
    back: "On les range en colonnes d'une matrice $A$ et on élimine : ils sont indépendants si et seulement s'il y a un pivot dans chaque colonne, c'est-à-dire si $A\\lambda = 0$ n'a que la solution $\\lambda = 0$.",
  },
  {
    id: "image-solution",
    section: 2,
    front: "Quand $Ax = b$ a-t-il une solution, en termes d'espace engendré ?",
    back: "Quand $b$ est une combinaison des colonnes de $A$, c'est-à-dire $b \\in \\text{Im}(A)$, l'espace engendré par les colonnes.",
  },
  {
    id: "base-coordonnees-uniques",
    section: 3,
    front: "Pourquoi les coordonnées d'un vecteur dans une base sont-elles uniques ?",
    back: "Si $x = \\sum \\lambda_i v_i = \\sum \\mu_i v_i$, alors $\\sum (\\lambda_i - \\mu_i) v_i = 0$, et l'indépendance donne $\\lambda_i = \\mu_i$ pour tout $i$.",
  },
  {
    id: "rang-definition",
    section: 4,
    front: "Qu'est-ce que le rang d'une matrice, et comment le lit-on ?",
    back: "Le nombre maximal de colonnes indépendantes, c'est-à-dire la dimension de l'image. C'est le nombre de pivots après élimination. Il est aussi égal au nombre maximal de lignes indépendantes : $\\text{rg}(A) = \\text{rg}(A^\\top)$.",
  },
  {
    id: "theoreme-rang",
    section: 5,
    front: "Que dit le théorème du rang pour $A$ de taille $m \\times n$ ?",
    back: "$\\dim \\ker(A) + \\text{rg}(A) = n$. Les $n$ inconnues se partagent entre celles qui ont un pivot ($\\text{rg}(A)$) et les libres, et chaque libre donne un vecteur de base du noyau.",
  },
  {
    id: "solutions-particuliere-noyau",
    section: 5,
    front: "À quoi ressemblent toutes les solutions de $Ax = b$, si on en connaît une, $x_p$ ?",
    back: "Ce sont les $x_p + z$ avec $z \\in \\ker(A)$, car $A(x - x_p) = 0$. La solution est unique si et seulement si le noyau est réduit à 0.",
  },
  {
    id: "lora-rang",
    section: 6,
    front: "Pourquoi le produit $BA$ de LoRA ($B$ de taille $d \\times r$, $A$ de taille $r \\times k$) est-il de rang au plus $r$, et qu'y gagne-t-on ?",
    back: "Chaque colonne de $BA$ est une combinaison des $r$ colonnes de $B$ : l'image est de dimension au plus $r$. On entraîne $r(d + k)$ paramètres au lieu de $dk$.",
  },
];
