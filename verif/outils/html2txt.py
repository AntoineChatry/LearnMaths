import re
import sys
import html

src, dst = sys.argv[1], sys.argv[2]
s = open(src, encoding="utf-8", errors="replace").read()
s = re.sub(r"<style.*?</style>", "", s, flags=re.S)
s = re.sub(r"<script.*?</script>", "", s, flags=re.S)
s = re.sub(r"</div>", "\n", s)
s = re.sub(r"<[^>]+>", "", s)
s = html.unescape(s)
s = re.sub(r"\n\s*\n+", "\n", s)
open(dst, "w", encoding="utf-8").write(s)
print(len(s))
