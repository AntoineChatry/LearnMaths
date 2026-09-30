import type { ConceptCard } from "../types";

export const loisDiscretesCards: ConceptCard[] = [
  {
    id: "ld-variable",
    section: 1,
    front: "Qu'est-ce qu'une variable aléatoire, et où est le hasard ?",
    back: "Une fonction $X : \\Omega \\to T$ qui associe une valeur à chaque issue. Le hasard est dans le choix de l'issue $\\omega$ ; $P(X \\in S) = P(\\{\\omega : X(\\omega) \\in S\\})$.",
  },
  {
    id: "ld-masse-repartition",
    section: 1,
    front: "Fonction de masse et fonction de répartition d'une variable discrète : définitions et forme ?",
    back: "$p_X(x) = P(X = x)$, positive, de somme 1. $F_X(x) = P(X \\le x)$, définie pour tout réel : un escalier croissant de 0 à 1, avec un saut de $p_X(x)$ en chaque valeur.",
  },
  {
    id: "ld-binomiale",
    section: 2,
    front: "Loi binomiale : hypothèses et formule ?",
    back: "$n$ essais indépendants, même probabilité de succès $p$ ; $X$ compte les succès. $P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}$.",
  },
  {
    id: "ld-precision-test",
    section: 2,
    front: "Un classifieur juste à 90 % est testé sur 20 exemples indépendants. À quel point la précision mesurée est-elle fiable ?",
    back: "Le nombre de bonnes réponses suit $\\text{Bin}(20\\,;\\,0{,}9)$ : il tombe à 16 ou moins (80 %) avec probabilité 0,133. Sur 1000 exemples, mesurer 88 % ou moins n'arrive plus qu'avec probabilité 0,022.",
  },
  {
    id: "ld-hypergeometrique",
    section: 2,
    front: "Tirage sans remise de $n$ boules parmi $N$ dont $K$ rouges : loi du nombre de rouges ?",
    back: "Hypergéométrique : $P(X = x) = \\binom{K}{x}\\binom{N-K}{n-x} / \\binom{N}{n}$. Proche de la binomiale quand $N$ est grand devant $n$.",
  },
  {
    id: "ld-geometrique",
    section: 3,
    front: "Loi géométrique (rang du premier succès) : $P(T = n)$, $P(T > k)$, et sa propriété remarquable ?",
    back: "$P(T = n) = (1-p)^{n-1} p$, $P(T > k) = (1-p)^k$. Sans mémoire : $P(T > r + s \\mid T > r) = P(T > s)$. Attention, certains livres comptent les échecs, $T - 1$.",
  },
  {
    id: "ld-poisson",
    section: 3,
    front: "D'où vient la loi de Poisson, et quelle est sa formule ?",
    back: "Limite de $\\text{Bin}(n, \\lambda/n)$ quand $n \\to \\infty$ : beaucoup d'occasions indépendantes, chacune rare. $P(X = k) = e^{-\\lambda} \\lambda^k / k!$.",
  },
  {
    id: "ld-temperature",
    section: 4,
    front: "Softmax avec température : formule, et effet de $T$ ?",
    back: "$p_i = e^{z_i/T} / \\sum_j e^{z_j/T}$. $T > 1$ aplatit la loi (vers l'uniforme), $T < 1$ la creuse ; quand $T \\to 0$, le tirage devient un argmax.",
  },
  {
    id: "ld-tirage",
    section: 4,
    front: "Comment tirer selon une loi catégorielle $p_1, \\dots, p_K$ avec un seul nombre uniforme ?",
    back: "Découper $[0, 1]$ en segments de longueurs $p_i$ (bornes $F_i = p_1 + \\dots + p_i$), tirer $u$ uniforme, renvoyer le $i$ tel que $F_{i-1} \\le u < F_i$ : c'est l'inversion de la fonction de répartition.",
  },
];
