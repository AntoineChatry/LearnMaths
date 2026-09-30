import type { ConceptCard } from "../types";

export const vraisemblanceCards: ConceptCard[] = [
  {
    id: "vr-vraisemblance",
    section: 1,
    front: "Vraisemblance et estimateur du maximum de vraisemblance ?",
    back: "Pour des données i.i.d., $L(\\theta) = -\\sum_n \\log p(x_n \\mid \\theta)$, fonction de $\\theta$ (pas une loi sur $\\theta$). Le MLE minimise $L$. Pièce : $k/n$.",
  },
  {
    id: "vr-biais-variance",
    section: 1,
    front: "MLE de la variance d'une gaussienne, et son biais ?",
    back: "$\\hat\\sigma^2_{\\text{ML}} = \\frac1N \\sum (x_n - \\bar x)^2$, d'espérance $\\frac{N-1}{N}\\sigma^2$ : il sous-estime. Diviser par $N - 1$ corrige le biais.",
  },
  {
    id: "vr-perte-gaussienne",
    section: 2,
    front: "Quelle hypothèse probabiliste se cache derrière la perte quadratique ?",
    back: "Un bruit gaussien : avec $y_n = x_n^\\top\\theta + \\varepsilon_n$, $\\varepsilon_n \\sim \\mathcal N(0, \\sigma^2)$, l'opposé de la log-vraisemblance vaut $\\frac{1}{2\\sigma^2}\\sum (y_n - x_n^\\top\\theta)^2$ + constante.",
  },
  {
    id: "vr-entropie-croisee",
    section: 2,
    front: "Entropie croisée : d'où vient-elle, et quel est son gradient par rapport aux logits ?",
    back: "C'est l'opposé de la log-vraisemblance d'un modèle catégoriel : $-\\sum_n \\log y_{n, c_n}$. Avec softmax, $\\partial E/\\partial z_j = y_j - t_j$.",
  },
  {
    id: "vr-beta",
    section: 3,
    front: "A priori $\\text{Beta}(\\alpha, \\beta)$, puis $k$ piles sur $n$ : a posteriori et espérance ?",
    back: "$\\text{Beta}(\\alpha + k, \\beta + n - k)$ (loi conjuguée), d'espérance $(\\alpha + k)/(\\alpha + \\beta + n)$ : l'a priori compte comme $\\alpha$ piles et $\\beta$ faces fictifs.",
  },
  {
    id: "vr-map-weight-decay",
    section: 4,
    front: "MAP avec un a priori gaussien $\\theta \\sim \\mathcal N(0, \\tau^2 I)$ ?",
    back: "Minimiser la perte (log-vraisemblance) plus $\\|\\theta\\|^2/2\\tau^2$ : c'est la régularisation L2, ou weight decay, avec $\\lambda = \\sigma^2/\\tau^2$. Régression : $(X^\\top X + \\lambda I)^{-1}X^\\top y$.",
  },
];
