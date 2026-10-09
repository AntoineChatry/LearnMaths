import type { ConceptCard } from "../types";

export const pacCards: ConceptCard[] = [
  {
    id: "pac-risque",
    section: 1,
    front: "Risque et risque empirique d'un classifieur, et pourquoi le risque empirique du modèle choisi est-il trop optimiste ?",
    back: "$R(h) = P(h(x) \\ne y)$, $\\hat R_S(h) = \\frac1m \\sum_i \\mathbf 1[h(x_i) \\ne y_i]$. Pour un $h$ fixé d'avance, $\\hat R_S(h)$ est une moyenne d'espérance $R(h)$. Mais le modèle retenu est choisi parce qu'il colle aux données : parmi 10 000 classifieurs au hasard sur des étiquettes au hasard, le meilleur n'a que 22 % d'erreurs d'entraînement, pour 50 % de risque.",
  },
  {
    id: "pac-uniforme",
    section: 2,
    front: "Borne de généralisation pour une classe finie $H$ (cas général) ?",
    back: "Avec probabilité au moins $1 - \\delta$, pour tout $h \\in H$ : $R(h) \\le \\hat R_S(h) + \\sqrt{\\frac{\\ln |H| + \\ln(2/\\delta)}{2m}}$. Preuve : Hoeffding pour chaque $h$, puis borne de la réunion sur les $|H|$ modèles.",
  },
  {
    id: "pac-erm",
    section: 2,
    front: "Si $|R(h) - \\hat R_S(h)| \\le \\varepsilon$ pour tout $h \\in H$, que garantit la minimisation du risque empirique ?",
    back: "$R(\\hat h) \\le \\hat R_S(\\hat h) + \\varepsilon \\le \\hat R_S(h^*) + \\varepsilon \\le R(h^*) + 2\\varepsilon$ : le modèle appris est à au plus $2\\varepsilon$ du meilleur modèle $h^*$ de la classe.",
  },
  {
    id: "pac-realisable",
    section: 3,
    front: "Cas réalisable (la vraie règle est dans $H$, modèle sans erreur d'entraînement) : quelle borne, et quelle vitesse ?",
    back: "Avec probabilité au moins $1 - \\delta$, $R(\\hat h) \\le \\frac{\\ln |H| + \\ln(1/\\delta)}{m}$ : vitesse en $1/m$ au lieu de $1/\\sqrt m$. Preuve : un $h$ de risque $> \\varepsilon$ passe les $m$ exemples sans erreur avec probabilité $\\le (1 - \\varepsilon)^m \\le e^{-\\varepsilon m}$, puis réunion sur $H$.",
  },
  {
    id: "pac-bits",
    section: 4,
    front: "Que donne la borne des classes finies pour un réseau de $W$ paramètres en float32, et pourquoi ne peut-elle pas expliquer la généralisation des réseaux profonds ?",
    back: "$|H| \\le 2^{32W}$, donc $\\ln |H| \\le 32W \\ln 2$ : pour Inception (1,6 million de paramètres) sur CIFAR10, l'écart garanti vaut 19, rien d'utile. Zhang et al. (2017) : ces réseaux apprennent parfaitement des étiquettes au hasard. Une borne qui ne regarde que la classe ne distingue pas vraies étiquettes et bruit.",
  },
  {
    id: "pac-approx",
    section: 4,
    front: "Erreur d'approximation et erreur d'estimation ?",
    back: "$R(\\hat h) - R^* = \\big(R(\\hat h) - \\inf_H R\\big) + \\big(\\inf_H R - R^*\\big)$ : l'estimation, due au nombre fini d'exemples, et l'approximation, due au choix de $H$. Une classe plus riche réduit l'approximation mais augmente l'estimation.",
  },
];
