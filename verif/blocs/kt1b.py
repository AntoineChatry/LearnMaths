import numpy as np
from scipy.integrate import quad
from scipy.optimize import minimize
from scipy.stats import norm
p = lambda x: 0.5*norm.pdf(x,-2,0.6)+0.5*norm.pdf(x,2,0.6)
def rev(m):
    mu, ls = m; s = np.exp(ls)
    return quad(lambda x: norm.pdf(x,mu,s)*(norm.logpdf(x,mu,s)-np.log(p(x))), mu-12*s, mu+12*s, limit=200)[0]
def fwd(m):
    mu, ls = m; s=np.exp(ls)
    return quad(lambda x: p(x)*(np.log(p(x))-norm.logpdf(x,mu,s)), -10, 10, limit=200)[0]
r = minimize(rev, [1.5, 0.0], method="Nelder-Mead"); print(r.x[0], np.exp(r.x[1]), r.fun)
f = minimize(fwd, [0.5, 0.0], method="Nelder-Mead"); print(f.x[0], np.exp(f.x[1]), f.fun, rev(f.x))
print(fwd([2, np.log(0.6)]))
