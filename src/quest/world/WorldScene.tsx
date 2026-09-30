import type { WorldCtx, WorldEvent } from "./world";

type State = {
  robot: [number, number];
  picked: Set<number>;
  destroyed: Set<number>;
  shot: [number, number, number, number, number | null] | null;
  zapped: number | null;
  bump: boolean;
  exited: boolean;
};

// Replays the first `step` events on top of the initial world.
export function replay(ctx: WorldCtx, events: WorldEvent[], step: number): State {
  const s: State = { robot: [...ctx.start], picked: new Set(), destroyed: new Set(), shot: null, zapped: null, bump: false, exited: false };
  events.slice(0, step).forEach((e, i) => {
    const last = i === step - 1;
    if (e[0] === "move") s.robot = [e[1], e[2]];
    else if (e[0] === "pick") s.picked.add(e[1]);
    else if (e[0] === "shot") {
      if (e[5] !== null) s.destroyed.add(e[5]);
      if (last) s.shot = [e[1], e[2], e[3], e[4], e[5]];
    } else if (e[0] === "zap") s.zapped = e[1];
    else if (e[0] === "bump" && last) s.bump = true;
    else if (e[0] === "exit") s.exited = true;
  });
  return s;
}

const PAD = 0.8;

export function WorldScene({ ctx, trace, step }: { ctx: WorldCtx; trace: unknown[]; step: number }) {
  const s = replay(ctx, trace as WorldEvent[], step);
  // SVG y goes down: flip so that y goes up like in math.
  const Y = (y: number) => ctx.h - 1 - y;
  const [rx, ry] = s.robot;

  return (
    <svg
      className="world"
      viewBox={`${-0.5 - PAD} ${-0.5} ${ctx.w + PAD} ${ctx.h + PAD}`}
      role="img"
      aria-label={`Carte ${ctx.w} × ${ctx.h}, robot en (${rx}, ${ry})`}
    >
      {/* Floor and grid. */}
      <rect x={-0.5} y={-0.5} width={ctx.w} height={ctx.h} className="world-floor" />
      {Array.from({ length: ctx.w + 1 }, (_, i) => (
        <line key={`v${i}`} x1={i - 0.5} y1={-0.5} x2={i - 0.5} y2={ctx.h - 0.5} className="world-grid" />
      ))}
      {Array.from({ length: ctx.h + 1 }, (_, i) => (
        <line key={`h${i}`} x1={-0.5} y1={i - 0.5} x2={ctx.w - 0.5} y2={i - 0.5} className="world-grid" />
      ))}
      {/* Coordinates: the player's code works with them. */}
      {Array.from({ length: ctx.w }, (_, x) => (
        <text key={`lx${x}`} x={x} y={ctx.h - 0.5 + 0.55} className="world-label">
          {x}
        </text>
      ))}
      {Array.from({ length: ctx.h }, (_, y) => (
        <text key={`ly${y}`} x={-0.5 - 0.4} y={Y(y) + 0.15} className="world-label">
          {y}
        </text>
      ))}

      {ctx.walls.map(([x, y]) => (
        <rect key={`w${x},${y}`} x={x - 0.5} y={Y(y) - 0.5} width={1} height={1} className="world-wall" />
      ))}

      <g transform={`translate(${ctx.exit[0]} ${Y(ctx.exit[1])})`} className={`world-exit${s.exited ? " is-open" : ""}`}>
        <line x1={-0.2} y1={0.35} x2={-0.2} y2={-0.35} />
        <path d="M -0.2 -0.35 L 0.3 -0.2 L -0.2 -0.05 Z" />
      </g>

      {ctx.crystals.map(([x, y], i) =>
        s.picked.has(i) ? null : (
          <path key={`c${i}`} d={`M ${x} ${Y(y) - 0.32} L ${x + 0.22} ${Y(y)} L ${x} ${Y(y) + 0.32} L ${x - 0.22} ${Y(y)} Z`} className="world-crystal" />
        ),
      )}

      {ctx.turrets.map((t, i) => {
        const dead = s.destroyed.has(i);
        return (
          <g key={`t${i}`} className={`world-turret${dead ? " is-dead" : ""}${s.zapped === i ? " is-firing" : ""}`}>
            {!dead && <circle cx={t.x} cy={Y(t.y)} r={t.r} className="world-range" />}
            <circle cx={t.x} cy={Y(t.y)} r={0.32} className="world-turret-body" />
            {dead ? (
              <path d={`M ${t.x - 0.3} ${Y(t.y) - 0.3} L ${t.x + 0.3} ${Y(t.y) + 0.3} M ${t.x + 0.3} ${Y(t.y) - 0.3} L ${t.x - 0.3} ${Y(t.y) + 0.3}`} className="world-wreck" />
            ) : (
              <circle cx={t.x} cy={Y(t.y)} r={0.12} className="world-turret-eye" />
            )}
          </g>
        );
      })}

      {s.shot && (
        <g className="world-shot">
          <line x1={s.shot[0]} y1={Y(s.shot[1])} x2={s.shot[2]} y2={Y(s.shot[3])} />
          <circle cx={s.shot[2]} cy={Y(s.shot[3])} r={s.shot[4] === null ? 0.12 : 0.45} className={s.shot[4] === null ? "is-miss" : "is-hit"} />
        </g>
      )}

      {s.zapped !== null && (
        <line x1={ctx.turrets[s.zapped].x} y1={Y(ctx.turrets[s.zapped].y)} x2={rx} y2={Y(ry)} className="world-zap" />
      )}

      <g className={`world-robot${s.zapped !== null ? " is-dead" : ""}${s.bump ? " is-bump" : ""}`} style={{ transform: `translate(${rx}px, ${Y(ry)}px)` }}>
        <rect x={-0.34} y={-0.34} width={0.68} height={0.68} rx={0.14} className="world-robot-body" />
        <circle cx={-0.12} cy={-0.06} r={0.07} className="world-robot-eye" />
        <circle cx={0.12} cy={-0.06} r={0.07} className="world-robot-eye" />
        <rect x={-0.14} y={0.12} width={0.28} height={0.06} rx={0.03} className="world-robot-eye" />
      </g>
    </svg>
  );
}
