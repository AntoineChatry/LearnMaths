import type { ConceptCard } from "../types";

export const chaineCards: ConceptCard[] = [
  {
    id: "ch-regle",
    section: 1,
    front: "Règle de la chaîne en plusieurs variables : forme, et vérification des tailles ?",
    back: "$\\frac{\\partial}{\\partial x} g(f(x)) = \\frac{\\partial g}{\\partial f}\\frac{\\partial f}{\\partial x}$, un produit de jacobiennes : $(p \\times m)(m \\times n) = p \\times n$. L'ordre compte.",
  },
  {
    id: "ch-chemin",
    section: 1,
    front: "Dérivée de $f(x(t))$ le long d'un chemin ?",
    back: "$\\frac{df}{dt} = \\sum_i \\frac{\\partial f}{\\partial x_i}\\frac{dx_i}{dt}$ : le produit scalaire du gradient avec la vitesse. Nulle quand la vitesse longe une ligne de niveau.",
  },
  {
    id: "ch-moindres-carres",
    section: 2,
    front: "Gradient de $\\|y - \\Phi\\theta\\|^2$ et de $x^\\top B x$ ?",
    back: "$2\\Phi^\\top(\\Phi\\theta - y)$ (en colonne ; en ligne chez MML : $-2(y - \\Phi\\theta)^\\top\\Phi$). Et $x^\\top(B + B^\\top)$, soit $2x^\\top B$ si $B$ est symétrique.",
  },
  {
    id: "ch-grad-W",
    section: 3,
    front: "Couche $z = Wx + b$ et $\\delta = \\partial L / \\partial z$ : gradients par rapport à $W$ et $b$ ? Et sur un minibatch ?",
    back: "$\\partial L / \\partial W = \\delta x^\\top$ (produit extérieur, même forme que $W$), $\\partial L / \\partial b = \\delta$. Minibatch : $\\sum_n \\delta_n x_n^\\top = \\Delta^\\top X$.",
  },
  {
    id: "ch-softmax-ce",
    section: 4,
    front: "Softmax suivi de l'entropie croisée : que vaut $\\partial L / \\partial z$ ?",
    back: "$y - t$ ($t$ : one-hot de la vraie classe) : le $1/y_c$ de la perte se simplifie avec la jacobienne du softmax. D'où $\\partial L / \\partial W = (y - t)x^\\top$.",
  },
];
