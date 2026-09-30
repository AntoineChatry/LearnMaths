import { LessonFlow } from "../../components/LessonFlow";
import { Tex } from "../../components/Tex";
import { SystemViz } from "./SystemViz";

export function SystemesLesson() {
  return (
    <LessonFlow>
      <section className="section">
        <span className="section-num">1</span>
        <h2>Un système, deux images</h2>
        <p>
          Un système de <Tex>m</Tex> équations linéaires à <Tex>n</Tex> inconnues s'écrit d'un bloc{" "}
          <Tex>{"Ax = b"}</Tex>, avec <Tex>A</Tex> la matrice des coefficients. Les deux lectures du chapitre
          précédent donnent deux images du même problème :
        </p>
        <Tex block>{"\\begin{cases} x + 2y = 4 \\\\ 2x - y = 3 \\end{cases} \\qquad\\Longleftrightarrow\\qquad x \\begin{pmatrix} 1 \\\\ 2 \\end{pmatrix} + y \\begin{pmatrix} 2 \\\\ -1 \\end{pmatrix} = \\begin{pmatrix} 4 \\\\ 3 \\end{pmatrix}"}</Tex>
        <ul>
          <li>
            <strong>par lignes</strong> : chaque équation est une droite du plan, et une solution est un point commun
            aux deux droites ;
          </li>
          <li>
            <strong>par colonnes</strong> : on cherche comment combiner les colonnes de <Tex>A</Tex> pour obtenir{" "}
            <Tex>b</Tex>. Ici <Tex>{"2\\,(1, 2) + 1\\,(2, -1) = (4, 3)"}</Tex>, donc <Tex>{"(x, y) = (2, 1)"}</Tex>.
          </li>
        </ul>
        <p>
          Deux droites du plan se coupent en un point, sont parallèles, ou sont confondues. Un système linéaire a
          donc soit une solution unique, soit aucune, soit une infinité ; jamais exactement deux. Règle la seconde
          équation pour obtenir les trois cas :
        </p>
        <SystemViz />
      </section>

      <section className="section">
        <span className="section-num">2</span>
        <h2>L'élimination de Gauss</h2>
        <p>
          Au-delà de deux inconnues, on ne dessine plus : on calcule. L'idée est de transformer le système en un
          système <strong>triangulaire</strong>, qui se résout de bas en haut. On s'autorise deux opérations :
          ajouter à une équation un multiple d'une autre, et échanger deux équations. Elles ne changent pas
          l'ensemble des solutions, car on peut les défaire (retrancher ce qu'on a ajouté, rééchanger) : tout point
          solution avant l'est après, et réciproquement. Un exemple classique :
        </p>
        <Tex block>{"\\begin{cases} 2x + y + z = 5 \\\\ 4x - 6y = -2 \\\\ -2x + 7y + 2z = 9 \\end{cases}"}</Tex>
        <p>
          Le premier coefficient, 2, est le premier <strong>pivot</strong>. On s'en sert pour faire disparaître{" "}
          <Tex>x</Tex> des équations du dessous : on retranche 2 fois la ligne 1 à la ligne 2, et on retranche −1
          fois la ligne 1 à la ligne 3 (on l'ajoute). Ces nombres, 2 et −1, sont les{" "}
          <strong>multiplicateurs</strong> : le coefficient à éliminer divisé par le pivot.
        </p>
        <Tex block>{"\\begin{cases} 2x + y + z = 5 \\\\ \\phantom{2x} - 8y - 2z = -12 \\\\ \\phantom{2x + {}} 8y + 3z = 14 \\end{cases} \\qquad\\longrightarrow\\qquad \\begin{cases} 2x + y + z = 5 \\\\ \\phantom{2x} - 8y - 2z = -12 \\\\ \\phantom{2x + 8y + {}} z = 2 \\end{cases}"}</Tex>
        <p>
          Le second pivot est −8 ; le multiplicateur pour la ligne 3 est <Tex>{"8 / (-8) = -1"}</Tex>. Les pivots
          sont 2, −8 et 1. Il reste la <strong>remontée</strong> : <Tex>{"z = 2"}</Tex>, puis{" "}
          <Tex>{"-8y - 4 = -12"}</Tex> donne <Tex>{"y = 1"}</Tex>, puis <Tex>{"2x + 1 + 2 = 5"}</Tex> donne{" "}
          <Tex>{"x = 1"}</Tex>.
        </p>
        <div className="aside-cs">
          <p className="aside-cs-title">En Python</p>
          <p>Trois boucles pour éliminer, une pour remonter :</p>
          <pre>
            <code>{`import numpy as np

def gauss(A, b):
    """Élimination sans échange de lignes, puis remontée."""
    A = [row[:] for row in A]
    b = b[:]
    n = len(A)
    for k in range(n):                   # colonne du pivot
        for i in range(k + 1, n):        # lignes sous le pivot
            m = A[i][k] / A[k][k]        # multiplicateur
            for j in range(k, n):
                A[i][j] -= m * A[k][j]
            b[i] -= m * b[k]
    x = [0.0] * n
    for i in reversed(range(n)):         # remontée
        s = sum(A[i][j] * x[j] for j in range(i + 1, n))
        x[i] = (b[i] - s) / A[i][i]
    return x

A = [[2.0, 1.0, 1.0], [4.0, -6.0, 0.0], [-2.0, 7.0, 2.0]]
b = [5.0, -2.0, 9.0]
print(gauss(A, b))               # [1.0, 1.0, 2.0]
print(np.linalg.solve(A, b))     # [1. 1. 2.]`}</code>
          </pre>
        </div>
        <p>
          Les équations normales du chapitre Gradient se traitent de la même façon. Dans{" "}
          <Tex>{"30w + 10b = 47"}</Tex>, <Tex>{"10w + 4b = 16"}</Tex>, le multiplicateur est{" "}
          <Tex>{"10/30 = 1/3"}</Tex> : il reste <Tex>{"\\left(4 - \\tfrac{10}{3}\\right) b = 16 - \\tfrac{47}{3}"}</Tex>,
          soit <Tex>{"\\tfrac{2}{3}\\,b = \\tfrac{1}{3}"}</Tex> et <Tex>{"b = 0{,}5"}</Tex>. Puis{" "}
          <Tex>{"30w = 47 - 5"}</Tex> donne <Tex>{"w = 1{,}4"}</Tex>, comme au chapitre Gradient.
        </p>
      </section>

      <section className="section">
        <span className="section-num">3</span>
        <h2>Quand un pivot manque</h2>
        <p>
          Un pivot doit être non nul, puisqu'on divise par lui. Si un zéro apparaît en position de pivot, on échange
          avec une ligne du dessous qui a un coefficient non nul dans cette colonne. Si aucune ligne ne convient, le
          pivot manque vraiment : le système n'a pas une solution unique. Exemple, avec un paramètre <Tex>c</Tex> :
        </p>
        <Tex block>{"\\begin{cases} x + y + z = 2 \\\\ x + 2y + 3z = 5 \\\\ 2x + 3y + 4z = c \\end{cases} \\quad\\longrightarrow\\quad \\begin{cases} x + y + z = 2 \\\\ \\phantom{x + {}} y + 2z = 3 \\\\ \\phantom{x + {}} y + 2z = c - 4 \\end{cases}"}</Tex>
        <p>Puis on retranche la ligne 2 à la ligne 3 :</p>
        <Tex block>{"\\begin{cases} x + y + z = 2 \\\\ \\phantom{x + {}} y + 2z = 3 \\\\ \\phantom{x + y + {}} 0 = c - 7 \\end{cases}"}</Tex>
        <p>
          La troisième ligne a été entièrement éliminée : elle était une combinaison des deux premières (la somme,
          justement). Tout dépend alors de <Tex>c</Tex> :
        </p>
        <ul>
          <li>
            si <Tex>{"c \\ne 7"}</Tex>, la dernière équation dit <Tex>{"0 = c - 7 \\ne 0"}</Tex> : aucune solution ;
          </li>
          <li>
            si <Tex>{"c = 7"}</Tex>, elle dit <Tex>{"0 = 0"}</Tex> et ne contraint rien. L'inconnue <Tex>z</Tex>{" "}
            n'a plus de pivot : elle est <strong>libre</strong>. Pose <Tex>{"z = t"}</Tex> et remonte :{" "}
            <Tex>{"y = 3 - 2t"}</Tex>, puis <Tex>{"x = 2 - y - z = -1 + t"}</Tex>.
          </li>
        </ul>
        <Tex block>{"(x, y, z) = (-1, 3, 0) + t\\,(1, -2, 1), \\qquad t \\in \\mathbb{R}"}</Tex>
        <p>
          Les solutions forment une droite de l'espace. Sa forme est instructive : une solution particulière, plus
          n'importe quel multiple de <Tex>{"(1, -2, 1)"}</Tex>, qui vérifie <Tex>{"A\\,(1, -2, 1) = 0"}</Tex>. Les
          vecteurs que <Tex>A</Tex> envoie sur 0 forment le <strong>noyau</strong> de <Tex>A</Tex> : ce sera un
          personnage central du chapitre suivant.
        </p>
      </section>

      <section className="section">
        <span className="section-num">4</span>
        <h2>L'élimination est une factorisation : A = LU</h2>
        <p>
          Range les multiplicateurs de l'exemple de la section 2 (2 et −1 pour la première colonne, −1 pour la seconde)
          sous une diagonale de 1, et la matrice triangulaire obtenue à la fin dans <Tex>U</Tex> :
        </p>
        <Tex block>{"\\underbrace{\\begin{pmatrix} 2 & 1 & 1 \\\\ 4 & -6 & 0 \\\\ -2 & 7 & 2 \\end{pmatrix}}_{A} = \\underbrace{\\begin{pmatrix} 1 & 0 & 0 \\\\ 2 & 1 & 0 \\\\ -1 & -1 & 1 \\end{pmatrix}}_{L} \\underbrace{\\begin{pmatrix} 2 & 1 & 1 \\\\ 0 & -8 & -2 \\\\ 0 & 0 & 1 \\end{pmatrix}}_{U}"}</Tex>
        <p>
          Vérifie une ligne en lisant le produit par lignes : la ligne 2 de <Tex>{"LU"}</Tex> vaut 2 fois la ligne 1
          de <Tex>U</Tex> plus sa ligne 2, <Tex>{"(4, 2, 2) + (0, -8, -2) = (4, -6, 0)"}</Tex>. C'est logique :
          l'élimination avait retranché 2 fois la ligne 1, <Tex>L</Tex> la rajoute. Toute l'élimination tient dans
          la phrase <Tex>{"A = LU"}</Tex>.
        </p>
        <p>
          L'intérêt est pratique. Éliminer une matrice <Tex>{"n \\times n"}</Tex> coûte de l'ordre de{" "}
          <Tex>{"n^3"}</Tex> opérations, car il y a trois boucles imbriquées dans le code ci-dessus. Mais une fois{" "}
          <Tex>L</Tex> et <Tex>U</Tex> connues, résoudre <Tex>{"Ax = b"}</Tex> pour un nouveau <Tex>b</Tex> ne
          demande que deux systèmes triangulaires, <Tex>{"Lc = b"}</Tex> puis <Tex>{"Ux = c"}</Tex>, soit de l'ordre
          de <Tex>{"n^2"}</Tex> opérations. On factorise une fois, on résout autant de fois qu'on veut.
        </p>
      </section>

      <section className="section">
        <span className="section-num">5</span>
        <h2>Un pivot minuscule suffit à tout casser</h2>
        <p>
          En théorie, seul un pivot nul pose problème. En calcul flottant, un pivot <em>minuscule</em> est déjà une
          catastrophe. Le système <Tex>{"10^{-20} x + y = 1"}</Tex>, <Tex>{"x + y = 2"}</Tex> a pour solution{" "}
          <Tex>{"x \\approx 1"}</Tex>, <Tex>{"y \\approx 1"}</Tex>. Élimine sans réfléchir, avec le pivot{" "}
          <Tex>{"10^{-20}"}</Tex> :
        </p>
        <pre>
          <code>{`import numpy as np

A = [[1e-20, 1.0], [1.0, 1.0]]
b = [1.0, 2.0]

m = A[1][0] / A[0][0]              # multiplicateur : 1e20
a22 = A[1][1] - m * A[0][1]        # 1 - 1e20, arrondi à -1e20
b2 = b[1] - m * b[0]               # 2 - 1e20, arrondi à -1e20
y = b2 / a22
x = (b[0] - A[0][1] * y) / A[0][0]
print(x, y)                        # 0.0 1.0

print(np.linalg.solve(A, b))       # [1. 1.]`}</code>
        </pre>
        <p>
          <Tex>y</Tex> est juste, mais <Tex>x</Tex> est complètement faux. Le multiplicateur <Tex>{"10^{20}"}</Tex>{" "}
          a noyé le 1 et le 2 de la seconde ligne dans l'arrondi : les nombres flottants n'ont qu'environ 16 chiffres
          significatifs. La parade est le <strong>pivot partiel</strong> : dans chaque colonne, on échange d'abord
          les lignes pour prendre comme pivot le coefficient le plus grand en valeur absolue. Les multiplicateurs
          restent alors entre −1 et 1.
        </p>
        <div className="aside-cs">
          <p className="aside-cs-title">Ce que fait NumPy</p>
          <p>
            La documentation de <code>np.linalg.solve</code> indique qu'il appelle la routine LAPACK{" "}
            <code>_gesv</code>, dont la documentation précise qu'elle factorise <Tex>{"A = PLU"}</Tex> avec « partial
            pivoting and row interchanges ». <Tex>P</Tex> est une matrice de permutation qui enregistre les échanges
            de lignes. C'est exactement ce chapitre, écrit en Fortran et optimisé.
          </p>
        </div>
        <p>
          Au passage, la même documentation prévient que <Tex>A</Tex> doit être carrée et de rang plein, sinon il
          faut utiliser <code>lstsq</code>. « Rang plein » : c'est le sujet du chapitre suivant.
        </p>
      </section>
    </LessonFlow>
  );
}
