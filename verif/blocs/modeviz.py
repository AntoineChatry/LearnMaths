import numpy as np
from scipy.integrate import quad
from scipy.optimize import minimize
from scipy.stats import norm
S=0.6
for d in [1.6,1.7,1.75,1.8]:
    p=lambda x: 0.5*norm.pdf(x,-d,S)+0.5*norm.pdf(x,d,S)
    def rev(m):
        mu,ls=m; s=np.exp(ls)
        return quad(lambda x: norm.pdf(x,mu,s)*(norm.logpdf(x,mu,s)-np.log(p(x))), mu-12*s, mu+12*s, limit=200)[0]
    def fwd(mu,s): return quad(lambda x: p(x)*(np.log(p(x))-norm.logpdf(x,mu,s)), -d-10*S, d+10*S, limit=200)[0]
    best=min((minimize(rev,[m0,np.log(s0)],method="Nelder-Mead",options={"xatol":1e-6,"fatol":1e-9}) for m0,s0 in [(0,np.sqrt(S*S+d*d)),(d,S),(d/2,1)]), key=lambda r:r.fun)
    mu,s=abs(best.x[0]),np.exp(best.x[1]); sf=np.sqrt(S*S+d*d)
    print(d, f"fwd s={sf:.3f} Dpq={fwd(0,sf):.3f} Dqp={rev([0,np.log(sf)]):.3f} | rev mu={mu:.3f} s={s:.3f} Dpq={fwd(mu,s):.3f} Dqp={best.fun:.3f}")
