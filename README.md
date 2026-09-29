# BL Advisor: Ghostfolio + Black-Litterman Allocation

Đồ án thực tập tốt nghiệp CNTT, Học viện Công nghệ Bưu chính Viễn thông (PTIT).
Sinh viên: **Nguyễn Văn Trung**, kontrungcany@gmail.com

## Đây là fork của Ghostfolio

Kể từ commit thiết lập lại kiến trúc này, repo **là một fork trực tiếp của
[Ghostfolio](https://github.com/ghostfolio/ghostfolio)** (bản quyền © Thomas Kaul
và Ghostfolio contributors, giấy phép **AGPL-3.0**, xem `LICENSE`). Toàn bộ mã
nguồn ứng dụng quản lý tài sản gốc (`apps/api`, `apps/client`, `libs/`, `prisma/`,
cấu hình Nx/Docker...) là **nguyên trạng của dự án Ghostfolio**, không phải code do
sinh viên tự viết từ đầu. README gốc của Ghostfolio được giữ lại tại
`README.md.ghostfolio_upstream` để đối chiếu.

Phần đóng góp của sinh viên trong đồ án này là **tính năng Black-Litterman
Allocation** được thêm mới vào trang Allocations có sẵn của Ghostfolio:

- Backend: `apps/api/src/app/portfolio/black-litterman.service.ts` (port từ Python
  sang TypeScript, giữ nguyên công thức toán học) + endpoint
  `GET /api/v1/portfolio/allocations/black-litterman`.
- Frontend: khối UI mới trong
  `apps/client/src/app/pages/portfolio/allocations/allocations-page.component.*`
  hiển thị kết quả phân bổ Black-Litterman bên cạnh phân bổ hiện có của Ghostfolio.

Bản prototype ban đầu (FastAPI + React, trước khi quyết định fork Ghostfolio) **đã
được xoá khỏi repo**; chỉ còn trong lịch sử git. Logic toán Black-Litterman đã kiểm
thử trong prototype đó là cơ sở để port sang TypeScript ở bản hiện tại (4 unit test
Python đã được port sang Jest trong `black-litterman.service.spec.ts`).

## Giao diện tiếng Việt

Giao diện web mặc định là **tiếng Việt** (`/vi/`): truy cập `/` luôn được chuyển
hướng sang `/vi/`, người dùng mới/chưa chọn ngôn ngữ dùng tiếng Việt, và mục
"Tiếng Việt" có trong phần Cài đặt tài khoản. Bản dịch nằm tại
`apps/client/src/locales/messages.vi.xlf`. Các ngôn ngữ khác vẫn truy cập được qua
đường dẫn tương ứng (ví dụ `/en/`).

## Vì sao chọn fork Ghostfolio thay vì viết lại từ đầu

Ghostfolio là phần mềm quản lý tài sản cá nhân mã nguồn mở, production-grade, viết
bằng NestJS (backend) + Angular (frontend) + PostgreSQL/Prisma + Redis, đã có sẵn đầy
đủ các chức năng quản lý danh mục (Accounts, Activities, Allocations, Analysis, FIRE,
X-ray, Admin, Auth...). Quyết định (đã được người hướng dẫn/chủ đồ án xác nhận) là
giữ nguyên toàn bộ nền tảng này và chỉ tập trung công sức của đồ án vào phần giá trị
cốt lõi: bổ sung mô hình Black-Litterman vào trang Allocations, thay vì viết lại một
ứng dụng quản lý tài sản đầy đủ từ đầu.

## Kiến trúc hiện tại (nguyên trạng Ghostfolio + bổ sung Black-Litterman)

```
apps/
  api/      NestJS, backend gốc của Ghostfolio + module Black-Litterman mới
  client/   Angular, frontend gốc của Ghostfolio + UI Black-Litterman mới
libs/       Thư viện dùng chung (Nx workspace) của Ghostfolio
prisma/     Schema Prisma / migration của Ghostfolio
docker/     Cấu hình Docker Compose gốc của Ghostfolio (không dùng trong môi trường
            thực tập này vì Docker daemon không chạy được trong sandbox, chạy
            PostgreSQL 16 + Redis cài qua apt trực tiếp, xem docs/BAO_CAO_THUC_TAP.md)
docs/
  BAO_CAO_THUC_TAP.md   nội dung báo cáo thực tập (Phần 1-5 theo mẫu PTIT)
```

## Chạy thử (không dùng Docker)

Yêu cầu: Node.js >= 22.22.3, PostgreSQL 16, Redis, npm.

```bash
# 1. PostgreSQL + Redis (cài qua apt, không dùng Docker)
pg_ctlcluster 16 main start
redis-server --daemonize yes

# 2. Cài dependency (Nx monorepo)
npm install

# 3. Cấu hình .env (DATABASE_URL, REDIS_HOST/PORT, JWT_SECRET_KEY, ACCESS_TOKEN_SALT)
cp .env.example .env   # rồi chỉnh theo hướng dẫn trong docs/BAO_CAO_THUC_TAP.md

# 4. Tạo schema DB
npx prisma migrate deploy

# 5. Chạy backend + frontend (xem chi tiết lệnh thật đã chạy trong báo cáo thực tập)
npx nx serve api
npx nx serve client
```

Chi tiết đầy đủ về việc dựng môi trường (kể cả phần nào chạy được / không chạy được
và lý do kỹ thuật) được ghi trong `docs/BAO_CAO_THUC_TAP.md`.

## Mô hình toán Black-Litterman (tóm tắt)

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

Công thức giữ nguyên so với bản Python gốc của prototype ban đầu; chỉ
đổi ngôn ngữ cài đặt sang TypeScript trong `apps/api/src/app/portfolio/black-litterman.service.ts`.

## Giấy phép

Repo này là fork của Ghostfolio và được phân phối theo **AGPL-3.0**, giữ nguyên toàn
bộ copyright notice gốc trong mã nguồn Ghostfolio. Xem `LICENSE`.

Ghostfolio gốc: https://github.com/ghostfolio/ghostfolio, © Thomas Kaul và
Ghostfolio contributors.
