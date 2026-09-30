import type { ConceptCard } from "../types";

export const probasBaseCards: ConceptCard[] = [
  {
    id: "pb-naive",
    section: 1,
    front: "Quand a-t-on le droit d'écrire $P(A) = |A| / |\\Omega|$ ?",
    back: "Seulement si $\\Omega$ est fini et que toutes ses issues sont également probables, grâce à une symétrie ou au protocole (tirage au sort). Il faut bien choisir $\\Omega$ : avec deux dés, les 36 couples ordonnés sont équiprobables, pas les 21 paires (l'erreur de Leibniz).",
  },
  {
    id: "pb-remise",
    section: 2,
    front: "$k$ choix parmi $n$ objets : combien de résultats avec remise, sans remise, sans remise et sans ordre ?",
    back: "Avec remise : $n^k$. Sans remise : $n(n-1)\\cdots(n-k+1)$. Sans ordre : $\\binom{n}{k} = \\frac{n!}{k!(n-k)!}$, car chaque sous-ensemble a été compté $k!$ fois.",
  },
  {
    id: "pb-surcompte",
    section: 2,
    front: "Comment compter les anagrammes d'un mot avec des lettres répétées ?",
    back: "Compter trop puis diviser : on rend les lettres distinctes ($n!$ ordres), puis on divise par le nombre de façons de permuter chaque groupe de lettres identiques, par exemple $\\frac{6!}{3!\\,2!}$ pour ANANAS.",
  },
  {
    id: "pb-anniversaires",
    section: 3,
    front: "Pourquoi 23 personnes suffisent-elles pour avoir plus d'une chance sur deux d'un anniversaire commun ?",
    back: "Parce qu'il faut compter les paires, pas les personnes : $\\binom{23}{2} = 253$ paires. Par le complémentaire, $P = 1 - \\frac{365 \\times 364 \\times \\cdots \\times 343}{365^{23}} \\approx 0{,}507$.",
  },
  {
    id: "pb-racine-n",
    section: 3,
    front: "Parmi $N$ valeurs équiprobables, à partir de combien de tirages une coïncidence devient-elle probable ? Conséquence pour un hachage de $b$ bits ?",
    back: "$P \\approx 1 - e^{-k(k-1)/2N}$, donc vers $k \\approx \\sqrt N$ (environ 39 % à $k = \\sqrt N$). Un hachage de $b$ bits donne une collision après environ $2^{b/2}$ entrées, pas $2^b$.",
  },
  {
    id: "pb-axiomes",
    section: 4,
    front: "Quels sont les deux axiomes d'une probabilité ?",
    back: "$P(\\varnothing) = 0$ et $P(\\Omega) = 1$ ; et pour des événements deux à deux disjoints, $P(\\bigcup A_j) = \\sum P(A_j)$. Tout le reste s'en déduit, par exemple $P(A^c) = 1 - P(A)$.",
  },
  {
    id: "pb-union",
    section: 4,
    front: "Que vaut $P(A \\cup B)$, et comment se généralise la formule ?",
    back: "$P(A) + P(B) - P(A \\cap B)$, car l'intersection est comptée deux fois. Pour $n$ événements, inclusion-exclusion : on ajoute les termes seuls, on retranche les intersections deux à deux, on rajoute celles trois à trois, etc.",
  },
  {
    id: "pb-rencontres",
    section: 4,
    front: "On mélange $n$ cartes numérotées. Vers quoi tend la probabilité qu'au moins une soit à sa place ?",
    back: "$1 - \\frac{1}{2!} + \\frac{1}{3!} - \\cdots \\to 1 - \\frac{1}{e} \\approx 0{,}632$ : ni 0 ni 1, car les places possibles se multiplient pendant que chacune devient moins probable.",
  },
];
