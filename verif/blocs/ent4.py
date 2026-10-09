import numpy as np

z = np.array([3.0, 2.5, 1.0, 0.5, -1.0])   # logits de « Le chat mange des … » (chapitre Lois discrètes)

for T in [0.1, 0.5, 1, 2, 10, 1000]:
    p = np.exp((z - z.max()) / T)
    p /= p.sum()                            # softmax à la température T
    print(T, (p @ np.log2(1 / p)).round(3))
print("max :", np.log2(5).round(3))
