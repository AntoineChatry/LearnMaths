import type { ConceptCard } from "../types";

export const chainesMarkovCards: ConceptCard[] = [
  {
    id: "mk-propriete",
    section: 1,
    front: "Propriété de Markov ?",
    back: "$P(X_{t+1} = y \\mid X_t = x, X_{t-1}, \\dots, X_0) = P(X_{t+1} = y \\mid X_t = x) = P(x, y)$ : l'état suivant ne dépend que de l'état présent, pas du chemin qui y a mené. Chaîne homogène : $P(x, y)$ ne dépend pas de $t$.",
  },
  {
    id: "mk-stochastique",
    section: 1,
    front: "Que contient la ligne $x$ d'une matrice de transition, et pourquoi somme-t-elle à 1 ?",
    back: "La loi de l'état suivant quand la chaîne est en $x$. Une loi somme à 1, d'où des coefficients positifs et des lignes de somme 1 : une matrice stochastique.",
  },
  {
    id: "mk-puissances",
    section: 2,
    front: "Probabilité d'aller de $x$ à $y$ en $n$ pas ?",
    back: "$P(X_n = y \\mid X_0 = x) = (P^n)(x, y)$. Pour $n = 2$, on somme sur l'état intermédiaire : $\\sum_k P(x, k)\\,P(k, y)$, ligne $x$ scalaire colonne $y$.",
  },
  {
    id: "mk-loi-n",
    section: 3,
    front: "Loi de $X_n$ si $X_0$ suit la loi $u$ ?",
    back: "$u^{(n)} = u\\,P^n$, avec $u$ en vecteur ligne multiplié à droite (les lignes de $P$ sont indexées par l'état de départ). Au pays d'Oz, depuis $(1/3, 1/3, 1/3)$, $u^{(3)} \\approx (0{,}401 ; 0{,}198 ; 0{,}401)$.",
  },
  {
    id: "mk-trajectoire",
    section: 3,
    front: "Probabilité d'une trajectoire $(x_0, x_1, \\dots, x_n)$ ?",
    back: "$u(x_0)\\,P(x_0, x_1) \\cdots P(x_{n-1}, x_n)$ : règle de multiplication, où chaque conditionnement se réduit au dernier état par la propriété de Markov.",
  },
  {
    id: "mk-bigramme",
    section: 4,
    front: "Pourquoi un modèle bigramme est-il une chaîne de Markov, et comment l'estime-t-on ?",
    back: "Il suppose $P(w_n \\mid w_{1:n-1}) \\approx P(w_n \\mid w_{n-1})$ : les états sont les mots. Estimation par comptage, $P(w_n \\mid w_{n-1}) = C(w_{n-1} w_n) / C(w_{n-1})$ ; générer du texte, c'est faire marcher la chaîne de $\\texttt{<s>}$ à $\\texttt{</s>}$.",
  },
];
