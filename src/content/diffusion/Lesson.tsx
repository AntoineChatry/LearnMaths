import { LessonFlow } from "../../components/LessonFlow";
import { Tex } from "../../components/Tex";
import { DiffusionViz } from "./DiffusionViz";

export function DiffusionLesson() {
  return (
    <LessonFlow>
      <section className="section">
        <span className="section-num">1</span>
        <h2>Détruire les données, pas à pas</h2>
        <p>
          Un modèle de diffusion apprend à générer des images en apprenant d'abord à les détruire. L'idée remonte à
          Sohl-Dickstein et al. (2015) ; la version qui a fait décoller la méthode est celle de Ho et al. (2020),
          appelée DDPM. Le <strong>processus vers l'avant</strong> est la chaîne de Markov du chapitre précédent,
          avec un <Tex>{"\\beta_t"}</Tex> qui varie (Ho et al., équation 2) :
        </p>
        <Tex block>{"\\begin{aligned} q(x_t \\mid x_{t-1}) &= N\\big(\\sqrt{1 - \\beta_t}\\, x_{t-1},\\ \\beta_t I\\big) \\\\ \\text{donc}\\quad q(x_t \\mid x_0) &= N\\big(\\sqrt{\\bar\\alpha_t}\\, x_0,\\ (1 - \\bar\\alpha_t) I\\big) \\end{aligned}"}</Tex>
        <p>
          avec <Tex>{"\\alpha_t = 1 - \\beta_t"}</Tex> et <Tex>{"\\bar\\alpha_t = \\alpha_1 \\cdots \\alpha_t"}</Tex>{" "}
          (équation 4). Ce processus n'a rien à apprendre. Ho et al. prennent <Tex>{"T = 1000"}</Tex> pas et un{" "}
          <Tex>{"\\beta_t"}</Tex> qui croît linéairement de <Tex>{"10^{-4}"}</Tex> à 0,02 (section 4). Pour voir ce
          que cela fait, prenons comme « données » des nombres réels tirés de la loi à deux bosses du chapitre 3,{" "}
          <Tex>{"0{,}3\\,N(-2, 0{,}5^2) + 0{,}7\\,N(2, 0{,}5^2)"}</Tex> : une image serait un vecteur de millions de
          tels nombres, mais le principe est le même.
        </p>
        <pre>
          <code>{`import numpy as np

T = 1000
beta = np.linspace(1e-4, 0.02, T)                # calendrier linéaire de Ho et al. (section 4)
abar = np.cumprod(1 - beta)                      # abar_t = (1 - beta_1) ... (1 - beta_t)

rng = np.random.default_rng(0)
n = 100000                                       # « données » : 0,3 N(-2, 0,5²) + 0,7 N(2, 0,5²)
x0 = np.where(rng.random(n) < 0.3, -2.0, 2.0) + 0.5 * rng.standard_normal(n)
for t in [1, 100, 250, 500, 1000]:
    a = abar[t - 1]
    xt = np.sqrt(a) * x0 + np.sqrt(1 - a) * rng.standard_normal(n)   # éq. 4, sans passer par les pas
    print(t, f"{a:.2g}", round(np.sqrt(a), 3), round(xt.mean(), 2), round(xt.var(), 2), round((xt > 0).mean(), 2))
# 1 1 1.0 0.8 3.61 0.7
# 100 0.9 0.947 0.76 3.35 0.7
# 250 0.52 0.724 0.59 2.36 0.69
# 500 0.079 0.28 0.23 1.21 0.59
# 1000 4e-05 0.006 0.01 1.0 0.5`}</code>
        </pre>
        <p>
          La troisième colonne, <Tex>{"\\sqrt{\\bar\\alpha_t}"}</Tex>, est la part du signal qui reste. Au pas 500, il
          n'en reste que 28 % ; au pas 1 000, 0,6 %, et <Tex>{"x_{1000}"}</Tex> est indiscernable d'un tirage de{" "}
          <Tex>{"N(0, 1)"}</Tex> : moyenne 0, variance 1, autant de tirages de chaque côté. L'équation 4 permet
          d'obtenir <Tex>{"x_t"}</Tex> en une seule fois, sans simuler les <Tex>t</Tex> pas.
        </p>
      </section>

      <section className="section">
        <span className="section-num">2</span>
        <h2>Remonter le temps : prédire le bruit</h2>
        <p>
          Générer, c'est faire le chemin inverse : partir de <Tex>{"x_T \\sim N(0, I)"}</Tex> et remonter vers{" "}
          <Tex>{"x_0"}</Tex>. Le pas inverse <Tex>{"q(x_{t-1} \\mid x_t)"}</Tex> est inconnu, car il dépend de toute la
          loi des données. Mais si l'on connaissait aussi <Tex>{"x_0"}</Tex>, il serait gaussien et explicite (Ho et
          al., équations 6 et 7) :
        </p>
        <Tex block>{"\\begin{aligned} q(x_{t-1} \\mid x_t, x_0) &= N\\big(\\tilde\\mu_t,\\ \\tilde\\beta_t I\\big) \\\\ \\tilde\\mu_t &= \\frac{\\sqrt{\\bar\\alpha_{t-1}}\\,\\beta_t}{1 - \\bar\\alpha_t}\\, x_0 + \\frac{\\sqrt{\\alpha_t}\\,(1 - \\bar\\alpha_{t-1})}{1 - \\bar\\alpha_t}\\, x_t \\\\ \\tilde\\beta_t &= \\frac{1 - \\bar\\alpha_{t-1}}{1 - \\bar\\alpha_t}\\, \\beta_t \\end{aligned}"}</Tex>
        <p>
          Ce n'est que le conditionnement d'un couple gaussien, comme on le vérifie ci-dessous de deux façons : par la
          formule générale du conditionnement, et par simulation, en gardant les tirages où <Tex>{"x_t"}</Tex> tombe
          près d'une valeur donnée.
        </p>
        <pre>
          <code>{`import numpy as np

T = 1000
beta = np.linspace(1e-4, 0.02, T)
alpha, abar = 1 - beta, np.cumprod(1 - beta)

t, x0 = 300, 1.5                                 # on remonte de x_300 à x_299, en connaissant x_0
b, a, ab, ab1 = beta[t - 1], alpha[t - 1], abar[t - 1], abar[t - 2]
# formule de Ho et al. (éq. 6 et 7) pour q(x_{t-1} | x_t, x_0)
coef_x0 = np.sqrt(ab1) * b / (1 - ab)
coef_xt = np.sqrt(a) * (1 - ab1) / (1 - ab)
var_post = (1 - ab1) / (1 - ab) * b

# vérification directe : (x_{t-1}, x_t) sachant x_0 est un couple gaussien, on conditionne
m = np.array([np.sqrt(ab1) * x0, np.sqrt(ab) * x0])           # moyennes
C = np.array([[1 - ab1, np.sqrt(a) * (1 - ab1)],              # covariances
              [np.sqrt(a) * (1 - ab1), 1 - ab]])
pente = C[0, 1] / C[1, 1]                                     # E(x_{t-1} | x_t) = m0 + pente (x_t - m1)
print(round(coef_xt, 6), round(pente, 6))
print(round(coef_x0 * x0, 6), round(m[0] - pente * m[1], 6))
print(round(var_post, 6), round(C[0, 0] - C[0, 1]**2 / C[1, 1], 6))

# et par simulation : on garde les tirages où x_t tombe près de 0,7
rng = np.random.default_rng(0)
xs1 = np.sqrt(ab1) * x0 + np.sqrt(1 - ab1) * rng.standard_normal(4_000_000)
xst = np.sqrt(a) * xs1 + np.sqrt(b) * rng.standard_normal(4_000_000)
garde = np.abs(xst - 0.7) < 0.005
print(round(xs1[garde].mean(), 4), round(coef_x0 * x0 + coef_xt * 0.7, 4), round(xs1[garde].var(), 5), round(var_post, 5))
# 0.992978 0.992978
# 0.009505 0.009505
# 0.006032 0.006032
# 0.7051 0.7046 0.00597 0.00603`}</code>
        </pre>
        <p>
          Comme on ne connaît pas <Tex>{"x_0"}</Tex> au moment de générer, Ho et al. le remplacent par une estimation.
          On écrit <Tex>{"x_t = \\sqrt{\\bar\\alpha_t}\\, x_0 + \\sqrt{1 - \\bar\\alpha_t}\\, \\varepsilon"}</Tex>, et un
          réseau <Tex>{"\\varepsilon_\\theta(x_t, t)"}</Tex> apprend à retrouver le bruit <Tex>\varepsilon</Tex> qui a
          été ajouté. L'entraînement (algorithme 1) tire une donnée, un pas <Tex>t</Tex> et un bruit, puis minimise
        </p>
        <Tex block>{"L_{\\text{simple}}(\\theta) = \\mathbb E_{t,\\, x_0,\\, \\varepsilon}\\, \\big\\| \\varepsilon - \\varepsilon_\\theta\\big(\\sqrt{\\bar\\alpha_t}\\, x_0 + \\sqrt{1 - \\bar\\alpha_t}\\, \\varepsilon,\\ t\\big) \\big\\|^2"}</Tex>
        <p>
          (équation 14). Un simple problème de régression, donc. La génération (algorithme 2, équation 11) part de{" "}
          <Tex>{"x_T \\sim N(0, I)"}</Tex> et répète, de <Tex>{"t = T"}</Tex> à 1, avec{" "}
          <Tex>{"z \\sim N(0, I)"}</Tex> (et <Tex>{"z = 0"}</Tex> au dernier pas) :
        </p>
        <Tex block>{"x_{t-1} = \\frac{1}{\\sqrt{\\alpha_t}} \\Big( x_t - \\frac{\\beta_t}{\\sqrt{1 - \\bar\\alpha_t}}\\, \\varepsilon_\\theta(x_t, t) \\Big) + \\sigma_t z"}</Tex>
        <p>
          On enlève un peu du bruit prédit, puis on rajoute un peu de bruit frais, de variance{" "}
          <Tex>{"\\sigma_t^2 = \\beta_t"}</Tex> (l'un des deux choix testés par Ho et al., section 3.2).
        </p>
      </section>

      <section className="section">
        <span className="section-num">3</span>
        <h2>Prédire le bruit, c'est estimer le score</h2>
        <p>
          Que vaut le meilleur prédicteur possible ? Le <strong>score</strong> d'une loi <Tex>p</Tex> est{" "}
          <Tex>{"\\nabla_x \\log p(x)"}</Tex> : la direction dans laquelle la densité augmente le plus vite. Le score
          matching par débruitage (Vincent, 2011, équations 9 à 11 ; Song et Ermon, 2019, équation 2) dit qu'apprendre à
          débruiter revient à apprendre le score de la loi bruitée. Pour DDPM, le meilleur{" "}
          <Tex>{"\\varepsilon_\\theta"}</Tex> est
        </p>
        <Tex block>{"\\varepsilon^\\star(x_t, t) = -\\sqrt{1 - \\bar\\alpha_t}\\ \\nabla_{x_t} \\log q_t(x_t)"}</Tex>
        <p>
          où <Tex>{"q_t"}</Tex> est la loi de <Tex>{"x_t"}</Tex>. Ho et al. notent ce lien après leur équation 12. Le
          signe moins se comprend bien : le bruit pointe <em>hors</em> des zones probables, le score pointe{" "}
          <em>vers</em> elles. Sur nos données à deux bosses, <Tex>{"q_t"}</Tex> reste un mélange de deux gaussiennes,
          de moyennes <Tex>{"\\pm 2\\sqrt{\\bar\\alpha_t}"}</Tex> et de variance{" "}
          <Tex>{"0{,}25\\,\\bar\\alpha_t + 1 - \\bar\\alpha_t"}</Tex> : on peut calculer ce score exactement, sans rien
          apprendre, et vérifier que l'algorithme 2 recrée bien les données.
        </p>
        <pre>
          <code>{`import numpy as np

T = 1000
beta = np.linspace(1e-4, 0.02, T)
alpha, abar = 1 - beta, np.cumprod(1 - beta)
poids, mu, s = np.array([0.3, 0.7]), np.array([-2.0, 2.0]), 0.5     # données : 0,3 N(-2, 0,5²) + 0,7 N(2, 0,5²)

def score(x, t):                                 # grad log q_t(x), exact : q_t est encore un mélange de gaussiennes
    m = np.sqrt(abar[t - 1]) * mu                # chaque composante devient N(sqrt(abar) mu, abar s² + 1 - abar)
    v = abar[t - 1] * s**2 + 1 - abar[t - 1]
    dens = poids * np.exp(-(x[:, None] - m)**2 / (2 * v))
    return (dens * (m - x[:, None]) / v).sum(axis=1) / dens.sum(axis=1)

def eps_ideal(x, t):                             # le meilleur prédicteur du bruit : -sqrt(1 - abar) x score
    return -np.sqrt(1 - abar[t - 1]) * score(x, t)

rng = np.random.default_rng(0)                   # cible : moyenne 0,8 ; 70 % à droite ; écart-type 0,5 par bosse
x = rng.standard_normal(100000)                  # algorithme 2 de Ho et al. : on part du bruit pur
for t in range(T, 0, -1):
    z = rng.standard_normal(x.size) if t > 1 else 0
    x = (x - beta[t - 1] / np.sqrt(1 - abar[t - 1]) * eps_ideal(x, t)) / np.sqrt(alpha[t - 1]) + np.sqrt(beta[t - 1]) * z
print(round(x.mean(), 3), round((x > 0).mean(), 3), round(x[x > 0].std(), 3), round(x[x < 0].mean(), 3))
# 0.801 0.7 0.503 -1.998`}</code>
        </pre>
        <p>
          Partis de 100 000 tirages de bruit pur, on retrouve la loi des données : moyenne 0,8, 70 % des points à
          droite, des bosses d'écart-type 0,5 centrées en −2 et 2. Dans la réalité, personne ne connaît le score de la
          loi des images : il faut l'apprendre. Faisons-le avec un vrai petit réseau de neurones, deux couches de 64
          neurones, entraîné par l'algorithme 1.
        </p>
        <pre>
          <code>{`import warnings
import numpy as np
from sklearn.neural_network import MLPRegressor

warnings.filterwarnings("ignore")                # 20 passes suffisent ici, on tait l'avertissement de convergence
T = 1000
beta = np.linspace(1e-4, 0.02, T)
alpha, abar = 1 - beta, np.cumprod(1 - beta)
rng = np.random.default_rng(0)

# algorithme 1 de Ho et al. : x_0 tiré des données, t au hasard, on bruite, on apprend à retrouver le bruit
n = 300000
x0 = np.where(rng.random(n) < 0.3, -2.0, 2.0) + 0.5 * rng.standard_normal(n)
t = rng.integers(1, T + 1, n)
eps = rng.standard_normal(n)
xt = np.sqrt(abar[t - 1]) * x0 + np.sqrt(1 - abar[t - 1]) * eps
reseau = MLPRegressor(hidden_layer_sizes=(64, 64), max_iter=20, random_state=0)
reseau.fit(np.column_stack([xt, t / T]), eps)    # perte : || eps - eps_theta(x_t, t) ||²  (éq. 14)
m = np.sqrt(abar[t - 1])[:, None] * np.array([-2.0, 2.0])          # prédicteur idéal du bloc précédent
v = (abar[t - 1] * 0.25 + 1 - abar[t - 1])[:, None]
dens = np.array([0.3, 0.7]) * np.exp(-(xt[:, None] - m)**2 / (2 * v))
ideal = -np.sqrt(1 - abar[t - 1]) * (dens * (m - xt[:, None]) / v).sum(axis=1) / dens.sum(axis=1)
print(round(np.mean((reseau.predict(np.column_stack([xt, t / T])) - eps)**2), 3), round(np.mean((ideal - eps)**2), 3))

# algorithme 2 avec le réseau appris à la place du vrai bruit
x = rng.standard_normal(20000)
for s in range(T, 0, -1):
    e = reseau.predict(np.column_stack([x, np.full(x.size, s / T)]))
    z = rng.standard_normal(x.size) if s > 1 else 0
    x = (x - beta[s - 1] / np.sqrt(1 - abar[s - 1]) * e) / np.sqrt(alpha[s - 1]) + np.sqrt(beta[s - 1]) * z
print(round(x.mean(), 2), round((x > 0).mean(), 2), round(x[x > 0].std(), 2), round(x[x < 0].mean(), 2))
# 0.288 0.287
# 0.77 0.7 0.51 -2.03`}</code>
        </pre>
        <p>
          La perte ne descend pas à 0, et c'est normal : à partir de <Tex>{"x_t"}</Tex> seul, on ne peut pas deviner
          exactement le bruit ajouté. Le meilleur prédicteur possible, <Tex>{"\\varepsilon^\\star"}</Tex>, fait 0,287 ;
          le réseau atteint 0,288. Utilisé dans l'algorithme 2, il génère des points dont la loi est très proche de
          celle des données. C'est exactement ce que fait un générateur d'images, avec un réseau bien plus gros et des
          vecteurs de millions de coordonnées. Le calcul prend une quarantaine de secondes.
        </p>
      </section>

      <section className="section">
        <span className="section-num">4</span>
        <h2>Le point de vue continu</h2>
        <p>
          Song et al. (2021) font tendre le nombre de pas vers l'infini. Le bruitage devient une équation
          différentielle stochastique (EDS), <Tex>{"dx = f(x, t)\\, dt + g(t)\\, dw"}</Tex> (équation 5), et la chaîne
          de DDPM tend vers l'EDS « à variance préservée » (équations 10 et 11) :
        </p>
        <Tex block>{"dx = -\\tfrac12 \\beta(t)\\, x\\, dt + \\sqrt{\\beta(t)}\\, dw"}</Tex>
        <p>
          C'est un processus d'Ornstein-Uhlenbeck dont la force de rappel varie avec le temps. Avec{" "}
          <Tex>{"\\beta(t) = 0{,}1 + 19{,}9\\, t"}</Tex> sur <Tex>{"[0, 1]"}</Tex>, on retrouve le calendrier de Ho et
          al. (équation 32). Un résultat d'Anderson (1982) dit que le chemin inverse est encore une EDS, qui remonte le
          temps (équation 6) :
        </p>
        <Tex block>{"dx = \\big[ f(x, t) - g(t)^2\\, \\nabla_x \\log p_t(x) \\big]\\, dt + g(t)\\, d\\bar w"}</Tex>
        <p>
          Il suffit de connaître le score à chaque instant. Mieux, il existe une équation <em>sans hasard</em> dont les
          trajectoires ont les mêmes lois marginales <Tex>{"p_t"}</Tex> : le <strong>flot de probabilité</strong>{" "}
          (équation 13),
        </p>
        <Tex block>{"dx = \\big[ f(x, t) - \\tfrac12\\, g(t)^2\\, \\nabla_x \\log p_t(x) \\big]\\, dt"}</Tex>
        <pre>
          <code>{`import numpy as np
from scipy.stats import norm

bmin, bmax = 0.1, 20.0                           # VP SDE de Song et al. (éq. 32)
beta = lambda t: bmin + t * (bmax - bmin)
def a(t):                                        # x(t) | x(0) ~ N(a(t) x(0), 1 - a(t)²)  (éq. 33)
    return np.exp(-0.25 * t**2 * (bmax - bmin) - 0.5 * t * bmin)

poids, mu, s = np.array([0.3, 0.7]), np.array([-2.0, 2.0]), 0.5
def score(x, t):                                 # grad log p_t(x), exact pour le mélange de gaussiennes
    m, v = a(t) * mu, a(t)**2 * s**2 + 1 - a(t)**2
    dens = poids * np.exp(-(x[:, None] - m)**2 / (2 * v))
    return (dens * (m - x[:, None]) / v).sum(axis=1) / dens.sum(axis=1)

rng = np.random.default_rng(0)
N = 1000
dt = 1 / N
z0 = rng.standard_normal(50000)                  # bruit de départ, au temps t = 1
x_sde, x_ode = z0.copy(), z0.copy()
for k in range(N, 0, -1):                        # on remonte le temps de t = 1 à t = 0
    t = k / N
    f_sde = -0.5 * beta(t) * x_sde - beta(t) * score(x_sde, t)           # éq. 6 : f - g² score
    x_sde = x_sde - f_sde * dt + np.sqrt(beta(t) * dt) * rng.standard_normal(x_sde.size)
    f_ode = -0.5 * beta(t) * x_ode - 0.5 * beta(t) * score(x_ode, t)     # éq. 13 : f - g² score / 2
    x_ode = x_ode - f_ode * dt
for x in (x_sde, x_ode):
    print(round(x.mean(), 2), round((x > 0).mean(), 3), round(x[x > 0].std(), 2))
# l'équation déterministe envoie chaque bruit sur un point précis : la frontière est au quantile 30 %
print(round(norm.ppf(0.3), 3), round(z0[x_ode < 0].max(), 3), round(z0[x_ode > 0].min(), 3))
# 0.81 0.701 0.5
# 0.79 0.697 0.5
# -0.524 -0.519 -0.519`}</code>
        </pre>
        <p>
          Les deux équations, intégrées en 1 000 pas, retrouvent la loi des données. Mais le flot fait plus : il
          associe à chaque bruit de départ un point précis, et respecte l'ordre. Les 30 % de bruits les plus petits
          (en dessous de −0,52) partent tous dans la bosse de gauche, qui pèse justement 30 %. Comme le flot est
          déterministe et inversible, il permet aussi de remonter des données vers le bruit et de calculer exactement
          la vraisemblance d'une donnée (Song et al., section 4.3). Le schéma qui sert ici à intégrer les deux
          équations est celui d'Euler-Maruyama du chapitre précédent.
        </p>
        <DiffusionViz />
        <p>
          Ce module se referme sur lui-même : une chaîne de Markov (chapitre 1) qui oublie son départ et converge vers
          une loi stationnaire, ici <Tex>{"N(0, I)"}</Tex> (chapitre 2), parcourue à l'envers grâce au score. Comme
          au chapitre 3, la constante de normalisation ne gêne pas :{" "}
          <Tex>{"\\nabla \\log (\\tilde p / Z) = \\nabla \\log \\tilde p"}</Tex>, et ce gradient est celui qu'utilise
          Monte-Carlo hamiltonien. Le tout est la limite continue des marches aléatoires du chapitre 4.
        </p>
      </section>
    </LessonFlow>
  );
}
