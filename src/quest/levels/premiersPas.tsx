import type { Level } from "../types";
import { parseMap, ROBOT_PRELUDE, type WorldCtx, type WorldEvent } from "../world/world";
import { WorldScene } from "../world/WorldScene";

const MAP = [
  "##########",
  "#S..#...*#",
  "#.#.#.##.#",
  "#.#...#..#",
  "#*##.#..E#",
  "##########",
];

export const premiersPas: Level<WorldCtx> = {
  id: "premiers-pas",
  title: "Premiers pas",
  story: [
    "Ton robot se réveille dans un couloir. Ramasse les deux cristaux, puis rejoins le drapeau : la sortie ne s'ouvre qu'avec tous les cristaux.",
    "Chaque ligne de ton code est un ordre. Un mur arrête le robot sans l'abîmer.",
  ],
  api: [
    { sig: "robot.droite(n)", doc: "Avance de n cases vers la droite. Aussi gauche(n), haut(n), bas(n)." },
    { sig: "robot.position()", doc: "Renvoie (x, y), les coordonnées de la case." },
  ],
  starter: `robot.bas(3)
`,
  hint: "Le premier cristal est en bas du couloir de gauche. Reviens ensuite par où tu es venu, et suis les cases libres vers la droite.",
  newContext: () => parseMap(MAP),
  prelude: ROBOT_PRELUDE,
  judge: (_ctx, trace, error) => {
    const events = trace as WorldEvent[];
    const picked = events.filter((e) => e[0] === "pick").length;
    if (events.some((e) => e[0] === "exit")) return { ok: true, stars: 3, message: "Sortie atteinte avec les deux cristaux." };
    if (error) return { ok: false, stars: 0, message: "Ton code s'est arrêté sur une erreur (voir la console)." };
    return { ok: false, stars: 0, message: `Cristaux ramassés : ${picked} sur 2. Le robot n'est pas sur la sortie avec tous les cristaux.` };
  },
  Scene: ({ ctx, trace, step }) => <WorldScene ctx={ctx} trace={trace} step={step} />,
};
