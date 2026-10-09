import type { ConceptCard } from "../types";

export const loiStationnaireCards: ConceptCard[] = [
  {
    id: "ls-definition",
    section: 1,
    front: "Loi stationnaire d'une chaîne de matrice $P$ ? Comment la calculer ?",
    back: "Une loi $\\pi$ telle que $\\pi = \\pi P$ : un pas de la chaîne la laisse inchangée. C'est un vecteur propre à gauche de $P$ (donc de $P^\\top$) pour la valeur propre 1, normalisé pour sommer à 1. Pays d'Oz : $(0{,}4 ; 0{,}2 ; 0{,}4)$.",
  },
  {
    id: "ls-graphe",
    section: 1,
    front: "Loi stationnaire de la marche aléatoire simple sur un graphe ?",
    back: "$\\pi(v) = \\deg(v) / 2|E|$ : proportionnelle aux degrés, car $\\sum_x \\deg(x)\\,P(x, v) = \\sum_{x \\sim v} 1 = \\deg(v)$.",
  },
  {
    id: "ls-convergence",
    section: 2,
    front: "Sous quelles conditions la loi de $X_t$ tend-elle vers $\\pi$ quel que soit le départ, et à quelle vitesse ?",
    back: "Chaîne finie irréductible (tout état atteignable depuis tout état) et apériodique (pas de cycle forcé) : la distance en variation totale décroît comme $C\\alpha^t$ (Levin et Peres, th. 4.9). Pour Oz, elle est divisée par 4 à chaque pas, le module de la deuxième valeur propre.",
  },
  {
    id: "ls-contre-exemples",
    section: 2,
    front: "Que se passe-t-il si la chaîne est périodique, ou non irréductible ?",
    back: "Périodique (bascule, urne d'Ehrenfest) : la loi de $X_t$ oscille et ne converge pas ; la version paresseuse $(I + P)/2$ répare. Non irréductible (deux états absorbants) : plusieurs lois stationnaires, la limite dépend du départ.",
  },
  {
    id: "ls-retour",
    section: 3,
    front: "Que valent la fréquence des visites en $x$ et le temps moyen de retour en $x$ ?",
    back: "Pour une chaîne irréductible, la fraction du temps passée en $x$ tend vers $\\pi(x)$, même si la chaîne est périodique, et le temps moyen de retour vaut $1/\\pi(x)$. Oz : il fait beau tous les 5 jours en moyenne.",
  },
  {
    id: "ls-pagerank",
    section: 4,
    front: "Comment PageRank est-il défini, et à quoi sert la téléportation ?",
    back: "La loi stationnaire de l'internaute aléatoire : $P(i, j) = (1 - \\alpha)A_{ij}/\\text{(liens de } i) + \\alpha/N$. La téléportation rend tous les coefficients positifs, donc loi stationnaire unique et convergence de l'itération $x \\leftarrow xP$. Brin et Page : $d = 1 - \\alpha = 0{,}85$.",
  },
];
