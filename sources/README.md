# Sources des leçons

Chaque formule, chaque théorème et chaque chiffre cité dans les leçons vient d'une de ces références. Elles sont croisées par au moins deux sources, puis vérifiées par un calcul.

Seul ce fichier est versionné. Les documents restent en local (`.gitignore`), car ils sont lourds et certains ne sont pas redistribuables :

- `pdf/` : les PDF, tels que téléchargés.
- `html/` : les pages web citées.
- `txt/` : le texte extrait de certains PDF, pour chercher une équation (`grep`).
- `b64decode.py` : pour les sites qui bloquent les scripts (Microsoft, Dartmouth). Le PDF est téléchargé par le navigateur, enregistré en base64, puis reconstitué par ce script.

Si un fichier manque, il se retélécharge depuis l'adresse indiquée.

## Livres

| Fichier | Référence | Adresse |
|---|---|---|
| `pdf/mml.pdf` | Deisenroth, Faisal, Ong, *Mathematics for Machine Learning* (MML) | https://mml-book.github.io/book/mml-book.pdf |
| `pdf/prml.pdf`, `txt/prml.txt` | Bishop, *Pattern Recognition and Machine Learning* (PRML), 2006 | https://www.microsoft.com/en-us/research/wp-content/uploads/2006/01/Bishop-Pattern-Recognition-and-Machine-Learning-2006.pdf (via le navigateur) |
| `pdf/mackay.pdf`, `txt/mackay.txt` | MacKay, *Information Theory, Inference, and Learning Algorithms* | https://www.inference.org.uk/itprnn/book.pdf |
| `pdf/boyd.pdf` | Boyd et Vandenberghe, *Convex Optimization* | https://web.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf |
| `pdf/grinstead-snell.pdf`, `txt/grinstead-snell.txt` | Grinstead et Snell, *Introduction to Probability* | https://math.dartmouth.edu/~prob/prob/prob.pdf (via le navigateur) |
| `pdf/durrett.pdf`, `txt/durrett.txt` | Durrett, *Probability: Theory and Examples*, 5ᵉ éd. | https://services.math.duke.edu/~rtd/PTE/PTE5_011119.pdf |
| `pdf/morters-peres.pdf`, `txt/morters-peres.txt` | Mörters et Peres, *Brownian Motion*, 2010 | https://www.mi.uni-koeln.de/~moerters/book/book.pdf |
| `pdf/sarkka-solin.pdf`, `txt/sarkka-solin.txt` | Särkkä et Solin, *Applied Stochastic Differential Equations*, 2019 | https://users.aalto.fi/~asolin/sde-book/sde-book.pdf |
| `pdf/levin-peres.pdf`, `txt/levin-peres.txt` | Levin et Peres, *Markov Chains and Mixing Times*, 2ᵉ éd. (avec Wilmer) | https://pages.uoregon.edu/dlevin/MARKOV/mcmt2e.pdf |
| `pdf/ct2006.pdf`, `txt/ct2006.txt` ; `pdf/ct2.pdf`, `txt/ct2.txt` (ch. 2) | Cover et Thomas, *Elements of Information Theory*, 2ᵉ éd., 2006 | non libre de droits, copie locale uniquement |
| `html/goodfellow-*.html`, `txt/dlml.txt`, `txt/dlprob.txt`, `txt/goodfellow-numerical.txt`, `txt/goodfellow-optim.txt` | Goodfellow, Bengio, Courville, *Deep Learning* : chapitres 2 (algèbre linéaire), 3 (probabilités), 4 (calcul numérique), 5 (apprentissage), 8 (optimisation) | https://www.deeplearningbook.org/contents/ (`linear_algebra.html`, `prob.html`, `numerical.html`, `ml.html`, `optimization.html`) |
| `pdf/slp3.pdf`, `txt/slp3.txt` | Jurafsky et Martin, *Speech and Language Processing*, 3ᵉ éd. (ch. 3, n-grammes et perplexité) | https://web.stanford.edu/~jurafsky/slp3/ |
| `pdf/manning-ir.pdf`, `txt/manning-ir.txt` | Manning, Raghavan, Schütze, *Introduction to Information Retrieval* | https://nlp.stanford.edu/IR-book/pdf/irbookonlinereading.pdf |
| `pdf/mitchell.pdf`, `txt/mitchell3.txt` | Mitchell, *Machine Learning*, 1997 (ch. 3, arbres de décision) | copie locale |
| `pdf/hdp2.pdf`, `txt/hdp2.txt` | Vershynin, *High-Dimensional Probability*, 2ᵉ éd. | https://www.math.uci.edu/~rvershyn/papers/HDP-book/HDP-2.pdf |
| `pdf/fml.pdf`, `txt/fml.txt` | Mohri, Rostamizadeh, Talwalkar, *Foundations of Machine Learning*, 2ᵉ éd. | https://cs.nyu.edu/~mohri/mlbook/ (lien Dropbox sur la page) |

## Articles

| Fichier | Référence | Adresse |
|---|---|---|
| `pdf/shannon1948.pdf`, `txt/shannon.txt` | Shannon, *A Mathematical Theory of Communication*, 1948 | https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf |
| `pdf/quinlan.pdf`, `txt/quinlan.txt` | Quinlan, *Induction of Decision Trees*, 1986 | copie locale |
| `pdf/tishby.pdf`, `txt/tishby.txt` | Tishby et Zaslavsky, *Deep Learning and the Information Bottleneck Principle*, 2015 | https://arxiv.org/abs/1503.02406 |
| `pdf/glorot.pdf` | Glorot et Bengio, *Understanding the difficulty of training deep feedforward neural networks*, 2010 | https://proceedings.mlr.press/v9/glorot10a/glorot10a.pdf |
| `pdf/he2015.pdf`, `txt/he2015.txt` | He et al., *Delving Deep into Rectifiers*, 2015 | https://arxiv.org/abs/1502.01852 |
| `pdf/kingma-ba.pdf`, `txt/kingma-ba.txt` | Kingma et Ba, *Adam*, 2014 | https://arxiv.org/abs/1412.6980 |
| `pdf/loshchilov.pdf` | Loshchilov et Hutter, *Decoupled Weight Decay Regularization* (AdamW), 2017 | https://arxiv.org/abs/1711.05101 |
| `html/goh-momentum.html` | Goh, *Why Momentum Really Works*, Distill, 2017 | https://distill.pub/2017/momentum/ |
| `pdf/dauphin.pdf` | Dauphin et al., *Identifying and attacking the saddle point problem*, 2014 | https://arxiv.org/abs/1406.2572 |
| `pdf/pascanu.pdf` | Pascanu et al., *On the difficulty of training recurrent neural networks*, 2013 | https://arxiv.org/abs/1211.5063 |
| `pdf/realnvp.pdf` | Dinh et al., *Density estimation using Real NVP*, 2016 | https://arxiv.org/abs/1605.08803 |
| `pdf/mccandlish.pdf` | McCandlish et al., *An Empirical Model of Large-Batch Training*, 2018 | https://arxiv.org/abs/1812.06162 |
| `pdf/vae.pdf`, `txt/vae.txt` | Kingma et Welling, *Auto-Encoding Variational Bayes*, 2014 | https://arxiv.org/abs/1312.6114 |
| `pdf/doersch.pdf`, `txt/doersch.txt` | Doersch, *Tutorial on Variational Autoencoders*, 2016 | https://arxiv.org/abs/1606.05908 |
| `pdf/ddpm.pdf`, `txt/ddpm.txt` | Ho, Jain, Abbeel, *Denoising Diffusion Probabilistic Models*, 2020 | https://arxiv.org/abs/2006.11239 |
| `pdf/hinton.pdf`, `txt/hinton.txt` | Hinton, Vinyals, Dean, *Distilling the Knowledge in a Neural Network*, 2015 | https://arxiv.org/abs/1503.02531 |
| `pdf/distilbert.pdf`, `txt/distilbert.txt` | Sanh et al., *DistilBERT*, 2019 | https://arxiv.org/abs/1910.01108 |
| `pdf/ziegler.pdf`, `txt/ziegler.txt` | Ziegler et al., *Fine-Tuning Language Models from Human Preferences*, 2019 | https://arxiv.org/abs/1909.08593 |
| `pdf/stiennon.pdf`, `txt/stiennon.txt` | Stiennon et al., *Learning to summarize from human feedback*, 2020 | https://arxiv.org/abs/2009.01325 |
| `pdf/instructgpt.pdf`, `txt/instructgpt.txt` | Ouyang et al., *Training language models to follow instructions with human feedback* (InstructGPT), 2022 | https://arxiv.org/abs/2203.02155 |
| `pdf/dpo.pdf`, `txt/dpo.txt` | Rafailov et al., *Direct Preference Optimization*, 2023 | https://arxiv.org/abs/2305.18290 |
| `pdf/gpt2.pdf` | Radford et al., *Language Models are Unsupervised Multitask Learners* (GPT-2), 2019 | https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf |
| `pdf/vaswani.pdf`, `txt/vaswani.txt` (extrait) | Vaswani et al., *Attention Is All You Need*, 2017 | https://arxiv.org/abs/1706.03762 |
| `pdf/sohl-dickstein.pdf`, `txt/sohl-dickstein.txt` | Sohl-Dickstein et al., *Deep Unsupervised Learning using Nonequilibrium Thermodynamics*, 2015 | https://arxiv.org/abs/1503.03585 |
| `pdf/song-ermon.pdf`, `txt/song-ermon.txt` | Song et Ermon, *Generative Modeling by Estimating Gradients of the Data Distribution*, 2019 | https://arxiv.org/abs/1907.05600 |
| `pdf/song-sde.pdf`, `txt/song-sde.txt` | Song et al., *Score-Based Generative Modeling through Stochastic Differential Equations*, 2021 | https://arxiv.org/abs/2011.13456 |
| `pdf/vincent2011.pdf`, `txt/vincent2011.txt` | Vincent, *A Connection Between Score Matching and Denoising Autoencoders*, 2011 (rapport technique) | https://www.iro.umontreal.ca/~vincentp/Publications/smdae_techreport.pdf (via le navigateur, page anti-robot) |
| `html/brin-page.html`, `txt/brin-page.txt` | Brin et Page, *The Anatomy of a Large-Scale Hypertextual Web Search Engine*, 1998 | http://infolab.stanford.edu/~backrub/google.html |
| `pdf/zhang.pdf`, `txt/zhang.txt` | Zhang et al., *Understanding deep learning requires rethinking generalization*, 2017 | https://arxiv.org/abs/1611.03530 |

## Documentation en ligne

| Fichier | Référence | Adresse |
|---|---|---|
| `html/hf_ppl.html`, `txt/hf_ppl.txt` | Hugging Face, *Perplexity of fixed-length models* | https://huggingface.co/docs/transformers/perplexity |
| `html/sk_tree.html`, `txt/sk_tree.txt` | scikit-learn, *Decision Trees* | https://scikit-learn.org/stable/modules/tree.html |

## Non archivées

| Référence | Raison | Adresse |
|---|---|---|
| Blitzstein et Hwang, *Introduction to Probability* (Stat 110) | livre complet en lecture seule ; l'extrait public des ch. 1-2 a été perdu | https://stat110.hsites.harvard.edu/ |
| Shalev-Shwartz et Ben-David, *Understanding Machine Learning* | le site refuse les scripts et le navigateur ; remplacé par Mohri (FML) | https://www.cs.huji.ac.il/~shais/UnderstandingMachineLearning/ |
| Kullback et Leibler, *On Information and Sufficiency*, 1951 | page en accès libre, PDF non téléchargé | https://projecteuclid.org/journals/annals-of-mathematical-statistics/volume-22/issue-1/On-Information-and-Sufficiency/10.1214/aoms/1177729694.full |
| Huffman, 1952 ; Hoeffding, 1963 ; Pearlmutter, 1994 | articles payants, cités pour l'historique ; le contenu vérifié vient des livres ci-dessus | — |
| Cheney et Kincaid, *Numerical Mathematics and Computing* | livre commercial | — |
| CS221 (Stanford), diapositives « backpropagation » | cours en ligne | https://stanford-cs221.github.io/autumn2021/ |
| Strang, MIT 18.06 | cours en ligne (lien de la roadmap) | https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/ |

## Sources par chapitre

Les numéros précis (équations, théorèmes) sont dans le texte de chaque leçon.

- **Analyse** (rappels → séries) : pas de livre cité dans les leçons, hormis des renvois au cours CS221.
- **Algèbre linéaire** : MML (ch. 2 à 4, presque partout) ; Goodfellow §4.2-4.3 (symétriques, SVD) ; Pascanu (valeurs propres) ; Real NVP (déterminant) ; Cheney et Kincaid (SVD) ; Strang (matrices) ; Vaswani (vecteurs).
- **Probabilités** : Grinstead et Snell ; MML ch. 6 et §8.3 ; Blitzstein et Hwang (probas-base, conditionnelles, lois discrètes) ; GPT-2 et Manning IR (conditionnelles) ; Hinton (température, lois discrètes) ; Glorot et He (lois continues) ; PRML §1.5.5 (lois jointes), éq. 1.65-1.67 et §4.3.4 (vraisemblance) ; Kingma et Welling, DDPM (gaussienne) ; McCandlish (grands nombres).
- **Multivariable et optimisation** : MML ch. 5 et 7 ; PRML §4.3 (Newton), §5.3 (rétropropagation), annexe E (Lagrange), §7.1 et §12.1 (dualité) ; Boyd (Newton, convexité, Lagrange, dualité) ; Goodfellow (convexité) ; Goh (optimiseurs) ; Kingma et Ba, Loshchilov et Hutter (Adam, AdamW) ; Dauphin, Pearlmutter (Newton) ; CS221 (rétropropagation).
- **Théorie de l'information** :
  - Entropie : MacKay, PRML §1.6, Goodfellow §3.13, Shannon 1948, Huffman.
  - Entropie croisée : MacKay, Cover et Thomas ch. 2, PRML, Goodfellow §5.5, Jurafsky et Martin ch. 3, Hugging Face, Kullback et Leibler.
  - Information mutuelle : Cover et Thomas, MacKay ch. 8-9, Quinlan, Mitchell ch. 3, scikit-learn, Tishby.
  - KL dans l'entraînement : PRML §10.1 et §10.7, Goodfellow fig. 3.6, Kingma et Welling, Doersch, Hinton, DistilBERT, Ziegler, Stiennon, InstructGPT, DPO.
- **Concentration et généralisation** :
  - Hoeffding : Vershynin ch. 1-2, Mohri annexes C à E, Cover et Thomas th. 11.4.1.
  - PAC : Mohri ch. 2 et §4.1-4.2, Vershynin §8.4, Zhang et al.
  - Dimension VC : Mohri ch. 3 (ex. 3.14-3.16, th. 3.17, cor. 3.18-3.19, th. 3.23), Vershynin lemme 8.3.9, Zhang et al. §2.2.
  - Grande dimension : Vershynin §3.1, §3.3.3, rem. 3.3.10, ex. 3.41, §5.3 ; Mohri lemmes 15.2-15.4 ; Vaswani et al. §3.2.1 et note 4.
- **Chaînes de Markov et diffusion** :
  - Chaînes de Markov : Grinstead et Snell §11.1 (ex. 11.1-11.3, th. 11.1-11.2, tableau 11.1) ; Levin et Peres §1.1 (éq. 1.1-1.7) ; PRML §11.2.1 (éq. 11.37-11.38) ; Jurafsky et Martin §3.1-3.5 (éq. 3.4-3.11).
  - Loi stationnaire : Levin et Peres §1.3-1.5 (ex. 1.1, 1.12, éq. 1.8, 1.14-1.15, cor. 1.17, prop. 1.19), §4.1-4.3 (prop. 4.2, th. 4.9) ; Grinstead et Snell §11.3-11.5 (déf. 11.4-11.6, ex. 11.16-11.19, th. 11.7-11.15) ; PRML éq. 11.39 ; Manning et al. §21.2 (éq. 21.1-21.6, th. 21.1, ex. 21.1) ; Brin et Page §2.1.
  - MCMC : PRML §11.2 (éq. 11.33-11.45, fig. 11.9-11.10), §2.1.1 (éq. 2.17-2.20), §11.5 ; Levin et Peres §1.6 (éq. 1.29, prop. 1.20, ex. 1.22), §3.2 (éq. 3.4-3.5, rem. 3.1, ex. 3.3) ; MacKay §29.4 (éq. 29.32, ex. 29.3).
  - Marches aléatoires et brownien : Grinstead et Snell §12.1-12.2 (th. 12.1, ex. 12.2) ; Durrett th. 4.8.7, th. 5.4.3-5.4.4, §7.1, éq. 7.4.4, th. 8.1.4 ; Mörters et Peres lemme 1.7, th. 2.21, th. 5.22 ; Särkkä et Solin ex. 3.1, éq. 3.48, ex. 3.2 et 3.5, déf. 4.1 ; Ho et al. (DDPM) éq. 2 et 4.
  - Diffusion : Ho et al. (DDPM) éq. 2-14, algorithmes 1-2, §3.2, §4 ; Song et al. 2021 éq. 5-13, 32-33, §4.3 ; Song et Ermon éq. 2 ; Vincent éq. 9-11 ; Sohl-Dickstein et al. (origine de l'idée).
