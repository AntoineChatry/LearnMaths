import { LessonFlow } from "../../components/LessonFlow";
import { Tex } from "../../components/Tex";
import { BrownianViz } from "./BrownianViz";

export function MarchesAleatoiresLesson() {
  return (
    <LessonFlow>
      <section className="section">
        <span className="section-num">1</span>
        <h2>La marche aléatoire simple</h2>
        <p>
          On part de 0 et, à chaque pas, on lance une pièce : +1 pour pile, −1 pour face. La position après{" "}
          <Tex>n</Tex> pas est <Tex>{"S_n = \\xi_1 + \\dots + \\xi_n"}</Tex>, une somme de variables indépendantes de
          moyenne 0 et de variance 1 (Grinstead et Snell, section 12.1). C'est une chaîne de Markov sur les entiers,
          et ses deux premiers moments se calculent tout de suite :
        </p>
        <Tex block>{"\\mathbb E\\,S_n = 0 \\qquad \\mathrm{Var}(S_n) = n \\qquad \\text{donc une distance typique de } \\sqrt n"}</Tex>
        <p>
          C'est la lenteur que le chapitre précédent reprochait à Metropolis avec un petit pas : en <Tex>n</Tex> pas,
          on ne s'éloigne que de <Tex>{"\\sqrt n"}</Tex> (Bishop, section 11.2 ; MacKay, exercice 29.3). La probabilité
          d'être revenu en 0 au temps <Tex>2m</Tex> se compte : il faut autant de +1 que de −1, d'où{" "}
          <Tex>{"u_{2m} = \\binom{2m}{m} 2^{-2m}"}</Tex> (Grinstead et Snell, théorème 12.1), qui se comporte comme{" "}
          <Tex>{"1/\\sqrt{\\pi m}"}</Tex> (Durrett, preuve du théorème 5.4.4).
        </p>
        <pre>
          <code>{`import numpy as np
from math import comb, pi, sqrt

rng = np.random.default_rng(0)
pas = rng.choice([-1, 1], size=(10000, 1000))     # 10 000 marches de 1 000 pas de ±1
S = pas.cumsum(axis=1)
for n in [10, 100, 1000]:
    print(n, round(S[:, n - 1].mean(), 2), round(S[:, n - 1].std(), 1), round(sqrt(n), 1))

# probabilité d'être revenu en 0 au temps 2m (Grinstead et Snell, théorème 12.1)
for m in [1, 5, 50]:
    exact = comb(2 * m, m) / 4**m
    print(2 * m, round(exact, 4), round(1 / sqrt(pi * m), 4), round((S[:, 2 * m - 1] == 0).mean(), 4))

# retour à l'origine en dimension 1, 2, 3 avant 10 000 pas (Pólya)
for d in [1, 2, 3]:
    revenus = 0
    for _ in range(1000):
        axes = rng.integers(0, d, 10000)
        signes = rng.choice([-1, 1], 10000)
        pos = np.zeros((10000, d), dtype=int)
        pos[np.arange(10000), axes] = signes
        chemin = pos.cumsum(axis=0)
        revenus += (np.abs(chemin).sum(axis=1) == 0).any()
    print(d, revenus / 1000)
# 10 0.0 3.1 3.2
# 100 -0.15 10.1 10.0
# 1000 0.45 31.4 31.6
# 2 0.5 0.5642 0.5029
# 10 0.2461 0.2523 0.2473
# 100 0.0796 0.0798 0.083
# 1 0.993
# 2 0.716
# 3 0.355`}</code>
        </pre>
        <p>
          L'écart-type mesuré suit <Tex>{"\\sqrt n"}</Tex>, et <Tex>{"u_{2m}"}</Tex> tend vers 0, mais lentement. Assez
          lentement pour que la somme des <Tex>{"u_{2m}"}</Tex> diverge : en dimension 1 et 2, la marche revient en 0
          avec probabilité 1, et même une infinité de fois. En dimension 3, la probabilité d'être en 0 au
          temps <Tex>2m</Tex> est au plus de l'ordre de <Tex>{"m^{-3/2}"}</Tex>, la somme converge, et la marche ne revient qu'avec probabilité 0,34
          environ (Durrett, théorème 5.4.4 ; Grinstead et Snell, exemple 12.2). C'est le théorème de Pólya (1921).
          Sur 10 000 pas, la simulation trouve 99 %, 72 % et 36 % ; en dimension 2, le retour est certain mais peut
          prendre très longtemps.
        </p>
      </section>

      <section className="section">
        <span className="section-num">2</span>
        <h2>La ruine du joueur</h2>
        <p>
          Un joueur a <Tex>x</Tex> euros, mise 1 euro à pile ou face à chaque coup, et s'arrête quand il atteint{" "}
          <Tex>a</Tex> (ruiné) ou <Tex>b</Tex> (objectif). C'est une marche aléatoire arrêtée au bord d'un intervalle,
          et, pour une pièce équilibrée, tout se calcule (Durrett, théorème 4.8.7 ; Grinstead et Snell, section 12.2) :
        </p>
        <Tex block>{"P_x(\\text{atteindre } b \\text{ avant } a) = \\frac{x - a}{b - a} \\qquad \\mathbb E_x(\\text{durée}) = (b - x)(x - a)"}</Tex>
        <p>
          La première formule vient de ce que la fortune moyenne reste égale à <Tex>x</Tex> à chaque coup : à la fin,{" "}
          <Tex>{"b\\,P + a\\,(1 - P) = x"}</Tex>. Pour une pièce qui gagne avec probabilité <Tex>{"p \\ne 1/2"}</Tex>, en
          notant <Tex>{"r = (1 - p)/p"}</Tex> et en partant de <Tex>{"a = 0"}</Tex>, la probabilité d'atteindre{" "}
          <Tex>b</Tex> devient <Tex>{"(r^x - 1)/(r^b - 1)"}</Tex> (Grinstead et Snell, section 12.2).
        </p>
        <pre>
          <code>{`import numpy as np

def ruine(x, a, b, p, rng, n=20000):            # marche partie de x, arrêtée en a ou en b
    gagne, durees = 0, []
    for _ in range(n):
        s, t = x, 0
        while a < s < b:
            s += 1 if rng.random() < p else -1
            t += 1
        gagne += s == b
        durees.append(t)
    return gagne / n, np.mean(durees)

rng = np.random.default_rng(0)
x, a, b = 3, 0, 10                               # 3 euros en poche, on s'arrête à 0 ou à 10
gain, duree = ruine(x, a, b, 0.5, rng)
print(round(gain, 3), round(duree, 1), (x - a) / (b - a), (b - x) * (x - a))
# pièce légèrement défavorable, comme à la roulette (p = 18/38)
p = 18 / 38
r = (1 - p) / p
print(round(ruine(x, a, b, p, rng)[0], 3), round((r**x - 1) / (r**b - 1), 3))
# 0.303 21.1 0.3 21
# 0.198 0.199`}</code>
        </pre>
        <p>
          Avec 3 euros et l'objectif de 10, on gagne 3 fois sur 10 et la partie dure en moyenne 21 coups. À la
          roulette, où l'on gagne un pari sur rouge avec probabilité 18/38, la chance tombe à 0,2 : un petit biais
          par coup, accumulé sur des dizaines de coups, pèse lourd.
        </p>
      </section>

      <section className="section">
        <span className="section-num">3</span>
        <h2>Du discret au continu : le mouvement brownien</h2>
        <p>
          Faisons des pas de plus en plus nombreux et de plus en plus petits. En <Tex>n</Tex> pas par unité de
          temps, il faut diviser l'espace par <Tex>{"\\sqrt n"}</Tex>, pas par <Tex>n</Tex> : la variance au temps 1
          reste alors <Tex>{"n \\times (1/\\sqrt n)^2 = 1"}</Tex>. Le principe d'invariance de Donsker dit que{" "}
          <Tex>{"t \\mapsto S_{\\lfloor nt \\rfloor} / \\sqrt n"}</Tex> converge, comme courbe entière, vers un{" "}
          <strong>mouvement brownien</strong> <Tex>{"(B_t)"}</Tex>, et ce quelle que soit la loi des pas, pourvu
          qu'elle soit de moyenne 0 et de variance 1 (Mörters et Peres, théorème 5.22 et remarque 5.23 ; Durrett,
          théorème 8.1.4). Le mouvement brownien est défini par trois propriétés (Durrett, section 7.1 ; Särkkä et
          Solin, définition 4.1) :
        </p>
        <ul>
          <li>
            <Tex>{"B_0 = 0"}</Tex>, et les accroissements sur des intervalles disjoints sont indépendants ;
          </li>
          <li>
            <Tex>{"B_t - B_s \\sim N(0,\\ t - s)"}</Tex> : la <em>variance</em> est proportionnelle à la durée, et
            l'écart-type à sa racine ;
          </li>
          <li>les trajectoires sont continues, mais nulle part dérivables.</li>
        </ul>
        <p>
          La règle « l'espace varie comme la racine du temps » est l'<strong>invariance d'échelle</strong> :{" "}
          <Tex>{"B(a^2 t)/a"}</Tex> est encore un mouvement brownien (Mörters et Peres, lemme 1.7). Vérifions Donsker
          sur deux lois de pas différentes, et pas seulement sur la valeur finale : aussi sur le maximum de la
          trajectoire, qui dépend de toute la courbe. Pour le brownien, le principe de réflexion donne{" "}
          <Tex>{"P(\\max_{t \\le 1} B_t > a) = 2\\,P(B_1 > a)"}</Tex> (Mörters et Peres, théorème 2.21 ; Durrett,
          équation 7.4.4).
        </p>
        <pre>
          <code>{`import numpy as np
from scipy.stats import norm

rng = np.random.default_rng(0)
n = 1000                                          # pas par unité de temps
lois = {
    "±1": lambda size: rng.choice([-1.0, 1.0], size),
    "uniforme": lambda size: rng.uniform(-np.sqrt(3), np.sqrt(3), size),   # moyenne 0, variance 1
}
for nom, tirer in lois.items():
    S = tirer((10000, n)).cumsum(axis=1) / np.sqrt(n)   # S_[nt] / sqrt(n) pour t dans [0, 1]
    fin, maxi = S[:, -1], S.max(axis=1)
    moitie = S[:, n // 2 - 1]
    print(nom, round(fin.var(), 2), round(np.cov(moitie, fin)[0, 1], 2),
          round((fin > 1).mean(), 3), round((maxi > 1).mean(), 3))
print(round(norm.sf(1), 3), round(2 * norm.sf(1), 3))   # P(B_1 > 1) et P(max B > 1) = 2 P(B_1 > 1)
# ±1 0.98 0.5 0.166 0.313
# uniforme 0.99 0.49 0.156 0.307
# 0.159 0.317`}</code>
        </pre>
        <p>
          Les deux marches donnent les mêmes résultats : variance 1 au temps 1, covariance 1/2 entre les temps 1/2
          et 1 (celle du brownien, <Tex>{"\\mathrm{Cov}(B_s, B_t) = \\min(s, t)"}</Tex>), et un maximum qui dépasse 1
          dans 31 % des cas, contre 31,7 % pour le brownien. L'écart restant vient de ce qu'on ne regarde la marche
          qu'aux instants <Tex>k/n</Tex>, ce qui peut manquer un dépassement entre deux. Einstein (1905) obtenait le
          même objet du côté physique : les particules secouées par les molécules d'eau ont une densité qui suit
          l'équation de diffusion (Särkkä et Solin, exemple 3.1).
        </p>
        <BrownianViz />
      </section>

      <section className="section">
        <span className="section-num">4</span>
        <h2>Du bruit avec un rappel</h2>
        <p>
          Le mouvement brownien s'éloigne sans fin : sa variance croît comme <Tex>t</Tex>, il n'a pas de loi
          stationnaire. Ajoutons une force de rappel vers 0. C'est le processus d'
          <strong>Ornstein-Uhlenbeck</strong>, <Tex>{"dx = -\\lambda x\\, dt + dB"}</Tex>, que l'on simule par le
          schéma d'Euler-Maruyama : à chaque pas <Tex>{"\\Delta t"}</Tex>, on avance de{" "}
          <Tex>{"-\\lambda x\\,\\Delta t"}</Tex> et on ajoute un bruit gaussien de <em>variance</em>{" "}
          <Tex>{"\\Delta t"}</Tex> (Särkkä et Solin, équation 3.48). Le rappel et le bruit s'équilibrent : la loi
          stationnaire est <Tex>{"N(0,\\ 1/2\\lambda)"}</Tex> (exercices 3.2 et 3.5, avec une densité
          spectrale <Tex>{"q = 1"}</Tex>).
        </p>
        <p>
          La même idée existe en temps discret : la chaîne de Markov{" "}
          <Tex>{"x_t = \\sqrt{1 - \\beta}\\, x_{t-1} + \\sqrt\\beta\\, \\varepsilon_t"}</Tex>, avec{" "}
          <Tex>{"\\varepsilon_t \\sim N(0, 1)"}</Tex>, rétrécit un peu l'état puis ajoute un peu de bruit. Si{" "}
          <Tex>{"x_{t-1}"}</Tex> a une variance 1, alors <Tex>{"x_t"}</Tex> aussi :{" "}
          <Tex>{"(1 - \\beta) + \\beta = 1"}</Tex>. En itérant, avec <Tex>{"\\bar\\alpha_t = (1 - \\beta)^t"}</Tex> :
        </p>
        <Tex block>{"x_t \\mid x_0 \\ \\sim\\ N\\big(\\sqrt{\\bar\\alpha_t}\\, x_0,\\ 1 - \\bar\\alpha_t\\big)"}</Tex>
        <p>
          C'est exactement le processus « vers l'avant » des modèles de diffusion de Ho et al. (2020, équations 2 et
          4), avec un <Tex>\beta</Tex> qui peut dépendre de <Tex>t</Tex>.
        </p>
        <pre>
          <code>{`import numpy as np

rng = np.random.default_rng(0)
# Ornstein-Uhlenbeck dx = -lam x dt + dB (diffusion q = 1), schéma d'Euler-Maruyama
lam, dt, T = 0.5, 0.01, 20.0
x = np.full(10000, 3.0)                           # 10 000 trajectoires, toutes parties de 3
for k in range(int(T / dt)):
    x = x - lam * x * dt + np.sqrt(dt) * rng.standard_normal(10000)
print(round(x.mean(), 2), round(x.var(), 2), 1 / (2 * lam))   # loi stationnaire N(0, q / 2 lam)

# la même idée en temps discret : x <- sqrt(1 - beta) x + sqrt(beta) eps garde la variance 1
beta = 0.02
x0 = np.full(10000, 3.0)
x = x0.copy()
for t in range(1, 201):
    x = np.sqrt(1 - beta) * x + np.sqrt(beta) * rng.standard_normal(10000)
    if t in (10, 50, 200):
        abar = (1 - beta) ** t                    # forme fermée : N(sqrt(abar) x0, (1 - abar))
        print(t, round(x.mean(), 3), round(3 * np.sqrt(abar), 3), round(x.var(), 3), round(1 - abar, 3))
# 0.01 1.01 1.0
# 10 2.707 2.712 0.176 0.183
# 50 1.809 1.81 0.633 0.636
# 200 0.408 0.398 0.985 0.982`}</code>
        </pre>
        <p>
          Partis de 3, les deux processus oublient leur point de départ et finissent sur la même loi{" "}
          <Tex>{"N(0, 1)"}</Tex> : c'est une loi stationnaire, comme au chapitre 2, mais pour une chaîne à états
          continus. La forme fermée est vérifiée aux pas 10, 50 et 200. Au pas 200, il ne reste presque rien de{" "}
          <Tex>{"x_0"}</Tex> : moyenne 0,4 et variance 0,98. Un modèle de diffusion part de là : en rajoutant du bruit
          pas à pas, on transforme n'importe quelle image en bruit pur. Le chapitre suivant apprend à remonter ce
          chemin.
        </p>
      </section>
    </LessonFlow>
  );
}
