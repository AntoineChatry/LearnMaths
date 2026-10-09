import { LessonFlow } from "../../components/LessonFlow";
import { Tex } from "../../components/Tex";
import { MetropolisViz } from "./MetropolisViz";

export function McmcLesson() {
  return (
    <LessonFlow>
      <section className="section">
        <span className="section-num">1</span>
        <h2>Renverser le problème</h2>
        <p>
          Au chapitre précédent, on partait d'une chaîne et on cherchait sa loi stationnaire. Ici on fait l'inverse :
          on connaît une loi <Tex>p</Tex>, et on fabrique une chaîne qui la vise. Pourquoi ? Parce qu'on sait souvent
          calculer <Tex>p</Tex> <em>à une constante près</em> seulement. En apprentissage bayésien, la loi a posteriori
          des paramètres est
        </p>
        <Tex block>{"p(\\theta \\mid D) = \\frac{p(D \\mid \\theta)\\,p(\\theta)}{Z} \\qquad Z = \\int p(D \\mid \\theta)\\,p(\\theta)\\,d\\theta"}</Tex>
        <p>
          Le numérateur se calcule pour chaque <Tex>\theta</Tex>, mais l'intégrale <Tex>Z</Tex> porte sur tous les
          paramètres à la fois, ce qui est hors de portée dès qu'il y en a beaucoup. Bishop note{" "}
          <Tex>{"p = \\tilde p / Z_p"}</Tex>, avec <Tex>{"\\tilde p"}</Tex> calculable et <Tex>{"Z_p"}</Tex>{" "}
          inconnu (section 11.2). Les méthodes de <strong>Monte-Carlo par chaînes de Markov</strong> (MCMC) tirent
          quand même selon <Tex>p</Tex> : elles construisent une chaîne dont <Tex>p</Tex> est la loi stationnaire, la
          font tourner, et utilisent ses états comme des tirages.
        </p>
        <p>
          L'outil pour garantir que <Tex>\pi</Tex> est stationnaire est l'<strong>équilibre détaillé</strong>{" "}
          (Bishop, équation 11.40 ; Levin et Peres, équation 1.29) : le flux de probabilité de <Tex>x</Tex> vers{" "}
          <Tex>y</Tex> égale le flux de <Tex>y</Tex> vers <Tex>x</Tex>.
        </p>
        <Tex block>{"\\pi(x)\\,P(x, y) = \\pi(y)\\,P(y, x) \\quad \\text{pour tous } x, y \\qquad \\Longrightarrow \\qquad \\pi P = \\pi"}</Tex>
        <p>
          Il suffit de sommer sur <Tex>x</Tex> :{" "}
          <Tex>{"\\sum_x \\pi(x) P(x, y) = \\pi(y) \\sum_x P(y, x) = \\pi(y)"}</Tex>, car chaque ligne de{" "}
          <Tex>P</Tex> somme à 1 (Levin et Peres, proposition 1.20 ; Bishop, équation 11.41). Une chaîne qui vérifie
          l'équilibre détaillé est dite <strong>réversible</strong>. La condition est suffisante, pas nécessaire.
        </p>
        <pre>
          <code>{`import numpy as np

def stationnaire(pi, P):
    return np.allclose(pi @ P, pi)

def equilibre_detaille(pi, P):                # pi(x) P(x, y) = pi(y) P(y, x) pour tous x, y
    F = pi[:, None] * P                       # F[x, y] : flux de probabilité de x vers y
    return np.allclose(F, F.T)

# chaîne à trois états qui ne saute qu'entre voisins
P = np.array([[1/2, 1/2, 0], [1/4, 1/2, 1/4], [0, 1/2, 1/2]])
pi = np.array([1, 2, 1]) / 4
print(stationnaire(pi, P), equilibre_detaille(pi, P))

# marche biaisée sur un cycle de 5 sommets (Levin et Peres, exemple 1.22)
n, p = 5, 0.8
C = np.zeros((n, n))
for k in range(n):
    C[k, (k + 1) % n], C[k, (k - 1) % n] = p, 1 - p   # sens horaire avec probabilité 0,8
u = np.ones(n) / n
print(stationnaire(u, C), equilibre_detaille(u, C))
# True True
# True False`}</code>
        </pre>
        <p>
          La marche biaisée sur un cycle a la loi uniforme pour loi stationnaire, mais tourne surtout dans un sens :
          le flux horaire (0,8/5) ne compense pas le flux inverse (0,2/5). Stationnaire, mais pas réversible.
        </p>
      </section>

      <section className="section">
        <span className="section-num">2</span>
        <h2>L'algorithme de Metropolis-Hastings</h2>
        <p>
          On part d'une chaîne facile à simuler, la <em>proposition</em> <Tex>{"q(y \\mid x)"}</Tex>, et on la
          corrige. Depuis <Tex>x</Tex>, on tire un candidat <Tex>y</Tex> selon <Tex>{"q(\\cdot \\mid x)"}</Tex>, puis
          on l'accepte avec probabilité (Bishop, équation 11.44 ; Levin et Peres, équation 3.4)
        </p>
        <Tex block>{"A(x, y) = \\min\\left(1,\\ \\frac{\\tilde p(y)\\,q(x \\mid y)}{\\tilde p(x)\\,q(y \\mid x)}\\right)"}</Tex>
        <p>
          Si le candidat est refusé, la chaîne <em>reste</em> en <Tex>x</Tex>, et <Tex>x</Tex> compte une fois de plus
          parmi les tirages. Quand la proposition est symétrique, <Tex>{"q(x \\mid y) = q(y \\mid x)"}</Tex>, le rapport
          se réduit à <Tex>{"\\tilde p(y) / \\tilde p(x)"}</Tex> : c'est l'algorithme de Metropolis (1953), généralisé
          par Hastings (1970). On monte toujours vers plus probable, on descend parfois. Deux remarques :
        </p>
        <ul>
          <li>
            Seul le <em>rapport</em> <Tex>{"\\tilde p(y)/\\tilde p(x)"}</Tex> intervient, donc la constante{" "}
            <Tex>Z</Tex> disparaît (Levin et Peres, remarque 3.1).
          </li>
          <li>
            L'équilibre détaillé se vérifie en une ligne (Bishop, équation 11.45) :{" "}
            <Tex>{"p(x)\\,q(y \\mid x)\\,A(x, y) = \\min\\big(p(x) q(y \\mid x),\\ p(y) q(x \\mid y)\\big)"}</Tex>, une
            expression symétrique en <Tex>x</Tex> et <Tex>y</Tex>.
          </li>
        </ul>
        <pre>
          <code>{`import numpy as np

h = np.array([1, 3, 8, 4, 1, 1, 6, 9, 3, 1.0])   # loi cible connue à une constante près
n = len(h)

def metropolis(h, x0, pas, rng):
    x, xs, acc = x0, np.empty(pas, dtype=int), 0
    for t in range(pas):
        y = x + rng.choice([-1, 1])               # proposition symétrique : un voisin au hasard
        if 0 <= y < n and rng.random() < min(1, h[y] / h[x]):   # Z n'intervient jamais
            x, acc = y, acc + 1
        xs[t] = x
    return xs, acc / pas

rng = np.random.default_rng(0)
xs, taux = metropolis(h, 0, 200000, rng)
print((h / h.sum()).round(3))
print((np.bincount(xs, minlength=n) / len(xs)).round(3), round(taux, 2))

# matrice de transition exacte de la chaîne de Metropolis (Levin et Peres, équation 3.5)
P = np.zeros((n, n))
for x in range(n):
    for y in (x - 1, x + 1):
        if 0 <= y < n:
            P[x, y] = 0.5 * min(1, h[y] / h[x])
    P[x, x] = 1 - P[x].sum()
pi = h / h.sum()
print(np.abs(pi @ P - pi).max() < 1e-15, np.allclose(pi[:, None] * P, (pi[:, None] * P).T))

# graphe de Levin et Peres (figure 1.4) : la marche simple visite chaque sommet en proportion de son degré ;
# en acceptant le pas x -> y avec probabilité min(1, deg(x)/deg(y)), on la rend uniforme (exemple 3.3)
voisins = {0: [1, 2], 1: [0, 2, 3], 2: [0, 1, 3, 4], 3: [1, 2], 4: [2]}
deg = {x: len(v) for x, v in voisins.items()}
for metro in (False, True):
    x, compte = 0, np.zeros(5)
    for t in range(200000):
        y = rng.choice(voisins[x])
        if not metro or rng.random() < min(1, deg[x] / deg[y]):
            x = y
        compte[x] += 1
    print(metro, (compte / compte.sum()).round(3))
# [0.027 0.081 0.216 0.108 0.027 0.027 0.162 0.243 0.081 0.027]
# [0.027 0.082 0.216 0.107 0.027 0.027 0.161 0.247 0.081 0.026] 0.57
# True True
# False [0.167 0.249 0.333 0.167 0.084]
# True [0.198 0.199 0.2   0.2   0.203]`}</code>
        </pre>
        <p>
          La chaîne ne connaît que les poids <Tex>h</Tex>, jamais leur somme 37, et ses fréquences de visite
          retrouvent <Tex>{"h/37"}</Tex> à 0,004 près. La matrice exacte confirme que <Tex>{"h/37"}</Tex> est
          stationnaire et que l'équilibre détaillé tient. Le dernier exemple reprend le graphe du chapitre précédent :
          la marche simple visite les sommets en proportion de leur degré, (2, 3, 4, 2, 1)/12 ; en refusant une
          partie des pas vers les sommets très connectés, on obtient la loi uniforme, 0,2 partout (Levin et Peres,
          exemple 3.3). Ici la proposition n'est pas symétrique, <Tex>{"q(y \\mid x) = 1/\\deg(x)"}</Tex>, et le
          rapport de Hastings vaut <Tex>{"\\deg(x)/\\deg(y)"}</Tex>.
        </p>
      </section>

      <section className="section">
        <span className="section-num">3</span>
        <h2>Régler le pas</h2>
        <p>
          Pour une variable continue, la proposition la plus courante est{" "}
          <Tex>{"y = x + \\sigma \\varepsilon"}</Tex> avec <Tex>{"\\varepsilon \\sim N(0, 1)"}</Tex>, symétrique. Tout
          se joue sur le pas <Tex>\sigma</Tex> (Bishop, section 11.2.2 et figure 11.10). Trop petit, presque tout est
          accepté mais la chaîne avance comme une marche aléatoire, de <Tex>{"\\sqrt T"}</Tex> pas en{" "}
          <Tex>T</Tex> itérations. Trop grand, les candidats tombent dans des zones improbables et sont refusés. MacKay
          en tire une règle (équation 29.32) : si la zone probable a une taille <Tex>L</Tex>, il faut au moins{" "}
          <Tex>{"T \\approx (L/\\sigma)^2"}</Tex> itérations pour obtenir un tirage à peu près indépendant du départ, et
          bien plus si la loi a plusieurs îlots séparés par des régions vides. Prenons justement une cible à deux
          bosses, <Tex>{"0{,}3\\,N(-2, 0{,}5^2) + 0{,}7\\,N(2, 0{,}5^2)"}</Tex>, de moyenne 0,8.
        </p>
        <pre>
          <code>{`import numpy as np

def log_p(x):                                   # 0,3 N(-2, 0,5²) + 0,7 N(2, 0,5²), sans la constante
    return np.logaddexp(np.log(0.3) - (x + 2)**2 / 0.5, np.log(0.7) - (x - 2)**2 / 0.5)

def metropolis(pas, n, rng, x=0.0):
    xs, acc = np.empty(n), 0
    for t in range(n):
        y = x + pas * rng.standard_normal()      # proposition gaussienne centrée sur x
        if np.log(rng.random()) < log_p(y) - log_p(x):
            x, acc = y, acc + 1
        xs[t] = x
    return xs, acc / n

rng = np.random.default_rng(0)                  # à retrouver : moyenne 0,8 et 70 % de la masse à droite de 0
for pas in [0.1, 1.0, 3.0, 30.0]:
    xs, taux = metropolis(pas, 20000, rng)
    sauts = np.sum(np.diff(np.sign(xs)) != 0)    # passages d'un mode à l'autre
    print(pas, round(taux, 2), round(xs.mean(), 2), round((xs > 0).mean(), 2), sauts)
# 0.1 0.93 -1.95 0.0 1
# 1.0 0.5 0.79 0.7 99
# 3.0 0.27 0.82 0.71 1369
# 30.0 0.04 0.75 0.68 332`}</code>
        </pre>
        <p>
          Avec <Tex>{"\\sigma = 0{,}1"}</Tex>, 93 % des propositions sont acceptées, et pourtant le résultat est
          faux : la chaîne est tombée dans la bosse de gauche dès le départ et n'en est jamais sortie, d'où une
          moyenne de −1,95 au lieu de 0,8. Un fort taux d'acceptation ne prouve donc rien. Avec{" "}
          <Tex>{"\\sigma = 30"}</Tex>, 96 % des propositions sont refusées. Le meilleur compromis ici est{" "}
          <Tex>{"\\sigma = 3"}</Tex>, de l'ordre de la distance entre les bosses : 1 369 passages d'une bosse à
          l'autre en 20 000 itérations. Le calcul se fait en logarithmes, pour éviter les densités trop petites pour
          les nombres flottants.
        </p>
        <MetropolisViz />
      </section>

      <section className="section">
        <span className="section-num">4</span>
        <h2>Une loi a posteriori par MCMC</h2>
        <p>
          Revenons au problème de départ, sur un cas où l'on connaît la réponse. Une pièce donne 7 « face » sur 10
          lancers. Avec un a priori uniforme sur sa probabilité <Tex>\theta</Tex> de tomber sur face, la loi a
          posteriori est proportionnelle à <Tex>{"\\theta^7 (1 - \\theta)^3"}</Tex>, et on sait qu'il s'agit d'une loi
          Bêta(8, 4) (Bishop, équations 2.17 et 2.18), de moyenne 8/12 (équation 2.20). La chaîne, elle, ne
          voit que <Tex>{"\\theta^7(1 - \\theta)^3"}</Tex>.
        </p>
        <pre>
          <code>{`import numpy as np
from scipy import stats

k, n = 7, 10                                     # 7 « face » sur 10 lancers, a priori uniforme sur theta
def log_post(theta):                             # log p(D | theta) + log p(theta), à une constante près
    if not 0 < theta < 1:
        return -np.inf
    return k * np.log(theta) + (n - k) * np.log(1 - theta)

rng = np.random.default_rng(0)
theta, xs = 0.5, []
for t in range(60000):
    prop = theta + 0.2 * rng.standard_normal()
    if np.log(rng.random()) < log_post(prop) - log_post(theta):
        theta = prop
    xs.append(theta)
xs = np.array(xs[10000:])                        # on jette le début de la chaîne (rodage)
exact = stats.beta(k + 1, n - k + 1)             # a posteriori exact : loi Beta(8, 4)
print(round(xs.mean(), 3), round(exact.mean(), 3))
print(np.percentile(xs, [2.5, 97.5]).round(3), np.array(exact.interval(0.95)).round(3))
print(round((xs > 0.5).mean(), 3), round(exact.sf(0.5), 3))
# 0.666 0.667
# [0.393 0.891] [0.39  0.891]
# 0.884 0.887`}</code>
        </pre>
        <p>
          La moyenne, l'intervalle qui contient 95 % de la loi a posteriori et la probabilité que la pièce favorise
          face concordent avec la loi exacte à 0,003 près. Chaque estimation est une moyenne le long d'<em>une seule</em>{" "}
          trajectoire : c'est la loi des grands nombres du chapitre précédent qui la justifie. On jette les premières
          itérations, influencées par le point de départ.
        </p>
        <p>
          Sur un réseau de neurones, <Tex>\theta</Tex> a des millions de coordonnées et la marche aléatoire devient
          beaucoup trop lente. La <strong>méthode de Monte-Carlo hamiltonienne</strong> (Bishop, section 11.5)
          utilise le gradient de <Tex>{"\\ln \\tilde p"}</Tex> pour faire de grands pas qui restent probables, et
          éviter ce comportement de marche aléatoire. La structure reste la même : une proposition, puis une
          acceptation qui préserve l'équilibre détaillé.
        </p>
      </section>
    </LessonFlow>
  );
}
