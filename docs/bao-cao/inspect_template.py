#!/usr/bin/env python3
"""In cấu trúc cấp cao nhất của body trong tệp mẫu để lập kế hoạch chỉnh sửa.

Cách chạy: python3 inspect_template.py thu_muc_da_giai_nen [tu_khoa]
"""
import re
import sys

root = sys.argv[1]
keyword = sys.argv[2] if len(sys.argv) > 2 else None
xml = open(f'{root}/word/document.xml', encoding='utf8').read()
body_start = xml.index('<w:body>') + len('<w:body>')
body_end = xml.rindex('</w:body>')
body = xml[body_start:body_end]

TOKEN = re.compile(r'<(/?)w:(p|tbl|sdt|sectPr)\b[^>]*?(/?)>')


def split_top(body):
    elements, depth, start, current = [], 0, None, None
    for m in TOKEN.finditer(body):
        closing, tag, selfclose = m.group(1), m.group(2), m.group(3)
        if depth == 0 and not closing:
            start, current = m.start(), tag
            if selfclose:
                elements.append((current, body[start:m.end()]))
                continue
            depth = 1
        elif tag == current and not closing and not selfclose:
            depth += 1
        elif tag == current and closing:
            depth -= 1
            if depth == 0:
                elements.append((current, body[start:m.end()]))
    return elements


def text_of(fragment):
    return ''.join(re.findall(r'<w:t(?: [^>]*)?>(.*?)</w:t>', fragment, flags=re.S))


elements = split_top(body)
print('phần tử cấp cao nhất:', len(elements))
for i, (tag, frag) in enumerate(elements):
    style = re.search(r'<w:pStyle w:val="([^"]+)"', frag)
    flags = []
    if '<w:numPr>' in frag[:600]:
        flags.append('num')
    if '<w:sectPr' in frag and tag == 'p':
        flags.append('SECT')
    if '<w:br w:type="page"' in frag:
        flags.append('PB')
    if '<w:fldChar' in frag or '<w:instrText' in frag:
        flags.append('FLD')
    if '<w:drawing' in frag or '<w:pict' in frag:
        flags.append('IMG')
    text = text_of(frag).replace('\n', ' ')[:80]
    line = f'{i:4d} {tag:5s} {(style.group(1) if style else "-"):14s} {",".join(flags):10s} {text}'
    if keyword is None or keyword.lower() in line.lower():
        print(line)

sect = re.findall(r'<w:sectPr.*?</w:sectPr>', body, flags=re.S)
print('\nsố sectPr:', len(sect))
for s in sect:
    print(re.sub(r'\s+', ' ', s)[:400])
