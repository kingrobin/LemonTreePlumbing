#!/usr/bin/env python3
"""Inline components/header.inc + footer.inc statically into every page.
.inc files remain the single source of truth — re-run after editing them.
Paths in the includes are rewritten per page depth (matches old global.js base logic)."""
import re, glob, os
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
HEADER=open('components/header.inc',encoding='utf-8').read().strip()
FOOTER=open('components/footer.inc',encoding='utf-8').read().strip()
ABS=re.compile(r'^(https?:|//|/|#|tel:|mailto:|data:)',re.I)
def rewrite(html, base):
    if not base: return html
    def sub(m):
        attr,q,v=m.group(1),m.group(2),m.group(3)
        if ABS.match(v): return m.group(0)
        return f'{attr}={q}{base}{v}{q}'
    return re.sub(r'(href|src)=(")([^"]*)"', sub, html)
def block(name,content): return f'<!-- {name}:start (generated from components/) -->\n{content}\n<!-- {name}:end -->'
def place(t, mount_id, name, content):
    blk=block(name,content)
    mk=re.compile(rf'<!-- {name}:start.*?<!-- {name}:end -->',re.S)
    if mk.search(t): return mk.sub(lambda m: blk, t)
    return re.sub(rf'<div id="{mount_id}"></div>', blk, t, count=1)
files=[f for f in glob.glob('**/*.html',recursive=True) if not f.startswith('assets')]
n=0
for f in files:
    d=os.path.dirname(f); base='../'*len([s for s in d.split('/') if s])
    t=open(f,encoding='utf-8').read(); before=t
    t=place(t,'inject-header','HEADER',rewrite(HEADER,base))
    t=place(t,'inject-footer','FOOTER',rewrite(FOOTER,base))
    if t!=before: open(f,'w',encoding='utf-8').write(t); n+=1
print(f"inlined header/footer into {n}/{len(files)} pages")
