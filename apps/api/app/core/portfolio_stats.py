"""Cac ham thong ke danh muc dung chung: loi suat, hiep phuong sai, hieu suat danh muc."""
from __future__ import annotations

import numpy as np
import pandas as pd


def log_returns(prices: pd.DataFrame) -> pd.DataFrame:
    """Loi suat log tu bang gia dong cua (cot = ma co phieu, hang = ngay)."""
    return np.log(prices / prices.shift(1)).dropna(how="all")


def annualize_mean_cov(
    returns: pd.DataFrame, periods_per_year: int = 252
) -> tuple[np.ndarray, np.ndarray]:
    """Quy doi loi suat trung binh va hiep phuong sai ve theo nam."""
    mu = returns.mean().to_numpy() * periods_per_year
    sigma = returns.cov().to_numpy() * periods_per_year
    return mu, sigma


def portfolio_performance(
    weights: np.ndarray, mu: np.ndarray, sigma: np.ndarray
) -> tuple[float, float]:
    """Loi suat va do lech chuan ky vong cua danh muc voi trong so w."""
    ret = float(weights @ mu)
    vol = float(np.sqrt(weights @ sigma @ weights))
    return ret, vol


def implied_market_weights(market_caps: pd.Series) -> np.ndarray:
    """Trong so von hoa thi truong w_mkt = von hoa i / tong von hoa."""
    caps = market_caps.to_numpy(dtype=float)
    return caps / caps.sum()


def implied_risk_aversion(
    market_return: float, market_variance: float, risk_free_rate: float = 0.0
) -> float:
    """delta = (E[R_m] - r_f) / Var(R_m)  (He & Litterman, 1999, cong thuc 17)."""
    return (market_return - risk_free_rate) / market_variance
