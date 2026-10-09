import numpy as np
import pandas as pd

def H(y):  # entropie empirique, en bits, d'une colonne d'étiquettes
    p = y.value_counts(normalize=True).to_numpy()
    return p @ np.log2(1 / p)

def gain(df, attribut, cible="classe"):  # H(classe) - H(classe | attribut)
    poids = df[attribut].value_counts(normalize=True)
    reste = sum(poids[v] * H(groupe[cible]) for v, groupe in df.groupby(attribut))
    return H(df[cible]) - reste

# Quinlan (1986), table 1 ; Mitchell (1997), table 3.2
lignes = ["sunny hot high false N", "sunny hot high true N", "overcast hot high false P",
          "rain mild high false P", "rain cool normal false P", "rain cool normal true N",
          "overcast cool normal true P", "sunny mild high false N", "sunny cool normal false P",
          "rain mild normal false P", "sunny mild normal true P", "overcast mild high true P",
          "overcast hot normal false P", "rain mild high true N"]
df = pd.DataFrame([l.split() for l in lignes],
                  columns=["outlook", "temperature", "humidity", "windy", "classe"])
print(round(H(df["classe"]), 4))
for a in ["outlook", "temperature", "humidity", "windy"]:
    print(a, round(gain(df, a), 4))
