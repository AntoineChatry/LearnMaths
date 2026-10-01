import { LessonFlow } from "../../components/LessonFlow";
import { Tex } from "../../components/Tex";
import { ChainViz } from "./ChainViz";

export function ChaineLesson() {
  return (
    <LessonFlow>
      <section className="section">
        <span className="section-num">1</span>
        <h2>La règle de la chaîne est un produit de jacobiennes</h2>
        <p>
          En une variable, <Tex>{"(g \\circ f)'(x) = g'(f(x))\\,f'(x)"}</Tex> : les taux de variation se multiplient.
          En plusieurs variables, chaque dérivée devient une jacobienne, et le produit de nombres devient un produit
          de matrices (MML, équation 5.48) :
        </p>
        <Tex block>{"\\frac{\\partial}{\\partial x}\\,g\\big(f(x)\\big) = \\frac{\\partial g}{\\partial f}\\,\\frac{\\partial f}{\\partial x}"}</Tex>
        <p>
          Les tailles se vérifient comme pour tout produit matriciel. Avec{" "}
          <Tex>{"f : \\mathbb R^n \\to \\mathbb R^m"}</Tex> et <Tex>{"g : \\mathbb R^m \\to \\mathbb R^p"}</Tex>, on
          multiplie une matrice <Tex>{"p \\times m"}</Tex> par une <Tex>{"m \\times n"}</Tex> et on obtient la{" "}
          <Tex>{"p \\times n"}</Tex> attendue. MML le remarque : le <Tex>{"\\partial f"}</Tex> apparaît « en bas »
          du premier facteur et « en haut » du second, comme s'il se simplifiait. Ce n'est qu'un moyen mnémotechnique,
          une dérivée partielle n'est pas une fraction. Et l'ordre compte : le produit de matrices n'est pas
          commutatif.
        </p>
        <p>
          <strong>Le long d'un chemin.</strong> Si <Tex>{"f(x_1, x_2)"}</Tex> est une fonction de deux variables qui
          dépendent toutes deux du temps <Tex>t</Tex>, on multiplie une ligne <Tex>{"1 \\times 2"}</Tex> par une
          colonne <Tex>{"2 \\times 1"}</Tex> (MML, équation 5.49) :
        </p>
        <Tex block>{"\\frac{df}{dt} = \\begin{pmatrix} \\frac{\\partial f}{\\partial x_1} & \\frac{\\partial f}{\\partial x_2} \\end{pmatrix} \\begin{pmatrix} \\frac{dx_1}{dt} \\\\[0.5ex] \\frac{dx_2}{dt} \\end{pmatrix} = \\frac{\\partial f}{\\partial x_1}\\frac{dx_1}{dt} + \\frac{\\partial f}{\\partial x_2}\\frac{dx_2}{dt}"}</Tex>
        <p>
          C'est le produit scalaire du gradient avec la vitesse : la dérivée directionnelle du chapitre Gradient,
          pour une direction qui change à chaque instant. Exemple 5.8 de MML :{" "}
          <Tex>{"f(x_1, x_2) = x_1^2 + 2x_2"}</Tex> avec <Tex>{"x_1 = \\sin t"}</Tex> et <Tex>{"x_2 = \\cos t"}</Tex>.
        </p>
        <Tex block>{"\\frac{df}{dt} = 2\\sin t \\cdot \\cos t + 2 \\cdot (-\\sin t) = 2\\sin t\\,(\\cos t - 1)"}</Tex>
        <ChainViz />
        <pre>
          <code>{`import numpy as np

# MML exemple 5.8 : f(x1, x2) = x1² + 2 x2 avec x1 = sin t, x2 = cos t
f = lambda x1, x2: x1**2 + 2 * x2
h_ = lambda t: f(np.sin(t), np.cos(t))
t, h = 1.0, 1e-6
print((h_(t + h) - h_(t - h)) / (2 * h))
print(2 * np.sin(t) * (np.cos(t) - 1))
# -0.7736445427619643
# -0.7736445427901112`}</code>
        </pre>
      </section>

      <section className="section">
        <span className="section-num">2</span>
        <h2>Le gradient d'une perte, sans développer</h2>
        <p>
          MML (exemple 5.11) reprend les moindres carrés avec la règle de la chaîne. Le modèle linéaire prédit{" "}
          <Tex>{"\\Phi\\theta"}</Tex>, avec <Tex>{"\\Phi \\in \\mathbb R^{N \\times D}"}</Tex> la matrice des features,
          et on découpe la perte en deux étages :
        </p>
        <Tex block>{"e(\\theta) = y - \\Phi\\theta \\qquad L(e) = \\|e\\|^2 = e^\\top e"}</Tex>
        <p>
          Chaque étage a une jacobienne simple : <Tex>{"\\partial L / \\partial e = 2e^\\top"}</Tex> (une ligne{" "}
          <Tex>{"1 \\times N"}</Tex>) et <Tex>{"\\partial e / \\partial \\theta = -\\Phi"}</Tex> (une matrice{" "}
          <Tex>{"N \\times D"}</Tex>, par l'exemple de la couche linéaire du chapitre 1). Leur produit (équation
          5.83) :
        </p>
        <Tex block>{"\\frac{\\partial L}{\\partial \\theta} = \\frac{\\partial L}{\\partial e}\\,\\frac{\\partial e}{\\partial \\theta} = -2\\,(y - \\Phi\\theta)^\\top \\Phi \\in \\mathbb R^{1 \\times D}"}</Tex>
        <p>
          Transposé en colonne, c'est <Tex>{"2\\Phi^\\top(\\Phi\\theta - y)"}</Tex>. L'annuler redonne les équations
          normales <Tex>{"\\Phi^\\top\\Phi\\,\\theta = \\Phi^\\top y"}</Tex> des chapitres Gradient et Orthogonalité,
          cette fois sans développer une seule somme. MML note qu'on aurait pu développer{" "}
          <Tex>{"(y - \\Phi\\theta)^\\top(y - \\Phi\\theta)"}</Tex> directement, mais que cela devient impraticable
          pour de longues composées. Un réseau de neurones est une longue composée.
        </p>
        <p>
          Quelques identités reviennent sans cesse (MML, section 5.5, équations 5.104 à 5.107, gradients écrits en
          ligne) :
        </p>
        <Tex block>{"\\frac{\\partial\\, a^\\top x}{\\partial x} = a^\\top \\qquad \\frac{\\partial\\, x^\\top B x}{\\partial x} = x^\\top(B + B^\\top) \\qquad \\frac{\\partial\\, a^\\top X b}{\\partial X} = a b^\\top"}</Tex>
        <p>
          Pour <Tex>B</Tex> symétrique, la deuxième donne <Tex>{"2x^\\top B"}</Tex> : l'analogue de{" "}
          <Tex>{"(bx^2)' = 2bx"}</Tex>. Le test numérique du chapitre 1 reste le meilleur garde-fou :
        </p>
        <pre>
          <code>{`import numpy as np

rng = np.random.default_rng(0)
Phi = rng.standard_normal((5, 2))
y = rng.standard_normal(5)
theta = np.array([0.5, -1.0])
L = lambda th: np.sum((y - Phi @ th) ** 2)
grad = 2 * Phi.T @ (Phi @ theta - y)
num = np.array([(L(theta + e) - L(theta - e)) / 2e-6 for e in np.eye(2) * 1e-6])
print(grad, num)
# [-4.6263042  -4.56321459] [-4.6263042  -4.56321459]`}</code>
        </pre>
      </section>

      <section className="section">
        <span className="section-num">3</span>
        <h2>Dériver par rapport à une matrice de poids</h2>
        <p>
          Dans une couche <Tex>{"z = Wx + b"}</Tex>, les paramètres forment une matrice{" "}
          <Tex>{"W \\in \\mathbb R^{m \\times n}"}</Tex>. La jacobienne de <Tex>z</Tex> par rapport à <Tex>W</Tex> a{" "}
          <Tex>{"m \\times (m \\times n)"}</Tex> coefficients, un tableau à trois indices (MML, section 5.4). MML
          (exemple 5.12) le calcule : comme <Tex>{"z_i = \\sum_j W_{ij} x_j + b_i"}</Tex>,
        </p>
        <Tex block>{"\\frac{\\partial z_i}{\\partial W_{ij}} = x_j \\qquad \\frac{\\partial z_i}{\\partial W_{kj}} = 0 \\text{ si } k \\ne i"}</Tex>
        <p>
          Presque tout ce tableau est nul : <Tex>{"z_i"}</Tex> ne dépend que de la ligne <Tex>i</Tex> de{" "}
          <Tex>W</Tex>. On ne le construit donc jamais. Ce qu'on veut, c'est le gradient d'une perte{" "}
          <Tex>L</Tex> à valeurs réelles. Notons <Tex>{"\\delta = \\partial L / \\partial z"}</Tex>, écrit en colonne :
          c'est ce que la suite du réseau renvoie. La règle de la chaîne, coefficient par coefficient, ne garde qu'un
          terme :
        </p>
        <Tex block>{"\\frac{\\partial L}{\\partial W_{ij}} = \\sum_k \\frac{\\partial L}{\\partial z_k}\\,\\frac{\\partial z_k}{\\partial W_{ij}} = \\delta_i\\, x_j \\qquad\\text{soit}\\qquad \\frac{\\partial L}{\\partial W} = \\delta\\, x^\\top \\qquad \\frac{\\partial L}{\\partial b} = \\delta"}</Tex>
        <p>
          Un <strong>produit extérieur</strong> : une matrice de même forme que <Tex>W</Tex>, rangée ainsi pour pouvoir
          écrire <Tex>{"W \\leftarrow W - \\eta\\,\\partial L / \\partial W"}</Tex>. On retrouve l'identité 5.106 avec{" "}
          <Tex>{"a = \\delta"}</Tex> et <Tex>{"b = x"}</Tex>. Le coefficient <Tex>{"(i, j)"}</Tex> est « l'erreur de
          la sortie <Tex>i</Tex> fois l'entrée <Tex>j</Tex> » : un poids bouge d'autant plus que son entrée était
          active et que sa sortie s'est trompée.
        </p>
        <p>
          Sur un minibatch, les pertes s'additionnent, donc les gradients aussi :{" "}
          <Tex>{"\\sum_n \\delta_n x_n^\\top"}</Tex>. En rangeant les exemples en lignes dans <Tex>X</Tex> et les{" "}
          <Tex>{"\\delta_n"}</Tex> en lignes dans <Tex>\Delta</Tex>, c'est un seul produit,{" "}
          <Tex>{"\\Delta^\\top X"}</Tex>.
        </p>
        <pre>
          <code>{`import numpy as np

rng = np.random.default_rng(1)
W = rng.standard_normal((2, 3))
b = rng.standard_normal(2)
x = rng.standard_normal(3)
y = rng.standard_normal(2)

def loss(W):
    return 0.5 * np.sum((W @ x + b - y) ** 2)

delta = W @ x + b - y          # dL/dz, avec z = Wx + b
grad_W = np.outer(delta, x)    # delta x^T, même forme que W
num = np.zeros_like(W)
for i in range(2):
    for j in range(3):
        E = np.zeros_like(W)
        E[i, j] = 1e-6
        num[i, j] = (loss(W + E) - loss(W - E)) / 2e-6
print(grad_W.shape, np.abs(grad_W - num).max())

# Minibatch : un exemple par ligne
N = 4
X = rng.standard_normal((N, 3))
Y = rng.standard_normal((N, 2))

def batch_loss(W):
    return 0.5 * np.sum((X @ W.T + b - Y) ** 2)

Delta = X @ W.T + b - Y        # une ligne delta_n par exemple
grad_W = Delta.T @ X           # somme des delta_n x_n^T
num = np.zeros_like(W)
for i in range(2):
    for j in range(3):
        E = np.zeros_like(W)
        E[i, j] = 1e-6
        num[i, j] = (batch_loss(W + E) - batch_loss(W - E)) / 2e-6
print(np.abs(grad_W - num).max())
# (2, 3) 1.4869666609129695e-10
# 3.372275791946322e-10`}</code>
        </pre>
      </section>

      <section className="section">
        <span className="section-num">4</span>
        <h2>Une couche softmax, de bout en bout</h2>
        <p>
          Assemblons le chapitre 1 et ce chapitre sur un classifieur à une couche :{" "}
          <Tex>{"z = Wx + b"}</Tex>, <Tex>{"y = \\operatorname{softmax}(z)"}</Tex>, et l'entropie croisée{" "}
          <Tex>{"L = -\\log y_c"}</Tex> pour la vraie classe <Tex>c</Tex>, codée en one-hot par <Tex>t</Tex>. Trois
          étages, trois jacobiennes :
        </p>
        <Tex block>{"\\frac{\\partial L}{\\partial y} = -\\frac{1}{y_c}\\,e_c^\\top \\qquad \\frac{\\partial y}{\\partial z} = \\operatorname{diag}(y) - y\\,y^\\top \\qquad \\frac{\\partial z}{\\partial W_{ij}} \\text{ : section 3}"}</Tex>
        <p>
          Le premier produit ne garde que la ligne <Tex>c</Tex> de la jacobienne du softmax, dont le coefficient{" "}
          <Tex>j</Tex> vaut <Tex>{"y_c(\\delta_{cj} - y_j)"}</Tex>. Divisé par <Tex>{"-y_c"}</Tex>, il reste :
        </p>
        <Tex block>{"\\frac{\\partial L}{\\partial z_j} = y_j - \\delta_{cj} = y_j - t_j \\qquad\\text{donc}\\qquad \\delta = y - t \\qquad \\frac{\\partial L}{\\partial W} = (y - t)\\,x^\\top"}</Tex>
        <p>
          Le <Tex>{"y_c"}</Tex> s'est simplifié : c'est le gradient <Tex>{"y_j - t_j"}</Tex> du chapitre
          Vraisemblance (Bishop, PRML, équation 4.109), obtenu cette fois par la seule règle de la chaîne. Sa forme
          est la même que pour les moindres carrés, où <Tex>{"\\delta = Wx + b - y"}</Tex> : prédiction moins cible.
        </p>
        <pre>
          <code>{`import numpy as np

def softmax(z):
    e = np.exp(z - z.max())
    return e / e.sum()

rng = np.random.default_rng(3)
W = rng.standard_normal((3, 4))
b = np.zeros(3)
x = rng.standard_normal(4)
c = 2                                # vraie classe
t = np.eye(3)[c]                     # one-hot

def ce(W):
    return -np.log(softmax(W @ x + b)[c])

y = softmax(W @ x + b)
grad_W = np.outer(y - t, x)
num = np.zeros_like(W)
for i in range(3):
    for j in range(4):
        E = np.zeros_like(W)
        E[i, j] = 1e-6
        num[i, j] = (ce(W + E) - ce(W - E)) / 2e-6
print(y.round(3), np.abs(grad_W - num).max())
# [0.169 0.822 0.009] 5.577026618297509e-10`}</code>
        </pre>
        <p>
          Ici le modèle donne 0,9 % à la vraie classe : <Tex>{"y - t"}</Tex> vaut environ{" "}
          <Tex>{"(0{,}17;\\ 0{,}82;\\ -0{,}99)"}</Tex>, et le pas de gradient va fortement relever le logit de la
          vraie classe (celle d'indice 2 en Python, qui numérote à partir de 0). Avec plusieurs couches, il faut encore transporter <Tex>\delta</Tex> d'une couche à la
          précédente, et choisir l'ordre des produits. C'est la rétropropagation, au chapitre suivant.
        </p>
      </section>
    </LessonFlow>
  );
}
