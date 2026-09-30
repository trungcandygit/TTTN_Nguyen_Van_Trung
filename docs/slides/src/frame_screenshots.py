#!/usr/bin/env python3
"""Cắt và đặt ảnh chụp giao diện BL Advisor vào khung cửa sổ trình duyệt cho slide.

Ảnh gốc lấy từ báo cáo (docs/screenshots/bao-cao và ảnh bổ sung của sinh viên); chỉ cắt vùng cần xem
và thêm khung, không chỉnh sửa nội dung ảnh.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[3]
OUT = ROOT / 'docs' / 'slides' / 'img'
SRC = ROOT / 'docs' / 'slides' / 'img' / 'goc'   # ảnh gốc từ báo cáo


def frame(im, title='BL Advisor', radius=14, bar=24, phone=False):
    im = im.convert('RGB')
    w, h = im.size
    pad = 26
    if phone:
        body = Image.new('RGBA', (w, h), (255, 255, 255, 255))
        body.paste(im, (0, 0))
        W, H = w + 2 * 18, h + 2 * 18
        canvas = Image.new('RGBA', (W + 2 * pad, H + 2 * pad), (255, 255, 255, 0))
        shadow = Image.new('RGBA', canvas.size, (0, 0, 0, 0))
        ImageDraw.Draw(shadow).rounded_rectangle((pad, pad + 6, pad + W, pad + H + 6), 42, fill=(0, 0, 0, 90))
        canvas = Image.alpha_composite(canvas, shadow.filter(ImageFilter.GaussianBlur(10)))
        d = ImageDraw.Draw(canvas)
        d.rounded_rectangle((pad, pad, pad + W, pad + H), 42, fill=(35, 38, 45, 255))
        mask = Image.new('L', (w, h), 0)
        ImageDraw.Draw(mask).rounded_rectangle((0, 0, w, h), 28, fill=255)
        canvas.paste(body, (pad + 18, pad + 18), mask)
        return canvas
    W, H = w, h + bar
    win = Image.new('RGBA', (W, H), (255, 255, 255, 255))
    d = ImageDraw.Draw(win)
    d.rectangle((0, 0, W, bar), fill=(238, 240, 243, 255))
    for i, c in enumerate([(255, 95, 86), (255, 189, 46), (39, 201, 63)]):
        d.ellipse((14 + i * 18, bar // 2 - 5, 24 + i * 18, bar // 2 + 5), fill=c)
    d.rounded_rectangle((W // 2 - 130, 5, W // 2 + 130, bar - 5), 8, fill=(255, 255, 255, 255))
    win.paste(im, (0, bar))
    mask = Image.new('L', (W, H), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, W, H), radius, fill=255)
    canvas = Image.new('RGBA', (W + 2 * pad, H + 2 * pad), (255, 255, 255, 0))
    shadow = Image.new('RGBA', canvas.size, (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle((pad, pad + 6, pad + W, pad + H + 6), radius, fill=(0, 0, 0, 80))
    canvas = Image.alpha_composite(canvas, shadow.filter(ImageFilter.GaussianBlur(9)))
    canvas.paste(win, (pad, pad), mask)
    ImageDraw.Draw(canvas).rounded_rectangle((pad, pad, pad + W, pad + H), radius, outline=(208, 215, 222, 255), width=2)
    return canvas


JOBS = [
    ('tong-quan', 'tong-quan.png', (380, 230, 1250, 830)),
    ('giao-dich-so', 'them-giao-dich.png', (300, 500, 1095, 650)),
    ('phan-tich-kpi', 'phan-tich.png', (250, 60, 1400, 322)),
    ('fire-ketqua', 'fire.png', (250, 695, 1340, 830)),
    ('xray-dau', 'x-ray.png', (250, 90, 1400, 385)),
    ('form-tham-so', 'toi-uu-form.png', (255, 520, 1372, 690)),
    ('form-backtest', 'toi-uu-form.png', (255, 700, 1372, 870)),
    ('bl-quan-diem', 'bl-quan-diem.png', (255, 335, 1372, 690)),
    ('thi-truong', 'thi-truong.png', (340, 60, 1290, 395)),
    ('chon-tai-san', 'toi-uu-form.png', (255, 200, 1372, 500)),
    ('phan-bo-bl', 'phan-bo-bl.png', None),
    ('ket-qua-bl', 'ket-qua-bl.png', (0, 630, 1341, 1286)),
    # ảnh toàn màn hình (không cắt), dùng cho các slide sản phẩm
    ('full-tong-quan', 'tong-quan.png', None),
    ('full-phan-tich', 'phan-tich.png', (0, 0, 1400, 940)),
    ('full-giao-dich', 'them-giao-dich.png', None),
    ('full-thi-truong', 'thi-truong.png', None),
    ('full-fire', 'fire.png', None),
    ('full-xray', 'x-ray.png', None),
    ('full-toi-uu', 'toi-uu-form.png', None),
    ('full-bl', 'bl-quan-diem.png', None),
    ('quan-tri', 'quan-tri.png', None),
]
if __name__ == '__main__':
    for name, src, box in JOBS:
        path = SRC / src
        im = Image.open(path)
        if box:
            im = im.crop(box)
        frame(im).save(OUT / f'fr-{name}.png')
        print('fr-' + name, im.size)
    Image.open(SRC / 'di-dong.png')
    frame(Image.open(SRC / 'di-dong.png'), phone=True).save(OUT / 'fr-di-dong.png')
    print('fr-di-dong')
