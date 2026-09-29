#!/usr/bin/env python3
"""Tính số trang hiển thị của từng mục trong mục lục từ PDF đã dựng.

Trang phần đầu (trước Phần 1) dùng số La Mã bắt đầu từ trang Thông tin chung.
Từ Phần 1 trở đi dùng số Ả Rập bắt đầu từ 1. Chạy: python3 pages.py toc.json file.pdf pages.json
"""
import json
import re
import sys

import pymupdf

meta = json.load(open(sys.argv[1], encoding='utf8'))
toc = meta['toc']
doc = pymupdf.open(sys.argv[2])


def norm(s):
    return re.sub(r'\s+', ' ', s).strip()


lines = [[norm(l) for l in p.get_text().split('\n') if l.strip()] for p in doc]
abbr_page = next(i for i, ls in enumerate(lines) if any(l.startswith('Application Programming Interface') for l in ls))
found, ptr = {}, 0
for level, num, text in toc:
    needle = norm(text)[:28]
    if text == 'DANH MỤC TỪ VIẾT TẮT':
        ptr = max(ptr, abbr_page)
    for i in range(ptr, len(lines)):
        if any((l == norm(text)) if text.startswith('DANH MỤC') else l.startswith(needle) for l in lines[i]):
            found[(num, text)] = i
            ptr = i
            break
    else:
        raise SystemExit(f'không tìm thấy: {text}')
first_body = found[('PHẦN 1', toc[[t[2] for t in toc].index(next(t[2] for t in toc if t[1] == 'PHẦN 1'))][2])]
front_start = found[('', 'THÔNG TIN CHUNG')]


def roman(n):
    out = ''
    for v, t in [(10, 'x'), (9, 'ix'), (5, 'v'), (4, 'iv'), (1, 'i')]:
        while n >= v:
            out += t
            n -= v
    return out


result = {}
for (num, text), i in found.items():
    shown = roman(i - front_start + 1) if i < first_body else str(i - first_body + 1)
    result[text if not num else f'{num}|{text}'] = shown
for key, items in meta['lists'].items():
    ptr = first_body
    for item in items:
        needle = norm(item)[:30]
        for i in range(ptr, len(lines)):
            if any(l.startswith(needle) for l in lines[i]):
                result[f'{key}|{item}'] = str(i - first_body + 1)
                ptr = i
                break
        else:
            raise SystemExit(f'không tìm thấy chú thích: {item}')
json.dump(result, open(sys.argv[3], 'w'), ensure_ascii=False)
print(len(result), 'mục')
