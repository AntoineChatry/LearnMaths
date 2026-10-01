import type { ConceptCard } from "../types";

export const convexiteCards: ConceptCard[] = [
  {
    id: "cv-definition",
    section: 1,
    front: "Définition d'une fonction convexe, et lecture géométrique ?",
    back: "Domaine convexe et $f(\\theta x + (1-\\theta)y) \\le \\theta f(x) + (1-\\theta) f(y)$ pour tous $x, y$ et $0 \\le \\theta \\le 1$ : la corde reste au-dessus du graphe. Version espérance, l'inégalité de Jensen : $f(\\mathbb E[X]) \\le \\mathbb E[f(X)]$.",
  },
  {
    id: "cv-tests",
    section: 2,
    front: "Quels sont les tests d'ordre 1 et d'ordre 2 de la convexité, et que donne le test d'ordre 1 sur un point critique ?",
    back: "Ordre 1 : $f(y) \\ge f(x) + \\nabla f(x)^\\top (y - x)$, la tangente est sous le graphe partout. Ordre 2 : $\\nabla^2 f(x) \\succeq 0$ partout. Dans les deux cas, le domaine doit être convexe. Si $\\nabla f(x) = 0$, l'ordre 1 donne $f(y) \\ge f(x)$ pour tout $y$ : un minimum global.",
  },
  {
    id: "cv-operations",
    section: 3,
    front: "Quelles opérations conservent la convexité, et pourquoi l'entropie croisée du softmax est-elle convexe en $W$ ?",
    back: "La somme à coefficients positifs, la composition avec une application affine et le maximum. $-\\log \\operatorname{softmax}(z)_c = \\text{lse}(z) - z_c$ : un log-sum-exp (convexe) moins une fonction linéaire, avec $z = Wx$ affine en $W$.",
  },
  {
    id: "cv-reseau",
    section: 3,
    front: "Pourquoi la perte d'un réseau de neurones n'est-elle pas convexe ?",
    back: "Symétrie de l'espace des poids (Goodfellow et al., section 8.2.2) : échanger deux neurones cachés donne la même perte. Le milieu des deux jeux de poids rend les deux neurones identiques, avec une perte en général plus grande, ce qu'une fonction convexe interdit.",
  },
  {
    id: "cv-forte",
    section: 4,
    front: "Que garantit la forte convexité $mI \\preceq \\nabla^2 f \\preceq MI$ ?",
    back: "$f(x) - p^\\star \\le \\frac{1}{2m}\\|\\nabla f(x)\\|^2$ (un petit gradient certifie la quasi-optimalité), un minimiseur unique, et une convergence linéaire du gradient : $f(x^{(k)}) - p^\\star \\le (1 - m/M)^k\\,(f(x^{(0)}) - p^\\star)$. Le ridge ajoute $2\\lambda$ à toutes les valeurs propres, donc $m \\ge 2\\lambda > 0$.",
  },
];
