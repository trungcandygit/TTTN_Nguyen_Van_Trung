"""
Loi Black-Litterman (Black & Litterman, 1992) va toi uu hoa danh muc trung binh-phuong sai.

Tai lieu tham khao (ghi trong bao cao, khong lap lai o day):
- Black, F., & Litterman, R. (1992). Global Portfolio Optimization.
  Financial Analysts Journal, 48(5), 28-43.
- Idzorek, T. (2005). A step-by-step guide to the Black-Litterman model.

Ky hieu (giu nguyen ky hieu chuan trong tai lieu goc de doi chieu bao cao):
    Sigma   : ma tran hiep phuong sai loi suat (n x n)
    w_mkt   : trong so von hoa thi truong cua danh muc tham chieu (n,)
    delta   : he so ngai rui ro (risk aversion coefficient)
    tau     : he so ty le do khong chac chan cua pi (thuong 0.025 - 0.05)
    P       : ma tran "pick" cho cac quan diem (k x n)
    Q       : vector loi suat ky vong theo tung quan diem (k,)
    Omega   : ma tran hiep phuong sai do khong chac chan cua quan diem (k x k, duong cheo)
"""
from __future__ import annotations

from dataclasses import dataclass

import numpy as np


@dataclass
class BlackLittermanInputs:
    sigma: np.ndarray          # (n, n) hiep phuong sai loi suat lich su
    w_mkt: np.ndarray          # (n,) trong so von hoa thi truong
    delta: float               # he so ngai rui ro
    tau: float                 # ty le do khong chac chan cua pi
    p: np.ndarray              # (k, n) ma tran pick cua cac quan diem
    q: np.ndarray              # (k,) loi suat ky vong theo quan diem
    omega: np.ndarray | None = None  # (k, k) neu None se tu tinh theo He (2005)


def implied_equilibrium_returns(sigma: np.ndarray, w_mkt: np.ndarray, delta: float) -> np.ndarray:
    """pi = delta * Sigma * w_mkt  (Eq. 1, loi suat ky vong ham y tu can bang thi truong)."""
    return delta * sigma @ w_mkt


def default_omega(tau: float, p: np.ndarray, sigma: np.ndarray) -> np.ndarray:
    """Omega = diag(tau * P Sigma P') (He & Litterman, 1999).

    Gia dinh cac quan diem doc lap voi nhau (ma tran duong cheo); do khong chac chan
    cua tung quan diem ty le voi phuong sai cua danh muc quan diem do trong Sigma.
    """
    return np.diag(np.diag(tau * p @ sigma @ p.T))


def posterior_returns(inputs: BlackLittermanInputs) -> tuple[np.ndarray, np.ndarray]:
    """Tinh loi suat ky vong hau nghiem E[R] va hiep phuong sai hau nghiem cua no.

    Cong thuc (Black & Litterman, 1992; dang chuan cua He & Litterman, 1999):

        E[R] = [ (tau*Sigma)^-1 + P' Omega^-1 P ]^-1
               [ (tau*Sigma)^-1 * pi + P' Omega^-1 * Q ]

        M^-1 = [ (tau*Sigma)^-1 + P' Omega^-1 P ]^-1   (hiep phuong sai cua E[R])
    """
    sigma, w_mkt, delta, tau, p, q = (
        inputs.sigma, inputs.w_mkt, inputs.delta, inputs.tau, inputs.p, inputs.q
    )
    omega = inputs.omega if inputs.omega is not None else default_omega(tau, p, sigma)

    pi = implied_equilibrium_returns(sigma, w_mkt, delta)

    tau_sigma_inv = np.linalg.inv(tau * sigma)
    omega_inv = np.linalg.inv(omega)

    m_inv = np.linalg.inv(tau_sigma_inv + p.T @ omega_inv @ p)
    e_r = m_inv @ (tau_sigma_inv @ pi + p.T @ omega_inv @ q)

    return e_r, m_inv


def optimal_weights(
    e_r: np.ndarray, posterior_cov: np.ndarray, sigma: np.ndarray, delta: float
) -> np.ndarray:
    """Trong so danh muc toi uu theo trung binh-phuong sai khong rang buoc:

        w* = (delta * (Sigma + M^-1))^-1 * E[R]

    Sigma + M^-1 la tong hiep phuong sai loi suat va hiep phuong sai cua uoc luong
    E[R] hau nghiem (Black & Litterman, 1992, cong thuc 13).
    """
    total_cov = sigma + posterior_cov
    w = np.linalg.solve(delta * total_cov, e_r)
    return w


def run_black_litterman(inputs: BlackLittermanInputs) -> dict:
    """Chay toan bo quy trinh, tra ve ket qua da dinh dang de API/UI su dung."""
    e_r, m_inv = posterior_returns(inputs)
    w_star = optimal_weights(e_r, m_inv, inputs.sigma, inputs.delta)
    w_star_normalized = w_star / np.sum(w_star)

    pi = implied_equilibrium_returns(inputs.sigma, inputs.w_mkt, inputs.delta)

    return {
        "implied_equilibrium_returns": pi.tolist(),
        "posterior_returns": e_r.tolist(),
        "posterior_covariance": m_inv.tolist(),
        "weights_market": inputs.w_mkt.tolist(),
        "weights_optimal": w_star_normalized.tolist(),
    }
