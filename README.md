# BL Advisor

**Quản lý danh mục đầu tư mã nguồn mở bằng tiếng Việt, kèm phân bổ tài sản theo mô hình Black-Litterman.**

BL Advisor là đồ án thực tập tốt nghiệp của Nguyễn Văn Trung. Dự án được xây dựng trên nền tảng [Ghostfolio](https://github.com/ghostfolio/ghostfolio) (mã nguồn mở, giấy phép AGPL-3.0), bổ sung giao diện tiếng Việt mặc định, tiền tệ VND, mô hình phân bổ Black-Litterman và lõi tối ưu hóa danh mục.

> **Lưu ý về nguồn gốc.** Đây là một bản fork của Ghostfolio, không phải phần mềm viết mới từ đầu. Phần lớn chức năng quản lý danh mục (tài khoản, giao dịch, hiệu suất, phân tích rủi ro X-Ray, v.v.) là của Ghostfolio. Phần đóng góp riêng của tác giả được liệt kê rõ ở mục [Đóng góp của tác giả](#đóng-góp-của-tác-giả).

## Mục lục

- [Giới thiệu](#giới-thiệu)
- [Đóng góp của tác giả](#đóng-góp-của-tác-giả)
- [Tính năng](#tính-năng)
- [Kiến trúc tổng quan](#kiến-trúc-tổng-quan)
- [Công nghệ](#công-nghệ)
- [Bắt đầu nhanh](#bắt-đầu-nhanh)
- [Đăng nhập và tài khoản demo](#đăng-nhập-và-tài-khoản-demo)
- [Cấu hình](#cấu-hình)
- [Mô hình Black-Litterman](#mô-hình-black-litterman)
- [Lõi tối ưu hóa danh mục](#lõi-tối-ưu-hóa-danh-mục)
- [Kiểm thử](#kiểm-thử)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Lộ trình](#lộ-trình)
- [Đóng góp](#đóng-góp)
- [Giấy phép](#giấy-phép)
- [Ghi nhận và liên hệ](#ghi-nhận-và-liên-hệ)

## Giới thiệu

Nhà đầu tư cá nhân ở Việt Nam thường phải theo dõi cổ phiếu, ETF, tiền mã hóa, vàng và tiền gửi ở nhiều nơi khác nhau, và ít có công cụ mã nguồn mở hỗ trợ tiếng Việt cùng đơn vị VND. Đồng thời, việc phân bổ tài sản theo lý thuyết danh mục hiện đại thường chỉ có trong tài liệu học thuật.

BL Advisor giải quyết hai việc:

1. **Theo dõi danh mục** bằng giao diện tiếng Việt, VND là tiền tệ mặc định cho người dùng mới.
2. **Gợi ý phân bổ tài sản** theo mô hình Black-Litterman, tính trực tiếp từ các khoản nắm giữ thực tế của người dùng, hiển thị ngay trên trang Phân bổ.

Ứng dụng có thể tự lưu trữ (self-hosted), dữ liệu nằm trong PostgreSQL của bạn.

Ảnh chụp màn hình chưa được đưa vào repository. Để xem giao diện, hãy chạy ứng dụng theo phần [Bắt đầu nhanh](#bắt-đầu-nhanh) với dữ liệu demo.

## Đóng góp của tác giả

Ghostfolio là công trình của Thomas Kaul và các cộng tác viên Ghostfolio. Các phần dưới đây do tác giả của BL Advisor thực hiện:

| Hạng mục                | Nội dung                                                                                                                   | Trạng thái                                                                 |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Phân bổ Black-Litterman | Service backend, endpoint `GET /api/v1/portfolio/allocations/black-litterman`, khối giao diện trên trang Phân bổ           | Hoạt động                                                                  |
| Lõi tối ưu hóa danh mục | Markowitz (phương sai tối thiểu, Sharpe tối đa, đường biên hiệu quả), CVaR, risk parity, các chỉ số danh mục; có unit test | Đã có lõi tính toán, chưa có endpoint và trang giao diện (đang phát triển) |
| Việt hóa                | Tiếng Việt là ngôn ngữ giao diện mặc định (`messages.vi.xlf`), đường dẫn `/` chuyển hướng sang `/vi` (trên bản production) | Hoạt động                                                                  |
| Tiền tệ                 | VND là tiền tệ mặc định cho người dùng mới                                                                                 | Hoạt động                                                                  |
| Thương hiệu             | Logo riêng, trang chủ, trang Giới thiệu (danh sách công bố lấy từ API công khai của ORCID), hướng dẫn sử dụng riêng        | Hoạt động                                                                  |
| Dữ liệu demo            | 1 quản trị viên và 15 người dùng, giá mô phỏng, tài liệu [docs/DEMO_ACCOUNTS.md](docs/DEMO_ACCOUNTS.md)                    | Hoạt động                                                                  |
| Kiểm thử                | Unit test cho Black-Litterman, lõi tối ưu hóa và trang Giới thiệu                                                          | Hoạt động                                                                  |

Nguyên mẫu FastAPI ban đầu của dự án đã bị xóa khỏi cây thư mục và chỉ còn trong lịch sử git. Service Black-Litterman hiện tại là bản chuyển sang TypeScript của cài đặt tham chiếu đó, để chạy được trong backend NestJS và đọc danh mục thật của người dùng.

## Tính năng

Từ Ghostfolio (giữ nguyên):

- Quản lý tài khoản, giao dịch (mua, bán, cổ tức, phí, lãi, khoản vay) và nhiều loại tài sản
- Hiệu suất danh mục, phân bổ theo lớp tài sản, tiền tệ, khu vực
- Phân tích rủi ro X-Ray, công cụ FIRE
- Nhập và xuất dữ liệu, hệ thống vai trò người dùng (USER, ADMIN)

Do BL Advisor bổ sung:

- Giao diện tiếng Việt mặc định, VND cho người dùng mới
- Khối "Black-Litterman Allocation" trên trang Phân bổ: so sánh tỷ trọng hiện tại với tỷ trọng gợi ý
- Endpoint REST cho phân bổ Black-Litterman
- Trang Giới thiệu và hướng dẫn sử dụng bằng tiếng Việt
- Bộ dữ liệu demo lặp lại được, chạy không cần mạng

## Kiến trúc tổng quan

```mermaid
flowchart LR
    U[Trình duyệt<br/>Angular, /vi] -->|REST /api/v1| A[NestJS API]
    A --> P[(PostgreSQL<br/>Prisma)]
    A --> R[(Redis<br/>cache, hàng đợi)]
    A --> BL[BlackLittermanService]
    BL --> PS[PortfolioService<br/>các khoản nắm giữ]
    BL --> MD[MarketDataService<br/>giá lịch sử 365 ngày]
    OPT[optimizer.math.ts<br/>Markowitz, CVaR, risk parity] -.->|chưa nối endpoint| A
    U -->|API công khai| O[ORCID<br/>danh sách công bố]
```

Luồng của khối Black-Litterman: giao diện gọi `GET /api/v1/portfolio/allocations/black-litterman`, service lấy các khoản nắm giữ có giá trị dương, đọc giá lịch sử 365 ngày, ước lượng kỳ vọng và ma trận hiệp phương sai, chạy mô hình và trả về tỷ trọng hiện tại cùng tỷ trọng Black-Litterman cho từng mã.

## Công nghệ

| Lớp             | Công nghệ                      |
| --------------- | ------------------------------ |
| Monorepo        | Nx 23                          |
| Frontend        | Angular 22, Angular Material   |
| Backend         | NestJS 11, Bull (hàng đợi)     |
| Cơ sở dữ liệu   | PostgreSQL 16, Prisma 7        |
| Cache           | Redis                          |
| Ngôn ngữ        | TypeScript 6                   |
| Kiểm thử        | Jest (api, client, common, ui) |
| Môi trường chạy | Node.js 22                     |

## Bắt đầu nhanh

Hướng dẫn cho macOS và Linux.

### Yêu cầu

- Node.js 22 (xem `.nvmrc`)
- PostgreSQL 16
- Redis

### Các bước

```bash
# 1. Lấy mã nguồn và cài phụ thuộc
git clone https://github.com/<tai-khoan-cua-ban>/TTTN_Nguyen_Van_Trung.git
cd TTTN_Nguyen_Van_Trung
npm install

# 2. Tạo file .env (xem mục Cấu hình để điền giá trị)
cp .env.example .env

# 3. Tạo cấu trúc CSDL
npx prisma migrate deploy

# 4. (Tùy chọn) Nạp dữ liệu demo: 1 admin + 15 người dùng
npm run database:seed:demo

# 5. Chạy backend (cổng 3333)
npm run start:server
```

Mở một terminal khác và chạy frontend:

```bash
npm run start:client
```

Sau đó mở https://localhost:4200/vi/ trong trình duyệt. Dev server dùng chứng chỉ SSL cục bộ nên trình duyệt có thể cảnh báo, bạn cần xác nhận tiếp tục.

Lưu ý:

- Sau khi chạy `npm run database:seed:demo`, hãy **khởi động lại backend** để nạp tỷ giá USD/VND. Nếu cần, xóa cache bằng `redis-cli FLUSHALL`.
- Lệnh seed đọc biến môi trường từ `.env`, nên phải tạo `.env` trước.
- Cần PostgreSQL và Redis đang chạy và khớp với giá trị trong `.env`. Bạn có thể dùng bản cài sẵn trên máy, hoặc `docker compose -f docker/docker-compose.dev.yml up -d` (xem [DEVELOPMENT.md](DEVELOPMENT.md), tài liệu gốc của Ghostfolio bằng tiếng Anh).

## Đăng nhập và tài khoản demo

Hệ thống **không dùng tên đăng nhập**. Người dùng đăng nhập bằng **mã bảo mật** (security token) do hệ thống cấp khi đăng ký, đóng vai trò như mật khẩu.

- Người dùng đầu tiên đăng ký trên một CSDL trống sẽ có vai trò `ADMIN`.
- Nếu đã nạp dữ liệu demo, có thể đăng nhập ngay bằng tài khoản quản trị demo với mã bảo mật `admin-bl-advisor`.
- Danh sách đầy đủ 1 admin và 15 người dùng (mã, mô tả danh mục) nằm ở [docs/DEMO_ACCOUNTS.md](docs/DEMO_ACCOUNTS.md).

Cảnh báo: các mã này chỉ dành cho môi trường phát triển, không dùng ở môi trường thật.

**Về dữ liệu demo:** giá trong bộ demo là **dữ liệu mô phỏng** (bước ngẫu nhiên với seed cố định, neo quanh mức giá hợp lý), lưu với nguồn `MANUAL`, không phải dữ liệu thị trường thật và không dùng để ra quyết định đầu tư. Tiền tệ cơ sở là VND, lịch sử từ năm 2021 đến hiện tại. Chạy lại lệnh seed sẽ tạo lại các tài khoản demo từ đầu và không ảnh hưởng tài khoản khác.

## Cấu hình

Các biến môi trường bắt buộc (mẫu ở `.env.example`, bản dùng cho máy phát triển ở `.env.dev`):

| Biến                | Ý nghĩa                                  |
| ------------------- | ---------------------------------------- |
| `REDIS_HOST`        | Địa chỉ Redis (chạy cục bộ: `localhost`) |
| `REDIS_PORT`        | Cổng Redis, mặc định `6379`              |
| `REDIS_PASSWORD`    | Mật khẩu Redis                           |
| `DATABASE_URL`      | Chuỗi kết nối PostgreSQL                 |
| `ACCESS_TOKEN_SALT` | Chuỗi ngẫu nhiên dùng để băm mã bảo mật  |
| `JWT_SECRET_KEY`    | Chuỗi ngẫu nhiên dùng để ký JWT          |

Khi chạy trên máy, `DATABASE_URL` cần trỏ tới `localhost` (không phải `postgres` như trong mẫu dành cho Docker), ví dụ:

```bash
DATABASE_URL=postgresql://user:matkhau@localhost:5432/ghostfolio-db?connect_timeout=300
```

`ACCESS_TOKEN_SALT` và `JWT_SECRET_KEY` nên là chuỗi ngẫu nhiên dài, ví dụ tạo bằng `openssl rand -hex 32`. Không commit file `.env` chứa giá trị thật.

Hằng số cấu hình dùng chung nằm ở `libs/common/src/lib/config.ts`, trong đó `DEFAULT_LANGUAGE_CODE = 'vi'` và `DEFAULT_USER_CURRENCY = 'VND'`. Tiền tệ trục quy đổi tỷ giá nội bộ (`DEFAULT_CURRENCY`) vẫn là USD và không nên đổi.

## Mô hình Black-Litterman

Cài đặt: [apps/api/src/app/portfolio/black-litterman.service.ts](apps/api/src/app/portfolio/black-litterman.service.ts). Ký hiệu theo Black và Litterman (1992), He và Litterman (1999).

Các đại lượng: `Sigma` là ma trận hiệp phương sai lợi suất (hàng năm hóa), `w_mkt` là tỷ trọng tham chiếu (ở đây là tỷ trọng giá trị hiện tại của danh mục), `delta` là hệ số ngại rủi ro, `tau` là độ bất định của tiên nghiệm, `P` và `Q` là ma trận chọn và vector kỳ vọng của các quan điểm nhà đầu tư, `Omega` là ma trận hiệp phương sai bất định của các quan điểm.

1. Lợi suất cân bằng ngầm định:

   ```text
   pi = delta * Sigma * w_mkt
   ```

2. Lợi suất kỳ vọng hậu nghiệm:

   ```text
   E[R]  = [ (tau*Sigma)^-1 + P' Omega^-1 P ]^-1 [ (tau*Sigma)^-1 pi + P' Omega^-1 Q ]
   M^-1  = [ (tau*Sigma)^-1 + P' Omega^-1 P ]^-1
   ```

3. Tỷ trọng tối ưu không ràng buộc (sau đó chuẩn hóa để tổng bằng 1):

   ```text
   w* = ( delta * (Sigma + M^-1) )^-1 * E[R]
   ```

Cách endpoint hiện chạy: `tau = 0.05`; `delta` lấy từ `(E[R_m] - r_f) / Var(R_m)` với `r_f = 0`, và dùng `delta = 2.5` khi giá trị này không dương; `Sigma` và kỳ vọng ước lượng từ lợi suất log của giá đóng cửa 365 ngày gần nhất, nhân với 252 ngày giao dịch. Cần ít nhất 2 khoản nắm giữ có giá trị dương, nếu không endpoint trả lỗi 400.

### Hạn chế hiện tại

- **Chưa có giao diện nhập quan điểm nhà đầu tư.** Endpoint dùng một quan điểm rỗng với độ bất định rất lớn (`Omega = 1e6`), nên lợi suất hậu nghiệm thực chất bằng lợi suất cân bằng ngầm định.
- **Ma trận hiệp phương sai dự phòng.** Khi số dòng giá trùng ngày chung của các mã nắm giữ ít hơn 10, service dùng ma trận đường chéo `0.04 * I` và kỳ vọng bằng 0 để vẫn trả về kết quả xác định. Kết quả trong trường hợp này chỉ mang tính minh họa.
- **Dữ liệu demo là mô phỏng** (xem mục trên), nên tỷ trọng gợi ý trên tài khoản demo không có ý nghĩa đầu tư.
- Mô hình không có ràng buộc long-only hay giới hạn tỷ trọng, và có thể cho tỷ trọng âm.
- Đây là công cụ học thuật, không phải tư vấn đầu tư.

## Lõi tối ưu hóa danh mục

Mã nguồn: [apps/api/src/app/portfolio/optimizer/optimizer.math.ts](apps/api/src/app/portfolio/optimizer/optimizer.math.ts), có unit test trong `optimizer.math.spec.ts` cùng thư mục. Các thuật toán đều long-only, tổng tỷ trọng bằng 1, có thể đặt trần tỷ trọng mỗi tài sản, không phụ thuộc thư viện ngoài:

- Markowitz: phương sai tối thiểu, tối đa hóa hàm hữu dụng trung bình-phương sai, Sharpe tối đa (danh mục tiếp tuyến), đường biên hiệu quả
- CVaR tối thiểu trên kịch bản lịch sử (Rockafellar và Uryasev, 2000), giải bằng phương pháp dưới gradient chiếu
- Các mốc so sánh: tỷ trọng đều, nghịch đảo biến động, risk parity (đóng góp rủi ro bằng nhau)
- Chỉ số danh mục, gồm cả mức sụt giảm tối đa (max drawdown)

**Trạng thái:** đây mới là lõi tính toán. Endpoint API và trang giao diện cho phần này **đang phát triển**, chưa dùng được từ giao diện người dùng.

## Kiểm thử

Dự án áp dụng cách tiếp cận TDD (viết test trước, cài đặt sau) cho phần đóng góp riêng, như service Black-Litterman và lõi tối ưu hóa.

```bash
npx nx test api        # unit test backend (gồm Black-Litterman, optimizer)
npx nx test client     # unit test frontend (gồm trang Giới thiệu, ORCID)
npx nx lint client     # kiểm tra lint frontend
npm test               # chạy test của mọi project (dùng biến môi trường từ .env.example)
```

Test end-to-end chưa có, xem [Lộ trình](#lộ-trình). Quy trình CI của repository nằm ở `.github/workflows/`.

## Cấu trúc thư mục

```text
.
├── apps/
│   ├── api/                  # Backend NestJS
│   │   └── src/app/portfolio/
│   │       ├── black-litterman.service.ts       # Black-Litterman
│   │       ├── black-litterman.service.spec.ts
│   │       ├── portfolio.controller.ts          # endpoint allocations/black-litterman
│   │       └── optimizer/                       # Markowitz, CVaR, risk parity
│   └── client/               # Frontend Angular
│       └── src/
│           ├── app/pages/    # about, resources (hướng dẫn), portfolio/allocations, ...
│           └── locales/      # messages.vi.xlf và các ngôn ngữ khác
├── libs/
│   ├── common/               # Kiểu, interface và hằng số dùng chung (config.ts)
│   └── ui/                   # Thành phần giao diện dùng chung, DataService
├── prisma/
│   ├── schema.prisma         # Lược đồ CSDL
│   ├── migrations/           # Các migration
│   ├── seed.mts              # Seed gốc của Ghostfolio
│   └── seed-demo.mts         # Seed dữ liệu demo (1 admin + 15 người dùng)
├── docs/                     # DEMO_ACCOUNTS.md, báo cáo thực tập, AUDIT_LEDGER.md
├── docker/                   # Docker Compose (dev, build) và entrypoint
├── test/                     # Dữ liệu phục vụ kiểm thử
├── .env.example              # Mẫu biến môi trường
├── DEVELOPMENT.md            # Hướng dẫn phát triển gốc của Ghostfolio (tiếng Anh)
└── LICENSE                   # AGPL-3.0
```

Báo cáo thực tập nằm ở [docs/BAO_CAO_THUC_TAP.md](docs/BAO_CAO_THUC_TAP.md) (cũng có bản `.docx` và `.pdf` cùng thư mục).

## Lộ trình

- [ ] Trang tối ưu hóa danh mục (đang phát triển): endpoint API và giao diện cho Markowitz, CVaR và Black-Litterman, kèm backtest
- [ ] Giao diện nhập quan điểm nhà đầu tư (P, Q, Omega) cho Black-Litterman
- [ ] Test end-to-end bằng Cypress
- [x] Black-Litterman trên trang Phân bổ
- [x] Lõi tối ưu hóa (Markowitz, CVaR, risk parity) có unit test
- [x] Việt hóa giao diện, VND mặc định, thương hiệu riêng
- [x] Bộ dữ liệu demo

Các mục chưa đánh dấu là kế hoạch, chưa có mã nguồn hoàn chỉnh trong repository.

## Đóng góp

Đây là đồ án thực tập, nhưng góp ý và pull request vẫn được hoan nghênh. Khi đóng góp:

1. Mở issue mô tả thay đổi trước khi làm việc lớn.
2. Viết test cho phần logic mới và chạy `npx nx test api`, `npx nx test client`, `npx nx lint client` trước khi gửi.
3. Vì giấy phép AGPL-3.0, mã đóng góp sẽ được phát hành theo cùng giấy phép.

Vấn đề bảo mật xem [SECURITY.md](SECURITY.md).

## Giấy phép

Phát hành theo **GNU Affero General Public License v3.0 (AGPL-3.0)**, xem [LICENSE](LICENSE). Nếu bạn triển khai phiên bản đã chỉnh sửa như một dịch vụ mạng, AGPL yêu cầu cung cấp mã nguồn tương ứng cho người dùng dịch vụ đó.

Copyright (C) Thomas Kaul và các cộng tác viên Ghostfolio, cùng các đóng góp của Nguyễn Văn Trung cho BL Advisor.

## Ghi nhận và liên hệ

**Ghi nhận**

- [Ghostfolio](https://github.com/ghostfolio/ghostfolio) của Thomas Kaul và các cộng tác viên: nền tảng của toàn bộ dự án. README gốc của Ghostfolio được lưu ở `README.md.ghostfolio_upstream`.
- Black, F. và Litterman, R. (1992). Global Portfolio Optimization. _Financial Analysts Journal_, 48(5), 28-43.
- He, G. và Litterman, R. (1999). The Intuition Behind Black-Litterman Model Portfolios.
- Markowitz, H. (1952). Portfolio Selection. _The Journal of Finance_.
- Rockafellar, R. T. và Uryasev, S. (2000). Optimization of Conditional Value-at-Risk. _Journal of Risk_.

**Tác giả**

Nguyễn Văn Trung, tốt nghiệp ngành Kế toán tại Đại học Kinh tế Quốc dân và ngành Kinh tế đầu tư tại Học viện Chính sách và Phát triển.

- Email: kontrungcany@gmail.com
- ORCID: [0009-0008-3307-6569](https://orcid.org/0009-0008-3307-6569)
