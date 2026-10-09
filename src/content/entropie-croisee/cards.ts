import type { ConceptCard } from "../types";

export const entropieCroiseeCards: ConceptCard[] = [
  {
    id: "ec-definition",
    section: 1,
    front: "Définition de l'entropie croisée $H(p, q)$, et son sens en compression ?",
    back: "$H(p, q) = \\sum_x p(x) \\log_2 \\frac{1}{q(x)} = -\\mathbb E_p[\\log_2 q]$ : la longueur moyenne d'un code construit pour le modèle $q$ (longueurs $\\log_2 1/q$) quand les symboles suivent la vraie loi $p$. Si $q = p$, c'est l'entropie $H(p)$.",
  },
  {
    id: "ec-kl",
    section: 2,
    front: "Définition de la divergence de Kullback-Leibler, et lien avec l'entropie croisée ?",
    back: "$D_{\\mathrm{KL}}(p \\| q) = \\sum_x p(x) \\log \\frac{p(x)}{q(x)} = H(p, q) - H(p)$ : les bits gaspillés par symbole en codant avec $q$ une source qui suit $p$.",
  },
  {
    id: "ec-gibbs",
    section: 2,
    front: "Inégalité de Gibbs : énoncé et idée de la preuve ?",
    back: "$D_{\\mathrm{KL}}(p \\| q) \\ge 0$, avec égalité si et seulement si $p = q$. Jensen avec la fonction convexe $-\\ln$ : $\\mathbb E_p[-\\ln \\frac qp] \\ge -\\ln \\mathbb E_p[\\frac qp] = -\\ln \\sum q \\ge 0$. Donc $H(p, q) \\ge H(p)$.",
  },
  {
    id: "ec-asymetrie",
    section: 2,
    front: "Pourquoi la divergence KL n'est-elle pas une distance, et que se passe-t-il si $q(x) = 0$ alors que $p(x) > 0$ ?",
    back: "Elle n'est pas symétrique : en général $D_{\\mathrm{KL}}(p \\| q) \\ne D_{\\mathrm{KL}}(q \\| p)$ (Cover et Thomas : 0,2075 contre 0,1887 bit pour $(\\tfrac12, \\tfrac12)$ et $(\\tfrac34, \\tfrac14)$). Si $q$ donne 0 à un symbole qui arrive, $D_{\\mathrm{KL}}(p \\| q) = \\infty$ : le code n'a aucun mot pour lui.",
  },
  {
    id: "ec-vraisemblance",
    section: 3,
    front: "Pourquoi minimiser l'entropie croisée revient-il à maximiser la vraisemblance ?",
    back: "Avec la loi empirique $\\hat p$ des données, $H(\\hat p, q_\\theta) = -\\frac1N \\sum_n \\ln q_\\theta(x_n) = H(\\hat p) + D_{\\mathrm{KL}}(\\hat p \\| q_\\theta)$. $H(\\hat p)$ ne dépend pas de $\\theta$ : c'est le plancher de la perte, et seule la divergence se réduit.",
  },
  {
    id: "ec-perplexite",
    section: 4,
    front: "Définition de la perplexité d'un modèle de langage, et comment la lire ?",
    back: "$\\mathrm{PP} = \\exp\\big(-\\frac1N \\sum_i \\ln q(w_i \\mid w_{<i})\\big) = 2^{\\text{bits par token}}$ : l'exponentielle de la perte. C'est un nombre de choix équivalent : un modèle uniforme sur $K$ tokens a une perplexité $K$. Elle ne descend pas sous $2^{H(p)}$, et ne se compare qu'à tokenisation égale.",
  },
];
