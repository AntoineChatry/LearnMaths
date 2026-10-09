import numpy as np
z = np.array([3.0, 2.5, 1.0, 0.5, -1.0])
def sm(T):
    e = np.exp((z - z.max()) / T); return e / e.sum()
p = sm(1)
H = p @ np.log2(1 / p)
for T in [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 5]:
    q = sm(T)
    print(T, q.round(3), "H(p,q)", (p @ np.log2(1 / q)).round(3), "KLpq", (p @ np.log2(p / q)).round(3), "KLqp", (q @ np.log2(q / p)).round(3))
print("H", H.round(3))
