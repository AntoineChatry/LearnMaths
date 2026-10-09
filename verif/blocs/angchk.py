# Check of AngleViz: quantiles of the density sin^(d-2) vs a large simulation (Vershynin rem. 3.3.10).
import numpy as np
rng = np.random.default_rng(1)
th = np.linspace(0, np.pi, 18001)
for d in [2, 3, 10, 100, 1000, 10000]:
    w = np.ones_like(th) if d == 2 else np.exp((d - 2) * np.log(np.maximum(np.sin(th), 1e-300)))
    c = np.cumsum(w); c /= c[-1]
    q = [np.degrees(th[np.searchsorted(c, p)]) for p in (0.025, 0.975)]
    near = c[np.searchsorted(th, np.radians(100))] - c[np.searchsorted(th, np.radians(80))]
    n = 200000 if d <= 1000 else 20000
    X = rng.standard_normal((n, d)); Y = rng.standard_normal((n, d))
    a = np.degrees(np.arccos((X * Y).sum(1) / np.linalg.norm(X, axis=1) / np.linalg.norm(Y, axis=1)))
    print(d, np.round(q, 1), np.percentile(a, [2.5, 97.5]).round(1), round(near, 3), round(np.mean((a > 80) & (a < 100)), 3))
