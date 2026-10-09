import sys
import logging
from pypdf import PdfReader

logging.disable(logging.WARNING)
src, dst, a, b = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
r = PdfReader(src)
with open(dst, "w", encoding="utf-8") as f:
    for i in range(a, min(b, len(r.pages))):
        f.write(f"\n=====PAGE {i + 1}=====\n{r.pages[i].extract_text() or ''}")
print(len(r.pages))
