# BÁO CÁO THỰC TẬP TỐT NGHIỆP

**Học viện Công nghệ Bưu chính Viễn thông, Khoa Công nghệ thông tin 1**

Tài liệu này soạn theo khung mẫu báo cáo thực tập tốt nghiệp bắt buộc của Khoa (Phần 1–5). Phần 1, 2, 3, 4 chứa thông tin cá nhân, kế hoạch và nhật ký chỉ sinh viên và cán bộ hướng dẫn tại công ty mới biết chính xác; các mục này được giữ ở dạng khung có placeholder rõ ràng, sinh viên tự điền. Phần 5, Báo cáo project, được viết đầy đủ, dựa trên mã nguồn thật của đồ án.

---

## PHẦN 1. THÔNG TIN SINH VIÊN, CÔNG TY/ĐƠN VỊ THỰC TẬP, CÁN BỘ HƯỚNG DẪN, GIẢNG VIÊN, TRƯỜNG VÀ KHOA

### Thông tin sinh viên

| Trường thông tin | Nội dung |
|---|---|
| Họ và tên sinh viên | Nguyễn Văn Trung |
| Mã số sinh viên | [Sinh viên điền] |
| Ngành học | Công nghệ thông tin |
| Sinh viên năm thứ | [Sinh viên điền] |
| Địa chỉ tạm trú trong thời gian thực tập | [Sinh viên điền] |
| Số điện thoại | [Sinh viên điền] |
| Email | kontrungcany@gmail.com |

### Thông tin công ty/đơn vị thực tập

| Trường thông tin | Nội dung |
|---|---|
| Công ty/Đơn vị thực tập | ITM Semiconductor |
| Địa chỉ | [Sinh viên điền] |
| Số điện thoại | [Sinh viên điền] |
| Số fax | [Sinh viên điền, nếu có] |
| Cán bộ hướng dẫn tại đơn vị thực tập | [Sinh viên điền] |
| Chức vụ (vị trí) | [Sinh viên điền] |
| Số điện thoại | [Sinh viên điền] |
| Email | [Sinh viên điền] |
| Giảng viên phối hợp hướng dẫn | [Sinh viên điền] |
| Số điện thoại | [Sinh viên điền] |
| Email | [Sinh viên điền] |
| Thời gian thực tập, bắt đầu | [Sinh viên điền] |
| Thời gian thực tập, kết thúc | [Sinh viên điền] |

### Thông tin Học viện Công nghệ Bưu chính Viễn thông

Địa chỉ: Km10 Nguyễn Trãi, Hà Đông, Hà Nội. Điện thoại: 024 3756 2186. Email: ctsv@ptit.edu.vn. Website: www.ptit.edu.vn.

### Thông tin Khoa Công nghệ thông tin 1

Địa chỉ: Tầng 9 Nhà A2, Học viện Công nghệ Bưu chính Viễn thông, Km10 Nguyễn Trãi, Hà Đông, Hà Nội. Điện thoại: 024 3854 5604. Email: phuongnd@ptit.edu.vn. Website: www.it.ptit.edu.vn.

---

## PHẦN 2. KẾ HOẠCH THỰC TẬP

Đề tài đăng ký: **Hệ thống hỗ trợ ra quyết định đầu tư danh mục ngành ngân hàng bằng mô hình Black-Litterman** (Hướng 2 của học phần: tìm hiểu thuật toán/công nghệ mới, hệ thống ra quyết định).

| Tuần | Nội dung công việc | Cách tiếp cận | Kế hoạch | Kết quả dự đoán |
|---|---|---|---|---|
| [Sinh viên điền] | Tìm hiểu bài toán tối ưu danh mục đầu tư và hạn chế của mô hình Markowitz cổ điển | Đọc tài liệu gốc ([2]; [1]) | [Sinh viên điền] | Xác định rõ vấn đề nghiên cứu và phạm vi đồ án |
| [Sinh viên điền] | Cài đặt module lõi mô hình Black-Litterman (Python/NumPy) | Lập trình theo công thức toán, viết kiểm thử đơn vị song song | [Sinh viên điền] | Module `black_litterman.py` chạy đúng, có kiểm thử |
| [Sinh viên điền] | Xây dựng API backend (FastAPI) bao bọc mô hình | Thiết kế schema Pydantic, endpoint REST | [Sinh viên điền] | API `/api/black-litterman/demo` và `/upload` hoạt động |
| [Sinh viên điền] | Chuẩn bị khung frontend và dữ liệu mẫu để kiểm tra hệ thống | React + Vite; dữ liệu giá tổng hợp (synthetic) | [Sinh viên điền] | Hệ thống chạy end-to-end trên dữ liệu kiểm tra |
| [Sinh viên điền] | Viết báo cáo, chuẩn bị video demo và mã nguồn GitHub | Tổng hợp kết quả, đối chiếu với công thức | [Sinh viên điền] | Nộp báo cáo + source code + video demo |

*Ghi chú: bảng kế hoạch theo tuần cụ thể (ngày bắt đầu/kết thúc từng tuần, xác nhận của cán bộ hướng dẫn) cần sinh viên và cán bộ hướng dẫn tại đơn vị thực tập thống nhất trực tiếp và ký xác nhận theo đúng mẫu của Khoa; khung nội dung công việc ở trên chỉ là gợi ý dựa trên tiến độ thực tế của mã nguồn đồ án.*

---

## PHẦN 3. GIỚI THIỆU ĐƠN VỊ THỰC TẬP

### 3.1 Thông tin doanh nghiệp

Đơn vị thực tập: **ITM Semiconductor**.

[Sinh viên bổ sung: loại hình doanh nghiệp, lĩnh vực đăng ký kinh doanh, địa chỉ trụ sở, quy mô nhân sự.]

### 3.2 Lịch sử hình thành và phát triển của doanh nghiệp

[Sinh viên bổ sung: năm thành lập, các mốc phát triển chính, định hướng chiến lược. Không có dữ liệu xác thực về lịch sử công ty trong phạm vi tài liệu tham khảo được cung cấp cho báo cáo này nên mục này để trống, tránh đưa số liệu không kiểm chứng được.]

### 3.3 Các lĩnh vực hoạt động, dịch vụ, hoặc sản phẩm của doanh nghiệp

[Sinh viên bổ sung: mảng thiết kế/sản xuất bán dẫn cụ thể mà công ty tham gia, khách hàng, đối tác chính, vị trí của bộ phận sinh viên thực tập trong sơ đồ tổ chức.]

### 3.4 Những đóng góp của doanh nghiệp trong lĩnh vực chuyên môn

[Sinh viên bổ sung: đóng góp của công ty cho ngành bán dẫn/công nghệ thông tin tại Việt Nam, các sản phẩm hoặc dự án tiêu biểu liên quan đến vị trí thực tập.]

*Ghi chú liêm chính: các mục 3.1–3.4 chỉ nên chứa thông tin sinh viên đã xác minh trực tiếp tại công ty (qua tài liệu nội bộ, website chính thức hoặc cán bộ hướng dẫn cung cấp). Tài liệu này không có nguồn xác thực về ITM Semiconductor nên không điền số liệu, tránh sai lệch thông tin doanh nghiệp.*

---

## PHẦN 4. NHẬT KÝ THỰC TẬP

### Tuần 1 (từ ngày … tháng … năm … đến ngày … tháng … năm …)

| Ngày | Tóm tắt hoạt động thực tập | Quy định khung tham chiếu (TCVN, QCVN, ISO…) | Kết quả hoạt động | Phân tích, giải thích, kết luận | Xác nhận của CBHD |
|---|---|---|---|---|---|
| [Sinh viên điền] | [Sinh viên điền] | [Sinh viên điền] | [Sinh viên điền] | [Sinh viên điền] | [Sinh viên điền] |

*Dữ liệu, thông tin trung thực / không trung thực, Xác nhận của CBHD (Ký tên và họ tên): [Sinh viên điền]*

### Tuần 2 (từ ngày … tháng … năm … đến ngày … tháng … năm …)

| Ngày | Tóm tắt hoạt động thực tập | Quy định khung tham chiếu (TCVN, QCVN, ISO…) | Kết quả hoạt động | Phân tích, giải thích, kết luận | Xác nhận của CBHD |
|---|---|---|---|---|---|
| [Sinh viên điền] | [Sinh viên điền] | [Sinh viên điền] | [Sinh viên điền] | [Sinh viên điền] | [Sinh viên điền] |

*Dữ liệu, thông tin trung thực / không trung thực, Xác nhận của CBHD (Ký tên và họ tên): [Sinh viên điền]*

### Tuần 3 (từ ngày … tháng … năm … đến ngày … tháng … năm …)

| Ngày | Tóm tắt hoạt động thực tập | Quy định khung tham chiếu (TCVN, QCVN, ISO…) | Kết quả hoạt động | Phân tích, giải thích, kết luận | Xác nhận của CBHD |
|---|---|---|---|---|---|
| [Sinh viên điền] | [Sinh viên điền] | [Sinh viên điền] | [Sinh viên điền] | [Sinh viên điền] | [Sinh viên điền] |

*Dữ liệu, thông tin trung thực / không trung thực, Xác nhận của CBHD (Ký tên và họ tên): [Sinh viên điền]*

### Tuần 4 (từ ngày … tháng … năm … đến ngày … tháng … năm …)

| Ngày | Tóm tắt hoạt động thực tập | Quy định khung tham chiếu (TCVN, QCVN, ISO…) | Kết quả hoạt động | Phân tích, giải thích, kết luận | Xác nhận của CBHD |
|---|---|---|---|---|---|
| [Sinh viên điền] | [Sinh viên điền] | [Sinh viên điền] | [Sinh viên điền] | [Sinh viên điền] | [Sinh viên điền] |

*Dữ liệu, thông tin trung thực / không trung thực, Xác nhận của CBHD (Ký tên và họ tên): [Sinh viên điền]*

### Tuần 5 (từ ngày … tháng … năm … đến ngày … tháng … năm …)

| Ngày | Tóm tắt hoạt động thực tập | Quy định khung tham chiếu (TCVN, QCVN, ISO…) | Kết quả hoạt động | Phân tích, giải thích, kết luận | Xác nhận của CBHD |
|---|---|---|---|---|---|
| [Sinh viên điền] | [Sinh viên điền] | [Sinh viên điền] | [Sinh viên điền] | [Sinh viên điền] | [Sinh viên điền] |

*Dữ liệu, thông tin trung thực / không trung thực, Xác nhận của CBHD (Ký tên và họ tên): [Sinh viên điền]*

### Tuần 6 (từ ngày … tháng … năm … đến ngày … tháng … năm …)

| Ngày | Tóm tắt hoạt động thực tập | Quy định khung tham chiếu (TCVN, QCVN, ISO…) | Kết quả hoạt động | Phân tích, giải thích, kết luận | Xác nhận của CBHD |
|---|---|---|---|---|---|
| [Sinh viên điền] | [Sinh viên điền] | [Sinh viên điền] | [Sinh viên điền] | [Sinh viên điền] | [Sinh viên điền] |

*Dữ liệu, thông tin trung thực / không trung thực, Xác nhận của CBHD (Ký tên và họ tên): [Sinh viên điền]*

### Tuần 7 (từ ngày … tháng … năm … đến ngày … tháng … năm …)

| Ngày | Tóm tắt hoạt động thực tập | Quy định khung tham chiếu (TCVN, QCVN, ISO…) | Kết quả hoạt động | Phân tích, giải thích, kết luận | Xác nhận của CBHD |
|---|---|---|---|---|---|
| [Sinh viên điền] | [Sinh viên điền] | [Sinh viên điền] | [Sinh viên điền] | [Sinh viên điền] | [Sinh viên điền] |

*Dữ liệu, thông tin trung thực / không trung thực, Xác nhận của CBHD (Ký tên và họ tên): [Sinh viên điền]*

### Tuần 8 (từ ngày … tháng … năm … đến ngày … tháng … năm …)

| Ngày | Tóm tắt hoạt động thực tập | Quy định khung tham chiếu (TCVN, QCVN, ISO…) | Kết quả hoạt động | Phân tích, giải thích, kết luận | Xác nhận của CBHD |
|---|---|---|---|---|---|
| [Sinh viên điền] | [Sinh viên điền] | [Sinh viên điền] | [Sinh viên điền] | [Sinh viên điền] | [Sinh viên điền] |

*Dữ liệu, thông tin trung thực / không trung thực, Xác nhận của CBHD (Ký tên và họ tên): [Sinh viên điền]*

### Tuần … (từ ngày … tháng … năm … đến ngày … tháng … năm …)

| Ngày | Tóm tắt hoạt động thực tập | Quy định khung tham chiếu (TCVN, QCVN, ISO…) | Kết quả hoạt động | Phân tích, giải thích, kết luận | Xác nhận của CBHD |
|---|---|---|---|---|---|
| [Sinh viên điền] | [Sinh viên điền] | [Sinh viên điền] | [Sinh viên điền] | [Sinh viên điền] | [Sinh viên điền] |

*Dữ liệu, thông tin trung thực / không trung thực, Xác nhận của CBHD (Ký tên và họ tên): [Sinh viên điền]*

*Ghi chú: số tuần và ngày tháng cụ thể phụ thuộc thời gian thực tập thật của sinh viên tại ITM Semiconductor; sinh viên nhân bản khối bảng trên cho đủ số tuần thực tế và điền nội dung hằng ngày, có xác nhận của cán bộ hướng dẫn (CBHD) tại đơn vị.*

---

## PHẦN 5. BÁO CÁO PROJECT THỰC TẬP

# Hệ thống hỗ trợ ra quyết định đầu tư danh mục ngành ngân hàng bằng mô hình Black-Litterman

**Sinh viên thực hiện:** Nguyễn Văn Trung, Ngành Công nghệ thông tin, Học viện Công nghệ Bưu chính Viễn thông.

**Tóm tắt.** Báo cáo trình bày quá trình tìm hiểu và cài đặt mô hình Black-Litterman [1] cho bài toán phân bổ danh mục cổ phiếu ngành ngân hàng, dưới dạng một hệ thống hỗ trợ ra quyết định gồm lõi tính toán bằng Python/NumPy và một dịch vụ web (FastAPI) cho phép nhập quan điểm chủ quan của nhà đầu tư. Mã nguồn được kiểm thử bằng bốn kiểm thử đơn vị (unit test), cả bốn đều đạt (PASS). Hệ thống được xác minh chạy đúng trên bộ dữ liệu giá tổng hợp (synthetic), không phải dữ liệu thị trường thật; đây là hạn chế được nêu rõ và là điều kiện tiên quyết trước khi dùng hệ thống cho phân tích đầu tư thực tế. Kiến trúc tách backend/frontend tham khảo cách tổ chức mã nguồn của dự án mã nguồn mở Ghostfolio, không sao chép mã nguồn của dự án đó.

**Từ khóa:** Black-Litterman, tối ưu hóa danh mục đầu tư, hệ thống hỗ trợ ra quyết định, ngành ngân hàng, FastAPI.

### 5.1 Đặt vấn đề

Phân bổ vốn giữa các cổ phiếu ngân hàng niêm yết là bài toán thường gặp của nhà đầu tư cá nhân và tổ chức tại Việt Nam, do nhóm ngân hàng chiếm tỷ trọng vốn hóa lớn trên sàn HOSE và có mức độ tương quan lợi suất tương đối cao. Cách tiếp cận cổ điển cho bài toán này là mô hình trung bình–phương sai của Markowitz [2], trong đó nhà đầu tư chọn trọng số danh mục $w$ để tối thiểu hóa phương sai với một mức lợi suất kỳ vọng cho trước. Mô hình này có hai hạn chế đã được ghi nhận rộng rãi trong tài liệu tài chính định lượng: (i) lợi suất kỳ vọng $\mu$ thường được ước lượng bằng trung bình lợi suất lịch sử, một đại lượng có sai số ước lượng lớn và rất nhạy với khoảng thời gian lấy mẫu; (ii) khi $\mu$ thay đổi nhỏ, trọng số tối ưu $w^*$ có thể thay đổi rất mạnh (bài toán tối ưu hóa "khuếch đại sai số"), dẫn tới danh mục đề xuất kém ổn định và khó chấp nhận trên thực tế.

Hệ quả thực tiễn của việc khuếch đại sai số này không chỉ là vấn đề lý thuyết. Với một danh mục thực thi định kỳ (ví dụ tái cân bằng hằng tháng hoặc hằng quý), một mô hình Markowitz thuần túy dựa trên lợi suất lịch sử có thể đề xuất tỷ trọng dao động mạnh giữa các kỳ tính toán liên tiếp, ngay cả khi bức tranh vĩ mô hoặc triển vọng của các ngân hàng không thay đổi đáng kể. Danh mục dao động mạnh kéo theo chi phí giao dịch cao hơn và làm giảm mức độ tin cậy của nhà đầu tư vào khuyến nghị của hệ thống, vì khuyến nghị đổi hướng liên tục khó diễn giải bằng lý do kinh tế cụ thể. Đây là động cơ thực hành, ngoài động cơ lý thuyết, cho việc tìm một mô hình phân bổ ổn định hơn.

Mô hình Black-Litterman [1] giải quyết hai hạn chế trên bằng cách xuất phát từ lợi suất kỳ vọng hàm ý bởi trạng thái cân bằng thị trường (thay vì trung bình lịch sử), sau đó kết hợp với quan điểm chủ quan của nhà đầu tư theo khung suy diễn Bayes để tạo ra lợi suất kỳ vọng hậu nghiệm. Khi nhà đầu tư không có quan điểm nào, danh mục đề xuất quay về đúng danh mục theo tỷ trọng vốn hóa thị trường; khi có quan điểm, danh mục dịch chuyển dần theo hướng và mức độ tin cậy của quan điểm đó. Tính chất này làm cho kết quả ổn định hơn nhiều so với mô hình Markowitz thuần túy dùng lợi suất lịch sử: thay vì phải ước lượng chính xác lợi suất kỳ vọng tuyệt đối cho từng mã cổ phiếu, một việc rất khó làm đúng, nhà đầu tư chỉ cần phát biểu một số ít quan điểm tương đối hoặc tuyệt đối mà họ có cơ sở tin tưởng, còn lại mô hình tự suy ra phần lợi suất kỳ vọng còn thiếu từ thông tin hàm chứa trong giá thị trường.

Vấn đề đặt ra cho đồ án thực tập là: **xây dựng một hệ thống phần mềm cài đặt đúng mô hình Black-Litterman, cho phép nhà đầu tư nhập quan điểm về một nhóm cổ phiếu ngân hàng cụ thể và nhận lại trọng số danh mục đề xuất, đồng thời có thể kiểm chứng được tính đúng đắn của phần tính toán bằng kiểm thử tự động.** Đây là bài toán thuộc Hướng 2 của học phần Thực tập tốt nghiệp (tìm hiểu thuật toán mới, xây dựng hệ thống ra quyết định), không thuộc phạm vi xây dựng một sản phẩm giao dịch hoàn chỉnh; phạm vi đồ án dừng ở việc cài đặt đúng mô hình định lượng và một giao diện lập trình (API) để sử dụng mô hình đó, có kiểm thử. Hệ thống được thiết kế như một công cụ hỗ trợ ra quyết định: đầu ra là trọng số danh mục đề xuất, không phải lệnh giao dịch tự động, và quyết định cuối cùng vẫn thuộc về nhà đầu tư sử dụng hệ thống.

### 5.2 Khảo sát công trình liên quan

**Mô hình trung bình–phương sai [2].** Đây là nền tảng lý thuyết cho toàn bộ hướng nghiên cứu tối ưu hóa danh mục đầu tư hiện đại, đưa ra khái niệm biên hiệu quả (efficient frontier) và cách đánh đổi giữa lợi suất kỳ vọng và rủi ro (đo bằng phương sai). Hạn chế về độ nhạy với sai số ước lượng lợi suất kỳ vọng của mô hình này, đã nêu ở mục 5.1, là động lực trực tiếp dẫn tới mô hình Black-Litterman.

**Mô hình Black-Litterman [1].** Bài báo gốc đề xuất kết hợp lợi suất cân bằng thị trường (implied equilibrium return) với quan điểm chủ quan của nhà đầu tư thông qua một công thức cập nhật kiểu Bayes, khắc phục trực tiếp vấn đề khuếch đại sai số của Markowitz. Về bản chất suy diễn, mô hình coi lợi suất cân bằng thị trường là phân phối tiên nghiệm (prior), quan điểm nhà đầu tư là thông tin quan sát mới (likelihood), và lợi suất kỳ vọng hậu nghiệm (posterior) là kết quả kết hợp có trọng số giữa hai nguồn thông tin đó theo đúng quy tắc Bayes cho phân phối chuẩn nhiều chiều. Cách nhìn này lý giải vì sao mô hình ổn định hơn Markowitz thuần túy: thay vì thay thế hoàn toàn thông tin thị trường bằng ước lượng lịch sử riêng của nhà đầu tư, mô hình chỉ dịch chuyển có kiểm soát khỏi điểm cân bằng, theo đúng mức độ tin cậy mà nhà đầu tư gán cho quan điểm của mình.

**He và Litterman [3]** trình bày lại mô hình gốc theo hướng trực quan hơn, đưa ra công thức tính ma trận độ không chắc chắn $\Omega$ của các quan điểm theo tỷ lệ với phương sai của chính danh mục quan điểm đó, đồng thời cho một cách diễn giải công thức tính hệ số ngại rủi ro $\delta$ từ lợi suất và phương sai của danh mục thị trường. Đây là phiên bản công thức được nhiều tài liệu ứng dụng, bao gồm cả cài đặt trong đồ án này, sử dụng làm chuẩn tham chiếu, vì cách viết của tài liệu này gắn trực tiếp từng tham số của mô hình với một đại lượng có thể ước lượng được từ dữ liệu thị trường quan sát được, thay vì để tham số trừu tượng.

**Idzorek [4]** hệ thống hóa mô hình Black-Litterman thành quy trình từng bước, dễ triển khai cho người thực hành, đồng thời đề xuất cách đưa "độ tin cậy" (confidence, giá trị trong khoảng (0, 1]) của từng quan điểm vào ma trận $\Omega$ một cách trực quan hơn công thức gốc của He và Litterman. Điểm khác biệt giữa hai cách tiếp cận nằm ở chỗ công thức gốc của He và Litterman gắn độ không chắc chắn của quan điểm với $\tau$, một tham số chung cho toàn bộ mô hình và khó diễn giải trực quan, trong khi cách tiếp cận của Idzorek cho phép người dùng phát biểu độ tin cậy theo thang phần trăm quen thuộc hơn cho từng quan điểm riêng lẻ. Đồ án tham khảo trực tiếp cách xử lý độ tin cậy quan điểm này khi cài đặt tham số `confidence` cho từng quan điểm trong API của hệ thống (xem mục 5.4).

**Về mặt kiến trúc phần mềm**, đồ án tham khảo cách tổ chức mã nguồn của dự án mã nguồn mở Ghostfolio [5], cụ thể là cách tách một ứng dụng quản lý danh mục đầu tư thành hai phần độc lập, dịch vụ backend cung cấp API và ứng dụng frontend tiêu thụ API đó, cùng cách phân module theo nghiệp vụ (ví dụ tách riêng phần tính toán phân bổ danh mục khỏi phần trình bày). Đây là tham khảo về **cách tổ chức thư mục và ranh giới module**, không phải sao chép mã nguồn: Ghostfolio cài đặt backend bằng NestJS (TypeScript) và ORM Prisma, còn hệ thống trong đồ án này cài đặt backend bằng Python/FastAPI và toàn bộ mã tính toán Black-Litterman (NumPy thuần) là mã nguồn nguyên bản, không dựa trên bất kỳ đoạn mã nào của Ghostfolio. Ghostfolio bản thân cũng không cài đặt mô hình Black-Litterman. Lý do chọn tham khảo kiểu tổ chức này, thay vì tự thiết kế từ đầu, là để đồ án có một ranh giới module rõ ràng ngay từ giai đoạn đầu (tính toán tách khỏi trình bày), giảm rủi ro phải tái cấu trúc lại mã nguồn giữa chừng khi khối lượng công việc backend và frontend tăng lên.

**Khoảng trống cần giải quyết trong đồ án.** Các tài liệu trên trình bày mô hình toán học và [4] trình bày quy trình tính tay từng bước, nhưng không đi kèm một cài đặt phần mềm có kiểm thử tự động, đóng gói dưới dạng dịch vụ API cho ngữ cảnh cụ thể là nhóm cổ phiếu ngân hàng niêm yết. Đồ án đóng góp phần cài đặt này: chuyển công thức toán học thành mã nguồn Python được kiểm thử đơn vị, và bao bọc bằng một API REST để có thể gọi từ giao diện người dùng hoặc từ chương trình khác.

### 5.3 Phương pháp

Ký hiệu dùng thống nhất trong toàn bộ mục này, giữ theo đúng ký hiệu chuẩn của [1] và [3] để tiện đối chiếu với mã nguồn (module `apps/api/app/core/black_litterman.py`):

- $n$: số mã cổ phiếu trong danh mục (trong hệ thống, $n$ bằng số mã do người dùng chọn, ví dụ 5 mã ngân hàng).
- $\Sigma$: ma trận hiệp phương sai lợi suất, kích thước $n \times n$, ước lượng từ lợi suất log lịch sử và quy đổi theo năm.
- $w_{mkt}$: vector trọng số vốn hóa thị trường của danh mục tham chiếu, kích thước $n$.
- $\delta$: hệ số ngại rủi ro (risk aversion coefficient) của nhà đầu tư đại diện thị trường.
- $\tau$: hệ số tỷ lệ thể hiện độ không chắc chắn của lợi suất cân bằng $\pi$ so với $\Sigma$, thường lấy giá trị nhỏ trong khoảng 0,025–0,05.
- $P$: ma trận "pick" mã hóa các quan điểm của nhà đầu tư, kích thước $k \times n$ với $k$ là số quan điểm.
- $Q$: vector lợi suất kỳ vọng theo từng quan điểm, kích thước $k$.
- $\Omega$: ma trận hiệp phương sai (đường chéo) thể hiện độ không chắc chắn của từng quan điểm, kích thước $k \times k$.

**Bước 1, Lợi suất log và hiệp phương sai lịch sử.** Từ bảng giá đóng cửa $P_t$, lợi suất log ngày $t$ của mã $i$ được tính bằng

$$
r_{i,t} = \ln\left(\frac{P_{i,t}}{P_{i,t-1}}\right) \tag{1}
$$

Lợi suất log, thay vì lợi suất đơn giản $(P_t - P_{t-1})/P_{t-1}$, được chọn vì tính chất cộng dồn theo thời gian: lợi suất log của $k$ ngày liên tiếp bằng đúng tổng lợi suất log từng ngày, giúp việc quy đổi từ tần suất ngày sang tần suất năm ở bước sau chỉ là một phép nhân hệ số, không cần tính lũy thừa. Ma trận hiệp phương sai lợi suất được ước lượng từ mẫu lịch sử trong cửa sổ `lookback_days` (mặc định 756 ngày giao dịch, tương đương khoảng 3 năm) và quy đổi theo năm bằng hệ số 252 ngày giao dịch:

$$
\Sigma = 252 \cdot \mathrm{Cov}(r) \tag{2}
$$

Cửa sổ 756 ngày là một điểm cân bằng giữa hai yêu cầu đối lập: cửa sổ quá ngắn làm ước lượng hiệp phương sai kém ổn định (ít quan sát so với số tham số cần ước lượng), trong khi cửa sổ quá dài đưa vào dữ liệu quá cũ, có thể không còn phản ánh đúng cấu trúc tương quan hiện tại giữa các mã ngân hàng, đặc biệt sau các giai đoạn có thay đổi chính sách tiền tệ hoặc tái cấu trúc ngành. Bước này được cài đặt trong `portfolio_stats.log_returns` và `portfolio_stats.annualize_mean_cov`.

**Bước 2, Trọng số thị trường và hệ số ngại rủi ro hàm ý.** Trọng số vốn hóa thị trường của từng mã được tính trực tiếp từ vốn hóa do người dùng cung cấp:

$$
w_{mkt,i} = \frac{\text{cap}_i}{\sum_{j=1}^{n} \text{cap}_j} \tag{3}
$$

Hệ số ngại rủi ro $\delta$ được suy ra từ lợi suất và phương sai thực hiện của chính danh mục thị trường trong cửa sổ dữ liệu, theo công thức của [3]:

$$
\delta = \frac{E[R_m] - r_f}{\mathrm{Var}(R_m)} \tag{4}
$$

trong đó $r_f$ là lãi suất phi rủi ro (mặc định 3%/năm trong hệ thống). Về mặt diễn giải kinh tế, $\delta$ đo mức độ nhà đầu tư đại diện thị trường sẵn sàng đánh đổi giữa lợi suất tăng thêm và rủi ro (phương sai) tăng thêm: $\delta$ càng lớn, thị trường càng ngại rủi ro, và công thức (5) ở bước sau sẽ suy ra lợi suất cân bằng $\pi$ càng cao cho các tài sản rủi ro cao để bù đắp. Với cửa sổ dữ liệu ngắn hoặc lợi suất thị trường thực hiện âm, ví dụ khi cửa sổ lấy mẫu trùng với một giai đoạn thị trường giảm điểm kéo dài, công thức (4) có thể cho $\delta \le 0$, một giá trị không có ý nghĩa kinh tế (hệ số ngại rủi ro âm nghĩa là nhà đầu tư thích rủi ro nhiều hơn để đổi lấy lợi suất thấp hơn, mâu thuẫn với giả định gốc của mô hình). Hệ thống xử lý trường hợp này bằng cách thay $\delta$ bằng giá trị mặc định chuẩn 2,5, theo thông lệ dùng trong tài liệu ứng dụng ([4]; [6]), đồng thời trả về cờ `delta_is_fallback = true` để người dùng và báo cáo phân biệt được đâu là $\delta$ ước lượng từ dữ liệu và đâu là giá trị mặc định thay thế (xem `apps/api/app/main.py`, hàm `_compute`). Cơ chế này ngăn hệ thống trả về một danh mục đề xuất dựa trên tiền đề kinh tế vô nghĩa mà không cảnh báo người dùng.

**Bước 3, Lợi suất cân bằng hàm ý (implied equilibrium return).** Đây là lợi suất kỳ vọng tiên nghiệm (prior) của mô hình, suy ra ngược từ giả định danh mục thị trường đã ở trạng thái tối ưu:

$$
\pi = \delta \, \Sigma \, w_{mkt} \tag{5}
$$

Công thức (5) thực chất là bài toán tối ưu hóa trung bình–phương sai (Bước 6) chạy theo chiều ngược: thay vì hỏi "lợi suất kỳ vọng là bao nhiêu, từ đó trọng số tối ưu là bao nhiêu", mô hình hỏi "nếu trọng số vốn hóa thị trường hiện tại đã là trọng số tối ưu, vậy lợi suất kỳ vọng ngầm định đằng sau nó là bao nhiêu". Cách làm này khai thác giả định rằng giá thị trường, và do đó tỷ trọng vốn hóa, đã phản ánh tổng hợp kỳ vọng của toàn bộ nhà đầu tư tham gia thị trường; nhà đầu tư sử dụng hệ thống không cần tự ước lượng lợi suất kỳ vọng tuyệt đối cho từng mã ngay từ đầu, mà chỉ cần phát biểu quan điểm khác biệt so với điểm cân bằng này ở những nơi họ có cơ sở tin tưởng.

**Bước 4, Mã hóa quan điểm nhà đầu tư.** Mỗi quan điểm thứ $i$ được mã hóa thành một hàng của ma trận $P$ và một phần tử của vector $Q$. Với quan điểm tuyệt đối (ví dụ "mã VCB sẽ sinh lợi 15%/năm"), hàng tương ứng của $P$ có duy nhất một phần tử khác 0 bằng 1 tại vị trí của VCB, và $Q_i = 0{,}15$. Với quan điểm tương đối (ví dụ "VCB vượt BID 5%/năm"), hàng của $P$ có $+1$ tại vị trí VCB và $-1$ tại vị trí BID, $Q_i = 0{,}05$. Độ không chắc chắn của từng quan điểm được tính theo công thức của [3], có mở rộng thêm tham số độ tin cậy $c_i \in (0, 1]$ theo cách tiếp cận của [4]:

$$
\Omega_{ii} = \frac{\tau \, (P \Sigma P^{\top})_{ii}}{c_i} \tag{6}
$$

Khi $c_i = 1$, công thức (6) trở về đúng công thức gốc $\Omega_{ii} = \tau (P \Sigma P^{\top})_{ii}$; khi $c_i \to 0$, $\Omega_{ii} \to \infty$ và quan điểm gần như không còn trọng số trong lợi suất hậu nghiệm. Ma trận $\Omega$ được cài đặt dưới dạng ma trận đường chéo, tức là hệ thống giả định các quan điểm độc lập với nhau về mặt độ không chắc chắn; đây là giả định đơn giản hóa phổ biến trong các tài liệu ứng dụng vì việc ước lượng tương quan chéo giữa độ không chắc chắn của các quan điểm chủ quan thường không có đủ căn cứ dữ liệu. Trường hợp người dùng không nhập quan điểm nào, hệ thống dùng một quan điểm rỗng với $\Omega \to$ giá trị rất lớn (hằng số $10^6$), để lợi suất hậu nghiệm xấp xỉ đúng $\pi$, đây cũng là nội dung được kiểm thử trực tiếp bằng kiểm thử đơn vị `test_no_view_reduces_to_equilibrium_returns` (mục 5.5).

**Bước 5, Lợi suất kỳ vọng hậu nghiệm.** Theo công thức chuẩn của [1], dạng viết lại phổ biến trong [3], lợi suất kỳ vọng hậu nghiệm $E[R]$ và hiệp phương sai của ước lượng đó, $M^{-1}$, được tính bằng:

$$
M^{-1} = \left[ (\tau \Sigma)^{-1} + P^{\top} \Omega^{-1} P \right]^{-1} \tag{7}
$$

$$
E[R] = M^{-1} \left[ (\tau \Sigma)^{-1} \pi + P^{\top} \Omega^{-1} Q \right] \tag{8}
$$

Về mặt thống kê Bayes, công thức (7)–(8) là trung bình có trọng số nghịch đảo phương sai (precision-weighted average) giữa lợi suất cân bằng tiên nghiệm $\pi$ (trọng số $(\tau\Sigma)^{-1}$) và quan điểm quan sát được $Q$ (trọng số $P^{\top}\Omega^{-1}P$). Tài sản không có quan điểm nào áp dụng lên nó giữ nguyên lợi suất hậu nghiệm bằng $\pi$; tài sản có quan điểm với độ tin cậy cao (Ω nhỏ) bị kéo mạnh về phía giá trị quan điểm $Q_i$; tài sản có quan điểm với độ tin cậy thấp (Ω lớn) gần như không dịch chuyển. Ma trận $M^{-1}$ đồng thời là thước đo độ không chắc chắn còn lại của ước lượng $E[R]$ sau khi đã kết hợp thông tin thị trường và quan điểm, được dùng trực tiếp ở Bước 6. Hai công thức (7)–(8) được cài đặt trực tiếp bằng đại số tuyến tính NumPy trong hàm `posterior_returns` của module `black_litterman.py`.

**Bước 6, Trọng số danh mục tối ưu.** Với bài toán tối ưu hóa trung bình–phương sai không ràng buộc trên lợi suất kỳ vọng hậu nghiệm, trọng số tối ưu được tính bằng:

$$
w^{*} = \left[ \delta \, (\Sigma + M^{-1}) \right]^{-1} E[R] \tag{9}
$$

trong đó $\Sigma + M^{-1}$ là tổng hiệp phương sai lợi suất và hiệp phương sai của chính ước lượng $E[R]$ hậu nghiệm [1]. Cộng thêm $M^{-1}$ vào $\Sigma$ là cách mô hình đưa độ không chắc chắn của chính ước lượng lợi suất kỳ vọng vào bài toán tối ưu hóa, thay vì coi $E[R]$ là biết chắc chắn như trong mô hình Markowitz gốc; đây là điểm khác biệt kỹ thuật quan trọng giúp trọng số $w^*$ ổn định hơn khi quan điểm có độ tin cậy thấp. Vì công thức (9) không có ràng buộc về dấu hay giới hạn tỷ trọng, $w^*$ có thể chứa giá trị âm (tương đương vị thế bán khống) hoặc giá trị lớn hơn 1; hệ thống hiện tại không áp đặt ràng buộc này, và giới hạn đó được nêu lại ở mục 5.6. Trọng số $w^*$ sau đó được chuẩn hóa để tổng bằng 1 trước khi trả về cho người dùng, phục vụ mục đích trình bày tỷ trọng phần trăm danh mục:

$$
\hat{w}_i = \frac{w^*_i}{\sum_{j=1}^{n} w^*_j} \tag{10}
$$

Cần lưu ý rằng phép chuẩn hóa (10) chỉ đảm bảo tổng tỷ trọng bằng 1 để tiện trình bày, không loại bỏ khả năng có tỷ trọng âm nếu $w^*$ ở công thức (9) đã có phần tử âm; đây không phải là ràng buộc "không bán khống" theo đúng nghĩa quản lý danh mục. Toàn bộ chuỗi công thức (5)–(10) được cài đặt trong hàm `run_black_litterman`, gọi tuần tự các hàm `implied_equilibrium_returns`, `posterior_returns`, `optimal_weights` của module `black_litterman.py`.

### 5.4 Thiết kế hệ thống

**Kiến trúc tổng thể.** Hệ thống gồm hai thành phần tách biệt, giao tiếp qua API REST:

1. **Backend** (`apps/api`): dịch vụ Python/FastAPI, chứa (a) module lõi tính toán độc lập với framework web, đặt trong `app/core/` (`black_litterman.py`, `portfolio_stats.py`, `data_loader.py`), và (b) tầng API mỏng trong `app/main.py` chuyển đổi request/response qua các schema Pydantic khai báo trong `app/schemas.py`.
2. **Frontend** (`apps/web`): ứng dụng React + TypeScript, dựng bằng Vite, đã nối với API backend. Thành phần `App.tsx` dựng một trang dashboard gồm phần đầu trang, nút chạy dữ liệu mẫu, biểu ngữ cảnh báo dữ liệu là tổng hợp (synthetic), form nhập quan điểm nhà đầu tư (`ViewsForm.tsx`), bốn thẻ thống kê tóm tắt, hai biểu đồ donut so sánh trọng số thị trường và trọng số tối ưu (`AllocationChart.tsx`, dùng thư viện `recharts`), bảng chi tiết trọng số và lợi suất theo từng mã (`HoldingsTable.tsx`), và phần chân trang ghi nguồn trích dẫn mô hình. Giao diện dùng bảng màu nền tối tham khảo từ các token thiết kế thật của Ghostfolio (`theme.css`: font Inter, bo góc 8px/4px, màu nhấn teal `#47dbd7` và xanh dương `#4895df`, nền `#191919`), theo đúng tinh thần tham khảo kiến trúc đã nêu ở mục 5.2, không sao chép mã nguồn giao diện của Ghostfolio. Luồng gọi API demo, nhập một quan điểm, nhận và hiển thị kết quả trên giao diện đã được xác minh trực tiếp bằng công cụ kiểm thử trình duyệt Playwright (backend FastAPI cổng 8822, frontend Vite cổng 5173).

**Lý do lựa chọn công nghệ.** FastAPI được chọn cho backend vì tích hợp sẵn Pydantic, cho phép khai báo schema đầu vào/đầu ra một lần và tự động sinh cả việc kiểm tra kiểu dữ liệu lẫn tài liệu API (OpenAPI/Swagger), giảm rủi ro sai lệch giữa tài liệu API và cài đặt thật trong quá trình phát triển. Việc tách `app/core/` khỏi tầng route API là quyết định thiết kế có chủ đích: toàn bộ logic toán học (các hàm `implied_equilibrium_returns`, `posterior_returns`, `optimal_weights`) không phụ thuộc vào FastAPI hay bất kỳ đối tượng request/response nào, nên có thể gọi và kiểm thử trực tiếp bằng `pytest` mà không cần khởi động máy chủ web, giúp bộ kiểm thử đơn vị ở mục 5.5 chạy nhanh (0,08 giây cho cả bốn kiểm thử) và không phụ thuộc mạng hay cổng dịch vụ. Frontend dùng React kết hợp Vite để tận dụng cơ chế biên dịch và tải lại nhanh (hot module replacement) trong quá trình phát triển giao diện, và `recharts` cho việc dựng biểu đồ donut vì thư viện này tích hợp trực tiếp với mô hình component của React, không cần thao tác DOM thủ công.

**Luồng dữ liệu đầu-cuối.** Khi người dùng nhấn nút chạy dữ liệu mẫu hoặc gửi form quan điểm trên giao diện, frontend gửi một yêu cầu HTTP POST tới endpoint tương ứng của backend, kèm theo phần thân request đã được TypeScript định kiểu ở phía client. Backend nhận request, FastAPI tự động xác thực cấu trúc theo schema `BlackLittermanRequest` khai báo bằng Pydantic; nếu request không đúng cấu trúc (ví dụ thiếu trường bắt buộc hoặc sai kiểu dữ liệu), FastAPI trả lỗi HTTP 422 trước khi mã tính toán được gọi tới. Sau khi xác thực, hàm `_compute` trong `app/main.py` gọi lần lượt các bước đọc dữ liệu giá (`data_loader`), tính thống kê danh mục (`portfolio_stats`), và chạy mô hình Black-Litterman (`black_litterman.run_black_litterman`) theo đúng chuỗi công thức (1)–(10) ở mục 5.3. Kết quả tính toán được đóng gói lại thành schema `BlackLittermanResponse` và trả về dưới dạng JSON. Phía frontend nhận response, cập nhật trạng thái component React, và các thành phần hiển thị (`AllocationChart.tsx`, `HoldingsTable.tsx`) render lại theo dữ liệu mới mà không cần tải lại trang.

Việc tách backend/frontend thành hai ứng dụng độc lập trong cùng một mã nguồn (monorepo dạng `apps/api` + `apps/web`) tham khảo cách tổ chức của dự án Ghostfolio (`apps/api` + `apps/client`), như đã nêu ở mục 5.2. Bên trong `apps/api`, việc tách riêng thư mục `core/` (thuần logic tính toán, không phụ thuộc FastAPI) khỏi thư mục chứa route API cũng theo tinh thần phân lớp tương tự: logic nghiệp vụ có thể được kiểm thử độc lập, không cần khởi động máy chủ web.

**Thiết kế API.** Hệ thống cung cấp ba endpoint:

| Phương thức | Đường dẫn | Chức năng |
|---|---|---|
| GET | `/health` | Kiểm tra dịch vụ đang chạy |
| POST | `/api/black-litterman/demo` | Chạy mô hình trên dữ liệu mẫu tổng hợp (synthetic) đi kèm repo, dùng để kiểm tra hệ thống |
| POST | `/api/black-litterman/upload` | Chạy mô hình trên dữ liệu giá do người dùng tải lên (file CSV: cột `Date` + các cột mã cổ phiếu) |

Dữ liệu đầu vào của cả hai endpoint tính toán được mô tả bằng schema `BlackLittermanRequest` (`app/schemas.py`), gồm: danh sách mã cổ phiếu (`tickers`, tối thiểu 2 mã), số ngày lấy mẫu (`lookback_days`, mặc định 756), vốn hóa thị trường từng mã (`market_caps`), lãi suất phi rủi ro (`risk_free_rate`), hệ số $\tau$, và danh sách quan điểm (`views`), mỗi quan điểm gồm tài sản liên quan, trọng số trong quan điểm, lợi suất kỳ vọng và độ tin cậy, đúng theo công thức (6) ở mục 5.3. Kết quả trả về (`BlackLittermanResponse`) gồm lợi suất cân bằng $\pi$, lợi suất hậu nghiệm $E[R]$, trọng số thị trường, trọng số tối ưu đã chuẩn hóa, giá trị $\delta$ thực dùng và cờ `delta_is_fallback`. Việc tách hai endpoint `/demo` và `/upload` thay vì gộp thành một endpoint duy nhất giúp phân biệt rõ ràng, ngay từ tầng API, giữa một lượt chạy trên dữ liệu tổng hợp chỉ để kiểm tra hệ thống và một lượt chạy trên dữ liệu do người dùng cung cấp, tránh nhầm lẫn khi ghi log hoặc khi trình bày kết quả.

**Xử lý dữ liệu và trường hợp biên.** Trước khi tính toán, hệ thống kiểm tra dữ liệu giá thiếu (NaN) trong khoảng `lookback_days` đã chọn và trả lỗi HTTP 400 với thông báo rõ ràng nếu phát hiện, thay vì để mô hình chạy trên dữ liệu không đầy đủ và cho kết quả sai lệch âm thầm. Trường hợp $\delta$ ước lượng không dương đã trình bày ở Bước 2, mục 5.3, cũng là một cơ chế xử lý trường hợp biên tương tự: hệ thống không dừng chương trình mà thay bằng giá trị mặc định có căn cứ tài liệu, đồng thời báo hiệu tường minh qua trường `delta_is_fallback` để người dùng biết đây không phải giá trị ước lượng từ dữ liệu thật. Cả hai cơ chế đều theo cùng một nguyên tắc thiết kế: khi dữ liệu đầu vào không đủ tốt để tính toán đáng tin cậy, hệ thống hoặc dừng lại và báo lỗi rõ ràng (trường hợp thiếu dữ liệu), hoặc tiếp tục chạy nhưng đánh dấu tường minh phần nào của kết quả không đến từ dữ liệu thật (trường hợp $\delta$ không dương), thay vì trả về một con số trông hợp lý nhưng không có căn cứ.

**Dữ liệu mẫu dùng để kiểm tra hệ thống.** File `apps/api/sample_data/sample_prices_SYNTHETIC.csv` chứa 756 dòng giá đóng cửa mô phỏng (dạng random walk) cho 5 mã ngân hàng niêm yết (VCB, BID, CTG, TCB, MBB), trải trong khoảng thời gian có định dạng tương tự dữ liệu giao dịch thật (giai đoạn 2023 trở đi). Đây **không phải dữ liệu thị trường thật**: docstring của module `data_loader.py` ghi rõ hệ thống không tự gọi bất kỳ API dữ liệu thị trường nào (không có khóa API được cấu hình sẵn), và file này chỉ để xác minh luồng tính toán của hệ thống chạy đúng đầu-cuối. Hạn chế này được nhắc lại ở mục 5.6 và là điều kiện bắt buộc phải xử lý trước khi dùng hệ thống cho phân tích đầu tư thật.

### 5.5 Kết quả

**Kết quả kiểm thử đơn vị.** Module lõi được kiểm thử bằng bốn kiểm thử đơn vị (`apps/api/app/core/tests/test_black_litterman.py`), chạy bằng `pytest`. Kết quả chạy thực tế trên môi trường của đồ án:

```
app/core/tests/test_black_litterman.py::test_no_view_reduces_to_equilibrium_returns PASSED
app/core/tests/test_black_litterman.py::test_single_absolute_view_pulls_return_toward_view PASSED
app/core/tests/test_black_litterman.py::test_weights_sum_to_one_after_normalization PASSED
app/core/tests/test_black_litterman.py::test_optimal_weights_matches_manual_formula PASSED
======================== 4 passed in 0.08s ========================
```

Bốn kiểm thử này xác minh bốn thuộc tính toán học độc lập của cài đặt, không chỉ kiểm tra chương trình "không lỗi cú pháp":

1. **`test_no_view_reduces_to_equilibrium_returns`** kiểm chứng tính chất lý thuyết cốt lõi của mô hình: khi $P$, $Q$ rỗng (không có quan điểm nào) và $\Omega$ rất lớn, lợi suất hậu nghiệm $E[R]$ theo công thức (8) phải xấp xỉ đúng lợi suất cân bằng $\pi$ theo công thức (5), sai số tuyệt đối dưới $10^{-3}$. Kiểm thử này chặn một lỗi cài đặt thường gặp: quên xử lý trường hợp danh sách quan điểm rỗng, dẫn tới lỗi chia cho ma trận rỗng hoặc kết quả sai ngay ở trường hợp cơ bản nhất của mô hình.
2. **`test_single_absolute_view_pulls_return_toward_view`** kiểm chứng hướng dịch chuyển của $E[R]$ khi có một quan điểm tuyệt đối: nếu quan điểm ($Q = 0{,}15$) cao hơn $\pi$ ban đầu của tài sản đó, $E[R]$ của đúng tài sản đó phải dịch chuyển lên trên, nằm giữa $\pi$ ban đầu và giá trị quan điểm, đúng chiều tác động mà công thức (8) dự đoán. Kiểm thử này phát hiện được các lỗi về dấu hoặc chỉ số hàng/cột khi dựng ma trận $P$, một loại lỗi có thể khiến chương trình chạy không báo lỗi nhưng cho kết quả kinh tế sai ngược chiều.
3. **`test_weights_sum_to_one_after_normalization`** kiểm chứng công thức chuẩn hóa (10): tổng trọng số tối ưu sau chuẩn hóa bằng 1 với sai số dưới $10^{-9}$.
4. **`test_optimal_weights_matches_manual_formula`** đối chiếu kết quả hàm `optimal_weights` với công thức (9) tính thủ công trên cùng dữ liệu đầu vào bằng `numpy.linalg.solve`, xác nhận không có sai lệch giữa cài đặt và công thức toán. Đây là kiểm thử hồi quy số học (numerical regression test): nếu một thay đổi mã nguồn sau này vô tình làm lệch công thức (9), ví dụ đổi nhầm thứ tự nhân ma trận, kiểm thử này sẽ phát hiện sai lệch ngay cả khi chương trình vẫn chạy không lỗi cú pháp.

Cả bốn kiểm thử đều dùng một bộ dữ liệu đồ chơi (toy data) 3 tài sản với ma trận hiệp phương sai và trọng số thị trường cho trước, tính tay kiểm chứng được, đặt trong hàm `_toy_inputs` của file kiểm thử, đây là bộ dữ liệu dùng riêng để kiểm thử, khác với dữ liệu synthetic 5 mã ngân hàng dùng để chạy demo API ở mục 5.4. Việc dùng một bộ dữ liệu nhỏ, tính tay được, thay vì dữ liệu synthetic 5 mã, là lựa chọn có chủ đích: kiểm thử đơn vị cần một điểm tham chiếu độc lập với chính cài đặt đang được kiểm thử, và một bài toán 3 tài sản đủ nhỏ để tính lại bằng tay hoặc bằng công thức tường minh, trong khi bài toán 5 tài sản trên dữ liệu synthetic đã phức tạp hơn mức tiện tính tay.

**Kết quả chạy hệ thống trên dữ liệu kiểm tra.** Với dữ liệu synthetic 5 mã ngân hàng và cửa sổ mặc định 756 ngày, endpoint `/api/black-litterman/demo` trả về đầy đủ $\pi$, $E[R]$, trọng số thị trường và trọng số tối ưu theo đúng cấu trúc `BlackLittermanResponse` mô tả ở mục 5.4, xác nhận luồng tính toán đầu-cuối (đọc CSV → tính lợi suất log → ước lượng $\Sigma$ và $\delta$ → tính $\pi$ → kết hợp quan điểm → tính $E[R]$ và $w^*$) chạy thông suốt không lỗi. Việc xác minh bằng Playwright mô tả ở mục 5.4, nhập một quan điểm cho mã TCB rồi quan sát giao diện cập nhật, khẳng định thêm rằng chuỗi tích hợp giữa các tầng, từ serialize JSON ở backend, giải mã JSON ở frontend, cập nhật trạng thái React, đến vẽ lại biểu đồ donut, hoạt động khớp nhau về cấu trúc dữ liệu, không chỉ riêng phần lõi toán học đã được kiểm thử đơn vị. Vì dữ liệu đầu vào là dữ liệu mô phỏng, các con số lợi suất và trọng số cụ thể từ lần chạy này **không được trình bày như kết quả thực nghiệm tài chính thật** trong báo cáo, theo đúng ghi chú liêm chính dữ liệu ở mục 5.4, chỉ dùng để khẳng định hệ thống hoạt động đúng về mặt kỹ thuật.

### 5.6 Hạn chế

Đồ án còn bốn nhóm hạn chế cần nêu rõ, tương ứng với nguyên tắc không phóng đại kết quả:

1. **Dữ liệu.** Toàn bộ kết quả chạy hệ thống trong báo cáo này dùng dữ liệu giá tổng hợp (synthetic), không phải dữ liệu giao dịch thật của các mã VCB, BID, CTG, TCB, MBB. Dữ liệu random walk không tái tạo được các đặc điểm thống kê của lợi suất cổ phiếu ngân hàng thật, ví dụ tương quan tăng cao trong giai đoạn thị trường biến động mạnh hoặc phản ứng đồng loạt trước thay đổi chính sách lãi suất, nên một hệ thống chạy đúng trên dữ liệu synthetic không đảm bảo cho kết quả có ý nghĩa kinh tế khi thay bằng dữ liệu thật. Trước khi dùng hệ thống cho phân tích đầu tư hoặc trình bày như kết quả thực nghiệm, cần thay file dữ liệu bằng giá lịch sử thật (ví dụ tải từ Cafef, Vietstock, SSI iBoard hoặc thư viện `vnstock`), ghi rõ nguồn và ngày tải dữ liệu.
2. **Giao diện người dùng.** Phần frontend (`apps/web`) đã có màn hình nhập quan điểm nhà đầu tư và hiển thị kết quả phân bổ danh mục (mục 5.4), đã được xác minh chạy đúng bằng Playwright trên một kịch bản cụ thể (một quan điểm cho mã TCB). Giao diện chưa được kiểm thử tự động dạng end-to-end lặp lại được (chưa có bộ test Playwright lưu trong repo), chưa xử lý các trường hợp lỗi từ API (ví dụ dữ liệu thiếu, $\delta$ không dương) trên giao diện, và chưa được đánh giá về khả năng sử dụng (usability) hay kiểm thử trên nhiều trình duyệt/kích thước màn hình. Việc kiểm thử mới dừng ở một kịch bản đơn lẻ nghĩa là các kịch bản khác, ví dụ nhập nhiều quan điểm cùng lúc hoặc nhập quan điểm mâu thuẫn nhau, chưa được xác minh trên giao diện.
3. **Phạm vi mô hình.** Mô hình chỉ tối ưu hóa trung bình–phương sai không ràng buộc (công thức (9)), chưa xử lý các ràng buộc thực tế như không được bán khống (short-selling), giới hạn tỷ trọng tối đa từng mã, hoặc chi phí giao dịch khi tái cân bằng danh mục. Như đã nêu ở mục 5.3, trọng số $w^*$ có thể chứa giá trị âm hoặc vượt quá tỷ trọng vốn hóa hợp lý cho một nhà đầu tư không dùng đòn bẩy, và phép chuẩn hóa (10) không khắc phục được điều này. Đây là hướng phát triển tiếp theo, nằm ngoài phạm vi đồ án thực tập.
4. **Rủi ro mô hình và độ nhạy tham số.** Kết quả của mô hình phụ thuộc vào các tham số do người dùng hoặc hệ thống lựa chọn, cụ thể là $\tau$, độ tin cậy $c_i$ của từng quan điểm, và cửa sổ dữ liệu `lookback_days`; đồ án chưa thực hiện phân tích độ nhạy có hệ thống cho các tham số này (ví dụ chạy lại mô hình với nhiều giá trị $\tau$ khác nhau và so sánh trọng số đề xuất). Mô hình cũng kế thừa giả định lợi suất tuân theo phân phối chuẩn nhiều chiều từ khung trung bình–phương sai gốc, một giả định được biết là không mô tả đầy đủ hiện tượng đuôi dày (fat tail) thường thấy ở lợi suất cổ phiếu thật, đặc biệt trong giai đoạn thị trường biến động mạnh. Việc lượng hóa ảnh hưởng của các giả định và lựa chọn tham số này lên trọng số đề xuất, nằm ngoài phạm vi kiểm thử đơn vị đã thực hiện ở mục 5.5, là một hướng phát triển tiếp theo cần thiết trước khi hệ thống được dùng cho quyết định đầu tư thật.

### 5.7 Kết luận

Đồ án đã cài đặt đúng và kiểm thử được mô hình Black-Litterman cho bài toán phân bổ danh mục cổ phiếu ngành ngân hàng, bao bọc dưới dạng dịch vụ API sử dụng được. Đóng góp chính là bản cài đặt các công thức (1)–(10), từ ước lượng hiệp phương sai lịch sử, suy ra lợi suất cân bằng thị trường, đến kết hợp quan điểm nhà đầu tư theo trọng số độ tin cậy và tính trọng số danh mục tối ưu, cùng một bộ bốn kiểm thử đơn vị xác minh trực tiếp các tính chất toán học của mô hình, cả bốn đều đạt. Hệ thống cũng cài đặt một cơ chế xử lý trường hợp biên có căn cứ tài liệu (hệ số ngại rủi ro $\delta$ ước lượng không dương), báo hiệu tường minh cho người dùng thay vì âm thầm dùng giá trị sai.

Hạn chế lớn nhất hiện tại là hệ thống mới được xác minh trên dữ liệu mô phỏng, chưa trên dữ liệu thị trường thật. Giao diện người dùng (`apps/web`) đã nối với backend và đã được xác minh chạy được bằng Playwright, nhưng chưa có bộ kiểm thử tự động lặp lại được và chưa xử lý đầy đủ các trường hợp lỗi từ API. Hướng phát triển tiếp theo, nếu tiếp tục ngoài phạm vi học phần này, gồm: nạp dữ liệu giá lịch sử thật có ghi nguồn, bổ sung kiểm thử tự động cho frontend và xử lý lỗi trên giao diện, mở rộng bài toán tối ưu hóa sang dạng có ràng buộc, và thực hiện phân tích độ nhạy tham số một cách có hệ thống trước khi cân nhắc dùng hệ thống cho quyết định đầu tư thật.

### Tài liệu tham khảo

[1] F. Black and R. Litterman, "Global portfolio optimization," *Financial Analysts Journal*, vol. 48, no. 5, pp. 28–43, 1992.

[2] H. Markowitz, "Portfolio selection," *The Journal of Finance*, vol. 7, no. 1, pp. 77–91, 1952.

[3] G. He and R. Litterman, "The intuition behind Black-Litterman model portfolios," Goldman Sachs Investment Management Research, working paper, 1999.

[4] T. Idzorek, "A step-by-step guide to the Black-Litterman model: Incorporating user-specified confidence levels," Ibbotson Associates/Zephyr Associates, working paper, 2005.

[5] Ghostfolio, "Ghostfolio: Open source wealth management software," Mã nguồn mở, giấy phép AGPL-3.0. [Online]. Available: https://github.com/ghostfolio/ghostfolio. Tham khảo kiến trúc tổ chức mã nguồn (mục 5.2, 5.4); không sao chép mã nguồn.

[6] R. C. Grinold and R. N. Kahn, *Active Portfolio Management: A Quantitative Approach for Providing Superior Returns and Controlling Risk*, 2nd ed. New York, NY, USA: McGraw-Hill, 2000.

### Nguồn mã và minh chứng

- Mã nguồn đồ án: repository GitHub `tttn_nguyen_van_trung` ([Sinh viên điền: dán link GitHub thật khi nộp bài]).
- Video demo sản phẩm: [Sinh viên điền: dán link video demo khi nộp bài].
- Các file mã nguồn được trích dẫn trực tiếp trong báo cáo: `apps/api/app/core/black_litterman.py`, `apps/api/app/core/portfolio_stats.py`, `apps/api/app/core/data_loader.py`, `apps/api/app/main.py`, `apps/api/app/schemas.py`, `apps/api/app/core/tests/test_black_litterman.py`, `apps/api/sample_data/sample_prices_SYNTHETIC.csv`.

### Khai báo sử dụng công cụ AI

Báo cáo này được soạn thảo với sự hỗ trợ của Claude (Anthropic), mô hình Claude Sonnet 5, thông qua Claude Code, dựa trên việc đọc trực tiếp mã nguồn thật của đồ án và chạy kiểm thử đơn vị để xác minh số liệu. Nội dung Phần 3 (giới thiệu đơn vị thực tập) và các thông tin cá nhân/nhật ký ở Phần 1, 2, 4 không do công cụ AI tạo ra và cần sinh viên tự bổ sung, xác minh trước khi nộp bài, theo đúng yêu cầu liêm chính học thuật của học phần.
