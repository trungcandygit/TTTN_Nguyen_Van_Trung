# Tài khoản demo (chỉ dùng khi phát triển và kiểm thử)

Tạo bằng lệnh:

```bash
npm run database:seed:demo
```

Sau đó khởi động lại backend để nạp tỷ giá USD/VND và xóa cache nếu cần (`redis-cli FLUSHALL`). Chạy lại lệnh là tạo lại từ đầu các tài khoản demo, không ảnh hưởng tài khoản khác.

Giá trong dữ liệu demo là **dữ liệu mô phỏng** (bước ngẫu nhiên có seed cố định, neo quanh mức giá hợp lý), lưu với nguồn `MANUAL`, chạy được khi không có mạng và không lẫn với dữ liệu thị trường thật. Không dùng để ra quyết định đầu tư. Tiền tệ cơ sở là VND, lịch sử từ 2021 đến hôm nay.

Mã bảo mật (dùng ở ô "Mã bảo mật" khi đăng nhập) là mật khẩu, chỉ dùng cho môi trường phát triển. Không đưa các mã này vào môi trường thật.

| Vai trò | Mã bảo mật | Mô tả |
| --- | --- | --- |
| ADMIN | `admin-bl-advisor` | Quản trị viên, danh mục hỗn hợp |
| USER | `demo-user-01` | Cổ phiếu Việt Nam dài hạn |
| USER | `demo-user-02` | Lướt sóng cổ phiếu VN (nhiều lệnh mua bán) |
| USER | `demo-user-03` | Nắm giữ Bitcoin, Ethereum |
| USER | `demo-user-04` | Trader altcoin (SOL, BNB, ETH, BTC) |
| USER | `demo-user-05` | Cổ phiếu Mỹ (AAPL, MSFT, NVDA, GOOGL) |
| USER | `demo-user-06` | Cân bằng VN, Mỹ, crypto, vàng |
| USER | `demo-user-07` | Bảo thủ: vàng, trái phiếu, ETF, có lãi tiết kiệm |
| USER | `demo-user-08` | DCA ETF hàng tháng |
| USER | `demo-user-09` | Nhóm ngân hàng |
| USER | `demo-user-10` | Công nghệ VN và Mỹ |
| USER | `demo-user-11` | Vàng và tiết kiệm, có lãi tiền gửi |
| USER | `demo-user-12` | Đa dạng toàn bộ 12 loại tài sản, nhiều giao dịch nhất |
| USER | `demo-user-13` | Nhà đầu tư mới (2 năm gần đây) |
| USER | `demo-user-14` | Dùng margin, có khoản vay (LIABILITY) |
| USER | `demo-user-15` | Bán dần, thu cổ tức |

Các loại giao dịch có trong dữ liệu: BUY, SELL, DIVIDEND, FEE, INTEREST, LIABILITY. Tài sản: cổ phiếu VN (VNM, FPT, VCB, HPG, MWG, VIC, ACB, MBB, SSI), ETF VN30, cổ phiếu Mỹ (AAPL, MSFT, NVDA, TSLA, GOOGL), ETF VOO, crypto (BTC, ETH, SOL, BNB), vàng SJC, quỹ trái phiếu.

## Benchmark thị trường (mô phỏng)

Lệnh seed cũng tạo 4 chỉ số mô phỏng và đăng ký làm benchmark thị trường (Property `BENCHMARKS`), có giá cho mọi ngày trong lịch để xu hướng 50 và 200 ngày tính được: VN-Index, VN30, S&P 500 và Bitcoin USD. Đây là dữ liệu mô phỏng, không phải giá thị trường thật. Các chỉ số này không nằm trong danh mục của tài khoản demo nào.
