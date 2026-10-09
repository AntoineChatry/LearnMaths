import type { ConceptCard } from "../types";

export const klEntrainementCards: ConceptCard[] = [
  {
    id: "kt-sens",
    section: 1,
    front: "On approche une loi à deux modes $p$ par une gaussienne $q$. Que donne la minimisation de $D_{\\mathrm{KL}}(p \\| q)$, et celle de $D_{\\mathrm{KL}}(q \\| p)$ ?",
    back: "$D_{\\mathrm{KL}}(p \\| q)$ (directe, moyenne sous $p$) couvre tout le support de $p$ : pour une gaussienne, même moyenne et même variance que $p$, avec de la masse dans le creux. $D_{\\mathrm{KL}}(q \\| p)$ (inverse, moyenne sous $q$) évite les régions où $p$ est presque nulle : elle se pose sur un seul mode, si les modes sont assez séparés.",
  },
  {
    id: "kt-elbo",
    section: 2,
    front: "Quelle identité relie $\\ln p_\\theta(x)$, la borne variationnelle (ELBO) et une divergence KL ?",
    back: "$\\ln p_\\theta(x) = \\mathcal L + D_{\\mathrm{KL}}(q_\\phi(z \\mid x) \\| p_\\theta(z \\mid x))$, avec $\\mathcal L = \\mathbb E_q[\\ln p_\\theta(x, z) - \\ln q_\\phi(z \\mid x)]$. La divergence est positive, donc $\\mathcal L \\le \\ln p_\\theta(x)$, avec égalité quand $q$ est la vraie loi a posteriori.",
  },
  {
    id: "kt-vae",
    section: 2,
    front: "Les deux termes de la borne d'un VAE, et le terme KL pour un encodeur $\\mathcal N(\\mu, \\operatorname{diag} \\sigma^2)$ ?",
    back: "$\\mathcal L = \\mathbb E_q[\\ln p_\\theta(x \\mid z)] - D_{\\mathrm{KL}}(q_\\phi(z \\mid x) \\| p(z))$ : reconstruction moins régularisation. Avec $p(z) = \\mathcal N(0, I)$ : $D_{\\mathrm{KL}} = \\frac12 \\sum_j (\\mu_j^2 + \\sigma_j^2 - 1 - \\ln \\sigma_j^2)$, nul seulement pour $\\mu = 0$, $\\sigma = 1$.",
  },
  {
    id: "kt-distillation",
    section: 3,
    front: "Distillation : quelle perte, et quel gradient par rapport aux logits $z_i$ de l'élève ?",
    back: "L'entropie croisée $H(p, q) = H(p) + D_{\\mathrm{KL}}(p \\| q)$ entre les cibles douces du professeur et l'élève, les deux softmax à la même température $T$ : c'est la divergence directe. Gradient : $\\frac{\\partial H}{\\partial z_i} = \\frac1T (q_i - p_i)$.",
  },
  {
    id: "kt-t2",
    section: 3,
    front: "Pourquoi Hinton et al. multiplient-ils la perte douce par $T^2$ ?",
    back: "À haute température, $q_i - p_i \\approx (z_i - v_i)/(NT)$ (logits de moyenne nulle), donc le gradient $\\frac1T(q_i - p_i)$ décroît comme $1/T^2$. Multiplier par $T^2$ garde l'équilibre avec la perte sur les vraies étiquettes quand on change $T$. À la limite, distiller revient à faire coïncider les logits.",
  },
  {
    id: "kt-rlhf",
    section: 4,
    front: "L'objectif du RLHF avec pénalité KL, et sa politique optimale ?",
    back: "$\\max_\\pi \\mathbb E_\\pi[r] - \\beta D_{\\mathrm{KL}}(\\pi \\| \\pi_{\\text{ref}})$. Il vaut $\\beta \\ln Z - \\beta D_{\\mathrm{KL}}(\\pi \\| \\pi^*)$, donc par Gibbs l'optimum est $\\pi^*(y) = \\pi_{\\text{ref}}(y) e^{r(y)/\\beta} / Z$. $\\beta$ grand : on reste près de la référence ; $\\beta$ petit : la masse va sur la meilleure réponse.",
  },
];
