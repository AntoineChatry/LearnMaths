import type { ConceptCard } from "../types";

export const taylorCards: ConceptCard[] = [
  {
    id: "tangente-vs-parabole",
    section: 1,
    front: "Pourquoi la parabole osculatrice approche-t-elle $\\cos$ bien mieux que sa tangente en 0 ?",
    back: "La tangente $y = 1$ n'a que la bonne valeur et la bonne pente (nulle). La parabole $1 - \\frac{x^2}{2}$ a en plus la bonne dérivée seconde, donc la bonne courbure. En $x = 0{,}1$ : écart d'environ $5 \\cdot 10^{-3}$ pour la tangente, $4 \\cdot 10^{-6}$ pour la parabole.",
  },
  {
    id: "pourquoi-factorielle",
    section: 2,
    front: "D'où vient le $k!$ dans le coefficient $\\frac{f^{(k)}(0)}{k!}$ ?",
    back: "Dériver $x^k$ $k$ fois donne $k!$. Pour que la dérivée $k$-ième du polynôme en 0 (qui vaut $k!\\,c_k$) soit égale à $f^{(k)}(0)$, il faut diviser par $k!$.",
  },
  {
    id: "lagrange-borne",
    section: 2,
    front: "Que dit la formule de Taylor-Lagrange, et à quoi sert-elle concrètement ?",
    back: "$f(x) = P_n(x) + \\frac{f^{(n+1)}(c)}{(n+1)!}x^{n+1}$ pour un certain $c$ entre 0 et $x$. On ne connaît pas $c$, mais en bornant $f^{(n+1)}$ on borne l'erreur. Pour $e$ : $|e - P_n(1)| \\le \\frac{3}{(n+1)!}$.",
  },
  {
    id: "rayon-ln",
    section: 4,
    front: "Pourquoi le développement de $\\ln(1+x)$ en 0 ne sert à rien en $x = 2$ ?",
    back: "Le rapport de deux termes consécutifs tend vers $|x|$ : la série converge pour $|x| < 1$ et diverge pour $|x| > 1$. Intuition : la fonction n'existe plus en $x = -1$, à distance 1 de 0, et le développement ne voit pas plus loin que cette distance.",
  },
  {
    id: "geometrique-taylor",
    section: 3,
    front: "Quel lien entre le développement de $\\frac{1}{1-x}$ et le chapitre sur les séries ?",
    back: "C'est la série géométrique : $1 + x + x^2 + \\cdots = \\frac{1}{1-x}$ pour $|x| < 1$. Le développement de Taylor et la formule de la série géométrique sont la même égalité, lue dans les deux sens.",
  },
  {
    id: "reduction-argument",
    section: 5,
    front: "Pourquoi une bibliothèque ne calcule-t-elle pas $\\sin(1000)$ directement avec la série de Taylor ?",
    back: "Loin de 0, il faudrait énormément de termes, et des termes géants de signes alternés font exploser les erreurs d'arrondi. On ramène d'abord l'argument près de 0 (réduction modulo $\\frac{\\pi}{2}$), puis on applique un polynôme de petit degré là où il est excellent.",
  },
  {
    id: "newton-ordre-2",
    section: 6,
    front: "En quoi la méthode de Newton $x \\leftarrow x - \\frac{f'(x)}{f''(x)}$ est-elle une idée de Taylor ?",
    back: "Elle remplace $f$ par son développement d'ordre 2 (la parabole osculatrice) et saute au sommet de cette parabole. C'est une descente de gradient dont le pas $\\frac{1}{f''(x)}$ est réglé par la courbure, au lieu d'un $\\eta$ choisi à la main.",
  },
  {
    id: "parite-sin-cos",
    section: 3,
    front: "Sans calculer, pourquoi le coefficient de $x^4$ dans le développement de $\\sin x$ est-il nul ?",
    back: "$\\sin$ est impaire : $\\sin(-x) = -\\sin x$. Son développement ne peut contenir que des puissances impaires de $x$. De même, $\\cos$ est paire et n'a que des puissances paires.",
  },
];
