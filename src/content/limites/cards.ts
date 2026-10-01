import type { ConceptCard } from "../types";

export const limitesCards: ConceptCard[] = [
  {
    id: "limite-ignore-f-a",
    section: 1,
    front: "Que dit $\\lim_{x \\to a} f(x) = L$ sur la valeur $f(a)$ ?",
    back: "Rien. La limite ne regarde que ce qui se passe autour de $a$, jamais en $a$ : $f(a)$ peut ne pas exister (un trou) ou valoir autre chose que $L$.",
  },
  {
    id: "epsilon-delta-ordre",
    section: 2,
    front: "Dans la définition ε-δ, qui choisit quoi, et dans quel ordre ?",
    back: "L'adversaire choisit d'abord la tolérance $\\varepsilon$ sur $f(x)$, puis tu réponds avec une fenêtre $\\delta$ autour de $a$. Prouver la limite, c'est donner $\\delta$ en fonction de $\\varepsilon$ qui gagne à tous les coups.",
  },
  {
    id: "forme-indeterminee",
    section: 4,
    front: "Un calcul direct donne $\\tfrac{0}{0}$. Est-ce que la limite n'existe pas ?",
    back: "Non : ça veut seulement dire que le calcul direct ne conclut pas. On transforme l'expression, par exemple $\\tfrac{x^2-1}{x-1} = x+1 \\to 2$ en factorisant.",
  },
  {
    id: "rationnelle-infini",
    section: 3,
    front: "Comment trouver la limite en $+\\infty$ d'une fraction de polynômes ?",
    back: "Ne garder que les termes de plus haut degré. Même degré : quotient des coefficients dominants. Degré du haut plus petit : $0$. Plus grand : $\\pm\\infty$, selon le signe du quotient des coefficients dominants.",
  },
  {
    id: "hierarchie-croissance",
    section: 3,
    front: "Range en $+\\infty$, du plus lent au plus rapide : $e^x$, $\\ln x$, $x^k$.",
    back: "$\\ln x \\ll x^k \\ll e^x$ pour tout $k > 0$ : une exponentielle finit toujours par écraser une puissance, qui écrase toujours le logarithme.",
  },
  {
    id: "sigmoide-saturation",
    section: 3,
    front: "Pourquoi un neurone sigmoïde « saturé » sort-il presque exactement 0 ou 1 ?",
    back: "$\\sigma(z) = \\frac{1}{1+e^{-z}}$ tend vers $1$ quand $z \\to +\\infty$ (car $e^{-z} \\to 0$) et vers $0$ quand $z \\to -\\infty$ (car $e^{-z} \\to +\\infty$).",
  },
];
