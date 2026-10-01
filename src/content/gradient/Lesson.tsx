import { LessonFlow } from "../../components/LessonFlow";
import { Tex } from "../../components/Tex";
import { ContourViz } from "./ContourViz";
import { DescentViz } from "./DescentViz";

export function GradientLesson() {
  return (
    <LessonFlow>
      <section className="section">
        <span className="section-num">1</span>
        <h2>Une fonction de deux variables est une carte</h2>
        <p>
          Jusqu'ici, tes fonctions prenaient un nombre et rendaient un nombre. Une fonction de deux variables prend un
          point <Tex>{"(x, y)"}</Tex> du plan et rend un nombre, qu'on peut voir comme une altitude. Tout ce chapitre
          tourne autour d'un seul exemple, un bol allongé :
        </p>
        <Tex block>{"f(x, y) = x^2 + 5y^2"}</Tex>
        <p>
          Dessiner la surface <Tex>{"z = f(x, y)"}</Tex> demande de la 3D. Les randonneurs ont une meilleure idée : la
          carte topographique. On trace les <strong>lignes de niveau</strong>, les points où l'altitude vaut une
          constante <Tex>c</Tex> :
        </p>
        <Tex block>{"x^2 + 5y^2 = c \\quad\\Longleftrightarrow\\quad \\frac{x^2}{c} + \\frac{y^2}{c/5} = 1"}</Tex>
        <p>
          Pour <Tex>{"c > 0"}</Tex>, c'est une ellipse de demi-axes <Tex>{"\\sqrt{c}"}</Tex> sur l'axe des{" "}
          <Tex>x</Tex> et <Tex>{"\\sqrt{c/5}"}</Tex> sur l'axe des <Tex>y</Tex>. Déplace le point : la ligne bleue est
          celle qui passe par lui.
        </p>
        <ContourViz />
        <p>
          Les lignes grises sont les niveaux 1, 4, 9 et 16. Sur l'axe des <Tex>x</Tex>, elles sont espacées de 1. Sur
          l'axe des <Tex>y</Tex>, d'environ 0,45 seulement. Comme sur une vraie carte, des lignes serrées veulent dire
          une pente raide : le bol est bien plus raide dans la direction <Tex>y</Tex>. Retiens ce détail, il fera
          zigzaguer la descente de gradient.
        </p>
      </section>

      <section className="section">
        <span className="section-num">2</span>
        <h2>Dériver en gelant l'autre variable</h2>
        <p>
          Tu sais dériver une fonction d'une variable. Pour en dériver une de deux variables, on se ramène à ce cas :
          on <strong>gèle</strong> l'une des deux. Prends
        </p>
        <Tex block>{"f(x, y) = x^2 y + 3y"}</Tex>
        <p>
          et gèle <Tex>{"y = 1"}</Tex>. Il reste <Tex>{"g(x) = f(x, 1) = x^2 + 3"}</Tex>, une fonction ordinaire, et{" "}
          <Tex>{"g'(2) = 4"}</Tex>. C'est la pente de la surface quand on marche parallèlement à l'axe des{" "}
          <Tex>x</Tex>. En gardant <Tex>y</Tex> quelconque mais constant, on obtient la{" "}
          <strong>dérivée partielle</strong> par rapport à <Tex>x</Tex> :
        </p>
        <Tex block>{"\\frac{\\partial f}{\\partial x}(x, y) = 2xy \\qquad \\frac{\\partial f}{\\partial y}(x, y) = x^2 + 3"}</Tex>
        <p>
          Pour la seconde, c'est <Tex>x</Tex> qu'on gèle : <Tex>{"x^2 y"}</Tex> devient « une constante fois{" "}
          <Tex>y</Tex> », de dérivée <Tex>{"x^2"}</Tex>. Au point <Tex>{"(2, 1)"}</Tex>, les deux valent 4 et 7.
        </p>
        <div className="aside-cs">
          <p className="aside-cs-title">En Python</p>
          <p>
            La définition est la même qu'en une variable, un taux d'accroissement, sauf qu'on ne bouge qu'une
            coordonnée à la fois. La version centrée, <Tex>{"\\frac{f(x+h) - f(x-h)}{2h}"}</Tex>, est plus précise :
          </p>
          <pre>
            <code>{`def f(x, y):
    return x**2 * y + 3 * y

h = 1e-5
print((f(2 + h, 1) - f(2 - h, 1)) / (2 * h))   # 4.000000000026205
print((f(2, 1 + h) - f(2, 1 - h)) / (2 * h))   # 7.000000000001449`}</code>
          </pre>
          <p>
            C'est comme ça qu'on vérifie un gradient calculé à la main : si les deux ne collent pas, c'est ton calcul
            qui est faux.
          </p>
        </div>
      </section>

      <section className="section">
        <span className="section-num">3</span>
        <h2>Le gradient montre la plus forte pente</h2>
        <p>
          On range les dérivées partielles dans un vecteur, le <strong>gradient</strong> :
        </p>
        <Tex block>{"\\begin{gathered} \\nabla f(x, y) = \\left(\\frac{\\partial f}{\\partial x}(x, y),\\ \\frac{\\partial f}{\\partial y}(x, y)\\right) \\\\[1ex] \\text{pour le bol : } \\nabla f(x, y) = (2x,\\ 10y) \\end{gathered}"}</Tex>
        <p>
          Pourquoi un vecteur ? Pars de <Tex>{"(x, y)"}</Tex> et fais un petit pas <Tex>h</Tex> dans une direction{" "}
          <Tex>{"u = (u_1, u_2)"}</Tex> de longueur 1. Pour une fonction régulière comme nos polynômes, chaque
          variable contribue avec sa propre pente (c'est l'ordre 1 de Taylor, une variable à la fois) :
        </p>
        <Tex block>{"f(x + h u_1,\\ y + h u_2) \\approx f(x, y) + h\\left(\\frac{\\partial f}{\\partial x}\\,u_1 + \\frac{\\partial f}{\\partial y}\\,u_2\\right)"}</Tex>
        <p>
          La parenthèse est la pente dans la direction <Tex>u</Tex>, la <strong>dérivée directionnelle</strong>. Et tu
          la reconnais : c'est un produit scalaire en base orthonormée, celui de Terminale.
        </p>
        <p>
          « Régulière » a un sens précis : la formule exige que <Tex>f</Tex> soit <strong>différentiable</strong> au
          point, ce qui est le cas si ses dérivées partielles existent et sont continues autour (polynômes, exp, sin…).
          Avoir des dérivées partielles ne suffit pas : <Tex>{"f(x, y) = \\frac{x^2 y}{x^2 + y^2}"}</Tex>, prolongée par{" "}
          <Tex>{"f(0, 0) = 0"}</Tex>, a <Tex>{"\\nabla f(0, 0) = (0, 0)"}</Tex>, mais sa pente en 0 dans la direction{" "}
          <Tex>{"u"}</Tex> vaut <Tex>{"u_1^2 u_2"}</Tex>, soit <Tex>{"\\frac{\\sqrt2}{4} \\neq 0"}</Tex> pour{" "}
          <Tex>{"u = \\frac{1}{\\sqrt2}(1, 1)"}</Tex>.
        </p>
        <Tex block>{"D_u f = \\nabla f \\cdot u = \\|\\nabla f\\|\\,\\|u\\|\\cos\\theta = \\|\\nabla f\\|\\cos\\theta"}</Tex>
        <p>
          où <Tex>{"\\theta"}</Tex> est l'angle entre <Tex>u</Tex> et le gradient. Tout se lit sur le cosinus :
        </p>
        <ul>
          <li>
            <Tex>{"\\theta = 0"}</Tex> : pente maximale, égale à <Tex>{"\\|\\nabla f\\|"}</Tex>. Le gradient pointe vers
            la <strong>plus forte montée</strong>.
          </li>
          <li>
            <Tex>{"\\theta = \\pi"}</Tex> : pente minimale, <Tex>{"-\\|\\nabla f\\|"}</Tex>. La plus forte descente est{" "}
            <Tex>{"-\\nabla f"}</Tex>.
          </li>
          <li>
            <Tex>{"\\theta = \\pm\\frac{\\pi}{2}"}</Tex> : pente nulle. Ce sont les directions où <Tex>f</Tex> ne
            varie pas, celles de la ligne de niveau. Le gradient est donc <strong>orthogonal aux lignes de niveau</strong>.
          </li>
        </ul>
        <p>
          Vérifie-le : la flèche rouge est le gradient (réduit pour tenir dans le cadre), la verte est ta direction{" "}
          <Tex>u</Tex>. Tourne <Tex>u</Tex> et regarde <Tex>{"D_u f"}</Tex>.
        </p>
        <ContourViz showGradient />
        <p>
          Remarque que le gradient ne vise pas le centre du bol. Au point <Tex>{"(2, 1)"}</Tex>, il vaut{" "}
          <Tex>{"(4, 10)"}</Tex> : il penche fortement vers <Tex>y</Tex>, la direction raide. La plus forte pente
          locale n'est pas le chemin le plus court vers le fond.
        </p>
      </section>

      <section className="section">
        <span className="section-num">4</span>
        <h2>Descendre le bol</h2>
        <p>
          La descente de gradient du chapitre Dérivation marche telle quelle, avec un vecteur à la place d'un nombre :
          on fait un pas dans la direction de plus forte descente.
        </p>
        <Tex block>{"(x, y) \\leftarrow (x, y) - \\eta\\,\\nabla f(x, y)"}</Tex>
        <div className="aside-cs">
          <p className="aside-cs-title">Tu l'as déjà vu en CS221</p>
          <p>
            C'est exactement la règle de descente de gradient introduite dans la vidéo sur la régression linéaire,{" "}
            <Tex>{"\\mathbf{w} \\leftarrow \\mathbf{w} - \\eta\\,\\nabla_{\\mathbf{w}} \\text{TrainLoss}(\\mathbf{w})"}</Tex>. Le{" "}
            <Tex>{"\\mathbf{w}"}</Tex> en gras est un vecteur, et <Tex>{"\\nabla_{\\mathbf{w}}"}</Tex> est le gradient
            de ce chapitre : le vecteur des dérivées partielles par rapport à chaque poids.
          </p>
        </div>
        <p>
          Sur le bol, le calcul se fait coordonnée par coordonnée :
        </p>
        <Tex block>{"x \\leftarrow x - 2\\eta x = (1 - 2\\eta)\\,x \\qquad y \\leftarrow y - 10\\eta y = (1 - 10\\eta)\\,y"}</Tex>
        <p>
          Chaque pas multiplie <Tex>y</Tex> par <Tex>{"1 - 10\\eta"}</Tex>. Si <Tex>{"\\eta > 0{,}1"}</Tex>, ce facteur
          est négatif : <Tex>y</Tex> change de signe à chaque pas, on saute d'un flanc de la vallée à l'autre. C'est le{" "}
          <strong>zigzag</strong>. Si <Tex>{"\\eta > 0{,}2"}</Tex>, le facteur dépasse 1 en valeur absolue et la
          descente diverge. Déplace le point de départ orange et joue avec <Tex>{"\\eta"}</Tex> :
        </p>
        <DescentViz />
        <p>
          Le dilemme est là. La direction <Tex>y</Tex>, cinq fois plus courbée (dérivées secondes 10 contre 2), impose{" "}
          <Tex>{"\\eta < 0{,}2"}</Tex>. Mais en <Tex>x</Tex>, le facteur <Tex>{"1 - 2\\eta"}</Tex> reste alors
          au-dessus de 0,6 : on avance lentement. Avec <Tex>{"\\eta = 0{,}05"}</Tex>, après 25 pas depuis{" "}
          <Tex>{"(-4;\\ 1{,}5)"}</Tex>, <Tex>y</Tex> est déjà nul à 4 décimales et <Tex>x</Tex> vaut encore −0,29. Un
          léger zigzag avec <Tex>{"\\eta = 0{,}15"}</Tex> fait même mieux. C'est la courbure, la hessienne entrevue au
          chapitre Taylor, qui décide de ce qu'on peut se permettre.
        </p>
      </section>

      <section className="section">
        <span className="section-num">5</span>
        <h2>La régression linéaire, avec biais cette fois</h2>
        <p>
          Au chapitre Second degré, la régression sans biais était une parabole en <Tex>w</Tex>. Ajoute le biais{" "}
          <Tex>b</Tex> : la prédiction devient <Tex>{"w x + b"}</Tex> et la perte est une fonction de deux
          variables, un bol dans le plan <Tex>{"(w, b)"}</Tex> :
        </p>
        <Tex block>{"\\text{TrainLoss}(w, b) = \\frac{1}{n}\\sum_{i=1}^{n} (w x_i + b - y_i)^2"}</Tex>
        <p>
          Dérive en gelant l'autre variable. La règle de la chaîne sur chaque carré donne 2 fois le résidu, fois la
          dérivée de l'intérieur, qui vaut <Tex>{"x_i"}</Tex> par rapport à <Tex>w</Tex> et 1 par rapport à{" "}
          <Tex>b</Tex> :
        </p>
        <Tex block>{"\\begin{aligned} \\frac{\\partial\\,\\text{TrainLoss}}{\\partial w} &= \\frac{2}{n}\\sum_{i=1}^{n} (w x_i + b - y_i)\\,x_i \\\\ \\frac{\\partial\\,\\text{TrainLoss}}{\\partial b} &= \\frac{2}{n}\\sum_{i=1}^{n} (w x_i + b - y_i) \\end{aligned}"}</Tex>
        <div className="aside-cs">
          <p className="aside-cs-title">Tu l'as déjà vu en CS221</p>
          <p>
            Dans la vidéo sur la régression linéaire, le biais est caché dans les features :{" "}
            <Tex>{"\\phi(x) = [1, x]"}</Tex> et <Tex>{"\\mathbf{w} = [w_1, w_2]"}</Tex>, donc{" "}
            <Tex>{"\\mathbf{w} \\cdot \\phi(x) = w_1 + w_2 x"}</Tex>. Le gradient y est donné d'un bloc :
          </p>
          <Tex block>{"\\nabla_{\\mathbf{w}} \\text{TrainLoss}(\\mathbf{w}) = \\frac{1}{|\\mathcal{D}_{\\text{train}}|} \\sum_{(x, y) \\in \\mathcal{D}_{\\text{train}}} 2\\,(\\mathbf{w} \\cdot \\phi(x) - y)\\,\\phi(x)"}</Tex>
          <p>
            Avec <Tex>{"w_1 = b"}</Tex> et <Tex>{"w_2 = w"}</Tex>, ce sont exactement nos deux dérivées partielles,
            empilées : la composante « 1 » de <Tex>{"\\phi(x)"}</Tex> donne celle en <Tex>b</Tex>, la composante{" "}
            <Tex>x</Tex> celle en <Tex>w</Tex>. Tu viens de la re-dériver.
          </p>
        </div>
        <p>
          Au fond du bol, le gradient est nul. On annule les deux dérivées, on multiplie par <Tex>{"n/2"}</Tex> et on
          développe les sommes. On obtient les <strong>équations normales</strong> :
        </p>
        <Tex block>{"\\begin{cases} w \\sum x_i^2 + b \\sum x_i = \\sum x_i y_i \\\\[0.5ex] w \\sum x_i + n\\,b = \\sum y_i \\end{cases}"}</Tex>
        <p>
          Promesse tenue : sans biais, la seconde équation disparaît et la première donne{" "}
          <Tex>{"w^* = \\sum x_i y_i / \\sum x_i^2"}</Tex>, le sommet de la parabole du chapitre 2. Avec biais, c'est un
          système 2×2, qu'on résout par combinaison :
        </p>
        <Tex block>{"w^* = \\frac{n \\sum x_i y_i - \\sum x_i \\sum y_i}{n \\sum x_i^2 - \\left(\\sum x_i\\right)^2} \\qquad b^* = \\frac{\\sum y_i - w^* \\sum x_i}{n} = \\bar{y} - w^* \\bar{x}"}</Tex>
        <p>
          Le dénominateur vaut <Tex>{"n\\sum (x_i - \\bar{x})^2"}</Tex> : il n'est nul que si tous les{" "}
          <Tex>{"x_i"}</Tex> sont égaux, cas où toutes les droites passant par le point moyen font aussi bien les unes que les autres. La seconde formule dit
          aussi que la droite optimale passe par le point moyen <Tex>{"(\\bar{x}, \\bar{y})"}</Tex>.
        </p>
        <p>
          Exemple : <Tex>{"x = 1, 2, 3, 4"}</Tex> et <Tex>{"y = 2, 3, 5, 6"}</Tex>. On a <Tex>{"n = 4"}</Tex>,{" "}
          <Tex>{"\\sum x_i = 10"}</Tex>, <Tex>{"\\sum x_i^2 = 30"}</Tex>, <Tex>{"\\sum y_i = 16"}</Tex>,{" "}
          <Tex>{"\\sum x_i y_i = 47"}</Tex>, donc
        </p>
        <Tex block>{"\\begin{gathered} \\begin{cases} 30w + 10b = 47 \\\\ 10w + 4b = 16 \\end{cases} \\\\[1ex] w^* = \\frac{4 \\times 47 - 10 \\times 16}{4 \\times 30 - 10^2} = \\frac{28}{20} = 1{,}4 \\qquad b^* = \\frac{16 - 14}{4} = 0{,}5 \\end{gathered}"}</Tex>
        <p>
          Enfin, avec les matrices de Khan Academy : empile les exemples dans une matrice <Tex>X</Tex> dont la ligne{" "}
          <Tex>i</Tex> est <Tex>{"(x_i, 1)"}</Tex>, et pose <Tex>{"\\theta = (w, b)"}</Tex>. Alors{" "}
          <Tex>{"X^\\top X"}</Tex> contient exactement les coefficients du système, et <Tex>{"X^\\top y"}</Tex> son
          second membre :
        </p>
        <Tex block>{"X^\\top X = \\begin{pmatrix} \\sum x_i^2 & \\sum x_i \\\\ \\sum x_i & n \\end{pmatrix} \\qquad X^\\top y = \\begin{pmatrix} \\sum x_i y_i \\\\ \\sum y_i \\end{pmatrix} \\qquad X^\\top X\\,\\theta = X^\\top y"}</Tex>
        <p>
          Avec <Tex>d</Tex> features, c'est la même équation avec une matrice plus grande. La résoudre, savoir quand
          elle a une solution unique et la calculer sans erreur d'arrondi, c'est le travail de l'algèbre linéaire.
        </p>
      </section>

      <section className="section">
        <span className="section-num">6</span>
        <h2>Un exemple à la fois : la SGD</h2>
        <div className="aside-cs">
          <p className="aside-cs-title">Tu l'as déjà vu en CS221</p>
          <p>
            Dans la vidéo sur la descente de gradient stochastique, le constat est que chaque pas de descente de
            gradient parcourt tous les exemples, ce qui coûte cher quand il y en a beaucoup. La SGD fait un pas par
            exemple : pour chaque <Tex>{"(x, y) \\in \\mathcal{D}_{\\text{train}}"}</Tex>,{" "}
            <Tex>{"\\mathbf{w} \\leftarrow \\mathbf{w} - \\eta\\,\\nabla_{\\mathbf{w}} \\text{Loss}(x, y, \\mathbf{w})"}</Tex>.
          </p>
        </div>
        <p>
          Pour notre modèle, le gradient de la perte d'un seul exemple se lit dans la section précédente, sans la
          moyenne :
        </p>
        <Tex block>{"r = w x_i + b - y_i \\qquad w \\leftarrow w - \\eta \\cdot 2 r x_i \\qquad b \\leftarrow b - \\eta \\cdot 2 r"}</Tex>
        <p>Les trois méthodes sur le jeu de données de l'exemple, en Python pur :</p>
        <pre>
          <code>{`import random

xs = [1, 2, 3, 4]
ys = [2, 3, 5, 6]
n = len(xs)

# Solution exacte : équations normales
sx, sy = sum(xs), sum(ys)
sxx = sum(x * x for x in xs)
sxy = sum(x * y for x, y in zip(xs, ys))
w_star = (n * sxy - sx * sy) / (n * sxx - sx * sx)
b_star = (sy - w_star * sx) / n
print("exact :", w_star, b_star)                  # exact : 1.4 0.5

# Descente de gradient : tous les exemples à chaque pas
w, b, eta = 0.0, 0.0, 0.05
for t in range(2000):
    gw = sum(2 * (w * x + b - y) * x for x, y in zip(xs, ys)) / n
    gb = sum(2 * (w * x + b - y) for x, y in zip(xs, ys)) / n
    w, b = w - eta * gw, b - eta * gb
print("GD    :", round(w, 4), round(b, 4))        # GD    : 1.4 0.5

# SGD : un exemple à la fois, dans un ordre aléatoire
random.seed(0)
w, b, eta = 0.0, 0.0, 0.01
for epoch in range(2000):
    for i in random.sample(range(n), n):
        r = w * xs[i] + b - ys[i]
        w, b = w - eta * 2 * r * xs[i], b - eta * 2 * r
print("SGD   :", round(w, 4), round(b, 4))        # SGD   : 1.4048 0.5046`}</code>
        </pre>
        <p>
          La descente de gradient retombe sur la solution exacte. La SGD s'arrête tout près, mais pas dessus : chaque
          exemple tire <Tex>{"(w, b)"}</Tex> vers sa propre droite idéale, et avec un pas constant ces tiraillements ne
          s'éteignent jamais. C'est pour ça que la vidéo propose aussi un pas décroissant,{" "}
          <Tex>{"\\eta = 1/\\sqrt{\\text{nombre de mises à jour}}"}</Tex>.
        </p>
        <p>
          Et le pas trop grand de la section 4 existe aussi ici. Même descente de gradient, 100 pas, deux valeurs
          de <Tex>{"\\eta"}</Tex> :
        </p>
        <pre>
          <code>{`xs = [1, 2, 3, 4]
ys = [2, 3, 5, 6]
n = len(xs)
for eta in [0.05, 0.13]:
    w, b = 0.0, 0.0
    for t in range(100):
        gw = sum(2 * (w * x + b - y) * x for x, y in zip(xs, ys)) / n
        gb = sum(2 * (w * x + b - y) for x, y in zip(xs, ys)) / n
        w, b = w - eta * gw, b - eta * gb
    print(eta, w, b)

# 0.05 1.401607577422045 0.49527352634044974
# 0.13 -10162599.887202654 -3456523.233643499`}</code>
        </pre>
        <p>
          La vidéo suivante de CS221, la rétropropagation, calcule ce gradient quand la prédiction n'est plus{" "}
          <Tex>{"w x + b"}</Tex> mais un réseau de neurones. Tu y as vu la réponse : la règle de la chaîne, appliquée
          couche après couche, à des dérivées partielles.
        </p>
        <p>
          C'est la fin du module Analyse. Il t'a laissé une équation matricielle, <Tex>{"X^\\top X\\,\\theta = X^\\top y"}</Tex>,
          que seule l'algèbre linéaire sait résoudre en grand, et une descente qui avance au hasard des exemples, que
          les probabilités permettent d'analyser. Ce sont les deux suites logiques : algèbre linéaire, puis probabilités.
        </p>
      </section>
    </LessonFlow>
  );
}
