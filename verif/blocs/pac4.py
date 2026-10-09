from math import log, sqrt

def ecart(log_H, m, delta=0.05):  # écart garanti entre risque et risque empirique, classe finie
    return sqrt((log_H + log(2 / delta)) / (2 * m))

W = 1_649_402                          # paramètres d'Inception (Zhang et al., tableau 1)
log_H = 32 * W * log(2)                # au plus 2^(32 W) réseaux distincts en float32
print(round(ecart(log_H, 50_000), 1))                       # sur les 50 000 images de CIFAR10
print(f"{(log_H + log(2 / 0.05)) / (2 * 0.05**2):.1e}")      # images pour un écart de 0,05
