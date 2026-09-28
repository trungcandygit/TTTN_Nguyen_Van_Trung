"""FastAPI backend: He thong ho tro quyet dinh dau tu danh muc nganh ngan hang
bang mo hinh Black-Litterman. Do an thuc tap tot nghiep CNTT - PTIT."""
from __future__ import annotations

import io
import os

import numpy as np
import pandas as pd
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from app.core.black_litterman import BlackLittermanInputs, run_black_litterman
from app.core.data_loader import load_prices_from_csv
from app.core.portfolio_stats import (
    annualize_mean_cov,
    implied_market_weights,
    implied_risk_aversion,
    log_returns,
    portfolio_performance,
)
from app.schemas import BlackLittermanRequest, BlackLittermanResponse

app = FastAPI(
    title="Black-Litterman Portfolio Optimizer API",
    description=(
        "He thong ho tro quyet dinh dau tu danh muc nganh ngan hang bang mo hinh "
        "Black-Litterman. Do an thuc tap tot nghiep CNTT."
    ),
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # sinh vien: gioi han lai domain that khi trien khai san xuat
    allow_methods=["*"],
    allow_headers=["*"],
)

_SAMPLE_DATA_PATH = os.path.join(
    os.path.dirname(__file__), "..", "sample_data", "sample_prices_SYNTHETIC.csv"
)


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


def _compute(prices: pd.DataFrame, req: BlackLittermanRequest) -> BlackLittermanResponse:
    prices = prices[req.tickers].tail(req.lookback_days + 1)
    if prices.isna().any().any():
        raise HTTPException(
            status_code=400,
            detail="Du lieu gia thieu (NaN) cho mot hoac nhieu ma trong khoang lookback_days da chon.",
        )

    rets = log_returns(prices)
    mu, sigma = annualize_mean_cov(rets)

    caps = pd.Series({t: req.market_caps[t] for t in req.tickers})
    w_mkt = implied_market_weights(caps)

    mkt_ret, mkt_vol = portfolio_performance(w_mkt, mu, sigma)
    delta = implied_risk_aversion(mkt_ret, mkt_vol**2, req.risk_free_rate)
    delta_is_fallback = delta <= 0
    if delta_is_fallback:
        # Loi suat thi truong thuc hien (mkt_ret) trong cua so lookback co the am do
        # nhieu mau nho, lam delta uoc luong am va lam hong toan bo toi uu hoa. Theo
        # thong le tai lieu (Idzorek, 2005; Grinold & Kahn, 2000), dung he so ngai
        # rui ro tieu chuan 2.5 thay the va ghi ro trong bao cao day la gia tri mac
        # dinh, khong phai uoc luong tu du lieu, khi truong hop nay xay ra.
        delta = 2.5

    n = len(req.tickers)
    w_mkt_arr = w_mkt.to_numpy() if hasattr(w_mkt, "to_numpy") else w_mkt

    if req.views:
        p = np.zeros((len(req.views), n))
        q = np.zeros(len(req.views))
        for i, v in enumerate(req.views):
            for asset, w in zip(v.assets, v.weights):
                if asset not in req.tickers:
                    raise HTTPException(400, f"View reference asset '{asset}' not in tickers")
                p[i, req.tickers.index(asset)] = w
            q[i] = v.expected_return

        # Omega_ii = (tau * P_i Sigma P_i^T) / confidence_i  (confidence in (0,1]).
        # confidence = 1 (mac dinh) -> cong thuc chuan He (2005); confidence -> 0
        # -> Omega_ii -> vo cung, quan diem gan nhu khong co trong so trong hau nghiem.
        base_var = np.diag(req.tau * p @ sigma @ p.T)
        confidences = np.array([v.confidence for v in req.views])
        omega = np.diag(base_var / confidences)
    else:
        p = np.zeros((1, n))
        q = np.zeros(1)
        omega = np.eye(1) * 1e6  # khong co quan diem nao -> E[R] ~ pi

    inputs = BlackLittermanInputs(
        sigma=sigma, w_mkt=w_mkt_arr,
        delta=delta, tau=req.tau, p=p, q=q, omega=omega,
    )
    result = run_black_litterman(inputs)

    return BlackLittermanResponse(
        tickers=req.tickers,
        implied_equilibrium_returns=result["implied_equilibrium_returns"],
        posterior_returns=result["posterior_returns"],
        weights_market=result["weights_market"],
        weights_optimal=result["weights_optimal"],
        delta=delta,
        delta_is_fallback=delta_is_fallback,
    )


@app.post("/api/black-litterman/demo", response_model=BlackLittermanResponse)
def run_demo(req: BlackLittermanRequest) -> BlackLittermanResponse:
    """Chay tren du lieu mau tong hop (SYNTHETIC) di kem repo - chi de kiem tra he
    thong, KHONG dung ket qua nay lam so lieu that trong bao cao."""
    prices = load_prices_from_csv(_SAMPLE_DATA_PATH)
    return _compute(prices, req)


@app.post("/api/black-litterman/upload", response_model=BlackLittermanResponse)
async def run_with_upload(
    req_json: str,
    file: UploadFile = File(...),
) -> BlackLittermanResponse:
    """Chay tren du lieu gia that do sinh vien tai len (CSV: cot Date + cac ma co phieu)."""
    import json

    req = BlackLittermanRequest.model_validate(json.loads(req_json))
    content = await file.read()
    prices = pd.read_csv(io.BytesIO(content), parse_dates=["Date"]).sort_values("Date").set_index("Date")
    return _compute(prices, req)
