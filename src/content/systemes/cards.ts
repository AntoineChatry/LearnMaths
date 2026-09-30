import type { ConceptCard } from "../types";

export const systemesCards: ConceptCard[] = [
  {
    id: "nombre-solutions",
    section: 1,
    front: "Combien de solutions peut avoir un système linéaire ?",
    back: "Une seule, aucune, ou une infinité, jamais exactement deux. En 2D : deux droites se coupent en un point, sont parallèles, ou sont confondues.",
  },
  {
    id: "operations-elimination",
    section: 2,
    front: "Pourquoi l'élimination ne change-t-elle pas les solutions du système ?",
    back: "Ses opérations (ajouter à une équation un multiple d'une autre, échanger deux équations) se défont : toute solution avant l'est après, et réciproquement.",
  },
  {
    id: "multiplicateur",
    section: 2,
    front: "Qu'est-ce que le multiplicateur $\\ell_{ij}$ dans l'élimination de Gauss ?",
    back: "Le coefficient à éliminer divisé par le pivot. On retranche $\\ell_{ij}$ fois la ligne du pivot à la ligne $i$ pour y faire apparaître un zéro.",
  },
  {
    id: "variable-libre",
    section: 3,
    front: "Que se passe-t-il quand une ligne s'élimine entièrement en $0 = d$ ?",
    back: "Si $d \\ne 0$, aucune solution. Si $d = 0$, l'équation ne contraint rien : une inconnue sans pivot devient libre, et il y a une infinité de solutions, une solution particulière plus un élément du noyau.",
  },
  {
    id: "lu-sens",
    section: 4,
    front: "Que contiennent $L$ et $U$ dans $A = LU$, et à quoi sert cette factorisation ?",
    back: "$U$ est la matrice triangulaire obtenue à la fin de l'élimination ; $L$ contient les multiplicateurs sous une diagonale de 1. On factorise une fois (de l'ordre de $n^3$ opérations), puis chaque nouveau $b$ ne coûte que deux systèmes triangulaires (de l'ordre de $n^2$).",
  },
  {
    id: "pivot-partiel",
    section: 5,
    front: "Qu'est-ce que le pivot partiel, et pourquoi en a-t-on besoin ?",
    back: "Dans chaque colonne, on échange les lignes pour prendre comme pivot le coefficient le plus grand en valeur absolue. Un pivot minuscule donne un multiplicateur énorme, qui noie les autres nombres dans l'arrondi flottant.",
  },
];
