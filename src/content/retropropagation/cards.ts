import type { ConceptCard } from "../types";

export const retropropagationCards: ConceptCard[] = [
  {
    id: "rp-graphe",
    section: 1,
    front: "Passe arrière dans un graphe de calcul : que vaut $\\partial f / \\partial x_i$ quand $x_i$ sert à plusieurs nœuds ?",
    back: "La somme sur ses enfants : $\\frac{\\partial f}{\\partial x_i} = \\sum_j \\frac{\\partial f}{\\partial x_j}\\frac{\\partial x_j}{\\partial x_i}$ (MML 5.145), en partant de $\\partial f / \\partial f = 1$. Chaque chemin vers la sortie ajoute sa contribution.",
  },
  {
    id: "rp-cout",
    section: 2,
    front: "Mode inverse ou mode direct : lequel pour le gradient d'une perte, et pourquoi ?",
    back: "Inverse : une passe donne une ligne de la jacobienne, donc tout le gradient d'une sortie scalaire, pour un coût du même ordre qu'une passe avant. Le mode direct donne une colonne par passe, il en faudrait autant que de paramètres.",
  },
  {
    id: "rp-vjp",
    section: 2,
    front: "Traverser en arrière une couche linéaire $z = Wx$, puis une activation terme à terme $h = \\sigma(z)$ ?",
    back: "On ne forme jamais la jacobienne : $\\partial L / \\partial x = W^\\top \\delta$ et $\\partial L / \\partial z = \\sigma'(z) \\odot \\partial L / \\partial h$.",
  },
  {
    id: "rp-reseau",
    section: 3,
    front: "Récurrence de la rétropropagation dans un réseau, et gradient des poids de la couche $l$ ?",
    back: "$\\delta^{(l)} = \\sigma'(z^{(l)}) \\odot (W^{(l+1)\\top}\\delta^{(l+1)})$, puis $\\partial L / \\partial W^{(l)} = \\delta^{(l)} h^{(l-1)\\top}$ et $\\partial L / \\partial b^{(l)} = \\delta^{(l)}$ (PRML 5.53, 5.56).",
  },
  {
    id: "rp-backward",
    section: 4,
    front: "Que fait loss.backward(), et pourquoi appeler optimizer.zero_grad() ?",
    back: "La passe avant a enregistré le graphe ; backward() le parcourt à l'envers, dans l'ordre topologique, et ajoute (+=) les contributions dans .grad. Sans remise à zéro, les gradients des pas précédents s'accumulent.",
  },
];
