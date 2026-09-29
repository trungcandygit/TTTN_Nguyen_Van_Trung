#!/usr/bin/env python3
"""Chuyển nguồn báo cáo (Markdown mở rộng trong docs/bao-cao/src) sang OOXML.

Các chỉ thị: @H1 @H1N @H2 @H3 @TABLE @DIARY @FIG @EQ @CODE/@ENDCODE
@DATATABLE @REF. Công thức viết bằng LaTeX và được pandoc đổi sang công thức
gốc của Word (OMML), nên xem và sửa được trong Microsoft Word.
"""
import hashlib
import html
import json
import os
import re
import struct
import subprocess
import tempfile
import zipfile

MATH_NS = 'http://schemas.openxmlformats.org/officeDocument/2006/math'
WP_NS = 'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing'
A_NS = 'http://schemas.openxmlformats.org/drawingml/2006/main'
PIC_NS = 'http://schemas.openxmlformats.org/drawingml/2006/picture'
R_NS = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'

PANDOC = os.environ.get('PANDOC', 'pandoc')
_omml_cache = {}
CITE = re.compile(r'\[(P1|W\d|\d+)\]')


def esc(text):
    return html.escape(text, quote=False)


class Context:
    """Trạng thái dùng chung khi dựng: kích thước trang, kiểu, ảnh, danh sách."""

    def __init__(self, text_width_twips=9638, styles=None, first_rid=100,
                 bullet_num_id=90, number_abstract_id=91, first_num_id=200,
                 image_root='.', data=None, table_font=20):
        self.text_width = text_width_twips
        self.styles = styles or set()
        self.next_rid = first_rid
        self.bullet_num_id = bullet_num_id
        self.number_abstract_id = number_abstract_id
        self.next_num_id = first_num_id
        self.new_nums = []  # numId các danh sách đánh số mới
        self.images = []  # (tên tệp trong word/media, byte, rId)
        self.image_root = image_root
        self.data = data or {}
        self.table_font = table_font
        self.doc_pr = 1000
        self.headings = []  # (mức, chữ) để dựng mục lục
        self.cite_map = {}
        self.keep_lead = False
        self.keep_tail = 0  # số hàng cuối của bảng kế tiếp phải dính với đoạn sau

    def style(self, wanted, fallback=None):
        return wanted if wanted in self.styles else fallback

    def rid(self):
        self.next_rid += 1
        return f'rId{self.next_rid}'


# ---------------------------------------------------------------- inline

def run(text, bold=False, italic=False, code=False, size=None):
    props = ''
    if code:
        props += '<w:rFonts w:ascii="Consolas" w:hAnsi="Consolas" w:cs="Consolas"/>'
    if bold:
        props += '<w:b/><w:bCs/>'
    if italic:
        props += '<w:i/><w:iCs/>'
    if size:
        props += f'<w:sz w:val="{size}"/><w:szCs w:val="{size}"/>'
    rpr = f'<w:rPr>{props}</w:rPr>' if props else ''
    return f'<w:r>{rpr}<w:t xml:space="preserve">{esc(text)}</w:t></w:r>'


def omml_inline(latex):
    """Công thức nằm trong dòng chữ (OMML), dựng từ LaTeX bằng pandoc."""
    key = 'i:' + hashlib.md5(latex.encode()).hexdigest()
    if key in _omml_cache:
        return _omml_cache[key]
    with tempfile.TemporaryDirectory() as tmp:
        md = os.path.join(tmp, 'eq.md')
        out = os.path.join(tmp, 'eq.docx')
        with open(md, 'w', encoding='utf8') as f:
            f.write(f'${latex}$\n')
        subprocess.run([PANDOC, '-f', 'markdown', '-t', 'docx', '-o', out, md], check=True)
        xml = zipfile.ZipFile(out).read('word/document.xml').decode('utf8')
    match = re.search(r'<m:oMath>.*?</m:oMath>', xml, flags=re.S)
    if not match:
        raise RuntimeError(f'pandoc không tạo được công thức trong dòng cho: {latex}')
    fragment = match.group(0).replace('<m:oMath>', f'<m:oMath xmlns:m="{MATH_NS}">', 1)
    fragment = fragment.replace('<m:nor /><m:sty m:val="p" />', '<m:nor />')
    _omml_cache[key] = fragment
    return fragment


def inline(text, size=None, bold=False, italic=False):
    out = []
    for part in re.split(r'(`[^`]+`|\$[^$]+\$|\*\*[^*]+\*\*|//[^/]+//)', text):
        if not part:
            continue
        if len(part) > 4 and part.startswith('**') and part.endswith('**'):
            out.append(inline(part[2:-2], size=size, bold=True, italic=italic))
        elif len(part) > 4 and part.startswith('//') and part.endswith('//'):
            out.append(inline(part[2:-2], size=size, bold=bold, italic=True))
        elif len(part) > 2 and part.startswith('$') and part.endswith('$'):
            out.append(omml_inline(part[1:-1]))
        elif len(part) > 2 and part.startswith('`') and part.endswith('`'):
            out.append(run(part[1:-1], code=True, size=size, bold=bold))
        else:
            out.append(run(part, size=size, bold=bold, italic=italic))
    return ''.join(out)


def para(text='', style=None, jc=None, size=None, bold=False, italic=False,
         keep_next=False, before=None, after=None, first_line=None, raw=None,
         shd=None, num=None, keep_lines=False):
    ppr = ''
    if style:
        ppr += f'<w:pStyle w:val="{style}"/>'
    if keep_next:
        ppr += '<w:keepNext/>'
    if keep_lines:
        ppr += '<w:keepLines/>'
    if num:
        ppr += f'<w:numPr><w:ilvl w:val="0"/><w:numId w:val="{num}"/></w:numPr>'
    if shd:
        ppr += f'<w:shd w:val="clear" w:color="auto" w:fill="{shd}"/>'
    if before is not None or after is not None:
        attrs = ''
        if before is not None:
            attrs += f' w:before="{before}"'
        if after is not None:
            attrs += f' w:after="{after}"'
        ppr += f'<w:spacing{attrs}/>'
    if first_line is not None:
        ppr += f'<w:ind w:firstLine="{first_line}"/>'
    if jc:
        ppr += f'<w:jc w:val="{jc}"/>'
    ppr = f'<w:pPr>{ppr}</w:pPr>' if ppr else ''
    body = raw if raw is not None else inline(text, size=size, bold=bold, italic=italic)
    return f'<w:p>{ppr}{body}</w:p>'


# ---------------------------------------------------------------- bảng

def vi_number(value, digits=1):
    return f'{value:.{digits}f}'.replace('.', ',').replace('-', '\u2212')


def col_widths(rows, total, min_share=0.08):
    """Chia độ rộng cột theo độ dài chữ (căn cứ đoạn dài nhất, có giới hạn)."""
    count = max(len(r) for r in rows)
    weights = []
    for c in range(count):
        longest = max((len(r[c]) if c < len(r) else 0) for r in rows)
        weights.append(min(max(longest, 6), 60) ** 0.8)
    s = sum(weights)
    widths = [max(int(total * w / s), int(total * min_share)) for w in weights]
    diff = total - sum(widths)
    widths[widths.index(max(widths))] += diff
    return widths


def table_xml(rows, ctx, header=True, widths=None, borders=True, size=None,
              align_first_center=False):
    size = size or ctx.table_font
    widths = widths or col_widths(rows, ctx.text_width)
    border = ('<w:tblBorders>'
              + ''.join(f'<w:{side} w:val="single" w:sz="4" w:space="0" w:color="808080"/>'
                        for side in ('top', 'left', 'bottom', 'right', 'insideH', 'insideV'))
              + '</w:tblBorders>') if borders else ''
    xml = ('<w:tbl><w:tblPr>'
           f'<w:tblW w:w="{sum(widths)}" w:type="dxa"/>{border}'
           '<w:tblLayout w:type="fixed"/>'
           '<w:tblCellMar><w:top w:w="40" w:type="dxa"/><w:left w:w="80" w:type="dxa"/>'
           '<w:bottom w:w="40" w:type="dxa"/><w:right w:w="80" w:type="dxa"/></w:tblCellMar>'
           '</w:tblPr><w:tblGrid>'
           + ''.join(f'<w:gridCol w:w="{w}"/>' for w in widths)
           + '</w:tblGrid>')
    for r, row in enumerate(rows):
        is_head = header and r == 0
        xml += '<w:tr>'
        if is_head:
            xml = xml[:-len('<w:tr>')] + '<w:tr><w:trPr><w:cantSplit/><w:tblHeader/></w:trPr>'
        else:
            xml = xml[:-len('<w:tr>')] + '<w:tr><w:trPr><w:cantSplit/></w:trPr>'
        for c in range(len(widths)):
            cell = row[c] if c < len(row) else ''
            shade = ''
            key_cell = (not header) and c == 0 and len(widths) == 2
            cell = re.sub(r'(\S{22,})', lambda mt: mt.group(1).replace('/', '/\u200b'), cell)
            paragraphs = ''.join(
                para(line, size=size, bold=is_head or key_cell, after=20, before=20,
                     jc='center' if is_head else None,
                     keep_next=ctx.keep_tail > 0 and r >= len(rows) - ctx.keep_tail)
                for line in (cell.split('<br>') if cell else ['']))
            xml += (f'<w:tc><w:tcPr><w:tcW w:w="{widths[c]}" w:type="dxa"/>{shade}</w:tcPr>'
                    f'{paragraphs}</w:tc>')
        xml += '</w:tr>'
    return xml + '</w:tbl>'


def signature_xml(left, right, ctx):
    width = ctx.text_width // 2
    return table_xml([[left, right]], ctx, header=False, widths=[width, ctx.text_width - width],
                     borders=False, size=24)


# ---------------------------------------------------------------- công thức



def omml(latex):
    key = hashlib.md5(latex.encode()).hexdigest()
    if key in _omml_cache:
        return _omml_cache[key]
    with tempfile.TemporaryDirectory() as tmp:
        md = os.path.join(tmp, 'eq.md')
        out = os.path.join(tmp, 'eq.docx')
        with open(md, 'w', encoding='utf8') as f:
            f.write(f'$${latex}$$\n')
        subprocess.run([PANDOC, '-f', 'markdown', '-t', 'docx', '-o', out, md], check=True)
        xml = zipfile.ZipFile(out).read('word/document.xml').decode('utf8')
    match = re.search(r'<m:oMathPara>.*?</m:oMathPara>', xml, flags=re.S)
    if not match:
        match = re.search(r'<m:oMath>.*?</m:oMath>', xml, flags=re.S)
        fragment = f'<m:oMathPara>{match.group(0)}</m:oMathPara>' if match else None
    else:
        fragment = match.group(0)
    if not fragment:
        raise RuntimeError(f'pandoc không tạo được công thức cho: {latex}')
    fragment = fragment.replace('<m:oMathPara>', f'<m:oMathPara xmlns:m="{MATH_NS}">', 1)
    fragment = fragment.replace('<m:nor /><m:sty m:val="p" />', '<m:nor />')
    _omml_cache[key] = fragment
    return fragment


def equation_xml(latex, number, ctx):
    side = int(ctx.text_width * 0.08)
    mid = ctx.text_width - 2 * side
    math = f'<w:p><w:pPr><w:jc w:val="center"/></w:pPr>{omml(latex)}</w:p>'
    number_p = para(number, jc='right', size=24)
    return ('<w:tbl><w:tblPr>'
            f'<w:tblW w:w="{ctx.text_width}" w:type="dxa"/><w:tblLayout w:type="fixed"/>'
            '</w:tblPr><w:tblGrid>'
            f'<w:gridCol w:w="{side}"/><w:gridCol w:w="{mid}"/><w:gridCol w:w="{side}"/>'
            '</w:tblGrid><w:tr><w:trPr><w:cantSplit/></w:trPr>'
            f'<w:tc><w:tcPr><w:tcW w:w="{side}" w:type="dxa"/></w:tcPr>{para("")}</w:tc>'
            f'<w:tc><w:tcPr><w:tcW w:w="{mid}" w:type="dxa"/><w:vAlign w:val="center"/></w:tcPr>{math}</w:tc>'
            f'<w:tc><w:tcPr><w:tcW w:w="{side}" w:type="dxa"/><w:vAlign w:val="center"/></w:tcPr>{number_p}</w:tc>'
            '</w:tr></w:tbl>') + para('', after=60)


# ---------------------------------------------------------------- hình

def png_size(data):
    if data[:8] != b'\x89PNG\r\n\x1a\n':
        raise ValueError('không phải PNG')
    return struct.unpack('>II', data[16:24])


def figure_xml(path, caption, ctx, max_w_cm=15.5, max_h_cm=18.5, source=None):
    full = path if os.path.isabs(path) else os.path.join(ctx.image_root, path)
    data = open(full, 'rb').read()
    width, height = png_size(data)
    scale = min(max_w_cm * 360000 / width, max_h_cm * 360000 / height)
    cx, cy = int(width * scale), int(height * scale)
    rid = ctx.rid()
    name = f'image{len(ctx.images) + 1}.png'
    ctx.images.append((name, data, rid))
    ctx.doc_pr += 1
    drawing = (
        '<w:r><w:drawing>'
        f'<wp:inline xmlns:wp="{WP_NS}" distT="0" distB="0" distL="0" distR="0">'
        f'<wp:extent cx="{cx}" cy="{cy}"/>'
        f'<wp:docPr id="{ctx.doc_pr}" name="Hình {ctx.doc_pr}" descr="{esc(caption)}"/>'
        f'<a:graphic xmlns:a="{A_NS}"><a:graphicData uri="{PIC_NS}">'
        f'<pic:pic xmlns:pic="{PIC_NS}"><pic:nvPicPr><pic:cNvPr id="{ctx.doc_pr}" name="{name}"/>'
        '<pic:cNvPicPr/></pic:nvPicPr>'
        f'<pic:blipFill><a:blip xmlns:r="{R_NS}" r:embed="{rid}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>'
        f'<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="{cx}" cy="{cy}"/></a:xfrm>'
        '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic>'
        '</a:graphicData></a:graphic></wp:inline></w:drawing></w:r>')
    return (para('', jc='center', raw=drawing, keep_next=True, before=120, after=40)
            + caption_xml(caption, ctx, source=source))


CAP_HEAD = re.compile(r'^((?:Bảng|Hình) [\w.]+\. [^.]*\.?)')


def caption_xml(text, ctx, above=False, source=None):
    """Chú thích dạng tiêu đề: bảng dùng Heading 4, hình dùng Heading 5.

    Nhãn và tên in đậm nằm trong đoạn tiêu đề để Word dựng danh mục bảng, hình. Phần giải thích và
    dòng Nguồn (in nghiêng) nằm ở đoạn thường ngay sau đó.
    """
    is_table = text.startswith('Bảng')
    style = 'Heading4' if is_table else 'Heading5'
    mt = CAP_HEAD.match(text)
    head, rest = (mt.group(1), text[mt.end():].strip()) if mt else (text, '')
    rpr = '<w:rPr><w:b/><w:bCs/><w:i w:val="0"/><w:iCs w:val="0"/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr>'
    head_p = (f'<w:p><w:pPr><w:pStyle w:val="{style}"/><w:keepNext/>'
              '<w:numPr><w:ilvl w:val="0"/><w:numId w:val="0"/></w:numPr>'
              f'<w:spacing w:before="{160 if above else 60}" w:after="{60 if above else 40}"/>'
              '<w:ind w:left="0" w:firstLine="0"/><w:jc w:val="center"/></w:pPr>'
              f'<w:r>{rpr}<w:t xml:space="preserve">{esc(head)}</w:t></w:r></w:p>')
    if not above:
        head_p = head_p.replace('<w:keepNext/>', '', 1)
    tail = ''
    if rest:
        tail += inline(rest, size=22)
    if source:
        tail += ('<w:r><w:br/></w:r>' if rest else '') + inline(source, size=22)
    if tail:
        head_p += para('', jc='center', raw=tail, before=0, after=160, keep_lines=True)
    return head_p


# ---------------------------------------------------------------- bảng dữ liệu

def data_table(key, ctx):
    data = ctx.data
    if not data:
        return para(f'[bảng dữ liệu {key} chưa có, hãy chạy gen_data.py]', italic=True)
    pct = lambda x, d=1: vi_number(x * 100, d) + '%'
    if key == 'opt_compare':
        rows = [['Danh mục', 'Lợi suất năm', 'Biến động năm', 'Sharpe', 'CVaR 95% ngày', 'Sụt giảm tối đa']]
        seen = set()
        for p in data['portfolios']:
            m = p['metrics']
            sig = tuple(round(v, 8) for v in m.values() if isinstance(v, (int, float)))
            if p['label'].startswith('Kết quả') or sig in seen:
                continue
            seen.add(sig)
            rows.append([p['label'], pct(m['annualReturn']), pct(m['annualVolatility']),
                         vi_number(m['sharpe'], 2), pct(m['cvar95'], 2), pct(m['maxDrawdown'])])
        caption = ('Bảng 5.9. So sánh các danh mục trên dữ liệu trong mẫu (tài khoản demo-user-12, '
                   'tám khoản nắm giữ lớn nhất, hai năm dữ liệu mô phỏng, tỷ trọng tối đa 40%)')
        return (caption_xml(caption, ctx, above=True)
                + table_xml(rows, ctx, widths=[int(ctx.text_width * s) for s in (0.30, 0.13, 0.14, 0.12, 0.15, 0.16)])
                + para('', after=60))
    if key == 'weights_table':
        byname = {p['label']: p for p in data['portfolios']}
        cols = [('Hiện tại', 'Danh mục hiện tại'), ('Chia đều', 'Chia đều (1/N)'), ('Nghịch đảo BĐ', 'Nghịch đảo biến động'),
                ('Cân bằng RR', 'Cân bằng rủi ro'), ('Sharpe tối đa', 'Markowitz: Sharpe tối đa')]
        rows = [['Tài sản', 'Lợi suất năm', 'Biến động năm'] + [c[0] for c in cols]]
        for i, a in enumerate(data['assets']):
            rows.append([a['name'].replace(' (dữ liệu mẫu)', ''), pct(a['annualReturn']), pct(a['annualVolatility'])]
                        + [pct(byname[c[1]]['weights'][i]) for c in cols])
        caption = ('Bảng 5.10. Thống kê từng tài sản và tỷ trọng của năm danh mục trong Bảng 5.9 '
                   '(BĐ: biến động; RR: rủi ro)')
        return (caption_xml(caption, ctx, above=True) + table_xml(rows, ctx) + para('', after=60))
    if key == 'backtest_compare':
        bt = data.get('backtest')
        if not bt:
            return para('[không có dữ liệu backtest]', italic=True)
        rows = [['Chiến lược', 'Tổng lợi suất', 'Lợi suất năm', 'Biến động năm', 'Sharpe', 'Sụt giảm tối đa']]
        for r in bt['metrics']:
            m = r['metrics']
            rows.append([r['label'], pct(m['totalReturn']), pct(m['annualReturn']),
                         pct(m['annualVolatility']), vi_number(m['sharpe'], 2), pct(m['maxDrawdown'])])
        caption = (f'Bảng 5.11. Kết quả backtest walk-forward ngoài mẫu (cửa sổ {bt["lookbackDays"]} ngày, '
                   f'cân bằng lại mỗi {bt["rebalanceEveryDays"]} ngày, {bt["rebalances"]} lần, giai đoạn ngoài mẫu '
                   f'{len(bt["dates"])} ngày; lợi suất năm là trung bình lợi suất ngày nhân 252, tổng lợi suất là tích lũy các kỳ)')
        return caption_xml(caption, ctx, above=True) + table_xml(rows, ctx) + para('', after=60)
    raise KeyError(key)


# ---------------------------------------------------------------- trích dẫn

def renumber(texts):
    """Đánh số trích dẫn theo thứ tự xuất hiện đầu tiên, trả về (ánh xạ, các văn bản mới)."""
    mapping = {}

    def sub(match):
        label = match.group(1)
        if label not in mapping:
            mapping[label] = len(mapping) + 1
        return f'[{mapping[label]}]'

    return mapping, [CITE.sub(sub, t) for t in texts]


# ---------------------------------------------------------------- phân tích nguồn

def parse_blocks(text):
    """Tách nguồn thành các khối (kind, payload)."""
    lines = text.split('\n')
    i, blocks = 0, []
    while i < len(lines):
        line = lines[i].rstrip()
        if not line:
            i += 1
            continue
        m = re.match(r'@(H1N|H1|H2|H3)\s+(.*)$', line)
        if m:
            blocks.append((m.group(1), m.group(2)))
            i += 1
            continue
        m = re.match(r'@TABLE(?:\s+(.*))?$', line)
        if m:
            caption = (m.group(1) or '').strip()
            rows = []
            i += 1
            while i < len(lines) and lines[i].lstrip().startswith('|'):
                cells = [c.strip() for c in lines[i].strip().strip('|').split(' | ')]
                rows.append(cells)
                i += 1
            blocks.append(('TABLE', (caption, rows)))
            continue
        m = re.match(r'@DIARY\s+(.*)$', line)
        if m:
            rows = []
            i += 1
            while i < len(lines) and lines[i].lstrip().startswith('|'):
                cells = [c.strip() for c in lines[i].strip().strip('|').split(' | ')]
                rows.append(cells)
                i += 1
            blocks.append(('DIARY', (m.group(1).strip(), rows)))
            continue
        m = re.match(r'@FIG\s+(.*?)\s*\|\s*(.*)$', line)
        if m:
            blocks.append(('FIG', (m.group(1).strip(), m.group(2).strip())))
            i += 1
            continue
        m = re.match(r'@FIGEMPTY\s+(.*?)\s*\|\s*(.*)$', line)
        if m:
            blocks.append(('FIGEMPTY', (m.group(1).strip(), m.group(2).strip())))
            i += 1
            continue
        m = re.match(r'@EQ\s+(.*?)\s*\|\s*(\(\d+\))\s*$', line)
        if m:
            blocks.append(('EQ', (m.group(1).strip(), m.group(2))))
            i += 1
            continue
        if line.startswith('@CODE'):
            code = []
            i += 1
            while i < len(lines) and not lines[i].startswith('@ENDCODE'):
                code.append(lines[i])
                i += 1
            i += 1
            blocks.append(('CODE', code))
            continue
        m = re.match(r'@DATATABLE\s+(\w+)$', line)
        if m:
            blocks.append(('DATATABLE', m.group(1)))
            i += 1
            continue
        m = re.match(r'@REF\s+(\S+)\s*\|\s*(.*)$', line)
        if m:
            blocks.append(('REF', (m.group(1), m.group(2))))
            i += 1
            continue
        if re.match(r'^-\s+', line):
            items = []
            while i < len(lines) and re.match(r'^-\s+', lines[i]):
                items.append(re.sub(r'^-\s+', '', lines[i]).rstrip())
                i += 1
            blocks.append(('BULLETS', items))
            continue
        if re.match(r'^\d+\.\s+', line):
            items = []
            while i < len(lines) and re.match(r'^\d+\.\s+', lines[i]):
                items.append(re.sub(r'^\d+\.\s+', '', lines[i]).rstrip())
                i += 1
            blocks.append(('NUMBERED', items))
            continue
        if re.match(r'^[^|@`]+ \| [^|]+$', line) and not line.startswith('|'):
            left, right = line.split(' | ')
            blocks.append(('SIGN', (left.strip(), right.strip())))
            i += 1
            continue
        paragraph = [line]
        i += 1
        while i < len(lines) and lines[i].strip() and not lines[i].startswith(('@', '- ', '|')) \
                and not re.match(r'^\d+\.\s+', lines[i]):
            paragraph.append(lines[i].strip())
            i += 1
        blocks.append(('P', ' '.join(paragraph)))
    return blocks


DIARY_HEAD = ['Ngày', 'Tóm tắt hoạt động thực tập', 'Quy định khung tham chiếu (TCVN, QCVN, ISO…)',
              'Kết quả hoạt động', 'Phân tích, giải thích, kết luận', 'Xác nhận của CBHD']


def render(blocks, ctx, refs=None):
    """Sinh danh sách đoạn XML từ các khối."""
    out = []
    for kind, payload in blocks:
        if kind in ('H1', 'H1N', 'H2', 'H3'):
            style = {'H1': ctx.style('Heading1', 'Heading1'), 'H1N': ctx.style('Heading1N', ctx.style('Heading1', 'Heading1')),
                     'H2': ctx.style('Heading2', 'Heading2'), 'H3': ctx.style('Heading3')}[kind]
            level = {'H1': 1, 'H1N': 1, 'H2': 2, 'H3': 3}[kind]
            ctx.headings.append((level, payload, kind))
            out.append(para(payload, style=style, keep_next=True, size=None if style else 26,
                            bold=not style))
        elif kind == 'P':
            out.append(para(payload, style=ctx.style('Content'), jc='both',
                            first_line=567 if len(payload) > 90 else None, after=120,
                            keep_next=(payload.startswith('Ngày ') and len(payload) < 40) or ctx.keep_lead))
        elif kind == 'BULLETS':
            for item in payload:
                out.append(para(item, style=ctx.style('ListParagraph'), num=ctx.bullet_num_id, jc='both', after=60))
        elif kind == 'NUMBERED':
            num_id = ctx.next_num_id
            ctx.next_num_id += 1
            ctx.new_nums.append(num_id)
            for item in payload:
                out.append(para(item, style=ctx.style('ListParagraph'), num=num_id, jc='both', after=60))
        elif kind == 'TABLE':
            caption, rows = payload
            if caption:
                out.append(caption_xml(caption, ctx, above=True))
                out.append(table_xml(rows, ctx, header=True))
            else:
                out.append(table_xml(rows, ctx, header=False))
            out.append(para('', after=60))
        elif kind == 'DIARY':
            title, rows = payload
            ctx.headings.append((2, title, 'H2'))
            out.append(para(title, style=ctx.style('Heading2', 'Heading2'), keep_next=True))
            full = [DIARY_HEAD] + [r[:5] + [''] * (6 - len(r[:5])) for r in rows]
            widths = [int(ctx.text_width * s) for s in (0.10, 0.20, 0.17, 0.17, 0.24)]
            widths.append(ctx.text_width - sum(widths))
            out.append(table_xml(full, ctx, header=True, widths=widths))
            out.append(para('', after=60))
        elif kind == 'FIG':
            cap, _, src = payload[1].partition(' || ')
            out.append(figure_xml(payload[0], cap, ctx, source=src or None))
        elif kind == 'FIGEMPTY':
            caption, note = payload
            caption, _, source = caption.partition(' || ')
            box = ('<w:tbl><w:tblPr>'
                   f'<w:tblW w:w="{int(ctx.text_width * 0.9)}" w:type="dxa"/><w:jc w:val="center"/>'
                   '<w:tblBorders>'
                   + ''.join(f'<w:{s} w:val="dashed" w:sz="8" w:space="0" w:color="808080"/>'
                             for s in ('top', 'left', 'bottom', 'right'))
                   + '</w:tblBorders><w:tblLayout w:type="fixed"/></w:tblPr>'
                   f'<w:tblGrid><w:gridCol w:w="{int(ctx.text_width * 0.9)}"/></w:tblGrid>'
                   '<w:tr><w:trPr><w:cantSplit/><w:trHeight w:val="4200" w:hRule="atLeast"/></w:trPr>'
                   f'<w:tc><w:tcPr><w:tcW w:w="{int(ctx.text_width * 0.9)}" w:type="dxa"/>'
                   '<w:vAlign w:val="center"/></w:tcPr>'
                   + para(f'[{note}]', jc='center', size=22)
                   + '</w:tc></w:tr></w:tbl>')
            out.append(box)
            out.append(caption_xml(caption, ctx, source=source or None))
        elif kind == 'EQ':
            out.append(equation_xml(payload[0], payload[1], ctx))
        elif kind == 'CODE':
            for line in payload:
                out.append(para('', raw=run(line or ' ', code=True, size=20), shd='F2F2F2', before=0, after=0))
            out.append(para('', after=60))
        elif kind == 'DATATABLE':
            out.append(data_table(payload, ctx))
        elif kind == 'SIGN':
            out.append(signature_xml(payload[0], payload[1], ctx))
            out.append(para('', after=60))
    return out
