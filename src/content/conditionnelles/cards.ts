import type { ConceptCard } from "../types";

export const conditionnellesCards: ConceptCard[] = [
  {
    id: "cond-definition",
    section: 1,
    front: "Que vaut $P(A \\mid B)$, et que fait-on concrètement en conditionnant ?",
    back: "$P(A \\mid B) = P(A \\cap B) / P(B)$ : on retire les issues hors de $B$, puis on renormalise pour que la masse restante vaille 1.",
  },
  {
    id: "cond-procureur",
    section: 1,
    front: "Qu'est-ce que le sophisme du procureur ?",
    back: "Confondre $P(A \\mid B)$ et $P(B \\mid A)$, par exemple la probabilité des indices sachant l'innocence avec celle de l'innocence sachant les indices. Deux cartes : $P(\\text{2e rouge} \\mid \\text{1re cœur}) = 25/51$, mais $P(\\text{1re cœur} \\mid \\text{2e rouge}) = 25/102$.",
  },
  {
    id: "cond-chainage",
    section: 2,
    front: "Quelle règle factorise la probabilité d'une phrase dans un modèle de langage ?",
    back: "La règle de chaînage, exacte : $p(s_1, \\dots, s_n) = \\prod_i p(s_i \\mid s_1, \\dots, s_{i-1})$. Le modèle n'apprend que la loi du token suivant ; on travaille avec la somme des logarithmes.",
  },
  {
    id: "cond-bayes",
    section: 3,
    front: "Écris la formule de Bayes avec les probabilités totales au dénominateur.",
    back: "$P(A \\mid B) = \\dfrac{P(B \\mid A) P(A)}{P(B \\mid A) P(A) + P(B \\mid A^c) P(A^c)}$",
  },
  {
    id: "cond-test-rare",
    section: 3,
    front: "Maladie à 1 %, test sensible et spécifique à 95 %. Probabilité d'être malade si positif, et pourquoi si faible ?",
    back: "Environ 16 %. Les faux positifs (5 % des 99 % de sains) sont bien plus nombreux que les vrais positifs (95 % des 1 % de malades) : l'a priori compte autant que le test.",
  },
  {
    id: "cond-sequentiel",
    section: 3,
    front: "Comment enchaîner plusieurs observations avec Bayes ?",
    back: "Le postérieur après une observation devient le prior de la suivante (si les observations sont indépendantes sachant l'hypothèse). Deux tests positifs indépendants sachant l'état : 1 %, puis 16 %, puis 78 %.",
  },
  {
    id: "cond-independance",
    section: 4,
    front: "Indépendants ou disjoints : quelle différence ?",
    back: "Indépendants : $P(A \\cap B) = P(A) P(B)$, savoir $B$ ne change rien à $A$. Disjoints : $A \\cap B = \\varnothing$ ; avec des probabilités non nulles, ils sont très dépendants, puisque $B$ exclut $A$.",
  },
  {
    id: "cond-naive-bayes",
    section: 4,
    front: "Quelle hypothèse fait le classifieur bayésien naïf, et pourquoi marche-t-il quand même ?",
    back: "Les mots sont indépendants sachant la classe : $P(c \\mid t_1, \\dots, t_n) \\propto P(c) \\prod_k P(t_k \\mid c)$. C'est faux, donc les probabilités sont mauvaises, mais pour classer il suffit que la bonne classe ait le plus grand score.",
  },
];
