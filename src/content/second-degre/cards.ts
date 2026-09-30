import type { ConceptCard } from "../types";

export const secondDegreCards: ConceptCard[] = [
  {
    id: "forme-canonique-sommet",
    section: 1,
    front: "Que montre la forme canonique $a(x-\\alpha)^2 + \\beta$ que la forme développée cache ?",
    back: "Le sommet $(\\alpha, \\beta)$ : l'extremum de la fonction, et l'axe de symétrie $x = \\alpha$.",
  },
  {
    id: "origine-discriminant",
    section: 2,
    front: "D'où sort le discriminant ?",
    back: "De la complétion du carré : $ax^2+bx+c = a\\left(x+\\frac{b}{2a}\\right)^2 - \\frac{\\Delta}{4a}$, avec $\\Delta = b^2 - 4ac$.",
  },
  {
    id: "signe-delta-racines",
    section: 3,
    front: "Pourquoi le signe de $\\Delta$ donne-t-il le nombre de racines réelles ?",
    back: "Résoudre revient à $\\left(x+\\frac{b}{2a}\\right)^2 = \\frac{\\Delta}{4a^2}$. Un carré est positif ou nul : deux solutions si $\\Delta > 0$, une si $\\Delta = 0$, aucune réelle si $\\Delta < 0$.",
  },
  {
    id: "delta-sommet",
    section: 3,
    front: "Quel lien entre $\\Delta$, $a$ et l'ordonnée $\\beta$ du sommet ?",
    back: "$\\Delta = -4a\\beta$. Il y a deux racines exactement quand $a$ et $\\beta$ sont de signes contraires : la parabole s'ouvre vers l'axe des abscisses.",
  },
  {
    id: "somme-produit",
    section: 4,
    front: "Que valent la somme et le produit des racines de $ax^2+bx+c$ ?",
    back: "$x_1 + x_2 = -\\frac{b}{a}$ et $x_1 x_2 = \\frac{c}{a}$, en développant $a(x-x_1)(x-x_2)$ et en identifiant.",
  },
  {
    id: "regression-sommet",
    section: 5,
    front: "Pourquoi la régression linéaire à une feature, sans biais, a-t-elle une solution exacte ?",
    back: "Sa perte est un trinôme en $w$ de coefficient dominant $\\sum x_i^2 > 0$ : son minimum est au sommet, $w^* = \\frac{\\sum x_i y_i}{\\sum x_i^2}$.",
  },
  {
    id: "cancellation",
    section: 6,
    front: "Pourquoi $\\frac{-b+\\sqrt{\\Delta}}{2a}$ peut-il être faux dans un ordinateur ?",
    back: "Quand $\\sqrt{\\Delta} \\approx b$, la soustraction efface les chiffres significatifs communs. On calcule la racine sans soustraction, puis l'autre avec $x_1 x_2 = \\frac{c}{a}$.",
  },
];
