# AUDIT LEDGER: Báo cáo thực tập tốt nghiệp (Nguyễn Văn Trung, ITM Semiconductor)

Ghi lại các quyết định mặc định tự chọn (không hỏi lại người dùng, theo ủy quyền trước) khi soạn `docs/BAO_CAO_THUC_TAP.md`, cùng lý do và các bước kiểm tra đã thực hiện.

## D-1. Quy trình 3 skill

- Gọi `Skill: academic-paper` (mode `full`, áp dụng ở mức phù hợp cho một mục báo cáo thực tập, không chạy toàn bộ 12-agent interview có checkpoint chờ xác nhận người dùng, vì FORCE RULE 1b cấm hỏi lại và task chỉ định viết trực tiếp một mục, không phải một bài báo tạp chí độc lập). Áp dụng nguyên tắc chính: cấu trúc IMRaD thu gọn (Đặt vấn đề → Khảo sát liên quan → Phương pháp → Thiết kế hệ thống → Kết quả → Hạn chế → Kết luận), công thức toán đánh số, mọi tuyên bố định lượng phải có nguồn.
- Gọi `Skill: proofreading` (mode `report`). Tài liệu là Markdown tiếng Việt (không phải LaTeX), nên áp dụng thủ công các mục còn liên quan: định nghĩa ký hiệu toán trước khi dùng, đánh số công thức nhất quán, không tham chiếu công thức trước khi xuất hiện, bảng/hình có chú thích, không dùng "you"/ngôi thứ nhất số ít. Phát hiện chính: không có lỗi tham chiếu công thức ngược, ký hiệu toán được định nghĩa trước khi dùng trong mục 5.3.
- Gọi `Skill: stop-slop`. Rà soát cụm sáo rỗng tiếng Việt thường gặp ("đóng vai trò quan trọng", "không thể phủ nhận", "một cách hiệu quả", "vượt trội", "đột phá"...): không phát hiện. Rà em dash: phát hiện 34 chỗ dùng "-" trong lần soạn đầu, đã thay toàn bộ bằng dấu phẩy/dấu chấm câu phù hợp ngữ cảnh (script Python thay `", "` → `", "`, sau đó sửa tay 2 chỗ trong mục Tài liệu tham khảo/Nguồn mã cho tự nhiên hơn bằng dấu chấm và ngoặc đơn).

## D-2. Phần 1, 2, 4: giữ dạng khung/placeholder

Quyết định: không bịa ngày tháng nhật ký, mã số sinh viên, thông tin liên hệ cán bộ hướng dẫn, vì đây là thông tin chỉ sinh viên và công ty biết chính xác. Đã điền sẵn "Nguyễn Văn Trung" và email kontrungcany@gmail.com (khớp với thông tin có trong ngữ cảnh phiên làm việc), các trường còn lại để `[Sinh viên điền]`. Áp dụng nguyên tắc liêm chính B3 (CLAUDE.md gốc của repo B-i-ESG2, áp dụng tinh thần tương tự dù đây là repo khác): biến/thông tin không có thì để trống, không bịa.

## D-3. Phần 3 (giới thiệu ITM Semiconductor): để placeholder, không bịa lịch sử/số liệu công ty

Task nêu rõ không có thông tin xác thực về ITM Semiconductor. Quyết định: viết đủ khung 4 mục theo đúng mẫu Word (3.1–3.4), mỗi mục có placeholder `[Sinh viên bổ sung: ...]` mô tả rõ loại thông tin cần điền, kèm một dòng ghi chú liêm chính giải thích lý do để trống. Không dùng WebSearch để tra thông tin công ty thay sinh viên, vì task yêu cầu rõ đây là thông tin sinh viên phải tự xác minh trực tiếp tại đơn vị, không phải thông tin nghiên cứu học thuật cần verify qua nguồn mở.

## D-4. Trích dẫn học thuật: đã xác minh qua WebSearch

Bốn tài liệu tham khảo cốt lõi của mục 5 đã tra cứu qua WebSearch trước khi trích dẫn, không dùng chi tiết từ trí nhớ mô hình:

- Markowitz, H. (1952). Portfolio Selection. *The Journal of Finance*, 7(1), 77–91. (Xác minh: Wiley Online Library, AFA Journal of Finance archive.)
- Black, F., & Litterman, R. (1992). Global Portfolio Optimization. *Financial Analysts Journal*, 48(5), 28–43. (Xác minh: CFA Institute Research Foundation, Taylor & Francis/tandfonline DOI abstract.)
- He, G., & Litterman, R. (1999). *The Intuition Behind Black-Litterman Model Portfolios*. Goldman Sachs Investment Management Research, working paper: đây không phải bài báo tạp chí, không có số trang/volume chính thức; ghi đúng là "working paper", không bịa số trang. (Xác minh: SSRN abstract id 334304.)
- Idzorek, T. (2005). *A Step-by-Step Guide to the Black-Litterman Model: Incorporating User-Specified Confidence Levels*. Working paper: tương tự, không có volume/trang tạp chí chính thức nên không ghi. (Xác minh: SSRN, ResearchGate, bản PDF lưu tại Duke University teaching page.)
- Grinold, R. C., & Kahn, R. N. (2000). *Active Portfolio Management* (2nd ed.). McGraw-Hill. Trích dẫn theo đúng comment gốc trong mã nguồn (`main.py`, xử lý `delta_is_fallback`); đây là tài liệu sách giáo khoa kinh điển về active portfolio management, không tra cứu số trang chi tiết vì chỉ trích dẫn khái niệm delta mặc định 2,5, không trích dẫn trực tiếp một đoạn văn hay số trang cụ thể.

Không có trích dẫn nào bị loại vì không xác minh được; cả 5 nguồn đều xác nhận tồn tại thật qua WebSearch hoặc đã có sẵn trong comment mã nguồn do sinh viên/nhóm viết trước.

## D-5. Số liệu trong báo cáo: khớp với chạy thực tế, không bịa

- Chạy `pytest app/core/tests/test_black_litterman.py -v` trong `.venv` có sẵn của repo: kết quả thật là **4 passed in 0.08s**, cả 4 tên test đều khớp với log lệnh chạy, đã dán nguyên văn vào mục 5.5.
- Số dòng file `sample_prices_SYNTHETIC.csv`: 757 dòng kể cả header → 756 dòng dữ liệu, khớp với giá trị mặc định `lookback_days = 756` trong `schemas.py`; đã đối chiếu và ghi đúng "756 ngày" trong báo cáo, không dùng con số 757.
- Không chạy thử endpoint `/api/black-litterman/demo` để lấy số lợi suất/trọng số cụ thể đưa vào báo cáo, vì dữ liệu là SYNTHETIC và task yêu cầu rõ không trình bày kết quả demo như kết quả thực nghiệm thật; báo cáo chỉ mô tả *cấu trúc* response trả về (đã đọc trực tiếp từ `schemas.py`/`main.py`), không đưa con số minh họa có thể bị hiểu nhầm là số liệu tài chính thật.

## D-6. Kiến trúc: mô tả đúng thực trạng code, không phóng đại

- Đọc trực tiếp `apps/web/src/App.tsx` và `apps/web/README.md`: xác nhận đây là khung mặc định từ `create-vite`, chưa có UI nghiệp vụ (không có form nhập quan điểm, không có gọi API). Báo cáo ghi rõ điều này ở mục 5.4 và liệt lại ở mục 5.6 (Hạn chế), không mô tả frontend như một phần đã hoàn thiện.
- Đối chiếu Ghostfolio: xác nhận repo tham khảo tại `/home/user/reference/ghostfolio` có cấu trúc `apps/api` (NestJS). Báo cáo chỉ dùng cấu trúc thư mục làm tham khảo tổ chức, báo cáo nêu rõ Ghostfolio dùng NestJS/Prisma còn đồ án dùng Python/FastAPI thuần, không phải fork, đúng yêu cầu "trích dẫn rõ nguồn tham khảo kiến trúc, không phải code sao chép".

## D-7. Văn phong

- Không dùng "bạn"; không dùng ngôi thứ nhất số ít; dùng "hệ thống", "đồ án", "sinh viên" làm chủ ngữ hành động khi phù hợp.
- Không dùng các động từ tuyệt đối "đảm bảo/chứng minh/xác nhận tuyệt đối" theo kiểu phóng đại; câu duy nhất dùng "đảm bảo" (mục 5.3, "để đảm bảo lợi suất hậu nghiệm xấp xỉ đúng π") mô tả đúng hành vi cơ chế kỹ thuật (Omega rất lớn), không phải một tuyên bố phóng đại về chất lượng mô hình, được giữ lại vì mô tả đúng cơ chế toán học, không phải một khẳng định marketing.
- American English không áp dụng (báo cáo tiếng Việt); các thuật ngữ tiếng Anh giữ nguyên dạng chuẩn quốc tế (FastAPI, React, NumPy, AGPL-3.0) theo quy ước dùng thuật ngữ gốc trong văn bản kỹ thuật tiếng Việt.

## D-8. Việc không thực hiện (nêu rõ để tránh hiểu nhầm là bỏ sót)

- Không chạy `git commit`/`git push` lên repo `tttn_nguyen_van_trung` vì phạm vi công việc được giao là tạo file báo cáo; task không yêu cầu commit. Nếu cần, bước tiếp theo là sinh viên tự review rồi commit.
- Không tạo file `.docx` từ Markdown vì task chỉ yêu cầu bản Markdown "để sau này có thể convert sang .docx theo đúng mẫu PTIT"; việc convert (giữ định dạng OMML công thức, tuân thủ mẫu Word gốc) để lại làm bước sau, ngoài phạm vi yêu cầu hiện tại.
