import { LessonFlow } from "../../components/LessonFlow";
import { Tex } from "../../components/Tex";
import { RegressionViz } from "./RegressionViz";

export function OrthogonaliteLesson() {
  return (
    <LessonFlow>
      <section className="section">
        <span className="section-num">1</span>
        <h2>Les bases orthonormées</h2>
        <p>
          Deux vecteurs sont <strong>orthogonaux</strong> quand leur produit scalaire est nul. Une base{" "}
          <Tex>{"(q_1, \\dots, q_n)"}</Tex> est <strong>orthonormée</strong> si ses vecteurs sont deux à deux
          orthogonaux et de norme 1 : <Tex>{"q_i \\cdot q_j = 0"}</Tex> pour <Tex>{"i \\neq j"}</Tex>, et{" "}
          <Tex>{"q_i \\cdot q_i = 1"}</Tex>.
        </p>
        <p>
          Leur intérêt : les coordonnées s'obtiennent sans résoudre de système. Si{" "}
          <Tex>{"x = \\lambda_1 q_1 + \\dots + \\lambda_n q_n"}</Tex>, on fait le produit scalaire avec{" "}
          <Tex>{"q_i"}</Tex> : tous les termes s'annulent sauf un, et
        </p>
        <Tex block>{"\\lambda_i = q_i \\cdot x"}</Tex>
        <p>
          Par exemple, <Tex>{"q_1 = \\tfrac{1}{5}(3, 4)"}</Tex> et <Tex>{"q_2 = \\tfrac{1}{5}(-4, 3)"}</Tex> forment
          une base orthonormée du plan (vérifie : <Tex>{"-12 + 12 = 0"}</Tex> et <Tex>{"9 + 16 = 25"}</Tex>). Pour{" "}
          <Tex>{"x = (5, 10)"}</Tex> : <Tex>{"\\lambda_1 = \\tfrac{15 + 40}{5} = 11"}</Tex> et{" "}
          <Tex>{"\\lambda_2 = \\tfrac{-20 + 30}{5} = 2"}</Tex>.
        </p>
        <p>
          Rangés en colonnes, ces vecteurs forment une <strong>matrice orthogonale</strong> <Tex>Q</Tex>. Le
          coefficient <Tex>{"(i, j)"}</Tex> de <Tex>{"Q^\\top Q"}</Tex> est <Tex>{"q_i \\cdot q_j"}</Tex>, donc
        </p>
        <Tex block>{"Q^\\top Q = I \\qquad \\text{c'est-à-dire} \\qquad Q^{-1} = Q^\\top"}</Tex>
        <p>
          Inverser une matrice orthogonale, c'est la transposer. Et elle conserve les longueurs :{" "}
          <Tex>{"\\|Qx\\|^2 = (Qx)^\\top (Qx) = x^\\top Q^\\top Q x = \\|x\\|^2"}</Tex>, de même que les produits
          scalaires, donc les angles. Ce sont les rotations et les symétries. Leur déterminant vaut{" "}
          <Tex>{"\\pm 1"}</Tex>, puisque <Tex>{"\\det(Q)^2 = \\det(Q^\\top Q) = 1"}</Tex>.
        </p>
      </section>

      <section className="section">
        <span className="section-num">2</span>
        <h2>Projeter sur un sous-espace</h2>
        <p>
          Au chapitre 1, on a projeté un vecteur sur une droite. Généralisons : on cherche le point{" "}
          <Tex>p</Tex> d'un sous-espace le plus proche de <Tex>x</Tex>. Le sous-espace est l'image d'une matrice{" "}
          <Tex>B</Tex> dont les colonnes, indépendantes, en forment une base. Donc <Tex>{"p = B\\lambda"}</Tex>.
        </p>
        <p>
          La condition qui caractérise <Tex>p</Tex> : l'erreur <Tex>{"x - p"}</Tex> est orthogonale au sous-espace,
          c'est-à-dire à chaque colonne de <Tex>B</Tex>. Ces conditions s'écrivent{" "}
          <Tex>{"B^\\top (x - B\\lambda) = 0"}</Tex>, soit
        </p>
        <Tex block>{"B^\\top B\\, \\lambda = B^\\top x"}</Tex>
        <p>
          C'est l'<strong>équation normale</strong>. <Tex>{"B^\\top B"}</Tex> est carrée, et inversible parce que les
          colonnes de <Tex>B</Tex> sont indépendantes. Exemple, tiré de Deisenroth, Faisal et Ong,{" "}
          <em>Mathematics for Machine Learning</em> (§3.8.2) :
        </p>
        <Tex block>{"B = \\begin{pmatrix} 1 & 0 \\\\ 1 & 1 \\\\ 1 & 2 \\end{pmatrix}, \\quad x = \\begin{pmatrix} 6 \\\\ 0 \\\\ 0 \\end{pmatrix}, \\quad B^\\top B = \\begin{pmatrix} 3 & 3 \\\\ 3 & 5 \\end{pmatrix}, \\quad B^\\top x = \\begin{pmatrix} 6 \\\\ 0 \\end{pmatrix}"}</Tex>
        <p>
          On trouve <Tex>{"\\lambda = (5, -3)"}</Tex>, donc <Tex>{"p = 5\\,(1, 1, 1) - 3\\,(0, 1, 2) = (5, 2, -1)"}</Tex>.
          L'erreur <Tex>{"x - p = (1, -2, 1)"}</Tex> est bien orthogonale aux deux colonnes :{" "}
          <Tex>{"1 - 2 + 1 = 0"}</Tex> et <Tex>{"0 - 2 + 2 = 0"}</Tex>.
        </p>
        <pre>
          <code>{`import numpy as np

B = np.array([[1.0, 0.0], [1.0, 1.0], [1.0, 2.0]])
x = np.array([6.0, 0.0, 0.0])
lam = np.linalg.solve(B.T @ B, B.T @ x)
p = B @ lam
print(lam, p)          # [ 5. -3.] [ 5.  2. -1.]
print(B.T @ (x - p))   # [0. 0.] : erreur orthogonale aux colonnes

P = B @ np.linalg.inv(B.T @ B) @ B.T  # matrice de projection
print(np.allclose(P @ P, P))  # True : projeter deux fois = une fois`}</code>
        </pre>
        <p>
          Pourquoi c'est le point le plus proche : pour tout autre point <Tex>{"B\\mu"}</Tex> du sous-espace, le
          vecteur <Tex>{"p - B\\mu"}</Tex> est dans le sous-espace, donc orthogonal à <Tex>{"x - p"}</Tex>, et
          Pythagore donne
        </p>
        <Tex block>{"\\|x - B\\mu\\|^2 = \\|x - p\\|^2 + \\|p - B\\mu\\|^2 \\geq \\|x - p\\|^2"}</Tex>
      </section>

      <section className="section">
        <span className="section-num">3</span>
        <h2>Les moindres carrés</h2>
        <p>
          Faire passer une droite <Tex>{"y = a + bt"}</Tex> par des points <Tex>{"(t_i, y_i)"}</Tex>, c'est vouloir
          résoudre <Tex>{"a + b\\,t_i = y_i"}</Tex> pour tout <Tex>i</Tex> : un système avec plus d'équations que
          d'inconnues, qui n'a en général pas de solution. Avec trois points :
        </p>
        <Tex block>{"A \\begin{pmatrix} a \\\\ b \\end{pmatrix} = y, \\qquad A = \\begin{pmatrix} 1 & t_1 \\\\ 1 & t_2 \\\\ 1 & t_3 \\end{pmatrix}"}</Tex>
        <p>
          Le vecteur <Tex>y</Tex> n'est pas dans l'image de <Tex>A</Tex>. On se contente alors du{" "}
          <Tex>{"\\hat y = A\\hat w"}</Tex> le plus proche, celui qui minimise la somme des carrés des résidus{" "}
          <Tex>{"\\|y - Aw\\|^2 = \\sum_i (y_i - a - b\\,t_i)^2"}</Tex>. D'après la section 2, c'est la projection
          de <Tex>y</Tex> sur l'image de <Tex>A</Tex>, et <Tex>{"\\hat w"}</Tex> vérifie l'équation normale :
        </p>
        <Tex block>{"A^\\top A\\, \\hat w = A^\\top y"}</Tex>
        <p>
          L'exemple de la section 2 était déjà une régression : les points <Tex>{"(0, 6)"}</Tex>,{" "}
          <Tex>{"(1, 0)"}</Tex>, <Tex>{"(2, 0)"}</Tex> ont pour droite des moindres carrés{" "}
          <Tex>{"y = 5 - 3t"}</Tex>. Au chapitre Gradient, tu avais obtenu les mêmes équations en annulant le
          gradient de l'erreur. Ici, on voit ce qu'elles disent : le vecteur des résidus est orthogonal à chaque
          colonne de <Tex>A</Tex>. Orthogonal à la colonne de 1, cela donne <Tex>{"\\sum r_i = 0"}</Tex> ;
          orthogonal à la colonne des <Tex>{"t_i"}</Tex>, cela donne <Tex>{"\\sum t_i r_i = 0"}</Tex>. Déplace les
          points :
        </p>
        <RegressionViz />
        <p>
          Attention à ne pas confondre les deux images. Dans le plan des données, la droite est tracée et les
          résidus sont verticaux. La projection, elle, a lieu dans <Tex>{"\\mathbb{R}^n"}</Tex> (une dimension par
          point) : <Tex>y</Tex> est un seul vecteur, projeté sur le sous-espace de dimension 2 engendré par les
          colonnes de <Tex>A</Tex>.
        </p>
      </section>

      <section className="section">
        <span className="section-num">4</span>
        <h2>Gram-Schmidt et la factorisation QR</h2>
        <p>
          Avec une base orthonormée, tout devient simple : on veut donc en fabriquer une à partir de n'importe
          quelle base. Le procédé de <strong>Gram-Schmidt</strong> prend les vecteurs un par un et retire à chacun
          ses projections sur les précédents :
        </p>
        <Tex block>{"u_1 = b_1, \\qquad u_k = b_k - \\sum_{j < k} \\frac{u_j \\cdot b_k}{u_j \\cdot u_j}\\, u_j"}</Tex>
        <p>
          puis on divise chaque <Tex>{"u_k"}</Tex> par sa norme. Chaque <Tex>{"u_k"}</Tex> est orthogonal aux
          précédents, et les <Tex>{"u_k"}</Tex> engendrent le même espace que les <Tex>{"b_k"}</Tex>. Exemple
          (MML, exemple 3.12) : <Tex>{"b_1 = (2, 0)"}</Tex>, <Tex>{"b_2 = (1, 1)"}</Tex> donnent{" "}
          <Tex>{"u_1 = (2, 0)"}</Tex> et <Tex>{"u_2 = (1, 1) - \\tfrac{2}{4}(2, 0) = (0, 1)"}</Tex>.
        </p>
        <p>
          Comme chaque <Tex>{"b_k"}</Tex> ne s'écrit qu'avec <Tex>{"q_1, \\dots, q_k"}</Tex>, le procédé factorise
          la matrice : <Tex>{"A = QR"}</Tex>, avec <Tex>Q</Tex> à colonnes orthonormées et <Tex>R</Tex>{" "}
          triangulaire supérieure (<Tex>{"R = Q^\\top A"}</Tex>, ses coefficients sont les{" "}
          <Tex>{"q_i \\cdot b_k"}</Tex>).
        </p>
        <pre>
          <code>{`import numpy as np

def gram_schmidt(A):
    Q = np.zeros(A.shape)
    for k in range(A.shape[1]):
        u = A[:, k].copy()
        for j in range(k):
            # retire la projection sur q_j
            u -= (Q[:, j] @ A[:, k]) * Q[:, j]
        Q[:, k] = u / np.linalg.norm(u)
    return Q

A = np.array([[1.0, 1.0, 0.0], [1.0, 0.0, 1.0], [0.0, 1.0, 1.0]])
Q = gram_schmidt(A)
print(np.allclose(Q.T @ Q, np.eye(3)))  # True
R = Q.T @ A
print(np.round(R, 3) + 0.0)  # triangulaire supérieure
print(np.allclose(Q @ R, A))  # True`}</code>
        </pre>
        <pre>
          <code>{`True
[[1.414 0.707 0.707]
 [0.    1.225 0.408]
 [0.    0.    1.155]]
True`}</code>
        </pre>
        <p>
          Pour les moindres carrés, <Tex>{"A^\\top A = R^\\top Q^\\top Q R = R^\\top R"}</Tex>, et l'équation normale
          se simplifie en <Tex>{"R\\,\\hat w = Q^\\top y"}</Tex> : un système triangulaire, résolu par remontée.
        </p>
      </section>

      <section className="section">
        <span className="section-num">5</span>
        <h2>En machine learning</h2>
        <p>
          <strong>La régression linéaire est une projection.</strong> Avec une matrice de features <Tex>X</Tex>{" "}
          (une ligne par exemple), les prédictions <Tex>{"\\hat y = X\\hat w"}</Tex> sont la projection des
          cibles sur l'image de <Tex>X</Tex> (MML, §9.4). Si <Tex>X</Tex> contient une colonne de 1 (le biais), les
          résidus sont de moyenne nulle, et ils sont orthogonaux à chaque feature.
        </p>
        <p>
          <strong>On ne forme pas <Tex>{"X^\\top X"}</Tex>.</strong> L'équation normale est parfaite sur le papier,
          mais calculer <Tex>{"X^\\top X"}</Tex> amplifie les erreurs d'arrondi. Ajustons un polynôme de degré 11
          dont les vrais coefficients valent tous 1 :
        </p>
        <pre>
          <code>{`import numpy as np

t = np.linspace(0, 1, 50)
X = np.vander(t, 12, increasing=True)  # colonnes 1, t, ..., t^11
w_true = np.ones(12)
y = X @ w_true

w_normal = np.linalg.solve(X.T @ X, X.T @ y)
w_lstsq = np.linalg.lstsq(X, y, rcond=None)[0]
print(np.abs(w_normal - w_true).max())  # 0.11318316047252841
print(np.abs(w_lstsq - w_true).max())   # 4.975114320515672e-09`}</code>
        </pre>
        <p>
          Les données sont exactes, et pourtant l'équation normale se trompe dès la première décimale.{" "}
          <code>lstsq</code> travaille directement sur <Tex>X</Tex> : dans le code de numpy, elle appelle la
          routine LAPACK <code>gelsd</code>, qui passe par la SVD (dernier chapitre du module). La raison de l'écart
          viendra avec elle.
        </p>
        <p>
          <strong>Initialisation orthogonale.</strong> Un réseau profond enchaîne des multiplications par des
          matrices de poids. Si elles sont orthogonales, les normes sont conservées à chaque couche, dans le sens
          aller comme dans le sens retour du gradient. Saxe, McClelland et Ganguli (2013,{" "}
          <em>Exact solutions to the nonlinear dynamics of learning in deep linear neural networks</em>) ont montré
          l'intérêt d'initialisations orthogonales aléatoires, et <code>torch.nn.init.orthogonal_</code> cite cet
          article. Comparons le produit de 50 couches linéaires :
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

x = rng.normal(size=n)
print(np.linalg.norm(x))       # 11.087301469349487
print(np.linalg.norm(Pg @ x))  # 6.073307862825144
print(np.linalg.norm(Po @ x))  # 11.08730146934949`}</code>
        </pre>
        <p>
          Avec les poids gaussiens, la norme de ce vecteur n'a changé que d'un facteur 2, mais le produit écrase
          certaines directions presque à zéro et en étire d'autres : ses facteurs d'étirement s'étalent de 4,1 à{" "}
          <Tex>{"1{,}5 \\times 10^{-18}"}</Tex> (on verra comment les mesurer au chapitre SVD). Avec les poids
          orthogonaux, toutes les directions gardent leur longueur.
        </p>
      </section>
    </LessonFlow>
  );
}
