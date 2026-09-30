import { LessonFlow } from "../../components/LessonFlow";
import { Tex } from "../../components/Tex";
import { DotViz } from "./DotViz";

export function VecteursLesson() {
  return (
    <LessonFlow>
      <section className="section">
        <span className="section-num">1</span>
        <h2>Un vecteur est une liste de nombres</h2>
        <p>
          En physique, un vecteur est une flèche. En algèbre linéaire, c'est d'abord une liste ordonnée de nombres, ses{" "}
          <strong>composantes</strong>. Avec deux composantes, on peut dessiner la flèche qui part de l'origine et
          arrive au point <Tex>{"(3, 1)"}</Tex>. Avec trois, elle vit dans l'espace. Avec 768, on ne la dessine plus,
          mais tous les calculs restent les mêmes :
        </p>
        <Tex block>{"a = (a_1, a_2, \\dots, a_n) \\in \\mathbb{R}^n"}</Tex>
        <p>
          C'est exactement ce qu'est un <strong>embedding</strong> : un modèle de langage représente chaque token par
          un vecteur de <Tex>{"\\mathbb{R}^d"}</Tex>, avec <Tex>d</Tex> de quelques centaines à quelques milliers. Tout
          ce que le modèle « sait » d'un mot passe par ces nombres, et les outils de ce chapitre servent à les
          comparer.
        </p>
        <p>Deux opérations se font composante par composante :</p>
        <Tex block>{"a + b = (a_1 + b_1, \\dots, a_n + b_n) \\qquad \\lambda a = (\\lambda a_1, \\dots, \\lambda a_n)"}</Tex>
        <p>
          En dessin, <Tex>{"a + b"}</Tex> consiste à mettre la flèche <Tex>b</Tex> au bout de la flèche <Tex>a</Tex>,
          et <Tex>{"\\lambda a"}</Tex> étire <Tex>a</Tex> d'un facteur <Tex>{"\\lambda"}</Tex> (et la retourne si{" "}
          <Tex>{"\\lambda < 0"}</Tex>). Une somme de vecteurs multipliés par des nombres,{" "}
          <Tex>{"\\lambda_1 v_1 + \\dots + \\lambda_k v_k"}</Tex>, s'appelle une <strong>combinaison linéaire</strong>.
          C'est l'opération de base de tout le module.
        </p>
        <div className="aside-cs">
          <p className="aside-cs-title">En Python</p>
          <p>
            NumPy fait ces opérations sur des tableaux entiers, sans boucle. L'opérateur <code>@</code> calcule le
            produit scalaire de la section 3.
          </p>
          <pre>
            <code>{`import numpy as np

a = np.array([3.0, 1.0, 2.0])
b = np.array([1.0, -2.0, 4.0])
print(a + b)          # [ 4. -1.  6.]
print(2 * a)          # [6. 2. 4.]
print(a @ b)          # 9.0
print(np.linalg.norm(a))   # 3.7416573867739413`}</code>
          </pre>
        </div>
      </section>

      <section className="section">
        <span className="section-num">2</span>
        <h2>La longueur, par Pythagore</h2>
        <p>
          La flèche <Tex>{"(3, 4)"}</Tex> est l'hypoténuse d'un triangle rectangle de côtés 3 et 4 : sa longueur vaut{" "}
          <Tex>{"\\sqrt{3^2 + 4^2} = 5"}</Tex>. En dimension 3, on applique Pythagore deux fois : d'abord dans le plan
          du sol, <Tex>{"\\sqrt{a_1^2 + a_2^2}"}</Tex>, puis avec la hauteur <Tex>{"a_3"}</Tex>. La racine du premier
          calcul disparaît au carré, et il reste :
        </p>
        <Tex block>{"\\|a\\| = \\sqrt{a_1^2 + a_2^2 + \\dots + a_n^2}"}</Tex>
        <p>
          C'est la <strong>norme</strong> de <Tex>a</Tex>. En dimension <Tex>n</Tex>, on la prend comme définition :
          elle prolonge ce qui est vrai en 2D et 3D. Deux conséquences servent partout :
        </p>
        <ul>
          <li>
            la <strong>distance</strong> entre deux points est la norme de leur différence,{" "}
            <Tex>{"\\|a - b\\|"}</Tex> ;
          </li>
          <li>
            <Tex>{"\\|\\lambda a\\| = |\\lambda|\\,\\|a\\|"}</Tex>, donc <Tex>{"a / \\|a\\|"}</Tex> est un vecteur de
            norme 1 qui pointe comme <Tex>a</Tex>. On dit qu'on <strong>normalise</strong> <Tex>a</Tex>, et un vecteur
            de norme 1 est dit <strong>unitaire</strong>.
          </li>
        </ul>
        <p>
          Exemple : <Tex>{"a = (3, 1, 2)"}</Tex> a pour norme <Tex>{"\\sqrt{9 + 1 + 4} = \\sqrt{14}"}</Tex>, et{" "}
          <Tex>{"a / \\sqrt{14}"}</Tex> est unitaire.
        </p>
      </section>

      <section className="section">
        <span className="section-num">3</span>
        <h2>Le produit scalaire</h2>
        <p>
          Le <strong>produit scalaire</strong> de deux vecteurs de même dimension multiplie les composantes deux à deux
          et additionne. Le résultat est un nombre (un « scalaire »), pas un vecteur :
        </p>
        <Tex block>{"a \\cdot b = a_1 b_1 + a_2 b_2 + \\dots + a_n b_n = \\sum_{i=1}^{n} a_i b_i"}</Tex>
        <p>
          Avec <Tex>{"a = (3, 1, 2)"}</Tex> et <Tex>{"b = (1, -2, 4)"}</Tex> :{" "}
          <Tex>{"a \\cdot b = 3 - 2 + 8 = 9"}</Tex>. Trois propriétés se lisent directement sur la formule :
        </p>
        <ul>
          <li>
            il est <strong>symétrique</strong> : <Tex>{"a \\cdot b = b \\cdot a"}</Tex> ;
          </li>
          <li>
            il est <strong>linéaire</strong> en chaque argument :{" "}
            <Tex>{"(\\lambda a + \\mu c) \\cdot b = \\lambda\\,(a \\cdot b) + \\mu\\,(c \\cdot b)"}</Tex>, donc on
            développe comme un produit ordinaire ;
          </li>
          <li>
            <Tex>{"a \\cdot a = a_1^2 + \\dots + a_n^2 = \\|a\\|^2"}</Tex> : la norme se calcule avec le produit
            scalaire.
          </li>
        </ul>
        <div className="aside-cs">
          <p className="aside-cs-title">Tu l'as déjà vu en CS221</p>
          <p>
            Le score d'un prédicteur linéaire, <Tex>{"\\mathbf{w} \\cdot \\phi(x)"}</Tex>, est un produit scalaire :
            chaque feature est multipliée par son poids, et on additionne. Un poids positif pousse le score vers le
            haut quand la feature est présente, un poids négatif le tire vers le bas.
          </p>
        </div>
      </section>

      <section className="section">
        <span className="section-num">4</span>
        <h2>Le produit scalaire mesure un angle</h2>
        <p>
          La formule de la section 3 ne parle que de composantes. Pourtant, elle cache de la géométrie :
        </p>
        <Tex block>{"a \\cdot b = \\|a\\|\\,\\|b\\|\\cos\\theta"}</Tex>
        <p>
          où <Tex>{"\\theta"}</Tex> est l'angle entre les deux flèches. Voici pourquoi, en dimension 2. Développe{" "}
          <Tex>{"\\|a - b\\|^2"}</Tex> avec la linéarité, comme <Tex>{"(x - y)^2"}</Tex> :
        </p>
        <Tex block>{"\\begin{gathered} \\|a - b\\|^2 = (a - b) \\cdot (a - b) = \\|a\\|^2 - 2\\,a \\cdot b + \\|b\\|^2 \\\\[1ex] a \\cdot b = \\frac{\\|a\\|^2 + \\|b\\|^2 - \\|a - b\\|^2}{2} \\end{gathered}"}</Tex>
        <p>
          Le produit scalaire ne dépend donc que de trois longueurs : celles des côtés du triangle formé par{" "}
          <Tex>a</Tex>, <Tex>b</Tex> et <Tex>{"a - b"}</Tex>. Tourner la figure ne change ni ces longueurs, ni
          l'angle, ni donc <Tex>{"a \\cdot b"}</Tex>. Tournons-la pour que <Tex>a</Tex> soit sur l'axe des{" "}
          <Tex>x</Tex> : <Tex>{"a = (\\|a\\|, 0)"}</Tex>, et <Tex>b</Tex>, qui fait l'angle <Tex>{"\\theta"}</Tex>{" "}
          avec lui, vaut <Tex>{"(\\|b\\|\\cos\\theta,\\ \\|b\\|\\sin\\theta)"}</Tex> par définition du cosinus et du
          sinus. Alors <Tex>{"a \\cdot b = \\|a\\|\\,\\|b\\|\\cos\\theta + 0"}</Tex>.
        </p>
        <p>Le signe du produit scalaire dit donc tout de suite comment deux vecteurs non nuls se placent :</p>
        <ul>
          <li>
            <Tex>{"a \\cdot b > 0"}</Tex> : angle aigu, ils vont plutôt dans le même sens ;
          </li>
          <li>
            <Tex>{"a \\cdot b < 0"}</Tex> : angle obtus, ils vont plutôt en sens contraires ;
          </li>
          <li>
            <Tex>{"a \\cdot b = 0"}</Tex> : angle droit. On dit que <Tex>a</Tex> et <Tex>b</Tex> sont{" "}
            <strong>orthogonaux</strong>.
          </li>
        </ul>
        <p>Déplace les extrémités de <Tex>a</Tex> et <Tex>b</Tex> : cherche une position où le produit scalaire s'annule.</p>
        <DotViz />
      </section>

      <section className="section">
        <span className="section-num">5</span>
        <h2>Projeter un vecteur sur un autre</h2>
        <p>
          Éclaire <Tex>a</Tex> perpendiculairement à la droite portée par <Tex>b</Tex> : son ombre sur cette droite
          est le <strong>projeté orthogonal</strong> de <Tex>a</Tex> sur <Tex>b</Tex>. Si <Tex>u</Tex> est unitaire,
          la longueur signée de l'ombre vaut <Tex>{"\\|a\\|\\cos\\theta = a \\cdot u"}</Tex>, et l'ombre elle-même
          est <Tex>{"(a \\cdot u)\\,u"}</Tex>. Pour un <Tex>b</Tex> quelconque non nul, on remplace <Tex>u</Tex> par{" "}
          <Tex>{"b / \\|b\\|"}</Tex> :
        </p>
        <Tex block>{"p = \\frac{a \\cdot b}{\\|b\\|^2}\\, b"}</Tex>
        <p>
          On vérifie que c'est bien une ombre « perpendiculaire » : le reste <Tex>{"a - p"}</Tex> doit être
          orthogonal à <Tex>b</Tex>. Avec <Tex>{"k = \\frac{a \\cdot b}{\\|b\\|^2}"}</Tex> et la linéarité :
        </p>
        <Tex block>{"(a - k\\,b) \\cdot b = a \\cdot b - k\\,\\|b\\|^2 = a \\cdot b - a \\cdot b = 0"}</Tex>
        <p>
          Tout vecteur se coupe ainsi en deux morceaux : une partie le long de <Tex>b</Tex>, et une partie
          perpendiculaire à <Tex>b</Tex>. En orange, l'ombre de <Tex>a</Tex> ; les pointillés montrent la partie
          perpendiculaire.
        </p>
        <DotViz showProjection />
        <p>
          Retiens cette idée : au chapitre 6, la régression linéaire sera exactement une projection, l'ombre du
          vecteur des cibles <Tex>y</Tex> sur l'ensemble des prédictions possibles.
        </p>
      </section>

      <section className="section">
        <span className="section-num">6</span>
        <h2>L'inégalité de Cauchy-Schwarz</h2>
        <p>
          En dimension 768, qu'est-ce qu'un « angle » ? On ne peut plus le mesurer au rapporteur. L'idée est de le
          définir par la formule de la section 4 :
        </p>
        <Tex block>{"\\cos\\theta = \\frac{a \\cdot b}{\\|a\\|\\,\\|b\\|}"}</Tex>
        <p>
          Mais un cosinus doit être entre −1 et 1. Il faut donc prouver que{" "}
          <Tex>{"|a \\cdot b| \\le \\|a\\|\\,\\|b\\|"}</Tex> dans toute dimension : c'est l'
          <strong>inégalité de Cauchy-Schwarz</strong>. La preuve utilise le chapitre Second degré. Prends{" "}
          <Tex>{"b \\ne 0"}</Tex> et regarde, pour un réel <Tex>t</Tex>, la norme au carré de{" "}
          <Tex>{"a + t\\,b"}</Tex> :
        </p>
        <Tex block>{"0 \\le \\|a + t\\,b\\|^2 = \\|b\\|^2\\, t^2 + 2\\,(a \\cdot b)\\, t + \\|a\\|^2"}</Tex>
        <p>
          C'est un trinôme en <Tex>t</Tex> (coefficient dominant <Tex>{"\\|b\\|^2 > 0"}</Tex>) qui n'est jamais
          négatif. Il a donc au plus une racine, et son discriminant est négatif ou nul :
        </p>
        <Tex block>{"\\Delta = 4\\,(a \\cdot b)^2 - 4\\,\\|a\\|^2\\|b\\|^2 \\le 0 \\quad\\Longrightarrow\\quad |a \\cdot b| \\le \\|a\\|\\,\\|b\\|"}</Tex>
        <p>
          Il y a égalité quand <Tex>{"\\Delta = 0"}</Tex> : le trinôme s'annule pour un <Tex>t</Tex>, donc{" "}
          <Tex>{"a = -t\\,b"}</Tex>. Les deux vecteurs sont alors sur une même droite, c'est-à-dire{" "}
          <strong>colinéaires</strong>. Une conséquence directe est l'<strong>inégalité triangulaire</strong> :
        </p>
        <Tex block>{"\\begin{aligned} \\|a + b\\|^2 &= \\|a\\|^2 + 2\\,a \\cdot b + \\|b\\|^2 \\\\ &\\le \\|a\\|^2 + 2\\,\\|a\\|\\,\\|b\\| + \\|b\\|^2 = (\\|a\\| + \\|b\\|)^2 \\end{aligned}"}</Tex>
        <p>
          donc <Tex>{"\\|a + b\\| \\le \\|a\\| + \\|b\\|"}</Tex> : le chemin direct est le plus court, dans toute
          dimension.
        </p>
      </section>

      <section className="section">
        <span className="section-num">7</span>
        <h2>Similarité cosinus, embeddings et attention</h2>
        <p>
          Grâce à Cauchy-Schwarz, la <strong>similarité cosinus</strong>{" "}
          <Tex>{"\\frac{a \\cdot b}{\\|a\\|\\,\\|b\\|}"}</Tex> est toujours entre −1 et 1. Elle ne regarde que la
          direction : multiplier un vecteur par 10 ne la change pas. C'est la mesure standard pour comparer des
          embeddings. Avec des vecteurs jouets à trois composantes, inventés pour l'exemple :
        </p>
        <pre>
          <code>{`import numpy as np

def cosine(u, v):
    return (u @ v) / (np.linalg.norm(u) * np.linalg.norm(v))

chat    = np.array([0.9, 0.8, 0.1])
chien   = np.array([0.8, 0.9, 0.2])
voiture = np.array([0.1, 0.2, 0.9])
print(round(cosine(chat, chien), 3))        # 0.99
print(round(cosine(chat, voiture), 3))      # 0.303
print(round(cosine(chat, 10 * chien), 3))   # 0.99`}</code>
        </pre>
        <div className="aside-cs">
          <p className="aside-cs-title">Dans les articles</p>
          <p>
            Mikolov, Chen, Corrado et Dean (2013), l'article de word2vec, rappellent que{" "}
            <Tex>{"\\text{vector}(\\text{King}) - \\text{vector}(\\text{Man}) + \\text{vector}(\\text{Woman})"}</Tex>{" "}
            donne un vecteur dont le plus proche est celui de « Queen ». Pour trouver ce plus proche voisin, ils le
            disent explicitement : ils mesurent par la distance cosinus. Ce sont les deux opérations de ce chapitre,
            une combinaison linéaire puis des produits scalaires.
          </p>
          <p>
            Dans un Transformer (Vaswani et al., 2017, section 3.2.1), chaque token compare sa requête{" "}
            <Tex>q</Tex> aux clés <Tex>k</Tex> des autres tokens par un produit scalaire, divisé par{" "}
            <Tex>{"\\sqrt{d_k}"}</Tex> :
          </p>
          <Tex block>{"\\text{Attention}(Q, K, V) = \\text{softmax}\\!\\left(\\frac{Q K^\\top}{\\sqrt{d_k}}\\right) V"}</Tex>
          <p>
            Leur justification, en note : si les composantes de <Tex>q</Tex> et <Tex>k</Tex> sont indépendantes, de
            moyenne 0 et de variance 1, alors <Tex>{"q \\cdot k"}</Tex> a une variance <Tex>{"d_k"}</Tex>. Sans la
            division, les scores grandissent avec la dimension et écrasent le softmax. On le vérifie :
          </p>
          <pre>
            <code>{`import numpy as np

rng = np.random.default_rng(0)
for d in [4, 64, 1024]:
    q = rng.standard_normal((100_000, d))
    k = rng.standard_normal((100_000, d))
    s = (q * k).sum(axis=1)   # 100 000 produits q·k
    print(d, round(s.var(), 1), round((s / np.sqrt(d)).var(), 3))

# 4 4.0 1.007
# 64 64.1 1.001
# 1024 1019.4 0.995`}</code>
          </pre>
          <p>
            La variance vaut bien environ <Tex>d</Tex>, et redevient environ 1 après division par{" "}
            <Tex>{"\\sqrt{d}"}</Tex>. La preuve demande les probabilités : ce sera pour le module suivant.
          </p>
        </div>
        <p>
          Un produit scalaire par token, c'est beaucoup de produits scalaires. Les ranger proprement, c'est le rôle du
          produit <Tex>{"QK^\\top"}</Tex>, donc des matrices : c'est le chapitre suivant.
        </p>
      </section>
    </LessonFlow>
  );
}
