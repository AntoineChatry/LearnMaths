export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randNonZero(min: number, max: number): number {
  let n = 0;
  while (n === 0) n = randInt(min, max);
  return n;
}

export function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

// Writes a coefficient in front of a term: 1 → "", -1 → "-", 3 → "3".
export function coef(n: number): string {
  if (n === 1) return "";
  if (n === -1) return "-";
  return String(n);
}

// Constant term with its sign: 3 → "+3", -2 → "-2", 0 → "".
export function signed(n: number): string {
  if (n === 0) return "";
  return n > 0 ? `+${n}` : String(n);
}

export function fracTex(num: number, den: number): string {
  const g = gcd(Math.abs(num), Math.abs(den));
  let p = num / g;
  let q = den / g;
  if (q < 0) {
    p = -p;
    q = -q;
  }
  if (q === 1) return String(p);
  return p < 0 ? `-\\frac{${-p}}{${q}}` : `\\frac{${p}}{${q}}`;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}
