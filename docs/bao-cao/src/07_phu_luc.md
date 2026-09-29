@H1N PHỤ LỤC

@H2 Phụ lục A. Cấu trúc thư mục của kho mã

@CODE
.
├── apps/
│   ├── api/                      máy chủ NestJS
│   │   └── src/app/portfolio/
│   │       ├── black-litterman.service.ts
│   │       ├── optimizer/        math, engine, service, DTO, kiểm thử
│   │       └── portfolio.controller.ts
│   └── client/                   giao diện Angular
│       └── src/app/pages/
│           ├── portfolio/optimizer/   trang tối ưu hóa
│           ├── resources/overview/    trang hướng dẫn có ảnh
│           └── about/overview/        Giới thiệu và công bố
├── libs/
│   ├── common/                   kiểu dữ liệu và hằng số dùng chung
│   └── ui/                       thành phần dùng chung, directive nhập số
├── prisma/
│   ├── schema.prisma
│   └── seed-demo.mts             dữ liệu demo và benchmark mô phỏng
├── e2e/                          kịch bản Cypress
└── docs/                         báo cáo, ảnh chụp, tài khoản demo
@ENDCODE

@H2 Phụ lục B. Tham số mặc định và giới hạn của endpoint tối ưu hóa

@TABLE Bảng P.1. Tham số của POST /api/v1/portfolio/optimizer
| Tham số | Mặc định | Giới hạn |
| Số tài sản | không có | từ 2 đến 20 |
| Khoảng dữ liệu lịch sử | 730 ngày | 90 đến 3.650 ngày |
| Tỷ trọng tối đa mỗi tài sản | 100% | từ 1/n đến 100% (nâng lên 1/n nếu thấp hơn) |
| Lãi suất phi rủi ro | 0% | từ −5% đến 50% |
| Mức tin cậy CVaR | 95% | 80% đến 99% |
| Độ bất định $\tau$ | 5% | 0,1% đến 100% |
| Hệ số ngại rủi ro | ước lượng, giới hạn [1; 10] | 0,1 đến 50 khi người dùng đặt |
| Số quan điểm | 0 | tối đa 10, độ tin cậy 5% đến 95% |
| Cửa sổ ước lượng của backtest | 252 ngày | 60 đến 1.000 ngày |
| Tần suất cân bằng lại | hằng quý (63 ngày) | 21, 63 hoặc 252 ngày |
| Số quan sát chung tối thiểu | 60 | cảnh báo khi dưới 250 |

@H2 Phụ lục C. Các mục kiểm thử Minor còn mở

Vòng kiểm thử độc lập thứ nhất còn các mục Minor chưa xử lý, đánh số D13, D16, D20 đến D26, D29, D30 và D33 đến D35, cùng một điểm về trường tiền tệ cơ sở trong phản hồi của `/api/v1/info`. Trong số đó có việc cấu hình địa chỉ gốc của ứng dụng (D20) và bảo vệ đường dẫn quản trị đối với người dùng không phải quản trị viên (D24). Mô tả chi tiết của từng mục nằm trong sổ lỗi của vòng 1. Vòng kiểm thử thứ hai sẽ xác nhận mục nào còn lại.

@H2 Phụ lục D. Danh mục ảnh chụp toàn trang

Bộ ảnh gồm 41 tệp PNG trong thư mục `docs/screenshots/bao-cao` của kho mã, kèm tệp `INDEX.md` ghi đường dẫn trang, tài khoản và chú thích của từng ảnh. Ảnh chụp bằng Chromium ở chiều rộng 1400 px (ảnh điện thoại 375 px) trên bản dựng ngày 29/09/2026 với dữ liệu demo.

@H2 Phụ lục E. Nhận xét của đơn vị thực tập

Nội dung dưới đây chép từ phiếu nhận xét sinh viên của Công ty TNHH ITM Semiconductor Vietnam. Bản có chữ ký và dấu của đơn vị nằm ở phần đính kèm bản in.

@TABLE Bảng P.2. Nhận xét của đơn vị thực tập
| Nội dung | Nhận xét |
| Về ý thức tổ chức kỷ luật | Chấp hành tốt nội quy, quy định của công ty; đi làm đúng giờ, đầy đủ. Có ý thức giữ gìn tài sản, bảo mật thông tin và đảm bảo an toàn lao động. Tuân thủ nghiêm túc sự phân công của cán bộ hướng dẫn. |
| Về tinh thần thái độ học tập | Chăm chỉ, nghiêm túc, chủ động tìm hiểu công việc được giao. Ham học hỏi, có tinh thần cầu tiến, tiếp thu nhanh kiến thức thực tế. Hoàn thành tốt các nhiệm vụ được giao, đảm bảo tiến độ. |
| Về quan hệ, lối sống | Hòa đồng, lễ phép, có quan hệ tốt với cán bộ, nhân viên trong công ty. Có tinh thần hợp tác, sẵn sàng hỗ trợ đồng nghiệp trong công việc. Lối sống lành mạnh, giản dị, trung thực. |
| Các nhận xét khác | Biết vận dụng kiến thức chuyên ngành công nghệ thông tin vào công việc thực tế. Cần tiếp tục trau dồi thêm kỹ năng chuyên môn và ngoại ngữ. |
| Đánh giá chung | Sinh viên đã hoàn thành tốt đợt thực tập tại đơn vị. Kết quả đánh giá chung: Tốt. |
