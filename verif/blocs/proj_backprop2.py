# Precise timing of one gradient (backprop vs central differences on all 771 parameters, 200 examples), and
# 100 / 200 steps of plain gradient descent (eta = 1) from He init with 3 seeds: loss and survival on 40 games.
import sys
import time
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).parent))
import proj_backprop as pb  # noqa: E402  (reruns the first prototype, ~10 s)

P = pb.init(0)
Xb, Yb = pb.Xn[:200], pb.Y[:200]
t0 = time.perf_counter()
for _ in range(200):
    pb.grads(P, Xb, Yb)
t_bp = (time.perf_counter() - t0) / 200
t0 = time.perf_counter()
for _ in range(2 * 771):
    pb.loss(P, Xb, Yb)
t_fd = time.perf_counter() - t0
print(f"un gradient : backprop {t_bp*1e3:.3f} ms ; 1542 passages avant {t_fd*1e3:.1f} ms ; rapport {t_fd / t_bp:.0f}")

for seed in range(3):
    P = pb.init(seed)
    out = []
    for it in range(1, 201):
        G = pb.grads(P, pb.Xn, pb.Y)
        P = [p - 1.0 * gp for p, gp in zip(P, G)]
        if it in (100, 200):
            W1, b1, W2, b2 = P
            f = lambda v, W1=W1, b1=b1, W2=W2, b2=b2: np.maximum(W1 @ v + b1, 0) @ W2.T + b2
            s = pb.g["_evaluate"](lambda p: int(np.argmax(f((pb.perc(p) - pb.mu) @ pb.M))) - 1)
            out.append(f"{it} it: perte {pb.loss(P, pb.Xn, pb.Y):.4f} survie40 {s:.1f}")
    print(f"graine {seed} :", " | ".join(out))
