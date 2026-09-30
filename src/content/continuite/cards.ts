import type { ConceptCard } from "../types";

export const continuiteCards: ConceptCard[] = [
  {
    id: "continuite-trois-conditions",
    section: 1,
    front: "Quelles sont les trois choses à vérifier pour que $f$ soit continue en $a$ ?",
    back: "$f(a)$ existe, $\\lim_{x \\to a} f(x)$ existe (limites à gauche et à droite égales), et les deux sont égales.",
  },
  {
    id: "inverse-continue-domaine",
    section: 2,
    front: "La courbe de $\\frac{1}{x}$ est en deux morceaux. Est-elle discontinue ?",
    back: "Non : elle est continue en chaque point de son domaine $\\mathbb{R}^*$. La coupure vient de 0, qui n'est pas dans le domaine. La continuité ne se juge qu'aux points où $f$ est définie.",
  },
  {
    id: "derivable-continue",
    section: 1,
    front: "Dérivable implique continue. Et l'inverse ?",
    back: "Faux : $|x|$ est continue en 0 mais n'y est pas dérivable. Les pentes à gauche ($-1$) et à droite ($+1$) diffèrent, la courbe fait un angle.",
  },
  {
    id: "tvi-sans-continuite",
    section: 3,
    front: "Que devient le TVI si $f$ n'est pas continue sur $[a, b]$ ?",
    back: "Il peut échouer : $f(x) = -1$ pour $x < 0$ et $1$ sinon change de signe sur $[-1, 1]$ sans jamais s'annuler.",
  },
  {
    id: "tvi-meme-signe",
    section: 3,
    front: "Si $f(a)$ et $f(b)$ ont le même signe, $f$ n'a pas de racine sur $[a, b]$ ?",
    back: "Faux. Le TVI ne dit rien dans ce cas : $x^2 - 1$ est positive en $-2$ et en $2$, et s'annule en $-1$ et en $1$.",
  },
  {
    id: "tvi-unicite",
    section: 3,
    front: "Le TVI donne une racine. Quand est-on sûr qu'elle est unique ?",
    back: "Quand $f$ est en plus strictement monotone sur $[a, b]$ : elle ne peut passer par 0 qu'une fois. Sans ça, $x^3 - x$ sur $[-2, 2]$ en a trois.",
  },
  {
    id: "dichotomie-invariant",
    section: 4,
    front: "Pourquoi la dichotomie trouve-t-elle toujours une racine d'une fonction continue ?",
    back: "Elle garde à chaque étape une moitié où $f$ change de signe. Par le TVI, chaque intervalle contient une racine, et sa longueur $\\frac{b-a}{2^n}$ tend vers 0.",
  },
  {
    id: "dichotomie-cout",
    section: 5,
    front: "Diviser $\\varepsilon$ par 1000 coûte combien d'étapes de dichotomie en plus ?",
    back: "Environ $\\log_2 1000 \\approx 10$ : chaque étape divise l'intervalle par 2, donc gagne un bit, soit environ $3{,}32$ étapes par chiffre décimal.",
  },
];
