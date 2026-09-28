"""Dang nhap don gian: 1 tai khoan cau hinh qua bien moi truong, cap token ngau
nhien luu trong bo nho tien trinh. Muc dich la bao ve API demo khoi truy cap cong
khai tuy tien trong pham vi do an tot nghiep, KHONG phai he thong xac thuc da
nguoi dung san xuat (khong co CSDL, khong ma hoa mat khau nang cao, khong het han
token). Han che nay duoc ghi ro trong bao cao (muc Han che)."""
from __future__ import annotations

import os
import secrets

from fastapi import Header, HTTPException

APP_USERNAME = os.environ.get("BL_APP_USERNAME", "trung")
APP_PASSWORD = os.environ.get("BL_APP_PASSWORD", "bladvisor2026")

_valid_tokens: set[str] = set()


def login(username: str, password: str) -> str:
    if not (secrets.compare_digest(username, APP_USERNAME) and secrets.compare_digest(password, APP_PASSWORD)):
        raise HTTPException(status_code=401, detail="Sai ten dang nhap hoac mat khau.")
    token = secrets.token_urlsafe(32)
    _valid_tokens.add(token)
    return token


def require_auth(authorization: str | None = Header(default=None)) -> None:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Thieu token xac thuc.")
    token = authorization.removeprefix("Bearer ").strip()
    if token not in _valid_tokens:
        raise HTTPException(status_code=401, detail="Token khong hop le hoac da het phien.")
