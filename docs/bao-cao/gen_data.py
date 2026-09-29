#!/usr/bin/env python3
"""Chạy tối ưu hóa trên tài khoản demo-user-12 và ghi kết quả ra data.json.

Cấu hình cố định cho các bảng trong báo cáo: tám khoản nắm giữ có tỷ trọng
lớn nhất, hai năm dữ liệu, lãi suất phi rủi ro 3%, tỷ trọng tối đa 40%,
phương pháp Sharpe tối đa, backtest theo quý với cửa sổ 252 ngày.

Cần API chạy ở http://localhost:3333 và đã nạp dữ liệu demo.
"""
import json
import sys
import urllib.request

BASE = 'http://localhost:3333'


def call(path, body=None, token=None):
    headers = {'content-type': 'application/json'}
    if token:
        headers['Authorization'] = 'Bearer ' + token
    data = json.dumps(body).encode() if body is not None else None
    request = urllib.request.Request(
        BASE + path, data=data, headers=headers, method='POST' if data else 'GET'
    )
    with urllib.request.urlopen(request, timeout=120) as response:
        return json.load(response)


token = call('/api/v1/auth/anonymous', {'accessToken': 'demo-user-12'})['authToken']
holdings = call('/api/v1/portfolio/holdings', token=token)['holdings']
holdings = sorted(
    holdings.values() if isinstance(holdings, dict) else holdings,
    key=lambda h: h.get('allocationInPercentage') or 0,
    reverse=True,
)[:8]
assets = [
    {'dataSource': h['assetProfile']['dataSource'], 'symbol': h['assetProfile']['symbol']}
    for h in holdings
]
result = call(
    '/api/v1/portfolio/optimizer',
    {
        'assets': assets,
        'backtest': True,
        'backtestLookbackDays': 252,
        'backtestRebalance': 'QUARTERLY',
        'lookbackDays': 730,
        'maxWeight': 0.4,
        'method': 'MAX_SHARPE',
        'riskFreeRate': 0.03,
    },
    token=token,
)
json.dump(result, open(sys.argv[1] if len(sys.argv) > 1 else 'data.json', 'w'), ensure_ascii=False, indent=1)
print('observations', result['observations'], 'from', result['from'], 'to', result['to'])
for p in result['portfolios']:
    m = p['metrics']
    print(f"{p['label']:45s} ret {m['annualReturn']:.3f} vol {m['annualVolatility']:.3f} sharpe {m['sharpe']:.2f} cvar {m['cvar95']:.4f} mdd {m['maxDrawdown']:.3f}")
if result.get('backtest'):
    for row in result['backtest']['metrics']:
        m = row['metrics']
        print(f"BT {row['label']:25s} total {m['totalReturn']:.3f} ret {m['annualReturn']:.3f} vol {m['annualVolatility']:.3f} sharpe {m['sharpe']:.2f} mdd {m['maxDrawdown']:.3f}")
