# BL Advisor — Hệ thống hỗ trợ ra quyết định đầu tư danh mục ngành ngân hàng bằng mô hình Black-Litterman

Đồ án thực tập tốt nghiệp CNTT — Học viện Công nghệ Bưu chính Viễn thông (PTIT).
Sinh viên: **Nguyễn Văn Trung** — kontrungcany@gmail.com

## Đề tài

Xây dựng phần mềm áp dụng mô hình **Black-Litterman** (Black & Litterman, 1992) để hỗ
trợ nhà đầu tư kết hợp trọng số vốn hóa thị trường với quan điểm cá nhân (investor
views) nhằm ra quyết định phân bổ danh mục cổ phiếu ngành ngân hàng, thay vì chỉ dùng
tối ưu hóa Markowitz cổ điển (nhạy với sai số ước lượng loi suat kỳ vọng).

Thuộc **Hướng 2** của yêu cầu học phần Thực tập tốt nghiệp: tìm hiểu và áp dụng một
thuật toán/mô hình trong nhóm "hệ thống ra quyết định".

## Kiến trúc

```
apps/
  api/   FastAPI (Python) — lõi tính toán Black-Litterman, REST API
  web/   React + TypeScript (Vite) — giao diện dashboard
docs/
  BAO_CAO_THUC_TAP.md   nội dung báo cáo thực tập (Phần 1-5 theo mẫu PTIT)
```

Cách tổ chức thư mục `apps/api` + `apps/web` tham khảo cách chia backend/frontend
riêng biệt của dự án mã nguồn mở **Ghostfolio**
([github.com/ghostfolio/ghostfolio](https://github.com/ghostfolio/ghostfolio),
giấy phép AGPL-3.0) — một phần mềm quản lý tài sản mã nguồn mở với kiến trúc
NestJS + Angular. Bố cục giao diện (thẻ chỉ số, biểu đồ phân bổ dạng donut, bảng
holdings) cũng lấy cảm hứng bố cục từ Ghostfolio. **Toàn bộ mã nguồn trong repo này
là code gốc**, không sao chép file nào từ Ghostfolio; stack công nghệ khác (Python/
FastAPI thay vì NestJS, do lõi tính toán Black-Litterman phù hợp với numpy/scipy hơn).

## Mô hình toán (tóm tắt, chi tiết ở `docs/BAO_CAO_THUC_TAP.md`)

Loi suat cân bằng hàm ý thị trường:

```
pi = delta * Sigma * w_mkt
```

Loi suat hậu nghiệm (kết hợp quan điểm nhà đầu tư qua ma trận P, Q, Omega):

```
E[R] = [(tau*Sigma)^-1 + P' Omega^-1 P]^-1 [(tau*Sigma)^-1 * pi + P' Omega^-1 * Q]
```

Trọng số danh mục tối ưu:

```
w* = (delta * (Sigma + M^-1))^-1 * E[R]
```

Cài đặt tại `apps/api/app/core/black_litterman.py`, kiểm thử tại
`apps/api/app/core/tests/test_black_litterman.py` (4/4 test pass).

## Chạy thử

### Backend

```bash
cd apps/api
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --port 8822 --reload
```

### Frontend

```bash
cd apps/web
npm install
echo "VITE_API_BASE=http://127.0.0.1:8822" > .env
npm run dev
```

Mở `http://127.0.0.1:5173`, bấm **"Chạy tối ưu hóa (dữ liệu demo)"**.

## Lưu ý quan trọng về dữ liệu

Dữ liệu giá trong `apps/api/sample_data/sample_prices_SYNTHETIC.csv` là **dữ liệu
tổng hợp (random walk), không phải dữ liệu thị trường thật** — chỉ dùng để kiểm tra
hệ thống chạy đúng đầu-cuối. Trước khi dùng kết quả cho báo cáo/demo chính thức, cần
thay bằng dữ liệu giá lịch sử thật (Cafef, Vietstock, SSI iBoard, hoặc thư viện
`vnstock`) và ghi rõ nguồn, ngày tải dữ liệu.

## Giấy phép

Mã nguồn trong repo này: MIT. Xem `LICENSE`.
