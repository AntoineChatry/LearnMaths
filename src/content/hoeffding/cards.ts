import type { ConceptCard } from "../types";

export const hoeffdingCards: ConceptCard[] = [
  {
    id: "cc-markov",
    section: 1,
    front: "Inégalités de Markov et de Tchebychev, et leur défaut sur une moyenne de lancers ?",
    back: "Markov : si $X \\ge 0$, $P(X \\ge t) \\le \\mathbb E[X]/t$. Tchebychev : $P(|X - \\mu| \\ge t) \\le \\operatorname{Var}(X)/t^2$. Elles n'utilisent pas l'indépendance : pour la moyenne de $N$ lancers, Tchebychev ne décroît qu'en $1/N$, alors que la vraie probabilité décroît exponentiellement.",
  },
  {
    id: "cc-chernoff",
    section: 2,
    front: "En quoi consiste la méthode de Chernoff ?",
    back: "Appliquer Markov à $e^{\\lambda X}$ : $P(X \\ge t) \\le e^{-\\lambda t} \\mathbb E[e^{\\lambda X}]$ pour tout $\\lambda > 0$, puis choisir le meilleur $\\lambda$. Pour une somme de variables indépendantes, $\\mathbb E[e^{\\lambda \\sum X_i}] = \\prod_i \\mathbb E[e^{\\lambda X_i}]$.",
  },
  {
    id: "cc-hoeffding",
    section: 2,
    front: "Inégalité de Hoeffding pour la moyenne de $N$ variables indépendantes à valeurs dans $[a, b]$ ?",
    back: "$P(\\bar X - \\mu \\ge \\varepsilon) \\le e^{-2N\\varepsilon^2/(b - a)^2}$, et $P(|\\bar X - \\mu| \\ge \\varepsilon) \\le 2e^{-2N\\varepsilon^2/(b - a)^2}$. Décroissance exponentielle en $N\\varepsilon^2$ ; la loi n'intervient que par l'intervalle $[a, b]$. Preuve : Chernoff + lemme de Hoeffding $\\mathbb E[e^{\\lambda X}] \\le e^{\\lambda^2(b - a)^2/8}$.",
  },
  {
    id: "cc-kl",
    section: 3,
    front: "Quelle est la borne de Chernoff pour une proportion $\\hat p$ de succès, et pourquoi est-elle meilleure que Hoeffding ?",
    back: "$P(\\hat p \\ge q) \\le e^{-N D_{\\mathrm{KL}}(q \\| p)}$ pour $q > p$, avec la divergence entre Bernoulli($q$) et Bernoulli($p$). Par Pinsker, $D_{\\mathrm{KL}}(q \\| p) \\ge 2(q - p)^2$, l'exposant de Hoeffding. Et l'exposant KL est le vrai : $\\frac1N \\ln P \\to -D_{\\mathrm{KL}}(q \\| p)$ (Sanov).",
  },
  {
    id: "cc-taille",
    section: 4,
    front: "Combien d'exemples de test pour mesurer une précision à $\\pm\\varepsilon$ avec probabilité $1 - \\delta$, pour un modèle puis pour $K$ ?",
    back: "Par Hoeffding, $N \\ge \\frac{\\ln(2/\\delta)}{2\\varepsilon^2}$ (18 445 pour $\\pm 1$ point à 95 %). Pour $K$ modèles évalués sur le même jeu, borne de la réunion : $N \\ge \\frac{\\ln(2K/\\delta)}{2\\varepsilon^2}$ ; $K$ n'entre que par son logarithme.",
  },
  {
    id: "cc-reunion",
    section: 4,
    front: "Pourquoi la borne de la réunion se combine-t-elle bien avec Hoeffding, et mal avec Tchebychev ?",
    back: "$P(E_1 \\cup \\dots \\cup E_K) \\le \\sum_k P(E_k)$ multiplie la probabilité d'échec par $K$. Avec une borne $e^{-2N\\varepsilon^2}$, il suffit d'ajouter $\\ln K$ à $2N\\varepsilon^2$ ; avec une borne en $1/N$, il faut multiplier $N$ par $K$ (50 000 exemples deviennent 50 millions pour 1 000 modèles).",
  },
];
