import type { ConceptCard } from "../types";

export const optimiseursCards: ConceptCard[] = [
  {
    id: "op-momentum",
    section: 1,
    front: "Descente avec momentum : mise à jour, et pourquoi elle aide dans une vallée étroite ?",
    back: "$z \\leftarrow \\beta z + \\nabla f(w)$, puis $w \\leftarrow w - \\eta z$ : $z$ est une somme des gradients passés à poids géométriques. Les composantes qui changent de signe d'un pas à l'autre s'annulent, celles qui gardent le même s'accumulent.",
  },
  {
    id: "op-taux",
    section: 2,
    front: "Sur une quadratique de conditionnement $\\kappa$ : condition de stabilité et meilleur taux du momentum ?",
    back: "Il faut $0 < \\eta\\lambda < 2 + 2\\beta$ pour chaque valeur propre (deux fois plus de marge qu'avec $\\eta\\lambda < 2$). Aux réglages optimaux, le taux vaut $\\sqrt{\\beta} = \\frac{\\sqrt\\kappa - 1}{\\sqrt\\kappa + 1}$, contre $\\frac{\\kappa - 1}{\\kappa + 1}$ sans momentum : $\\kappa$ est remplacé par $\\sqrt\\kappa$ (Goh, 2017).",
  },
  {
    id: "op-adam",
    section: 3,
    front: "Mise à jour d'Adam, et rôle de chaque moyenne ?",
    back: "$m_t$ : moyenne mobile du gradient ($\\beta_1 = 0{,}9$) ; $v_t$ : moyenne mobile de son carré ($\\beta_2 = 0{,}999$) ; $w \\leftarrow w - \\eta\\,\\hat m_t / (\\sqrt{\\hat v_t} + \\epsilon)$ terme à terme. Chaque coordonnée bouge d'environ $\\eta$ au plus, quelle que soit l'échelle de son gradient.",
  },
  {
    id: "op-biais",
    section: 3,
    front: "Pourquoi Adam divise-t-il $m_t$ par $1 - \\beta_1^t$ ?",
    back: "Partie de $m_0 = 0$, la moyenne est biaisée vers 0 : $\\mathbb E[m_t] = \\mathbb E[g]\\,(1 - \\beta_1^t)$ pour un gradient stationnaire. La division retire ce biais ; au premier pas, $\\hat m_1 = g_1$, $\\hat v_1 = g_1^2$ et le pas vaut $-\\eta\\,\\operatorname{signe}(g_1)$.",
  },
  {
    id: "op-adamw",
    section: 4,
    front: "Weight decay et pénalité L2 : pourquoi sont-ils équivalents pour la SGD mais pas pour Adam, et que fait AdamW ?",
    back: "SGD : $w - \\eta(\\nabla f + \\lambda' w) = (1 - \\eta\\lambda')w - \\eta\\nabla f$, une décroissance de taux $\\eta\\lambda'$. Adam divise aussi $\\lambda' w$ par $\\sqrt{\\hat v}$ : les poids aux gros gradients sont moins régularisés. AdamW applique la décroissance à part, au même taux pour tous (Loshchilov et Hutter, 2019).",
  },
];
