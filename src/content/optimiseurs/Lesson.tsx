import { LessonFlow } from "../../components/LessonFlow";
import { Tex } from "../../components/Tex";
import { MomentumViz } from "./MomentumViz";

export function OptimiseursLesson() {
  return (
    <LessonFlow>
      <section className="section">
        <span className="section-num">1</span>
        <h2>Donner de la mémoire à la descente</h2>
        <p>
          Newton corrige le conditionnement, mais sa hessienne est hors de portée d'un grand réseau. On veut le même
          effet avec seulement des gradients. Dans une vallée étroite, la descente de gradient rebondit d'une paroi à
          l'autre : les composantes du gradient qui traversent la vallée changent de signe à chaque pas, celles qui
          la longent gardent le même. L'idée du <strong>momentum</strong> (Rumelhart et al., 1986, cités par MML en
          section 7.1.2) est de moyenner les gradients successifs : les oscillations s'annulent, la pente régulière
          s'accumule. MML parle d'une boule lourde, réticente à changer de direction. Dans la forme de Goh (
          <em>Why Momentum Really Works</em>, Distill, 2017), avec un pas <Tex>\eta</Tex> et un coefficient{" "}
          <Tex>{"\\beta \\in [0, 1["}</Tex> :
        </p>
        <Tex block>{"z_{k+1} = \\beta\\, z_k + \\nabla f(w_k) \\qquad\\qquad w_{k+1} = w_k - \\eta\\, z_{k+1}"}</Tex>
        <p>
          Avec <Tex>{"\\beta = 0"}</Tex>, on retrouve la descente de gradient. En déroulant la récurrence,{" "}
          <Tex>{"z_{k+1} = \\nabla f(w_k) + \\beta\\,\\nabla f(w_{k-1}) + \\beta^2\\,\\nabla f(w_{k-2}) + \\dots"}</Tex>{" "}
          : une somme des gradients passés, pondérés par une suite géométrique. Le pas vaut aussi{" "}
          <Tex>{"w_{k+1} - w_k = \\beta\\,(w_k - w_{k-1}) - \\eta\\,\\nabla f(w_k)"}</Tex> : le pas précédent, amorti,
          plus un pas de gradient. C'est la forme des équations 7.11 et 7.12 de MML.
        </p>
        <p>
          Reprenons le bol incliné du chapitre Valeurs propres, avec pour chaque méthode ses meilleurs réglages
          (section 2) :
        </p>
        <pre>
          <code>{`import numpy as np

c, s = np.cos(np.pi / 4), np.sin(np.pi / 4)
Q = np.array([[c, -s], [s, c]])  # le bol incliné du chapitre Valeurs propres

def steps(lmin, momentum, tol=1e-6):
    A = Q @ np.diag([1.0, lmin]) @ Q.T
    if momentum:  # réglages optimaux (Goh, 2017)
        eta = (2 / (1 + np.sqrt(lmin))) ** 2
        beta = ((1 - np.sqrt(lmin)) / (1 + np.sqrt(lmin))) ** 2
    else:
        eta, beta = 2 / (1 + lmin), 0.0
    w, z = np.array([1.0, 0.0]), np.zeros(2)
    k = 0
    while np.linalg.norm(w) > tol:
        z = beta * z + A @ w     # mémoire des gradients passés
        w = w - eta * z
        k += 1
    return k

for lmin in [0.5, 0.1, 0.01, 0.0001]:  # kappa = 2, 10, 100, 10 000
    print(lmin, "gradient :", steps(lmin, False), "  momentum :", steps(lmin, True))
# 0.5 gradient : 13   momentum : 10
# 0.1 gradient : 69   momentum : 27
# 0.01 gradient : 691   momentum : 93
# 0.0001 gradient : 69078   momentum : 1056`}</code>
        </pre>
        <p>
          Quand <Tex>\kappa</Tex> est multiplié par 100, la descente de gradient prend 100 fois plus de pas, le
          momentum environ 10 fois plus. La section 2 explique cette racine carrée. Joue avec les deux réglages, puis
          essaie les réglages optimaux : avec le même pas, la descente de gradient sans momentum diverge.
        </p>
        <MomentumViz />
      </section>

      <section className="section">
        <span className="section-num">2</span>
        <h2>Pourquoi le momentum va plus vite</h2>
        <p>
          Sur une quadratique <Tex>{"f(w) = \\tfrac12 w^\\top A w - b^\\top w"}</Tex>, on se place, comme au chapitre
          Valeurs propres, dans la base propre de <Tex>A</Tex>. Chaque direction propre, de valeur propre{" "}
          <Tex>{"\\lambda_i"}</Tex>, évolue seule. Notons <Tex>{"x_i^k"}</Tex> l'écart au minimum dans cette
          direction et <Tex>{"y_i^k"}</Tex> la composante de <Tex>z</Tex>. Le gradient y vaut{" "}
          <Tex>{"\\lambda_i x_i^k"}</Tex>, et un pas s'écrit (Goh, 2017) :
        </p>
        <Tex block>{"\\begin{pmatrix} y_i^{k+1} \\\\ x_i^{k+1} \\end{pmatrix} = R \\begin{pmatrix} y_i^{k} \\\\ x_i^{k} \\end{pmatrix} \\qquad R = \\begin{pmatrix} \\beta & \\lambda_i \\\\ -\\eta\\beta & 1 - \\eta\\lambda_i \\end{pmatrix}"}</Tex>
        <p>
          La descente de gradient multipliait l'erreur par un nombre, <Tex>{"1 - \\eta\\lambda_i"}</Tex> ; le
          momentum la multiplie par une matrice <Tex>{"2 \\times 2"}</Tex>. L'erreur se comporte comme{" "}
          <Tex>{"\\rho^k"}</Tex>, où <Tex>\rho</Tex> est le plus grand module des valeurs propres de <Tex>R</Tex>.
          Leur produit vaut <Tex>{"\\det R = \\beta"}</Tex> et leur somme{" "}
          <Tex>{"\\operatorname{tr} R = 1 + \\beta - \\eta\\lambda_i"}</Tex>. Quand elles sont complexes, elles sont
          conjuguées, de même module, donc <Tex>{"\\rho = \\sqrt\\beta"}</Tex> quel que soit <Tex>\eta</Tex>. Goh
          en déduit la condition de convergence :
        </p>
        <Tex block>{"0 < \\eta\\lambda_i < 2 + 2\\beta"}</Tex>
        <p>
          Sans momentum, c'était <Tex>{"\\eta\\lambda_i < 2"}</Tex> : le momentum autorise un pas jusqu'à deux fois
          plus grand. En choisissant <Tex>\eta</Tex> et <Tex>\beta</Tex> pour que les deux directions extrêmes,{" "}
          <Tex>{"\\lambda_{\\min}"}</Tex> et <Tex>{"\\lambda_{\\max}"}</Tex>, convergent au même rythme, Goh obtient
          les réglages optimaux :
        </p>
        <Tex block>{"\\eta = \\left(\\frac{2}{\\sqrt{\\lambda_{\\min}} + \\sqrt{\\lambda_{\\max}}}\\right)^2 \\qquad \\beta = \\left(\\frac{\\sqrt{\\lambda_{\\max}} - \\sqrt{\\lambda_{\\min}}}{\\sqrt{\\lambda_{\\max}} + \\sqrt{\\lambda_{\\min}}}\\right)^2"}</Tex>
        <p>
          et le taux <Tex>{"\\rho = \\sqrt\\beta"}</Tex>, à comparer avec le meilleur taux sans momentum :
        </p>
        <Tex block>{"\\text{momentum : } \\frac{\\sqrt\\kappa - 1}{\\sqrt\\kappa + 1} \\qquad\\qquad \\text{gradient : } \\frac{\\kappa - 1}{\\kappa + 1}"}</Tex>
        <p>
          Le conditionnement est remplacé par sa racine carrée. Pour <Tex>{"\\kappa = 100"}</Tex>, le taux passe de{" "}
          <Tex>{"99/101 \\approx 0{,}980"}</Tex> à <Tex>{"9/11 \\approx 0{,}818"}</Tex>. Pour réduire l'erreur d'un
          facteur <Tex>{"10^6"}</Tex>, il faut <Tex>{"\\ln(10^6)/\\ln(101/99) \\approx 691"}</Tex> pas de gradient,
          exactement le compte du code. Le momentum en fait 93 plutôt que{" "}
          <Tex>{"\\ln(10^6)/\\ln(11/9) \\approx 69"}</Tex> : aux réglages optimaux, <Tex>R</Tex> a une valeur propre
          double et l'erreur décroît comme <Tex>{"k\\,\\rho^k"}</Tex>, un peu plus lentement que{" "}
          <Tex>{"\\rho^k"}</Tex>. Goh ajoute que ce taux est, pour une classe d'algorithmes du premier ordre, le
          meilleur possible (borne inférieure de Nesterov).
        </p>
        <p>
          <strong>Avec des gradients bruités.</strong> En apprentissage, on n'a qu'un gradient de minibatch, estimation
          bruitée du vrai gradient (chapitre Grands nombres). MML note que le momentum aide encore : il moyenne des
          estimations bruitées successives. C'est l'optimiseur SGD de PyTorch, dont le paramètre{" "}
          <code>momentum</code> est notre <Tex>\beta</Tex> :
        </p>
        <pre>
          <code>{`import numpy as np
import torch

A = torch.tensor([[3.0, 1.0], [1.0, 2.0]])
w = torch.tensor([1.0, -1.0], requires_grad=True)
opt = torch.optim.SGD([w], lr=0.1, momentum=0.9)

wn, z = np.array([1.0, -1.0]), np.zeros(2)       # notre version
for _ in range(10):
    opt.zero_grad()
    (0.5 * w @ A @ w).backward()
    opt.step()
    z = 0.9 * z + A.numpy() @ wn
    wn = wn - 0.1 * z
print(np.allclose(w.detach().numpy(), wn))
# True`}</code>
        </pre>
        <p>
          Sur un vrai réseau, on ne connaît ni <Tex>{"\\lambda_{\\min}"}</Tex> ni <Tex>{"\\lambda_{\\max}"}</Tex>, et
          la perte n'est pas quadratique. Goh tire surtout une règle des formules : quand le problème est mal
          conditionné, le <Tex>\beta</Tex> optimal est proche de 1 et le pas optimal vaut à peu près le double de
          celui de la descente de gradient. Il conseille donc de prendre <Tex>\beta</Tex> aussi proche de 1 que
          possible (il cite 0,99), puis le plus grand pas qui converge encore.
        </p>
      </section>

      <section className="section">
        <span className="section-num">3</span>
        <h2>Adam : un pas par coordonnée</h2>
        <p>
          Le momentum garde un seul pas <Tex>\eta</Tex> pour tous les paramètres. Or leurs gradients peuvent différer
          de plusieurs ordres de grandeur. Adam (Kingma et Ba, 2015, algorithme 1) suit, pour chaque coordonnée, une
          moyenne mobile du gradient et une moyenne mobile de son carré, puis divise l'une par la racine de l'autre.
          Toutes les opérations sont terme à terme :
        </p>
        <Tex block>{"\\begin{gathered} m_t = \\beta_1 m_{t-1} + (1 - \\beta_1)\\, g_t \\qquad v_t = \\beta_2 v_{t-1} + (1 - \\beta_2)\\, g_t^2 \\\\ \\hat m_t = \\frac{m_t}{1 - \\beta_1^t} \\qquad \\hat v_t = \\frac{v_t}{1 - \\beta_2^t} \\qquad w_t = w_{t-1} - \\eta\\, \\frac{\\hat m_t}{\\sqrt{\\hat v_t} + \\epsilon} \\end{gathered}"}</Tex>
        <p>
          Les réglages par défaut de l'article, que reprend PyTorch, sont <Tex>{"\\eta = 0{,}001"}</Tex>,{" "}
          <Tex>{"\\beta_1 = 0{,}9"}</Tex>, <Tex>{"\\beta_2 = 0{,}999"}</Tex> et <Tex>{"\\epsilon = 10^{-8}"}</Tex>.
          L'article note le pas <Tex>\alpha</Tex> ; on garde <Tex>\eta</Tex>.
        </p>
        <p>
          <strong>La correction du biais.</strong> Les moyennes partent de <Tex>{"m_0 = v_0 = 0"}</Tex>, donc elles
          sont tirées vers 0 au début. En déroulant,{" "}
          <Tex>{"m_t = (1 - \\beta_1)\\sum_{i=1}^{t} \\beta_1^{t-i} g_i"}</Tex>. Si les <Tex>{"g_i"}</Tex> ont tous
          la même espérance, la somme géométrique donne{" "}
          <Tex>{"\\mathbb E[m_t] = \\mathbb E[g]\\,(1 - \\beta_1^t)"}</Tex>. L'article (section 3) fait ce calcul pour{" "}
          <Tex>{"v_t"}</Tex> : <Tex>{"\\mathbb E[v_t] = \\mathbb E[g^2]\\,(1 - \\beta_2^t)"}</Tex>, à un terme près
          qui s'annule si le gradient est stationnaire. Diviser par <Tex>{"1 - \\beta^t"}</Tex> retire ce biais. Au
          premier pas, <Tex>{"\\hat m_1 = g_1"}</Tex> et <Tex>{"\\hat v_1 = g_1^2"}</Tex>.
        </p>
        <p>
          <strong>Un pas de taille à peu près <Tex>\eta</Tex>.</strong> Avec <Tex>{"\\epsilon = 0"}</Tex>, le pas
          est <Tex>{"\\eta\\,\\hat m_t/\\sqrt{\\hat v_t}"}</Tex>. Comme{" "}
          <Tex>{"|\\mathbb E[g]| \\le \\sqrt{\\mathbb E[g^2]}"}</Tex>, le rapport est en général de l'ordre de 1 au
          plus : chaque coordonnée bouge d'environ <Tex>\eta</Tex> au plus par pas (section 2.1 de l'article). Au
          premier pas, c'est exactement <Tex>{"-\\eta\\,\\operatorname{signe}(g_1)"}</Tex>. Le pas ne dépend pas non
          plus de l'échelle des gradients : multiplier <Tex>g</Tex> par <Tex>c</Tex> multiplie{" "}
          <Tex>{"\\hat m"}</Tex> par <Tex>c</Tex> et <Tex>{"\\sqrt{\\hat v}"}</Tex> par <Tex>{"|c|"}</Tex>. Enfin,
          les auteurs appellent <Tex>{"\\hat m_t/\\sqrt{\\hat v_t}"}</Tex> un rapport signal sur bruit : près d'un
          optimum, les gradients changent de signe, <Tex>{"\\hat m_t"}</Tex> se rapproche de 0 et les pas
          raccourcissent d'eux-mêmes.
        </p>
        <pre>
          <code>{`import numpy as np
import torch

def adam(grad, w, steps, lr=0.001, b1=0.9, b2=0.999, eps=1e-8):
    # Kingma et Ba (2015), algorithme 1
    m, v = np.zeros_like(w), np.zeros_like(w)
    for t in range(1, steps + 1):
        g = grad(w)
        m = b1 * m + (1 - b1) * g          # moyenne mobile du gradient
        v = b2 * v + (1 - b2) * g * g      # moyenne mobile du gradient au carré
        m_hat = m / (1 - b1 ** t)          # correction du biais d'initialisation
        v_hat = v / (1 - b2 ** t)
        w = w - lr * m_hat / (np.sqrt(v_hat) + eps)
    return w

A = np.array([[300.0, 0.0], [0.0, 0.002]])  # une pente raide, une pente presque plate
grad = lambda w: A @ w
w0 = np.array([1.0, -1.0])

print(adam(grad, w0, 1) - w0)                              # premier pas
diff = adam(lambda w: 1000 * grad(w), w0, 200) - adam(grad, w0, 200)  # gradient x 1000
print(f"{np.abs(diff).max():.1e}")

wt = torch.tensor(w0, requires_grad=True)
opt = torch.optim.Adam([wt], lr=0.001)
for _ in range(200):
    opt.zero_grad()
    (0.5 * wt @ torch.tensor(A) @ wt).backward()
    opt.step()
print(np.allclose(wt.detach().numpy(), adam(grad, w0, 200)))
# [-0.001  0.001]
# 9.6e-07
# True`}</code>
        </pre>
        <p>
          Les gradients initiaux valent 300 et 0,002, mais les deux coordonnées bougent de 0,001. Multiplier la perte
          par 1000 ne change presque rien : le petit écart vient de <Tex>\epsilon</Tex>, qui n'est plus négligeable
          devant un gradient de 0,002. Et notre version donne les mêmes itérés que <code>torch.optim.Adam</code>.
          Diviser chaque coordonnée par <Tex>{"\\sqrt{\\hat v_t}"}</Tex> revient à un préconditionneur diagonal,
          recalculé à chaque pas à partir des seuls gradients : une version très grossière, mais gratuite, de ce que
          Newton fait avec <Tex>{"H^{-1}"}</Tex>.
        </p>
      </section>

      <section className="section">
        <span className="section-num">4</span>
        <h2>AdamW : découpler le weight decay</h2>
        <p>
          Le chapitre Vraisemblance a présenté le weight decay comme le terme{" "}
          <Tex>{"\\tfrac{\\lambda'}{2}\\|w\\|^2"}</Tex> ajouté à la perte (a priori gaussien). À l'origine (Hanson et
          Pratt, 1988, cités par Loshchilov et Hutter, 2019, équation 1), c'est une décroissance des poids à chaque
          pas :
        </p>
        <Tex block>{"w_{t+1} = (1 - \\lambda)\\, w_t - \\eta\\, \\nabla f_t(w_t)"}</Tex>
        <p>
          Pour la SGD, les deux coïncident. Le pas de gradient sur la perte régularisée est{" "}
          <Tex>{"w - \\eta(\\nabla f + \\lambda' w) = (1 - \\eta\\lambda')\\,w - \\eta\\,\\nabla f"}</Tex> : c'est la
          décroissance avec <Tex>{"\\lambda = \\eta\\lambda'"}</Tex> (leur proposition 1, qui écrit{" "}
          <Tex>{"\\lambda' = \\lambda/\\eta"}</Tex>). Le meilleur <Tex>{"\\lambda'"}</Tex> dépend donc du pas.
        </p>
        <p>
          Pour Adam, non (proposition 2). Le gradient de la pénalité, <Tex>{"\\lambda' w"}</Tex>, passe dans{" "}
          <Tex>{"\\hat m"}</Tex> et se fait diviser par <Tex>{"\\sqrt{\\hat v}"}</Tex> comme le reste. Les poids dont
          les gradients sont grands sont donc moins régularisés que les autres. Loshchilov et Hutter proposent{" "}
          <strong>AdamW</strong> : on retire la pénalité du gradient et on applique la décroissance à part, sur tous
          les poids au même taux (algorithme 2, ligne 12) :
        </p>
        <Tex block>{"w_t = w_{t-1} - \\eta_t\\left(\\alpha\\, \\frac{\\hat m_t}{\\sqrt{\\hat v_t} + \\epsilon} + \\lambda\\, w_{t-1}\\right)"}</Tex>
        <p>
          Ici <Tex>\alpha</Tex> est le pas et <Tex>{"\\eta_t"}</Tex> un multiplicateur de calendrier (1 si le pas est
          fixe). Dans PyTorch, <code>AdamW</code> multiplie la décroissance par le pas : chaque pas fait{" "}
          <Tex>{"w \\leftarrow (1 - \\text{lr} \\cdot \\text{wd})\\,w"}</Tex>, avec <code>weight_decay</code> à 0,01
          par défaut. Pour isoler l'effet, on donne à deux poids des gradients de signe alterné, de moyenne nulle,
          l'un de taille 10 et l'autre de taille 0,01 :
        </p>
        <pre>
          <code>{`import torch

scale = torch.tensor([10.0, 0.01])     # w[0] reçoit de gros gradients, w[1] de petits

def run(opt_cls):
    w = torch.ones(2, requires_grad=True)
    opt = opt_cls([w], lr=0.01, weight_decay=0.1)
    for t in range(1000):
        w.grad = (-1) ** t * scale     # gradient de la perte : signe alterné, moyenne nulle
        opt.step()                     # Adam y ajoute 0.1 * w ; AdamW fait w -= lr * 0.1 * w à part
    return w.detach().numpy().round(3)

print("Adam + L2 :", run(torch.optim.Adam))
print("AdamW     :", run(torch.optim.AdamW))
print("(1 - lr * wd)^1000 =", round((1 - 0.01 * 0.1) ** 1000, 3))
# Adam + L2 : [0.889 0.   ]
# AdamW     : [0.361 0.361]
# (1 - lr * wd)^1000 = 0.368`}</code>
        </pre>
        <p>
          Avec la pénalité L2 dans Adam, le poids aux gros gradients garde presque toute sa valeur et l'autre est
          écrasé à 0 : la régularisation dépend de la taille des gradients. Avec AdamW, les deux décroissent de la
          même façon, proche de <Tex>{"(1 - \\text{lr} \\cdot \\text{wd})^{1000}"}</Tex>.
        </p>
        <p>
          Le momentum, Adam et AdamW donnent des méthodes qui marchent sans hessienne, mais leurs garanties restent
          celles des quadratiques et des fonctions convexes. Le chapitre suivant fait de la convexité un objet d'étude
          à part entière.
        </p>
      </section>
    </LessonFlow>
  );
}
