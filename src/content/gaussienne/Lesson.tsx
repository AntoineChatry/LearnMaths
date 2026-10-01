import { LessonFlow } from "../../components/LessonFlow";
import { Tex } from "../../components/Tex";
import { GaussViz } from "./GaussViz";

export function GaussienneLesson() {
  return (
    <LessonFlow>
      <section className="section">
        <span className="section-num">1</span>
        <h2>La loi normale en dimension 1</h2>
        <p>
          La <strong>loi normale</strong>, ou gaussienne, de moyenne <Tex>\mu</Tex> et de variance{" "}
          <Tex>{"\\sigma^2"}</Tex> a pour densité (MML, équation 6.62) :
        </p>
        <Tex block>{"p(x \\mid \\mu, \\sigma^2) = \\frac{1}{\\sqrt{2\\pi\\sigma^2}} \\exp\\left(-\\frac{(x - \\mu)^2}{2\\sigma^2}\\right)"}</Tex>
        <p>
          On écrit <Tex>{"X \\sim \\mathcal N(\\mu, \\sigma^2)"}</Tex>. La courbe en cloche est symétrique autour de{" "}
          <Tex>\mu</Tex>, et <Tex>\sigma</Tex> règle sa largeur. Le cas <Tex>{"\\mu = 0"}</Tex>,{" "}
          <Tex>{"\\sigma = 1"}</Tex> est la loi <strong>normale standard</strong>. Tout se ramène à elle : si{" "}
          <Tex>{"X \\sim \\mathcal N(\\mu, \\sigma^2)"}</Tex>, alors <Tex>{"Z = (X - \\mu)/\\sigma"}</Tex> suit{" "}
          <Tex>{"\\mathcal N(0, 1)"}</Tex>, et inversement <Tex>{"X = \\mu + \\sigma Z"}</Tex>. C'est un cas du
          changement de variable affine du chapitre 5 : une transformation affine d'une gaussienne reste gaussienne,{" "}
          <Tex>{"aX + b \\sim \\mathcal N(a\\mu + b, a^2\\sigma^2)"}</Tex>.
        </p>
        <p>
          La fonction de répartition de la gaussienne n'a pas de formule avec les fonctions usuelles ; on la calcule
          avec la fonction d'erreur <code>erf</code>. Les proportions à retenir : une gaussienne tombe à moins d'un
          écart type de sa moyenne avec probabilité 0,683, à moins de deux avec 0,954 et à moins de trois avec 0,997.
        </p>
        <pre>
          <code>{`from math import erf, sqrt

# P(|X - mu| <= k sigma) pour une gaussienne, via Z = (X - mu) / sigma
for k in (1, 2, 3):
    print(k, round(erf(k / sqrt(2)), 4))
# 1 0.6827
# 2 0.9545
# 3 0.9973`}</code>
        </pre>
        <p>
          <strong>La somme de deux gaussiennes indépendantes est gaussienne</strong> (MML, équation 6.78), avec les
          moyennes et les variances qui s'additionnent comme au chapitre 4 :{" "}
          <Tex>{"aX + bY \\sim \\mathcal N(a\\mu_X + b\\mu_Y,\\ a^2\\sigma_X^2 + b^2\\sigma_Y^2)"}</Tex> (équation 6.79).
          C'est cette stabilité qui rend la gaussienne si commode : on suit seulement une moyenne et une variance.
        </p>
      </section>

      <section className="section">
        <span className="section-num">2</span>
        <h2>La gaussienne multivariée : une moyenne et une matrice de covariance</h2>
        <p>
          En dimension <Tex>D</Tex>, une gaussienne est entièrement décrite par son vecteur moyenne{" "}
          <Tex>{"\\mu \\in \\mathbb{R}^D"}</Tex> et sa matrice de covariance <Tex>\Sigma</Tex>, symétrique définie
          positive (MML, équation 6.63) :
        </p>
        <Tex block>{"p(x \\mid \\mu, \\Sigma) = (2\\pi)^{-D/2} |\\Sigma|^{-1/2} \\exp\\left(-\\frac12 (x - \\mu)^\\top \\Sigma^{-1} (x - \\mu)\\right)"}</Tex>
        <p>
          La densité ne dépend de <Tex>x</Tex> que par la forme quadratique{" "}
          <Tex>{"(x - \\mu)^\\top \\Sigma^{-1} (x - \\mu)"}</Tex>. Ses lignes de niveau sont donc des ellipses (des
          ellipsoïdes en dimension supérieure), centrées en <Tex>\mu</Tex>, dont les axes sont les vecteurs propres de{" "}
          <Tex>\Sigma</Tex> et les demi-longueurs proportionnelles aux <Tex>{"\\sqrt{\\lambda_i}"}</Tex> : c'est la
          forme quadratique du chapitre Matrices symétriques. Le facteur <Tex>{"|\\Sigma|^{-1/2}"}</Tex> compense
          l'étirement des volumes, comme dans le changement de variable. Le cas <Tex>{"\\mu = 0"}</Tex>,{" "}
          <Tex>{"\\Sigma = I"}</Tex> est la normale standard <Tex>{"\\mathcal N(0, I)"}</Tex>.
        </p>
        <GaussViz />
        <p>
          <strong>Pour un vecteur gaussien, non corrélé veut dire indépendant.</strong> Si <Tex>\Sigma</Tex> est
          diagonale, la forme quadratique devient <Tex>{"\\sum_i (x_i - \\mu_i)^2 / \\sigma_i^2"}</Tex>,
          l'exponentielle d'une somme est un produit, et la densité se factorise en un produit de densités
          normales : les composantes sont indépendantes. Le chapitre 6 a montré que c'est faux en général ; c'est une
          propriété de la gaussienne <em>multivariée</em>. Le vecteur doit être gaussien dans son ensemble (on dit{" "}
          <strong>conjointement</strong> gaussien) : deux variables gaussiennes chacune de leur côté ne suffisent pas.
          Avec <Tex>{"X \\sim \\mathcal N(0, 1)"}</Tex> et un signe <Tex>{"S = \\pm 1"}</Tex> tiré à pile ou face,
          indépendant de <Tex>X</Tex>, la variable <Tex>{"Y = SX"}</Tex> est aussi <Tex>{"\\mathcal N(0, 1)"}</Tex>{" "}
          et <Tex>{"E(XY) = E(S)\\,E(X^2) = 0"}</Tex>. Pourtant <Tex>{"|Y| = |X|"}</Tex> : elles sont dépendantes.
        </p>
      </section>

      <section className="section">
        <span className="section-num">3</span>
        <h2>Transformer, tirer, conditionner</h2>
        <p>
          <strong>Transformations linéaires.</strong> Si <Tex>{"x \\sim \\mathcal N(\\mu, \\Sigma)"}</Tex>, alors{" "}
          <Tex>{"y = Ax + b"}</Tex> est gaussien, de moyenne et covariance données par les règles du chapitre 6 (MML,
          équation 6.88) : <Tex>{"y \\sim \\mathcal N(A\\mu + b,\\ A\\Sigma A^\\top)"}</Tex>. En particulier, chaque
          coordonnée, et plus généralement chaque sous-vecteur, est gaussien : les marginales d'une gaussienne sont
          gaussiennes (section 6.5.1).
        </p>
        <p>
          <strong>Tirer selon <Tex>{"\\mathcal N(\\mu, \\Sigma)"}</Tex></strong> (section 6.5.4). On tire{" "}
          <Tex>{"z \\sim \\mathcal N(0, I)"}</Tex>, coordonnée par coordonnée, puis on pose{" "}
          <Tex>{"x = \\mu + Lz"}</Tex>, où <Tex>L</Tex> vérifie <Tex>{"LL^\\top = \\Sigma"}</Tex>. La règle précédente
          donne bien <Tex>{"V(x) = L I L^\\top = \\Sigma"}</Tex>. MML propose comme choix commode pour <Tex>L</Tex> le facteur de{" "}
          <strong>Cholesky</strong>, triangulaire inférieur (théorème 4.18), ce qui rend le calcul efficace.
        </p>
        <p>
          <strong>Conditionner.</strong> Si l'on observe une partie des coordonnées, la loi du reste est encore
          gaussienne (équations 6.65 à 6.67). En dimension 2, sachant <Tex>{"x_2"}</Tex> :
        </p>
        <Tex block>{"x_1 \\mid x_2 \\sim \\mathcal N\\left(\\mu_1 + \\frac{\\Sigma_{12}}{\\Sigma_{22}}(x_2 - \\mu_2),\\ \\ \\Sigma_{11} - \\frac{\\Sigma_{12}^2}{\\Sigma_{22}}\\right)"}</Tex>
        <p>
          La moyenne conditionnelle est une fonction <em>affine</em> de <Tex>{"x_2"}</Tex> : pour une gaussienne, le
          meilleur prédicteur <Tex>{"E(x_1 \\mid x_2)"}</Tex> du chapitre 6 est une droite de régression. La variance
          conditionnelle ne dépend pas de la valeur observée, et elle est plus petite que{" "}
          <Tex>{"\\Sigma_{11}"}</Tex> : observer <Tex>{"x_2"}</Tex> renseigne sur <Tex>{"x_1"}</Tex>. Exemple 6.6 de
          MML : <Tex>{"\\mu = (0, 2)"}</Tex>,{" "}
          <Tex>{"\\Sigma = \\begin{pmatrix} 0{,}3 & -1 \\\\ -1 & 5 \\end{pmatrix}"}</Tex> et{" "}
          <Tex>{"x_2 = -1"}</Tex> donnent <Tex>{"x_1 \\mid x_2 \\sim \\mathcal N(0{,}6\\ ;\\ 0{,}1)"}</Tex>. La
          simulation retrouve ces valeurs en ne gardant que les tirages où <Tex>{"x_2"}</Tex> est très proche de −1.
        </p>
        <pre>
          <code>{`import numpy as np

rng = np.random.default_rng(0)
mu = np.array([0.0, 2.0])
S = np.array([[0.3, -1.0], [-1.0, 5.0]])  # MML, exemple 6.6
L = np.linalg.cholesky(S)                 # S = L L^T
z = rng.standard_normal((1_000_000, 2))   # N(0, I)
x = mu + z @ L.T                          # N(mu, S)
print(np.cov(x, rowvar=False).round(2))
proche = np.abs(x[:, 1] + 1) < 0.01       # on observe x2 = -1
print(x[proche, 0].mean().round(2), x[proche, 0].var().round(2))
# [[ 0.3 -1. ]
#  [-1.   5. ]]
# 0.6 0.1`}</code>
        </pre>
      </section>

      <section className="section">
        <span className="section-num">4</span>
        <h2>Le bruit des modèles génératifs</h2>
        <p>
          <strong>L'astuce de reparamétrisation (VAE).</strong> Un autoencodeur variationnel encode une donnée en une
          gaussienne <Tex>{"\\mathcal N(\\mu, \\sigma^2)"}</Tex> sur l'espace latent, dont le réseau calcule{" "}
          <Tex>\mu</Tex> et <Tex>\sigma</Tex>, puis tire un code <Tex>z</Tex> selon cette loi. Pour entraîner le réseau
          par descente de gradient, il faut dériver à travers ce tirage. Kingma et Welling (2014, section 2.4)
          l'écrivent <Tex>{"z = \\mu + \\sigma\\epsilon"}</Tex> avec <Tex>{"\\epsilon \\sim \\mathcal N(0, 1)"}</Tex> :
          le hasard est déplacé dans <Tex>\epsilon</Tex>, qui ne dépend d'aucun paramètre, et <Tex>z</Tex> devient
          une fonction dérivable de <Tex>\mu</Tex> et <Tex>\sigma</Tex>. C'est exactement{" "}
          <Tex>{"X = \\mu + \\sigma Z"}</Tex> de la section 1. MML (section 4.3) note que le facteur de Cholesky joue ce
          rôle en dimension supérieure.
        </p>
        <p>
          <strong>Le bruit d'un modèle de diffusion.</strong> DDPM (Ho, Jain et Abbeel, 2020) détruit une image{" "}
          <Tex>{"x_0"}</Tex> en <Tex>T</Tex> petits pas gaussiens (leur équation 2) :{" "}
          <Tex>{"x_t = \\sqrt{1 - \\beta_t}\\, x_{t-1} + \\sqrt{\\beta_t}\\, \\epsilon_t"}</Tex>, avec des bruits{" "}
          <Tex>{"\\epsilon_t \\sim \\mathcal N(0, I)"}</Tex> indépendants. Une somme de gaussiennes indépendantes étant
          gaussienne, on peut sauter directement à l'étape <Tex>t</Tex> (leur équation 4) :
        </p>
        <Tex block>{"x_t = \\sqrt{\\bar\\alpha_t}\\, x_0 + \\sqrt{1 - \\bar\\alpha_t}\\, \\epsilon \\qquad \\bar\\alpha_t = \\prod_{s=1}^t (1 - \\beta_s)"}</Tex>
        <p>
          Avec ces coefficients, la variance reste constante : si <Tex>{"x_0"}</Tex> a une variance 1,{" "}
          <Tex>{"x_t"}</Tex> aussi, puisque <Tex>{"\\bar\\alpha_t + (1 - \\bar\\alpha_t) = 1"}</Tex>. L'article prend{" "}
          <Tex>{"T = 1000"}</Tex> et des <Tex>{"\\beta_t"}</Tex> croissant linéairement de <Tex>{"10^{-4}"}</Tex> à
          0,02 (section 4). À la fin, <Tex>{"\\bar\\alpha_T \\approx 4 \\times 10^{-5}"}</Tex> : il ne reste presque
          rien de l'image, et <Tex>{"x_T"}</Tex> est pratiquement une gaussienne standard, d'où part la génération.
          La simulation compare 500 petits pas à la formule directe.
        </p>
        <pre>
          <code>{`import numpy as np

rng = np.random.default_rng(0)
beta = np.linspace(1e-4, 0.02, 1000)  # le calendrier de DDPM
abar = np.cumprod(1 - beta)
print([f"{v:.2g}" for v in abar[[0, 99, 499, 999]]])
x0 = rng.uniform(-1, 1, size=400_000)  # « données », variance 1/3
x = x0.copy()
for t in range(500):  # 500 petits pas de bruit, éq. (2)
    bruit = rng.standard_normal(x.size)
    x = np.sqrt(1 - beta[t]) * x + np.sqrt(beta[t]) * bruit
a = abar[499]
e = rng.standard_normal(x0.size)
x_direct = np.sqrt(a) * x0 + np.sqrt(1 - a) * e  # éq. (4), un seul pas
print(x.std().round(3), x_direct.std().round(3),
      np.sqrt(a / 3 + 1 - a).round(3))
# ['1', '0.9', '0.079', '4e-05']
# 0.972 0.973 0.973`}</code>
        </pre>
        <p>
          Les deux méthodes donnent le même écart type, égal à la valeur théorique{" "}
          <Tex>{"\\sqrt{\\bar\\alpha_t / 3 + 1 - \\bar\\alpha_t}"}</Tex>. Les données uniformes ont ici une variance
          1/3 et non 1, donc la variance de <Tex>{"x_t"}</Tex> remonte vers 1 à mesure que le bruit prend le dessus.
        </p>
      </section>
    </LessonFlow>
  );
}
