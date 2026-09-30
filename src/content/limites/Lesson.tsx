import { LessonFlow } from "../../components/LessonFlow";
import { Tex } from "../../components/Tex";
import { EpsilonDeltaViz } from "./EpsilonDeltaViz";
import { GrowthViz } from "./GrowthViz";
import { HoleViz } from "./HoleViz";

export function LimitesLesson() {
  return (
    <LessonFlow>
      <section className="section">
        <span className="section-num">1</span>
        <h2>S'approcher sans jamais toucher</h2>
        <p>
          En STI2D, la limite servait surtout d'outil pour définir le nombre dérivé, sans qu'on la regarde vraiment en
          face. Prenons une fonction qui n'existe pas en un point :
        </p>
        <Tex block>{"f(x) = \\frac{x^2 - 1}{x - 1}"}</Tex>
        <p>
          En <Tex>{"x = 1"}</Tex>, le dénominateur vaut zéro : <Tex>{"f(1)"}</Tex> n'existe pas. Ton interpréteur Python
          est d'accord :
        </p>
        <pre>
          <code>{`def f(x):
    return (x**2 - 1) / (x - 1)

f(1)        # ZeroDivisionError
f(1.0001)   # ≈ 2.0001`}</code>
        </pre>
        <p>
          Fais glisser le point rouge posé sur l'axe des abscisses, puis utilise le bouton pour diviser par 10 la distance
          entre x et 1. Aussi près que tu ailles, <Tex>{"f(x)"}</Tex> se colle à 2, et pourtant la courbe a un trou
          exactement là.
        </p>
        <HoleViz />
        <p>
          C'est exactement ce que dit la notation <Tex>{"\\lim_{x \\to 1} f(x) = 2"}</Tex> : la limite parle de ce qui
          se passe <em>autour</em> de 1, jamais <em>en</em> 1. D'ailleurs, pour <Tex>{"x \\neq 1"}</Tex>, on peut
          simplifier :
        </p>
        <Tex block>{"\\frac{x^2-1}{x-1} = \\frac{(x-1)(x+1)}{x-1} = x + 1 \\xrightarrow[x \\to 1]{} 2"}</Tex>
        <p>
          Tu as déjà fait ça sans le savoir : le nombre dérivé, c'est la limite d'un taux de variation, une fraction
          en <Tex>{"\\tfrac{0}{0}"}</Tex> au point visé, comme celle-ci.
        </p>
      </section>

      <section className="section">
        <span className="section-num">2</span>
        <h2>La définition ε-δ est un jeu à deux</h2>
        <p>
          « Se coller à 2 » n'est pas une définition : on ne sait pas « à quel point » ça doit se coller. La version
          rigoureuse, due à Weierstrass, tient en une phrase :
        </p>
        <Tex block>
          {
            "\\begin{gathered}\\lim_{x \\to a} f(x) = L \\\\ \\Updownarrow \\\\ \\forall \\varepsilon > 0,\\ \\exists \\delta > 0,\\ \\forall x,\\quad 0 < |x - a| < \\delta \\implies |f(x) - L| < \\varepsilon\\end{gathered}"
          }
        </Tex>
        <div className="aside-cs">
          <p className="aside-cs-title">En Python</p>
          <p>
            <Tex>{"\\forall"}</Tex> se lit <code>all()</code> et <Tex>{"\\exists"}</Tex> se lit <code>any()</code>.
            L'ordre compte, comme l'imbrication de deux boucles :
          </p>
          <pre>
            <code>{`all(                                    # pour tout ε…
    any(                                # …il existe un δ…
        all(abs(f(x) - L) < eps         # …tel que tout x proche de a
            for x in near(a, delta))    #    donne f(x) proche de L
        for delta in deltas)
    for eps in epsilons)`}</code>
          </pre>
          <p>
            Vu comme un jeu : l'adversaire joue d'abord un ε aussi petit qu'il veut, tu réponds avec un δ. La limite
            vaut <Tex>L</Tex> si et seulement si tu as une <strong>stratégie gagnante</strong> quel que soit ε.
          </p>
        </div>
        <p>
          Ici <Tex>{"f(x) = \\tfrac{1}{2}x^2 + 1"}</Tex>, <Tex>{"a = 2"}</Tex> et <Tex>{"L = 3"}</Tex>. La bande jaune
          est celle de l'adversaire, la zone bleue est ta fenêtre. Gagne quelques manches.
        </p>
        <EpsilonDeltaViz />
        <p>
          Tu remarques qu'à chaque fois que ε est divisé par 2, il suffit à peu près de diviser δ par 2. C'est normal :
          près de <Tex>{"a = 2"}</Tex>, la courbe ressemble à une droite de pente <Tex>{"f'(2) = 2"}</Tex>. Mais « à
          peu près » ne suffit pas pour une preuve, car <Tex>{"\\delta = \\varepsilon/2"}</Tex> tout juste échoue de
          peu. Une stratégie qui gagne à tous les coups :
        </p>
        <Tex block>
          {
            "\\begin{gathered} \\delta = \\min\\left(1,\\ \\tfrac{2\\varepsilon}{5}\\right) \\quad\\text{car} \\\\[1ex] |x-2| < \\delta \\le 1 \\implies |f(x) - 3| = \\frac{|x-2|\\,|x+2|}{2} < \\frac{5\\delta}{2} \\le \\varepsilon \\end{gathered}"
          }
        </Tex>
        <p>
          Ta stratégie gagnante est une formule qui donne δ en fonction de ε : c'est exactement ça, une preuve de
          limite.
        </p>
      </section>

      <section className="section">
        <span className="section-num">3</span>
        <h2>Limites à l'infini et coût des algorithmes</h2>
        <p>
          Même jeu quand <Tex>x</Tex> part à l'infini, sauf que ta fenêtre devient un seuil : <Tex>{"\\lim_{x \\to +\\infty} f(x) = L"}</Tex>{" "}
          veut dire que pour toute tolérance <Tex>{"\\varepsilon"}</Tex>, il existe un seuil <Tex>M</Tex> au-delà
          duquel <Tex>{"|f(x) - L| < \\varepsilon"}</Tex>.
        </p>
        <div className="aside-cs">
          <p className="aside-cs-title">Tu l'as déjà vu en CS221</p>
          <p>
            Dans la vidéo sur les réseaux de neurones, l'activation est la sigmoïde{" "}
            <Tex>{"\\sigma(z) = \\frac{1}{1 + e^{-z}}"}</Tex>. Ses deux asymptotes horizontales sont deux limites à
            l'infini :
          </p>
          <Tex block>{"\\lim_{z \\to +\\infty} \\sigma(z) = \\frac{1}{1 + 0} = 1 \\qquad \\lim_{z \\to -\\infty} \\sigma(z) = 0"}</Tex>
          <p>
            car <Tex>{"e^{-z} \\to 0"}</Tex> dans le premier cas et <Tex>{"e^{-z} \\to +\\infty"}</Tex> dans le second.
            C'est pour ça qu'un neurone « saturé » sort presque exactement 0 ou 1.
          </p>
        </div>
        <p>
          Les limites à l'infini servent aussi à comparer des coûts. Toi qui codes : <Tex>k</Tex> boucles imbriquées
          sur une liste de taille <Tex>n</Tex> coûtent <Tex>{"n^k"}</Tex> opérations, alors qu'essayer tous ses
          sous-ensembles en coûte <Tex>{"2^n"}</Tex>. Dire que la force brute finit toujours par perdre, quel que soit{" "}
          <Tex>k</Tex>, c'est une limite :
        </p>
        <Tex block>{"\\lim_{n \\to +\\infty} \\frac{n^k}{2^n} = 0"}</Tex>
        <p>
          Les valeurs deviennent vite trop grandes pour un graphique, alors on passe en échelle <Tex>{"\\log_2"}</Tex> :
          l'exponentielle devient une droite et le polynôme une courbe qui s'aplatit. Monte le degré <Tex>k</Tex> : le
          croisement recule, mais il existe toujours.
        </p>
        <GrowthViz />
        <p>
          C'est la <strong>croissance comparée</strong> de ton programme de Terminale (
          <Tex>{"\\lim x^n e^{-x} = 0"}</Tex>), vue sous l'angle de la complexité. Retiens la hiérarchie en{" "}
          <Tex>{"+\\infty"}</Tex> :
        </p>
        <Tex block>{"\\ln x \\ \\ll\\ x^k \\ \\ll\\ e^x"}</Tex>
      </section>

      <section className="section">
        <span className="section-num">4</span>
        <h2>Formes indéterminées : deux réflexes</h2>
        <p>
          Quand un calcul direct donne <Tex>{"\\tfrac{0}{0}"}</Tex>, <Tex>{"\\tfrac{\\infty}{\\infty}"}</Tex> ou{" "}
          <Tex>{"\\infty - \\infty"}</Tex>, ça ne veut pas dire « pas de limite ». Ça veut dire « regarde de plus près ».
        </p>
        <h3>En un point : factoriser et simplifier</h3>
        <Tex block>
          {"\\lim_{x \\to 3} \\frac{x^2 - 9}{x - 3} = \\lim_{x \\to 3} \\frac{(x-3)(x+3)}{x-3} = \\lim_{x \\to 3} (x + 3) = 6"}
        </Tex>
        <h3>À l'infini : ne garder que les termes dominants</h3>
        <p>On met en facteur la plus grande puissance, en haut comme en bas :</p>
        <Tex block>
          {
            "\\lim_{x \\to +\\infty} \\frac{4x^2 - x + 7}{2x^2 + 5} = \\lim_{x \\to +\\infty} \\frac{x^2\\left(4 - \\frac{1}{x} + \\frac{7}{x^2}\\right)}{x^2\\left(2 + \\frac{5}{x^2}\\right)} = \\frac{4}{2} = 2"
          }
        </Tex>
        <p>
          Si le degré du haut est plus petit, la limite vaut 0. S'il est plus grand, elle vaut <Tex>{"\\pm\\infty"}</Tex>,
          et c'est le signe du quotient des coefficients dominants qui tranche.
        </p>
      </section>
    </LessonFlow>
  );
}
