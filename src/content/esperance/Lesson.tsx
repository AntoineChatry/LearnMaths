import { LessonFlow } from "../../components/LessonFlow";
import { Tex } from "../../components/Tex";
import { BalanceViz } from "./BalanceViz";

export function EsperanceLesson() {
  return (
    <LessonFlow>
      <section className="section">
        <span className="section-num">1</span>
        <h2>L'espérance, une moyenne pondérée par les probabilités</h2>
        <p>
          L'<strong>espérance</strong> d'une variable aléatoire discrète <Tex>X</Tex> de fonction de masse{" "}
          <Tex>{"p"}</Tex> est la moyenne de ses valeurs, chacune pondérée par sa probabilité (Grinstead et Snell,
          définition 6.1) :
        </p>
        <Tex block>{"E(X) = \\sum_x x\\, p(x)"}</Tex>
        <p>
          On la note aussi <Tex>\mu</Tex>. <strong>Exemple</strong> (exemple 6.1) : <Tex>X</Tex> compte les piles en
          trois lancers d'une pièce équilibrée, de loi <Tex>{"\\frac18, \\frac38, \\frac38, \\frac18"}</Tex> sur{" "}
          <Tex>{"0, 1, 2, 3"}</Tex>, d'où{" "}
          <Tex>{"E(X) = 0 \\cdot \\frac18 + 1 \\cdot \\frac38 + 2 \\cdot \\frac38 + 3 \\cdot \\frac18 = \\frac32"}</Tex>.
          L'espérance n'est pas forcément une valeur possible : on n'obtient jamais 1,5 pile. C'est la moyenne vers
          laquelle tendent les résultats quand on répète l'expérience un grand nombre de fois, ce que le chapitre 8
          démontrera.
        </p>
        <p>
          Pour la loi géométrique (rang du premier succès, paramètre <Tex>p</Tex>), la série se calcule en dérivant la
          série géométrique et donne <Tex>{"E(T) = 1/p"}</Tex> (exemple 6.4) : il faut en moyenne 6 lancers pour
          obtenir un 6. La somme doit converger absolument, sinon <Tex>X</Tex> n'a pas d'espérance. C'est le{" "}
          <strong>paradoxe de Saint-Pétersbourg</strong> (exemple 6.3) : on lance une pièce jusqu'au premier pile, et
          s'il arrive au lancer <Tex>n</Tex> on gagne <Tex>{"2^n"}</Tex> euros. Chaque terme{" "}
          <Tex>{"2^n \\cdot 2^{-n}"}</Tex> vaut 1, la somme diverge, et aucune mise fixe ne serait « trop chère » en
          espérance.
        </p>
        <pre>
          <code>{`from fractions import Fraction
from itertools import product
import numpy as np

# X = nombre de piles en trois lancers : espérance exacte
omega = list(product((0, 1), repeat=3))  # 8 issues
E = sum(Fraction(sum(w), 8) for w in omega)
rng = np.random.default_rng(0)
x = rng.integers(0, 2, size=(100_000, 3)).sum(axis=1)
T = rng.geometric(1 / 6, size=100_000)  # lancers jusqu'au 6
print(E, x.mean(), T.mean())
# 3/2 1.49942 6.02972`}</code>
        </pre>
        <p>
          La formule vaut aussi pour une fonction de <Tex>X</Tex> : pour calculer <Tex>{"E(g(X))"}</Tex>, pas besoin
          de chercher la loi de <Tex>{"g(X)"}</Tex>, on pondère directement les <Tex>{"g(x)"}</Tex> (Grinstead et
          Snell, théorème 6.1 ; MML, définition 6.3) :
        </p>
        <Tex block>{"E\\big(g(X)\\big) = \\sum_x g(x)\\, p(x)"}</Tex>
        <p>
          MML signale que ce résultat porte le nom de « loi du statisticien inconscient ». En général,{" "}
          <Tex>{"E(g(X)) \\ne g(E(X))"}</Tex> : pour un dé, <Tex>{"E(X) = 7/2"}</Tex> mais{" "}
          <Tex>{"E(X^2) = 91/6 \\approx 15{,}2"}</Tex>, et non <Tex>{"49/4 = 12{,}25"}</Tex>.
        </p>
      </section>

      <section className="section">
        <span className="section-num">2</span>
        <h2>Linéarité : l'espérance d'une somme, sans indépendance</h2>
        <p>
          Pour toutes variables <Tex>X</Tex> et <Tex>Y</Tex> ayant une espérance et toute constante <Tex>c</Tex>{" "}
          (Grinstead et Snell, théorème 6.2) :
        </p>
        <Tex block>{"E(X + Y) = E(X) + E(Y) \\qquad E(cX) = c\\,E(X)"}</Tex>
        <p>
          La preuve n'utilise que la définition : il n'y a <strong>aucune hypothèse d'indépendance</strong>. Le livre
          rapporte qu'on l'appelle parfois « le premier mystère fondamental des probabilités ». Il permet de calculer l'espérance d'un
          compte sans connaître sa loi : on écrit le compte comme une somme d'indicatrices, et{" "}
          <Tex>{"E(I_A) = P(A)"}</Tex>.
        </p>
        <ul>
          <li>
            <strong>Binomiale</strong> (théorème 6.3). Le nombre de succès en <Tex>n</Tex> essais est{" "}
            <Tex>{"X_1 + \\dots + X_n"}</Tex>, où <Tex>{"X_j"}</Tex> vaut 1 si l'essai <Tex>j</Tex> réussit. Chaque{" "}
            <Tex>{"X_j"}</Tex> a pour espérance <Tex>p</Tex>, donc <Tex>{"E(S_n) = np"}</Tex>. La loi de Poisson,
            limite de <Tex>{"\\text{Bin}(n, \\lambda/n)"}</Tex>, a pour espérance <Tex>\lambda</Tex>.
          </li>
          <li>
            <strong>Points fixes d'une permutation</strong> (après l'exemple 6.8). On mélange <Tex>n</Tex> cartes
            numérotées ; combien restent en moyenne à leur place ? La carte <Tex>i</Tex> reste en place avec
            probabilité <Tex>{"1/n"}</Tex>, donc l'espérance vaut <Tex>{"n \\times 1/n = 1"}</Tex>, quel que soit{" "}
            <Tex>n</Tex>. Les indicatrices sont pourtant dépendantes : si <Tex>{"n - 1"}</Tex> cartes sont en place, la
            dernière l'est aussi.
          </li>
        </ul>
        <pre>
          <code>{`import numpy as np

rng = np.random.default_rng(0)
for n in (3, 10, 1000):
    fixes = [np.sum(rng.permutation(n) == np.arange(n))
             for _ in range(20_000)]
    print(n, np.mean(fixes))
# 3 0.9951
# 10 0.99925
# 1000 1.003`}</code>
        </pre>
        <p>
          <strong>Le produit, lui, ne se sépare pas toujours.</strong> Si <Tex>X</Tex> et <Tex>Y</Tex> sont
          indépendantes, <Tex>{"E(XY) = E(X)\\,E(Y)"}</Tex> (théorème 6.4). L'indépendance suffit, mais elle n'est
          pas nécessaire : avec <Tex>X</Tex> uniforme sur <Tex>{"\\{-1, 0, 1\\}"}</Tex> et <Tex>{"Y = X^2"}</Tex>,
          on a <Tex>{"E(XY) = E(X^3) = 0 = E(X)\\,E(Y)"}</Tex> alors que <Tex>Y</Tex> est entièrement déterminée
          par <Tex>X</Tex>. Sans aucune hypothèse, l'égalité est fausse en général : avec{" "}
          <Tex>X</Tex> qui vaut 1 sur pile et 0 sur face, et <Tex>{"Y = 1 - X"}</Tex>, on a{" "}
          <Tex>{"XY = 0"}</Tex> toujours, alors que <Tex>{"E(X)\\,E(Y) = 1/4"}</Tex> (exemple 6.10).
        </p>
      </section>

      <section className="section">
        <span className="section-num">3</span>
        <h2>Variance et écart type : mesurer la dispersion</h2>
        <p>
          Deux lois peuvent avoir la même espérance et des allures très différentes. La <strong>variance</strong>{" "}
          mesure l'écart quadratique moyen à l'espérance (Grinstead et Snell, définition 6.3), et l'
          <strong>écart type</strong> <Tex>{"\\sigma = \\sqrt{V(X)}"}</Tex> la ramène dans l'unité de <Tex>X</Tex> :
        </p>
        <Tex block>{"V(X) = E\\big((X - \\mu)^2\\big) = \\sum_x (x - \\mu)^2\\, p(x) = E(X^2) - \\mu^2"}</Tex>
        <p>
          La dernière forme (théorème 6.6), « la moyenne des carrés moins le carré de la moyenne », donne pour un dé{" "}
          <Tex>{"V(X) = \\frac{91}{6} - \\left(\\frac72\\right)^2 = \\frac{35}{12}"}</Tex>. Dans la visualisation, la loi
          est une règle chargée de poids : l'espérance est son point d'équilibre, et l'écart type dit à quelle distance
          de ce point la masse se trouve en général.
        </p>
        <BalanceViz />
        <p>
          <strong>Règles de calcul.</strong> Décaler ne change pas la dispersion, multiplier par <Tex>c</Tex> la
          multiplie par <Tex>{"c^2"}</Tex> (théorème 6.7). Et si <Tex>X</Tex> et <Tex>Y</Tex> sont{" "}
          <strong>indépendantes</strong>, les variances s'ajoutent (théorème 6.8) :
        </p>
        <Tex block>{"V(cX + b) = c^2\\, V(X) \\qquad\\qquad V(X + Y) = V(X) + V(Y)"}</Tex>
        <p>
          Sans hypothèse, c'est faux : <Tex>{"V(X + X) = V(2X) = 4\\,V(X)"}</Tex>, pas{" "}
          <Tex>{"2\\,V(X)"}</Tex>. En développant le carré, on obtient en général{" "}
          <Tex>{"V(X + Y) = V(X) + V(Y) + 2\\big(E(XY) - E(X)\\,E(Y)\\big)"}</Tex> : les variances s'ajoutent
          exactement quand <Tex>{"E(XY) = E(X)\\,E(Y)"}</Tex> (variables <strong>non corrélées</strong>, voir le
          chapitre sur les lois jointes). L'indépendance est donc une condition suffisante, pas nécessaire : l'exemple{" "}
          <Tex>{"Y = X^2"}</Tex> ci-dessus a des variances additives sans être indépendant. Attention aussi au signe : <Tex>{"V(X - Y) = V(X) + V(Y)"}</Tex>, car{" "}
          <Tex>{"(-1)^2 = 1"}</Tex>. En sommant <Tex>n</Tex> indicatrices indépendantes de variance{" "}
          <Tex>{"p(1 - p)"}</Tex>, la binomiale a pour variance <Tex>{"np(1-p)"}</Tex>. La loi géométrique a pour
          variance <Tex>{"(1-p)/p^2"}</Tex> (exemple 6.19), soit 30 pour l'attente d'un 6, et la loi de Poisson{" "}
          <Tex>\lambda</Tex>, comme son espérance.
        </p>
        <p>
          <strong>Une formule juste, un calcul faux.</strong> MML (section 6.4.3, équation 6.44) note que{" "}
          <Tex>{"E(X^2) - \\mu^2"}</Tex> se calcule en une seule passe sur les données, mais peut être numériquement
          instable : si les deux termes sont énormes et presque égaux, la soustraction perd toute la précision des
          flottants. Sur quatre nombres proches de <Tex>{"10^9"}</Tex>, la variance « calculée » est négative :
        </p>
        <pre>
          <code>{`import numpy as np

x = 1e9 + np.array([4.0, 7.0, 13.0, 16.0])
print(np.mean((x - x.mean())**2))   # deux passes
print(np.mean(x**2) - x.mean()**2)  # moyenne des carrés - carré
# 22.5
# -128.0`}</code>
        </pre>
      </section>

      <section className="section">
        <span className="section-num">4</span>
        <h2>La perte est une espérance, le minibatch l'estime</h2>
        <p>
          La perte d'entraînement d'un modèle sur <Tex>N</Tex> exemples est la moyenne des pertes par exemple,{" "}
          <Tex>{"L = \\frac1N \\sum_{n=1}^N \\ell_n"}</Tex>. C'est une espérance : celle de <Tex>{"\\ell_I"}</Tex>{" "}
          quand l'indice <Tex>I</Tex> est tiré uniformément parmi les <Tex>N</Tex> exemples. Même chose pour son
          gradient. Calculer la somme complète à chaque pas coûte cher ; la descente de gradient stochastique la
          remplace par la moyenne sur un <strong>minibatch</strong> de <Tex>B</Tex> exemples tirés au hasard.
        </p>
        <p>
          MML (section 7.1.3) explique pourquoi c'est légitime : l'ingrédient clé est que le gradient utilisé soit
          une <strong>estimation sans biais</strong> du vrai gradient, c'est-à-dire que son espérance soit le vrai
          gradient. Ce n'est pas suffisant à lui seul : la remarque qui suit dans MML précise que la convergence
          demande aussi un pas d'apprentissage qui décroît au bon rythme, sous des hypothèses supplémentaires
          (conditions de Robbins et Monro, vues au chapitre sur les séries). Avec un pas constant, le bruit du
          minibatch empêche de se poser exactement sur le minimum. Pour <Tex>B</Tex> indices tirés indépendamment et uniformément, notons{" "}
          <Tex>{"\\sigma^2"}</Tex> la variance de <Tex>{"\\ell_I"}</Tex>. La linéarité de l'espérance et l'additivité
          des variances donnent (Grinstead et Snell, théorème 6.9) :
        </p>
        <Tex block>{"\\hat L_B = \\frac1B \\sum_{b=1}^B \\ell_{I_b} \\qquad E(\\hat L_B) = L \\qquad V(\\hat L_B) = \\frac{\\sigma^2}{B}"}</Tex>
        <p>
          L'estimation est juste en moyenne quelle que soit la taille du minibatch, et son écart type décroît comme{" "}
          <Tex>{"\\sigma / \\sqrt B"}</Tex> : quadrupler le minibatch ne divise le bruit que par 2. La simulation
          ci-dessous tire 20 000 minibatchs de chaque taille parmi 10 000 pertes inventées.
        </p>
        <pre>
          <code>{`import numpy as np

rng = np.random.default_rng(0)
N = 10_000
pertes = rng.exponential(1.0, size=N)  # une perte par exemple
L, s = pertes.mean(), pertes.std()
print(round(L, 3), round(s, 3))
for B in (1, 4, 16, 64, 256):
    idx = rng.integers(0, N, size=(20_000, B))  # 20 000 minibatchs
    est = pertes[idx].mean(axis=1)
    print(B, round(est.mean(), 3), round(est.std(), 3),
          round(s / B**0.5, 3))
# 0.993 0.998
# 1 1.006 1.019 0.998
# 4 0.993 0.491 0.499
# 16 0.993 0.249 0.249
# 64 0.991 0.125 0.125
# 256 0.992 0.062 0.062`}</code>
        </pre>
        <p>
          La deuxième colonne reste autour de <Tex>{"L \\approx 0{,}993"}</Tex> : pas de biais. La troisième, l'écart
          type mesuré des estimations, suit la quatrième, la prédiction <Tex>{"\\sigma/\\sqrt B"}</Tex>. Le chapitre 8
          dira à quoi ressemble la loi de <Tex>{"\\hat L_B"}</Tex> quand <Tex>B</Tex> grandit.
        </p>
      </section>
    </LessonFlow>
  );
}
