# Usage: python run_blocks.py <Lesson.tsx>
# Runs every Python block of a lesson exactly as written and compares stdout with its trailing "# ..." lines.
import re
import subprocess
import sys

src = open(sys.argv[1], encoding="utf-8").read()
blocks = re.findall(r"<code>\{`(.*?)`\}</code>", src, flags=re.S)
ok = True
for i, b in enumerate(blocks, 1):
    lines = b.split("\n")
    expected = []
    while lines and lines[-1].startswith("# "):
        expected.insert(0, lines.pop()[2:])
    code = "\n".join(lines)
    r = subprocess.run([sys.executable, "-c", code], capture_output=True, text=True, encoding="utf-8")
    got = r.stdout.rstrip("\n").split("\n")
    same = got == expected and r.returncode == 0
    ok &= same
    print(f"block {i}: {'OK' if same else 'DIFF'}")
    if not same:
        print("  expected:", expected)
        print("  got     :", got)
        if r.stderr:
            print("  stderr  :", r.stderr[-600:])
print("ALL OK" if ok else "MISMATCH")
