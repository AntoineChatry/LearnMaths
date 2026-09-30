import { randInt } from "../../lib/random";
import type { Level } from "../types";
import { castRay, ROBOT_PRELUDE, type Cell, type WorldCtx, type WorldEvent } from "../world/world";
import { WorldScene } from "../world/WorldScene";

const W = 13;
const H = 9;
const START: Cell = [1, 4];
const EXIT: Cell = [11, 4];
const TURRETS = 3;
const RANGE = 2.5;

function border(): Cell[] {
  const cells: Cell[] = [];
  for (let x = 0; x < W; x++) cells.push([x, 0], [x, H - 1]);
  for (let y = 1; y < H - 1; y++) cells.push([0, y], [W - 1, y]);
  return cells;
}

// Turrets guard the corridor y = 4 (within range of it) but stay off it. Redraw until every turret can be hit
// from the start with the exact angle, the other turrets being still alive (no turret hides another).
function generate(): WorldCtx {
  for (;;) {
    const turrets = Array.from({ length: TURRETS }, () => ({ x: randInt(4, 9), y: 4 + (Math.random() < 0.5 ? -1 : 1) * randInt(1, 2), r: RANGE }));
    const pillars: Cell[] = Array.from({ length: 3 }, () => [randInt(3, 10), 4 + (Math.random() < 0.5 ? -1 : 1) * randInt(1, 3)] as Cell);
    const taken = new Set([...turrets.map((t) => `${t.x},${t.y}`), ...pillars.map(([x, y]) => `${x},${y}`)]);
    if (taken.size !== turrets.length + pillars.length) continue;
    const ctx: WorldCtx = { w: W, h: H, walls: [...border(), ...pillars], start: START, exit: EXIT, crystals: [], turrets };
    const alive = turrets.map(() => true);
    const reachable = turrets.every((t, i) => {
      const angle = (Math.atan2(t.y - START[1], t.x - START[0]) * 180) / Math.PI;
      return castRay(ctx, START, angle, alive).hit === i;
    });
    if (reachable) return ctx;
  }
}

export const tourelles: Level<WorldCtx> = {
  id: "tourelles",
  nodeId: "derivation",
  title: "Les tourelles",
  story: [
    "Trois tourelles gardent le couloir qui mène à la sortie. Leur cercle rouge est leur portée : si ton robot y entre alors qu'elles sont actives, il est détruit.",
    "Détruis-les de loin, depuis ta case de départ. Ton code tourne d'abord sur la carte affichée ; s'il réussit, il est rejoué sur d'autres cartes où les tourelles sont ailleurs. Demande donc leurs coordonnées au scanner et calcule l'angle de tir. Trois tirs pour trois tourelles, c'est trois étoiles.",
  ],
  api: [
    { sig: "robot.scanner()", doc: 'Renvoie un dict : "tourelles" est la liste des (x, y) des tourelles actives.' },
    { sig: "robot.tirer(angle)", doc: "Tire un laser dans la direction angle, en degrés : 0 vers la droite, 90 vers le haut." },
    { sig: "robot.position()", doc: "Renvoie (x, y)." },
    { sig: "robot.droite(n)", doc: "Avance de n cases. Aussi gauche, haut, bas." },
  ],
  starter: `import math

for (tx, ty) in robot.scanner()["tourelles"]:
    x, y = robot.position()
    angle = 0  # À toi : l'angle, en degrés, de la direction qui va du robot à la tourelle
    robot.tirer(angle)

robot.droite(10)
`,
  hint: "La direction du robot vers la tourelle est le vecteur $(t_x - x,\\ t_y - y)$. Son angle est $\\operatorname{atan2}(t_y - y,\\ t_x - x)$, en radians : `math.atan2`, puis `math.degrees` pour passer en degrés.",
  newContext: generate,
  checks: 3,
  prelude: ROBOT_PRELUDE,
  judge: (ctx, trace, error) => {
    const events = trace as WorldEvent[];
    const shots = events.filter((e) => e[0] === "shot").length;
    const hits = events.filter((e) => e[0] === "shot" && e[5] !== null).length;
    if (events.some((e) => e[0] === "zap")) return { ok: false, stars: 0, message: "Ton robot est entré dans la portée d'une tourelle encore active." };
    if (!events.some((e) => e[0] === "exit")) {
      if (error) return { ok: false, stars: 0, message: "Ton code s'est arrêté sur une erreur (voir la console)." };
      return { ok: false, stars: 0, message: `Tourelles détruites : ${hits} sur ${ctx.turrets.length}, et le robot n'a pas atteint la sortie.` };
    }
    const n = ctx.turrets.length;
    const stars = shots <= n ? 3 : shots <= n + 2 ? 2 : 1;
    return { ok: true, stars, message: `Sortie atteinte, ${shots} tir${shots > 1 ? "s" : ""} pour ${n} tourelles.` };
  },
  Scene: ({ ctx, trace, step }) => <WorldScene ctx={ctx} trace={trace} step={step} />,
};
