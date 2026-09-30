import { LessonFlow } from "../../components/LessonFlow";
import { Tex } from "../../components/Tex";
import { GradientDescentViz } from "./GradientDescentViz";
import { InverseViz } from "./InverseViz";
import { SigmoidViz } from "./SigmoidViz";

export function DerivationLesson() {
  return (
    <LessonFlow>
      <section className="section">
        <span className="section-num">1</span>
        <h2>La dérivée, enfin définie</h2>
        <p>
          En STI2D, le nombre dérivé était la pente limite des sécantes, sans définition précise de « limite ». Le
          chapitre sur les limites a comblé ce trou, on peut donc tout écrire proprement. On dit que{" "}
          <Tex>f</Tex> est <strong>dérivable en a</strong> si le taux de variation a une limite finie :
        </p>
        <Tex block>{"f'(a) = \\lim_{h \\to 0} \\frac{f(a+h) - f(a)}{h}"}</Tex>
        <p>
          C'est une forme <Tex>{"\\tfrac{0}{0}"}</Tex>, qu'on lève en simplifiant. Pour <Tex>{"f(x) = x^3"}</Tex> :
        </p>
        <Tex block>
          {"\\frac{(a+h)^3 - a^3}{h} = \\frac{3a^2h + 3ah^2 + h^3}{h} = 3a^2 + 3ah + h^2 \\xrightarrow[h \\to 0]{} 3a^2"}
        </Tex>
        <p>
          La limite peut ne pas exister. Pour <Tex>{"f(x) = |x|"}</Tex> en 0, le taux vaut{" "}
          <Tex>{"\\tfrac{|h|}{h}"}</Tex>, c'est-à-dire <Tex>1</Tex> si <Tex>{"h > 0"}</Tex> et <Tex>-1</Tex> si{" "}
          <Tex>{"h < 0"}</Tex>. Pas de limite, pas de dérivée : la courbe a un coin.
        </p>
        <h3>Dérivable implique continue</h3>
        <p>
          Continue en <Tex>a</Tex> veut dire <Tex>{"\\lim_{h \\to 0} f(a+h) = f(a)"}</Tex>. Si <Tex>f</Tex> est
          dérivable en <Tex>a</Tex>, il suffit d'écrire l'écart comme un taux multiplié par <Tex>h</Tex> :
        </p>
        <Tex block>
          {"f(a+h) - f(a) = h \\cdot \\frac{f(a+h) - f(a)}{h} \\xrightarrow[h \\to 0]{} 0 \\times f'(a) = 0"}
        </Tex>
        <p>
          La réciproque est fausse : <Tex>{"|x|"}</Tex> est continue en 0 sans y être dérivable. Garde ce petit
          résultat sous la main, il sert dès la section suivante.
        </p>
      </section>

      <section className="section">
        <span className="section-num">2</span>
        <h2>Produit, quotient, chaîne : les preuves</h2>
        <p>
          En STI2D, ces trois formules t'ont été données sans démonstration complète, la dernière en Terminale sous
          forme de recettes. Elles se prouvent chacune en quelques lignes.
        </p>
        <h3>Produit</h3>
        <p>
          L'astuce : ajouter et retirer <Tex>{"f(a)\\,g(a+h)"}</Tex> pour faire apparaître deux taux de variation.
        </p>
        <Tex block>
          {
            "\\begin{aligned} \\frac{f(a+h)g(a+h) - f(a)g(a)}{h} &= \\underbrace{\\frac{f(a+h) - f(a)}{h}}_{\\to f'(a)}\\,\\underbrace{g(a+h)}_{\\to g(a)} \\\\ &\\quad + f(a)\\,\\underbrace{\\frac{g(a+h) - g(a)}{h}}_{\\to g'(a)} \\end{aligned}"
          }
        </Tex>
        <p>
          Le <Tex>{"g(a+h) \\to g(a)"}</Tex> du milieu, c'est la continuité de <Tex>g</Tex>, garantie parce que{" "}
          <Tex>g</Tex> est dérivable. On obtient <Tex>{"(fg)' = f'g + fg'"}</Tex>.
        </p>
        <h3>Quotient</h3>
        <p>
          Commence par <Tex>{"\\tfrac{1}{g}"}</Tex>, avec <Tex>{"g(a) \\neq 0"}</Tex> :
        </p>
        <Tex block>
          {
            "\\frac{1}{h}\\left(\\frac{1}{g(a+h)} - \\frac{1}{g(a)}\\right) = -\\frac{g(a+h) - g(a)}{h} \\cdot \\frac{1}{g(a+h)\\,g(a)} \\xrightarrow[h \\to 0]{} -\\frac{g'(a)}{g(a)^2}"
          }
        </Tex>
        <p>
          Puis <Tex>{"\\tfrac{f}{g} = f \\cdot \\tfrac{1}{g}"}</Tex> et la règle du produit donnent{" "}
          <Tex>{"\\left(\\tfrac{f}{g}\\right)' = \\tfrac{f'g - fg'}{g^2}"}</Tex>.
        </p>
        <p>
          Première application : la tangente, <Tex>{"\\tan x = \\tfrac{\\sin x}{\\cos x}"}</Tex>, définie dès que{" "}
          <Tex>{"\\cos x \\neq 0"}</Tex>, c'est-à-dire pour <Tex>{"x \\neq \\tfrac{\\pi}{2} + k\\pi"}</Tex>.
        </p>
        <Tex block>
          {
            "\\tan'(x) = \\frac{\\cos x \\cos x - \\sin x\\,(-\\sin x)}{\\cos^2 x} = \\frac{1}{\\cos^2 x} = 1 + \\tan^2 x"
          }
        </Tex>
        <p>
          Les deux formes sont utiles : la première vient de <Tex>{"\\cos^2 + \\sin^2 = 1"}</Tex>, la seconde de la
          division terme à terme. La dérivée est toujours positive : <Tex>{"\\tan"}</Tex> est strictement croissante
          sur chaque intervalle <Tex>{"\\left]-\\tfrac{\\pi}{2} + k\\pi, \\tfrac{\\pi}{2} + k\\pi\\right["}</Tex>, et
          elle y va de <Tex>{"-\\infty"}</Tex> à <Tex>{"+\\infty"}</Tex>.
        </p>
        <h3>Chaîne</h3>
        <p>
          En Terminale, tu as appliqué <Tex>{"(e^u)' = u'e^u"}</Tex>, <Tex>{"(\\ln u)' = \\tfrac{u'}{u}"}</Tex>… Ce
          sont tous des cas de la même règle :
        </p>
        <Tex block>{"(g \\circ u)'(a) = g'\\big(u(a)\\big) \\cdot u'(a)"}</Tex>
        <p>
          L'intuition, ce sont des taux qui se multiplient. Si <Tex>u</Tex> bouge 3 fois plus vite que{" "}
          <Tex>x</Tex>, et <Tex>g</Tex> 2 fois plus vite que <Tex>u</Tex>, alors <Tex>{"g(u(x))"}</Tex> bouge 6 fois
          plus vite que <Tex>x</Tex>. La preuve suit exactement cette idée :
        </p>
        <Tex block>
          {
            "\\frac{g(u(a+h)) - g(u(a))}{h} = \\underbrace{\\frac{g(u(a+h)) - g(u(a))}{u(a+h) - u(a)}}_{\\to g'(u(a))} \\cdot \\underbrace{\\frac{u(a+h) - u(a)}{h}}_{\\to u'(a)}"
          }
        </Tex>
        <p>
          Le premier facteur tend vers <Tex>{"g'(u(a))"}</Tex> parce que <Tex>{"u(a+h) \\to u(a)"}</Tex>, encore la
          continuité. Une honnêteté : cette écriture suppose <Tex>{"u(a+h) \\neq u(a)"}</Tex> pour <Tex>h</Tex> petit
          non nul. Le cas où <Tex>u</Tex> reprend sa valeur une infinité de fois près de <Tex>a</Tex> demande une
          petite rustine technique, mais le résultat reste vrai.
        </p>
        <div className="aside-cs">
          <p className="aside-cs-title">Le moteur de la rétropropagation</p>
          <p>
            Dans la vidéo de CS221 sur la régression linéaire, le gradient de <Tex>{"\\text{TrainLoss}(w)"}</Tex> est
            calculé « avec la règle de la chaîne » sur la perte <Tex>{"(w \\cdot \\phi(x) - y)^2"}</Tex>, ce qui
            donne <Tex>{"2(w \\cdot \\phi(x) - y)\\,\\phi(x)"}</Tex>. La vidéo
            suivante de ta playlist, « Apprentissage automatique 9 - Rétropropagation », automatise exactement ça : un
            réseau de neurones est une longue composée de fonctions simples, et sa dérivée est le produit des
            dérivées locales le long du calcul. Tu arriveras là-bas en connaissant déjà la règle.
          </p>
        </div>
      </section>

      <section className="section">
        <span className="section-num">3</span>
        <h2>Inverser sin : il faut d'abord couper</h2>
        <p>
          Tu as vu les fonctions réciproques en précalcul : le graphe de <Tex>{"f^{-1}"}</Tex> est le symétrique de
          celui de <Tex>f</Tex> par rapport à la droite <Tex>{"y = x"}</Tex>. Pour que <Tex>{"f^{-1}"}</Tex> existe,
          il faut que <Tex>f</Tex> soit injective : chaque valeur doit être atteinte au plus une fois (aucune droite
          horizontale ne coupe la courbe deux fois).
        </p>
        <p>
          Problème : <Tex>{"\\sin"}</Tex> n'est pas injective. L'équation <Tex>{"\\sin t = \\tfrac12"}</Tex> a une
          infinité de solutions, donc « l'angle dont le sinus vaut <Tex>{"\\tfrac12"}</Tex> » ne désigne pas un seul
          nombre. Décoche la case ci-dessous : le symétrique de la courbe de <Tex>{"\\sin"}</Tex> échoue au test de
          la droite verticale.
        </p>
        <InverseViz />
        <p>
          La solution est de ne garder qu'un morceau où la fonction est strictement monotone et prend chaque valeur
          une seule fois. Pour <Tex>{"\\sin"}</Tex>, le choix standard est <Tex>{"[-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2}]"}</Tex>{" "}
          : elle y croît de <Tex>-1</Tex> à <Tex>1</Tex>. On obtient trois nouvelles fonctions.
        </p>
        <table className="value-table">
          <thead>
            <tr>
              <th>réciproque</th>
              <th>on a restreint</th>
              <th>définie sur</th>
              <th>à valeurs dans</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Tex>{"\\arcsin"}</Tex>
              </td>
              <td>
                <Tex>{"\\sin"}</Tex> à <Tex>{"[-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2}]"}</Tex>
              </td>
              <td>
                <Tex>{"[-1, 1]"}</Tex>
              </td>
              <td>
                <Tex>{"[-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2}]"}</Tex>
              </td>
            </tr>
            <tr>
              <td>
                <Tex>{"\\arccos"}</Tex>
              </td>
              <td>
                <Tex>{"\\cos"}</Tex> à <Tex>{"[0, \\pi]"}</Tex>
              </td>
              <td>
                <Tex>{"[-1, 1]"}</Tex>
              </td>
              <td>
                <Tex>{"[0, \\pi]"}</Tex>
              </td>
            </tr>
            <tr>
              <td>
                <Tex>{"\\arctan"}</Tex>
              </td>
              <td>
                <Tex>{"\\tan"}</Tex> à <Tex>{"]-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2}["}</Tex>
              </td>
              <td>
                <Tex>{"\\mathbb{R}"}</Tex>
              </td>
              <td>
                <Tex>{"]-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2}["}</Tex>
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          Pour <Tex>{"\\cos"}</Tex>, on prend <Tex>{"[0, \\pi]"}</Tex> parce que c'est là qu'elle est strictement
          décroissante de <Tex>1</Tex> à <Tex>-1</Tex>. Et comme <Tex>{"\\tan"}</Tex> a des asymptotes verticales en{" "}
          <Tex>{"\\pm\\tfrac{\\pi}{2}"}</Tex>, <Tex>{"\\arctan"}</Tex> a des asymptotes horizontales :
        </p>
        <Tex block>{"\\lim_{x \\to +\\infty} \\arctan x = \\frac{\\pi}{2} \\qquad \\lim_{x \\to -\\infty} \\arctan x = -\\frac{\\pi}{2}"}</Tex>
        <p>
          Lire <Tex>{"\\arcsin\\left(\\tfrac{\\sqrt3}{2}\\right)"}</Tex>, c'est chercher sur le cercle unité l'angle
          de <Tex>{"[-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2}]"}</Tex> dont le sinus vaut <Tex>{"\\tfrac{\\sqrt3}{2}"}</Tex>{" "}
          : c'est <Tex>{"\\tfrac{\\pi}{3}"}</Tex>. De même <Tex>{"\\arccos(-\\tfrac12) = \\tfrac{2\\pi}{3}"}</Tex> et{" "}
          <Tex>{"\\arctan 1 = \\tfrac{\\pi}{4}"}</Tex>.
        </p>
        <h3>Le piège</h3>
        <p>
          <Tex>{"\\sin(\\arcsin x) = x"}</Tex> pour tout <Tex>{"x \\in [-1, 1]"}</Tex>. Mais{" "}
          <Tex>{"\\arcsin(\\sin \\theta) = \\theta"}</Tex> seulement si <Tex>{"\\theta \\in [-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2}]"}</Tex>,
          puisque <Tex>{"\\arcsin"}</Tex> ne sait renvoyer que des angles de cet intervalle. Par exemple{" "}
          <Tex>{"\\arcsin(\\sin 3) = \\pi - 3 \\approx 0{,}14"}</Tex>, car <Tex>{"\\sin(\\pi - 3) = \\sin 3"}</Tex> et{" "}
          <Tex>{"\\pi - 3"}</Tex> est dans le bon intervalle.
        </p>
      </section>

      <section className="section">
        <span className="section-num">4</span>
        <h2>Dériver une réciproque</h2>
        <p>
          La symétrie par rapport à <Tex>{"y = x"}</Tex> échange les rôles de <Tex>x</Tex> et <Tex>y</Tex>. Une
          droite qui monte de <Tex>m</Tex> quand on avance de 1 devient une droite qui monte de 1 quand on avance
          de <Tex>m</Tex> : sa pente passe de <Tex>m</Tex> à <Tex>{"\\tfrac{1}{m}"}</Tex>. Les tangentes suivent
          le même chemin. Déplace le point :
        </p>
        <InverseViz showTangents />
        <p>
          Algébriquement, pour <Tex>b</Tex> tel que <Tex>{"b = f(a)"}</Tex> et <Tex>{"f'(a) \\neq 0"}</Tex>, on
          admet que <Tex>{"f^{-1}"}</Tex> est dérivable en <Tex>b</Tex> (c'est un théorème), et la règle de la
          chaîne appliquée à <Tex>{"f\\big(f^{-1}(y)\\big) = y"}</Tex> donne la formule :
        </p>
        <Tex block>
          {"f'\\big(f^{-1}(y)\\big) \\cdot (f^{-1})'(y) = 1 \\quad\\Longrightarrow\\quad (f^{-1})'(y) = \\frac{1}{f'\\big(f^{-1}(y)\\big)}"}
        </Tex>
        <p>
          Si <Tex>{"f'(a) = 0"}</Tex>, la tangente de <Tex>f</Tex> est horizontale, celle de <Tex>{"f^{-1}"}</Tex>{" "}
          est verticale, et <Tex>{"f^{-1}"}</Tex> n'est pas dérivable en <Tex>b</Tex>. C'est ce qui arrive à{" "}
          <Tex>{"\\arcsin"}</Tex> en <Tex>{"\\pm 1"}</Tex> : pousse le point au bout de la branche de sin.
        </p>
        <h3>arctan</h3>
        <p>
          Avec <Tex>{"\\tan' = 1 + \\tan^2"}</Tex> et <Tex>{"\\tan(\\arctan y) = y"}</Tex> :
        </p>
        <Tex block>{"\\arctan'(y) = \\frac{1}{1 + \\tan^2(\\arctan y)} = \\frac{1}{1 + y^2}"}</Tex>
        <h3>arcsin et arccos</h3>
        <p>
          Avec <Tex>{"\\sin' = \\cos"}</Tex>, il faut <Tex>{"\\cos(\\arcsin y)"}</Tex>. On sait que{" "}
          <Tex>{"\\cos^2 = 1 - \\sin^2 = 1 - y^2"}</Tex>, et le signe est fixé par la restriction : sur{" "}
          <Tex>{"[-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2}]"}</Tex>, le cosinus est positif. Donc, pour{" "}
          <Tex>{"y \\in\\ ]-1, 1["}</Tex> :
        </p>
        <Tex block>{"\\arcsin'(y) = \\frac{1}{\\sqrt{1 - y^2}} \\qquad \\arccos'(y) = -\\frac{1}{\\sqrt{1 - y^2}}"}</Tex>
        <p>
          Pour <Tex>{"\\arccos"}</Tex>, même calcul avec <Tex>{"\\cos' = -\\sin"}</Tex> et <Tex>{"\\sin \\geq 0"}</Tex>{" "}
          sur <Tex>{"[0, \\pi]"}</Tex>. Les deux dérivées sont opposées, donc <Tex>{"\\arcsin + \\arccos"}</Tex> est
          constante. En 0 elle vaut <Tex>{"0 + \\tfrac{\\pi}{2}"}</Tex>, d'où{" "}
          <Tex>{"\\arcsin y + \\arccos y = \\tfrac{\\pi}{2}"}</Tex>.
        </p>
        <p>
          Remarque le résultat : les fonctions trigonométriques réciproques sont « compliquées », mais leurs
          dérivées sont de simples fractions et racines. C'est ce qui les rendra précieuses au chapitre sur
          l'intégration.
        </p>
      </section>

      <section className="section">
        <span className="section-num">5</span>
        <h2>Sigmoïde et arctan, deux S cousins</h2>
        <div className="aside-cs">
          <p className="aside-cs-title">Tu l'as déjà vu en CS221</p>
          <p>
            Dans la vidéo sur les réseaux de neurones, la fonction seuil <Tex>{"\\mathbf{1}[z \\geq 0]"}</Tex> a une
            dérivée nulle partout où elle existe, donc la descente de gradient ne peut rien en tirer. On la remplace
            par une activation à dérivée non nulle : classiquement la fonction logistique{" "}
            <Tex>{"\\sigma(z) = \\frac{1}{1 + e^{-z}}"}</Tex>, et aujourd'hui plutôt ReLU,{" "}
            <Tex>{"\\max(z, 0)"}</Tex>. Les slides notent aussi que la dérivée de <Tex>{"\\sigma"}</Tex> devient
            minuscule quand <Tex>{"|z|"}</Tex> est grand : c'est la saturation.
          </p>
        </div>
        <p>
          Dérivons <Tex>{"\\sigma(z) = (1 + e^{-z})^{-1}"}</Tex> avec la règle de la chaîne :
        </p>
        <Tex block>
          {
            "\\sigma'(z) = \\frac{e^{-z}}{(1 + e^{-z})^2} = \\underbrace{\\frac{1}{1 + e^{-z}}}_{\\sigma(z)} \\cdot \\underbrace{\\frac{e^{-z}}{1 + e^{-z}}}_{1 - \\sigma(z)} = \\sigma(z)\\big(1 - \\sigma(z)\\big)"
          }
        </Tex>
        <p>
          Pratique : la dérivée se calcule à partir de la valeur déjà obtenue, sans nouvelle exponentielle. Avec{" "}
          <Tex>{"p = \\sigma(z)"}</Tex>, on a <Tex>{"p(1 - p) = \\tfrac14 - (p - \\tfrac12)^2 \\leq \\tfrac14"}</Tex>{" "}
          : la pente maximale vaut <Tex>{"\\sigma'(0) = \\tfrac14"}</Tex>. Vérification par différences finies :
        </p>
        <pre>
          <code>{`import math

def sigma(z):
    return 1 / (1 + math.exp(-z))

h = 1e-6
for z in [0, 2, 10]:
    pente = (sigma(z + h) - sigma(z - h)) / (2 * h)
    print(z, pente, sigma(z) * (1 - sigma(z)))

# 0 0.2500000000349445 0.25
# 2 0.10499358538140768 0.10499358540350662
# 10 4.539574272044433e-05 4.5395807735907655e-05`}</code>
        </pre>
        <p>
          En <Tex>{"z = 10"}</Tex>, la pente est plus de 5 000 fois plus petite qu'en 0 : voilà la saturation en
          chiffres.
        </p>
        <h3>arctan, normalisée</h3>
        <p>
          <Tex>{"\\arctan"}</Tex> a aussi une forme en S, entre <Tex>{"-\\tfrac{\\pi}{2}"}</Tex> et{" "}
          <Tex>{"\\tfrac{\\pi}{2}"}</Tex>. Divise par <Tex>{"\\pi"}</Tex> et ajoute <Tex>{"\\tfrac12"}</Tex> : tu
          obtiens une fonction qui va de 0 à 1, vaut <Tex>{"\\tfrac12"}</Tex> en 0 et vérifie la même symétrie que la
          sigmoïde, <Tex>{"s(-z) = 1 - s(z)"}</Tex>.
        </p>
        <Tex block>{"s(z) = \\frac12 + \\frac{\\arctan z}{\\pi} \\qquad s'(z) = \\frac{1}{\\pi(1 + z^2)} \\qquad s'(0) = \\frac{1}{\\pi} \\approx 0{,}318"}</Tex>
        <p>
          En comprimant l'axe avec <Tex>{"s_k(z) = s(kz)"}</Tex>, on peut régler la pente en 0. Trouve le{" "}
          <Tex>k</Tex> qui l'aligne sur celle de la sigmoïde, puis regarde les bords :
        </p>
        <SigmoidViz />
        <p>
          Même centre, même pente, mais les queues n'ont rien à voir. Celle de la sigmoïde est exponentielle,{" "}
          <Tex>{"1 - \\sigma(z) = \\frac{1}{1 + e^{z}} < e^{-z}"}</Tex>. Celle de l'arctangente est en{" "}
          <Tex>{"\\tfrac1z"}</Tex> : pour <Tex>{"z > 0"}</Tex>, <Tex>{"\\arctan z + \\arctan \\tfrac1z = \\tfrac{\\pi}{2}"}</Tex>{" "}
          (les deux angles aigus d'un triangle rectangle de côtés 1 et <Tex>z</Tex>), donc
        </p>
        <Tex block>{"1 - s(z) = \\frac{1}{\\pi}\\arctan\\frac{1}{z} \\approx \\frac{1}{\\pi z}"}</Tex>
        <p>
          En <Tex>{"z = 10"}</Tex> : <Tex>{"1 - \\sigma(10) \\approx 4{,}5 \\times 10^{-5}"}</Tex> contre{" "}
          <Tex>{"1 - s(10) \\approx 0{,}032"}</Tex>. L'arctangente sature beaucoup plus lentement : sa pente décroît
          en <Tex>{"\\tfrac{1}{z^2}"}</Tex>, pas exponentiellement.
        </p>
      </section>

      <section className="section">
        <span className="section-num">6</span>
        <h2>La descente de gradient en une dimension</h2>
        <div className="aside-cs">
          <p className="aside-cs-title">Tu l'as déjà vu en CS221</p>
          <p>
            Dans la vidéo sur la régression linéaire, la mise à jour s'écrit{" "}
            <Tex>{"w \\leftarrow w - \\eta\\, \\nabla_w \\text{TrainLoss}(w)"}</Tex>, où <Tex>{"\\eta"}</Tex> est le
            pas (<em>step size</em>). Dans celle sur la descente de gradient stochastique, le choix de{" "}
            <Tex>{"\\eta"}</Tex> est présenté comme un compromis : petit, c'est prudent et stable ; grand, c'est
            agressif et plus rapide. Voyons exactement où est la limite.
          </p>
        </div>
        <p>
          Avec une seule variable, le gradient est la dérivée et la règle devient{" "}
          <Tex>{"x \\leftarrow x - \\eta f'(x)"}</Tex>. Pourquoi ça descend : près de <Tex>x</Tex>, la courbe se
          confond avec sa tangente, <Tex>{"f(x + d) \\approx f(x) + f'(x)\\,d"}</Tex>. Avec{" "}
          <Tex>{"d = -\\eta f'(x)"}</Tex> :
        </p>
        <Tex block>{"f\\big(x - \\eta f'(x)\\big) \\approx f(x) - \\eta\\, f'(x)^2 \\leq f(x)"}</Tex>
        <p>
          Le mot important est « près » : l'approximation n'est bonne que si le pas est petit. Sur{" "}
          <Tex>{"f(x) = x^2"}</Tex>, on peut tout calculer. <Tex>{"f'(x) = 2x"}</Tex>, donc
        </p>
        <Tex block>{"x_{k+1} = x_k - 2\\eta\\, x_k = (1 - 2\\eta)\\,x_k \\qquad\\Longrightarrow\\qquad x_k = (1 - 2\\eta)^k\\, x_0"}</Tex>
        <p>
          Une suite géométrique ! Elle tend vers le minimum 0 si et seulement si <Tex>{"|1 - 2\\eta| < 1"}</Tex>,
          c'est-à-dire <Tex>{"0 < \\eta < 1"}</Tex>. Pour <Tex>{"\\eta = 0{,}75"}</Tex>, la raison vaut{" "}
          <Tex>{"-\\tfrac12"}</Tex> : ça converge en zigzag.
        </p>
        <pre>
          <code>{`x = 3.0
eta = 0.75
for k in range(1, 7):
    x = x - eta * 2 * x    # f(x) = x², f'(x) = 2x
    print(k, x)

# 1 -1.5
# 2 0.75
# 3 -0.375
# 4 0.1875
# 5 -0.09375
# 6 0.046875`}</code>
        </pre>
        <p>
          Règle le pas et déplace le point de départ. Passe par <Tex>{"\\eta = 0{,}5"}</Tex>, puis{" "}
          <Tex>{"\\eta = 1"}</Tex>, puis au-delà :
        </p>
        <GradientDescentViz />
        <p>
          Sur une parabole plus serrée, <Tex>{"f(x) = a x^2"}</Tex>, le même calcul donne la raison{" "}
          <Tex>{"1 - 2a\\eta"}</Tex> et la condition <Tex>{"0 < \\eta < \\tfrac1a"}</Tex>. Plus la vallée est
          étroite, plus le pas doit être petit : c'est la courbure qui fixe la limite, et c'est pour ça qu'aucun{" "}
          <Tex>{"\\eta"}</Tex> ne marche partout.
        </p>
      </section>
    </LessonFlow>
  );
}
