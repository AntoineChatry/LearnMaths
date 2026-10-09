import { LessonFlow } from "../../components/LessonFlow";
import { Tex } from "../../components/Tex";
import { GrowthViz } from "./GrowthViz";

export function VcDimensionLesson() {
  return (
    <LessonFlow>
      <section className="section">
        <span className="section-num">1</span>
        <h2>Compter les étiquetages, pas les modèles</h2>
        <p>
          Un classifieur linéaire du plan, <Tex>{"h(x) = \\mathbf 1[w \\cdot x + b \\ge 0]"}</Tex>, a une infinité
          de réglages : <Tex>{"\\ln |H| = \\infty"}</Tex> et la borne du chapitre précédent ne dit rien. Pourtant,
          sur <Tex>m</Tex> exemples donnés, seule compte la façon dont les modèles les étiquettent, et il n'y a
          jamais que <Tex>{"2^m"}</Tex> étiquetages possibles. La <strong>fonction de croissance</strong> compte
          ceux que la classe réalise vraiment, sur les <Tex>m</Tex> points les plus favorables (Mohri,
          définition 3.6 ; Vershynin, définition 8.3.10) :
        </p>
        <Tex block>{"\\Pi_H(m) = \\max_{x_1, \\dots, x_m} \\Big|\\big\\{ \\big(h(x_1), \\dots, h(x_m)\\big) : h \\in H \\big\\}\\Big| \\le 2^m"}</Tex>
        <p>
          Quand la classe réalise les <Tex>{"2^m"}</Tex> étiquetages d'un ensemble de points, on dit qu'elle le{" "}
          <strong>pulvérise</strong> (<em>shatters</em>). La <strong>dimension VC</strong>, pour Vapnik et
          Chervonenkis, est la taille du plus grand ensemble pulvérisé (Mohri, définition 3.10 ; Vershynin,
          définition 8.3.1) :
        </p>
        <Tex block>{"\\mathrm{VC}(H) = \\max\\{ m : \\Pi_H(m) = 2^m \\}"}</Tex>
        <p>
          Comptons, par force brute, les étiquetages réalisés par deux classes : les intervalles{" "}
          <Tex>{"\\mathbf 1[a \\le x \\le b]"}</Tex> de la droite, et les demi-plans, dont chaque étiquetage se teste
          par un programme linéaire.
        </p>
        <pre>
          <code>{`import itertools
import numpy as np
from scipy.optimize import linprog

def intervalle(y):  # réalisable par un intervalle [a, b] : les 1 forment un seul bloc
    return "0" not in "".join(map(str, y)).strip("0")

def demi_plan(X, y):  # existe-t-il w, b avec w.x + b >= 1 sur les 1 et <= -1 sur les 0 ? (programme linéaire)
    s = 2 * np.array(y) - 1
    A = -s[:, None] * np.hstack([X, np.ones((len(X), 1))])
    res = linprog(np.zeros(3), A_ub=A, b_ub=-np.ones(len(X)), bounds=(None, None))
    return res.status == 0

rng = np.random.default_rng(0)
for m in range(1, 7):
    X = rng.normal(size=(m, 2))                       # m points du plan, en position générale
    etiquetages = list(itertools.product([0, 1], repeat=m))
    print(m, 2**m, sum(map(intervalle, etiquetages)), sum(demi_plan(X, y) for y in etiquetages))
# 1 2 2 2
# 2 4 4 4
# 3 8 7 8
# 4 16 11 14
# 5 32 16 22
# 6 64 22 32`}</code>
        </pre>
        <p>
          Les intervalles réalisent tout jusqu'à 2 points, puis ratent l'étiquetage <Tex>{"(1, 0, 1)"}</Tex> : leur
          dimension VC vaut 2 (Mohri, exemple 3.11 ; Vershynin, exemple 8.3.2). Les demi-plans pulvérisent 3 points,
          mais jamais 4 : si les quatre points forment un quadrilatère convexe, aucune droite ne sépare une
          diagonale de l'autre ; si l'un est à l'intérieur du triangle des trois autres, aucune ne l'isole. D'où la
          dimension 3 (Mohri, exemple 3.12 ; Vershynin, exemple 8.3.3). Plus généralement, les
          demi-espaces de <Tex>{"\\mathbb R^n"}</Tex> ont pour dimension VC <Tex>{"n + 1"}</Tex>, le nombre de leurs
          paramètres <Tex>w</Tex> et <Tex>b</Tex> (Vershynin, exemple 8.3.5 ; Mohri, exemple 3.12). Le même
          raisonnement donne 4 pour les rectangles à côtés parallèles aux axes, qui pulvérisent quatre points en
          losange, et <Tex>{"2d + 1"}</Tex> pour les polygones convexes à <Tex>d</Tex> sommets, avec des points
          placés sur un cercle (Mohri, exemples 3.14 et 3.15). Attention au sens de la définition :
          il suffit d'<em>un</em> ensemble de <Tex>d</Tex> points pulvérisé, pas de tous ; trois points alignés ne le
          sont pas par les demi-plans.
        </p>
      </section>

      <section className="section">
        <span className="section-num">2</span>
        <h2>Le lemme de Sauer : polynomial ou exponentiel</h2>
        <p>
          Dans le tableau, au-delà de la dimension VC, les comptes décrochent de <Tex>{"2^m"}</Tex>. Le{" "}
          <strong>lemme de Sauer</strong> dit de combien, quelle que soit la classe : si{" "}
          <Tex>{"\\mathrm{VC}(H) = d"}</Tex>, alors pour tout <Tex>m</Tex> (Mohri, théorème 3.17 ; Vershynin,
          lemme 8.3.9), et en particulier dès que <Tex>{"m \\ge d"}</Tex> (Mohri, corollaire 3.18) :
        </p>
        <Tex block>{"\\Pi_H(m) \\le \\sum_{i=0}^{d} \\binom{m}{i} \\le \\Big(\\frac{em}{d}\\Big)^d"}</Tex>
        <p>
          Il n'y a donc que deux régimes : une dimension VC infinie, et <Tex>{"\\Pi_H(m) = 2^m"}</Tex> pour tout{" "}
          <Tex>m</Tex> ; ou une dimension <Tex>d</Tex> finie, et une croissance polynomiale, en{" "}
          <Tex>{"O(m^d)"}</Tex>. La borne est exacte pour les intervalles :{" "}
          <Tex>{"1 + m + \\binom m2"}</Tex> donne bien 7, 11, 16, 22. Pour les demi-plans, <Tex>{"d = 3"}</Tex> :
        </p>
        <pre>
          <code>{`from math import comb, e

def sauer(m, d):  # borne du lemme de Sauer : nombre de sous-ensembles d'au plus d points parmi m
    return sum(comb(m, i) for i in range(d + 1))

d = 3                                      # demi-plans du plan
for m in [3, 4, 10, 100, 1000]:
    print(m, f"{2**m:.1e}", sauer(m, d), f"{(e * m / d)**d:.1e}")
# 3 8.0e+00 8 2.0e+01
# 4 1.6e+01 15 4.8e+01
# 10 1.0e+03 176 7.4e+02
# 100 1.3e+30 166751 7.4e+05
# 1000 1.1e+301 166667501 7.4e+08`}</code>
        </pre>
        <p>
          À 4 points, la borne donne 15, pour les 14 étiquetages trouvés plus haut. À 100 points, une classe
          infinie ne réalise qu'au plus 166 751 étiquetages parmi <Tex>{"10^{30}"}</Tex> : vue à travers les
          données, elle se comporte comme une classe finie de cette taille.
        </p>
        <GrowthViz />
      </section>

      <section className="section">
        <span className="section-num">3</span>
        <h2>La borne VC</h2>
        <p>
          En substance, la preuve remplace <Tex>{"|H|"}</Tex> par <Tex>{"\\Pi_H(m)"}</Tex>, le nombre de modèles
          que les données peuvent distinguer (Mohri passe par la complexité de Rademacher, section 3.1), puis Sauer
          donne{" "}
          <Tex>{"\\ln \\Pi_H(m) \\le d \\ln(em/d)"}</Tex>. Pour une classe de dimension VC <Tex>d</Tex>, avec
          probabilité au moins <Tex>{"1 - \\delta"}</Tex>, pour tout <Tex>{"h \\in H"}</Tex> (Mohri, corollaire
          3.19) :
        </p>
        <Tex block>{"R(h) \\le \\hat R_S(h) + \\sqrt{\\frac{2d \\ln(em/d)}{m}} + \\sqrt{\\frac{\\ln(1/\\delta)}{2m}}"}</Tex>
        <p>
          Le terme principal ne dépend que du rapport <Tex>{"m/d"}</Tex>, à un logarithme près (Mohri,
          équation 3.30) ; Vershynin (théorème 8.4.5) l'énonce pour la minimisation du risque empirique, avec une
          constante <Tex>C</Tex> non précisée : <Tex>{"\\mathbb E\\,R(\\hat h) \\le R(h^*) + C\\sqrt{d/m}"}</Tex>.
          Reprenons l'expérience des étiquettes à pile ou face, avec cette fois une classe infinie : tous les
          intervalles. Les <Tex>m</Tex> points sont rangés dans l'ordre, et le meilleur intervalle se trouve en un
          seul passage, comme un sous-tableau de somme maximale.
        </p>
        <pre>
          <code>{`import numpy as np
from math import e, log, sqrt

def ecart_vc(d, m, delta):  # Mohri, corollaire 3.19
    return sqrt(2 * d * log(e * m / d) / m) + sqrt(log(1 / delta) / (2 * m))

def meilleur_intervalle(y):  # ERM sur les intervalles : erreurs = nb de 1 - max(0, meilleur bloc de (+1 pour 1, -1 pour 0))
    s = 2 * y - 1
    meilleur = courant = 0
    for v in s:
        courant = max(0, courant + v)
        meilleur = max(meilleur, courant)
    return (y.sum() - meilleur) / len(y)

rng = np.random.default_rng(0)
delta = 0.05
for m in [50, 200, 1000, 5000]:
    erreurs = np.array([meilleur_intervalle(rng.integers(0, 2, m)) for _ in range(2000)])
    plancher = 0.5 - ecart_vc(2, m, delta)
    print(m, np.median(erreurs), round(plancher, 3), np.mean(erreurs < plancher))
# 50 0.34 -0.254 0.0
# 200 0.42 0.079 0.0
# 1000 0.462 0.291 0.0
# 5000 0.4828 0.399 0.0`}</code>
        </pre>
        <p>
          Avec 50 points, le meilleur intervalle descend à 34 % d'erreurs d'entraînement pour 50 % de risque :
          même sur-apprentissage qu'au chapitre précédent. Mais l'écart se referme quand <Tex>m</Tex> grandit,
          alors que la classe est infinie, et le plancher <Tex>{"0{,}5 - \\varepsilon"}</Tex> de la borne n'est
          jamais franchi. Pour <Tex>{"m = 50"}</Tex>, la borne est vide (plancher négatif) ; elle devient utile
          quand <Tex>m</Tex> vaut quelques centaines de fois <Tex>d</Tex>.
        </p>
      </section>

      <section className="section">
        <span className="section-num">4</span>
        <h2>Dimension VC et nombre de paramètres</h2>
        <p>
          Pour les demi-espaces, la dimension VC est le nombre de paramètres. C'est souvent le cas, approximativement,
          mais ce n'est pas une règle (Vershynin, remarque 8.3.6). Mohri (exemple 3.16 et exercice 3.20) donne un
          contre-exemple frappant : des sinusoïdes réglées par <em>un seul</em> paramètre <Tex>\omega</Tex> ont une
          dimension VC infinie. Prenons les classifieurs{" "}
          <Tex>{"h_\\omega(x) = \\mathbf 1[\\sin(\\omega x) > 0]"}</Tex>. Sur les points{" "}
          <Tex>{"x_i = 10^{-i}"}</Tex>, la fréquence{" "}
          <Tex>{"\\omega = \\pi\\big(1 + \\sum_i (1 - y_i)\\, 10^i\\big)"}</Tex> réalise n'importe quel étiquetage{" "}
          <Tex>y</Tex> : chaque chiffre décimal de <Tex>\omega</Tex> règle un point.
        </p>
        <pre>
          <code>{`import itertools
from mpmath import mp, mpf, pi, sin

mp.dps = 60                                     # omega devient énorme : calcul en haute précision

def omega(y):  # la fréquence qui réalise l'étiquetage y sur les points x_i = 10^(-i)
    return pi * (1 + sum((1 - yi) * 10**i for i, yi in enumerate(y, 1)))

for m in [3, 6, 10]:
    x = [mpf(10) ** -i for i in range(1, m + 1)]
    reussis = sum(
        all((sin(omega(y) * xi) > 0) == bool(yi) for xi, yi in zip(x, y))
        for y in itertools.product([0, 1], repeat=m)
    )
    print(m, 2**m, reussis)
# 3 8 8
# 6 64 64
# 10 1024 1024`}</code>
        </pre>
        <p>
          Tous les étiquetages sont réalisés : un paramètre réel contient une infinité de chiffres, donc assez
          d'information pour mémoriser n'importe quoi. La capacité se mesure par ce que la classe peut réaliser, pas
          par son nombre de boutons.
        </p>
        <p>
          La dimension VC n'est pas seulement une majoration commode : elle est nécessaire. Pour toute classe de
          dimension <Tex>{"d > 1"}</Tex> et <em>tout</em> algorithme, il existe une loi des données pour laquelle, si{" "}
          <Tex>{"m < d / (320\\,\\varepsilon^2)"}</Tex>, l'excès de risque dépasse <Tex>\varepsilon</Tex> avec une
          probabilité au moins <Tex>{"1/64"}</Tex> (Mohri, théorème 3.23). Il faut donc un nombre d'exemples
          proportionnel à <Tex>d</Tex>, à <Tex>\varepsilon</Tex> fixé. C'est aussi la limite de ces bornes pour
          les réseaux profonds : puisqu'ils apprennent parfaitement des étiquettes au hasard, leur capacité suffit
          à pulvériser les données d'entraînement, et Zhang et al. (2017, section 2.2) concluent que la dimension
          VC, comme la complexité de Rademacher, ne peut pas expliquer leur généralisation. Le chapitre suivant regarde un autre aspect de la grande dimension : la géométrie des vecteurs
          eux-mêmes.
        </p>
      </section>
    </LessonFlow>
  );
}
