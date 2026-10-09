# Decodes a JSON string saved by the browser (Playwright evaluate) into a file. Usage: python -I json2py.py in out
import json
import sys

text = json.loads(open(sys.argv[1], encoding="utf-8").read())
open(sys.argv[2], "w", encoding="utf-8", newline="\n").write(text)
print(sys.argv[2], len(text), "caracteres")
