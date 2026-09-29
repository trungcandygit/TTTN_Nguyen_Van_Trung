# Kiểm thử end-to-end (Cypress)

Các kịch bản dưới đây chạy trên ứng dụng đã nạp dữ liệu demo (`npm run database:seed:demo`) và đang chạy ở `http://localhost:3333` (backend cùng phần client đã build). Chúng không chạy được trong môi trường sandbox vì không tải được Cypress, nên cần chạy trên máy của bạn.

```bash
# Cài Cypress (một lần, không ghi vào package.json)
npm install --no-save cypress --legacy-peer-deps

# Chạy toàn bộ kịch bản (không giao diện)
npx cypress run --config-file e2e/cypress.config.ts

# Hoặc mở giao diện Cypress
npx cypress open --config-file e2e/cypress.config.ts
```

Đổi địa chỉ ứng dụng bằng biến `CYPRESS_BASE_URL`, ví dụ `CYPRESS_BASE_URL=https://localhost:4200`.

Kịch bản: trang tối ưu hóa danh mục (`optimizer.cy.ts`), ô nhập số có dấu chấm ngăn cách (`number-input.cy.ts`), benchmark mô phỏng (`benchmarks.cy.ts`).
