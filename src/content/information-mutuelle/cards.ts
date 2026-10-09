import type { ConceptCard } from "../types";

export const informationMutuelleCards: ConceptCard[] = [
  {
    id: "im-conditionnelle",
    section: 1,
    front: "Définition de l'entropie conditionnelle $H(X \\mid Y)$, et règle de la chaîne ?",
    back: "$H(X \\mid Y) = \\sum_y p(y)\\, H(X \\mid y)$ : la moyenne, sur $y$, de l'entropie de $p(x \\mid y)$. Règle de la chaîne : $H(X, Y) = H(X) + H(Y \\mid X) = H(Y) + H(X \\mid Y)$.",
  },
  {
    id: "im-conditionner",
    section: 1,
    front: "Connaître $Y$ réduit-il toujours l'incertitude sur $X$ ?",
    back: "En moyenne seulement : $H(X \\mid Y) \\le H(X)$, avec égalité si et seulement si $X$ et $Y$ sont indépendantes. Une valeur particulière peut l'augmenter : dans l'exemple de Cover et Thomas, $H(X \\mid y = 3) = 2 > H(X) = \\tfrac74$.",
  },
  {
    id: "im-definition",
    section: 2,
    front: "Trois écritures de l'information mutuelle $I(X ; Y)$, et ses propriétés ?",
    back: "$I = H(X) - H(X \\mid Y) = H(X) + H(Y) - H(X, Y) = D_{\\mathrm{KL}}(p(x, y) \\| p(x) p(y))$. Symétrique, $\\ge 0$, nulle si et seulement si $X$ et $Y$ sont indépendantes ; $I(X ; X) = H(X)$.",
  },
  {
    id: "im-canal",
    section: 2,
    front: "Information mutuelle entre l'entrée et la sortie d'un canal binaire symétrique de bruit $\\varepsilon$, entrée uniforme ?",
    back: "$H(Y \\mid X) = H_2(\\varepsilon)$ et $H(Y) = 1$, donc $I(X ; Y) = 1 - H_2(\\varepsilon)$. Pour $\\varepsilon = 0{,}15$ : $1 - 0{,}61 = 0{,}39$ bit par bit reçu ; pour $\\varepsilon = \\tfrac12$, 0.",
  },
  {
    id: "im-gain",
    section: 3,
    front: "Qu'est-ce que le gain d'information d'un attribut dans un arbre de décision, et quel est son défaut ?",
    back: "$\\mathrm{gain}(A) = H(C) - \\sum_v \\frac{|S_v|}{|S|} H(C \\mid A = v) = I(C ; A)$ sur les données. Il favorise les attributs à beaucoup de valeurs (un identifiant a un gain maximal et ne prédit rien) ; Quinlan le divise par $H(A)$ : le rapport de gain.",
  },
  {
    id: "im-traitement",
    section: 4,
    front: "Que dit l'inégalité du traitement des données, et qu'implique-t-elle pour un réseau de neurones ?",
    back: "Si $Z$ ne dépend de $X$ qu'à travers $Y$ ($X \\to Y \\to Z$), alors $I(X ; Z) \\le I(X ; Y)$ ; en particulier $I(X ; g(Y)) \\le I(X ; Y)$. Les couches forment une telle chaîne : l'information sur l'étiquette perdue par une couche ne se retrouve plus.",
  },
];
