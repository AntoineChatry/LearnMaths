import { isEquivalent, ce } from "F:/WebWorkspace/LearnMaths/src/lib/checkAnswer";
import { chaineGenerators } from "F:/WebWorkspace/LearnMaths/src/content/chaine/exercises";
import { chaineCards } from "F:/WebWorkspace/LearnMaths/src/content/chaine/cards";
import { conditionnellesGenerators } from "F:/WebWorkspace/LearnMaths/src/content/conditionnelles/exercises";
import { conditionnellesCards } from "F:/WebWorkspace/LearnMaths/src/content/conditionnelles/cards";
import { continuiteGenerators } from "F:/WebWorkspace/LearnMaths/src/content/continuite/exercises";
import { continuiteCards } from "F:/WebWorkspace/LearnMaths/src/content/continuite/cards";
import { convexiteGenerators } from "F:/WebWorkspace/LearnMaths/src/content/convexite/exercises";
import { convexiteCards } from "F:/WebWorkspace/LearnMaths/src/content/convexite/cards";
import { derivationGenerators } from "F:/WebWorkspace/LearnMaths/src/content/derivation/exercises";
import { derivationCards } from "F:/WebWorkspace/LearnMaths/src/content/derivation/cards";
import { determinantGenerators } from "F:/WebWorkspace/LearnMaths/src/content/determinant/exercises";
import { determinantCards } from "F:/WebWorkspace/LearnMaths/src/content/determinant/cards";
import { dualiteGenerators } from "F:/WebWorkspace/LearnMaths/src/content/dualite/exercises";
import { dualiteCards } from "F:/WebWorkspace/LearnMaths/src/content/dualite/cards";
import { entropieGenerators } from "F:/WebWorkspace/LearnMaths/src/content/entropie/exercises";
import { entropieCards } from "F:/WebWorkspace/LearnMaths/src/content/entropie/cards";
import { entropieCroiseeGenerators } from "F:/WebWorkspace/LearnMaths/src/content/entropie-croisee/exercises";
import { entropieCroiseeCards } from "F:/WebWorkspace/LearnMaths/src/content/entropie-croisee/cards";
import { espacesGenerators } from "F:/WebWorkspace/LearnMaths/src/content/espaces/exercises";
import { espacesCards } from "F:/WebWorkspace/LearnMaths/src/content/espaces/cards";
import { esperanceGenerators } from "F:/WebWorkspace/LearnMaths/src/content/esperance/exercises";
import { esperanceCards } from "F:/WebWorkspace/LearnMaths/src/content/esperance/cards";
import { gaussienneGenerators } from "F:/WebWorkspace/LearnMaths/src/content/gaussienne/exercises";
import { gaussienneCards } from "F:/WebWorkspace/LearnMaths/src/content/gaussienne/cards";
import { gradientGenerators } from "F:/WebWorkspace/LearnMaths/src/content/gradient/exercises";
import { gradientCards } from "F:/WebWorkspace/LearnMaths/src/content/gradient/cards";
import { grandsNombresGenerators } from "F:/WebWorkspace/LearnMaths/src/content/grands-nombres/exercises";
import { grandsNombresCards } from "F:/WebWorkspace/LearnMaths/src/content/grands-nombres/cards";
import { hoeffdingGenerators } from "F:/WebWorkspace/LearnMaths/src/content/hoeffding/exercises";
import { hoeffdingCards } from "F:/WebWorkspace/LearnMaths/src/content/hoeffding/cards";
import { informationMutuelleGenerators } from "F:/WebWorkspace/LearnMaths/src/content/information-mutuelle/exercises";
import { informationMutuelleCards } from "F:/WebWorkspace/LearnMaths/src/content/information-mutuelle/cards";
import { integrationGenerators } from "F:/WebWorkspace/LearnMaths/src/content/integration/exercises";
import { integrationCards } from "F:/WebWorkspace/LearnMaths/src/content/integration/cards";
import { jacobienneGenerators } from "F:/WebWorkspace/LearnMaths/src/content/jacobienne/exercises";
import { jacobienneCards } from "F:/WebWorkspace/LearnMaths/src/content/jacobienne/cards";
import { klEntrainementGenerators } from "F:/WebWorkspace/LearnMaths/src/content/kl-entrainement/exercises";
import { klEntrainementCards } from "F:/WebWorkspace/LearnMaths/src/content/kl-entrainement/cards";
import { lagrangeGenerators } from "F:/WebWorkspace/LearnMaths/src/content/lagrange/exercises";
import { lagrangeCards } from "F:/WebWorkspace/LearnMaths/src/content/lagrange/cards";
import { limitesGenerators } from "F:/WebWorkspace/LearnMaths/src/content/limites/exercises";
import { limitesCards } from "F:/WebWorkspace/LearnMaths/src/content/limites/cards";
import { loisContinuesGenerators } from "F:/WebWorkspace/LearnMaths/src/content/lois-continues/exercises";
import { loisContinuesCards } from "F:/WebWorkspace/LearnMaths/src/content/lois-continues/cards";
import { loisDiscretesGenerators } from "F:/WebWorkspace/LearnMaths/src/content/lois-discretes/exercises";
import { loisDiscretesCards } from "F:/WebWorkspace/LearnMaths/src/content/lois-discretes/cards";
import { loisJointesGenerators } from "F:/WebWorkspace/LearnMaths/src/content/lois-jointes/exercises";
import { loisJointesCards } from "F:/WebWorkspace/LearnMaths/src/content/lois-jointes/cards";
import { matricesGenerators } from "F:/WebWorkspace/LearnMaths/src/content/matrices/exercises";
import { matricesCards } from "F:/WebWorkspace/LearnMaths/src/content/matrices/cards";
import { newtonGenerators } from "F:/WebWorkspace/LearnMaths/src/content/newton/exercises";
import { newtonCards } from "F:/WebWorkspace/LearnMaths/src/content/newton/cards";
import { optimiseursGenerators } from "F:/WebWorkspace/LearnMaths/src/content/optimiseurs/exercises";
import { optimiseursCards } from "F:/WebWorkspace/LearnMaths/src/content/optimiseurs/cards";
import { orthogonaliteGenerators } from "F:/WebWorkspace/LearnMaths/src/content/orthogonalite/exercises";
import { orthogonaliteCards } from "F:/WebWorkspace/LearnMaths/src/content/orthogonalite/cards";
import { pacGenerators } from "F:/WebWorkspace/LearnMaths/src/content/pac/exercises";
import { pacCards } from "F:/WebWorkspace/LearnMaths/src/content/pac/cards";
import { probasBaseGenerators } from "F:/WebWorkspace/LearnMaths/src/content/probas-base/exercises";
import { probasBaseCards } from "F:/WebWorkspace/LearnMaths/src/content/probas-base/cards";
import { rappelsGenerators } from "F:/WebWorkspace/LearnMaths/src/content/rappels/exercises";
import { rappelsCards } from "F:/WebWorkspace/LearnMaths/src/content/rappels/cards";
import { retropropagationGenerators } from "F:/WebWorkspace/LearnMaths/src/content/retropropagation/exercises";
import { retropropagationCards } from "F:/WebWorkspace/LearnMaths/src/content/retropropagation/cards";
import { secondDegreGenerators } from "F:/WebWorkspace/LearnMaths/src/content/second-degre/exercises";
import { secondDegreCards } from "F:/WebWorkspace/LearnMaths/src/content/second-degre/cards";
import { seriesGenerators } from "F:/WebWorkspace/LearnMaths/src/content/series/exercises";
import { seriesCards } from "F:/WebWorkspace/LearnMaths/src/content/series/cards";
import { svdGenerators } from "F:/WebWorkspace/LearnMaths/src/content/svd/exercises";
import { svdCards } from "F:/WebWorkspace/LearnMaths/src/content/svd/cards";
import { symetriquesGenerators } from "F:/WebWorkspace/LearnMaths/src/content/symetriques/exercises";
import { symetriquesCards } from "F:/WebWorkspace/LearnMaths/src/content/symetriques/cards";
import { systemesGenerators } from "F:/WebWorkspace/LearnMaths/src/content/systemes/exercises";
import { systemesCards } from "F:/WebWorkspace/LearnMaths/src/content/systemes/cards";
import { taylorGenerators } from "F:/WebWorkspace/LearnMaths/src/content/taylor/exercises";
import { taylorCards } from "F:/WebWorkspace/LearnMaths/src/content/taylor/cards";
import { valeursPropresGenerators } from "F:/WebWorkspace/LearnMaths/src/content/valeurs-propres/exercises";
import { valeursPropresCards } from "F:/WebWorkspace/LearnMaths/src/content/valeurs-propres/cards";
import { vecteursGenerators } from "F:/WebWorkspace/LearnMaths/src/content/vecteurs/exercises";
import { vecteursCards } from "F:/WebWorkspace/LearnMaths/src/content/vecteurs/cards";
import { vraisemblanceGenerators } from "F:/WebWorkspace/LearnMaths/src/content/vraisemblance/exercises";
import { vraisemblanceCards } from "F:/WebWorkspace/LearnMaths/src/content/vraisemblance/cards";
export { isEquivalent, ce };
export const chapters = [
  { id: "chaine", module: "multivariable", generators: chaineGenerators, cards: chaineCards },
  { id: "conditionnelles", module: "probas", generators: conditionnellesGenerators, cards: conditionnellesCards },
  { id: "continuite", module: "analyse", generators: continuiteGenerators, cards: continuiteCards },
  { id: "convexite", module: "multivariable", generators: convexiteGenerators, cards: convexiteCards },
  { id: "derivation", module: "analyse", generators: derivationGenerators, cards: derivationCards },
  { id: "determinant", module: "algebreLineaire", generators: determinantGenerators, cards: determinantCards },
  { id: "dualite", module: "multivariable", generators: dualiteGenerators, cards: dualiteCards },
  { id: "entropie", module: "information", generators: entropieGenerators, cards: entropieCards },
  { id: "entropie-croisee", module: "information", generators: entropieCroiseeGenerators, cards: entropieCroiseeCards },
  { id: "espaces", module: "algebreLineaire", generators: espacesGenerators, cards: espacesCards },
  { id: "esperance", module: "probas", generators: esperanceGenerators, cards: esperanceCards },
  { id: "gaussienne", module: "probas", generators: gaussienneGenerators, cards: gaussienneCards },
  { id: "gradient", module: "analyse", generators: gradientGenerators, cards: gradientCards },
  { id: "grands-nombres", module: "probas", generators: grandsNombresGenerators, cards: grandsNombresCards },
  { id: "hoeffding", module: "concentration", generators: hoeffdingGenerators, cards: hoeffdingCards },
  { id: "information-mutuelle", module: "information", generators: informationMutuelleGenerators, cards: informationMutuelleCards },
  { id: "integration", module: "analyse", generators: integrationGenerators, cards: integrationCards },
  { id: "jacobienne", module: "multivariable", generators: jacobienneGenerators, cards: jacobienneCards },
  { id: "kl-entrainement", module: "information", generators: klEntrainementGenerators, cards: klEntrainementCards },
  { id: "lagrange", module: "multivariable", generators: lagrangeGenerators, cards: lagrangeCards },
  { id: "limites", module: "analyse", generators: limitesGenerators, cards: limitesCards },
  { id: "lois-continues", module: "probas", generators: loisContinuesGenerators, cards: loisContinuesCards },
  { id: "lois-discretes", module: "probas", generators: loisDiscretesGenerators, cards: loisDiscretesCards },
  { id: "lois-jointes", module: "probas", generators: loisJointesGenerators, cards: loisJointesCards },
  { id: "matrices", module: "algebreLineaire", generators: matricesGenerators, cards: matricesCards },
  { id: "newton", module: "multivariable", generators: newtonGenerators, cards: newtonCards },
  { id: "optimiseurs", module: "multivariable", generators: optimiseursGenerators, cards: optimiseursCards },
  { id: "orthogonalite", module: "algebreLineaire", generators: orthogonaliteGenerators, cards: orthogonaliteCards },
  { id: "pac", module: "concentration", generators: pacGenerators, cards: pacCards },
  { id: "probas-base", module: "probas", generators: probasBaseGenerators, cards: probasBaseCards },
  { id: "rappels", module: "analyse", generators: rappelsGenerators, cards: rappelsCards },
  { id: "retropropagation", module: "multivariable", generators: retropropagationGenerators, cards: retropropagationCards },
  { id: "second-degre", module: "analyse", generators: secondDegreGenerators, cards: secondDegreCards },
  { id: "series", module: "analyse", generators: seriesGenerators, cards: seriesCards },
  { id: "svd", module: "algebreLineaire", generators: svdGenerators, cards: svdCards },
  { id: "symetriques", module: "algebreLineaire", generators: symetriquesGenerators, cards: symetriquesCards },
  { id: "systemes", module: "algebreLineaire", generators: systemesGenerators, cards: systemesCards },
  { id: "taylor", module: "analyse", generators: taylorGenerators, cards: taylorCards },
  { id: "valeurs-propres", module: "algebreLineaire", generators: valeursPropresGenerators, cards: valeursPropresCards },
  { id: "vecteurs", module: "algebreLineaire", generators: vecteursGenerators, cards: vecteursCards },
  { id: "vraisemblance", module: "probas", generators: vraisemblanceGenerators, cards: vraisemblanceCards },
];
