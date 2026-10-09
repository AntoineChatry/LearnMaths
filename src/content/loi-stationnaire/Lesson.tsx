import { LessonFlow } from "../../components/LessonFlow";
import { Tex } from "../../components/Tex";
import { FrogViz } from "./FrogViz";

export function LoiStationnaireLesson() {
  return (
    <LessonFlow>
      <section className="section">
        <span className="section-num">1</span>
        <h2>Une loi qui ne bouge plus</h2>
        <p>
          Au chapitre précédent, les lignes de <Tex>{"P^6"}</Tex> pour le pays d'Oz étaient toutes égales à
          (0,4 ; 0,2 ; 0,4). Cette loi a une propriété remarquable : si la météo d'aujourd'hui la suit, celle de
          demain la suit encore. Une loi <Tex>\pi</Tex> sur les états est dite <strong>stationnaire</strong> (ou
          invariante) quand un pas de la chaîne la laisse inchangée (Levin et Peres, équations 1.14 et 1.15 ;
          Bishop, équation 11.39) :
        </p>
        <Tex block>{"\\pi = \\pi P \\qquad\\text{c'est-à-dire}\\qquad \\pi(y) = \\sum_x \\pi(x)\\,P(x, y) \\ \\text{ pour tout } y"}</Tex>
        <p>
          Autrement dit, <Tex>\pi</Tex> est un vecteur propre <em>à gauche</em> de <Tex>P</Tex> pour la valeur
          propre 1, normalisé pour que ses coefficients somment à 1 (Grinstead et Snell, section 11.3 ; Manning et
          al., équation 21.2). La valeur propre 1 existe toujours : comme chaque ligne de <Tex>P</Tex> somme à 1,{" "}
          <Tex>{"P\\mathbf 1 = \\mathbf 1"}</Tex>, et <Tex>P</Tex> a les mêmes valeurs propres que sa transposée.
          Pour la trouver, on résout un système linéaire, ou on demande les vecteurs propres de{" "}
          <Tex>{"P^\\top"}</Tex>.
        </p>
        <pre>
          <code>{`import numpy as np

P = np.array([[1/2, 1/4, 1/4],     # pays d'Oz : Pluie, Beau, Neige
              [1/2, 0,   1/2],
              [1/4, 1/4, 1/2]])
# pi P = pi  <=>  pi est vecteur propre à gauche (donc de P transposée) pour la valeur propre 1
vals, vecs = np.linalg.eig(P.T)
pi = np.real(vecs[:, np.argmin(abs(vals - 1))])
pi = pi / pi.sum()                       # on normalise pour obtenir une loi
print(pi.round(3), (pi @ P).round(3))
# autre méthode : résoudre pi (P - I) = 0 avec la contrainte sum(pi) = 1
A = np.vstack([(P - np.eye(3)).T, np.ones(3)])
print(np.linalg.lstsq(A, [0, 0, 0, 1], rcond=None)[0].round(3))

# marche aléatoire sur le graphe de Levin et Peres (figure 1.4) : pi proportionnelle aux degrés
aretes = [(1, 2), (1, 3), (2, 3), (2, 4), (3, 4), (3, 5)]
G = np.zeros((5, 5))
for a, b in aretes:
    G[a - 1, b - 1] = G[b - 1, a - 1] = 1
deg = G.sum(axis=1)
Q = G / deg[:, None]                     # P(x, y) = 1/deg(x) pour chaque voisin y
print(deg, (deg / deg.sum() @ Q * 12).round(3))
# [0.4 0.2 0.4] [0.4 0.2 0.4]
# [0.4 0.2 0.4]
# [2. 3. 4. 2. 1.] [2. 3. 4. 2. 1.]`}</code>
        </pre>
        <p>
          Les deux méthodes donnent (0,4 ; 0,2 ; 0,4), comme l'exemple 11.19 de Grinstead et Snell. Le second
          exemple est la <strong>marche aléatoire sur un graphe</strong> : à chaque pas, on va vers un voisin tiré
          au hasard. Sa loi stationnaire est proportionnelle aux degrés,{" "}
          <Tex>{"\\pi(y) = \\deg(y) / 2|E|"}</Tex>, où <Tex>|E|</Tex> est le nombre d'arêtes (Levin et Peres,
          exemple 1.12). Sur leur graphe à 6 arêtes, cela donne (2, 3, 4, 2, 1)/12 : le sommet le plus connecté est
          le plus visité.
        </p>
      </section>

      <section className="section">
        <span className="section-num">2</span>
        <h2>Quand la chaîne oublie son départ</h2>
        <p>
          Deux conditions suffisent pour que la loi de <Tex>{"X_t"}</Tex> tende vers <Tex>\pi</Tex>, quel que soit
          le départ. La chaîne doit être <strong>irréductible</strong> : on peut aller de tout état à tout état, en
          un ou plusieurs pas. Elle doit être <strong>apériodique</strong> : elle ne doit pas alterner entre des
          groupes d'états selon un cycle fixe (Levin et Peres, section 1.3). Attention au vocabulaire :
          Grinstead et Snell appellent « ergodique » une chaîne irréductible (définition 11.4), alors que Manning et
          al. réservent ce mot aux chaînes irréductibles <em>et</em> apériodiques (section 21.2.1).
        </p>
        <p>
          Une chaîne irréductible a une seule loi stationnaire (Levin et Peres, corollaire 1.17 ; Grinstead et
          Snell, théorème 11.10). Si elle est en plus apériodique, le <strong>théorème de convergence</strong>{" "}
          (Levin et Peres, théorème 4.9) dit que la distance à <Tex>\pi</Tex> décroît exponentiellement :
        </p>
        <Tex block>{"\\max_x \\big\\| P^t(x, \\cdot) - \\pi \\big\\|_{TV} \\le C \\alpha^t \\qquad \\text{avec } \\alpha \\in (0, 1)"}</Tex>
        <p>
          La <strong>distance en variation totale</strong> entre deux lois vaut{" "}
          <Tex>{"\\|\\mu - \\nu\\|_{TV} = \\frac12 \\sum_x |\\mu(x) - \\nu(x)|"}</Tex> (proposition 4.2) : c'est le
          plus grand écart de probabilité qu'un événement peut avoir sous les deux lois. Voyons ce qui se passe
          quand une condition manque.
        </p>
        <pre>
          <code>{`import numpy as np

def tv(mu, pi):                          # distance en variation totale
    return 0.5 * np.abs(mu - pi).sum()

def suite(P, mu, pi, T=6):               # distance à pi après 1, 2, ..., T pas
    out = []
    for _ in range(T):
        mu = mu @ P
        out.append(round(float(tv(mu, pi)), 4))
    return out

oz = np.array([[1/2, 1/4, 1/4], [1/2, 0, 1/2], [1/4, 1/4, 1/2]])
print(np.round(np.linalg.eigvals(oz), 2), suite(oz, np.eye(3)[0], np.array([0.4, 0.2, 0.4])))

# urne d'Ehrenfest à 4 boules (Grinstead et Snell, exemple 11.17) : période 2
E = np.zeros((5, 5))
for k in range(5):
    if k > 0: E[k, k - 1] = k / 4
    if k < 4: E[k, k + 1] = (4 - k) / 4
pi = np.array([1, 4, 6, 4, 1]) / 16
print((pi @ E - pi).round(12), suite(E, np.eye(5)[0], pi))
L = (np.eye(5) + E) / 2                  # version paresseuse : reste sur place une fois sur deux
print(suite(L, np.eye(5)[0], pi, T=12)[1::2])

# deux états absorbants : la limite dépend du départ
D = np.array([[1, 0, 0], [1/2, 0, 1/2], [0, 0, 1]])
for depart in [0, 1, 2]:
    print(depart, (np.eye(3)[depart] @ np.linalg.matrix_power(D, 50)).round(3))
# [ 1.    0.25 -0.25] [0.15, 0.0375, 0.0094, 0.0023, 0.0006, 0.0001]
# [0. 0. 0. 0. 0.] [0.75, 0.5625, 0.5, 0.5, 0.5, 0.5]
# [0.5, 0.2598, 0.1393, 0.0765, 0.0426, 0.0238]
# 0 [1. 0. 0.]
# 1 [0.5 0.  0.5]
# 2 [0. 0. 1.]`}</code>
        </pre>
        <p>
          Pour Oz, la distance est divisée par 4 à chaque pas : c'est le module de la deuxième valeur propre,
          1/4. L'urne d'Ehrenfest (4 boules réparties entre deux urnes, on en change une de côté à chaque pas) a
          bien une loi stationnaire, binomiale, mais elle est de période 2 : le nombre de boules dans la première
          urne change de parité à chaque pas, et la distance reste bloquée à 0,5. La version{" "}
          <strong>paresseuse</strong> <Tex>{"(I + P)/2"}</Tex>, qui reste sur place une fois sur deux, a la même
          loi stationnaire et converge (Levin et Peres, section 1.3). Enfin, une chaîne non irréductible, avec deux
          états absorbants, a plusieurs lois stationnaires : sa limite dépend du point de départ.
        </p>
        <p>
          Avec deux états, tout se calcule. La grenouille de Levin et Peres (exemple 1.1) saute de l'est vers
          l'ouest avec probabilité <Tex>p</Tex>, et de l'ouest vers l'est avec probabilité <Tex>q</Tex>. L'écart à
          la loi stationnaire est multiplié à chaque pas par <Tex>{"1 - p - q"}</Tex>, l'autre valeur propre de{" "}
          <Tex>P</Tex> (équation 1.8 et remarque 1.2).
        </p>
        <FrogViz />
      </section>

      <section className="section">
        <span className="section-num">3</span>
        <h2>Fréquences de visite et temps de retour</h2>
        <p>
          La loi stationnaire a une deuxième lecture, qui ne demande même pas l'apériodicité. Sur une seule longue
          trajectoire d'une chaîne irréductible, la proportion du temps passé en <Tex>x</Tex> tend vers{" "}
          <Tex>{"\\pi(x)"}</Tex> : c'est la loi des grands nombres pour les chaînes de Markov (Grinstead et Snell,
          théorème 11.12 ; Manning et al., théorème 21.1). Et le temps moyen pour revenir en <Tex>x</Tex> en
          partant de <Tex>x</Tex> est l'inverse de cette proportion (Grinstead et Snell, théorème 11.15 ; Levin et
          Peres, proposition 1.19) :
        </p>
        <Tex block>{"\\mathbb E_x\\big(\\text{temps de retour en } x\\big) = \\frac{1}{\\pi(x)}"}</Tex>
        <pre>
          <code>{`import numpy as np

P = np.array([[1/2, 1/4, 1/4], [1/2, 0, 1/2], [1/4, 1/4, 1/2]])
rng = np.random.default_rng(0)
n = 100000
x = np.zeros(n, dtype=int)               # une seule chaîne, 100 000 jours, partie de Pluie
for t in range(1, n):
    x[t] = rng.choice(3, p=P[x[t - 1]])
for T in [100, 1000, 100000]:
    print(T, (np.bincount(x[:T], minlength=3) / T).round(3))
for etat in [0, 1, 2]:                   # temps moyen entre deux passages par l'état
    passages = np.flatnonzero(x == etat)
    print(etat, round(np.diff(passages).mean(), 2))
# 100 [0.32 0.23 0.45]
# 1000 [0.366 0.211 0.423]
# 100000 [0.401 0.2   0.399]
# 0 2.49
# 1 5.0
# 2 2.51`}</code>
        </pre>
        <p>
          Sur 100 jours, les fréquences sont encore loin de (0,4 ; 0,2 ; 0,4) ; sur 100 000 jours, elles y sont à
          0,001 près. Il fait beau en moyenne tous les 5 jours et il pleut tous les 2,5 jours, comme l'annoncent
          Grinstead et Snell (section 11.5). Cette lecture vaut aussi pour la bascule de période 2, qui passe
          exactement la moitié du temps dans chaque état alors que sa loi au temps <Tex>t</Tex> ne converge pas. C'est
          elle qui justifie les méthodes MCMC du chapitre suivant : la moyenne le long d'une seule trajectoire
          estime une espérance sous <Tex>\pi</Tex>.
        </p>
      </section>

      <section className="section">
        <span className="section-num">4</span>
        <h2>PageRank : le web comme chaîne de Markov</h2>
        <p>
          Brin et Page (1998, section 2.1) décrivent un internaute aléatoire qui clique sur les liens au hasard et,
          de temps en temps, se lasse et repart d'une page tirée au hasard. Le <strong>PageRank</strong> d'une page
          est la probabilité stationnaire de cette chaîne, c'est-à-dire la fraction du temps que l'internaute y
          passe. Manning et al. (section 21.2.1) construisent la matrice à partir de la matrice d'adjacence{" "}
          <Tex>A</Tex> du web : chaque ligne de <Tex>A</Tex> est divisée par son nombre de liens, une page sans lien
          sortant renvoie uniformément vers toutes les pages, puis on mélange avec la{" "}
          <strong>téléportation</strong> de probabilité <Tex>\alpha</Tex> :
        </p>
        <Tex block>{"P(i, j) = (1 - \\alpha)\\,\\frac{A_{ij}}{\\sum_k A_{ik}} + \\frac{\\alpha}{N}"}</Tex>
        <p>
          La téléportation rend tous les coefficients strictement positifs : la chaîne est irréductible et
          apériodique, la loi stationnaire est unique, et on l'obtient par itération de la puissance,{" "}
          <Tex>{"x \\leftarrow xP"}</Tex>, sans jamais inverser de matrice, ce qui compte avec des milliards de pages.
          Voici le petit web de sept pages de l'exemple 21.1 de Manning et al., avec <Tex>{"\\alpha = 0{,}14"}</Tex>.
        </p>
        <pre>
          <code>{`import numpy as np

# graphe du web de Manning et al., figure 21.4 : liens sortants de chaque page d0 ... d6
liens = {0: [2], 1: [1, 2], 2: [0, 2, 3], 3: [3, 4], 4: [6], 5: [5, 6], 6: [3, 4, 6]}
N, alpha = 7, 0.14                       # alpha : probabilité de téléportation
A = np.zeros((N, N))
for i, js in liens.items():
    A[i, js] = 1
P = (1 - alpha) * A / A.sum(axis=1, keepdims=True) + alpha / N
print(P[0].round(2), P[2].round(2))      # lignes de l'exemple 21.1

x = np.ones(N) / N                       # itération de la puissance : x <- x P
for t in range(100):
    x = x @ P
print(x.round(2))
print(np.abs(x @ P - x).max() < 1e-12)

# formule de Brin et Page : PR(A) = (1 - d) + d * somme des PR(T) / C(T), avec d = 1 - alpha
d = 1 - alpha
PR = np.ones(N)
for t in range(100):
    PR = (1 - d) + d * (PR / A.sum(axis=1)) @ A
print(PR.sum().round(3), (PR / N).round(2))
# [0.02 0.02 0.88 0.02 0.02 0.02 0.02] [0.31 0.02 0.31 0.31 0.02 0.02 0.02]
# [0.05 0.04 0.11 0.25 0.21 0.04 0.31]
# True
# 7.0 [0.05 0.04 0.11 0.25 0.21 0.04 0.31]`}</code>
        </pre>
        <p>
          On retrouve le vecteur de l'équation 21.6 de Manning et al. La page d6 arrive en tête : elle reçoit des
          liens de d4, de d5 et d'elle-même, et d4 lui envoie tout son poids. La page d2 a aussi trois liens
          entrants (de d0, de d1 et d'elle-même), mais un score de 0,11 seulement : comme le notent les auteurs, la marche s'échappe du haut du graphe et n'y revient que par
          téléportation. Ce qui compte n'est pas le nombre de liens, mais le poids des pages qui les envoient.
        </p>
        <p>
          Brin et Page écrivent <Tex>{"PR(A) = (1 - d) + d\\sum_i PR(T_i)/C(T_i)"}</Tex>, où les{" "}
          <Tex>{"T_i"}</Tex> sont les pages qui pointent vers <Tex>A</Tex>, <Tex>{"C(T_i)"}</Tex> leur nombre de
          liens sortants, et proposent <Tex>{"d = 0{,}85"}</Tex>. Dans cette formule, <Tex>d</Tex> est la
          probabilité de suivre un lien (leur texte la présente à l'inverse, comme la probabilité de se lasser), donc{" "}
          <Tex>{"\\alpha = 1 - d = 0{,}15"}</Tex>. Ils annoncent que les PageRank forment une loi de probabilité ;
          avec cette formule, ils somment en fait à <Tex>N</Tex>, comme le montre la dernière ligne. Il manque un{" "}
          <Tex>{"1/N"}</Tex> devant <Tex>{"1 - d"}</Tex> ; une fois divisés par <Tex>N</Tex>, les scores sont ceux
          de Manning et al., et le classement est le même.
        </p>
      </section>
    </LessonFlow>
  );
}
