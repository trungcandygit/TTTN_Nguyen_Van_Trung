#!/usr/bin/env python3
"""Vẽ các sơ đồ của báo cáo thành tệp HTML/SVG; render sang PNG bằng Chromium."""
import html
import json

Q = '"'
BOLD = ' font-weight="bold"'
DASH = ' stroke-dasharray="6 4"'
CSS = "<style>body{margin:0;background:#fff}svg text{font-family:Arial,'Liberation Sans',Helvetica,sans-serif;fill:#111}</style>"
DEFS = ('<defs><marker id="a" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">'
        '<path d="M0,0 L10,4 L0,8 z" fill="#333"/></marker></defs>')


def box(x, y, w, h, lines, fill='#fff', bold=False, fs=17):
    o = f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{fill}" stroke="#222" stroke-width="1.5"/>'
    n = len(lines)
    ty = y + h / 2 - (n - 1) * fs * 0.6 + fs * 0.33
    for i, l in enumerate(lines):
        b = BOLD if (bold and i == 0) else ''
        o += f'<text x="{x + w / 2}" y="{ty + i * fs * 1.2}" text-anchor="middle" font-size="{fs}"{b}>{html.escape(l)}</text>'
    return o


def arrow(x1, y1, x2, y2, label=None, dash=False):
    d = DASH if dash else ''
    o = f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="#333" stroke-width="1.5" marker-end="url(#a)"{d}/>'
    if label:
        o += f'<text x="{(x1 + x2) / 2}" y="{(y1 + y2) / 2 - 6}" text-anchor="middle" font-size="14" font-style="italic">{html.escape(label)}</text>'
    return o


def line(x1, y1, x2, y2):
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="#222" stroke-width="1.5"/>'


import textwrap


def wrap(c):
    return textwrap.wrap(c, 17)


sizes = {}


def page(name, w, h, body):
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">{DEFS}{body}</svg>'
    open(f'{name}.html', 'w', encoding='utf8').write(f'<!doctype html><meta charset="utf8">{CSS}{svg}')
    sizes[name] = [w, h]


# Hình 5.1
b = box(20, 150, 150, 90, ['Trình duyệt', 'Angular 21'], '#eef3fb', True)
b += box(260, 60, 200, 80, ['Máy chủ NestJS', 'cổng 3333, /api/v1'], '#e9f5ea', True)
b += box(260, 190, 200, 80, ['Dịch vụ tối ưu hóa', 'math.ts, engine.ts'], '#fff6e0', True)
b += box(570, 20, 190, 80, ['PostgreSQL 16', 'truy cập qua Prisma 7'], '#f3ecf8', True, 15)
b += box(570, 120, 190, 80, ['Redis', 'bộ nhớ đệm, hàng đợi'], '#fbeaea', True, 15)
b += box(570, 220, 190, 80, ['Nguồn giá ngoài', 'Yahoo, CoinGecko, nhập tay'], '#f0f0f0', True, 14)
b += arrow(170, 180, 260, 110, 'HTTP, JWT')
b += arrow(260, 125, 170, 205, None, True)
b += arrow(360, 140, 360, 190, 'gọi hàm')
b += arrow(460, 90, 570, 60, 'Prisma')
b += arrow(460, 110, 570, 150, 'cache')
b += arrow(460, 250, 570, 260, 'giá lịch sử')
page('kien-truc', 790, 330, b)

# Hình 5.2
b = ''
ents = {
    'User': (20, 30, 200, ['User', 'id (UUID)', 'accessToken', 'role', 'settings']),
    'Account': (270, 30, 200, ['Account', 'id', 'userId', 'currency', 'balance']),
    'Order': (520, 30, 300, ['Order (Activity)', 'id', 'accountId', 'symbolProfileId', 'type, quantity, unitPrice, date']),
    'SymbolProfile': (520, 250, 300, ['SymbolProfile', 'id', 'dataSource, symbol', 'name, currency', 'assetClass']),
    'MarketData': (20, 250, 240, ['MarketData', 'dataSource, symbol', 'date', 'marketPrice']),
}
for k, (x, y, wd, ls) in ents.items():
    h = 34 + 22 * (len(ls) - 1)
    b += f'<rect x="{x}" y="{y}" width="{wd}" height="{h}" fill="#fff" stroke="#222" stroke-width="1.5"/>'
    b += f'<rect x="{x}" y="{y}" width="{wd}" height="30" fill="#eef3fb" stroke="#222" stroke-width="1.5"/>'
    for i, l in enumerate(ls):
        yy = y + 21 if i == 0 else y + 34 + 16 + (i - 1) * 22
        b += f'<text x="{x + 10}" y="{yy}" font-size="16"{BOLD if i == 0 else ""}>{html.escape(l)}</text>'
b += arrow(220, 70, 270, 70)
b += arrow(470, 70, 520, 70)
b += arrow(670, 165, 670, 250)
b += arrow(520, 320, 260, 320, 'khớp theo dataSource và symbol')
b += '<text x="245" y="62" font-size="14" text-anchor="middle">1..n</text>'
b += '<text x="495" y="62" font-size="14" text-anchor="middle">1..n</text>'
b += '<text x="685" y="210" font-size="14">n..1</text>'
page('du-lieu', 850, 400, b)

# Hình 5.3
steps = [['Nhận yêu cầu', 'kiểm tra DTO'], ['Lấy hồ sơ', 'và khoản nắm giữ'], ['Đọc giá lịch sử', 'MarketData'],
         ['Quy đổi tiền tệ', 'theo ngày'], ['Căn chỉnh chuỗi giá', 'điền giá gần nhất'], ['Tính lợi suất', 'kỳ vọng, hiệp phương sai'],
         ['Chạy tối ưu', 'phương pháp chọn và tham chiếu'], ['Backtest', 'walk-forward, tùy chọn'], ['Trả phản hồi', 'danh mục, chỉ số, cảnh báo']]


def pos(i):
    r, c = divmod(i, 3)
    return (30 + (2 - c) * 280 if r % 2 else 30 + c * 280), 20 + r * 110, r


b = ''
for i, s in enumerate(steps):
    x, y, r = pos(i)
    b += box(x, y, 230, 70, s, '#fff6e0' if i in (6, 7) else '#eef3fb', True, 16)
    if i < 8:
        x2, y2, r2 = pos(i + 1)
        if r == r2:
            b += arrow(x + 230, y + 35, x2, y2 + 35) if r % 2 == 0 else arrow(x, y + 35, x2 + 230, y2 + 35)
        else:
            b += arrow(x + 115, y + 70, x2 + 115, y2)
page('luong-xu-ly', 850, 350, b)

# Sơ đồ tổ chức (cột dọc để chữ đủ lớn khi in rộng 155 mm)
COLS = [
    ('Sản xuất', [('Mua hàng - Cung ứng', '#fff'), ('Kỹ thuật - Sản xuất', '#fff'),
                  ('Nhà máy V1: pin, PCM', '#fff6e0'), ('Nhà máy V2: PMP, POC', '#fff6e0'),
                  ('Nhà máy V3: cảm biến, NFC, TSP', '#fff6e0')]),
    ('Kỹ thuật - Chất lượng', [('Chất lượng', '#fff'), ('EPM', '#fff')]),
    ('Hành chính - Nhân sự', [('Hành chính - Nhân sự', '#fff'), ('Pháp chế', '#fff'), ('Công nghệ thông tin', '#fff'),
                              ('Lễ tân', '#fff'), ('Công đoàn cơ sở', '#fff')]),
    ('Tài chính - Kế toán', [('Kế toán - Tài chính', '#fff')]),
    ('An toàn - Môi trường', [('An toàn - Môi trường - Sức khỏe', '#fff')]),
]
CWD, GAP = 168, 10
total = 10 + len(COLS) * (CWD + GAP)
b = box(total / 2 - 100, 10, 200, 44, ['Tổng Giám đốc'], '#fff', True, 18)
cxs = [10 + i * (CWD + GAP) + CWD / 2 for i in range(len(COLS))]
b += line(total / 2, 54, total / 2, 74) + line(cxs[0], 74, cxs[-1], 74)
maxy = 0
for cx, (s_, kids) in zip(cxs, COLS):
    b += line(cx, 74, cx, 90)
    b += box(cx - CWD / 2, 90, CWD, 64, ['Phó Tổng Giám đốc', s_], '#e9f5ea', False, 15)
    y = 154
    for i, (nm, fill) in enumerate(kids):
        b += line(cx, y, cx, y + 14)
        y += 14
        lines_ = wrap(nm)
        h = 20 + 19 * len(lines_)
        b += box(cx - CWD / 2 + 12, y, CWD - 24, h, lines_, fill, False, 15)
        y += h
    maxy = max(maxy, y)
page('so-do-to-chuc', int(total), int(maxy + 12), b)
json.dump(sizes, open('sizes.json', 'w'))
print(sizes)
