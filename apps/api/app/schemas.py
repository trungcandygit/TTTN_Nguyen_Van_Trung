"""Schema Pydantic cho API: dinh nghia du lieu vao/ra, PTIT yeu cau nen bao cao phai
khop voi API thuc te - moi truong (field) o day duoc dan link truc tiep vao Phan 5
cua bao cao khi mo ta thiet ke he thong."""
from __future__ import annotations

from pydantic import BaseModel, Field


class View(BaseModel):
    """Mot quan diem cua nha dau tu.

    - Quan diem tuyet doi: assets = ["VCB"], weights = [1.0], expected_return = 0.15
      (VCB se sinh loi 15%/nam)
    - Quan diem tuong doi: assets = ["VCB", "BID"], weights = [1.0, -1.0], expected_return = 0.05
      (VCB vuot BID 5%/nam)
    """

    assets: list[str] = Field(..., min_length=1)
    weights: list[float] = Field(..., min_length=1)
    expected_return: float
    confidence: float = Field(
        default=1.0, gt=0, le=1, description="Do tin cay quan diem, 0-1; 1 = mac dinh theo He (2005)"
    )


class BlackLittermanRequest(BaseModel):
    tickers: list[str] = Field(..., min_length=2, description="Danh sach ma co phieu, vi du VCB, BID, CTG")
    lookback_days: int = Field(default=756, ge=60, description="So ngay giao dich dung de uoc luong hiep phuong sai (mac dinh 3 nam)")
    market_caps: dict[str, float] = Field(..., description="Von hoa thi truong tung ma, dung VND hoac USD nhat quan")
    risk_free_rate: float = Field(default=0.03, description="Lai suat phi rui ro nam, vi du 0.03 = 3%/nam")
    tau: float = Field(default=0.05, gt=0, description="He so ty le do khong chac chan cua pi")
    views: list[View] = Field(default_factory=list)


class BlackLittermanResponse(BaseModel):
    tickers: list[str]
    implied_equilibrium_returns: list[float]
    posterior_returns: list[float]
    weights_market: list[float]
    weights_optimal: list[float]
    delta: float
    delta_is_fallback: bool = Field(
        default=False,
        description="True neu delta uoc luong tu du lieu <= 0 va he thong dung gia tri mac dinh 2.5 thay the",
    )
