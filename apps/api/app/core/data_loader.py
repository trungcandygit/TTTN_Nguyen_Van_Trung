"""Nap du lieu gia dong cua tu file CSV.

LUU Y VE TINH TRUNG THUC DU LIEU (bat buoc doc truoc khi dung ket qua cho bao cao):
Kho code nay KHONG tu goi API du lieu thi truong that (khong co khoa API duoc cau
hinh san). File du lieu mau trong `sample_data/sample_prices_SYNTHETIC.csv` la du
lieu gia lap (random walk), chi dung de kiem tra he thong chay dung, KHONG duoc dua
vao bao cao nhu ket qua thuc nghiem that. Truoc khi viet Phan 5 cua bao cao, sinh
vien phai thay file nay bang du lieu gia lich su that (vi du tai tu Cafef, Vietstock,
SSI iBoard, hoac thu vien vnstock) va ghi ro nguon + ngay tai du lieu trong bao cao,
dung nguyen tac da ap dung o du an nghien cuu ESG2 cung nhom (moi so lieu phai truy
duoc ve mot file du lieu nguon that).
"""
from __future__ import annotations

import pandas as pd


def load_prices_from_csv(path: str) -> pd.DataFrame:
    """Doc file CSV dang: cot dau la ngay (Date), cac cot con lai la gia dong cua
    tung ma co phieu. Tra ve DataFrame da sap xep theo ngay, index la Date."""
    df = pd.read_csv(path, parse_dates=["Date"])
    df = df.sort_values("Date").set_index("Date")
    return df


def load_prices_from_upload(file_bytes: bytes) -> pd.DataFrame:
    """Nap gia tu noi dung file CSV tai len qua API (multipart upload)."""
    import io

    df = pd.read_csv(io.BytesIO(file_bytes), parse_dates=["Date"])
    df = df.sort_values("Date").set_index("Date")
    return df
