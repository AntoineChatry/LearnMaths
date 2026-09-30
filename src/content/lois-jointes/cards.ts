import type { ConceptCard } from "../types";

export const loisJointesCards: ConceptCard[] = [
  {
    id: "lj-somme-produit",
    section: 1,
    front: "Règle de la somme, règle du produit, et définition de l'indépendance pour une loi jointe ?",
    back: "$p(x) = \\sum_y p(x, y)$ (marginale) ; $p(x, y) = p(y \\mid x)\\,p(x)$ ; indépendance : $p(x, y) = p(x)\\,p(y)$ pour tous $x, y$.",
  },
  {
    id: "lj-confusion",
    section: 1,
    front: "Dans une matrice de confusion vue comme loi jointe (prédit, vrai), que sont la précision et le rappel ?",
    back: "Précision : $P(\\text{vrai positif} \\mid \\text{prédit positif})$. Rappel : $P(\\text{prédit positif} \\mid \\text{vrai positif})$. Deux conditionnelles de la même case, divisée par deux marginales différentes.",
  },
  {
    id: "lj-covariance",
    section: 2,
    front: "Covariance, corrélation, et variance d'une somme ?",
    back: "$\\text{Cov}(X, Y) = E(XY) - E(X)E(Y)$ ; $\\text{corr} = \\text{Cov} / \\sqrt{V(X)V(Y)} \\in [-1, 1]$ ; $V(X + Y) = V(X) + V(Y) + 2\\,\\text{Cov}(X, Y)$.",
  },
  {
    id: "lj-non-correlees",
    section: 2,
    front: "Covariance nulle implique-t-elle l'indépendance ?",
    back: "Non : l'indépendance implique une covariance nulle, pas l'inverse. Contre-exemple : $X$ uniforme sur $\\{-1, 0, 1\\}$ et $Y = X^2$, de covariance nulle mais dépendantes. La covariance ne voit que la tendance linéaire.",
  },
  {
    id: "lj-matrice",
    section: 3,
    front: "Matrice de covariance : définition, et covariance de $Ax + b$ ?",
    back: "$\\Sigma = E((x - \\mu)(x - \\mu)^\\top)$, symétrique semi-définie positive. $V(Ax + b) = A\\Sigma A^\\top$, donc $V(u^\\top x) = u^\\top \\Sigma u$.",
  },
  {
    id: "lj-pca",
    section: 3,
    front: "Quelle direction unitaire $u$ maximise la variance de la projection $u^\\top x$ ?",
    back: "Le vecteur propre de $\\Sigma$ pour sa plus grande valeur propre ; la variance projetée vaut alors cette valeur propre. C'est le premier axe de la PCA.",
  },
  {
    id: "lj-esperance-totale",
    section: 4,
    front: "Formule de l'espérance totale ?",
    back: "Si $F_1, \\dots, F_r$ partitionnent l'univers : $E(Y) = \\sum_j E(Y \\mid F_j)\\,P(F_j)$.",
  },
  {
    id: "lj-meilleur-predicteur",
    section: 4,
    front: "Quel prédicteur $h(x)$ minimise la perte quadratique $E((h(X) - Y)^2)$ ?",
    back: "$h(x) = E(Y \\mid X = x)$. La perte restante, $E((E(Y \\mid X) - Y)^2)$, est le bruit irréductible (Bishop, PRML §1.5.5).",
  },
];
