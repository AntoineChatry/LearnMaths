# Programme principal : l'expert joue 100 parties, ton réseau apprend à l'imiter, puis il joue seul 40 parties.
def donnees_expert(graines):
    """Les visions du robot et les coups de l'expert, sur les parties de ces graines."""
    X, A = [], []
    for graine in graines:
        p = Partie(graine)
        while p.vivant and p.tick < MAX_TICKS:
            a = expert(p)
            X.append(np.asarray(percevoir(p), dtype=float))
            A.append(a)
            p.jouer(a)
    return np.array(X), np.array(A)


def jouer(politique, graine):
    """Une partie jouée par politique(partie) ; renvoie le nombre de ticks survécus."""
    p = Partie(graine)
    while p.vivant and p.tick < MAX_TICKS:
        p.jouer(int(politique(p)))
    return p.tick


if __name__ == "__main__":
    X, A = donnees_expert(range(1000, 1100))
    Y = np.eye(3)[A + 1]
    mu, M = normaliser(X)
    Xn = (X - mu) @ M
    print(f"{len(X)} exemples joués par l'expert")
    W1, b1, W2, b2 = entrainer(Xn, Y, np.random.default_rng(0))
    print(f"perte d'entraînement : {entropie_croisee(propager(W1, b1, W2, b2, Xn), Y):.4f}")
    survies = [jouer(lambda p: cerveau(W1, b1, W2, b2, mu, M, p), graine) for graine in range(1, 41)]
    print(f"survie moyenne sur 40 parties : {np.mean(survies):.1f} ticks (au plus {MAX_TICKS})")
