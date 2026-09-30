import { LessonFlow } from "../../components/LessonFlow";
import { Tex } from "../../components/Tex";
import { SvdViz } from "./SvdViz";

export function SvdLesson() {
  return (
    <LessonFlow>
      <section className="section">
        <span className="section-num">1</span>
        <h2>Toute matrice envoie un cercle sur une ellipse</h2>
        <p>
          Les valeurs propres ne marchent bien que pour les matrices carrées, et parfaitement seulement pour les
          symétriques. La <strong>décomposition en valeurs singulières</strong> (SVD) marche pour toutes les
          matrices, même rectangulaires. Son idée est géométrique. Déplace les deux colonnes de <Tex>A</Tex> :
        </p>
        <SvdViz />
        <p>
          Le cercle unité devient toujours une ellipse (éventuellement aplatie en segment). Ses deux axes sont
          perpendiculaires, de longueurs <Tex>{"\\sigma_1 \\ge \\sigma_2 \\ge 0"}</Tex> : les{" "}
          <strong>valeurs singulières</strong>. Et les deux vecteurs du cercle qui arrivent sur ces axes,{" "}
          <Tex>{"v_1"}</Tex> et <Tex>{"v_2"}</Tex>, sont eux aussi perpendiculaires. Avec <Tex>{"u_1, u_2"}</Tex>{" "}
          les directions unitaires des axes :
        </p>
        <Tex block>{"A v_i = \\sigma_i u_i"}</Tex>
        <p>
          Les <Tex>{"v_i"}</Tex> forment une base orthonormée au départ, les <Tex>{"u_i"}</Tex> une base orthonormée
          à l'arrivée. Rangées en colonnes dans deux matrices orthogonales <Tex>V</Tex> et <Tex>U</Tex>, ces
          égalités s'écrivent <Tex>{"AV = U\\Sigma"}</Tex>, soit (théorème 4.22 de MML)
        </p>
        <Tex block>{"A = U \\Sigma V^\\top"}</Tex>
        <p>
          où <Tex>{"\\Sigma"}</Tex> a la taille de <Tex>A</Tex> (<Tex>{"m \\times n"}</Tex>), avec les{" "}
          <Tex>{"\\sigma_i"}</Tex> sur la diagonale et des zéros ailleurs. Lu de droite à gauche : une transformation
          orthogonale <Tex>{"V^\\top"}</Tex> (rotation ou symétrie), un étirement de chaque axe par{" "}
          <Tex>{"\\sigma_i"}</Tex>, une autre transformation orthogonale <Tex>U</Tex>. <strong>Toute</strong> application linéaire est ça, même un cisaillement.
          Comparé à <Tex>{"PDP^{-1}"}</Tex> du chapitre 7, deux différences : les bases sont orthonormées, et ce
          ne sont pas les mêmes au départ et à l'arrivée.
        </p>
      </section>

      <section className="section">
        <span className="section-num">2</span>
        <h2>Calculer la SVD</h2>
        <p>
          Le chapitre précédent fournit la clé. <Tex>{"A^\\top A"}</Tex> est symétrique et semi-définie positive,
          donc elle a une base orthonormée de vecteurs propres et des valeurs propres <Tex>{"\\ge 0"}</Tex>. Or, si{" "}
          <Tex>{"A = U\\Sigma V^\\top"}</Tex>, alors, puisque <Tex>{"U^\\top U = I"}</Tex> :
        </p>
        <Tex block>{"A^\\top A = V \\Sigma^\\top U^\\top U \\Sigma V^\\top = V\\, \\Sigma^\\top \\Sigma\\, V^\\top"}</Tex>
        <p>
          C'est une diagonalisation de <Tex>{"A^\\top A"}</Tex> (MML, équations 4.71 à 4.75) : les{" "}
          <Tex>{"v_i"}</Tex> sont ses vecteurs propres, et ses valeurs propres sont les{" "}
          <Tex>{"\\sigma_i^2"}</Tex>. D'où la recette : diagonaliser <Tex>{"A^\\top A"}</Tex>, prendre{" "}
          <Tex>{"\\sigma_i = \\sqrt{\\lambda_i}"}</Tex>, puis <Tex>{"u_i = A v_i / \\sigma_i"}</Tex> quand{" "}
          <Tex>{"\\sigma_i > 0"}</Tex>.
        </p>
        <p>
          Exemple : <Tex>{"A = \\begin{pmatrix} 3 & 0 \\\\ 4 & 5 \\end{pmatrix}"}</Tex>. Alors{" "}
          <Tex>{"A^\\top A = \\begin{pmatrix} 25 & 20 \\\\ 20 & 25 \\end{pmatrix}"}</Tex>, de trace 50 et de
          déterminant 225, donc de valeurs propres 45 et 5 (vecteurs propres <Tex>{"(1, 1)"}</Tex> et{" "}
          <Tex>{"(1, -1)"}</Tex>). Les valeurs singulières sont <Tex>{"\\sigma_1 = \\sqrt{45} = 3\\sqrt 5"}</Tex>{" "}
          et <Tex>{"\\sigma_2 = \\sqrt 5"}</Tex>. Ce ne sont pas les valeurs propres de <Tex>A</Tex> (qui sont 3
          et 5).
        </p>
        <p>Ce que les valeurs singulières disent de <Tex>A</Tex> :</p>
        <ul>
          <li>
            <Tex>{"\\sigma_1"}</Tex> est le plus grand étirement possible,{" "}
            <Tex>{"\\max_{x \\neq 0} \\|Ax\\| / \\|x\\|"}</Tex> : c'est la <strong>norme spectrale</strong>{" "}
            <Tex>{"\\|A\\|_2"}</Tex> (théorème 4.24 de MML) ;
          </li>
          <li>
            pour <Tex>A</Tex> carrée, <Tex>{"|\\det A| = \\sigma_1 \\sigma_2 \\cdots \\sigma_n"}</Tex>, puisque{" "}
            <Tex>U</Tex> et <Tex>V</Tex> ont un déterminant <Tex>{"\\pm 1"}</Tex> (ici :{" "}
            <Tex>{"3\\sqrt 5 \\times \\sqrt 5 = 15"}</Tex>) ;
          </li>
          <li>
            le rang de <Tex>A</Tex> est le nombre de <Tex>{"\\sigma_i"}</Tex> non nulles. C'est ainsi que{" "}
            <code>np.linalg.matrix_rank</code> le calcule (chapitre 4) : dans le code de numpy, elle compte les
            valeurs singulières au-dessus du seuil <Tex>{"\\sigma_1 \\times \\max(m, n) \\times \\varepsilon"}</Tex>,
            où <Tex>{"\\varepsilon \\approx 2{,}2 \\times 10^{-16}"}</Tex> est la précision des flottants.
          </li>
        </ul>
      </section>

      <section className="section">
        <span className="section-num">3</span>
        <h2>Le conditionnement</h2>
        <p>
          Au chapitre 5, une question est restée ouverte : le déterminant ne mesure pas la « presque singularité ».{" "}
          <Tex>{"0{,}1\\, I_{50}"}</Tex> a un déterminant de <Tex>{"10^{-50}"}</Tex>, et s'inverse sans aucune
          difficulté. La bonne mesure est le rapport entre le plus grand et le plus petit étirement, le{" "}
          <strong>conditionnement</strong> :
        </p>
        <Tex block>{"\\kappa(A) = \\frac{\\sigma_{\\max}}{\\sigma_{\\min}}"}</Tex>
        <p>
          Pour <Tex>{"0{,}1\\, I_{50}"}</Tex>, toutes les valeurs singulières valent 0,1 : <Tex>{"\\kappa = 1"}</Tex>,
          le meilleur cas possible. À l'inverse,{" "}
          <Tex>{"\\begin{pmatrix} 1 & 1 \\\\ 1 & 1{,}0001 \\end{pmatrix}"}</Tex> a <Tex>{"\\kappa \\approx 40\\,000"}</Tex> :
          ses colonnes sont presque parallèles. Goodfellow et al. (<em>Deep Learning</em>, section 4.2) le
          formulent ainsi : quand <Tex>{"\\kappa"}</Tex> est grand, l'inversion est très sensible aux erreurs sur
          les données, et c'est une propriété de la matrice elle-même, pas des arrondis du calcul. Une règle
          pratique (Cheney et Kincaid, <em>Numerical Mathematics and Computing</em>) : si{" "}
          <Tex>{"\\kappa = 10^k"}</Tex>, on peut perdre jusqu'à <Tex>k</Tex> chiffres exacts.
        </p>
        <p>
          <strong>Pourquoi l'équation normale se trompait.</strong> Au chapitre 6, résoudre{" "}
          <Tex>{"X^\\top X w = X^\\top y"}</Tex> donnait une erreur de 0,11, et <code>lstsq</code> une erreur de{" "}
          <Tex>{"5 \\times 10^{-9}"}</Tex>. Avec <Tex>{"X = U\\Sigma V^\\top"}</Tex>, on a{" "}
          <Tex>{"X^\\top X = V \\Sigma^\\top \\Sigma V^\\top"}</Tex> : ses valeurs singulières sont les{" "}
          <Tex>{"\\sigma_i^2"}</Tex>. Donc
        </p>
        <Tex block>{"\\kappa(X^\\top X) = \\kappa(X)^2"}</Tex>
        <pre>
          <code>{`import numpy as np

t = np.linspace(0, 1, 50)
X = np.vander(t, 12, increasing=True)  # même X qu'au chapitre 6
print(np.linalg.cond(X))        # 117177656.13946822    (~ 1e8)
print(np.linalg.cond(X.T @ X))  # 1.3668027823108864e+16 (~ 1e16)
print(np.finfo(float).eps)      # 2.220446049250313e-16`}</code>
        </pre>
        <p>
          Avec <Tex>{"\\kappa(X) \\approx 10^8"}</Tex>, on peut perdre 8 des 16 chiffres des flottants : il en reste
          assez, d'où les <Tex>{"10^{-9}"}</Tex> de <code>lstsq</code>, qui travaille sur <Tex>X</Tex>. Former{" "}
          <Tex>{"X^\\top X"}</Tex> met le conditionnement au carré, <Tex>{"10^{16}"}</Tex>, et tous les chiffres
          peuvent être perdus. La SVD voit ce que l'équation normale cache.
        </p>
        <p>
          <strong>Les 50 couches.</strong> Au chapitre 6 aussi, on avait multiplié 50 matrices de poids
          gaussiennes. Voici les étirements promis, les valeurs singulières du produit :
        </p>
        <pre>
          <code>{`import numpy as np

rng = np.random.default_rng(0)
n, depth = 100, 50
Pg, Po = np.eye(n), np.eye(n)
for _ in range(depth):
    W = rng.normal(size=(n, n)) / np.sqrt(n)  # gaussienne
    Q, _ = np.linalg.qr(rng.normal(size=(n, n)))  # orthogonale
    Pg = W @ Pg
    Po = Q @ Po

s = np.linalg.svd(Pg, compute_uv=False)  # triées, décroissantes
print(s[0], s[-1])  # 4.144655299240025 1.5033638340346665e-18
print(np.linalg.matrix_rank(Pg))  # 68 (au lieu de 100)
so = np.linalg.svd(Po, compute_uv=False)
print(so[0], so[-1])  # 1.0000000000000009 0.9999999999999987`}</code>
        </pre>
        <p>
          Chacune des 50 matrices est inversible, mais leur produit a un conditionnement de{" "}
          <Tex>{"3 \\times 10^{18}"}</Tex>, et numpy le déclare de rang 68 : 32 directions sont écrasées sous la
          précision des flottants. Un signal (ou un gradient) qui passe par ces directions est perdu. Le produit
          des matrices orthogonales a toutes ses valeurs singulières égales à 1 : <Tex>{"\\kappa = 1"}</Tex>.
        </p>
      </section>

      <section className="section">
        <span className="section-num">4</span>
        <h2>Approximation de rang faible</h2>
        <p>
          En développant <Tex>{"U\\Sigma V^\\top"}</Tex> colonne par colonne (comme au chapitre 8), <Tex>A</Tex>{" "}
          est une somme de matrices de rang 1, rangées par importance :
        </p>
        <Tex block>{"A = \\sigma_1 u_1 v_1^\\top + \\sigma_2 u_2 v_2^\\top + \\dots + \\sigma_r u_r v_r^\\top"}</Tex>
        <p>
          Garder les <Tex>k</Tex> premiers termes donne une matrice <Tex>{"A_k"}</Tex> de rang <Tex>k</Tex>. Le{" "}
          <strong>théorème d'Eckart-Young</strong> (1936, théorème 4.25 de MML) dit que c'est la meilleure possible :
          parmi toutes les matrices de rang <Tex>k</Tex>, <Tex>{"A_k"}</Tex> est la plus proche de <Tex>A</Tex>{" "}
          en norme spectrale, et l'erreur vaut exactement la première valeur singulière oubliée :
        </p>
        <Tex block>{"\\|A - A_k\\|_2 = \\sigma_{k+1}"}</Tex>
        <p>
          Quand les valeurs singulières chutent brutalement, une matrice énorme se résume à quelques termes. Ici,
          une matrice <Tex>{"200 \\times 100"}</Tex> de rang 5, plus un petit bruit :
        </p>
        <pre>
          <code>{`import numpy as np

rng = np.random.default_rng(0)
M = rng.normal(size=(200, 5)) @ rng.normal(size=(5, 100))  # rang 5
M = M + 0.01 * rng.normal(size=(200, 100))  # plus un bruit
U, S, Vt = np.linalg.svd(M, full_matrices=False)
print(np.round(S[:8], 2))
# [179.83 147.46 133.54 121.73 109.74   0.23   0.23   0.22]

k = 5
Mk = U[:, :k] @ np.diag(S[:k]) @ Vt[:k]
err = np.linalg.norm(M - Mk, 2)  # norme spectrale
print(err, S[k])  # 0.23035557100772272 0.23035557100772178
print(np.linalg.norm(M - Mk) / np.linalg.norm(M))  # erreur relative
# 0.0043181785781000745
print(M.size, k * (200 + 100 + 1))  # 20000 1505 nombres à stocker`}</code>
        </pre>
        <p>
          Cinq valeurs singulières dominent, puis c'est le niveau du bruit. Cinq termes reproduisent{" "}
          <Tex>M</Tex> à 0,4 % près avec 13 fois moins de nombres.
        </p>
        <p>
          <strong>LoRA.</strong> Au chapitre 4, on a vu LoRA (Hu et al., 2021) : on affine un grand modèle en
          n'apprenant qu'une mise à jour de rang faible <Tex>{"\\Delta W = BA"}</Tex>. Pour comprendre pourquoi un
          très petit rang suffit, les auteurs utilisent la SVD (section 7.2 de l'article). Ils comparent les
          directions singulières de la matrice <Tex>A</Tex> apprise avec <Tex>{"r = 8"}</Tex> et avec{" "}
          <Tex>{"r = 64"}</Tex>. Seule la première direction singulière est nettement commune aux deux, les autres
          semblant surtout contenir du bruit accumulé pendant l'entraînement. C'est leur explication de ce que{" "}
          <Tex>{"r = 1"}</Tex> marche déjà bien pour GPT-3 sur leurs tâches. En section 7.3, ils trouvent aussi que{" "}
          <Tex>{"\\Delta W"}</Tex> amplifie des directions qui existent déjà dans <Tex>W</Tex>, mais que{" "}
          <Tex>W</Tex> ne met pas en avant.
        </p>
      </section>

      <section className="section">
        <span className="section-num">5</span>
        <h2>PCA : les directions de plus grande variance</h2>
        <p>
          Un nuage de <Tex>N</Tex> points en dimension <Tex>D</Tex>, rangés en lignes dans <Tex>X</Tex> et centrés
          (on a retiré la moyenne). Quelle direction unitaire <Tex>w</Tex> capture le plus de variance ? La
          variance des projections <Tex>{"x_n^\\top w"}</Tex> est
        </p>
        <Tex block>{"\\frac{1}{N} \\sum_n (x_n^\\top w)^2 = w^\\top S\\, w, \\qquad S = \\frac{1}{N} X^\\top X"}</Tex>
        <p>
          C'est la forme quadratique de la matrice de covariance <Tex>S</Tex>, maximisée sur les vecteurs unitaires.
          Le chapitre 8 donne la réponse : le maximum est la plus grande valeur propre de <Tex>S</Tex>, atteint sur
          son vecteur propre. Les <strong>composantes principales</strong> sont les vecteurs propres de{" "}
          <Tex>S</Tex>, rangés par valeur propre décroissante (MML, chapitre 10). Et comme{" "}
          <Tex>{"X^\\top X = V\\Sigma^\\top\\Sigma V^\\top"}</Tex>, ce sont les vecteurs singuliers à droite de{" "}
          <Tex>X</Tex>, avec des variances <Tex>{"\\lambda_i = \\sigma_i^2 / N"}</Tex> (MML, équation 10.49, qui
          range les données en colonnes : les rôles de <Tex>U</Tex> et <Tex>V</Tex> y sont échangés). En pratique, on
          calcule la PCA par la SVD de <Tex>X</Tex>, sans former <Tex>{"X^\\top X"}</Tex>, pour la raison de la
          section 3.
        </p>
        <pre>
          <code>{`import numpy as np

rng = np.random.default_rng(0)
N = 500
Z = rng.normal(size=(N, 2))  # 2 causes cachées
W = rng.normal(size=(2, 10))
X = Z @ W + 0.1 * rng.normal(size=(N, 10))  # 10 mesures bruitées

Xc = X - X.mean(axis=0)  # centrer
U, s, Vt = np.linalg.svd(Xc, full_matrices=False)
var = s**2 / N  # variances le long des composantes principales
ratio = var / var.sum()
print(np.round(ratio[:4], 4))  # [0.52   0.4721 0.0012 0.0012]
print(ratio[:2].sum())  # 0.9920869810233748

S = Xc.T @ Xc / N
print(np.allclose(np.linalg.eigvalsh(S)[::-1], var))  # True

Y = Xc @ Vt[:2].T  # coordonnées sur les 2 premières composantes
print(Y.shape)  # (500, 2)`}</code>
        </pre>
        <p>
          Dix mesures, mais deux composantes portent 99 % de la variance : les données vivent presque dans un plan,
          et la PCA le retrouve. On peut les résumer par deux nombres par point, les visualiser, ou débruiter en
          jetant le reste. C'est Eckart-Young appliqué aux données : <Tex>{"Y V_k^\\top"}</Tex> est la meilleure
          approximation de rang <Tex>k</Tex> de <Tex>{"X_c"}</Tex>.
        </p>
      </section>
    </LessonFlow>
  );
}
