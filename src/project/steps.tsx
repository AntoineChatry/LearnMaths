import { getSolved } from "../quest/progress";
import type { Level, Verdict } from "../quest/types";
import { PY_ENGINE } from "./engine";
import { LossChart, MeteorScene, resultOf } from "./MeteorScene";
import monde from "./py/monde.py?raw";
import etape1 from "./py/etape1.py?raw";
import etape2 from "./py/etape2.py?raw";
import etape3 from "./py/etape3.py?raw";
import etape4 from "./py/etape4.py?raw";
import etape5 from "./py/etape5.py?raw";

// "A robot that learns": each step asks for one function; the functions validated in earlier steps are run
// before the player's code (see monde.py), so the brain is assembled piece by piece.
type Ctx = { seed: number; deps: [number, string | null][] };
type R = Record<string, unknown>;

const IDS = ["projet-vision", "projet-decision", "projet-apprendre", "projet-gradient", "projet-conditionnement"];

const fr = (n: number, digits = 2) => n.toFixed(digits).replace(".", ",");
// Inside $...$: KaTeX needs {,} for a decimal comma without a space after it.
const frTex = (n: number, digits = 2) => n.toFixed(digits).replace(".", "{,}");
const num = (r: R, k: string) => r[k] as number;

function context(step: number): () => Ctx {
  return () => ({
    seed: Math.floor(Math.random() * 1e6),
    deps: IDS.slice(0, step - 1).map((id, i) => [i + 1, getSolved(id) ?? null]),
  });
}

// Common failures (error, missing earlier step), else the step's own verdict from the harness result.
function judgeWith(check: (r: R) => Verdict) {
  return (_ctx: Ctx, trace: unknown[], error: string | null): Verdict => {
    if (error) return { ok: false, stars: 0, message: "Ton code s'est arrêté sur une erreur (voir la console)." };
    const r = resultOf(trace);
    if (!r) return { ok: false, stars: 0, message: "Le test n'a pas pu aller jusqu'au bout." };
    if (r.dep) return { ok: false, stars: 0, message: String(r.dep) };
    return check(r);
  };
}

function Scene({ trace, step, done, vision }: { trace: unknown[]; step: number; done: boolean; vision?: boolean }) {
  const r = resultOf(trace);
  return (
    <>
      <MeteorScene trace={trace} step={step} showVision={!!vision} />
      {done && r && Array.isArray(r.pertes) && <LossChart losses={r.pertes as number[]} target={num(r, "cible")} />}
    </>
  );
}

const common = {
  prelude: `${PY_ENGINE}\n${monde}`,
  packages: ["numpy"],
  timeoutMs: 30000,
  stepMs: 70,
};

const partieApi = [
  { sig: "partie.x", doc: "La colonne du robot, de 0 à 8. Le robot est toujours à la hauteur 0." },
  { sig: "partie.meteores", doc: "La liste des (colonne, hauteur) des météores ; la hauteur 1 est la ligne juste au-dessus du robot." },
];

const vision: Level<Ctx> = {
  ...common,
  id: IDS[0],
  nodeId: "vecteurs",
  title: "La vision",
  story: [
    "Pluie de météores. Ton robot est sur la ligne du bas d'un écran de 9 colonnes sur 10 lignes. À chaque tick, il va à gauche, reste ou va à droite ($-1$, $0$, $+1$), puis tous les météores descendent d'une ligne : s'il y en a un sur sa case, il est détruit. Au fil des étapes, tu vas lui écrire un cerveau qui apprend à esquiver, une fonction à la fois. Chaque fonction validée est reprise telle quelle dans les étapes suivantes.",
    "Première pièce : la vision. Un réseau de neurones ne voit pas un écran, il voit un vecteur. Le robot regarde les 5 colonnes autour de lui (de $x - 2$ à $x + 2$) sur les 4 lignes au-dessus de lui (hauteurs 1 à 4) : 20 cases, rangées ligne par ligne dans un vecteur $v \\in \\mathbb{R}^{20}$. La case de hauteur $h$ et de décalage $dx$ va à l'indice $5(h - 1) + (dx + 2)$. Elle vaut 1 s'il y a un météore, ou si elle sort de l'écran (un bord bloque autant qu'un météore), et 0 sinon.",
    "Ta fonction est testée sur toutes les positions de 6 parties jouées par un expert. Pendant le film, le panneau de droite affiche ton vecteur, rangé comme la fenêtre en pointillés.",
  ],
  api: partieApi,
  starter: `import numpy as np


def percevoir(partie):
    """Renvoie la vision du robot : un vecteur de 20 nombres (0 ou 1)."""
    x = partie.x
    meteores = set(partie.meteores)
    vision = np.zeros(20)
    # À toi : pour chaque hauteur h de 1 à 4 et chaque décalage dx de -2 à 2,
    # vision[5 * (h - 1) + (dx + 2)] vaut 1 s'il y a un météore en (x + dx, h)
    # ou si la colonne x + dx sort de l'écran.
    return vision
`,
  hint: "Deux boucles imbriquées : h dans range(1, 5) et dx dans range(-2, 3). La colonne regardée est $c = x + dx$ ; elle sort de l'écran si $c < 0$ ou $c > 8$. Le test (c, h) in meteores dit s'il y a un météore sur cette case.",
  newContext: context(1),
  postlude: etape1,
  judge: judgeWith((r) => {
    if (r.wrong === 0) return { ok: true, stars: 3, message: `Ta vision est exacte sur les ${r.total} positions testées.` };
    const first = r.first as { x: number; ref: number[]; got: number[] | null };
    if (!first.got || first.got.length !== 20)
      return { ok: false, stars: 0, message: `percevoir doit renvoyer 20 nombres ; ta fonction en renvoie ${first.got?.length ?? "autre chose"}.` };
    const i = first.ref.findIndex((v, k) => v !== first.got![k]);
    const h = Math.floor(i / 5) + 1;
    const dx = (i % 5) - 2;
    return {
      ok: false,
      stars: 0,
      message: `Faux sur ${r.wrong} positions sur ${r.total}. Première erreur : robot en colonne ${first.x}, case de hauteur ${h} et de décalage ${dx} (colonne ${first.x + dx}, indice ${i}) : il fallait ${first.ref[i]}, ton vecteur donne ${first.got[i]}.`,
    };
  }),
  Scene: ({ trace, step, done }) => <Scene trace={trace} step={step} done={done} vision />,
};

const decision: Level<Ctx> = {
  ...common,
  id: IDS[1],
  nodeId: "matrices",
  title: "La décision",
  story: [
    "Deuxième pièce : la décision. Le cerveau le plus simple est linéaire : une matrice $W$ de taille $3 \\times 20$ et un vecteur $b \\in \\mathbb{R}^3$ donnent trois scores $s = Wv + b$, un par action. Chaque score est un produit scalaire entre une ligne de $W$ et la vision $v$ : la ligne $i$ dit combien chaque case vue pèse pour l'action $i$.",
    "Le robot joue l'action de plus grand score : l'indice 0 veut dire gauche ($-1$), 1 rester ($0$), 2 droite ($+1$). Ta fonction est testée sur 300 cas ; ensuite le robot joue avec des poids tirés au hasard. Ne t'attends pas à des miracles : c'est l'étape suivante qui lui apprendra ses poids.",
  ],
  api: [
    { sig: "W @ v", doc: "Le produit matrice-vecteur en NumPy." },
    { sig: "np.argmax(s)", doc: "L'indice du plus grand élément de s." },
  ],
  starter: `import numpy as np


def decider(W, b, vision):
    """Renvoie l'action : -1 (gauche), 0 (rester) ou +1 (droite)."""
    scores = np.zeros(3)  # À toi : les trois scores
    return 0  # À toi : l'action de plus grand score
`,
  hint: "Les scores sont W @ vision + b. np.argmax(scores) renvoie 0, 1 ou 2 : il reste à le décaler de 1 pour obtenir $-1$, $0$ ou $+1$.",
  newContext: context(2),
  postlude: etape2,
  judge: judgeWith((r) => {
    if (r.wrong === 0)
      return {
        ok: true,
        stars: 3,
        message: `Décision exacte sur les 300 cas. Avec des poids au hasard, le robot survit en moyenne ${fr(num(r, "survie"), 1)} ticks sur 300 : il lui faut apprendre.`,
      };
    const first = r.first as { scores: number[]; ref: number; got: string };
    return {
      ok: false,
      stars: 0,
      message: `Faux sur ${r.wrong} cas sur 300. Par exemple, pour les scores (${first.scores.map((s) => fr(s)).join(" ; ")}), il fallait renvoyer ${first.ref}, ta fonction renvoie ${first.got}.`,
    };
  }),
  Scene: ({ trace, step, done }) => <Scene trace={trace} step={step} done={done} />,
};

const apprendre: Level<Ctx> = {
  ...common,
  id: IDS[2],
  nodeId: "orthogonalite",
  title: "Apprendre de l'expert",
  story: [
    "Troisième pièce : apprendre. Un joueur expert, qui voit tout l'écran, a joué 30 parties. À chaque tick, on a noté ce que voyait ton robot (une ligne de $X$, avec ta fonction percevoir) et le coup de l'expert, codé en « one-hot » (une ligne de $Y$ : $(1, 0, 0)$ pour gauche, $(0, 1, 0)$ pour rester, $(0, 0, 1)$ pour droite). Cela fait environ 8 700 exemples.",
    "On cherche $W$ et $b$ pour que les scores $Wv + b$ collent au mieux aux lignes de $Y$ : ce sont des moindres carrés (chapitre 6). On ajoute à $X$ une colonne de 1 pour le biais, $X_a = [X \\mid \\mathbf{1}]$, et on minimise $\\|X_a T - Y\\|^2$, où $T$ ($21 \\times 3$) empile $W^\\top$ puis $b$. Classer par moindres carrés est la méthode la plus simple qui soit (Bishop, Pattern Recognition and Machine Learning, §4.1.3).",
    "Le test vérifie l'équation normale $X_a^\\top (X_a T - Y) = 0$, puis ton robot joue 40 parties avec les poids appris (toujours les mêmes, pour comparer les cerveaux entre les étapes).",
  ],
  api: [
    { sig: "X, Y", doc: "Les visions (N × 20) et les coups de l'expert en one-hot (N × 3)." },
    { sig: "np.hstack([A, B])", doc: "Colle des matrices côte à côte ; np.ones((N, 1)) est une colonne de 1." },
    { sig: "np.linalg.lstsq(A, B, rcond=None)[0]", doc: "La solution des moindres carrés de A T = B (chapitre 6)." },
  ],
  starter: `import numpy as np


def apprendre(X, Y):
    """Renvoie W (3 x 20) et b (3,) qui ajustent au mieux les scores X W^T + b à Y."""
    Xa = X  # À toi : ajoute une colonne de 1 à droite de X
    T = np.zeros((21, 3))  # À toi : la solution des moindres carrés de Xa T = Y
    W = T[:-1].T
    b = T[-1]
    return W, b
`,
  hint: "Xa = np.hstack([X, np.ones((len(X), 1))]), puis T = np.linalg.lstsq(Xa, Y, rcond=None)[0]. Les 20 premières lignes de $T$ forment $W^\\top$, la dernière est $b$.",
  newContext: context(3),
  postlude: etape3,
  judge: judgeWith((r) => {
    if (r.shape) {
      const [w, b] = r.shape as number[][];
      return { ok: false, stars: 0, message: `W doit être de taille (3, 20) et b de taille (3,) ; ta fonction renvoie (${w.join(", ")}) et (${b.join(", ")}).` };
    }
    if (num(r, "normal") > 1e-6)
      return {
        ok: false,
        stars: 0,
        message: `Ce ne sont pas les moindres carrés : l'équation normale n'est pas vérifiée (écart ${num(r, "normal").toExponential(1)}). Ta perte vaut ${fr(num(r, "loss"), 4)}, le minimum est ${fr(num(r, "best"), 4)}.`,
      };
    return {
      ok: true,
      stars: 3,
      message: `Équation normale vérifiée. Ton robot survit en moyenne ${fr(num(r, "survie"), 1)} ticks sur 300, contre une douzaine avec des poids au hasard. L'expert, lui, tient les 300 : un cerveau linéaire ne fait qu'additionner des cases pondérées. Pour aller plus loin, il lui faudra une couche cachée, dans une étape future.`,
    };
  }),
  Scene: ({ trace, step, done }) => <Scene trace={trace} step={step} done={done} />,
};

const gradient: Level<Ctx> = {
  ...common,
  id: IDS[3],
  nodeId: "symetriques",
  title: "Apprendre pas à pas",
  story: [
    "Quatrième pièce : la descente de gradient. lstsq résout le problème d'un coup, mais aucune formule ne donne les poids d'un réseau de neurones : on les entraîne par petits pas, $T \\leftarrow T - \\eta \\nabla L(T)$. On s'y exerce ici sur le problème de l'étape 3, dont on connaît déjà la réponse.",
    "La perte est $L(T) = \\frac{1}{N} \\|X_a T - Y\\|^2$. Son gradient est $\\nabla L = \\frac{2}{N} X_a^\\top (X_a T - Y)$, et sa hessienne $H = \\frac{2}{N} X_a^\\top X_a$ est symétrique et semi-définie positive (chapitre 8). Sur une quadratique, la descente à pas fixe converge exactement quand $0 < \\eta \\lambda_i < 2$ pour toutes les valeurs propres $\\lambda_i$ de $H$, donc quand $\\eta < 2 / \\lambda_{\\max}$. Le meilleur pas fixe est $\\eta = 2 / (\\lambda_{\\max} + \\lambda_{\\min})$ (Goh, « Why Momentum Really Works », Distill, 2017).",
    "La descente part de $T = 0$ et doit atteindre la perte des moindres carrés, à 1 % près, en moins de 300 itérations. Les étoiles dépendent du nombre d'itérations, comparé à celui du meilleur pas fixe.",
  ],
  api: [
    { sig: "gradient(T, Xa, Y)", doc: "T est de taille 21 × 3 ; le gradient a la même taille." },
    { sig: "np.linalg.eigvalsh(H)", doc: "Les valeurs propres d'une matrice symétrique, par ordre croissant (chapitre 8)." },
    { sig: "Xa.T, len(Xa)", doc: "La transposée, et le nombre N d'exemples." },
  ],
  starter: `import numpy as np


def gradient(T, Xa, Y):
    """Gradient de L(T) = ||Xa T - Y||² / N, de même taille que T."""
    N = len(Xa)
    return np.zeros_like(T)  # À toi


def choisir_pas(Xa):
    """Un pas de descente tiré des valeurs propres de la hessienne de L."""
    N = len(Xa)
    H = np.zeros((21, 21))  # À toi : la hessienne de L
    lam = np.linalg.eigvalsh(H)  # par ordre croissant : lam[0] est la plus petite, lam[-1] la plus grande
    return 0.01  # À toi
`,
  hint: "Le gradient est 2 * Xa.T @ (Xa @ T - Y) / N et la hessienne 2 * Xa.T @ Xa / N. Avec lam = eigvalsh(H), le pas 1 / lam[-1] converge toujours ; 2 / (lam[-1] + lam[0]) est le meilleur pas fixe.",
  newContext: context(4),
  postlude: etape4,
  judge: judgeWith((r) => {
    if (r.grad === false) {
      if (r.got === null || (r.shape as number[]).join() !== "21,3")
        return { ok: false, stars: 0, message: `Le gradient doit avoir la taille de T, (21, 3) ; ta fonction renvoie (${(r.shape as number[]).join(", ")}).` };
      return {
        ok: false,
        stars: 0,
        message: `Ton gradient est faux. Par différences finies, la dérivée de L par rapport au premier poids vaut ${fr(num(r, "slope"), 4)} ; ta fonction donne ${fr(num(r, "got"), 4)}.`,
      };
    }
    const { pas, lmin, lmax, its, its_opt } = r as { pas: number; lmin: number; lmax: number; its: number | null; its_opt: number };
    const pertes = r.pertes as number[];
    const bornes = `Ici $\\lambda_{\\min} = ${frTex(lmin, 3)}$ et $\\lambda_{\\max} = ${frTex(lmax, 3)}$, donc il faut $\\eta < 2 / \\lambda_{\\max} = ${frTex(2 / lmax, 3)}$.`;
    if (its === null) {
      if (pertes[pertes.length - 1] >= 1e6 || pertes.length < 300)
        return { ok: false, stars: 0, message: `La descente diverge avec $\\eta = ${frTex(pas, 4)}$ : la perte explose. ${bornes}` };
      return { ok: false, stars: 0, message: `Trop lent : avec $\\eta = ${frTex(pas, 4)}$, la perte n'a pas atteint la cible en 300 itérations. ${bornes}` };
    }
    const stars = its <= its_opt + 1 ? 3 : its <= 2 * its_opt ? 2 : 1;
    return {
      ok: true,
      stars,
      message: `Perte des moindres carrés atteinte en ${its} itérations (meilleur pas fixe : ${its_opt}). Le conditionnement de la hessienne vaut $\\kappa = \\lambda_{\\max} / \\lambda_{\\min} = ${frTex(lmax / lmin, 1)}$. Ton robot survit en moyenne ${fr(num(r, "survie"), 1)} ticks : c'est le cerveau de l'étape 3, trouvé pas à pas.`,
    };
  }),
  Scene: ({ trace, step, done }) => <Scene trace={trace} step={step} done={done} />,
};

const conditionnement: Level<Ctx> = {
  ...common,
  id: IDS[4],
  nodeId: "svd",
  title: "Bien conditionner",
  story: [
    "Cinquième pièce : le conditionnement. À l'étape 4, la descente a mis des dizaines d'itérations. Sa vitesse dépend du conditionnement de la hessienne, $\\kappa = \\lambda_{\\max} / \\lambda_{\\min}$ (Goh, Distill, 2017), et $\\kappa(X_a^\\top X_a) = \\kappa(X_a)^2$ (chapitre 9).",
    "Le remède classique (LeCun et al., « Efficient BackProp », 1998, §4.3) : centrer chaque entrée pour que sa moyenne soit nulle, égaliser les variances et, si possible, décorréler les entrées. Ta fonction renvoie $\\mu$ et une matrice $M$, et le robot voit ensuite $(v - \\mu) M$. Standardiser, c'est $M = \\mathrm{diag}(1 / \\sigma_j)$. Décorréler, c'est passer dans la base des composantes principales (la PCA du chapitre 9) puis diviser chaque axe par son écart-type : c'est le « blanchiment ».",
    "L'entraînement reprend tes fonctions de l'étape 4, gradient et pas compris. Étoiles : une normalisation qui fait nettement baisser $\\kappa$ en vaut 1, la standardisation 2, et le blanchiment, qui ramène $\\kappa$ à 1, en vaut 3. Le cerveau appris doit rester aussi bon : une transformation qui perd de l'information est refusée.",
  ],
  api: [
    { sig: "X.mean(axis=0), X.std(axis=0)", doc: "Moyenne et écart-type de chaque colonne (chaque case vue)." },
    { sig: "np.diag(d)", doc: "La matrice diagonale de diagonale d." },
    { sig: "np.linalg.svd(A, full_matrices=False)", doc: "Renvoie U, s, Vt avec A = U diag(s) Vt (chapitre 9)." },
  ],
  starter: `import numpy as np


def normaliser(X):
    """Renvoie mu (20,) et M (20 x k) : le robot verra (vision - mu) @ M."""
    mu = np.zeros(20)  # À toi
    M = np.eye(20)  # À toi
    return mu, M
`,
  hint: "Standardiser : mu = X.mean(axis=0) et M = np.diag(1 / X.std(axis=0)). Blanchir : avec U, s, Vt = np.linalg.svd(X - mu, full_matrices=False), la covariance a pour vecteurs propres les colonnes de Vt.T et pour valeurs propres $s^2 / N$ ; M = Vt.T / (s / np.sqrt(len(X))).",
  newContext: context(5),
  postlude: etape5,
  judge: judgeWith((r) => {
    if (r.shape) {
      const [m, M] = r.shape as number[][];
      return { ok: false, stars: 0, message: `mu doit être de taille (20,) et M de taille (20, k) ; ta fonction renvoie (${m.join(", ")}) et (${M.join(", ")}).` };
    }
    const k = num(r, "k");
    const kBrut = num(r, "k_brut");
    if (!Number.isFinite(k) || num(r, "perte") > num(r, "best") * (1 + 1e-6) + 1e-12)
      return {
        ok: false,
        stars: 0,
        message: `Ta transformation perd de l'information : la meilleure perte possible passe de ${fr(num(r, "best"), 4)} à ${fr(num(r, "perte"), 4)}. Garde toutes les directions où les données varient.`,
      };
    if (k > kBrut / 2)
      return { ok: false, stars: 0, message: `$\\kappa(H)$ passe seulement de ${fr(kBrut, 1)} à ${fr(k, 1)} : ta normalisation ne change presque rien.` };
    if (r.its === null || r.its === undefined)
      return { ok: false, stars: 0, message: "La descente n'atteint pas la cible sur les données normalisées : vérifie ton pas de l'étape 4." };
    const stars = k <= 1.001 ? 3 : k <= num(r, "k_std") * 1.001 ? 2 : 1;
    return {
      ok: true,
      stars,
      message: `$\\kappa(H)$ passe de ${fr(kBrut, 1)} à ${fr(k, 2)}. La descente atteint la cible en ${r.its} itération${num(r, "its") > 1 ? "s" : ""}, contre ${r.its_brut} sans normalisation, et ton robot survit toujours en moyenne ${fr(num(r, "survie"), 1)} ticks : même cerveau, entraînement plus rapide.`,
    };
  }),
  Scene: ({ trace, step, done }) => <Scene trace={trace} step={step} done={done} />,
};

export const projectSteps = [vision, decision, apprendre, gradient, conditionnement] as Level<unknown>[];
