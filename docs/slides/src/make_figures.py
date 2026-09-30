#!/usr/bin/env python3
"""Vẽ các hình riêng cho slide bảo vệ thực tập (BL Advisor).

Dữ liệu:
- docs/bao-cao/data.json: kết quả tối ưu hóa của báo cáo (tài khoản demo-user-12, tám tài sản).
- Chuỗi giá demo: chạy lại phần sinh giá của prisma/seed-demo.mts (hạt giống cố định) bằng Node,
  quy đổi tài sản USD sang VND theo tỷ giá từng ngày, lấy cùng cửa sổ 2024-09-30 đến 2026-09-29.
  Ma trận tương quan tính lại theo cách này chỉ dùng để minh họa; nhóm tài sản USD có sai khác nhỏ
  so với engine (độ biến động năm lệch dưới 0,3 điểm phần trăm).

Chạy: python3 docs/slides/src/make_figures.py
"""
import json
import subprocess
import sys
from pathlib import Path

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from matplotlib import font_manager
from matplotlib.colors import LinearSegmentedColormap
from matplotlib.ticker import FuncFormatter

ROOT = Path(__file__).resolve().parents[3]
OUT = ROOT / 'docs' / 'slides' / 'img'
DATA = json.load(open(ROOT / 'docs' / 'bao-cao' / 'data.json', encoding='utf8'))

# Font và màu theo skill dataviz: bảng màu phân loại thứ tự cố định (xanh, cam, ngọc lam), mực chữ,
# đường lưới mảnh liền nét, chữ không mang màu của chuỗi dữ liệu.
BLUE, ORANGE, AQUA, YELLOW, MAGENTA, GREEN, VIOLET, RED = '#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#4a3aa7', '#e34948'
INK, INK2, MUTED, GRID, BASE, MID = '#0b0b0b', '#52514e', '#898781', '#e1e0d9', '#c3c2b7', '#f0efec'
plt.rcParams.update({
    'font.family': 'Liberation Sans', 'font.size': 13, 'axes.titlesize': 14, 'axes.labelsize': 13,
    'xtick.labelsize': 12.5, 'ytick.labelsize': 12.5, 'legend.fontsize': 12.5, 'axes.spines.top': False,
    'axes.spines.right': False, 'axes.linewidth': 1.0, 'axes.edgecolor': BASE, 'axes.labelcolor': INK2,
    'xtick.color': INK2, 'ytick.color': INK2, 'text.color': INK, 'axes.grid': False, 'grid.color': GRID,
    'grid.linewidth': 1.0, 'grid.linestyle': '-', 'savefig.dpi': 300, 'savefig.bbox': 'tight',
    'savefig.pad_inches': 0.05, 'figure.facecolor': 'white', 'axes.facecolor': 'white',
})

# ---------------------------------------------------------------------------
# Giá demo -> lợi suất ngày của tám tài sản
# ---------------------------------------------------------------------------
seed_lines = (ROOT / 'prisma' / 'seed-demo.mts').read_text(encoding='utf8').split('\n')
# Cố định ngày chạy (29/09/2026): seed-demo.mts lấy ngày hiện tại làm mốc, nên nếu không cố định thì chuỗi giá đổi theo ngày.
FIXED_DATE = "import { createHash } from 'node:crypto';\nconst __RD = Date;\nconst __NOW = new __RD('2026-09-29T00:00:00Z').getTime();\n(globalThis as any).Date = class extends __RD { constructor(...a: any[]) { if (a.length === 0) { super(__NOW); } else { super(...(a as [any])); } } static now() { return __NOW; } } as any;\n"
gen = FIXED_DATE + '\n'.join(seed_lines[31:600]) + """
const out: Record<string, Record<string, number>> = {};
for (const a of ASSETS) { const ser = prices.get(a.symbol)!; out[a.symbol] = {}; for (const [t, p] of ser) out[a.symbol][isoDate(t)] = p; }
const fx: Record<string, number> = {};
for (const [t, p] of prices.get('USDVND')!) fx[isoDate(t)] = p;
const meta = ASSETS.map((a: any) => ({ symbol: a.symbol, name: a.name, currency: a.currency }));
console.log(JSON.stringify({ prices: out, fx, meta }));
"""
tmp = Path('/tmp/slides_gen_prices.mts')
tmp.write_text(gen, encoding='utf8')
raw = subprocess.run(['node', str(tmp)], capture_output=True, text=True, check=True).stdout
P0 = json.loads(raw)
meta = {m['symbol']: m for m in P0['meta']}
name2sym = {m['name']: s for s, m in meta.items()}
fx = pd.Series(P0['fx']); fx.index = pd.to_datetime(fx.index)

ORDER = [a['name'] for a in DATA['assets']]          # thứ tự của data.json
SHORT = {'NVIDIA': 'NVIDIA', 'Vietcombank': 'Vietcombank', 'Quỹ trái phiếu VFMVFB': 'Quỹ trái phiếu',
         'Vanguard S&P 500 ETF': 'Vanguard S&P 500', 'Vinamilk': 'Vinamilk', 'FPT Corp': 'FPT',
         'Hòa Phát': 'Hòa Phát', 'Microsoft': 'Microsoft'}
short = [SHORT[n.replace(' (dữ liệu mẫu)', '')] for n in ORDER]
px = {}
for n in ORDER:
    sym = name2sym[n]
    s = pd.Series(P0['prices'][sym]); s.index = pd.to_datetime(s.index)
    if meta[sym]['currency'] == 'USD':
        s = s * fx.reindex(s.index)
    px[n] = s
P = pd.DataFrame(px).sort_index().ffill()
P = P[(P.index >= DATA['from']) & (P.index <= DATA['to'])].dropna()
R = P.pct_change().dropna()
R.columns = short
corr = R.corr()
cov = R.cov() * 252
W = {p['key']: np.array(p['weights'][:8], dtype=float) for p in DATA['portfolios']}
w_cur = np.array([a['currentWeight'] for a in DATA['assets']])
print('quan sát:', len(R), 'kỳ vọng 521')


def vn(v, nd=1):
    """Số kiểu Việt Nam: dấu phẩy thập phân, dấu trừ U+2212."""
    return f'{v:.{nd}f}'.replace('.', ',').replace('-', '\u2212')


VI = FuncFormatter(lambda v, _: f'{v:g}'.replace('.', ',').replace('-', '\u2212'))


def save(fig, name):
    fig.savefig(OUT / name)
    plt.close(fig)
    print('đã ghi', name)


# ---------------------------------------------------------------------------
# Quy ước hình cho slide (theo dataviz và góp ý của giảng viên): mỗi hình một câu chuyện, ít chữ, chữ lớn.
# Hình rộng khoảng 3,5 inch, chèn vào slide cỡ 0,7 lần nên chữ 12 đến 14 pt còn khoảng 9 đến 10 pt.
# Màu: xanh = Chia đều, cam = Sharpe tối đa, xám = Hiện tại (chỉ dùng cho danh mục); mọi nhấn khác dùng xanh lá GREEN.
# ---------------------------------------------------------------------------
ACC = GREEN
FS = (3.6, 2.7)
ARW = dict(arrowstyle='-|>', color=INK, lw=2, mutation_scale=16, shrinkA=3, shrinkB=4)

# 1. Tương quan: cùng nhóm và khác nhóm ---------------------------------------
groups = {'VN': ['Vinamilk', 'FPT', 'Vietcombank', 'Hòa Phát'], 'US': ['NVIDIA', 'Microsoft', 'Vanguard S&P 500'], 'BOND': ['Quỹ trái phiếu']}
gof = {a: g for g, l in groups.items() for a in l}
within, across = [], []
for i_, a in enumerate(short):
    for j_ in range(i_):
        b = short[j_]
        (within if gof[a] == gof[b] else across).append(corr.loc[a, b])
mw, ma = float(np.mean(within)), float(np.mean(across))
print('tương quan trung bình cùng nhóm', round(mw, 3), 'khác nhóm', round(ma, 3), 'lớn nhất khác nhóm', round(max(across), 3))
fig, ax = plt.subplots(figsize=FS)
bars = ax.bar(['Cùng nhóm', 'Khác nhóm'], [mw, ma], color=[ACC, MUTED], width=0.55)
for b_, v in zip(bars, [mw, ma]):
    ax.text(b_.get_x() + b_.get_width() / 2, v + 0.012, vn(v, 2), ha='center', fontsize=15, fontweight='bold')
ax.set_ylim(0, 0.5); ax.set_ylabel('Tương quan trung bình'); ax.yaxis.set_major_formatter(VI)
ax.set_yticks([0, 0.25, 0.5]); ax.yaxis.grid(True); ax.set_axisbelow(True)
save(fig, 'hinh-tuong-quan.png')

# 2. Đa dạng hóa hai tài sản ---------------------------------------------------
s1, s2 = 0.268, 0.273
rho_real = float(corr.loc['Vinamilk', 'Vietcombank'])
w = np.linspace(0, 1, 201)
fig, ax = plt.subplots(figsize=FS)
def sig(rho):
    return np.sqrt((w * s1) ** 2 + ((1 - w) * s2) ** 2 + 2 * w * (1 - w) * rho * s1 * s2) * 100
for rho, col, lw_, lab, dy in [(1.0, MUTED, 3, 'ρ = 1', 1.9), (rho_real, ACC, 4.5, 'ρ = ' + vn(rho_real, 2), -2.2), (-0.5, INK2, 3, 'ρ = −0,5', -2.2)]:
    y_ = sig(rho)
    ax.plot(w * 100, y_, color=col, lw=lw_, solid_capstyle='round')
    k = y_.argmin() if rho < 1 else 100
    ax.text(50, y_[k] + dy, lab, ha='center', fontsize=13.5, fontweight='bold', color=INK)
y1, y2 = sig(1.0)[100], sig(rho_real)[100]
ax.text(50, 32.2, 'Chia đôi: ' + vn(y1, 0) + '% → ' + vn(y2, 1) + '%', ha='center', fontsize=13.5, fontweight='bold', color=INK)
ax.set_xlim(0, 100); ax.set_ylim(10, 34)
ax.set_xlabel('Tỷ trọng Vinamilk (%)'); ax.set_ylabel('Biến động năm (%)')
ax.yaxis.grid(True); ax.set_axisbelow(True); ax.yaxis.set_major_formatter(VI)
save(fig, 'hinh-da-dang-hoa.png')

# 3. Đường biên hiệu quả: một đường, ba điểm -------------------------------------
fr = pd.DataFrame(DATA['frontier'])
fig, ax = plt.subplots(figsize=FS)
ax.plot(fr.volatility * 100, fr.expectedReturn * 100, color=INK, lw=3, zorder=2, solid_capstyle='round')
pts = {'CURRENT': ('Hiện tại\n11,9% | 18,1%', MUTED, 'o', (21.5, 11.6)), 'EQUAL': ('Chia đều', BLUE, 's', (22.0, 7.4)),
       'MAX_SHARPE': ('Sharpe tối đa\n11,2% | 10,0%', ORANGE, '*', (7.6, 16.8))}
for p in DATA['portfolios']:
    k = p['key']
    if k not in pts:
        continue
    lab, col, mk, tp = pts[k]
    xv, yv = p['metrics']['annualVolatility'] * 100, p['metrics']['annualReturn'] * 100
    ax.scatter(xv, yv, s=380 if mk == '*' else 150, marker=mk, color=col, edgecolor='none', zorder=3)
    ax.annotate(lab, (xv, yv), xytext=tp, textcoords='data', fontsize=13.5, va='center', fontweight='bold', arrowprops=ARW)
ax.text(24.5, 19.6, 'Đường biên', fontsize=13, ha='center', fontweight='bold')
ax.set_xlim(7, 29); ax.set_ylim(5, 21)
ax.set_xlabel('Biến động năm (%)'); ax.set_ylabel('Lợi suất năm (%)')
ax.text(28.8, 5.6, 'Nhãn: lợi suất | biến động', fontsize=11.5, color=INK2, ha='right')
ax.yaxis.grid(True); ax.set_axisbelow(True); ax.xaxis.set_major_formatter(VI); ax.yaxis.set_major_formatter(VI)
save(fig, 'hinh-duong-bien.png')

# 4. Backtest ngoài mẫu: lợi suất cuối kỳ của ba chiến lược ---------------------
bt = DATA['backtest']
fin = {s_['key']: s_['values'][-1] - 100 for s_ in bt['series']}
rows = [('Chia đều', fin['EQUAL'], BLUE), ('Hiện tại', fin['CURRENT'], MUTED), ('Sharpe tối đa', fin['OPTIMIZED'], ORANGE)]
fig, ax = plt.subplots(figsize=FS)
xs_ = range(3)
ax.bar(xs_, [r_[1] for r_ in rows], color=[r_[2] for r_ in rows], width=0.6)
for x_, r_ in zip(xs_, rows):
    ax.text(x_, r_[1] + (0.35 if r_[1] >= 0 else -0.35), ('+' if r_[1] >= 0 else '') + vn(r_[1]) + '%', ha='center', va='bottom' if r_[1] >= 0 else 'top',
            fontsize=14, fontweight='bold')
ax.axhline(0, color=INK, lw=1.2)
ax.set_xticks(list(xs_)); ax.set_xticklabels([r_[0] for r_ in rows], fontsize=12)
ax.set_ylim(-6.5, 4.5); ax.set_ylabel('Lợi suất ngoài mẫu (%)'); ax.yaxis.set_major_formatter(VI)
ax.yaxis.grid(True); ax.set_axisbelow(True)
save(fig, 'hinh-backtest.png')
print('backtest cuối kỳ', {k: round(v, 2) for k, v in fin.items()})

# 5. Phân phối lợi suất ngày và đuôi CVaR ------------------------------------------
r = (R[short].values @ w_cur) * 100
var95 = np.percentile(r, 5)
cvar = -r[r <= var95].mean()
bw = 1.0 * r.std(ddof=1) * len(r) ** (-1 / 5)
def kde(x):
    x = np.atleast_1d(np.asarray(x, dtype=float))
    return np.exp(-0.5 * ((x[:, None] - r[None, :]) / bw) ** 2).sum(axis=1) / (len(r) * bw * np.sqrt(2 * np.pi))
xs = np.linspace(-7.5, 5, 600); ys = kde(xs); ymax = ys.max()
fig, ax = plt.subplots(figsize=FS)
ax.plot(xs, ys, color=INK2, lw=3.5)
tail = xs <= var95
ax.fill_between(xs[tail], ys[tail], color=ACC, alpha=0.95)
ax.plot([var95, var95], [0, kde(var95)[0]], color=INK, lw=3)
ax.annotate(f'VaR 95%:\nlỗ {vn(-var95, 2)}%', xy=(var95, kde(var95)[0] * 0.92), xytext=(-7.3, ymax * 0.98), va='top', fontsize=13, fontweight='bold', arrowprops=dict(ARW, relpos=(1.0, 0.5)))
ax.annotate(f'Đuôi 5%:\nCVaR\n{vn(cvar, 2)}%', xy=(-2.75, kde(-2.75)[0] * 0.4), xytext=(-7.3, ymax * 0.62), fontsize=13,
            fontweight='bold', va='top', arrowprops=ARW)
ax.set_xlim(-7.5, 5); ax.set_ylim(0, ymax * 1.08)
ax.set_xlabel('Lợi suất ngày (%)'); ax.set_yticks([]); ax.xaxis.set_major_formatter(VI); ax.grid(True, axis='x'); ax.set_axisbelow(True)
ax.set_xticks([-6, -4, -2, 0, 2, 4])
save(fig, 'hinh-cvar.png')
print('CVaR95 tính lại', round(cvar, 3), 'so với báo cáo', round(DATA['portfolios'][0]['metrics']['cvar95'] * 100, 3))

# 6. Đóng góp rủi ro của NVIDIA ------------------------------------------------------
S = cov.loc[short, short].values
def risk_contrib(w_):
    m = S @ w_
    return w_ * m / (w_ @ m)
w_ = W['CURRENT']; rc = risk_contrib(w_) * 100
jn = short.index('NVIDIA')
fig, ax = plt.subplots(figsize=FS)
for y_, (a_, b_) in zip([1, 0], [(w_[jn] * 100, 100 - w_[jn] * 100), (rc[jn], 100 - rc[jn])]):
    ax.barh(y_, a_, color=ACC, height=0.55, edgecolor='white', linewidth=2)
    ax.barh(y_, b_, left=a_, color=BASE, height=0.55, edgecolor='white', linewidth=2)
    ax.text(a_ / 2, y_, vn(a_, 1 if abs(a_ - round(a_)) > 0.05 else 0) + '%', ha='center', va='center', fontsize=15, fontweight='bold', color='white')
    ax.text(a_ + b_ / 2, y_, vn(b_, 1 if abs(b_ - round(b_)) > 0.05 else 0) + '%', ha='center', va='center', fontsize=13, color=INK)
ax.set_yticks([1, 0]); ax.set_yticklabels(['Tỷ trọng', 'Đóng góp\nvào rủi ro'], fontsize=13)
ax.set_xlim(0, 100); ax.set_xticks([0, 50, 100]); ax.set_xlabel('Phần trăm danh mục (%)')
ax.text(0, 1.62, 'Xanh: NVIDIA. Xám: bảy tài sản còn lại', fontsize=11.5, color=INK2)
ax.set_ylim(-0.6, 1.9)
save(fig, 'hinh-dong-gop-rui-ro.png')
print('đóng góp rủi ro hiện tại', np.round(rc, 1))

# 7. Tỷ trọng quỹ trái phiếu theo phương pháp, có trần 40% ---------------------------
jb = short.index('Quỹ trái phiếu')
methods = [('Hiện tại', 'CURRENT', MUTED), ('Sharpe tối đa', 'MAX_SHARPE', ORANGE), ('Nghịch đảo biến động', 'INVERSE_VOLATILITY', INK2), ('Cân bằng rủi ro', 'RISK_PARITY', INK2)]
fig, ax = plt.subplots(figsize=FS)
for i_, (lab, k, col) in enumerate(methods):
    v = W[k][jb] * 100
    ax.barh(3 - i_, v, color=col, height=0.6)
    ax.text(v + 1.5, 3 - i_, vn(v, 1 if abs(v - round(v)) > 0.05 else 0) + '%', va='center', fontsize=14, fontweight='bold')
ax.axvline(40, color=INK, lw=2)
ax.text(41.5, 3.75, 'Trần 40%', ha='left', va='bottom', fontsize=13, fontweight='bold')
ax.set_yticks([3, 2, 1, 0]); ax.set_yticklabels([m_[0].replace(' ', '\n', 1) if len(m_[0]) > 12 else m_[0] for m_ in methods], fontsize=12)
ax.set_xlim(0, 82); ax.set_ylim(-0.6, 4.3); ax.set_xticks([0, 20, 40, 60, 80])
ax.set_xlabel('Tỷ trọng quỹ trái phiếu (%)\nXám đậm: chưa áp trần', fontsize=12.5); ax.xaxis.grid(True); ax.set_axisbelow(True)
save(fig, 'hinh-ty-trong.png')

# : ba tài sản có quan điểm, từ cân bằng đến hậu nghiệm --------------
delta, tau = 2.5, 0.05
pi = delta * S @ w_cur
idx = {n: i for i, n in enumerate(short)}
Pm = np.zeros((2, 8)); Q = np.zeros(2)
Pm[0, idx['Vinamilk']] = 1; Q[0] = 0.12
Pm[1, idx['FPT']] = 1; Pm[1, idx['Vietcombank']] = -1; Q[1] = 0.03
conf = np.array([0.6, 0.5])
omega = np.diag([tau * Pm[k] @ S @ Pm[k] * (1 - conf[k]) / conf[k] for k in range(2)])
A = np.linalg.inv(tau * S)
post = np.linalg.solve(A + Pm.T @ np.linalg.inv(omega) @ Pm, A @ pi + Pm.T @ np.linalg.inv(omega) @ Q)
fig, ax = plt.subplots(figsize=(3.8, 2.7))
for y_, n_ in zip([2, 1, 0], ['Vinamilk', 'FPT', 'Vietcombank']):
    i_ = idx[n_]
    a_, b_ = pi[i_] * 100, post[i_] * 100
    ax.annotate('', xy=(b_, y_), xytext=(a_, y_), arrowprops=dict(arrowstyle='-|>', color=INK, lw=2.5, mutation_scale=16, shrinkA=6, shrinkB=8))
    ax.scatter([a_], [y_], s=150, color=MUTED, zorder=3)
    ax.scatter([b_], [y_], s=150, color=ACC, zorder=3)
    ax.text(a_ - 0.15, y_ + 0.3, vn(a_), ha='right', fontsize=14, color=INK)
    ax.text(b_ + 0.15, y_ + 0.3, vn(b_), ha='left', fontsize=14, fontweight='bold')
ax.set_yticks([2, 1, 0]); ax.set_yticklabels(['Vinamilk', 'FPT', 'Vietcombank'], fontsize=12)
ax.set_xlim(3.5, 11.5); ax.set_ylim(-0.6, 2.8)
ax.set_xlabel('Lợi suất kỳ vọng năm (%)\nXám: cân bằng π. Xanh lá: hậu nghiệm', fontsize=12); ax.xaxis.set_major_formatter(VI); ax.xaxis.grid(True); ax.set_axisbelow(True)
save(fig, 'hinh-bl-hau-nghiem.png')
print('pi %', np.round(pi * 100, 1), 'hậu nghiệm %', np.round(post * 100, 1))
