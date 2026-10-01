import type { ConceptCard } from "../types";

export const jacobienneCards: ConceptCard[] = [
  {
    id: "jac-definition",
    section: 1,
    front: "Jacobienne de $f : \\mathbb R^n \\to \\mathbb R^m$ : taille, et que contient le coefficient $(i, j)$ ?",
    back: "Une matrice $m \\times n$ (une ligne par sortie, une colonne par entrée), avec $J_{ij} = \\partial f_i / \\partial x_j$. Pour $m = 1$, c'est le gradient écrit en ligne.",
  },
  {
    id: "jac-linearisation",
    section: 2,
    front: "Que vaut $f(x_0 + h)$ au premier ordre, et quelle est la jacobienne de $x \\mapsto Wx + b$ ?",
    back: "$f(x_0 + h) \\approx f(x_0) + J(x_0)\\,h$. Pour une couche linéaire, $J = W$ en tout point : le biais disparaît.",
  },
  {
    id: "jac-activation",
    section: 3,
    front: "Jacobienne d'une activation appliquée composante par composante, et celle de ReLU ?",
    back: "Diagonale : $\\operatorname{diag}(\\sigma'(z_1), \\dots, \\sigma'(z_n))$, car $a_i$ ne dépend que de $z_i$. Pour ReLU, des 1 là où $z_i > 0$, des 0 là où $z_i < 0$. En $z_i = 0$, ReLU n'est pas dérivable ; les bibliothèques (PyTorch) y prennent 0 par convention.",
  },
  {
    id: "jac-softmax",
    section: 3,
    front: "Jacobienne du softmax ?",
    back: "$\\partial y_k / \\partial z_j = y_k(\\delta_{kj} - y_j)$, soit $\\operatorname{diag}(y) - yy^\\top$ (Bishop, PRML éq. 4.106). Symétrique, et chaque colonne somme à 0 car $\\sum_k y_k = 1$.",
  },
  {
    id: "jac-det-aires",
    section: 4,
    front: "Que mesure $|\\det J(x)|$ ? Exemple des coordonnées polaires.",
    back: "Le facteur par lequel $f$ multiplie les petites aires (ou volumes) autour de $x$. En polaires, $\\det J = r$ : $dx\\,dy = r\\,dr\\,d\\theta$, d'où $\\int e^{-x^2/2}dx = \\sqrt{2\\pi}$.",
  },
];
