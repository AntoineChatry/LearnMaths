import { LessonFlow } from "../../components/LessonFlow";
import { Tex } from "../../components/Tex";
import { CltViz } from "./CltViz";

export function GrandsNombresLesson() {
  return (
    <LessonFlow>
      <section className="section">
        <span className="section-num">1</span>
        <h2>L'inégalité de Tchebychev : la variance borne les écarts</h2>
        <p>
          Pour toute variable <Tex>X</Tex> d'espérance <Tex>\mu</Tex> et de variance finie, et tout{" "}
          <Tex>{"\\varepsilon > 0"}</Tex> (Grinstead et Snell, théorème 8.1) :
        </p>
        <Tex block>{"P(|X - \\mu| \\ge \\varepsilon) \\le \\frac{V(X)}{\\varepsilon^2}"}</Tex>
        <p>
          La preuve tient en une ligne : dans la somme <Tex>{"V(X) = \\sum_x (x - \\mu)^2 p(x)"}</Tex>, on ne garde que
          les <Tex>x</Tex> à distance au moins <Tex>\varepsilon</Tex>, chacun contribuant au moins{" "}
          <Tex>{"\\varepsilon^2 p(x)"}</Tex>. Avec <Tex>{"\\varepsilon = k\\sigma"}</Tex> (exemple 8.1), s'écarter de
          plus de <Tex>k</Tex> écarts types arrive avec probabilité au plus <Tex>{"1/k^2"}</Tex>, quelle que soit la
          loi. Le prix de cette généralité : la borne est grossière. Pour une gaussienne, les vraies valeurs sont bien
          plus petites.
        </p>
        <pre>
          <code>{`from math import erf, sqrt

# Tchebychev : P(|X - mu| >= k sigma) <= 1/k², pour toute loi
for k in (1.5, 2, 3):
    gauss = 1 - erf(k / sqrt(2))  # valeur exacte pour une gaussienne
    print(k, round(1 / k**2, 3), round(gauss, 4))
# 1.5 0.444 0.1336
# 2 0.25 0.0455
# 3 0.111 0.0027`}</code>
        </pre>
        <p>
          Grinstead et Snell font la même comparaison (exemple 8.3) : pour la moyenne de 100 essais de Bernoulli de
          paramètre 0,3, Tchebychev garantit une probabilité au moins 0,79 de tomber entre 0,2 et 0,4, alors que la
          vraie valeur est 0,9625.
        </p>
      </section>

      <section className="section">
        <span className="section-num">2</span>
        <h2>La loi des grands nombres</h2>
        <p>
          Soit <Tex>{"X_1, X_2, \\dots"}</Tex> des variables indépendantes de même loi, d'espérance <Tex>\mu</Tex> et de
          variance <Tex>{"\\sigma^2"}</Tex> finie, et <Tex>{"A_n = (X_1 + \\dots + X_n)/n"}</Tex> leur moyenne. Le
          chapitre 4 a donné <Tex>{"E(A_n) = \\mu"}</Tex> et <Tex>{"V(A_n) = \\sigma^2/n"}</Tex>. Tchebychev donne
          alors <Tex>{"P(|A_n - \\mu| \\ge \\varepsilon) \\le \\sigma^2/(n\\varepsilon^2)"}</Tex>, qui tend vers 0 :
        </p>
        <Tex block>{"\\text{pour tout } \\varepsilon > 0, \\qquad P\\big(|A_n - \\mu| \\ge \\varepsilon\\big) \\xrightarrow[n \\to \\infty]{} 0"}</Tex>
        <p>
          C'est la <strong>loi des grands nombres</strong> (théorème 8.2), que Jacques Bernoulli fut le premier à
          démontrer, dans l'<em>Ars Conjectandi</em> publié en 1713. Elle justifie l'interprétation de l'espérance
          comme moyenne à long terme, et toutes les estimations par simulation, dites de{" "}
          <strong>Monte-Carlo</strong> : pour estimer <Tex>{"E(g(X))"}</Tex>, on moyenne <Tex>{"g"}</Tex> sur beaucoup
          de tirages, avec une erreur typique <Tex>{"\\sigma/\\sqrt n"}</Tex>. Gagner un chiffre de précision coûte 100
          fois plus de tirages.
        </p>
        <p>
          <strong>L'hypothèse de variance finie compte.</strong> Pour la loi de Cauchy, qui n'a pas d'espérance
          (chapitre 5), la moyenne de <Tex>n</Tex> tirages suit encore exactement la loi de Cauchy, quel que soit{" "}
          <Tex>n</Tex> (exemples 7.6 et 8.8) : moyenner ne sert à rien. Ci-dessous, pour chaque <Tex>n</Tex>, on
          répète 2000 fois la moyenne et on mesure sa dispersion par l'écart interquartile.
        </p>
        <pre>
          <code>{`import numpy as np

rng = np.random.default_rng(0)
ecart = lambda m: np.subtract(*np.percentile(m, [75, 25]))
for n in (10, 100, 1_000, 10_000):
    de = rng.integers(1, 7, size=(2_000, n)).mean(axis=1)
    cauchy = rng.standard_cauchy(size=(2_000, n)).mean(axis=1)
    print(n, ecart(de).round(3), ecart(cauchy).round(2))
# 10 0.8 1.87
# 100 0.23 1.99
# 1000 0.074 2.03
# 10000 0.023 1.85`}</code>
        </pre>
        <p>
          Pour le dé, la dispersion est divisée par environ 3 (<Tex>{"\\sqrt{10}"}</Tex>) chaque fois que{" "}
          <Tex>n</Tex> est multiplié par 10. Pour Cauchy, elle reste autour de 2, l'écart interquartile de la loi de
          Cauchy standard.
        </p>
      </section>

      <section className="section">
        <span className="section-num">3</span>
        <h2>Le théorème central limite</h2>
        <p>
          La loi des grands nombres dit que <Tex>{"A_n"}</Tex> se concentre autour de <Tex>\mu</Tex>, à l'échelle{" "}
          <Tex>{"\\sigma/\\sqrt n"}</Tex>. Le <strong>théorème central limite</strong> dit quelle forme prend la loi à
          cette échelle : une gaussienne, quelle que soit la loi de départ, pourvu que la variance soit finie. Pour
          une somme <Tex>{"S_n = X_1 + \\dots + X_n"}</Tex> de variables indépendantes de même loi (Grinstead et Snell,
          théorèmes 9.4 et 9.6) :
        </p>
        <Tex block>{"P\\left(a < \\frac{S_n - n\\mu}{\\sigma\\sqrt n} < b\\right) \\xrightarrow[n \\to \\infty]{} \\frac{1}{\\sqrt{2\\pi}} \\int_a^b e^{-x^2/2}\\, dx"}</Tex>
        <p>
          Autrement dit, <Tex>{"S_n"}</Tex> est approximativement <Tex>{"\\mathcal N(n\\mu, n\\sigma^2)"}</Tex> et{" "}
          <Tex>{"A_n"}</Tex> approximativement <Tex>{"\\mathcal N(\\mu, \\sigma^2/n)"}</Tex>. C'est pourquoi tant de
          mesures qui résultent de nombreux petits effets indépendants ont une allure gaussienne.
        </p>
        <CltViz />
        <p>
          <strong>Exemple 9.5.</strong> On lance 420 fois un dé ; quelle est la probabilité que la somme soit comprise
          entre 1400 et 1550 ? Ici <Tex>{"E(S) = 420 \\times 7/2 = 1470"}</Tex> et{" "}
          <Tex>{"\\sigma(S) = \\sqrt{420 \\times 35/12} = 35"}</Tex>. Les bornes sont à −2 et +2,29 écarts types, et
          l'approximation normale donne 0,966. La loi exacte, obtenue par 420 convolutions, donne 0,967.
        </p>
        <pre>
          <code>{`import numpy as np
from math import erf, sqrt

Phi = lambda z: (1 + erf(z / sqrt(2))) / 2
loi = np.full(6, 1 / 6)             # un dé, valeurs 1 à 6
somme = np.array([1.0])
for _ in range(420):                # loi exacte de S_420
    somme = np.convolve(somme, loi)
valeurs = np.arange(420, 420 * 6 + 1)
exact = somme[(valeurs >= 1400) & (valeurs <= 1550)].sum()
approx = Phi((1550 - 1470) / 35) - Phi((1400 - 1470) / 35)
print(round(exact, 4), round(approx, 4))
# 0.9673 0.9661`}</code>
        </pre>
      </section>

      <section className="section">
        <span className="section-num">4</span>
        <h2>Barres d'erreur et taille de minibatch</h2>
        <p>
          <strong>Intervalle de confiance.</strong> Un classifieur obtient une proportion <Tex>{"\\hat p"}</Tex> de
          bonnes réponses sur <Tex>n</Tex> exemples de test. Par le théorème central limite,{" "}
          <Tex>{"\\hat p"}</Tex> est approximativement gaussien de moyenne la vraie précision <Tex>p</Tex> et d'écart
          type <Tex>{"\\sqrt{p(1-p)/n}"}</Tex> ; il tombe à moins de deux écarts types de <Tex>p</Tex> avec
          probabilité 0,954. D'où l'intervalle de confiance à 95 %{" "}
          <Tex>{"\\hat p \\pm 2\\sqrt{\\hat p(1 - \\hat p)/n}"}</Tex> (Grinstead et Snell, section 9.1). Comme{" "}
          <Tex>{"p(1-p) \\le 1/4"}</Tex>, une marge de ±3 points est garantie dès <Tex>{"n \\ge 1111"}</Tex>. La marge
          ne décroît qu'en <Tex>{"1/\\sqrt n"}</Tex> : la diviser par 6, pour départager deux modèles à 0,5 point
          d'écart, demande 36 fois plus d'exemples, soit environ 40 000.
        </p>
        <p>
          <strong>Le bruit du gradient.</strong> McCandlish et al. (2018, équation 2.2) repartent du résultat du
          chapitre 4 en dimension <Tex>D</Tex> : le gradient d'un minibatch de <Tex>B</Tex> exemples tirés
          indépendamment a pour espérance le vrai gradient <Tex>G</Tex> et pour matrice de covariance{" "}
          <Tex>{"\\Sigma/B"}</Tex>, où <Tex>\Sigma</Tex> est la covariance des gradients par exemple. L'erreur
          relative moyenne vaut donc (équation 2.10) :
        </p>
        <Tex block>{"\\frac{E\\big(\\|G_{\\text{est}} - G\\|^2\\big)}{\\|G\\|^2} = \\frac{B_{\\text{simple}}}{B} \\qquad B_{\\text{simple}} = \\frac{\\text{tr}(\\Sigma)}{\\|G\\|^2}"}</Tex>
        <p>
          Leur analyse d'un pas de descente (équation 2.7) montre que le gain espéré par pas est proportionnel à{" "}
          <Tex>{"1/(1 + B_{\\text{noise}}/B)"}</Tex>, où <Tex>{"B_{\\text{noise}}"}</Tex> généralise{" "}
          <Tex>{"B_{\\text{simple}}"}</Tex> en tenant compte de la hessienne (les deux coïncident quand la hessienne
          est un multiple de l'identité). Bien en dessous de cette échelle de bruit, doubler <Tex>B</Tex> double
          presque le progrès par pas ; bien au-dessus, on paie deux fois plus de calcul pour presque rien. Les auteurs
          mesurent que cette échelle prédit, à l'ordre de grandeur près, la plus grande taille de minibatch utile
          sur les tâches qu'ils testent.
        </p>
        <pre>
          <code>{`import numpy as np

rng = np.random.default_rng(0)
N, D = 50_000, 10
X = rng.standard_normal((N, D))
y = X @ np.ones(D) + rng.standard_normal(N)  # régression linéaire
theta = np.full(D, 0.5)                       # point courant
g_ex = (X @ theta - y)[:, None] * X           # un gradient par exemple
G = g_ex.mean(axis=0)                         # vrai gradient
B_simple = np.trace(np.cov(g_ex, rowvar=False)) / (G @ G)
print(round(B_simple, 1))
for B in (1, 8, 64, 512):
    idx = rng.integers(0, N, size=(2_000, B))
    G_est = g_ex[idx].mean(axis=1)
    err = np.mean(np.sum((G_est - G) ** 2, axis=1)) / (G @ G)
    print(B, round(err, 3), round(B_simple / B, 3))
# 15.1
# 1 15.263 15.095
# 8 1.934 1.887
# 64 0.232 0.236
# 512 0.029 0.029`}</code>
        </pre>
        <p>
          L'erreur relative mesurée suit <Tex>{"B_{\\text{simple}}/B"}</Tex>. Ici <Tex>{"B_{\\text{simple}} \\approx 15"}</Tex>{" "}
          : avec un minibatch de 1, le bruit est 15 fois plus gros que le signal, et au-delà de quelques centaines
          d'exemples, le gradient est déjà presque exact. McCandlish et al. observent aussi que l'échelle de bruit
          grandit au fil de l'entraînement, à mesure que la perte baisse : les minibatchs utiles grossissent.
        </p>
      </section>
    </LessonFlow>
  );
}
