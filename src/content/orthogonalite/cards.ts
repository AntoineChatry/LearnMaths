import type { ConceptCard } from "../types";

export const orthogonaliteCards: ConceptCard[] = [
  {
    id: "bon-coordonnees",
    section: 1,
    front: "Dans une base orthonormée $(q_1, \\dots, q_n)$, comment obtient-on les coordonnées de $x$ ?",
    back: "Par produit scalaire : $\\lambda_i = q_i \\cdot x$. Pas de système à résoudre, car tous les autres termes de $q_i \\cdot \\sum_j \\lambda_j q_j$ s'annulent.",
  },
  {
    id: "matrice-orthogonale",
    section: 1,
    front: "Qu'est-ce qu'une matrice orthogonale $Q$, et quelles sont ses propriétés ?",
    back: "Ses colonnes forment une base orthonormée : $Q^\\top Q = I$, donc $Q^{-1} = Q^\\top$. Elle conserve les longueurs et les angles ($\\|Qx\\| = \\|x\\|$), et $\\det Q = \\pm 1$.",
  },
  {
    id: "equation-normale",
    section: 2,
    front: "D'où vient l'équation normale $B^\\top B\\,\\lambda = B^\\top x$ ?",
    back: "La projection $p = B\\lambda$ de $x$ sur l'image de $B$ est caractérisée par : l'erreur $x - p$ est orthogonale à chaque colonne de $B$, c'est-à-dire $B^\\top(x - B\\lambda) = 0$.",
  },
  {
    id: "projection-plus-proche",
    section: 2,
    front: "Pourquoi la projection orthogonale est-elle le point le plus proche ?",
    back: "Pour tout autre point $q$ du sous-espace, $p - q$ est dans le sous-espace donc orthogonal à $x - p$, et Pythagore donne $\\|x - q\\|^2 = \\|x - p\\|^2 + \\|p - q\\|^2 \\geq \\|x - p\\|^2$.",
  },
  {
    id: "moindres-carres",
    section: 3,
    front: "Que vaut la solution des moindres carrés de $Aw \\approx y$, et que disent ses équations sur les résidus ?",
    back: "$A^\\top A\\,\\hat w = A^\\top y$ : $A\\hat w$ est la projection de $y$ sur l'image de $A$. Les résidus sont orthogonaux à chaque colonne ; avec une colonne de 1, leur somme est nulle.",
  },
  {
    id: "gram-schmidt",
    section: 4,
    front: "Comment fonctionne Gram-Schmidt, et quelle factorisation en sort ?",
    back: "On prend les vecteurs un par un et on retire à chacun ses projections sur les précédents, puis on normalise. On obtient $A = QR$, $Q$ à colonnes orthonormées, $R$ triangulaire supérieure.",
  },
  {
    id: "pas-de-xtx",
    section: 5,
    front: "Pourquoi ne résout-on pas les moindres carrés en formant $X^\\top X$ en pratique ?",
    back: "Former $X^\\top X$ amplifie les erreurs d'arrondi : sur un ajustement polynomial de degré 11, l'erreur passe de $5 \\times 10^{-9}$ (lstsq, qui passe par la SVD) à $0{,}11$. On utilise QR ou la SVD.",
  },
  {
    id: "init-orthogonale",
    section: 5,
    front: "Pourquoi initialiser les poids d'un réseau profond par des matrices orthogonales ?",
    back: "Elles conservent les normes à chaque couche, à l'aller comme au retour du gradient : le produit de 50 couches n'écrase ni n'étire aucune direction, alors qu'avec des poids gaussiens les facteurs d'étirement s'étalent de 4 à $10^{-18}$ (Saxe et al., 2013).",
  },
];
