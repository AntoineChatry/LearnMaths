from collections import Counter
import numpy as np

corpus = ["<s> I am Sam </s>", "<s> Sam I am </s>", "<s> I do not like green eggs and ham </s>"]
paires, avant = Counter(), Counter()
for phrase in corpus:
    mots = phrase.split()
    for a, b in zip(mots, mots[1:]):
        paires[a, b] += 1                       # C(a b)
        avant[a] += 1                           # C(a), comme premier mot d'une paire
P = lambda b, a: paires[a, b] / avant[a]        # estimation par comptage (SLP3, éq. 3.11)
print(round(P("I", "<s>"), 2), round(P("Sam", "<s>"), 2), round(P("am", "I"), 2), P("</s>", "Sam"))

def proba(phrase):                              # produit des transitions (SLP3, éq. 3.9)
    mots = phrase.split()
    return np.prod([P(b, a) for a, b in zip(mots, mots[1:])])
print(round(proba("<s> I am Sam </s>"), 4), round(proba("<s> Sam I am Sam I am </s>"), 4))

rng = np.random.default_rng(5)
suivants = {a: [b for (x, b) in paires if x == a] for a in avant}
for _ in range(5):                              # génération mot à mot : une marche sur la chaîne
    mot, phrase = "<s>", []
    while mot != "</s>":
        choix = suivants[mot]
        mot = choix[rng.choice(len(choix), p=[P(b, mot) for b in choix])]
        phrase.append(mot)
    print(" ".join(phrase[:-1]))
