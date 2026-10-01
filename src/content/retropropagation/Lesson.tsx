import { LessonFlow } from "../../components/LessonFlow";
import { Tex } from "../../components/Tex";
import { GraphViz } from "./GraphViz";

export function RetropropagationLesson() {
  return (
    <LessonFlow>
      <section className="section">
        <span className="section-num">1</span>
        <h2>Un graphe de calcul, deux passes</h2>
        <div className="aside-cs">
          <p className="aside-cs-title">Tu l'as déjà vu en CS221</p>
          <p>
            Dans le module sur la rétropropagation, chaque nœud du graphe reçoit une valeur avant{" "}
            <Tex>{"f_i"}</Tex>, calculée des feuilles vers la racine, puis une valeur arrière{" "}
            <Tex>{"g_i = \\partial \\text{loss} / \\partial f_i"}</Tex>, calculée de la racine vers les feuilles. Sur
            l'exemple <Tex>{"(w \\cdot \\varphi(x) - y)^2"}</Tex>, on obtient <Tex>{"\\nabla_w = [6, 12]"}</Tex>. Dans
            les exemples du module, chaque résultat intermédiaire ne sert qu'à un seul calcul : on multiplie le
            gradient arrière du nœud suivant par la dérivée sur l'arête. On va voir ce qui change quand une valeur
            sert deux fois.
          </p>
        </div>
        <p>
          MML (section 5.6) part d'une fonction d'une seule variable :
        </p>
        <Tex block>{"f(x) = \\sqrt{x^2 + e^{x^2}} + \\cos\\big(x^2 + e^{x^2}\\big)"}</Tex>
        <p>
          Sa dérivée développée (équation 5.110) est déjà longue, et un programme qui l'évaluerait telle quelle
          recalculerait plusieurs fois <Tex>{"x^2 + e^{x^2}"}</Tex>. Un programme raisonnable calcule plutôt{" "}
          <Tex>f</Tex> par étapes, avec des variables intermédiaires (exemple 5.14) :
        </p>
        <Tex block>{"a = x^2 \\quad b = e^a \\quad c = a + b \\quad d = \\sqrt c \\quad e = \\cos c \\quad f = d + e"}</Tex>
        <p>
          C'est un <strong>graphe de calcul</strong> : chaque nœud applique une opération élémentaire à ses parents.
          Chaque opération a une dérivée locale évidente, <Tex>{"\\partial b / \\partial a = e^a"}</Tex>,{" "}
          <Tex>{"\\partial d / \\partial c = 1 / (2\\sqrt c)"}</Tex>, et ainsi de suite. On part ensuite de la sortie,
          où <Tex>{"\\partial f / \\partial f = 1"}</Tex>, et on remonte le graphe. La règle, pour tout nœud{" "}
          <Tex>{"x_i"}</Tex> (MML, équation 5.145) :
        </p>
        <Tex block>{"\\frac{\\partial f}{\\partial x_i} = \\sum_{x_j \\text{ enfant de } x_i} \\frac{\\partial f}{\\partial x_j}\\,\\frac{\\partial x_j}{\\partial x_i}"}</Tex>
        <p>
          La somme est la nouveauté par rapport aux exemples de CS221. Ici, <Tex>a</Tex> sert deux fois : pour
          calculer <Tex>b</Tex> et pour calculer <Tex>c</Tex>. Une petite variation de <Tex>a</Tex> atteint{" "}
          <Tex>f</Tex> par deux chemins, et leurs effets s'additionnent :
        </p>
        <Tex block>{"\\frac{\\partial f}{\\partial a} = \\frac{\\partial f}{\\partial b}\\,e^a + \\frac{\\partial f}{\\partial c} \\cdot 1"}</Tex>
        <p>
          Fais défiler les deux passes. La passe avant remplit les valeurs, la passe arrière les dérivées, dans
          l'ordre inverse. Chaque dérivée arrière utilise des valeurs de la passe avant : <Tex>c</Tex> pour{" "}
          <Tex>{"\\partial f / \\partial c"}</Tex>, <Tex>x</Tex> pour <Tex>{"\\partial f / \\partial x"}</Tex>.
          C'est pourquoi l'entraînement d'un réseau garde en mémoire toutes les activations intermédiaires.
        </p>
        <GraphViz />
        <p>
          MML souligne le point contre-intuitif : chaque étape arrière coûte une ou deux opérations, donc calculer la
          dérivée coûte à peu près autant que calculer la fonction, alors que son expression développée est bien plus
          compliquée que celle de <Tex>f</Tex>. Ce n'est pas du calcul symbolique : on ne manipule jamais de formule,
          seulement des nombres. Et ce n'est pas une différence finie : le résultat est exact, aux arrondis près.
        </p>
        <pre>
          <code>{`import numpy as np

# MML exemple 5.14 : passe avant, en gardant les valeurs intermédiaires
x = 0.8
a = x**2
b = np.exp(a)
c = a + b
d = np.sqrt(c)
e = np.cos(c)
f = d + e

# Passe arrière : de la sortie vers l'entrée (MML 5.139 à 5.142)
df_dd = 1.0
df_de = 1.0
df_dc = df_dd / (2 * np.sqrt(c)) + df_de * (-np.sin(c))
df_db = df_dc
df_da = df_db * np.exp(a) + df_dc     # a a deux enfants : b et c
df_dx = df_da * 2 * x

F = lambda x: np.sqrt(x**2 + np.exp(x**2)) + np.cos(x**2 + np.exp(x**2))
print(df_dx, (F(x + 1e-6) - F(x - 1e-6)) / 2e-6)
# -1.1813403702321728 -1.1813403702487513`}</code>
        </pre>
      </section>

      <section className="section">
        <span className="section-num">2</span>
        <h2>Mode direct, mode inverse : l'ordre des produits</h2>
        <p>
          Sur une chaîne <Tex>{"x \\to a \\to b \\to y"}</Tex>, la règle de la chaîne donne un produit de trois
          jacobiennes. Le produit de matrices est associatif, on peut donc le parenthéser de deux façons (MML,
          équations 5.120 et 5.121) :
        </p>
        <Tex block>{"\\text{inverse : } \\left(\\frac{dy}{db}\\,\\frac{db}{da}\\right)\\frac{da}{dx} \\qquad\\qquad \\text{direct : } \\frac{dy}{db}\\left(\\frac{db}{da}\\,\\frac{da}{dx}\\right)"}</Tex>
        <p>
          Le <strong>mode inverse</strong> multiplie en partant de la sortie, à contre-courant des données : c'est la
          rétropropagation. Le <strong>mode direct</strong> multiplie dans le sens des données. Le résultat est le
          même, le coût non.
        </p>
        <p>
          En apprentissage, la sortie est une perte : un seul nombre. Sa jacobienne est une ligne. En mode inverse, on
          part de cette ligne et chaque étape est un produit ligne fois matrice, qui renvoie encore une ligne. En mode
          direct, les premiers produits sont des produits de matrices pleines. Avec une ligne <Tex>u</Tex> de taille{" "}
          <Tex>k</Tex> et deux matrices <Tex>{"A \\in \\mathbb R^{k \\times k}"}</Tex>,{" "}
          <Tex>{"B \\in \\mathbb R^{k \\times n}"}</Tex>, en comptant les multiplications :
        </p>
        <Tex block>{"(uA)B : k^2 + kn \\qquad\\qquad u(AB) : k^2 n + kn"}</Tex>
        <pre>
          <code>{`import numpy as np

k, n = 1000, 1000
rng = np.random.default_rng(0)
u = rng.standard_normal((1, k))      # dL/dz : une ligne, la perte est un scalaire
A = rng.standard_normal((k, k))
B = rng.standard_normal((k, n))

inverse = (u @ A) @ B                # ligne × matrice, deux fois
direct = u @ (A @ B)                 # matrice × matrice d'abord
print(np.allclose(inverse, direct))
print("inverse :", k * k + k * n, "multiplications")
print("direct  :", k * k * n + k * n, "multiplications")
# True
# inverse : 2000000 multiplications
# direct  : 1001000000 multiplications`}</code>
        </pre>
        <p>
          Cinq cents fois moins de calcul pour le même gradient. En général, pour{" "}
          <Tex>{"f : \\mathbb R^n \\to \\mathbb R^m"}</Tex>, une passe inverse donne une ligne de la jacobienne (le
          gradient d'une sortie), une passe directe en donne une colonne (la dérivée selon une entrée). Pour une perte,{" "}
          <Tex>{"m = 1"}</Tex> et <Tex>n</Tex> vaut des millions de paramètres : une seule passe inverse suffit, il
          faudrait <Tex>n</Tex> passes directes. C'est la raison donnée par MML pour préférer le mode inverse quand les
          entrées sont bien plus nombreuses que les sorties.
        </p>
        <p>
          Bishop (PRML, section 5.3.3) fait le même compte face aux différences finies. Avec <Tex>W</Tex> poids, une
          passe avant coûte <Tex>{"O(W)"}</Tex>, et la rétropropagation aussi. Les différences finies perturbent chaque
          poids tour à tour et refont une passe avant à chaque fois : <Tex>{"O(W^2)"}</Tex>. Elles gardent un rôle, le
          test du chapitre 1 : comparer sur quelques cas pour vérifier une implémentation.
        </p>
        <p>
          Dernière conséquence : on ne construit jamais une jacobienne. On ne calcule que des produits{" "}
          <Tex>{"\\delta^\\top J"}</Tex> : ligne fois jacobienne. Pour une couche linéaire <Tex>{"z = Wx"}</Tex>, c'est{" "}
          <Tex>{"W^\\top \\delta"}</Tex> en colonne. Pour une activation appliquée terme à terme, dont la jacobienne est
          diagonale (chapitre 1), c'est un produit terme à terme <Tex>{"\\sigma'(z) \\odot \\delta"}</Tex>.
        </p>
      </section>

      <section className="section">
        <span className="section-num">3</span>
        <h2>La rétropropagation dans un réseau</h2>
        <p>
          Un réseau enchaîne des couches (MML, équations 5.112 et 5.113, avec nos notations) :
        </p>
        <Tex block>{"h^{(0)} = x \\qquad z^{(l)} = W^{(l)} h^{(l-1)} + b^{(l)} \\qquad h^{(l)} = \\sigma\\big(z^{(l)}\\big)"}</Tex>
        <p>
          MML écrit le gradient par rapport aux paramètres de chaque couche (équations 5.115 à 5.118) : ce sont des
          produits qui commencent tous par <Tex>{"\\partial L / \\partial f_K"}</Tex>, et chaque couche plus profonde
          ajoute un facteur. Calculés de la sortie vers l'entrée, chaque produit réutilise le précédent. On garde donc
          une seule quantité par couche, <Tex>{"\\delta^{(l)} = \\partial L / \\partial z^{(l)}"}</Tex>, et on la
          transporte vers l'arrière :
        </p>
        <Tex block>{"\\delta^{(l)} = \\sigma'\\big(z^{(l)}\\big) \\odot \\Big(W^{(l+1)\\top}\\,\\delta^{(l+1)}\\Big) \\qquad \\frac{\\partial L}{\\partial W^{(l)}} = \\delta^{(l)}\\,h^{(l-1)\\top} \\qquad \\frac{\\partial L}{\\partial b^{(l)}} = \\delta^{(l)}"}</Tex>
        <p>
          Les deux produits de la section 2 : <Tex>{"W^\\top\\delta"}</Tex> pour traverser la couche linéaire,{" "}
          <Tex>{"\\sigma' \\odot"}</Tex> pour traverser l'activation. Le gradient des poids est le produit extérieur du
          chapitre 2, avec l'entrée de la couche, <Tex>{"h^{(l-1)}"}</Tex>. Bishop écrit la même chose coefficient par
          coefficient (PRML, équations 5.53 et 5.56) :
        </p>
        <Tex block>{"\\delta_j = h'(a_j) \\sum_k w_{kj}\\,\\delta_k \\qquad \\frac{\\partial E_n}{\\partial w_{ji}} = \\delta_j z_i"}</Tex>
        <p>
          La somme sur <Tex>k</Tex> est la somme sur les enfants de la section 1 : l'unité <Tex>j</Tex> alimente
          toutes les unités <Tex>k</Tex> de la couche suivante. Le premier <Tex>\delta</Tex>, celui de la sortie, vient
          de la perte : prédiction moins cible, pour <Tex>{"\\frac12\\|\\cdot\\|^2"}</Tex> comme pour softmax et
          entropie croisée (chapitre 2, et PRML équation 5.54, <Tex>{"\\delta_k = y_k - t_k"}</Tex>). L'algorithme de Bishop tient en quatre étapes : passe avant, <Tex>\delta</Tex> de
          sortie, rétropropagation des <Tex>\delta</Tex>, puis gradients des poids. Sur un minibatch, on somme sur les
          exemples (équation 5.57).
        </p>
        <p>
          Pour une ReLU, <Tex>{"\\sigma'(z) = 1"}</Tex> si <Tex>{"z > 0"}</Tex> et <Tex>0</Tex> si{" "}
          <Tex>{"z < 0"}</Tex> : le <Tex>\delta</Tex> passe tel quel par les unités actives et s'arrête aux autres.
          Une unité inactive pour cet exemple ne reçoit aucun gradient, et ses poids d'entrée ne bougent pas.
        </p>
        <pre>
          <code>{`import numpy as np

rng = np.random.default_rng(2)
W1, b1 = rng.standard_normal((4, 3)), rng.standard_normal(4)
W2, b2 = rng.standard_normal((2, 4)), rng.standard_normal(2)
x, y = rng.standard_normal(3), rng.standard_normal(2)

def loss(W1):
    h = np.maximum(W1 @ x + b1, 0)
    return 0.5 * np.sum((W2 @ h + b2 - y) ** 2)

# Passe avant : on garde z1 et h pour la passe arrière
z1 = W1 @ x + b1
h = np.maximum(z1, 0)
out = W2 @ h + b2

# Passe arrière
d2 = out - y                   # delta de la sortie
gW2 = np.outer(d2, h)          # delta x^T, avec h comme entrée
dh = W2.T @ d2                 # transporter delta : W^T delta
d1 = dh * (z1 > 0)             # traverser la ReLU : produit terme à terme
gW1 = np.outer(d1, x)

num = np.zeros_like(W1)
for i in range(4):
    for j in range(3):
        E = np.zeros_like(W1)
        E[i, j] = 1e-6
        num[i, j] = (loss(W1 + E) - loss(W1 - E)) / 2e-6
print(z1 > 0)
print(np.abs(gW1 - num).max())
# [ True False False False]
# 6.020202114598305e-10`}</code>
        </pre>
        <p>
          Ici, une seule des quatre unités cachées est active : trois lignes de <Tex>{"\\partial L / \\partial W_1"}</Tex>{" "}
          sont nulles, et les différences finies le confirment.
        </p>
      </section>

      <section className="section">
        <span className="section-num">4</span>
        <h2>Ce que fait loss.backward()</h2>
        <p>
          MML (section 5.6.2) présente la rétropropagation comme un cas particulier de la{" "}
          <strong>différentiation automatique</strong> en mode inverse. Le programme décrit un graphe : pour{" "}
          <Tex>{"i = d + 1, \\dots, D"}</Tex>, <Tex>{"x_i = g_i(x_{\\mathrm{Pa}(x_i)})"}</Tex>, où chaque{" "}
          <Tex>{"g_i"}</Tex> est une opération élémentaire appliquée aux parents de <Tex>{"x_i"}</Tex> (équation
          5.143). La passe arrière applique l'équation 5.145 à chaque nœud, de la sortie vers les entrées. Il suffit
          que chaque opération connaisse sa dérivée locale.
        </p>
        <p>
          C'est ce que fait PyTorch. Pendant la passe avant, chaque opération sur un tenseur qui demande un gradient
          enregistre ses parents et de quoi calculer sa dérivée locale. <code>loss.backward()</code> parcourt ce
          graphe à l'envers. Voici le mécanisme en vingt-cinq lignes, sur l'exemple de la section 1 :
        </p>
        <pre>
          <code>{`import math

class Var:
    def __init__(self, value, parents=()):
        self.value = value
        self.parents = parents    # couples (parent, dérivée locale)
        self.grad = 0.0

    def __add__(self, other):
        return Var(self.value + other.value, ((self, 1.0), (other, 1.0)))

    def __mul__(self, other):
        return Var(self.value * other.value, ((self, other.value), (other, self.value)))

def exp(u): return Var(math.exp(u.value), ((u, math.exp(u.value)),))
def sqrt(u): return Var(math.sqrt(u.value), ((u, 0.5 / math.sqrt(u.value)),))
def cos(u): return Var(math.cos(u.value), ((u, -math.sin(u.value)),))

def backward(out):
    # ordre topologique : chaque nœud après tous ceux dont il dépend
    order, seen = [], set()
    def visit(v):
        if id(v) not in seen:
            seen.add(id(v))
            for p, _ in v.parents:
                visit(p)
            order.append(v)
    visit(out)
    out.grad = 1.0
    for v in reversed(order):           # de la sortie vers les entrées
        for p, local in v.parents:
            p.grad += v.grad * local    # += : on somme sur les enfants (MML 5.145)

x = Var(0.8)
a = x * x
c = a + exp(a)
f = sqrt(c) + cos(c)
backward(f)
print(x.grad)
# -1.1813403702321728`}</code>
        </pre>
        <p>
          Même nombre qu'à la main. Deux détails comptent. L'ordre topologique garantit qu'un nœud a reçu les
          contributions de tous ses enfants avant de transmettre la sienne. Et le <code>+=</code> est la somme de
          l'équation 5.145 : <code>x * x</code> fait de <Tex>x</Tex> deux fois le parent de <Tex>a</Tex>, avec la
          dérivée locale <Tex>x</Tex> à chaque fois, et <Tex>{"x + x = 2x"}</Tex> redonne bien{" "}
          <Tex>{"\\partial a / \\partial x"}</Tex>.
        </p>
        <p>
          PyTorch accumule de la même façon dans <code>.grad</code>, y compris d'un appel à <code>backward()</code> au
          suivant :
        </p>
        <pre>
          <code>{`import torch

x = torch.tensor(0.8, requires_grad=True)
a = x**2
c = a + torch.exp(a)
f = torch.sqrt(c) + torch.cos(c)
f.backward()
print(x.grad)

# Deuxième passe avant + arrière sans remise à zéro : les gradients s'ajoutent
a = x**2
c = a + torch.exp(a)
f = torch.sqrt(c) + torch.cos(c)
f.backward()
print(x.grad)
x.grad = None       # ce que fait optimizer.zero_grad() pour chaque paramètre
# tensor(-1.1813)
# tensor(-2.3627)`}</code>
        </pre>
        <p>
          D'où le <code>optimizer.zero_grad()</code> au début de chaque pas d'entraînement : sans lui, le gradient
          d'un minibatch s'ajouterait à celui des précédents. MML note enfin que le programme n'a pas besoin d'être une
          formule : boucles et conditions sont permises, avec plus de soin, tant que chaque opération élémentaire est
          dérivable. Il reste à se servir de ce gradient. Le pas <Tex>{"-\\eta\\nabla L"}</Tex> ignore la courbure :
          le chapitre suivant l'utilise pour choisir le pas.
        </p>
      </section>
    </LessonFlow>
  );
}
