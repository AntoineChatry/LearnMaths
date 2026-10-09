import { LessonFlow } from "../../components/LessonFlow";
import { Tex } from "../../components/Tex";
import { SelectionViz } from "./SelectionViz";

export function PacLesson() {
  return (
    <LessonFlow>
      <section className="section">
        <span className="section-num">1</span>
        <h2>Le meilleur de K hasards</h2>
        <p>
          Un classifieur <Tex>h</Tex> a un <strong>risque</strong>, sa probabilité de se tromper sur un nouvel
          exemple, et un <strong>risque empirique</strong>, sa proportion d'erreurs sur les <Tex>m</Tex> exemples
          d'entraînement (Mohri et al., <em>Foundations of Machine Learning</em>, définitions 2.1 et 2.2 ; Vershynin,
          section 8.4) :
        </p>
        <Tex block>{"R(h) = P\\big(h(x) \\ne y\\big) \\qquad \\hat R_S(h) = \\frac1m \\sum_{i=1}^m \\mathbf 1\\big[h(x_i) \\ne y_i\\big]"}</Tex>
        <p>
          Pour un <Tex>h</Tex> <em>fixé avant de voir les données</em>, <Tex>{"\\hat R_S(h)"}</Tex> est une moyenne
          de <Tex>m</Tex> variables indépendantes d'espérance <Tex>{"R(h)"}</Tex> (Mohri, équation 2.3) : c'est la
          situation du jeu de test, et Hoeffding s'applique. Mais l'entraînement choisit <Tex>h</Tex>{" "}
          <em>en regardant</em> les données. L'expérience suivante le montre sans aucun réseau : les étiquettes sont
          tirées à pile ou face, donc aucun classifieur ne peut faire mieux que 50 % d'erreurs. On en essaie{" "}
          <Tex>K</Tex>, au hasard, et on garde celui qui se trompe le moins sur les données.
        </p>
        <pre>
          <code>{`import numpy as np

rng = np.random.default_rng(0)
m = 50
y = rng.integers(0, 2, m)              # étiquettes tirées à pile ou face : il n'y a rien à apprendre
for K in [1, 10, 100, 1000, 10000]:
    H = rng.integers(0, 2, (K, m))     # K classifieurs au hasard, et leurs prédictions sur les m exemples
    erreurs = (H != y).mean(axis=1)    # erreur d'entraînement de chacun
    print(K, erreurs.min())            # celle du meilleur ; son vrai risque reste 0,5
# 1 0.48
# 10 0.34
# 100 0.34
# 1000 0.28
# 10000 0.22`}</code>
        </pre>
        <p>
          Avec 10 000 essais, le « meilleur » classifieur n'a plus que 22 % d'erreurs d'entraînement, et toujours
          50 % de risque. Ce n'est pas un bug : parmi beaucoup de candidats, l'un d'eux colle aux données par chance,
          et c'est précisément celui que l'on choisit. C'est le <strong>sur-apprentissage</strong>, réduit à son
          mécanisme : le risque empirique du modèle choisi n'est plus une moyenne honnête, et il est biaisé vers le
          bas.
        </p>
      </section>

      <section className="section">
        <span className="section-num">2</span>
        <h2>Une borne pour toute la classe à la fois</h2>
        <p>
          Puisqu'on ne sait pas d'avance quel <Tex>h</Tex> sera choisi, il faut une garantie valable{" "}
          <em>simultanément</em> pour toute la classe <Tex>H</Tex> des modèles possibles. C'est l'argument du
          chapitre précédent : Hoeffding pour chaque <Tex>h</Tex>, puis la borne de la réunion sur les{" "}
          <Tex>{"|H|"}</Tex> modèles. Pour une classe finie, avec une probabilité au moins{" "}
          <Tex>{"1 - \\delta"}</Tex> (Mohri, théorème 2.13) :
        </p>
        <Tex block>{"\\forall h \\in H, \\qquad R(h) \\le \\hat R_S(h) + \\sqrt{\\frac{\\ln |H| + \\ln(2/\\delta)}{2m}}"}</Tex>
        <p>
          La garantie vaut pour <em>tous</em> les <Tex>h</Tex>, donc aussi pour celui qu'a choisi l'algorithme, quel
          qu'il soit. On en tire celle de la <strong>minimisation du risque empirique</strong> (ERM), qui prend le{" "}
          <Tex>{"\\hat h"}</Tex> de plus petite erreur d'entraînement. Si tous les écarts{" "}
          <Tex>{"|R(h) - \\hat R_S(h)|"}</Tex> sont au plus <Tex>\varepsilon</Tex>, et si <Tex>{"h^*"}</Tex> est le
          meilleur modèle de la classe (Vershynin, équation 8.40 ; Mohri, proposition 4.1) :
        </p>
        <Tex block>{"R(\\hat h) \\le \\hat R_S(\\hat h) + \\varepsilon \\le \\hat R_S(h^*) + \\varepsilon \\le R(h^*) + 2\\varepsilon"}</Tex>
        <p>
          Le modèle appris est au plus à <Tex>{"2\\varepsilon"}</Tex> du meilleur de la classe. Vérifions la borne
          sur l'expérience des étiquettes au hasard, répétée 2 000 fois.
        </p>
        <pre>
          <code>{`import numpy as np
from math import log, sqrt

def ecart(K, m, delta):  # la borne : avec proba >= 1 - delta, |R - R_emp| <= ecart pour les K hypothèses
    return sqrt((log(K) + log(2 / delta)) / (2 * m))

rng = np.random.default_rng(0)
m, delta = 50, 0.05
for K in [1, 10, 100, 1000, 10000]:
    # 2 000 répétitions de l'expérience : les K erreurs d'entraînement sont des Bin(m, 1/2) / m indépendantes
    erreurs = rng.binomial(m, 0.5, size=(2000, K)) / m
    meilleure = np.median(erreurs.min(axis=1))
    echec = np.mean(np.abs(erreurs - 0.5).max(axis=1) > ecart(K, m, delta))
    print(K, meilleure, round(0.5 - ecart(K, m, delta), 3), echec)
# 1 0.5 0.308 0.0055
# 10 0.4 0.255 0.0035
# 100 0.32 0.212 0.002
# 1000 0.28 0.174 0.001
# 10000 0.24 0.141 0.0035`}</code>
        </pre>
        <p>
          La meilleure erreur d'entraînement (en médiane) reste au-dessus du plancher <Tex>{"0{,}5 - \\varepsilon"}</Tex>{" "}
          que garantit la borne, et la garantie n'échoue que dans moins de 1 % des cas, sous les 5 % promis. Surtout,
          la borne a la bonne forme : l'écart croît comme <Tex>{"\\sqrt{\\ln K / m}"}</Tex>. Multiplier le nombre de
          modèles essayés par 10 ne coûte qu'un <Tex>{"\\ln 10"}</Tex> de plus sous la racine.
        </p>
        <SelectionViz />
      </section>

      <section className="section">
        <span className="section-num">3</span>
        <h2>Le cas réalisable : une vitesse en 1/m</h2>
        <p>
          Supposons maintenant que la vraie règle soit dans <Tex>H</Tex>, et que l'algorithme renvoie un modèle{" "}
          <strong>cohérent</strong>, sans aucune erreur d'entraînement. Un modèle de risque supérieur à{" "}
          <Tex>\varepsilon</Tex> passe sans erreur les <Tex>m</Tex> exemples avec une probabilité au plus{" "}
          <Tex>{"(1 - \\varepsilon)^m \\le e^{-\\varepsilon m}"}</Tex>. La borne de la réunion sur{" "}
          <Tex>H</Tex> donne alors, avec probabilité au moins <Tex>{"1 - \\delta"}</Tex> (Mohri, théorème 2.5) :
        </p>
        <Tex block>{"R(\\hat h) \\le \\frac{\\ln |H| + \\ln(1/\\delta)}{m}"}</Tex>
        <p>
          Plus de racine carrée : le risque décroît en <Tex>{"1/m"}</Tex> au lieu de <Tex>{"1/\\sqrt m"}</Tex>.
          C'est le cadre <strong>PAC</strong>, pour <em>probablement approximativement correct</em> (Mohri,
          définition 2.3) : avec probabilité <Tex>{"1 - \\delta"}</Tex> (probablement), le risque est au plus{" "}
          <Tex>\varepsilon</Tex> (approximativement correct), dès que <Tex>m</Tex> est polynomial en{" "}
          <Tex>{"1/\\varepsilon"}</Tex> et <Tex>{"1/\\delta"}</Tex>.
          Exemple : apprendre un seuil sur <Tex>{"[0, 1]"}</Tex>, parmi 10 001 seuils possibles, à partir de points
          tirés uniformément.
        </p>
        <pre>
          <code>{`import numpy as np
from math import log

grille = np.arange(10_001) / 10_000    # H : 10 001 seuils t ; h_t(x) = 1 si x >= t
cible = 0.3712                         # la vraie règle est dans H : le cas réalisable
rng = np.random.default_rng(0)

def apprendre(x, y):  # ERM : le plus petit seuil de la grille qui ne se trompe sur aucun exemple
    plus_grand_negatif = x[y == 0].max(initial=0.0)
    return grille[grille > plus_grand_negatif][0]

delta = 0.05
for m in [25, 100, 400, 1600]:
    risques = []
    for _ in range(2000):
        x = rng.random(m)
        y = (x >= cible).astype(int)
        risques.append(abs(apprendre(x, y) - cible))   # x uniforme : le risque est l'écart des seuils
    borne = (log(len(grille)) + log(1 / delta)) / m
    print(m, round(np.median(risques), 4), round(borne, 4), np.mean(np.array(risques) > borne))
# 25 0.0266 0.4882 0.0
# 100 0.0068 0.1221 0.0
# 400 0.0016 0.0305 0.0
# 1600 0.0004 0.0076 0.0`}</code>
        </pre>
        <p>
          Quand <Tex>m</Tex> est multiplié par 4, le risque médian et la borne sont tous deux divisés par 4 : c'est
          la vitesse en <Tex>{"1/m"}</Tex>. La borne est prudente, environ 18 fois le risque médian, car elle doit
          valoir pour toute loi des exemples et dans 95 % des cas ; elle n'est jamais dépassée.
        </p>
      </section>

      <section className="section">
        <span className="section-num">4</span>
        <h2>Compter la classe en bits</h2>
        <p>
          Dans les deux bornes, la taille de la classe n'apparaît que par <Tex>{"\\ln |H|"}</Tex>. Mohri (section
          2.2) le lit comme un nombre de bits : <Tex>{"\\log_2 |H|"}</Tex> bits suffisent pour désigner un modèle de
          la classe. Un réseau de <Tex>W</Tex> paramètres stockés en float32 s'écrit avec <Tex>{"32W"}</Tex> bits,
          donc il existe au plus <Tex>{"2^{32W}"}</Tex> réseaux différents, et{" "}
          <Tex>{"\\ln|H| \\le 32 W \\ln 2"}</Tex>. Appliquons la borne au réseau Inception du tableau 1 de Zhang et
          al. (2017), entraîné sur les 50 000 images de CIFAR10.
        </p>
        <pre>
          <code>{`from math import log, sqrt

def ecart(log_H, m, delta=0.05):  # écart garanti entre risque et risque empirique, classe finie
    return sqrt((log_H + log(2 / delta)) / (2 * m))

W = 1_649_402                          # paramètres d'Inception (Zhang et al., tableau 1)
log_H = 32 * W * log(2)                # au plus 2^(32 W) réseaux distincts en float32
print(round(ecart(log_H, 50_000), 1))                       # sur les 50 000 images de CIFAR10
print(f"{(log_H + log(2 / 0.05)) / (2 * 0.05**2):.1e}")      # images pour un écart de 0,05
# 19.1
# 7.3e+09`}</code>
        </pre>
        <p>
          La borne garantit un écart d'au plus 19 entre risque et risque empirique, alors qu'un risque ne dépasse
          jamais 1 : elle ne dit rien. Pour qu'elle garantisse 5 points, il faudrait 7 milliards d'images. Pourtant,
          ce réseau atteint 89 % de précision en test. Zhang et al. ont montré pourquoi ces bornes ne peuvent pas
          l'expliquer : les mêmes réseaux apprennent <em>parfaitement</em> des étiquettes tirées au hasard, avec 100 %
          de précision d'entraînement et environ 10 % en test, le hasard pour 10 classes. La classe est assez riche pour tout mémoriser ; une borne qui ne
          regarde que la classe ne peut donc pas distinguer les vraies étiquettes du bruit.
        </p>
        <p>
          La leçon reste utile dans les deux sens. Une classe plus riche approche mieux la vraie règle, mais coûte plus
          cher en données : le risque se coupe en une <strong>erreur d'approximation</strong>, due au choix de{" "}
          <Tex>H</Tex>, et une <strong>erreur d'estimation</strong>, due au nombre fini d'exemples (Mohri, équation
          4.1 ; Vershynin, remarque 8.4.7). Et ces bornes s'appliquent pleinement là où <Tex>{"|H|"}</Tex> est
          vraiment petit : choisir parmi quelques réglages d'hyperparamètres avec un jeu de validation, par exemple.
          Le chapitre suivant remplace <Tex>{"\\ln |H|"}</Tex>, infini pour un classifieur linéaire à coefficients
          réels, par la dimension VC.
        </p>
      </section>
    </LessonFlow>
  );
}
