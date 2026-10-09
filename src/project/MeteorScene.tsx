import { COLS, ROWS } from "./engine";

// Trace entries written by src/project/py/monde.py.
export type Frame = ["f", number, number, [number, number][], number[] | null, boolean];
export type Res = ["res", Record<string, unknown>];

export const frames = (trace: unknown[]) => (trace as (Frame | Res)[]).filter((e): e is Frame => e[0] === "f");
export const resultOf = (trace: unknown[]) => (trace as (Frame | Res)[]).find((e): e is Res => e[0] === "res")?.[1];

const PANEL = COLS + 1; // x of the vision panel

// The robot (bottom row), the meteors, the 5 × 4 window it sees and, if the trace has it, its vision vector.
export function MeteorScene({ trace, step, showVision }: { trace: unknown[]; step: number; showVision: boolean }) {
  const all = frames(trace);
  const f = all.length > 0 ? all[Math.min(all.length - 1, Math.max(0, step - 1))] : null;
  const [, tick, x, meteors, vision, alive] = f ?? ["f", 0, Math.floor(COLS / 2), [], null, true];
  const Y = (y: number) => ROWS - 1 - y;
  const width = showVision ? PANEL + 5 : COLS;

  return (
    <svg className="world meteor-scene" viewBox={`-0.5 -1.2 ${width} ${ROWS + 1.9}`} role="img" aria-label={`Tick ${tick}, robot en colonne ${x}`}>
      <text x={-0.4} y={-0.5} className="meteor-caption">
        {f ? `tick ${tick}${alive ? "" : ", touché"}` : "en attente d'exécution"}
      </text>
      <rect x={-0.5} y={-0.5} width={COLS} height={ROWS} className="world-floor" />
      {Array.from({ length: COLS + 1 }, (_, i) => (
        <line key={`v${i}`} x1={i - 0.5} y1={-0.5} x2={i - 0.5} y2={ROWS - 0.5} className="world-grid" />
      ))}
      {Array.from({ length: ROWS + 1 }, (_, i) => (
        <line key={`h${i}`} x1={-0.5} y1={i - 0.5} x2={COLS - 0.5} y2={i - 0.5} className="world-grid" />
      ))}
      {Array.from({ length: COLS }, (_, c) => (
        <text key={`lx${c}`} x={c} y={ROWS - 0.5 + 0.55} className="world-label">
          {c}
        </text>
      ))}

      {/* What the robot sees: columns x - 2 .. x + 2, heights 1 .. 4 (clipped to the board). */}
      <rect x={x - 2.5} y={Y(4) - 0.5} width={5} height={4} className="meteor-window" />

      {meteors.map(([mx, my]) => (
        <circle key={`${mx},${my}`} cx={mx} cy={Y(my)} r={0.3} className="meteor" />
      ))}

      <g className={`world-robot${alive ? "" : " is-dead"}`} transform={`translate(${x} ${Y(0)})`}>
        <rect x={-0.34} y={-0.34} width={0.68} height={0.68} rx={0.14} className="world-robot-body" />
        <circle cx={-0.12} cy={-0.06} r={0.07} className="world-robot-eye" />
        <circle cx={0.12} cy={-0.06} r={0.07} className="world-robot-eye" />
      </g>

      {showVision && (
        <g>
          <text x={PANEL - 0.5} y={Y(5) + 0.1} className="meteor-caption">
            ta vision
          </text>
          {Array.from({ length: 20 }, (_, i) => {
            const h = Math.floor(i / 5) + 1;
            const dx = (i % 5) - 2;
            const on = vision ? vision[i] !== 0 : false;
            return (
              <g key={i}>
                <rect x={PANEL + dx + 2 - 0.5} y={Y(h) - 0.5} width={1} height={1} className={`meteor-cell${on ? " is-on" : ""}`} />
                <text x={PANEL + dx + 2} y={Y(h) + 0.12} className="world-label">
                  {vision ? String(vision[i]) : ""}
                </text>
              </g>
            );
          })}
          <text x={PANEL + 2} y={Y(0) + 0.12} className="world-label">
            robot
          </text>
        </g>
      )}
    </svg>
  );
}

// Variance of the pre-activations layer by layer (log scale): the player's init, and Xavier's dashed.
export function DepthChart({ ours, xavier }: { ours: number[]; xavier: number[] }) {
  const W = 300;
  const H = 142;
  const logs = [...ours, ...xavier].map(Math.log10);
  const lo = Math.floor(Math.min(...logs));
  const hi = Math.ceil(Math.max(...logs));
  const px = (i: number) => 30 + (i / Math.max(1, ours.length - 1)) * (W - 38);
  const py = (v: number) => 8 + ((hi - Math.log10(v)) / Math.max(1, hi - lo)) * (H - 48);
  const line = (vs: number[]) => vs.map((v, i) => `${px(i)},${py(v)}`).join(" ");
  return (
    <svg className="loss-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Variance des pré-activations, couche par couche">
      <polyline points={line(xavier)} className="loss-ref" />
      <polyline points={line(ours)} className="loss-line" />
      <text x={26} y={py(10 ** hi) + 3} className="loss-label" textAnchor="end">
        {`1e${hi}`}
      </text>
      <text x={26} y={py(10 ** lo) + 3} className="loss-label" textAnchor="end">
        {`1e${lo}`}
      </text>
      <text x={px(0)} y={H - 28} className="loss-label">
        couche 1
      </text>
      <text x={W - 8} y={H - 28} className="loss-label" textAnchor="end">
        {ours.length}
      </text>
      <text x={W / 2} y={H - 16} className="loss-label" textAnchor="middle">
        variance du signal par couche (échelle log)
      </text>
      <text x={W / 2} y={H - 4} className="loss-label" textAnchor="middle">
        ton initialisation en trait plein, Xavier en pointillés
      </text>
    </svg>
  );
}

// Loss per training iteration, log scale, with the target if there is one (1 % above the least-squares loss).
export function LossChart({ losses, target, unit = "itération" }: { losses: number[]; target?: number; unit?: string }) {
  const W = 300;
  const H = 110;
  const shown = losses.slice(0, 200);
  const logs = shown.map((l) => Math.log10(l));
  const lo = Math.min(...(target === undefined ? [] : [Math.log10(target)]), ...logs) - 0.05;
  const hi = Math.max(...logs, lo + 0.1);
  const px = (i: number) => 8 + (i / Math.max(1, shown.length - 1)) * (W - 16);
  const py = (v: number) => 8 + ((hi - v) / (hi - lo)) * (H - 24);
  return (
    <svg className="loss-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Courbe de la perte au fil des itérations">
      {target !== undefined && <line x1={8} x2={W - 8} y1={py(Math.log10(target))} y2={py(Math.log10(target))} className="loss-target" />}
      <polyline points={logs.map((v, i) => `${px(i)},${py(v)}`).join(" ")} className="loss-line" />
      <text x={W / 2} y={H - 4} className="loss-label" textAnchor="middle">
        {target === undefined ? "perte (échelle log)" : "perte (échelle log), cible en pointillés"}
      </text>
      <text x={8} y={H - 4} className="loss-label">
        {unit} 0
      </text>
      <text x={W - 8} y={H - 4} className="loss-label" textAnchor="end">
        {shown.length - 1}
      </text>
    </svg>
  );
}
