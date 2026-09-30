import type { ConceptCard } from "../types";

export const gradientCards: ConceptCard[] = [
  {
    id: "derivee-partielle-geler",
    section: 2,
    front: "Comment calcule-t-on $\\frac{\\partial f}{\\partial x}(x, y)$ ?",
    back: "On gèle $y$ : on le traite comme une constante, et on dérive en $x$ avec les règles habituelles. C'est la pente de la tranche $x \\mapsto f(x, y_0)$ de la surface.",
  },
  {
    id: "derivee-directionnelle-produit-scalaire",
    section: 3,
    front: "Pourquoi la dérivée de $f$ dans la direction unitaire $u$ vaut-elle $\\nabla f \\cdot u$ ?",
    back: "Pour un petit pas $h$, $f(x + h u_1, y + h u_2) \\approx f(x, y) + h\\,\\frac{\\partial f}{\\partial x} u_1 + h\\,\\frac{\\partial f}{\\partial y} u_2$ : chaque variable contribue avec sa pente. Le coefficient de $h$ est exactement le produit scalaire $\\nabla f \\cdot u$.",
  },
  {
    id: "gradient-plus-forte-pente",
    section: 3,
    front: "Pourquoi le gradient pointe-t-il vers la plus forte pente ?",
    back: "$\\nabla f \\cdot u = \\|\\nabla f\\|\\,\\|u\\| \\cos\\theta = \\|\\nabla f\\| \\cos\\theta$ avec $\\|u\\| = 1$. C'est maximal pour $\\theta = 0$, c'est-à-dire $u$ dans le sens de $\\nabla f$, et la pente vaut alors $\\|\\nabla f\\|$.",
  },
  {
    id: "gradient-orthogonal-niveau",
    section: 3,
    front: "Pourquoi le gradient est-il orthogonal aux lignes de niveau ?",
    back: "Le long d'une ligne de niveau, $f$ ne varie pas : la dérivée directionnelle y est nulle, donc $\\nabla f \\cdot u = 0$ pour $u$ tangent à la ligne. Un produit scalaire nul, c'est l'orthogonalité.",
  },
  {
    id: "descente-signe-moins",
    section: 4,
    front: "Pourquoi la descente de gradient s'écrit-elle $\\theta \\leftarrow \\theta - \\eta\\,\\nabla f(\\theta)$, avec un signe moins ?",
    back: "$\\nabla f$ pointe vers la plus forte montée. Pour minimiser, on va dans le sens opposé, $-\\nabla f$, qui est la plus forte descente. $\\eta$ règle la longueur du pas.",
  },
  {
    id: "pas-trop-grand",
    section: 4,
    front: "Que se passe-t-il si le pas $\\eta$ est trop grand, sur un bol allongé comme $x^2 + 5y^2$ ?",
    back: "Chaque pas multiplie $y$ par $1 - 10\\eta$. Si $\\eta > 0{,}1$, ce facteur est négatif : on saute par-dessus le fond de la vallée, c'est le zigzag. Si $\\eta > 0{,}2$, il dépasse 1 en valeur absolue : la descente diverge. C'est la direction la plus courbée qui limite $\\eta$.",
  },
  {
    id: "equations-normales-origine",
    section: 5,
    front: "D'où viennent les équations normales de la régression linéaire $w x + b$ ?",
    back: "On annule les deux dérivées partielles de $\\text{TrainLoss}(w, b)$. Cela donne un système linéaire $2 \\times 2$ : $w \\sum x_i^2 + b \\sum x_i = \\sum x_i y_i$ et $w \\sum x_i + n\\,b = \\sum y_i$, soit $X^\\top X \\theta = X^\\top y$.",
  },
  {
    id: "sgd-vs-gd",
    section: 6,
    front: "Quelle est la différence entre descente de gradient et SGD ?",
    back: "La descente de gradient calcule le gradient de la perte moyenne sur tous les exemples avant chaque pas. La SGD fait un pas après chaque exemple, avec le gradient de sa seule perte : des pas moins précis mais beaucoup plus nombreux. Avec un $\\eta$ constant, elle finit en général par tourner autour du minimum sans s'y poser exactement.",
  },
];
