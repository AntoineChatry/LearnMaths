import { LessonFlow } from "../../components/LessonFlow";
import { Tex } from "../../components/Tex";
import { InverseViz } from "./InverseViz";

export function LoisContinuesLesson() {
  return (
    <LessonFlow>
      <section className="section">
        <span className="section-num">1</span>
        <h2>Densité : quand chaque valeur a une probabilité nulle</h2>
        <p>
          Un temps d'attente, une taille, un poids de réseau : ces variables prennent leurs valeurs dans un intervalle
          de réels, et la probabilité d'une valeur exacte est nulle. On décrit alors la loi par une{" "}
          <strong>densité</strong> <Tex>f</Tex>, positive et d'intégrale 1, qui donne la probabilité des intervalles
          (Grinstead et Snell, définition 2.1 ; MML, définition 6.1 et équation 6.16) :
        </p>
        <Tex block>{"P(a \\le X \\le b) = \\int_a^b f(x)\\, dx \\qquad\\qquad \\int_{-\\infty}^{+\\infty} f(x)\\, dx = 1"}</Tex>
        <p>
          MML le souligne : <Tex>{"P(X = x)"}</Tex> vaut 0, comme un intervalle avec <Tex>{"a = b"}</Tex>. Du coup,
          inclure ou non les bornes ne change rien. Une densité n'est <strong>pas</strong> une probabilité et peut
          dépasser 1 : la loi uniforme sur <Tex>{"[0, \\frac12]"}</Tex> a pour densité 2 sur cet intervalle. Ce qui
          compte est l'aire : <Tex>{"f(x)\\,dx"}</Tex> est la probabilité de tomber dans un petit intervalle de
          longueur <Tex>{"dx"}</Tex> autour de <Tex>x</Tex>.
        </p>
        <p>
          La <strong>fonction de répartition</strong> <Tex>{"F(x) = P(X \\le x)"}</Tex> est l'intégrale de la
          densité, et la densité est sa dérivée (Grinstead et Snell, définition 2.2 et théorème 2.1) :{" "}
          <Tex>{"F(x) = \\int_{-\\infty}^x f(t)\\, dt"}</Tex> et <Tex>{"F'(x) = f(x)"}</Tex>. Deux lois reviennent
          partout (section 5.2) :
        </p>
        <ul>
          <li>
            <strong>Uniforme</strong> sur <Tex>{"[a, b]"}</Tex> : densité <Tex>{"1/(b - a)"}</Tex> sur l'intervalle, 0
            ailleurs. C'est ce que renvoie <code>rng.random()</code> sur <Tex>{"[0, 1]"}</Tex>.
          </li>
          <li>
            <strong>Exponentielle</strong> de paramètre <Tex>{"\\lambda > 0"}</Tex> : densité{" "}
            <Tex>{"\\lambda e^{-\\lambda x}"}</Tex> pour <Tex>{"x \\ge 0"}</Tex>. Elle modélise le temps entre deux
            événements qui arrivent au hasard : désintégrations, requêtes, pannes (exemple 2.17). On intègre :{" "}
            <Tex>{"P(X > t) = e^{-\\lambda t}"}</Tex>, et <Tex>{"F(t) = 1 - e^{-\\lambda t}"}</Tex>.
          </li>
        </ul>
        <p>
          L'exponentielle est la version continue de la loi géométrique, et elle aussi est <strong>sans mémoire</strong>{" "}
          (exemple 4.20) : <Tex>{"P(X > r + s \\mid X > r) = e^{-\\lambda(r + s)} / e^{-\\lambda r} = e^{-\\lambda s}"}</Tex>.
          Grinstead et Snell précisent que c'est la seule densité continue qui ait cette propriété (exemple 2.17).
        </p>
      </section>

      <section className="section">
        <span className="section-num">2</span>
        <h2>Espérance et variance : les sommes deviennent des intégrales</h2>
        <p>
          Tout le chapitre 4 se transpose en remplaçant la somme pondérée par une intégrale pondérée par la densité
          (Grinstead et Snell, définitions 6.4 et 6.5 ; MML, définition 6.3) :
        </p>
        <Tex block>{"E(X) = \\int x\\, f(x)\\, dx \\qquad E(g(X)) = \\int g(x)\\, f(x)\\, dx"}</Tex>
        <Tex block>{"V(X) = E\\big((X - \\mu)^2\\big) = E(X^2) - E(X)^2"}</Tex>
        <p>
          La linéarité, <Tex>{"V(cX + b) = c^2 V(X)"}</Tex> et l'additivité des variances de variables indépendantes
          restent vraies (théorèmes 6.10 à 6.16). Pour la loi <strong>uniforme</strong> sur <Tex>{"[a, b]"}</Tex>,
          l'espérance est le milieu <Tex>{"(a + b)/2"}</Tex> et la variance vaut <Tex>{"(b - a)^2 / 12"}</Tex> (1/12
          sur <Tex>{"[0, 1]"}</Tex>, exemple 6.25). En particulier, sur un intervalle symétrique :
        </p>
        <Tex block>{"W \\sim U[-a, a] \\quad\\Longrightarrow\\quad V(W) = \\int_{-a}^{a} \\frac{w^2}{2a}\\, dw = \\frac{a^2}{3}"}</Tex>
        <p>
          Cette formule servira à la section 4. Pour l'<strong>exponentielle</strong>, une intégration par parties
          donne <Tex>{"E(X) = 1/\\lambda"}</Tex> et <Tex>{"V(X) = 1/\\lambda^2"}</Tex> (exemple 6.26) : si un serveur
          reçoit en moyenne 2 requêtes par seconde, l'attente moyenne entre deux requêtes est d'une demi-seconde.
          L'intégrale doit converger absolument. La densité de Cauchy,{" "}
          <Tex>{"\\frac{1}{\\pi(1 + x^2)}"}</Tex>, est symétrique autour de 0 et n'a pourtant pas d'espérance, car{" "}
          <Tex>{"\\int |x| f(x)\\, dx"}</Tex> diverge (exemple 6.28).
        </p>
      </section>

      <section className="section">
        <span className="section-num">3</span>
        <h2>Changement de variable et tirage par inversion</h2>
        <p>
          Si <Tex>X</Tex> a une densité connue, quelle est celle de <Tex>{"Y = \\varphi(X)"}</Tex> ? La méthode sûre
          passe par la fonction de répartition (MML, section 6.7.1) : on calcule <Tex>{"F_Y(y) = P(\\varphi(X) \\le y)"}</Tex>{" "}
          en se ramenant à un événement sur <Tex>X</Tex>, puis on dérive. Pour <Tex>\varphi</Tex> strictement
          croissante, <Tex>{"F_Y(y) = F_X(\\varphi^{-1}(y))"}</Tex> (Grinstead et Snell, théorème 5.1), et la dérivée
          d'une composée donne (MML, équation 6.143) :
        </p>
        <Tex block>{"f_Y(y) = f_X\\big(\\varphi^{-1}(y)\\big) \\cdot \\left| \\frac{d}{dy} \\varphi^{-1}(y) \\right|"}</Tex>
        <p>
          La valeur absolue couvre aussi le cas décroissant. Le facteur de dérivée corrige l'étirement : là où{" "}
          <Tex>\varphi</Tex> écarte les points, la même probabilité s'étale sur plus de place et la densité baisse.{" "}
          <strong>Exemple</strong> (MML, exemple 6.16) : <Tex>X</Tex> de densité <Tex>{"3x^2"}</Tex> sur{" "}
          <Tex>{"[0, 1]"}</Tex> et <Tex>{"Y = X^2"}</Tex>. Alors{" "}
          <Tex>{"F_Y(y) = P(X \\le \\sqrt y) = y^{3/2}"}</Tex>, d'où <Tex>{"f_Y(y) = \\frac32 y^{1/2}"}</Tex>. En
          dimension supérieure, la dérivée devient le déterminant de la jacobienne (théorème 6.16) : c'est le
          facteur de volume du chapitre Déterminant.
        </p>
        <p>
          <strong>Tirer selon n'importe quelle loi avec un uniforme.</strong> Si <Tex>{"F_X"}</Tex> est strictement
          croissante, <Tex>{"F_X(X)"}</Tex> suit la loi uniforme sur <Tex>{"[0, 1]"}</Tex> (MML, théorème 6.15, la
          transformation intégrale de probabilité). Dans l'autre sens, si <Tex>U</Tex> est uniforme, alors{" "}
          <Tex>{"F^{-1}(U)"}</Tex> suit la loi de fonction de répartition <Tex>F</Tex>, car{" "}
          <Tex>{"P(F^{-1}(U) \\le x) = P(U \\le F(x)) = F(x)"}</Tex>. C'est la version continue du découpage de{" "}
          <Tex>{"[0, 1]"}</Tex> du chapitre 3. Pour l'exponentielle,{" "}
          <Tex>{"u = 1 - e^{-\\lambda x}"}</Tex> se résout en <Tex>{"x = -\\ln(1 - u)/\\lambda"}</Tex> ; Grinstead et
          Snell (section 5.2) utilisent <Tex>{"-\\ln(u)/\\lambda"}</Tex>, qui a la même loi puisque{" "}
          <Tex>{"1 - U"}</Tex> est aussi uniforme.
        </p>
        <InverseViz />
        <pre>
          <code>{`import numpy as np

rng = np.random.default_rng(0)
lam = 2.0
u = rng.random(100_000)
x = -np.log(1 - u) / lam  # inversion de F(x) = 1 - e^(-lam x)
print(x.mean(), x.var())  # théorie : 1/lam = 0.5, 1/lam² = 0.25
print(np.mean(x > 1), np.exp(-lam))  # P(X > 1) = e^(-2)
# 0.4991349455458032 0.25029688560986
# 0.13337 0.1353352832366127`}</code>
        </pre>
      </section>

      <section className="section">
        <span className="section-num">4</span>
        <h2>Initialiser les poids d'un réseau au hasard</h2>
        <p>
          Avant l'entraînement, les poids d'un réseau sont tirés au hasard, et leur loi n'est pas un détail. Une
          couche calcule <Tex>{"y = \\sum_{i=1}^{n} w_i x_i"}</Tex> sur ses <Tex>n</Tex> entrées. Si les poids sont
          indépendants des entrées, indépendants entre eux et centrés, les règles du chapitre 4 donnent
        </p>
        <Tex block>{"V(y) = \\sum_{i=1}^n V(w_i x_i) = n\\, V(w)\\, E(x^2)"}</Tex>
        <p>
          À chaque couche, la moyenne des carrés du signal est multipliée par un facteur proportionnel à{" "}
          <Tex>{"n V(w)"}</Tex> : si ce facteur vaut 0,5, après 50 couches il reste <Tex>{"0{,}5^{50} \\approx 10^{-15}"}</Tex>{" "}
          ; s'il vaut 2, tout explose. Glorot et Bengio (2010, section 4.2.1) partent de l'initialisation courante de l'époque,{" "}
          <Tex>{"W_{ij} \\sim U[-1/\\sqrt n, 1/\\sqrt n]"}</Tex> (leur équation 1). La formule{" "}
          <Tex>{"a^2/3"}</Tex> donne <Tex>{"n V(W) = 1/3"}</Tex> (leur équation 15) : le signal rétrécit à chaque
          couche. Ils demandent <Tex>{"n V(W) = 1"}</Tex> en avant et en arrière (équations 10 et 11), et comme les
          couches voisines n'ont pas la même taille, ils prennent le compromis{" "}
          <Tex>{"V(W) = 2/(n_j + n_{j+1})"}</Tex> (équation 12), atteint avec la loi uniforme de leur équation 16 :
        </p>
        <Tex block>{"W \\sim U\\left[-\\frac{\\sqrt 6}{\\sqrt{n_j + n_{j+1}}},\\ \\frac{\\sqrt 6}{\\sqrt{n_j + n_{j+1}}}\\right]"}</Tex>
        <p>
          Leur analyse suppose des activations presque linéaires autour de 0. Avec la ReLU, qui annule la moitié
          négative, He et al. (2015, section 2.2) montrent que seule la moitié de la variance passe :{" "}
          <Tex>{"E(x^2) = V(y)/2"}</Tex> pour un <Tex>y</Tex> symétrique. Leur condition{" "}
          <Tex>{"\\frac12 n V(w) = 1"}</Tex> (équation 10) mène à une gaussienne centrée d'écart type{" "}
          <Tex>{"\\sqrt{2/n}"}</Tex>. La simulation propage 1000 vecteurs dans 50 couches de largeur 256 avec ReLU,
          et affiche la moyenne quadratique des activations après les couches 1, 10 et 50.
        </p>
        <pre>
          <code>{`import numpy as np

rng = np.random.default_rng(0)
n, L = 256, 50
x0 = rng.standard_normal((1000, n))
inits = {
    "N(0, 0.01^2)": lambda: rng.normal(0, 0.01, (n, n)),
    "U(-1/sqrt(n), 1/sqrt(n))": lambda: rng.uniform(
        -1 / n**0.5, 1 / n**0.5, (n, n)),
    "He N(0, 2/n)": lambda: rng.normal(0, (2 / n)**0.5, (n, n)),
}
for nom, tirer in inits.items():
    x, ecarts = x0, []
    for couche in range(1, L + 1):
        x = np.maximum(0, x @ tirer())  # couche linéaire + ReLU
        if couche in (1, 10, 50):
            ecarts.append(f"{np.sqrt(np.mean(x**2)):.2g}")
    print(nom, ecarts)
# N(0, 0.01^2) ['0.11', '3.7e-10', '5.9e-48']
# U(-1/sqrt(n), 1/sqrt(n)) ['0.41', '0.00012', '1.4e-20']
# He N(0, 2/n) ['1', '0.86', '0.74']`}</code>
        </pre>
        <p>
          Avec un écart type fixe de 0,01, le facteur par couche, en moyenne des carrés, est <Tex>{"\\frac12 \\times 256 \\times 10^{-4} \\approx 0{,}013"}</Tex>{" "}
          et le signal disparaît. L'uniforme en <Tex>{"1/\\sqrt n"}</Tex> perd un facteur 6 en variance à chaque
          couche (1/3 pour la loi, 1/2 pour la ReLU). L'initialisation de He garde la moyenne quadratique de l'ordre
          de 1 après 50 couches, ce qui laisse passer le signal et les gradients.
        </p>
      </section>
    </LessonFlow>
  );
}
