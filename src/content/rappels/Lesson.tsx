import { LessonFlow } from "../../components/LessonFlow";
import { Tex } from "../../components/Tex";
import { TangentViz } from "./TangentViz";

export function RappelsLesson() {
  return (
    <LessonFlow>
      <section className="section">
        <span className="section-num">1</span>
        <h2>Un test de positionnement, pas un cours</h2>
        <p>
          Ce chapitre ne t'apprend rien de neuf : il fait le tour de ce que STI2D t'a donné en analyse, en quatre
          blocs. Dériver, primitiver, manipuler <Tex>{"\\exp"}</Tex> et <Tex>{"\\ln"}</Tex>. Lis vite, puis passe
          aux exercices : ce sont eux qui disent où tu en es. Un type d'exercice qui coince, c'est le bloc à reprendre
          avant d'aller plus loin.
        </p>
        <p>
          Commençons par l'idée qui porte tout le reste. En STI2D, le nombre dérivé <Tex>{"f'(a)"}</Tex> est la pente
          de la tangente en <Tex>a</Tex>, obtenue comme position limite des sécantes :
        </p>
        <Tex block>{"f'(a) = \\lim_{h \\to 0} \\frac{f(a + h) - f(a)}{h}"}</Tex>
        <p>
          Déplace le point rouge sur l'axe des abscisses pour changer <Tex>a</Tex>, puis réduis <Tex>h</Tex> : la
          sécante en pointillés se couche sur la tangente rouge, et sa pente rejoint <Tex>{"f'(a)"}</Tex>. Change de
          fonction avec les boutons.
        </p>
        <TangentViz />
        <p>
          Regarde en particulier <Tex>{"e^x"}</Tex> : la pente affichée est toujours égale à la hauteur du point. C'est
          exactement <Tex>{"\\exp' = \\exp"}</Tex>.
        </p>
      </section>

      <section className="section">
        <span className="section-num">2</span>
        <h2>Dériver : une table et trois règles</h2>
        <table className="value-table">
          <thead>
            <tr>
              <th>
                <Tex>{"f(x)"}</Tex>
              </th>
              <th>
                <Tex>{"x^n"}</Tex>
              </th>
              <th>
                <Tex>{"\\frac{1}{x}"}</Tex>
              </th>
              <th>
                <Tex>{"\\sin x"}</Tex>
              </th>
              <th>
                <Tex>{"\\cos x"}</Tex>
              </th>
              <th>
                <Tex>{"e^x"}</Tex>
              </th>
              <th>
                <Tex>{"\\ln x"}</Tex>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Tex>{"f'(x)"}</Tex>
              </td>
              <td>
                <Tex>{"n x^{n-1}"}</Tex>
              </td>
              <td>
                <Tex>{"-\\frac{1}{x^2}"}</Tex>
              </td>
              <td>
                <Tex>{"\\cos x"}</Tex>
              </td>
              <td>
                <Tex>{"-\\sin x"}</Tex>
              </td>
              <td>
                <Tex>{"e^x"}</Tex>
              </td>
              <td>
                <Tex>{"\\frac{1}{x}"}</Tex>
              </td>
            </tr>
          </tbody>
        </table>
        <p>Avec ça, trois règles suffisent à dériver presque tout ce que tu croiseras :</p>
        <Tex block>
          {
            "(uv)' = u'v + uv' \\qquad \\left(\\frac{u}{v}\\right)' = \\frac{u'v - uv'}{v^2} \\qquad \\big(f(u(x))\\big)' = u'(x)\\, f'(u(x))"
          }
        </Tex>
        <p>
          La troisième, la dérivée d'une composée, est celle qu'on oublie le plus : on dérive la fonction « extérieure »
          en laissant l'intérieur tel quel, puis on multiplie par la dérivée de l'intérieur. En Terminale tu l'as vue
          sous forme de cas particuliers :
        </p>
        <Tex block>
          {
            "\\begin{gathered} (u^n)' = n\\,u'\\,u^{n-1} \\qquad (e^u)' = u'\\,e^u \\qquad (\\ln u)' = \\frac{u'}{u} \\\\[1ex] (\\cos u)' = -u' \\sin u \\qquad (\\sin u)' = u' \\cos u \\end{gathered}"
          }
        </Tex>
        <p>
          Exemple : <Tex>{"f(x) = e^{x^2}"}</Tex>, donc <Tex>{"u = x^2"}</Tex>, <Tex>{"u' = 2x"}</Tex> et{" "}
          <Tex>{"f'(x) = 2x\\,e^{x^2}"}</Tex>. Tu peux toujours contrôler un calcul de dérivée avec un taux de
          variation, comme dans la définition :
        </p>
        <pre>
          <code>{`import math

f = lambda x: math.exp(x**2)
h = 1e-6
x = 0.7
print((f(x + h) - f(x)) / h)    # 2.2852459398148284
print(2 * x * math.exp(x**2))   # 2.28524270793753`}</code>
        </pre>
        <p>
          Les six premiers chiffres coïncident : la formule est bonne. L'écart restant vient de <Tex>h</Tex>, qui n'est
          pas nul.
        </p>
      </section>

      <section className="section">
        <span className="section-num">3</span>
        <h2>Primitiver : dériver à l'envers</h2>
        <p>
          <Tex>F</Tex> est une primitive de <Tex>f</Tex> si <Tex>{"F' = f"}</Tex>. Chaque ligne de la table des
          dérivées, lue de droite à gauche, donne une primitive :
        </p>
        <Tex block>
          {
            "\\begin{array}{c|c} f(x) & F(x) \\\\ \\hline x^n\\ (n \\neq -1) & \\frac{x^{n+1}}{n+1} \\\\[0.6ex] \\cos(\\omega x + \\varphi)\\ (\\omega \\neq 0) & \\frac{1}{\\omega}\\sin(\\omega x + \\varphi) \\\\[0.6ex] \\sin(\\omega x + \\varphi)\\ (\\omega \\neq 0) & -\\frac{1}{\\omega}\\cos(\\omega x + \\varphi) \\\\[0.6ex] e^{kx}\\ (k \\neq 0) & \\frac{1}{k}e^{kx} \\\\[0.6ex] u'(x)\\,e^{u(x)} & e^{u(x)} \\end{array}"
          }
        </Tex>
        <p>
          Ces primitives valent sur un intervalle où <Tex>f</Tex> est définie : pour <Tex>{"n < 0"}</Tex>,{" "}
          <Tex>{"x^n"}</Tex> n'est pas définie en 0, donc on travaille sur <Tex>{"]0, +\\infty["}</Tex> ou{" "}
          <Tex>{"]-\\infty, 0["}</Tex>. Sur un intervalle, une fonction a une infinité de primitives : si{" "}
          <Tex>F</Tex> en est une, <Tex>{"F + C"}</Tex> aussi, car la dérivée d'une constante est nulle, et ce sont
          les seules. Une condition du type <Tex>{"F(0) = 0"}</Tex> fixe <Tex>C</Tex>. Piège
          classique : la primitive de <Tex>{"e^{3x}"}</Tex> qui s'annule en 0 n'est pas{" "}
          <Tex>{"\\frac{1}{3}e^{3x}"}</Tex> (qui vaut <Tex>{"\\frac13"}</Tex> en 0), mais{" "}
          <Tex>{"\\frac{1}{3}e^{3x} - \\frac{1}{3}"}</Tex>.
        </p>
        <p>
          En Terminale, la primitive a servi à calculer des aires. La constante disparaît dans la différence, c'est
          pour ça que n'importe quelle primitive convient :
        </p>
        <Tex block>
          {"\\begin{gathered} \\int_a^b f(x)\\,dx = F(b) - F(a) \\\\[1ex] \\text{ex. : } \\int_0^1 (3x^2 + 1)\\,dx = \\big[x^3 + x\\big]_0^1 = 2 - 0 = 2 \\end{gathered}"}
        </Tex>
      </section>

      <section className="section">
        <span className="section-num">4</span>
        <h2>exp et ln : deux faces d'une même fonction</h2>
        <p>
          <Tex>{"\\ln"}</Tex> est la réciproque de <Tex>{"\\exp"}</Tex> : l'une défait ce que fait l'autre.
        </p>
        <Tex block>{"e^{\\ln x} = x \\ \\ (x > 0) \\qquad \\ln(e^x) = x \\ \\ (x \\in \\mathbb{R})"}</Tex>
        <p>
          Comme <Tex>{"e^x"}</Tex> est toujours strictement positif, <Tex>{"\\ln x"}</Tex> n'existe que pour{" "}
          <Tex>{"x > 0"}</Tex>. Les propriétés algébriques se correspondent deux à deux, pour <Tex>{"a, b > 0"}</Tex> :
        </p>
        <Tex block>
          {
            "\\begin{gathered} e^{a+b} = e^a e^b \\quad\\longleftrightarrow\\quad \\ln(ab) = \\ln a + \\ln b \\\\[1ex] \\ln\\frac{a}{b} = \\ln a - \\ln b \\qquad \\ln(a^n) = n \\ln a \\end{gathered}"
          }
        </Tex>
        <p>
          Pour résoudre une équation, on applique la réciproque des deux côtés. La première demande{" "}
          <Tex>{"c > 0"}</Tex> (une exponentielle est toujours positive : sinon, aucune solution) ; la seconde vaut pour
          tout réel <Tex>c</Tex>, et <Tex>{"e^c > 0"}</Tex> garantit que <Tex>{"\\ln(ax + b)"}</Tex> est défini :
        </p>
        <Tex block>
          {"e^{ax + b} = c \\iff ax + b = \\ln c \\qquad\\qquad \\ln(ax + b) = c \\iff ax + b = e^c"}
        </Tex>
        <p>
          Pour une inéquation, c'est pareil, car <Tex>{"\\exp"}</Tex> et <Tex>{"\\ln"}</Tex> sont strictement
          croissantes : elles conservent l'ordre. Le seul piège est la division par un nombre négatif. Exemple : à partir
          de quel entier <Tex>n</Tex> a-t-on <Tex>{"0{,}9^n < 0{,}01"}</Tex> ?
        </p>
        <Tex block>
          {
            "\\begin{gathered} 0{,}9^n < 0{,}01 \\iff n \\ln 0{,}9 < \\ln 0{,}01 \\iff n > \\frac{\\ln 0{,}01}{\\ln 0{,}9} \\approx 43{,}7 \\\\[1ex] \\text{(on divise par } \\ln 0{,}9 < 0 \\text{ : le sens change)} \\end{gathered}"
          }
        </Tex>
        <p>Donc à partir de <Tex>{"n = 44"}</Tex>. La boucle qui cherche ce seuil par force brute est d'accord :</p>
        <pre>
          <code>{`import math

print(math.log(0.01) / math.log(0.9))   # 43.70869065356567

u = 1.0
n = 0
while u >= 0.01:
    u = u * 0.9
    n = n + 1
print(n)                                # 44`}</code>
        </pre>
        <div className="aside-cs">
          <p className="aside-cs-title">Toi qui codes en Python</p>
          <p>
            <code>math.log(x)</code> est le logarithme népérien <Tex>{"\\ln"}</Tex>, pas le logarithme décimal. Le
            logarithme décimal de STI2D est <code>math.log10(x)</code>, et <code>math.log(x, b)</code> calcule{" "}
            <Tex>{"\\frac{\\ln x}{\\ln b}"}</Tex>, le logarithme en base <Tex>b</Tex>. Même convention dans NumPy :{" "}
            <code>np.log</code> est <Tex>{"\\ln"}</Tex>.
          </p>
        </div>
      </section>
    </LessonFlow>
  );
}
