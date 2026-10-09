import { LessonFlow } from "../../components/LessonFlow";
import { Tex } from "../../components/Tex";
import { EntropyViz } from "./EntropyViz";

export function EntropieLesson() {
  return (
    <LessonFlow>
      <section className="section">
        <span className="section-num">1</span>
        <h2>La surprise d'un événement</h2>
        <p>
          Apprendre que le soleil s'est levé ce matin n'apprend rien ; apprendre qu'il y a eu une éclipse apprend
          beaucoup. C'est l'exemple de Goodfellow, Bengio et Courville (<em>Deep Learning</em>, section 3.13). Pour
          mesurer l'information d'un événement de probabilité <Tex>p</Tex>, on veut une quantité qui vaut 0 si
          l'événement est certain, qui grandit quand <Tex>p</Tex> diminue, et qui s'additionne pour deux événements
          indépendants : deux piles de suite doivent apporter deux fois l'information d'un seul. Comme la
          probabilité de deux événements indépendants est un produit, il faut une fonction qui change les produits
          en sommes : un logarithme (Bishop, PRML, section 1.6). D'où la <strong>quantité d'information</strong>, ou
          surprise (MacKay, équation 2.34 ; PRML, équation 1.92 ; Goodfellow, équation 3.48) :
        </p>
        <Tex block>{"h(x) = \\log_2 \\frac{1}{p(x)} = -\\log_2 p(x)"}</Tex>
        <p>
          En base 2, l'unité est le <strong>bit</strong>. Shannon (1948, introduction) précise que le mot lui a été
          suggéré par J. W. Tukey, et qu'un dispositif à deux positions stables stocke exactement un bit. Une pièce
          équilibrée donne 1 bit, un dé 2,585 bits. En apprentissage automatique, on prend souvent le logarithme
          naturel : l'unité est alors le <strong>nat</strong>, et l'on passe de l'un à l'autre par un facteur{" "}
          <Tex>{"\\ln 2 \\approx 0{,}693"}</Tex>, puisque <Tex>{"\\ln p = \\ln 2 \\times \\log_2 p"}</Tex>. Changer
          de base change seulement l'unité (PRML, section 1.6 ; Goodfellow, section 3.13).
        </p>
        <pre>
          <code>{`import numpy as np

def surprise(p):  # information d'un événement de probabilité p, en bits
    return np.log2(1 / p)

print(surprise(1 / 2), surprise(1 / 6).round(3), surprise(1 / 1024))
print(surprise(1 / 36).round(3), (2 * surprise(1 / 6)).round(3))  # deux dés indépendants
print(surprise(0.0913).round(1), surprise(0.0008).round(1))  # 'e' et 'q' (MacKay, table 2.9)
# 1.0 2.585 10.0
# 5.17 5.17
# 3.5 10.3`}</code>
        </pre>
        <p>
          Un double six surprend exactement deux fois plus qu'un six. Et dans un texte anglais, tirer un « e »
          apporte 3,5 bits, tirer un « q » 10,3 bits : la lettre rare en dit plus.
        </p>
      </section>

      <section className="section">
        <span className="section-num">2</span>
        <h2>L'entropie : la surprise moyenne</h2>
        <p>
          L'<strong>entropie</strong> d'une variable aléatoire est la moyenne de sa surprise, sous sa propre loi
          (MacKay, équation 2.35 ; PRML, équation 1.93 ; Goodfellow, équation 3.49) :
        </p>
        <Tex block>{"H(X) = \\sum_x p(x) \\log_2 \\frac{1}{p(x)} = -\\sum_x p(x) \\log_2 p(x)"}</Tex>
        <p>
          avec la convention <Tex>{"0 \\log_2 \\frac10 = 0"}</Tex>, justifiée par{" "}
          <Tex>{"\\lim_{p \\to 0} p \\log p = 0"}</Tex>. Shannon (1948, théorème 2) montre que c'est, à une unité
          près, la seule mesure qui vérifie trois exigences naturelles. Elle a deux propriétés qu'énoncent Shannon
          (propriétés 1 et 2) et MacKay (équation 2.36), pour <Tex>K</Tex> issues possibles :
        </p>
        <Tex block>{"0 \\le H(X) \\le \\log_2 K"}</Tex>
        <p>
          <Tex>{"H = 0"}</Tex> si et seulement si l'issue est certaine ; <Tex>{"H = \\log_2 K"}</Tex> si et seulement
          si la loi est uniforme, la situation la plus incertaine. Pour une pièce de probabilité <Tex>p</Tex>,
          l'entropie binaire <Tex>{"H_2(p) = p \\log_2 \\frac1p + (1-p)\\log_2 \\frac{1}{1-p}"}</Tex> vaut 0 en{" "}
          <Tex>{"p = 0"}</Tex> et en <Tex>{"p = 1"}</Tex>, et culmine à 1 bit en <Tex>{"p = 1/2"}</Tex> (Shannon,
          figure 7 ; Goodfellow, figure 3.5).
        </p>
        <pre>
          <code>{`import numpy as np

def entropie(p):
    p = np.asarray(p, dtype=float)
    p = p[p > 0]                          # convention 0 log(1/0) = 0
    return p @ np.log2(1 / p)

print(entropie([1/8] * 8))                                      # 8 cas équiprobables
print(entropie([1/2, 1/4, 1/8, 1/16, 1/64, 1/64, 1/64, 1/64]))  # Bishop, section 1.6
print(entropie([0.9, 0.1]).round(3), entropie([1.0, 0.0]))
print((entropie([0.5, 0.3, 0.2]) * np.log(2)).round(4))         # en nats : le 1,0297 du chapitre Vraisemblance
# 3.0
# 2.0
# 0.469 0.0
# 1.0297`}</code>
        </pre>
        <p>
          Huit cas équiprobables : 3 bits, autant que le nombre de chiffres binaires qu'il faut pour les numéroter.
          La loi non uniforme de Bishop, sur huit cas aussi, ne vaut que 2 bits. Une pièce truquée à 90 % ne vaut
          que 0,469 bit. Et l'on retrouve le plancher de l'entropie croisée du chapitre Vraisemblance : 1,0297 nat
          était l'entropie de la loi des classes. Dans un texte anglais, une lettre tirée au hasard a une entropie
          d'environ 4,11 bits (MacKay, exemple 2.12), contre <Tex>{"\\log_2 27 \\approx 4{,}75"}</Tex> si les 26
          lettres et l'espace étaient équiprobables.
        </p>
        <p>
          <strong>Additivité.</strong> Pour deux variables indépendantes,{" "}
          <Tex>{"H(X, Y) = H(X) + H(Y)"}</Tex> (MacKay, équation 2.39). Plus généralement, l'entropie se calcule par
          étapes : si l'on révèle d'abord un choix grossier, puis le détail, on additionne l'entropie du premier choix
          et l'entropie moyenne du second. C'est la troisième exigence de Shannon (1948, section 6), qui
          donne cet exemple :
        </p>
        <Tex block>{"H\\left(\\tfrac12, \\tfrac13, \\tfrac16\\right) = H\\left(\\tfrac12, \\tfrac12\\right) + \\tfrac12\\, H\\left(\\tfrac23, \\tfrac13\\right)"}</Tex>
        <p>
          On choisit d'abord entre deux possibilités équiprobables, puis, la moitié du temps seulement, entre deux
          autres de probabilités 2/3 et 1/3 : d'où le facteur <Tex>{"\\tfrac12"}</Tex>. MacKay en donne la forme
          générale (équations 2.43 et 2.44).
        </p>
      </section>

      <section className="section">
        <span className="section-num">3</span>
        <h2>Compresser : l'entropie est une limite</h2>
        <p>
          Pour transmettre une suite de symboles en binaire, on donne à chaque symbole <Tex>i</Tex> un mot de code de
          longueur <Tex>{"l_i"}</Tex>. Pour pouvoir décoder sans séparateur, on prend un <strong>code
          préfixe</strong> : aucun mot n'est le début d'un autre. L'exemple de Shannon (1948, section 10), repris par
          MacKay (exemple 5.10) : quatre symboles de probabilités <Tex>{"\\tfrac12, \\tfrac14, \\tfrac18, \\tfrac18"}</Tex>
          , codés <Tex>{"0, 10, 110, 111"}</Tex>. La longueur moyenne est
        </p>
        <Tex block>{"L = \\sum_i p_i\\, l_i = \\tfrac12 \\times 1 + \\tfrac14 \\times 2 + \\tfrac18 \\times 3 + \\tfrac18 \\times 3 = \\tfrac74 \\text{ bits}"}</Tex>
        <p>
          C'est exactement l'entropie de la source. Ce n'est pas un hasard. Des mots courts coûtent cher : un code
          préfixe doit respecter l'<strong>inégalité de Kraft</strong>{" "}
          <Tex>{"\\sum_i 2^{-l_i} \\le 1"}</Tex> (MacKay, équation 5.9), et MacKay en déduit (équations 5.14 à 5.16)
          que tout code décodable vérifie <Tex>{"L \\ge H"}</Tex>, avec égalité seulement si{" "}
          <Tex>{"l_i = \\log_2(1/p_i)"}</Tex> (équation 5.17) : chaque symbole reçoit un nombre de bits égal à sa
          surprise. Bishop (section 1.6) et Goodfellow (section 3.13) énoncent la même borne : c'est le{" "}
          <strong>théorème du codage sans bruit</strong> de Shannon. L'entropie est le nombre moyen minimal de bits
          par symbole.
        </p>
        <p>
          Les longueurs doivent être entières. En arrondissant au-dessus,{" "}
          <Tex>{"l_i = \\lceil \\log_2(1/p_i) \\rceil"}</Tex>, l'inégalité de Kraft reste vraie et l'on perd moins
          d'un bit (MacKay, théorème 5.1) :
        </p>
        <Tex block>{"H(X) \\le L < H(X) + 1"}</Tex>
        <p>
          Le meilleur code symbole par symbole est donné par l'<strong>algorithme de Huffman</strong> (Huffman, 1952 ;
          MacKay, algorithme 5.4) : on fusionne les deux symboles les moins probables, qui reçoivent les deux mots les
          plus longs, et on recommence avec le symbole fusionné.
        </p>
        <pre>
          <code>{`import heapq
import numpy as np

def huffman_longueurs(p):
    # On fusionne les deux symboles les moins probables, jusqu'à n'en garder qu'un (MacKay, algorithme 5.4)
    tas = [(pi, i, [i]) for i, pi in enumerate(p)]
    heapq.heapify(tas)
    l = np.zeros(len(p), dtype=int)
    while len(tas) > 1:
        p1, i1, s1 = heapq.heappop(tas)
        p2, _, s2 = heapq.heappop(tas)
        l[s1 + s2] += 1                   # chaque fusion ajoute un bit aux mots de ces symboles
        heapq.heappush(tas, (p1 + p2, i1, s1 + s2))
    return l

p = np.array([0.25, 0.25, 0.2, 0.15, 0.15])          # MacKay, exemple 5.15
l = huffman_longueurs(p)
print(l, (p @ l).round(4), (p @ np.log2(1 / p)).round(4), (2.0 ** -l).sum())

# Fréquences des 26 lettres et de l'espace en anglais (MacKay, table 2.9)
anglais = np.array([.0575, .0128, .0263, .0285, .0913, .0173, .0133, .0313, .0599, .0006,
                    .0084, .0335, .0235, .0596, .0689, .0192, .0008, .0508, .0567, .0706,
                    .0334, .0069, .0119, .0073, .0164, .0007, .1928])
l = huffman_longueurs(anglais)
shannon = np.ceil(np.log2(1 / anglais))              # longueurs du théorème 5.1
print((anglais @ np.log2(1 / anglais)).round(2), (anglais @ l).round(2), (anglais @ shannon).round(2))
# [2 2 2 3 3] 2.3 2.2855 1.0
# 4.11 4.15 4.66`}</code>
        </pre>
        <p>
          On retrouve les nombres de MacKay : 2,30 bits contre une entropie de 2,2855 (exemple 5.15), et pour
          l'anglais 4,15 bits contre 4,11 (exemple 5.17). Les longueurs arrondies du théorème 5.1 font bien pire,
          4,66 bits, tout en restant sous <Tex>{"H + 1"}</Tex>. Le bit perdu au plus se dilue si l'on code des blocs :
          pour <Tex>N</Tex> symboles indépendants, l'entropie du bloc est <Tex>{"N H"}</Tex> par additivité, donc la
          borne devient <Tex>{"N H \\le L_N < N H + 1"}</Tex>, soit moins de <Tex>{"H + 1/N"}</Tex> bits par symbole.
        </p>
      </section>

      <section className="section">
        <span className="section-num">4</span>
        <h2>L'entropie maximale, et l'incertitude d'un modèle</h2>
        <p>
          Pourquoi la loi uniforme maximise-t-elle l'entropie ? C'est un problème du chapitre Multiplicateurs de
          Lagrange : maximiser <Tex>{"-\\sum_i p_i \\ln p_i"}</Tex> sous la contrainte{" "}
          <Tex>{"\\sum_i p_i = 1"}</Tex> (PRML, équation 1.99). Le lagrangien est
        </p>
        <Tex block>{"\\mathcal L = -\\sum_i p_i \\ln p_i + \\lambda\\Big(\\sum_i p_i - 1\\Big) \\qquad \\frac{\\partial \\mathcal L}{\\partial p_i} = -\\ln p_i - 1 + \\lambda = 0"}</Tex>
        <p>
          Donc <Tex>{"\\ln p_i = \\lambda - 1"}</Tex> pour tout <Tex>i</Tex> : toutes les probabilités sont égales,{" "}
          <Tex>{"p_i = 1/K"}</Tex>, et <Tex>{"H = \\ln K"}</Tex> nats, soit <Tex>{"\\log_2 K"}</Tex> bits. C'est
          bien un maximum : la hessienne est diagonale, de coefficients <Tex>{"-1/p_i < 0"}</Tex> (PRML, équation
          1.100), donc l'entropie est concave.
        </p>
        <p>
          <strong>L'incertitude d'un modèle.</strong> Un modèle de langage sort une loi sur le token suivant :
          son entropie mesure son hésitation. Avec la température <Tex>T</Tex> du chapitre Lois discrètes (Hinton et
          al., 2015), <Tex>{"p_i \\propto e^{z_i/T}"}</Tex>, on règle cette entropie : quand <Tex>T</Tex> tend vers
          0, la loi se concentre sur le plus grand logit et l'entropie tend vers 0 ; quand <Tex>T</Tex> grandit, la
          loi tend vers l'uniforme et l'entropie vers son maximum <Tex>{"\\log_2 K"}</Tex>.
        </p>
        <pre>
          <code>{`import numpy as np

z = np.array([3.0, 2.5, 1.0, 0.5, -1.0])   # logits de « Le chat mange des … » (chapitre Lois discrètes)

for T in [0.1, 0.5, 1, 2, 10, 1000]:
    p = np.exp((z - z.max()) / T)
    p /= p.sum()                            # softmax à la température T
    print(T, (p @ np.log2(1 / p)).round(3))
print("max :", np.log2(5).round(3))
# 0.1 0.058
# 0.5 0.973
# 1 1.549
# 2 2.03
# 10 2.307
# 1000 2.322
# max : 2.322`}</code>
        </pre>
        <EntropyViz />
        <p>
          <strong>Le cas continu.</strong> Pour une densité, on définit l'<em>entropie différentielle</em>{" "}
          <Tex>{"-\\int p(x) \\ln p(x)\\, dx"}</Tex> (PRML, équation 1.103 ; Goodfellow, section 3.13). Parmi toutes
          les lois de variance <Tex>{"\\sigma^2"}</Tex> donnée, c'est la gaussienne qui la maximise (PRML, équation
          1.109 ; Goodfellow, section 3.9.3), avec <Tex>{"H = \\tfrac12\\big(1 + \\ln(2\\pi\\sigma^2)\\big)"}</Tex>{" "}
          (PRML, équation 1.110). Supposer un bruit gaussien, comme les moindres carrés du chapitre Vraisemblance,
          c'est donc supposer le moins possible au-delà de la variance. Attention : contrairement au cas discret,
          l'entropie différentielle peut être négative, dès que <Tex>{"\\sigma^2 < 1/(2\\pi e)"}</Tex>.
        </p>
      </section>
    </LessonFlow>
  );
}
