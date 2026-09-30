import { LessonFlow } from "../../components/LessonFlow";
import { Tex } from "../../components/Tex";
import { BetaViz } from "./BetaViz";

export function VraisemblanceLesson() {
  return (
    <LessonFlow>
      <section className="section">
        <span className="section-num">1</span>
        <h2>La vraisemblance : la probabilité des données, vue comme fonction des paramètres</h2>
        <p>
          Un modèle probabiliste donne une loi <Tex>{"p(x \\mid \\theta)"}</Tex> qui dépend de paramètres{" "}
          <Tex>\theta</Tex>. On observe des données <Tex>{"x_1, \\dots, x_N"}</Tex>, supposées indépendantes et de
          même loi. Leur probabilité jointe est alors un produit (MML, équation 8.16) ; vue comme une fonction de{" "}
          <Tex>\theta</Tex>, les données étant fixées, c'est la <strong>vraisemblance</strong>. On travaille plutôt
          avec son opposé en logarithme, qui change le produit en somme (équation 8.17) :
        </p>
        <Tex block>{"L(\\theta) = -\\log \\prod_{n=1}^N p(x_n \\mid \\theta) = -\\sum_{n=1}^N \\log p(x_n \\mid \\theta)"}</Tex>
        <p>
          L'<strong>estimateur du maximum de vraisemblance</strong> (MLE) est le <Tex>\theta</Tex> qui rend les
          données observées les plus probables, c'est-à-dire qui minimise <Tex>{"L(\\theta)"}</Tex>. MML met en garde :
          ce n'est pas une loi sur <Tex>\theta</Tex>, c'est une fonction de <Tex>\theta</Tex>.
        </p>
        <p>
          <strong>Une pièce.</strong> <Tex>k</Tex> piles sur <Tex>n</Tex> lancers, de probabilité inconnue{" "}
          <Tex>\theta</Tex> : <Tex>{"L(\\theta) = -k\\log\\theta - (n - k)\\log(1 - \\theta)"}</Tex>. La dérivée{" "}
          <Tex>{"-k/\\theta + (n-k)/(1-\\theta)"}</Tex> s'annule en <Tex>{"\\hat\\theta = k/n"}</Tex> : la fréquence
          observée. <strong>Une gaussienne.</strong> Pour <Tex>{"\\mathcal N(\\mu, \\sigma^2)"}</Tex>, le maximum de
          vraisemblance donne la moyenne empirique et la variance empirique divisée par <Tex>N</Tex> (Bishop, PRML,
          équations 1.55 et 1.56). Cette variance est biaisée :{" "}
          <Tex>{"E(\\hat\\sigma^2_{\\text{ML}}) = \\frac{N-1}{N}\\sigma^2"}</Tex> (équation 1.58), parce qu'elle est
          mesurée autour de la moyenne empirique et non de la vraie. C'est l'origine du <Tex>{"N - 1"}</Tex> du
          chapitre 6.
        </p>
        <pre>
          <code>{`import numpy as np

# 7 piles sur 10 lancers : log-vraisemblance de theta
k, n = 7, 10
theta = np.linspace(0.001, 0.999, 999)
logL = k * np.log(theta) + (n - k) * np.log(1 - theta)
print(theta[np.argmax(logL)].round(3))

# Variance par maximum de vraisemblance sur N = 5 points : biaisée
rng = np.random.default_rng(0)
x = rng.normal(0, 2, size=(200_000, 5))  # vraie variance 4
var_ml = x.var(axis=1)                   # divise par N
print(var_ml.mean().round(2), (4 * 4 / 5))  # E = (N-1)/N sigma²
# 0.7
# 3.21 3.2`}</code>
        </pre>
      </section>

      <section className="section">
        <span className="section-num">2</span>
        <h2>Minimiser une perte, c'est maximiser une vraisemblance</h2>
        <p>
          <strong>Moindres carrés.</strong> Si l'on suppose <Tex>{"y_n = x_n^\\top\\theta + \\varepsilon_n"}</Tex> avec
          un bruit gaussien <Tex>{"\\varepsilon_n \\sim \\mathcal N(0, \\sigma^2)"}</Tex> (MML, exemple 8.4), le calcul
          de l'exemple 8.5 donne
        </p>
        <Tex block>{"L(\\theta) = \\frac{1}{2\\sigma^2} \\sum_{n=1}^N (y_n - x_n^\\top \\theta)^2 + \\text{constante}"}</Tex>
        <p>
          Maximiser la vraisemblance, c'est exactement résoudre les moindres carrés du chapitre Orthogonalité. La perte
          quadratique n'est pas un choix arbitraire : c'est l'hypothèse d'un bruit gaussien.
        </p>
        <p>
          <strong>Entropie croisée.</strong> Pour un classifieur à <Tex>K</Tex> classes qui sort des probabilités{" "}
          <Tex>{"y_{nk}"}</Tex> par softmax, la vraisemblance des vraies classes, codées en one-hot{" "}
          <Tex>{"t_{nk}"}</Tex>, est <Tex>{"\\prod_n \\prod_k y_{nk}^{t_{nk}}"}</Tex>. Son opposé en logarithme est
          l'<strong>entropie croisée</strong> (Bishop, PRML, section 4.3.4, équations 4.107 et 4.108) :
        </p>
        <Tex block>{"E = -\\sum_{n=1}^N \\sum_{k=1}^K t_{nk} \\log y_{nk} = -\\sum_{n=1}^N \\log y_{n, c_n}"}</Tex>
        <p>
          où <Tex>{"c_n"}</Tex> est la vraie classe de l'exemple <Tex>n</Tex> : on pénalise le log de la probabilité
          donnée à la bonne réponse. Son gradient par rapport aux poids de la classe <Tex>j</Tex> est remarquablement
          simple, <Tex>{"\\sum_n (y_{nj} - t_{nj})\\,\\phi_n"}</Tex> (équation 4.109) : l'erreur de probabilité fois
          l'entrée. Sans entrée du tout, le modèle qui minimise l'entropie croisée prédit simplement les fréquences
          observées, comme la pièce de la section 1.
        </p>
        <pre>
          <code>{`import numpy as np

# Classes observées : l'entropie croisée minimale donne les fréquences
y = np.array([0] * 50 + [1] * 30 + [2] * 20)
z = np.zeros(3)  # logits à apprendre
for _ in range(2_000):
    p = np.exp(z) / np.exp(z).sum()
    freq = np.bincount(y, minlength=3) / y.size
    grad = p - freq  # gradient de -(1/N) log L par rapport à z
    z -= 1.0 * grad
p = np.exp(z) / np.exp(z).sum()
print(p.round(3), -np.mean(np.log(p[y])).round(4))
# [0.5 0.3 0.2] 1.0297`}</code>
        </pre>
        <p>
          La perte finale, 1,0297, vaut <Tex>{"-\\sum_k p_k \\ln p_k"}</Tex> pour <Tex>{"p = (0{,}5\\ ;\\ 0{,}3\\ ;\\ 0{,}2)"}</Tex>{" "}
          : c'est l'<em>entropie</em> de la loi des classes, le plancher qu'aucun modèle sans information sur
          l'entrée ne peut descendre.
        </p>
      </section>

      <section className="section">
        <span className="section-num">3</span>
        <h2>L'approche bayésienne : une loi sur les paramètres</h2>
        <p>
          Avec 3 piles sur 3 lancers, le maximum de vraisemblance conclut <Tex>{"\\hat\\theta = 1"}</Tex> : la pièce ne
          ferait jamais face. L'approche bayésienne traite <Tex>\theta</Tex> comme une variable aléatoire, avec une loi{" "}
          <strong>a priori</strong> <Tex>{"p(\\theta)"}</Tex> qui résume ce que l'on croit avant les données. La
          formule de Bayes du chapitre 2 donne la loi <strong>a posteriori</strong> (MML, équations 8.19 et 8.20) :
        </p>
        <Tex block>{"p(\\theta \\mid x) = \\frac{p(x \\mid \\theta)\\, p(\\theta)}{p(x)} \\propto p(x \\mid \\theta)\\, p(\\theta)"}</Tex>
        <p>
          Pour une pièce, un a priori commode est la loi <strong>Beta</strong>{" "}
          <Tex>{"p(\\theta) \\propto \\theta^{\\alpha - 1}(1 - \\theta)^{\\beta - 1}"}</Tex> sur <Tex>{"[0, 1]"}</Tex>,
          d'espérance <Tex>{"\\alpha/(\\alpha + \\beta)"}</Tex> (MML, exemple 6.10 et équation 6.99) ; Beta(1, 1) est
          la loi uniforme. Multiplier par la vraisemblance <Tex>{"\\theta^k (1 - \\theta)^{n-k}"}</Tex> ajoute
          simplement les exposants (exemple 6.11) : l'a posteriori est{" "}
          <Tex>{"\\text{Beta}(\\alpha + k, \\beta + n - k)"}</Tex>, de la même famille que l'a priori. On dit que la
          loi Beta est <strong>conjuguée</strong> à la binomiale. Tout se passe comme si l'a priori ajoutait{" "}
          <Tex>\alpha</Tex> piles et <Tex>\beta</Tex> faces fictifs aux données :
        </p>
        <Tex block>{"E(\\theta \\mid k \\text{ piles sur } n) = \\frac{\\alpha + k}{\\alpha + \\beta + n}"}</Tex>
        <p>
          Avec l'a priori uniforme et 3 piles sur 3, on obtient 4/5 au lieu de 1. C'est le <em>lissage additif</em>{" "}
          <Tex>{"(k + 1)/(n + 2)"}</Tex>, utilisé par exemple pour éviter qu'un mot jamais vu reçoive une probabilité
          nulle. Quand <Tex>n</Tex> grandit, les pseudo-observations deviennent négligeables et l'estimation rejoint{" "}
          <Tex>{"k/n"}</Tex>.
        </p>
        <BetaViz />
      </section>

      <section className="section">
        <span className="section-num">4</span>
        <h2>Le maximum a posteriori, et le weight decay</h2>
        <p>
          Plutôt que toute la loi a posteriori, on peut en garder le mode : c'est l'estimation du{" "}
          <strong>maximum a posteriori</strong> (MAP, MML section 8.3.2). En passant au logarithme, elle minimise{" "}
          <Tex>{"L(\\theta) - \\log p(\\theta)"}</Tex> : la perte de la section 2, plus un terme qui ne dépend que des
          paramètres. Pour la régression linéaire avec un a priori gaussien{" "}
          <Tex>{"\\theta \\sim \\mathcal N(0, \\tau^2 I)"}</Tex> (MML, exemple 8.6), ce terme vaut{" "}
          <Tex>{"\\|\\theta\\|^2 / 2\\tau^2"}</Tex> à une constante près :
        </p>
        <Tex block>{"\\hat\\theta_{\\text{MAP}} = \\arg\\min_\\theta\\ \\frac{1}{2\\sigma^2}\\sum_n (y_n - x_n^\\top\\theta)^2 + \\frac{1}{2\\tau^2}\\|\\theta\\|^2"}</Tex>
        <p>
          C'est la régression régularisée par la norme au carré, avec{" "}
          <Tex>{"\\lambda = \\sigma^2/\\tau^2"}</Tex>, de solution{" "}
          <Tex>{"(X^\\top X + \\lambda I)^{-1} X^\\top y"}</Tex>. Bishop (PRML, équations 1.65 à 1.67) fait le même
          calcul, et note (section 1.1) que les statisticiens appellent cette pénalité <em>ridge regression</em> et
          que, pour les réseaux de neurones, on l'appelle <strong>weight decay</strong>. Un a priori plus serré (
          <Tex>\tau</Tex> petit) régularise plus fort. L'entropie croisée et le weight decay sortent donc du même
          principe : maximiser la probabilité a posteriori des paramètres.
        </p>
        <pre>
          <code>{`import numpy as np
from scipy.optimize import minimize

rng = np.random.default_rng(0)
N, D = 20, 5
X = rng.standard_normal((N, D))
w_vrai = np.array([2.0, -1.0, 0.0, 0.5, 0.0])
y = X @ w_vrai + rng.normal(0, 1.0, N)  # bruit sigma = 1
sigma2, tau2 = 1.0, 0.25                # a priori w ~ N(0, tau² I)
lam = sigma2 / tau2
w_map = np.linalg.solve(X.T @ X + lam * np.eye(D), X.T @ y)
def nlp(w):  # opposé du log a posteriori, à une constante près
    return np.sum((y - X @ w)**2) / (2 * sigma2) + w @ w / (2 * tau2)

w_num = minimize(nlp, np.zeros(D)).x
w_mle = np.linalg.lstsq(X, y, rcond=None)[0]
print(w_map.round(3))
print(np.abs(w_map - w_num).max() < 1e-4)
print(np.linalg.norm(w_mle).round(3), np.linalg.norm(w_map).round(3))
# [ 1.737 -0.617 -0.031 -0.077 -0.038]
# True
# 2.974 1.845`}</code>
        </pre>
        <p>
          La formule fermée coïncide avec la minimisation numérique de l'opposé du log a posteriori, et l'a priori
          rapproche les poids de 0 : leur norme passe de 2,97 à 1,85.
        </p>
      </section>
    </LessonFlow>
  );
}
