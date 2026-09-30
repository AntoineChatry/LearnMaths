import type { ConceptCard } from "../types";

export const valeursPropresCards: ConceptCard[] = [
  {
    id: "vp-definition",
    section: 1,
    front: "Qu'est-ce qu'un vecteur propre et une valeur propre de $A$ ?",
    back: "Un vecteur $x \\neq 0$ tel que $Ax = \\lambda x$ : $A$ ne le fait pas tourner, elle l'étire d'un facteur $\\lambda$ (la valeur propre). Tout multiple non nul est encore vecteur propre.",
  },
  {
    id: "vp-polynome",
    section: 2,
    front: "Comment trouve-t-on les valeurs propres, puis les vecteurs propres ?",
    back: "Les valeurs propres sont les racines de $\\det(A - \\lambda I) = 0$ ($\\lambda^2 - \\text{tr}(A)\\lambda + \\det(A)$ en $2 \\times 2$). Les vecteurs propres de $\\lambda$ forment le noyau de $A - \\lambda I$.",
  },
  {
    id: "vp-trace-det",
    section: 2,
    front: "Quel lien entre valeurs propres, trace et déterminant ?",
    back: "La somme des valeurs propres est la trace, leur produit est le déterminant (avec multiplicité, en comptant les complexes).",
  },
  {
    id: "vp-diagonalisation",
    section: 3,
    front: "Que signifie $A = PDP^{-1}$, et quand est-ce possible ?",
    back: "$P$ a les vecteurs propres en colonnes, $D$ les valeurs propres sur la diagonale : dans la base propre, $A$ étire chaque axe. Possible quand il y a $n$ vecteurs propres indépendants, par exemple si les $n$ valeurs propres sont distinctes.",
  },
  {
    id: "vp-puissances",
    section: 3,
    front: "Pourquoi diagonaliser aide-t-il à calculer $A^k$ ?",
    back: "$A^k = P D^k P^{-1}$, et $D^k$ s'obtient en élevant chaque valeur propre à la puissance $k$.",
  },
  {
    id: "vp-iteration",
    section: 4,
    front: "Que devient $A^k x_0$ quand $k$ grandit ?",
    back: "$A^k x_0 = \\sum c_i \\lambda_i^k v_i$ : la valeur propre de plus grand module domine, et la direction tend vers son vecteur propre (méthode de la puissance, PageRank). Les composantes avec $|\\lambda| < 1$ s'éteignent, celles avec $|\\lambda| > 1$ explosent.",
  },
  {
    id: "vp-descente",
    section: 5,
    front: "Descente de gradient sur $\\frac{1}{2} w^\\top A w$ : quand converge-t-elle, et qu'est-ce qui la ralentit ?",
    back: "Chaque pas multiplie la composante propre $i$ par $1 - \\eta\\lambda_i$ : elle converge si $\\eta < 2/\\lambda_{\\max}$. Au mieux, l'erreur est multipliée par $(\\kappa - 1)/(\\kappa + 1)$ par pas, avec $\\kappa = \\lambda_{\\max}/\\lambda_{\\min}$ : un bol allongé est lent.",
  },
  {
    id: "vp-rnn",
    section: 5,
    front: "Quel rôle joue la plus grande valeur propre de $W$ dans un RNN ?",
    back: "Le gradient est multiplié par $W^\\top$ à chaque pas de temps. Dans le cas linéaire (Pascanu et al., 2013), si elle est inférieure à 1 en module, les contributions lointaines s'évanouissent ; il faut qu'elle dépasse 1 pour que le gradient explose.",
  },
];
