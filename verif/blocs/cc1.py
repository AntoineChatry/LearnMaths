from math import comb

def queue(N, k):  # P(S >= k) exacte, pour S le nombre de piles en N lancers d'une pièce équilibrée
    return sum(comb(N, j) for j in range(k, N + 1)) / 2**N

for N in [20, 100, 400]:
    k = 3 * N // 4                     # au moins 3/4 de piles
    markov = (N / 2) / k               # E[S] / k
    tchebychev = 4 / N                 # Var(S) / (N/4)^2
    print(N, f"{queue(N, k):.1e}", round(markov, 3), tchebychev)
