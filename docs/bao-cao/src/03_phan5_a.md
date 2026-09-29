@H1 BÁO CÁO PROJECT THỰC TẬP

@H2 5.1. Đặt vấn đề

@H3 5.1.1. Bối cảnh

Nhà đầu tư cá nhân ở Việt Nam thường giữ nhiều loại tài sản cùng lúc: cổ phiếu niêm yết, quỹ hoán đổi danh mục, tiền mã hóa, vàng và tiền gửi tiết kiệm. Các tài sản này nằm ở nhiều công ty chứng khoán, ví điện tử và ngân hàng khác nhau, nên người đầu tư khó nhìn được toàn bộ danh mục. Nhiều người ghi chép bằng bảng tính. Bảng tính linh hoạt nhưng dễ sai công thức, không tự cập nhật giá và không hỗ trợ tính toán rủi ro.

Các phần mềm quản lý danh mục nước ngoài đáp ứng một phần nhu cầu, nhưng giao diện không có tiếng Việt, đồng tiền mặc định là đô la Mỹ và định dạng số theo quy ước Anh Mỹ. Với người dùng Việt Nam, dấu chấm là dấu ngăn cách hàng nghìn (1.000.000 đồng), còn dấu phẩy ngăn cách phần thập phân (1.234,56). Phần mềm dùng quy ước ngược lại dễ gây nhầm lẫn khi nhập tiền. Phần mềm mã nguồn mở có sẵn chủ yếu dừng ở việc theo dõi và trình bày, ít khi gợi ý cách phân bổ.

Lý thuyết danh mục hiện đại cho ta các công cụ để phân bổ: Markowitz [1] đưa ra đường biên hiệu quả, Rockafellar và Uryasev [4] đưa ra tối ưu hóa giá trị chịu rủi ro có điều kiện, và Black và Litterman [2] cho phép trộn quan điểm của nhà đầu tư vào lợi suất cân bằng của thị trường. Những phương pháp này chủ yếu xuất hiện trong tài liệu học thuật và trong công cụ của tổ chức chuyên nghiệp, rất ít khi đến tay người đầu tư cá nhân qua một giao diện tiếng Việt.

@H3 5.1.2. Vấn đề và câu hỏi nghiên cứu

Từ bối cảnh trên, dự án xác định ba câu hỏi:

- Câu hỏi 1. Có thể mở rộng một nền tảng mã nguồn mở hiện có để người dùng Việt Nam dùng bằng tiếng Việt, tiền tệ mặc định là đồng Việt Nam (VND) và số nhập theo quy ước Việt Nam mà không phải viết lại hệ thống hay không.
- Câu hỏi 2. Có thể cài đặt trong cùng một máy chủ TypeScript bốn phương pháp phân bổ (Markowitz, giá trị chịu rủi ro có điều kiện, Black-Litterman và cân bằng rủi ro), kèm đường biên hiệu quả và kiểm tra ngược, sao cho một yêu cầu với tối đa 20 tài sản trả kết quả trong thời gian tương tác, dưới 5 giây, hay không.
- Câu hỏi 3. Có thể kiểm chứng tính đúng của các thuật toán bằng kiểm thử tự động dựa trên tính chất toán học, thay cho việc so sánh với một bộ giải bên ngoài, hay không.

Giả thuyết kiểm chứng ở Mục 5.5 gồm ba mệnh đề: H1, một lần chạy tối ưu hóa kèm backtest hoàn tất dưới 5 giây trên dữ liệu demo; H2, mọi phương pháp trả tỷ trọng không âm, cộng bằng 1 và không vượt trần đã đặt (trừ cân bằng rủi ro, xem Mục 5.7); H3, một quan điểm tăng giá với độ tin cậy cao làm tăng tỷ trọng của tài sản tương ứng so với khi không có quan điểm.

@H3 5.1.3. Mục tiêu và phạm vi

Mục tiêu của dự án là xây dựng BL Advisor, một hệ thống web cho phép người dùng ghi giao dịch, theo dõi danh mục bằng VND, xem phân bổ theo nhiều chiều và chạy tối ưu hóa danh mục trên chính khoản nắm giữ của mình.

Phạm vi gồm: giao diện tiếng Việt; quản lý tài khoản và giao dịch; phân tích hiệu suất, so sánh với chỉ số tham chiếu; mô-đun tối ưu hóa; bộ dữ liệu demo mô phỏng; kiểm thử tự động. Phạm vi không gồm: đặt lệnh thật, dữ liệu thị trường theo thời gian thực, ứng dụng di động riêng, và bất kỳ lời khuyên đầu tư nào. Giao diện chạy được trên điện thoại qua trình duyệt.

@H3 5.1.4. Đóng góp của sinh viên

Dự án xây dựng trên Ghostfolio, một phần mềm mã nguồn mở theo giấy phép GNU Affero General Public License phiên bản 3 (AGPL-3.0) [17]. Phần lớn chức năng quản lý danh mục là của Ghostfolio. Đóng góp của sinh viên gồm sáu điểm:

- Việt hóa giao diện và chuẩn hóa định dạng số vi-VN, gồm một directive Angular để ô nhập tự thêm dấu chấm ngăn cách khi gõ.
- Một engine tối ưu hóa viết bằng TypeScript thuần, cài Markowitz (phương sai tối thiểu, Sharpe tối đa, trung bình-phương sai), giá trị chịu rủi ro có điều kiện và cân bằng rủi ro, cùng đường biên hiệu quả và các danh mục chuẩn.
- Black-Litterman có quan điểm tuyệt đối và tương đối, mỗi quan điểm có độ tin cậy từ 5% đến 95%, kèm tối ưu hóa không âm có trần trên lợi suất hậu nghiệm.
- Kiểm tra ngược theo kiểu walk-forward, chỉ dùng dữ liệu trước mỗi kỳ cân bằng lại.
- Bộ dữ liệu demo tái lập được, gồm 16 tài khoản, 4.519 giao dịch, 22 tài sản và 4 chỉ số tham chiếu mô phỏng.
- Tập kiểm thử tự động 501 bài, cùng quy trình kiểm thử độc lập bằng trình duyệt tự động.

@H3 5.1.5. Bố cục

Mục 5.2 khảo sát nghiên cứu liên quan và trình bày cơ sở lý thuyết. Mục 5.3 phân tích yêu cầu và thiết kế. Mục 5.4 mô tả cài đặt. Mục 5.5 báo cáo kiểm thử và đánh giá. Mục 5.6 minh họa cách dùng bằng ảnh chụp. Mục 5.7 bàn về hạn chế và hướng phát triển, Mục 5.8 kết luận.

@H2 5.2. Khảo sát nghiên cứu liên quan và cơ sở lý thuyết

@H3 5.2.1. Tối ưu hóa trung bình-phương sai

Markowitz [1] mô tả danh mục bằng hai đại lượng: lợi suất kỳ vọng và phương sai. Gọi w là vectơ tỷ trọng của n tài sản, μ là vectơ lợi suất kỳ vọng hằng năm và Σ là ma trận hiệp phương sai hằng năm. Lợi suất và phương sai của danh mục là:

@EQ E[R_p] = w^{\top}\mu ,\qquad \mathrm{Var}(R_p) = w^{\top}\Sigma w | (1)

Tập các danh mục cho lợi suất cao nhất ở từng mức phương sai tạo thành đường biên hiệu quả. Có ba bài toán thường gặp trên đường biên. Bài toán phương sai tối thiểu tìm w làm nhỏ nhất phương sai trong công thức (1). Bài toán trung bình-phương sai, với δ là hệ số ngại rủi ro, tìm w làm lớn nhất:

@EQ \max_{w}\; \mu^{\top}w - \frac{\delta}{2}\, w^{\top}\Sigma w | (2)

Bài toán Sharpe tối đa tìm w làm lớn nhất tỷ số Sharpe do Sharpe [8] đề xuất, trong đó r_f là lãi suất phi rủi ro:

@EQ S(w) = \frac{\mu^{\top}w - r_f}{\sqrt{w^{\top}\Sigma\, w}} | (3)

Trong dự án, mọi bài toán đều giới hạn tỷ trọng không âm, tổng bằng 1 và mỗi tỷ trọng không vượt trần c do người dùng đặt.

@H3 5.2.2. Sai số ước lượng và các giải pháp

Michaud [11] chỉ ra rằng tối ưu hóa trung bình-phương sai khuếch đại sai số của dữ liệu đầu vào, nhất là lợi suất kỳ vọng, nên nghiệm thường dồn vào vài tài sản có sai số thuận lợi. DeMiguel, Garlappi và Uppal [7] so sánh 14 mô hình trên 7 tập dữ liệu và thấy không mô hình nào ổn định hơn chiến lược chia đều 1/N về tỷ số Sharpe ngoài mẫu. Kolm, Tütüncü và Fabozzi [12] tổng kết hướng khắc phục: thêm ràng buộc như trần tỷ trọng, dùng ước lượng co rút cho ma trận hiệp phương sai [13], hoặc đổi sang phương pháp không cần dự báo lợi suất. Dự án chọn ba biện pháp trong số này: trần tỷ trọng, danh mục chuẩn 1/N để so sánh, và Black-Litterman cùng cân bằng rủi ro là hai phương pháp ít phụ thuộc vào lợi suất lịch sử.

@H3 5.2.3. Giá trị chịu rủi ro có điều kiện

Giá trị chịu rủi ro có điều kiện (CVaR) ở mức tin cậy α là mức lỗ trung bình trong phần (1 − α) tệ nhất của phân phối lỗ [4], [5]. Trên T kịch bản lịch sử, mức lỗ của danh mục ở kịch bản t là ℓ_t(w) = −R_t'w, với R_t là vectơ lợi suất của các tài sản ở kịch bản đó. Gọi ℓ_(1) ≥ ℓ_(2) ≥ … là các mức lỗ sắp theo thứ tự giảm dần. CVaR được ước lượng bằng trung bình k mức lỗ lớn nhất, với k bằng phần nguyên trên của (1 − α)T:

@EQ \mathrm{CVaR}_{\alpha}(w) = \frac{1}{k}\sum_{j=1}^{k} \ell_{(j)}(w) | (4)

CVaR nhạy với đuôi phân phối nên phù hợp khi lợi suất lệch hoặc có đuôi dày. Rockafellar và Uryasev chứng minh CVaR là hàm lồi của tỷ trọng, nên bài toán tối thiểu hóa CVaR có nghiệm toàn cục.

@H3 5.2.4. Cân bằng rủi ro

Danh mục cân bằng rủi ro (equal risk contribution) yêu cầu mỗi tài sản đóng góp cùng một phần vào rủi ro tổng. Đóng góp của tài sản i vào phương sai là w_i(Σw)_i, nên điều kiện cân bằng là w_i(Σw)_i bằng nhau với mọi i [6]. Maillard, Roncalli và Teïletche chỉ ra rằng độ biến động của danh mục này nằm giữa độ biến động của danh mục phương sai tối thiểu và của danh mục chia đều. Phương pháp không dùng lợi suất kỳ vọng, nên tránh được nguồn sai số lớn nhất ở Mục 5.2.2.

@H3 5.2.5. Mô hình Black-Litterman

Black và Litterman [2] đề xuất bắt đầu từ lợi suất mà thị trường đang ngầm định, rồi điều chỉnh theo quan điểm của nhà đầu tư. He và Litterman [3] giải thích trực giác của mô hình: danh mục tối ưu không ràng buộc là danh mục cân bằng thị trường cộng tổng có trọng số của các danh mục biểu diễn quan điểm. Idzorek [10] bổ sung cách gắn độ tin cậy cho từng quan điểm.

Các ký hiệu: Σ là ma trận hiệp phương sai của lợi suất; w_mkt là vectơ tỷ trọng cân bằng thị trường (trong dự án là tỷ trọng giá trị hiện tại của danh mục); δ là hệ số ngại rủi ro; τ là độ bất định của lợi suất cân bằng; P là ma trận chọn với mỗi hàng mô tả một quan điểm; Q là vectơ lợi suất mà các quan điểm dự báo; Ω là ma trận độ bất định của các quan điểm. Mô hình gồm ba bước.

Bước một suy ra lợi suất cân bằng ngầm định π từ tỷ trọng thị trường:

@EQ \pi = \delta\,\Sigma\, w_{\mathrm{mkt}} | (5)

Bước hai kết hợp π với các quan điểm để có lợi suất hậu nghiệm E[R] và ma trận hiệp phương sai M⁻¹ của ước lượng này:

@EQ E[R] = \left[(\tau\Sigma)^{-1} + P^{\top}\Omega^{-1}P\right]^{-1}\left[(\tau\Sigma)^{-1}\pi + P^{\top}\Omega^{-1}Q\right],\qquad M^{-1} = \left[(\tau\Sigma)^{-1} + P^{\top}\Omega^{-1}P\right]^{-1} | (6)

Bước ba tìm tỷ trọng tối ưu. Công thức không ràng buộc của Black và Litterman là:

@EQ w^{*} = \left[\delta\left(\Sigma + M^{-1}\right)\right]^{-1} E[R] | (7)

Khi không có quan điểm nào, E[R] bằng π và w* trùng w_mkt. Đây là tính chất hữu ích để kiểm thử: nó khẳng định cài đặt nhất quán với lý thuyết.

@H3 5.2.6. Đánh giá ngoài mẫu và kiểm tra ngược

Chỉ số Sharpe và các chỉ số khác tính trên cùng dữ liệu đã dùng để tối ưu (trong mẫu) thường lạc quan. Kiểm tra ngược kiểu walk-forward giảm hiện tượng này: tại mỗi kỳ cân bằng lại, chiến lược chỉ dùng dữ liệu trước ngày đó để tính tỷ trọng, giữ danh mục đến kỳ sau rồi lặp lại. Bailey và cộng sự [14] cảnh báo rằng thử nhiều cấu hình trên cùng dữ liệu làm tăng xác suất quá khớp. Vì vậy dự án chỉ dùng một cấu hình mặc định cho mọi kết quả trong báo cáo và không chọn cấu hình theo kết quả backtest.

@H3 5.2.7. Công cụ mã nguồn mở và khoảng trống

Ghostfolio [18] là phần mềm quản lý danh mục mã nguồn mở, viết bằng NestJS và Angular, có tính hiệu suất, phân bổ và phân tích rủi ro tĩnh (X-ray). Trong phạm vi khảo sát của sinh viên, gồm tài liệu và mã nguồn phiên bản 3.74.0 trên GitHub, phần mềm gốc không có mô-đun tối ưu hóa danh mục theo Markowitz, CVaR hay Black-Litterman, và không có giao diện tiếng Việt đầy đủ. Kết luận này giới hạn ở phạm vi tìm kiếm nêu trên, sinh viên không khảo sát các công cụ thương mại.

Tác giả cũng nghiên cứu Black-Litterman trên thị trường cổ phiếu Việt Nam ở mức mô hình [P1] và đang hoàn thiện một bài về khung Black-Litterman nghịch đảo kết hợp học máy phân cụm cho cổ phiếu ngân hàng. Dự án thực tập chuyển các ý tưởng đó từ bản tính toán sang một hệ thống dùng được: đọc danh mục thật của người dùng, nhận quan điểm qua giao diện và hiển thị kết quả kèm so sánh.

@TABLE Bảng 5.1. Đối chiếu nhu cầu, khoảng trống và cách giải quyết của dự án
| Nhu cầu của nhà đầu tư cá nhân Việt Nam | Khoảng trống của công cụ có sẵn | Cách giải quyết trong BL Advisor |
| Giao diện và số theo quy ước Việt Nam | Phần mềm gốc dùng tiếng Anh, số kiểu Anh Mỹ | Bản dựng chỉ tiếng Việt, vi-VN, directive nhập số |
| Theo dõi nhiều loại tài sản bằng VND | Đồng tiền mặc định là đô la Mỹ | VND mặc định cho người dùng mới; tỷ giá theo ngày |
| Biết nên tăng hay giảm tỷ trọng từng tài sản | Chỉ có phân bổ, chưa có tối ưu hóa | Trang Tối ưu hóa với sáu phương pháp |
| Đưa nhận định riêng vào gợi ý | Chưa có | Black-Litterman có quan điểm và độ tin cậy |
| Biết gợi ý có hiệu quả không | Chưa có | So sánh với sáu danh mục chuẩn và backtest walk-forward |
| Dùng thử khi không có mạng | Phụ thuộc nguồn giá bên ngoài | Dữ liệu demo mô phỏng, lưu cục bộ |
