import type { ConceptCard } from "../types";

export const seriesCards: ConceptCard[] = [
  {
    id: "epsilon-n-role-de-n",
    section: 1,
    front: "Dans la définition de $\\lim u_n = L$, pourquoi le rang $N$ a-t-il le droit de dépendre de $\\varepsilon$ ?",
    back: "Parce que c'est ta réponse au défi : plus la tolérance $\\varepsilon$ est petite, plus il faut attendre longtemps avant que tous les termes restent dans la bande. Pour $u_n = 1 + \\frac{2(-1)^n}{n}$, n'importe quel $N > \\frac{2}{\\varepsilon}$ convient.",
  },
  {
    id: "serie-comme-suite",
    section: 2,
    front: "Qu'est-ce que ça veut dire, exactement, qu'une série $\\sum a_k$ converge ?",
    back: "Que la suite de ses sommes partielles $S_N = a_0 + \\dots + a_N$ a une limite finie. Une série n'est rien d'autre qu'une suite : celle de la variable qui accumule dans la boucle.",
  },
  {
    id: "geometrique-condition",
    section: 3,
    front: "Pourquoi $\\sum q^k = \\frac{1}{1-q}$ exige-t-il $|q| < 1$ ?",
    back: "Parce que $S_N = \\frac{1 - q^{N+1}}{1-q}$ : tout dépend de $q^{N+1}$. Il tend vers 0 seulement si $|q| < 1$. Sinon, les termes $q^k$ ne tendent même pas vers 0 et la série diverge.",
  },
  {
    id: "termes-vers-zero-insuffisant",
    section: 4,
    front: "Si $a_n \\to 0$, la série $\\sum a_n$ converge-t-elle forcément ?",
    back: "Non. C'est nécessaire, pas suffisant : $\\frac1n \\to 0$ mais la série harmonique diverge. En regroupant les termes par paquets de 2, 4, 8…, chaque paquet vaut au moins $\\frac12$.",
  },
  {
    id: "serie-integrale",
    section: 4,
    front: "Pourquoi $\\sum \\frac{1}{n^2}$ converge-t-elle, alors que $\\sum \\frac1n$ diverge ?",
    back: "On compare à l'aire sous la courbe de $\\frac{1}{x^p}$ : les termes sont des rectangles de largeur 1. $\\int_1^{+\\infty} \\frac{dx}{x^2} = 1$ est finie et, en ajoutant le premier terme, $1 + \\int_1^{+\\infty} \\frac{dx}{x^2} = 2$ majore les sommes partielles (croissantes), alors que $\\int_1^{+\\infty} \\frac{dx}{x}$ est infinie et minore la série harmonique. Règle : $\\sum \\frac{1}{n^p}$ converge si et seulement si $p > 1$.",
  },
  {
    id: "dalembert-cas-egal-un",
    section: 5,
    front: "Le test de d'Alembert donne $\\ell = 1$. Que peux-tu conclure ?",
    back: "Rien. $\\frac1n$ (diverge) et $\\frac{1}{n^2}$ (converge) donnent toutes les deux $\\ell = 1$. Il faut un autre outil, par exemple la comparaison avec une intégrale.",
  },
  {
    id: "factorielle-bat-puissance",
    section: 5,
    front: "Pourquoi $\\sum \\frac{x^n}{n!}$ converge-t-elle pour tout réel $x$, même très grand ?",
    back: "Le rapport de deux termes consécutifs vaut $\\frac{|x|}{n+1}$, qui tend vers 0 quel que soit $x$ : à partir d'un certain rang, chaque terme est bien plus petit que le précédent. La factorielle finit toujours par écraser la puissance.",
  },
  {
    id: "robbins-monro",
    section: 6,
    front: "Pourquoi un pas $\\eta_t = \\frac1t$ vérifie-t-il les conditions de Robbins–Monro, et pas un pas constant ?",
    back: "Les conditions (suffisantes, pas nécessaires) sont $\\sum \\eta_t = +\\infty$ (pouvoir aller assez loin) et $\\sum \\eta_t^2 < +\\infty$ (le bruit accumulé reste fini). Avec $\\frac1t$ : série harmonique (diverge) et série de Bâle (converge). Avec un pas constant $\\eta$, $\\sum \\eta^2$ est infinie.",
  },
];
