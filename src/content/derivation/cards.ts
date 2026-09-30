import type { ConceptCard } from "../types";

export const derivationCards: ConceptCard[] = [
  {
    id: "derivable-implique-continue",
    section: 1,
    front: "Pourquoi une fonction dérivable en $a$ est-elle continue en $a$ ? La réciproque est-elle vraie ?",
    back: "$f(a+h) - f(a) = h \\cdot \\frac{f(a+h)-f(a)}{h}$ tend vers $0 \\times f'(a) = 0$. La réciproque est fausse : $|x|$ est continue en 0, mais son taux vaut $\\pm 1$ selon le signe de $h$, donc pas de dérivée.",
  },
  {
    id: "chaine-taux-multiplies",
    section: 2,
    front: "Pourquoi la règle de la chaîne est-elle un produit, et à quoi sert-elle en apprentissage automatique ?",
    back: "Les taux de variation se multiplient : si $u$ va 3 fois plus vite que $x$ et $g$ 2 fois plus vite que $u$, $g \\circ u$ va 6 fois plus vite que $x$. D'où $(g \\circ u)' = g'(u) \\cdot u'$. La rétropropagation applique cette règle le long de toute la composée qu'est un réseau.",
  },
  {
    id: "restreindre-pour-inverser",
    section: 3,
    front: "Pourquoi faut-il restreindre $\\sin$ avant de l'inverser, et pourquoi à $[-\\frac{\\pi}{2}, \\frac{\\pi}{2}]$ ?",
    back: "$\\sin$ n'est pas injective : $\\sin t = \\frac12$ a une infinité de solutions. Sur $[-\\frac{\\pi}{2}, \\frac{\\pi}{2}]$, elle est strictement croissante de $-1$ à $1$ : chaque valeur est atteinte une seule fois, donc $\\arcsin : [-1, 1] \\to [-\\frac{\\pi}{2}, \\frac{\\pi}{2}]$ existe.",
  },
  {
    id: "arcsin-sin-piege",
    section: 3,
    front: "Que vaut $\\arcsin(\\sin 3)$ ? Pourquoi pas 3 ?",
    back: "$\\arcsin$ ne renvoie que des angles de $[-\\frac{\\pi}{2}, \\frac{\\pi}{2}]$, et $3$ n'y est pas. Comme $\\sin(\\pi - 3) = \\sin 3$ et $\\pi - 3 \\approx 0{,}14$ est dans l'intervalle, $\\arcsin(\\sin 3) = \\pi - 3$.",
  },
  {
    id: "derivee-reciproque-pente-inverse",
    section: 4,
    front: "Pourquoi $(f^{-1})'(b) = \\frac{1}{f'(a)}$ quand $b = f(a)$ ? Que se passe-t-il si $f'(a) = 0$ ?",
    back: "La symétrie par rapport à $y = x$ échange $x$ et $y$, donc une pente $m$ devient $\\frac{1}{m}$. Si $f'(a) = 0$, la tangente de $f$ est horizontale, celle de $f^{-1}$ verticale : $f^{-1}$ n'est pas dérivable en $b$ (exemple : $\\arcsin$ en $\\pm 1$).",
  },
  {
    id: "arcsin-racine-positive",
    section: 4,
    front: "Dans $\\arcsin'(y) = \\frac{1}{\\sqrt{1-y^2}}$, pourquoi la racine positive et pas $\\pm$ ?",
    back: "$\\arcsin'(y) = \\frac{1}{\\cos(\\arcsin y)}$ et $\\cos^2 = 1 - y^2$. Le signe vient de la restriction : $\\arcsin y \\in [-\\frac{\\pi}{2}, \\frac{\\pi}{2}]$, où le cosinus est positif. D'ailleurs $\\arcsin$ est croissante, sa dérivée doit être positive.",
  },
  {
    id: "sigmoide-saturation",
    section: 5,
    front: "Pourquoi $\\sigma' = \\sigma(1-\\sigma)$ explique-t-il la saturation, et en quoi l'arctangente normalisée est-elle différente ?",
    back: "$\\sigma'$ vaut au plus $\\frac14$ (en 0) et devient minuscule quand $\\sigma$ est proche de 0 ou 1 : en $z = 10$, $\\sigma' \\approx 4{,}5 \\times 10^{-5}$. L'arctangente normalisée $\\frac12 + \\frac{\\arctan z}{\\pi}$ a la même forme en S, mais sa pente décroît seulement en $\\frac{1}{z^2}$ : elle sature bien plus lentement.",
  },
  {
    id: "pas-descente-gradient",
    section: 6,
    front: "Descente de gradient sur $f(x) = x^2$ : que se passe-t-il pour $\\eta = 0{,}25$, $\\eta = 0{,}75$, $\\eta = 1$ et $\\eta = 1{,}5$ ?",
    back: "Un pas multiplie $x$ par $1 - 2\\eta$. Avec $0{,}25$ : facteur $\\frac12$, convergence directe. Avec $0{,}75$ : facteur $-\\frac12$, convergence en zigzag. Avec $1$ : facteur $-1$, rebond éternel entre $x_0$ et $-x_0$. Avec $1{,}5$ : facteur $-2$, divergence. Converge si et seulement si $0 < \\eta < 1$.",
  },
];
