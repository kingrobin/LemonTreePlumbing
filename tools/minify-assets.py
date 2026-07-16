#!/usr/bin/env python3
import re
import glob
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

def minify_css(css):
    # Remove block comments
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.DOTALL)
    # Remove whitespace around delimiters { } : ; ,
    css = re.sub(r'\s*([\{\};:,])\s*', r'\1', css)
    # Replace multiple spaces/newlines with a single space
    css = re.sub(r'\s+', ' ', css)
    return css.strip()

def minify_js(js):
    result = []
    i = 0
    n = len(js)
    in_string = None  # '"', "'", or '`'
    in_line_comment = False
    in_block_comment = False
    
    while i < n:
        char = js[i]
        
        # Check block comment end
        if in_block_comment:
            if char == '*' and i + 1 < n and js[i+1] == '/':
                in_block_comment = False
                i += 2
            else:
                i += 1
            continue
            
        # Check line comment end
        if in_line_comment:
            if char == '\n' or char == '\r':
                in_line_comment = False
                result.append('\n')
            i += 1
            continue
            
        # Check string end/start
        if in_string:
            if char == '\\':
                result.append(js[i:i+2])
                i += 2
            elif char == in_string:
                in_string = None
                result.append(char)
                i += 1
            else:
                result.append(char)
                i += 1
            continue
            
        # Start comment
        if char == '/' and i + 1 < n:
            next_char = js[i+1]
            if next_char == '/':
                in_line_comment = True
                i += 2
                continue
            elif next_char == '*':
                in_block_comment = True
                i += 2
                continue
                
        # Start string
        if char in ('"', "'", '`'):
            in_string = char
            result.append(char)
            i += 1
            continue
            
        result.append(char)
        i += 1
        
    js_no_comments = "".join(result)
    
    # Process line by line to strip whitespaces
    lines = []
    for line in js_no_comments.splitlines():
        line = line.strip()
        if line:
            lines.append(line)
            
    # Combine lines safely by keeping newlines to avoid ASI issues
    return "\n".join(lines)

def replace_css_refs(content):
    def repl(m):
        if m.group(2).endswith('.min'):
            return m.group(0)
        return f"{m.group(1)}{m.group(2)}.min.css{m.group(3)}"
    return re.sub(r'(href=["\'][^"\']*?assets/css/)([^"\'/]+)\.css(["\'])', repl, content)

def replace_js_refs(content):
    def repl(m):
        if m.group(2).endswith('.min'):
            return m.group(0)
        return f"{m.group(1)}{m.group(2)}.min.js{m.group(3)}"
    return re.sub(r'(src=["\'][^"\']*?assets/js/)([^"\'/]+)\.js(["\'])', repl, content)

# 1. Minify CSS
css_files = [f for f in glob.glob('assets/css/**/*.css', recursive=True) if not f.endswith('.min.css')]
for f in css_files:
    min_path = f.replace('.css', '.min.css')
    content = open(f, encoding='utf-8').read()
    minified = minify_css(content)
    open(min_path, 'w', encoding='utf-8').write(minified)
    orig_sz = len(content.encode('utf-8'))
    min_sz = len(minified.encode('utf-8'))
    reduction = (orig_sz - min_sz) / orig_sz * 100 if orig_sz > 0 else 0
    print(f"Minified CSS: {f} ({orig_sz}B -> {min_sz}B, -{reduction:.1f}%)")

# 2. Minify JS
js_files = [f for f in glob.glob('assets/js/**/*.js', recursive=True) if not f.endswith('.min.js')]
for f in js_files:
    min_path = f.replace('.js', '.min.js')
    content = open(f, encoding='utf-8').read()
    minified = minify_js(content)
    open(min_path, 'w', encoding='utf-8').write(minified)
    orig_sz = len(content.encode('utf-8'))
    min_sz = len(minified.encode('utf-8'))
    reduction = (orig_sz - min_sz) / orig_sz * 100 if orig_sz > 0 else 0
    print(f"Minified JS:  {f} ({orig_sz}B -> {min_sz}B, -{reduction:.1f}%)")

# 3. Update HTML references
html_files = [f for f in glob.glob('**/*.html', recursive=True) if not f.startswith('assets')]
updated_html_count = 0
for f in html_files:
    content = open(f, encoding='utf-8').read()
    new_content = replace_css_refs(content)
    new_content = replace_js_refs(new_content)
    if new_content != content:
        open(f, 'w', encoding='utf-8').write(new_content)
        updated_html_count += 1

print(f"Updated CSS/JS references in {updated_html_count}/{len(html_files)} HTML pages")
