import numpy as np

def ruine(x, a, b, p, rng, n=20000):            # marche partie de x, arrêtée en a ou en b
    gagne, durees = 0, []
    for _ in range(n):
        s, t = x, 0
        while a < s < b:
            s += 1 if rng.random() < p else -1
            t += 1
        gagne += s == b
        durees.append(t)
    return gagne / n, np.mean(durees)

rng = np.random.default_rng(0)
x, a, b = 3, 0, 10                               # 3 euros en poche, on s'arrête à 0 ou à 10
gain, duree = ruine(x, a, b, 0.5, rng)
print(round(gain, 3), round(duree, 1), (x - a) / (b - a), (b - x) * (x - a))
# pièce légèrement défavorable, comme à la roulette (p = 18/38)
p = 18 / 38
r = (1 - p) / p
print(round(ruine(x, a, b, p, rng)[0], 3), round((r**x - 1) / (r**b - 1), 3))
