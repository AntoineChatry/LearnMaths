import type { ConceptCard } from "../types";

export const determinantCards: ConceptCard[] = [
  {
    id: "det-aire",
    section: 1,
    front: "Que mesure $\\det(A)$ géométriquement, et que dit son signe ?",
    back: "Le facteur par lequel $A$ multiplie les aires (les volumes en dimension $n$) : c'est l'aire signée de l'image du carré unité, le parallélogramme construit sur les colonnes. Le signe est négatif quand $A$ retourne l'orientation, comme un miroir.",
  },
  {
    id: "det-2x2",
    section: 1,
    front: "Formule du déterminant $2 \\times 2$ ?",
    back: "$\\det \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc$.",
  },
  {
    id: "det-operations-lignes",
    section: 2,
    front: "Effet des trois opérations sur les lignes sur le déterminant ?",
    back: "Échanger deux lignes change le signe. Multiplier une ligne par $\\lambda$ multiplie le déterminant par $\\lambda$. Ajouter un multiple d'une ligne à une autre ne change rien.",
  },
  {
    id: "det-produit",
    section: 2,
    front: "Que valent $\\det(AB)$, $\\det(A^\\top)$ et $\\det(\\lambda A)$ pour $A$ de taille $n \\times n$ ?",
    back: "$\\det(A)\\det(B)$ (les facteurs d'aire se multiplient), $\\det(A)$, et $\\lambda^n \\det(A)$ (chacune des $n$ lignes est multipliée par $\\lambda$).",
  },
  {
    id: "det-pivots",
    section: 3,
    front: "Comment calcule-t-on un déterminant en pratique, et pourquoi $\\det(A) \\neq 0 \\iff A$ inversible ?",
    back: "Par élimination : $\\det(A) = \\pm$ produit des pivots (un signe moins par échange), en environ $n^3$ opérations. Il est non nul exactement quand il y a $n$ pivots, c'est-à-dire $\\text{rg}(A) = n$.",
  },
  {
    id: "inverse-2x2",
    section: 4,
    front: "Inverse d'une matrice $2 \\times 2$ ?",
    back: "$\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}^{-1} = \\frac{1}{ad - bc} \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$, si $ad - bc \\neq 0$.",
  },
  {
    id: "inverse-produit",
    section: 4,
    front: "Que valent $(AB)^{-1}$ et $\\det(A^{-1})$ ?",
    back: "$(AB)^{-1} = B^{-1}A^{-1}$ (pour défaire « $B$ puis $A$ », on défait $A$ d'abord), et $\\det(A^{-1}) = 1 / \\det(A)$.",
  },
  {
    id: "det-flows",
    section: 5,
    front: "Pourquoi un petit déterminant ne signifie-t-il pas « presque non inversible », et où sert le déterminant dans les normalizing flows ?",
    back: "Il dépend de l'échelle : $\\det(0{,}1\\,I_{50}) = 10^{-50}$ alors que cette matrice s'inverse parfaitement. Dans un flow, $p_X(x) = p_Z(f(x))\\,|\\det J_f(x)|$ : le déterminant de la jacobienne corrige la dilatation des volumes ; Real NVP la rend triangulaire pour que ce soit un simple produit.",
  },
];
