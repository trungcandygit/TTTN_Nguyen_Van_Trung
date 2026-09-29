#!/usr/bin/env python3
"""Ráp báo cáo thực tập từ mẫu của khoa (MauBaoCaoTTTN) và nguồn Markdown mở rộng.

Quy trình theo kỹ năng docx: giải nén mẫu, gộp run, sửa word/document.xml,
thêm ảnh, đánh số, nén lại. Chạy: python3 assemble.py MAU.docx RA.docx [--pages pages.json]
"""
import glob
import json
import os
import re
import shutil
import subprocess
import sys
import zipfile

import md2ooxml as m
from html import unescape as html_unescape

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, 'src')
WORK = '/tmp/rep/build'
SKILL = glob.glob('/root/.claude/skills/synced/*/docx/scripts')[0]
DATE_TEXT = 'Hà Nội, ngày 29 tháng 9 năm 2026'

template, out_path = sys.argv[1], sys.argv[2]
pages = {}
if '--pages' in sys.argv:
    pages = json.load(open(sys.argv[sys.argv.index('--pages') + 1], encoding='utf8'))

# ------------------------------------------------------------ giải nén, gộp run
shutil.rmtree(WORK, ignore_errors=True)
os.makedirs(WORK)
with zipfile.ZipFile(template) as z:
    z.extractall(WORK)
for link in glob.glob(WORK + '/**', recursive=True):
    if os.path.islink(link):
        os.unlink(link)
subprocess.run([sys.executable, os.path.join(SKILL, 'merge_runs.py'), WORK], check=True,
               stdout=subprocess.DEVNULL)

doc_path = f'{WORK}/word/document.xml'
xml = open(doc_path, encoding='utf8').read()
b0 = xml.index('<w:body>') + len('<w:body>')
b1 = xml.rindex('</w:body>')
head, body, tail = xml[:b0], xml[b0:b1], xml[b1:]

TOKEN = re.compile(r'<(/?)w:(p|tbl|sdt|sectPr)\b[^>]*?(/?)>')


def split_top(text):
    elements, depth, start, current = [], 0, None, None
    for mt in TOKEN.finditer(text):
        closing, tag, selfclose = mt.group(1), mt.group(2), mt.group(3)
        if depth == 0 and not closing:
            start, current = mt.start(), tag
            if selfclose:
                elements.append(text[start:mt.end()])
                continue
            depth = 1
        elif tag == current and not closing and not selfclose:
            depth += 1
        elif tag == current and closing:
            depth -= 1
            if depth == 0:
                elements.append(text[start:mt.end()])
    return elements


E = split_top(body)
assert len(E) == 211, len(E)

# ------------------------------------------------------------ tiện ích sửa đoạn
def ppr_of(p):
    mt = re.search(r'<w:pPr>.*?</w:pPr>', p, flags=re.S)
    return mt.group(0) if mt else ''


def open_tag(p):
    return re.match(r'<w:p\b[^>]*>', p).group(0)


def rebuild(p, runs):
    return f'{open_tag(p)}{ppr_of(p)}{runs}</w:p>'


def sect_only(p):
    return rebuild(p, '')


def r(text, rpr=''):
    return f'<w:r>{rpr}<w:t xml:space="preserve">{m.esc(text)}</w:t></w:r>'


TAB = '<w:r><w:tab/></w:r>'


def fill_line(p, segments, rpr=''):
    """Dựng lại đoạn có tab dẫn chấm: segments là chuỗi chữ hoặc None (tab)."""
    runs = ''.join(TAB if s is None else r(s, rpr) for s in segments)
    return rebuild(p, runs)


RPR_INFO = '<w:rPr><w:color w:val="000000"/><w:szCs w:val="26"/></w:rPr>'
RPR28 = '<w:rPr><w:sz w:val="28"/><w:szCs w:val="28"/></w:rPr>'

# ------------------------------------------------------------ trang bìa
E[14] = rebuild(E[14], r('CÔNG TY TNHH ITM SEMICONDUCTOR VIETNAM',
                         '<w:rPr><w:b w:val="0"/><w:bCs/><w:sz w:val="28"/><w:szCs w:val="8"/></w:rPr>') + TAB)
E[15] = fill_line(E[15], ['Địa chỉ: Số 06, đường 11, KCN VSIP Bắc Ninh', None], RPR28)
E[17] = fill_line(E[17], ['Cán bộ hướng dẫn tại công ty/đơn vị: ThS. Nguyễn Bá Luận', None])
E[18] = fill_line(E[18], ['Giảng viên phối hợp của học viện: ThS. Vũ Hoài Thư', None])
E[21] = fill_line(E[21], ['Sinh viên thực hiện: Nguyễn Văn Trung', None])
E[22] = fill_line(E[22], ['Mã số sinh viên: K23DTCN418', None])
E[23] = fill_line(E[23], ['Lớp: D23TXCN07K', None, 'Niên khóa: 2023 - 2028', None])
E[24] = fill_line(E[24], ['Ngành: Công nghệ thông tin', None])
E[27] = re.sub(r'(<w:r\b[^>]*>.*)(<w:r\b[^>]*><w:rPr><w:sz w:val="24"/></w:rPr><w:br w:type="page"/></w:r>)</w:p>$',
               lambda mt: r(DATE_TEXT) + mt.group(2) + '</w:p>',
               open_tag(E[27]) + ppr_of(E[27]) + '<w:r><w:x/></w:r>'
               + '<w:r><w:rPr><w:sz w:val="24"/></w:rPr><w:br w:type="page"/></w:r></w:p>', flags=re.S)

# ------------------------------------------------------------ thông tin chung
E[30] = fill_line(E[30], ['Họ và tên sinh viên', None, ':', ' Nguyễn Văn Trung', None, 'Mã sinh viên:', ' K23DTCN418', None], RPR_INFO)
E[31] = fill_line(E[31], ['Lớp', None, ':', ' D23TXCN07K', None, 'Khóa:', ' D23', None], RPR_INFO)
E[32] = fill_line(E[32], ['Chuyên ngành', None, ':', ' Công nghệ thông tin', None, 'Mã chuyên ngành:', ' 7480201', None], RPR_INFO)
E[33] = fill_line(E[33], ['SĐT', None, ':', ' 0355347831', None], RPR_INFO)
E[34] = fill_line(E[34], ['Email', None, ':', ' 15233582@st.neu.edu.vn', None], RPR_INFO)
E[35] = fill_line(E[35], ['Tên dự án - project', None, ':', ' BL Advisor: theo dõi danh mục và tối ưu hóa phân bổ tài sản', None], RPR_INFO)
E[37] = fill_line(E[37], ['Người hướng dẫn', None, ':', ' ThS. Nguyễn Bá Luận', None], RPR_INFO)
E[41] = fill_line(E[41], ['Cơ quan công tác', None, ':', ' Công ty TNHH ITM Semiconductor Vietnam', None], RPR_INFO)
E[43] = re.sub(r'<w:r\b.*</w:r>', '', E[43], flags=re.S)
E[43] = rebuild(E[43], r(DATE_TEXT, '<w:rPr><w:i/><w:szCs w:val="26"/></w:rPr>'))

for _i in list(range(13, 25)) + list(range(30, 42)):
    E[_i] = E[_i].replace(' w:leader="dot"', '').replace('w:val="right" w:pos="5529"', 'w:val="left" w:pos="5529"')

# ------------------------------------------------------------ nguồn nội dung
sys.path.insert(0, HERE)
files = ['00_front', '01_phan1_phan2_phan3', '02_phan4_nhat_ky', '03_phan5_a', '04_phan5_b',
         '05_phan5_c', '05b_cong_trinh', '06_tai_lieu_tham_khao', '07_phu_luc']
blocks_by_file = {f: m.parse_blocks(open(f'{SRC}/{f}.md', encoding='utf8').read()) for f in files}

data = json.load(open(f'{HERE}/data.json', encoding='utf8'))
styles_xml = open(f'{WORK}/word/styles.xml', encoding='utf8').read()
styles_xml = re.sub(r'(<w:style [^>]*w:styleId="TOC2".*?)<w:i/><w:iCs/>', r'\1', styles_xml, count=1, flags=re.S)
styles_xml = re.sub(r'(<w:style [^>]*w:styleId="Heading3".*?<w:rPr><w:b/><w:bCs/>)<w:i/>', r'\1', styles_xml, count=1, flags=re.S)
open(f'{WORK}/word/styles.xml', 'w', encoding='utf8').write(styles_xml)
style_ids = set(re.findall(r'w:styleId="([^"]+)"', styles_xml))
ctx = m.Context(styles=style_ids, image_root=HERE, data=data, first_rid=100)
PORTRAIT, LANDSCAPE = 8788, 13437

# đánh số trích dẫn theo thứ tự xuất hiện đầu tiên trong toàn tài liệu
mapping = {}


def cite_sub(mt):
    label = mt.group(1)
    if label not in mapping:
        mapping[label] = len(mapping) + 1
    return f'[{mapping[label]}]'


def sort_groups(text):
    def fix(mt):
        nums = sorted(int(x) for x in re.findall(r'\d+', mt.group(0)))
        return ', '.join(f'[{n}]' for n in nums)
    return re.sub(r'\[\d+\](?:, \[\d+\])+', fix, text)


def walk(obj):
    if isinstance(obj, str):
        return sort_groups(m.CITE.sub(cite_sub, obj))
    if isinstance(obj, list):
        return [walk(x) for x in obj]
    if isinstance(obj, tuple):
        return tuple(walk(x) for x in obj)
    return obj


refs = {}
SHOT = 'Nguồn: Ảnh chụp màn hình BL Advisor do sinh viên thực hiện, bản dựng cuối của đợt thực tập, dữ liệu demo.'


def fig_source(path):
    if path.endswith('so-do-to-chuc.png'):
        return 'Nguồn: Sinh viên vẽ lại theo mô tả trong [W7].'
    if path.startswith('hinh/'):
        return 'Nguồn: Sinh viên tự vẽ.'
    return SHOT
order = [('00_front'), ('01_phan1_phan2_phan3'), ('02_phan4_nhat_ky'), ('03_phan5_a'), ('04_phan5_b'), ('05_phan5_c'), ('05b_cong_trinh'), ('07_phu_luc')]
for f in order:
    new = []
    for kind, payload in blocks_by_file[f]:
        if kind in ('H1', 'H1N', 'H2', 'H3', 'CODE', 'EQ', 'DATATABLE'):
            new.append((kind, payload))
        elif kind == 'FIGEMPTY':
            new.append((kind, (payload[0] + ' || ' + fig_source('screenshots/'), payload[1])))
        elif kind == 'FIG':
            path = payload[0]
            if path.startswith('screenshots/'):
                path = '../screenshots/bao-cao/' + path[len('screenshots/'):]
            new.append((kind, (path, walk(payload[1] + ' || ' + fig_source(path)))))
        else:
            new.append((kind, walk(payload)))
    blocks_by_file[f] = new
for kind, payload in blocks_by_file['06_tai_lieu_tham_khao']:
    if kind == 'REF':
        refs[payload[0]] = payload[1]
missing = [k for k in refs if k not in mapping]
assert not missing, f'nguồn không được trích dẫn: {missing}'
unknown = [k for k in mapping if k not in refs]
assert not unknown, f'trích dẫn không có nguồn: {unknown}'

# ------------------------------------------------------------ dựng nội dung
NUM_PREFIX = re.compile(r'^\d+(\.\d+)*\.?\s+')
h1_count = 0
toc = []  # (mức, số, chữ)


def strip_blocks(blocks):
    out = []
    for kind, payload in blocks:
        if kind in ('H2', 'H3'):
            payload = NUM_PREFIX.sub('', payload)
        out.append((kind, payload))
    return out


def gen(blocks, width, front=False, page_break_h1n=False):
    """Sinh XML cho một danh sách khối. Trả về chuỗi các phần tử."""
    global h1_count
    ctx.text_width = width
    pieces = []
    h2_count = 0
    under_h1n = False
    blocks = strip_blocks(blocks)
    for idx, (kind, payload) in enumerate(blocks):
        nxt = blocks[idx + 1] if idx + 1 < len(blocks) else None
        ctx.keep_lead = kind == 'P' and bool(nxt) and nxt[0] == 'EQ'
        ctx.keep_tail = 2 if (kind == 'TABLE' and nxt and nxt[0] == 'P' and nxt[1].startswith('Ngày ')) else 0
        if kind == 'H1':
            h1_count += 1
            h2_count = 0
            under_h1n = False
            toc.append((1, f'PHẦN {h1_count}', payload))
        elif kind == 'H1N':
            under_h1n = True
            toc.append((1, '', payload))
        elif kind == 'H2':
            if under_h1n or False:
                toc.append((2, '', payload))
            else:
                h2_count += 1
                toc.append((2, f'{h1_count}.{h2_count}', payload))
        elif kind == 'DIARY':
            toc.append((2, '', payload[0]))
        xml_parts = m.render([(kind, payload)], ctx)
        for x in xml_parts:
            if kind in ('H1', 'H1N'):
                extra = '<w:ind w:left="0" w:firstLine="0"/><w:jc w:val="center"/>'
                if kind == 'H1N' and page_break_h1n:
                    x = x.replace('<w:keepNext/>', '<w:keepNext/><w:pageBreakBefore/>', 1)
                x = x.replace('</w:pPr>', extra + '</w:pPr>', 1)
            elif (kind == 'H2' and under_h1n) or kind == 'DIARY':
                if x.startswith('<w:p>') and 'Heading2' in x[:120]:
                    x = x.replace('<w:keepNext/>', '<w:keepNext/><w:numPr><w:ilvl w:val="0"/><w:numId w:val="0"/></w:numPr>', 1)
                    x = x.replace('</w:pPr>', '<w:ind w:left="0" w:firstLine="0"/></w:pPr>', 1)
            pieces.append(x)
    return ''.join(pieces)


def split_h1(blocks):
    parts, cur = [], []
    for b in blocks:
        if b[0] == 'H1' and cur:
            parts.append(cur)
            cur = []
        cur.append(b)
    parts.append(cur)
    return parts


def find_h1n(blocks, title):
    """Trả về khối từ H1N có tiêu đề title đến H1N kế tiếp."""
    out, on = [], False
    for b in blocks:
        if b[0] == 'H1N':
            on = b[1] == title
        if on:
            out.append(b)
    return out


front = blocks_by_file['00_front']
thanks = find_h1n(front, 'LỜI CẢM ƠN')[1:]  # bỏ tiêu đề, dùng tiêu đề của mẫu
abbr = find_h1n(front, 'DANH MỤC TỪ VIẾT TẮT')
summ = find_h1n(front, 'TÓM TẮT')
abst = find_h1n(front, 'ABSTRACT')

toc_front = [(1, '', 'THÔNG TIN CHUNG'), (1, '', 'THÔNG TIN VỀ HỌC PHẦN THỰC TẬP TỐT NGHIỆP'),
             (1, '', 'LỜI CẢM ƠN'), (1, '', 'MỤC LỤC'), (1, '', 'DANH MỤC BẢNG'), (1, '', 'DANH MỤC HÌNH')]

thanks_xml = gen(thanks, PORTRAIT)
abbr_xml = gen(abbr, PORTRAIT, page_break_h1n=True)
summ_xml = gen(summ, PORTRAIT, page_break_h1n=True)
abst_xml = gen(abst, PORTRAIT, page_break_h1n=True)

p123 = split_h1(blocks_by_file['01_phan1_phan2_phan3'])
assert len(p123) == 3
phan1 = gen(p123[0], PORTRAIT)
phan2 = gen(p123[1], LANDSCAPE)
phan3 = gen(p123[2], PORTRAIT)
phan4 = gen(blocks_by_file['02_phan4_nhat_ky'], LANDSCAPE)
phan5 = gen(blocks_by_file['03_phan5_a'] + blocks_by_file['04_phan5_b'] + blocks_by_file['05_phan5_c'], PORTRAIT)

cong_trinh = gen(blocks_by_file['05b_cong_trinh'], PORTRAIT, page_break_h1n=True)

# tài liệu tham khảo (IEEE), theo thứ tự trích dẫn
toc.append((1, '', 'TÀI LIỆU THAM KHẢO'))
ref_xml = m.para('TÀI LIỆU THAM KHẢO', style=ctx.style('Heading1N', 'Heading1'), keep_next=True)
ref_xml = ref_xml.replace('<w:keepNext/>', '<w:keepNext/><w:pageBreakBefore/>', 1).replace(
    '</w:pPr>', '<w:ind w:left="0" w:firstLine="0"/><w:jc w:val="center"/></w:pPr>', 1)
ctx.text_width = PORTRAIT
for label, num in sorted(mapping.items(), key=lambda kv: kv[1]):
    text = refs[label]
    ref_xml += ('<w:p><w:pPr><w:spacing w:before="0" w:after="100"/><w:ind w:left="567" w:hanging="567"/>'
                '<w:jc w:val="both"/></w:pPr>' + m.run(f'[{num}]') + '<w:r><w:tab/></w:r>'
                + m.inline(text) + '</w:p>')
apx = gen(blocks_by_file['07_phu_luc'], PORTRAIT, page_break_h1n=True)

# ------------------------------------------------------------ danh mục bảng và hình
CAP = re.compile(r'<w:p><w:pPr><w:pStyle w:val="Heading[45]"/>.*?</w:p>', flags=re.S)
CAP_HEAD = re.compile(r'^((?:Bảng|Hình) [\w.]+\. [^.]*)')
lists = {'Bảng': [], 'Hình': []}
for chunk in (phan1, phan2, phan3, phan4, phan5, cong_trinh, apx):
    for cp in CAP.findall(chunk):
        text = html_unescape(''.join(re.findall(r'<w:t(?: [^>]*)?>(.*?)</w:t>', cp, flags=re.S)))
        mt = CAP_HEAD.match(text)
        if mt:
            lists[mt.group(1).split(' ')[0]].append(mt.group(1).strip())


def list_xml(title, key, page_break):
    """Danh mục bảng hoặc hình: trường TOC lấy các đoạn Heading 4 (bảng) hoặc Heading 5 (hình)."""
    out = m.para(title, style=ctx.style('Heading1N', 'Heading1'), keep_next=True)
    if page_break:
        out = out.replace('<w:keepNext/>', '<w:keepNext/><w:pageBreakBefore/>', 1)
    out = out.replace('</w:pPr>', '<w:ind w:left="0" w:firstLine="0"/><w:jc w:val="center"/></w:pPr>', 1)
    out = bm_wrap(out, bm[title], bm[title + '#id'])
    level = 'Heading 4' if key == 'Bảng' else 'Heading 5'
    begin = ('<w:r><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve">'
             f' TOC \\h \\z \\t "{level},1" </w:instrText></w:r><w:r><w:fldChar w:fldCharType="separate"/></w:r>')
    items = lists[key]
    for i, item in enumerate(items):
        page = pages.get(f'{key}|{item}', '')
        pre = begin if i == 0 else ''
        post = '<w:r><w:fldChar w:fldCharType="end"/></w:r>' if i == len(items) - 1 else ''
        name = bm.get((key, item))
        inner = link(name, r(item) + TAB + (pageref(name, page) if name else r(str(page))))
        out += f'<w:p><w:pPr><w:pStyle w:val="TOC1"/><w:ind w:left="1134" w:hanging="1134"/></w:pPr>{pre}{inner}{post}</w:p>'
    return out


# ------------------------------------------------------------ mục lục
def to_roman(n):
    vals = [(10, 'x'), (9, 'ix'), (5, 'v'), (4, 'iv'), (1, 'i')]
    s = ''
    for v, t in vals:
        while n >= v:
            s += t
            n -= v
    return s


def toc_entries():
    entries = toc_front[:]
    # thứ tự tài liệu: front (từ viết tắt, tóm tắt, abstract) rồi Phần 1..5, tài liệu tham khảo, phụ lục
    return entries


all_toc = toc_front + [t for t in toc]
# toc đã ở thứ tự sinh: thanks(không có H1N vì đã bỏ), abbr, summ, abst, phan1..5, refs, apx
# sắp lại đúng thứ tự tài liệu: front phụ, Phần 1-5, tài liệu tham khảo, phụ lục
front_extra = [t for t in toc if t[2] in ('DANH MỤC TỪ VIẾT TẮT', 'TÓM TẮT', 'ABSTRACT')]
rest = [t for t in toc if t not in front_extra]
ref_i = next(i for i, t in enumerate(rest) if t[2] == 'TÀI LIỆU THAM KHẢO')
apx_i = next(i for i, t in enumerate(rest) if t[2] == 'PHỤ LỤC')
ordered = toc_front + front_extra + [t for t in rest if t[0] == 1 or True]
# rest đã theo thứ tự sinh (Phần 1..5) nhưng tài liệu tham khảo được thêm trước phụ lục: kiểm tra
titles = [t[2] for t in ordered]


def pageref(name, page):
    return ('<w:r><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve">'
            f' PAGEREF {name} \\h </w:instrText></w:r><w:r><w:fldChar w:fldCharType="separate"/></w:r>'
            + r(str(page)) + '<w:r><w:fldChar w:fldCharType="end"/></w:r>')


def link(name, inner):
    return f'<w:hyperlink w:anchor="{name}" w:history="1">{inner}</w:hyperlink>' if name else inner


def toc_xml():
    out = m.para('MỤC LỤC', style=ctx.style('Heading1N', 'Heading1'))
    out = out.replace('<w:keepNext/>', '', 1) if False else out
    out = out.replace('<w:pPr>', '<w:pPr>', 1)
    out = re.sub(r'(<w:pStyle w:val="[^"]+"/>)', r'\1<w:pageBreakBefore/>', out, count=1).replace('</w:pPr>', '<w:ind w:left="0" w:firstLine="0"/><w:jc w:val="center"/></w:pPr>', 1)
    fld_begin = ('<w:r><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve"> TOC \\o "1-2" \\h \\z \\u </w:instrText></w:r>'
                 '<w:r><w:fldChar w:fldCharType="separate"/></w:r>')
    out = out  # heading MỤC LỤC được gắn bookmark ở cuối hàm
    n = len(ordered)
    entries_xml = ''
    for i, (level, num, text) in enumerate(ordered):
        page = pages.get(text if not num else f'{num}|{text}', '')
        style = 'TOC1' if level == 1 else 'TOC2'
        label = (f'{num} ' if num and level == 1 else '')
        inner = ''
        if level == 2:
            inner += (r(num) if num else '') + TAB
        inner += r(label + text) + TAB
        name = bm.get(text)
        inner = link(name, inner + (pageref(name, page) if name else r(str(page))))
        pre = fld_begin if i == 0 else ''
        post = '<w:r><w:fldChar w:fldCharType="end"/></w:r>' if i == n - 1 else ''
        entries_xml += f'<w:p><w:pPr><w:pStyle w:val="{style}"/></w:pPr>{pre}{inner}{post}</w:p>'
    return bm_wrap(out, bm['MỤC LỤC'], bm['MỤC LỤC#id']) + entries_xml


# ------------------------------------------------------------ bookmark để mục lục, danh mục bấm nhảy được
bm = {}
_bid = [9000]


def new_bm():
    _bid[0] += 1
    return f'_Toc{_bid[0]}', _bid[0]


def bm_wrap(p, name, bid):
    i = p.index('</w:pPr>') + len('</w:pPr>') if '</w:pPr>' in p[:600] else len(open_tag(p))
    return (p[:i] + f'<w:bookmarkStart w:id="{bid}" w:name="{name}"/>' + p[i:-len('</w:p>')]
            + f'<w:bookmarkEnd w:id="{bid}"/></w:p>')


def plain_text(p):
    return html_unescape(''.join(re.findall(r'<w:t(?: [^>]*)?>(.*?)</w:t>', p, flags=re.S))).strip()


heading_texts = {t for _, _, t in ordered}
HEAD = re.compile(r'<w:p>(?:(?!</w:p>).)*?<w:pStyle w:val="(?:Heading1|Heading1N|Heading2)"/>(?:(?!</w:p>).)*?</w:p>', flags=re.S)


def tag_chunk(chunk):
    def sub_h(mt):
        p = mt.group(0)
        text = plain_text(p)
        if text in heading_texts and text not in bm:
            name, bid = new_bm()
            bm[text] = name
            return bm_wrap(p, name, bid)
        return p

    def sub_c(mt):
        p = mt.group(0)
        mt2 = CAP_HEAD.match(plain_text(p))
        if not mt2:
            return p
        item = mt2.group(1).strip()
        name, bid = new_bm()
        bm[(item.split(' ')[0], item)] = name
        return bm_wrap(p, name, bid)

    return CAP.sub(sub_c, HEAD.sub(sub_h, chunk))


for _i, _t in ((28, 'THÔNG TIN CHUNG'), (55, 'THÔNG TIN VỀ HỌC PHẦN THỰC TẬP TỐT NGHIỆP'), (94, 'LỜI CẢM ƠN')):
    _n, _b = new_bm()
    bm[_t] = _n
    E[_i] = bm_wrap(E[_i], _n, _b)
for _t in ('MỤC LỤC', 'DANH MỤC BẢNG', 'DANH MỤC HÌNH'):
    bm[_t] = new_bm()[0]
    bm[_t + '#id'] = _bid[0]
phan1, phan2, phan3, phan4, phan5, cong_trinh, apx, abbr_xml, summ_xml, abst_xml, ref_xml = [
    tag_chunk(c) for c in (phan1, phan2, phan3, phan4, phan5, cong_trinh, apx, abbr_xml, summ_xml, abst_xml, ref_xml)]


# ------------------------------------------------------------ ráp các phần tử
new = []
new += [e for i, e in enumerate(E[0:28]) if i not in (16, 19, 20, 25)]  # bìa (đã sửa, bỏ dòng trống)
new += [e for i, e in enumerate(E[28:55], 28) if i not in (46, 47, 48, 49, 50)]  # thông tin chung
new += E[55:75]           # thông tin học phần (bỏ mục hướng dẫn)
new += [E[94].replace('<w:pStyle w:val="Heading1N"/>', '<w:pStyle w:val="Heading1N"/><w:pageBreakBefore/>', 1)]  # LỜI CẢM ƠN
new += [thanks_xml]
new += [toc_xml(), list_xml('DANH MỤC BẢNG', 'Bảng', True), list_xml('DANH MỤC HÌNH', 'Hình', True)]
new += [abbr_xml, summ_xml, abst_xml]
new += [sect_only(E[143])]
new += [phan1, sect_only(E[151])]
new += [phan2, sect_only(E[168])]
new += [phan3, sect_only(E[182])]
new += [phan4, sect_only(E[200])]
apx = re.sub(r'(<w:p><w:pPr><w:spacing w:after="60"/></w:pPr></w:p>)+$', '', apx)
apx += '<w:p><w:pPr><w:spacing w:before="0" w:after="0" w:line="20" w:lineRule="exact"/></w:pPr></w:p>'
new += [phan5, cong_trinh, ref_xml, apx]
new += [E[210]]

new_body = ''.join(new)

# ------------------------------------------------------------ kiểm tra ngoại lệ: mục ánh xạ
json.dump({'toc': [[l, n, t] for l, n, t in ordered], 'lists': lists, 'cite': mapping}, open('/tmp/rep/toc.json', 'w'), ensure_ascii=False)

# ------------------------------------------------------------ namespace gốc
need = {'wp': m.WP_NS, 'a': m.A_NS, 'pic': m.PIC_NS, 'r': m.R_NS, 'm': m.MATH_NS}
for pref, uri in need.items():
    if f'xmlns:{pref}=' not in head:
        head = head.replace('<w:document ', f'<w:document xmlns:{pref}="{uri}" ', 1)
open(doc_path, 'w', encoding='utf8').write(head + new_body + tail)

# ------------------------------------------------------------ ảnh, quan hệ, kiểu nội dung
os.makedirs(f'{WORK}/word/media', exist_ok=True)
rels_path = f'{WORK}/word/_rels/document.xml.rels'
rels = open(rels_path, encoding='utf8').read()
add = ''
for name, blob, rid in ctx.images:
    open(f'{WORK}/word/media/{name}', 'wb').write(blob)
    add += (f'<Relationship Id="{rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" '
            f'Target="media/{name}"/>')
open(rels_path, 'w', encoding='utf8').write(rels.replace('</Relationships>', add + '</Relationships>'))
ct_path = f'{WORK}/[Content_Types].xml'
ct = open(ct_path, encoding='utf8').read()
if 'Extension="png"' not in ct:
    ct = ct.replace('<Default Extension="rels"', '<Default Extension="png" ContentType="image/png"/><Default Extension="rels"', 1)
open(ct_path, 'w', encoding='utf8').write(ct)

# ------------------------------------------------------------ đánh số danh sách
num_path = f'{WORK}/word/numbering.xml'
num = open(num_path, encoding='utf8').read()
bullet_abs = ('<w:abstractNum w:abstractNumId="90"><w:multiLevelType w:val="hybridMultilevel"/>'
              '<w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="-"/>'
              '<w:lvlJc w:val="left"/><w:pPr><w:ind w:left="720" w:hanging="360"/></w:pPr></w:lvl></w:abstractNum>')
number_abs = ('<w:abstractNum w:abstractNumId="91"><w:multiLevelType w:val="hybridMultilevel"/>'
              '<w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="decimal"/><w:lvlText w:val="%1."/>'
              '<w:lvlJc w:val="left"/><w:pPr><w:ind w:left="720" w:hanging="360"/></w:pPr></w:lvl></w:abstractNum>')
first_num = num.index('<w:num ')
num = num[:first_num] + bullet_abs + number_abs + num[first_num:]
nums = '<w:num w:numId="90"><w:abstractNumId w:val="90"/></w:num>'
for nid in ctx.new_nums:
    nums += (f'<w:num w:numId="{nid}"><w:abstractNumId w:val="91"/>'
             '<w:lvlOverride w:ilvl="0"><w:startOverride w:val="1"/></w:lvlOverride></w:num>')
cleanup = num.find('<w:numIdMacAtCleanup')
pos = cleanup if cleanup != -1 else num.rindex('</w:numbering>')
num = num[:pos] + nums + num[pos:]
open(num_path, 'w', encoding='utf8').write(num)

# ------------------------------------------------------------ nén lại
if os.path.exists(out_path):
    os.remove(out_path)
with zipfile.ZipFile(out_path, 'w', zipfile.ZIP_DEFLATED) as z:
    ct_first = '[Content_Types].xml'
    z.write(f'{WORK}/{ct_first}', ct_first)
    for root, _, fs in os.walk(WORK):
        for f in fs:
            full = os.path.join(root, f)
            arc = os.path.relpath(full, WORK)
            if arc != ct_first:
                z.write(full, arc)
print('đã ghi', out_path, 'trích dẫn:', len(mapping), 'ảnh:', len(ctx.images))
