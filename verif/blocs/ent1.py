import numpy as np

def surprise(p):  # information d'un événement de probabilité p, en bits
    return np.log2(1 / p)

print(surprise(1 / 2), surprise(1 / 6).round(3), surprise(1 / 1024))
print(surprise(1 / 36).round(3), (2 * surprise(1 / 6)).round(3))  # deux dés indépendants
print(surprise(0.0913).round(1), surprise(0.0008).round(1))  # 'e' et 'q' (MacKay, table 2.9)
