import { LessonFlow } from "../../components/LessonFlow";
import { Tex } from "../../components/Tex";
import { TailViz } from "./TailViz";

export function HoeffdingLesson() {
  return (
    <LessonFlow>
      <section className="section">
        <span className="section-num">1</span>
        <h2>Markov et Tchebychev : des bornes qui marchent toujours, mais mal</h2>
        <p>
          On mesure la précision d'un modèle sur <Tex>N</Tex> exemples de test et on trouve 91 %. Quelle confiance
          accorder à ce chiffre ? La loi des grands nombres dit que la moyenne converge vers la vraie précision, mais
          pas à quelle vitesse pour un <Tex>N</Tex> donné. Les <strong>inégalités de concentration</strong> répondent
          : elles bornent la probabilité qu'une moyenne s'écarte de son espérance, pour tout <Tex>N</Tex>.
        </p>
        <p>
          La plus simple est l'<strong>inégalité de Markov</strong> : si <Tex>{"X \\ge 0"}</Tex>, alors pour tout{" "}
          <Tex>{"t > 0"}</Tex> (Vershynin, <em>High-Dimensional Probability</em>, proposition 1.6.2 ; Mohri et al.,{" "}
          <em>Foundations of Machine Learning</em>, théorème C.11) :
        </p>
        <Tex block>{"P(X \\ge t) \\le \\frac{\\mathbb E[X]}{t}"}</Tex>
        <p>
          Preuve : <Tex>{"X \\ge t \\cdot \\mathbf 1_{X \\ge t}"}</Tex>, dont on prend l'espérance. Appliquée à{" "}
          <Tex>{"(X - \\mu)^2"}</Tex>, elle donne l'<strong>inégalité de Tchebychev</strong>, vue au chapitre Grands
          nombres (Vershynin, corollaire 1.6.3 ; Mohri, théorème C.13) :
        </p>
        <Tex block>{"P(|X - \\mu| \\ge t) \\le \\frac{\\operatorname{Var}(X)}{t^2}"}</Tex>
        <p>
          Testons-les sur la question 2.1.1 de Vershynin : en <Tex>N</Tex> lancers d'une pièce équilibrée, quelle est
          la probabilité d'obtenir au moins <Tex>{"\\tfrac34 N"}</Tex> piles ? Le nombre de piles <Tex>S</Tex> a pour
          espérance <Tex>{"N/2"}</Tex> et pour variance <Tex>{"N/4"}</Tex>. Markov donne{" "}
          <Tex>{"\\frac{N/2}{3N/4} = \\frac23"}</Tex>, Tchebychev{" "}
          <Tex>{"P(|S - \\tfrac N2| \\ge \\tfrac N4) \\le \\frac{N/4}{(N/4)^2} = \\frac4N"}</Tex>.
        </p>
        <pre>
          <code>{`from math import comb

def queue(N, k):  # P(S >= k) exacte, pour S le nombre de piles en N lancers d'une pièce équilibrée
    return sum(comb(N, j) for j in range(k, N + 1)) / 2**N

for N in [20, 100, 400]:
    k = 3 * N // 4                     # au moins 3/4 de piles
    markov = (N / 2) / k               # E[S] / k
    tchebychev = 4 / N                 # Var(S) / (N/4)^2
    print(N, f"{queue(N, k):.1e}", round(markov, 3), tchebychev)
# 20 2.1e-02 0.667 0.2
# 100 2.8e-07 0.667 0.04
# 400 1.3e-24 0.667 0.01`}</code>
        </pre>
        <p>
          À <Tex>{"N = 400"}</Tex>, la vraie probabilité vaut <Tex>{"10^{-24}"}</Tex>, Tchebychev annonce 1 % : il
          se trompe de 22 ordres de grandeur. Markov n'utilise que l'espérance, Tchebychev que la variance ; aucun
          des deux ne sait que <Tex>S</Tex> est une <em>somme de variables indépendantes</em>. Le théorème central
          limite suggère que la queue est gaussienne, donc en <Tex>{"e^{-cN}"}</Tex>, mais c'est un résultat
          asymptotique, sans garantie pour un <Tex>N</Tex> donné (Vershynin, section 2.1).
        </p>
      </section>

      <section className="section">
        <span className="section-num">2</span>
        <h2>La méthode de Chernoff et l'inégalité de Hoeffding</h2>
        <p>
          L'astuce de Tchebychev était d'appliquer Markov à <Tex>{"(X - \\mu)^2"}</Tex>. La{" "}
          <strong>méthode de Chernoff</strong> l'applique à <Tex>{"e^{\\lambda X}"}</Tex>, pour un{" "}
          <Tex>{"\\lambda > 0"}</Tex> qu'on choisira au mieux :
        </p>
        <Tex block>{"P(X \\ge t) = P\\big(e^{\\lambda X} \\ge e^{\\lambda t}\\big) \\le e^{-\\lambda t}\\, \\mathbb E\\big[e^{\\lambda X}\\big]"}</Tex>
        <p>
          Pour une somme de variables indépendantes, l'espérance de l'exponentielle se factorise :{" "}
          <Tex>{"\\mathbb E[e^{\\lambda \\sum X_i}] = \\prod_i \\mathbb E[e^{\\lambda X_i}]"}</Tex>. C'est là
          qu'entre l'indépendance. Reste à borner chaque facteur. Le <strong>lemme de Hoeffding</strong> le fait pour
          une variable bornée : si <Tex>{"\\mathbb E[X] = 0"}</Tex> et <Tex>{"a \\le X \\le b"}</Tex>, alors{" "}
          <Tex>{"\\mathbb E[e^{\\lambda X}] \\le e^{\\lambda^2 (b - a)^2 / 8}"}</Tex> (Mohri, lemme D.1). En
          choisissant le meilleur <Tex>\lambda</Tex>, on obtient l'<strong>inégalité de Hoeffding</strong> (Hoeffding,
          1963 ; Mohri, théorème D.2 ; Vershynin, théorème 2.2.6), écrite ici pour la moyenne{" "}
          <Tex>{"\\bar X"}</Tex> de <Tex>N</Tex> variables indépendantes à valeurs dans{" "}
          <Tex>{"[a, b]"}</Tex>, d'espérance <Tex>\mu</Tex> :
        </p>
        <Tex block>{"P\\big(\\bar X - \\mu \\ge \\varepsilon\\big) \\le e^{-2N\\varepsilon^2/(b - a)^2} \\qquad P\\big(|\\bar X - \\mu| \\ge \\varepsilon\\big) \\le 2\\, e^{-2N\\varepsilon^2/(b - a)^2}"}</Tex>
        <p>
          Le facteur 2 de la version bilatérale vient de la réunion des deux queues. Pour les piles,{" "}
          <Tex>{"[a, b] = [0, 1]"}</Tex> et <Tex>{"\\varepsilon = \\tfrac14"}</Tex> : la borne vaut{" "}
          <Tex>{"e^{-N/8}"}</Tex> (Vershynin, remarque 2.2.4).
        </p>
        <pre>
          <code>{`import numpy as np
from math import comb, exp

def queue(N, k):
    return sum(comb(N, j) for j in range(k, N + 1)) / 2**N

for N in [20, 100, 400]:
    print(N, f"{queue(N, 3 * N // 4):.1e}", f"{exp(-N / 8):.1e}", 4 / N)

# Lemme de Hoeffding pour X ~ Bernoulli(p), à valeurs dans [0, 1] : E[e^{l(X - p)}] <= e^{l^2 / 8}
l = np.linspace(-30, 30, 6001)
for p in [0.01, 0.3, 0.5, 0.9]:
    mgf = (1 - p) * np.exp(-l * p) + p * np.exp(l * (1 - p))
    print(p, bool(np.all(mgf <= np.exp(l**2 / 8))))
# 20 2.1e-02 8.2e-02 0.2
# 100 2.8e-07 3.7e-06 0.04
# 400 1.3e-24 1.9e-22 0.01
# 0.01 True
# 0.3 True
# 0.5 True
# 0.9 True`}</code>
        </pre>
        <p>
          Hoeffding suit maintenant la vraie probabilité à un ou deux ordres de grandeur près, au lieu de
          vingt-deux. Le
          lemme tient pour toutes les valeurs de <Tex>p</Tex> et de <Tex>\lambda</Tex> testées. Retenez la forme :
          la probabilité d'un écart <Tex>\varepsilon</Tex> décroît <em>exponentiellement</em> en{" "}
          <Tex>{"N\\varepsilon^2"}</Tex>, et la borne ne dépend de la loi que par l'intervalle{" "}
          <Tex>{"[a, b]"}</Tex>.
        </p>
      </section>

      <section className="section">
        <span className="section-num">3</span>
        <h2>Le bon exposant est une divergence KL</h2>
        <p>
          Pour des variables de Bernoulli de paramètre <Tex>p</Tex>, la méthode de Chernoff peut être menée sans
          le lemme de Hoeffding, et donne une borne plus fine. Avec <Tex>{"\\hat p"}</Tex> la proportion observée et{" "}
          <Tex>{"q > p"}</Tex> (Mohri, théorème D.3) :
        </p>
        <Tex block>{"P(\\hat p \\ge q) \\le e^{-N\\, D_{\\mathrm{KL}}(q \\,\\|\\, p)} \\qquad D_{\\mathrm{KL}}(q \\| p) = q \\ln \\frac qp + (1 - q) \\ln \\frac{1 - q}{1 - p}"}</Tex>
        <p>
          C'est la divergence du module Théorie de l'information, entre deux lois de Bernoulli. L'inégalité de
          Pinsker (Mohri, proposition E.7) donne <Tex>{"D_{\\mathrm{KL}}(q \\| p) \\ge 2(q - p)^2"}</Tex> : on
          retrouve Hoeffding, qui est donc toujours moins fin. Et ce n'est pas qu'une borne : la probabilité
          décroît exactement à ce rythme, <Tex>{"\\frac1N \\ln P(\\hat p \\ge q) \\to -D_{\\mathrm{KL}}(q \\| p)"}</Tex>{" "}
          (théorème de Sanov, Cover et Thomas, théorème 11.4.1, équation 11.96).
        </p>
        <pre>
          <code>{`import numpy as np
from math import lgamma, log

def log_queue(N, k, p=0.5):  # ln P(S >= k), S ~ Bin(N, p), sans dépassement de capacité
    j = np.arange(k, N + 1)
    lgam = np.vectorize(lgamma)
    t = lgam(N + 1) - lgam(j + 1) - lgam(N - j + 1) + j * log(p) + (N - j) * log(1 - p)
    return t.max() + np.log(np.exp(t - t.max()).sum())

def kl(q, p):  # divergence entre Bernoulli(q) et Bernoulli(p), en nats
    return q * log(q / p) + (1 - q) * log((1 - q) / (1 - p))

print(round(kl(0.75, 0.5), 4), 2 * 0.25**2)          # exposant de Chernoff, exposant de Hoeffding
for N in [100, 1000, 10000, 100000]:
    print(N, round(-log_queue(N, 3 * N // 4) / N, 4))
# 0.1308 0.125
# 100 0.1508
# 1000 0.1339
# 10000 0.1312
# 100000 0.1309`}</code>
        </pre>
        <p>
          L'exposant de la vraie probabilité, <Tex>{"-\\frac1N \\ln P"}</Tex>, descend vers{" "}
          <Tex>{"D_{\\mathrm{KL}}(\\tfrac34 \\| \\tfrac12) \\approx 0{,}1308"}</Tex>, juste au-dessus du{" "}
          <Tex>{"\\tfrac18 = 0{,}125"}</Tex> de Hoeffding. Ce petit écart d'exposant se multiplie par <Tex>N</Tex>{" "}
          : à <Tex>{"N = 400"}</Tex>, c'est un facteur <Tex>{"e^{400 \\times 0{,}0058} \\approx 10"}</Tex>. La
          figure compare les quatre courbes.
        </p>
        <TailViz />
      </section>

      <section className="section">
        <span className="section-num">4</span>
        <h2>Combien d'exemples de test ?</h2>
        <p>
          Retournons au jeu de test. Chaque exemple vaut 1 si le modèle a raison, 0 sinon : la précision mesurée{" "}
          <Tex>{"\\hat p"}</Tex> est la moyenne de <Tex>N</Tex> variables à valeurs dans <Tex>{"[0, 1]"}</Tex>, si les
          exemples sont tirés indépendamment. Pour que <Tex>{"|\\hat p - p| < \\varepsilon"}</Tex> avec une
          probabilité au moins <Tex>{"1 - \\delta"}</Tex>, il suffit que{" "}
          <Tex>{"2 e^{-2N\\varepsilon^2} \\le \\delta"}</Tex>, c'est-à-dire :
        </p>
        <Tex block>{"N \\ge \\frac{\\ln(2/\\delta)}{2\\varepsilon^2}"}</Tex>
        <p>
          Et si l'on évalue <Tex>K</Tex> modèles sur le même jeu de test, pour garder le meilleur ? On veut que les{" "}
          <Tex>K</Tex> mesures soient bonnes à la fois. La <strong>borne de la réunion</strong>,{" "}
          <Tex>{"P(E_1 \\cup \\dots \\cup E_K) \\le \\sum_k P(E_k)"}</Tex> (Vershynin, lemme 1.4.1), donne une
          probabilité d'échec d'au plus <Tex>{"2K e^{-2N\\varepsilon^2}"}</Tex>, d'où{" "}
          <Tex>{"N \\ge \\ln(2K/\\delta)/(2\\varepsilon^2)"}</Tex> : le nombre de modèles n'entre que par son
          logarithme.
        </p>
        <pre>
          <code>{`import numpy as np
from math import ceil, log

def taille_test(eps, delta, K=1):  # n tel que 2 K e^{-2 n eps^2} <= delta
    return ceil(log(2 * K / delta) / (2 * eps**2))

print(taille_test(0.01, 0.05), taille_test(0.01, 0.05, K=1000))
print(ceil(1 / (4 * 0.05 * 0.01**2)), ceil(1000 / (4 * 0.05 * 0.01**2)))   # Tchebychev, 1 puis 1000 modèles

# Vérification : un classifieur de précision réelle p, testé 100 000 fois sur n exemples
rng = np.random.default_rng(0)
n = taille_test(0.01, 0.05)
for p in [0.5, 0.9]:
    precision = rng.binomial(n, p, size=100_000) / n
    print(p, np.mean(np.abs(precision - p) > 0.01))
# 18445 52984
# 50000 50000000
# 0.5 0.00643
# 0.9 1e-05`}</code>
        </pre>
        <p>
          Pour une précision à ±1 point avec 95 % de confiance, il faut 18 445 exemples ; pour 1 000 modèles à la
          fois, 52 984 seulement. Avec Tchebychev, qui donne{" "}
          <Tex>{"N \\ge 1/(4\\delta\\varepsilon^2)"}</Tex>, il en faudrait 50 000 puis 50 millions : la réunion
          multiplie par <Tex>K</Tex> une borne en <Tex>{"1/N"}</Tex>, alors qu'une borne exponentielle absorbe{" "}
          <Tex>K</Tex> dans un logarithme. Le chapitre suivant reprend cet argument, avec un modèle choisi parmi{" "}
          <Tex>K</Tex> par l'entraînement lui-même.
        </p>
        <p>
          La simulation tombe à 0,6 % d'échecs pour <Tex>{"p = 0{,}5"}</Tex> et 0,001 % pour{" "}
          <Tex>{"p = 0{,}9"}</Tex>, bien sous les 5 % garantis. Hoeffding ne connaît que l'intervalle{" "}
          <Tex>{"[0, 1]"}</Tex>, pas la variance <Tex>{"p(1 - p)"}</Tex>, qui vaut 0,25 au pire et 0,09 ici.
          L'inégalité de Bernstein (Vershynin, section 2.9) en tient compte. Mais la garantie vaut pour tout{" "}
          <Tex>p</Tex>, sans rien supposer, et c'est ce qu'on lui demande.
        </p>
      </section>
    </LessonFlow>
  );
}
