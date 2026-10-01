import type { ConceptCard } from "../types";

export const dualiteCards: ConceptCard[] = [
  {
    id: "kkt-conditions",
    section: 1,
    front: "Énonce les conditions KKT pour $\\min f(x)$ sous $g_i(x) \\le 0$.",
    back: "Admissibilité $g_i(x^\\star) \\le 0$ ; multiplicateurs positifs $\\lambda_i \\ge 0$ ; complémentarité $\\lambda_i g_i(x^\\star) = 0$ (une contrainte inactive a $\\lambda_i = 0$) ; stationnarité $\\nabla f(x^\\star) + \\sum_i \\lambda_i \\nabla g_i(x^\\star) = 0$.",
  },
  {
    id: "kkt-dualite",
    section: 2,
    front: "Qu'est-ce que la fonction duale, et que disent la dualité faible et la dualité forte ?",
    back: "$D(\\lambda) = \\min_x L(x, \\lambda)$, toujours concave. Dualité faible : $D(\\lambda) \\le p^\\star$ pour tout $\\lambda \\ge 0$, donc $d^\\star \\le p^\\star$. Dualité forte, $d^\\star = p^\\star$ : garantie pour un problème convexe qui vérifie la condition de Slater (un point strictement admissible).",
  },
  {
    id: "kkt-suffisantes",
    section: 3,
    front: "Quand les conditions KKT sont-elles nécessaires, et quand sont-elles suffisantes ?",
    back: "Nécessaires dès que la dualité forte tient (Boyd 5.5.3) : la chaîne $f(x^\\star) = D(\\lambda^\\star) \\le L(x^\\star, \\lambda^\\star) \\le f(x^\\star)$ force la complémentarité et la stationnarité. Suffisantes pour un problème convexe : tout point qui les vérifie est optimal.",
  },
  {
    id: "kkt-svm",
    section: 3,
    front: "Qu'est-ce qu'un vecteur de support, et d'où vient cette notion ?",
    back: "Un point avec $a_n > 0$ dans le dual de la SVM. La complémentarité $a_n\\{t_n y(x_n) - 1\\} = 0$ impose $t_n y(x_n) = 1$ : il est sur la marge. Les autres ont $a_n = 0$ et ne comptent pas dans $w = \\sum_n a_n t_n x_n$.",
  },
  {
    id: "kkt-charniere",
    section: 4,
    front: "Quel lien entre la SVM à marge souple et la perte charnière ?",
    back: "À l'optimum, $\\xi_n = \\max(0, 1 - t_n y(x_n))$, et $C\\sum_n \\xi_n + \\frac12\\|w\\|^2$ devient, divisé par $C$, $\\sum_n \\max(0, 1 - t_n y(x_n)) + \\lambda\\|w\\|^2$ avec $\\lambda = 1/(2C)$. Dans le dual, les multiplicateurs sont bornés : $0 \\le a_n \\le C$.",
  },
];
