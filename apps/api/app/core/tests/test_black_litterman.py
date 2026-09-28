"""Kiem tra don vi cho mo hinh Black-Litterman: (1) khong co quan diem thi E[R] = pi;
(2) tinh toan tren vi du 3 tai san co the kiem tra tay duoc; (3) trong so cong bang 1."""
import numpy as np
import pytest

from app.core.black_litterman import (
    BlackLittermanInputs,
    implied_equilibrium_returns,
    optimal_weights,
    posterior_returns,
    run_black_litterman,
)


def _toy_inputs(p: np.ndarray, q: np.ndarray, omega: np.ndarray | None = None) -> BlackLittermanInputs:
    sigma = np.array(
        [
            [0.0400, 0.0120, 0.0080],
            [0.0120, 0.0225, 0.0060],
            [0.0080, 0.0060, 0.0100],
        ]
    )
    w_mkt = np.array([0.5, 0.3, 0.2])
    return BlackLittermanInputs(
        sigma=sigma, w_mkt=w_mkt, delta=2.5, tau=0.05, p=p, q=q, omega=omega
    )


def test_no_view_reduces_to_equilibrium_returns():
    """Khi P, Q rong (khong co quan diem nao), E[R] hau nghiem phai xap xi pi."""
    p = np.zeros((1, 3))
    q = np.zeros(1)
    omega = np.eye(1) * 1e6  # do khong chac chan cuc lon -> quan diem khong co trong so
    inputs = _toy_inputs(p, q, omega)
    e_r, _ = posterior_returns(inputs)
    pi = implied_equilibrium_returns(inputs.sigma, inputs.w_mkt, inputs.delta)
    assert np.allclose(e_r, pi, atol=1e-3)


def test_single_absolute_view_pulls_return_toward_view():
    """Mot quan diem tuyet doi (P = [1,0,0], Q = 0.15) phai keo E[R] cua tai san 1
    ve gan gia tri quan diem hon so voi pi ban dau, theo dung huong quan diem."""
    p = np.array([[1.0, 0.0, 0.0]])
    q = np.array([0.15])
    inputs = _toy_inputs(p, q)

    pi = implied_equilibrium_returns(inputs.sigma, inputs.w_mkt, inputs.delta)
    e_r, m_inv = posterior_returns(inputs)

    assert m_inv.shape == (3, 3)
    # Quan diem 0.15 cao hon pi[0] -> E[R][0] phai dich chuyen len tren, ve phia 0.15
    assert pi[0] < e_r[0] < 0.15 + 1e-6


def test_weights_sum_to_one_after_normalization():
    p = np.array([[1.0, -1.0, 0.0]])  # tai san 1 vuot tai san 2 5%/nam
    q = np.array([0.05])
    inputs = _toy_inputs(p, q)
    result = run_black_litterman(inputs)
    w = np.array(result["weights_optimal"])
    assert np.isclose(w.sum(), 1.0, atol=1e-9)


def test_optimal_weights_matches_manual_formula():
    p = np.array([[1.0, 0.0, 0.0]])
    q = np.array([0.10])
    inputs = _toy_inputs(p, q)
    e_r, m_inv = posterior_returns(inputs)
    w = optimal_weights(e_r, m_inv, inputs.sigma, inputs.delta)
    total_cov = inputs.sigma + m_inv
    expected = np.linalg.inv(inputs.delta * total_cov) @ e_r
    assert np.allclose(w, expected)


if __name__ == "__main__":
    raise SystemExit(pytest.main([__file__, "-v"]))
