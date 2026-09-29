@H2 5.5. Kiểm thử và đánh giá

@H3 5.5.1. Chiến lược kiểm thử

Sinh viên áp dụng phát triển hướng kiểm thử (test driven development) [16] cho phần đóng góp riêng: viết kiểm thử trước, xác nhận kiểm thử thất bại vì đúng lý do, rồi viết mã tối thiểu để kiểm thử đạt. Các mức kiểm thử theo cách phân loại của ISO/IEC/IEEE 29119 [15] gồm kiểm thử đơn vị cho hàm toán học và hàm hỗ trợ, kiểm thử thành phần cho directive và trang Angular, và kiểm thử hệ thống bằng trình duyệt tự động do một tác tử độc lập thực hiện. Bốn kịch bản Cypress viết sẵn cho kiểm thử đầu cuối nhưng chưa chạy được trong môi trường phát triển của sinh viên vì không tải được Cypress, nên không tính vào kết quả.

Bảng 5.8 tổng hợp kết quả lần chạy cuối của đợt thực tập. Cả bốn dự án đều đạt, một kiểm thử của máy chủ được bỏ qua có chủ đích và có sẵn trong phần mềm gốc.

@TABLE Bảng 5.8. Kết quả kiểm thử tự động
| Dự án | Số bài đạt | Ghi chú |
| Máy chủ (api) | 301 | Một bài bỏ qua; gồm 37 bài của mô-đun tối ưu hóa |
| Giao diện (client) | 25 | Gồm trang tối ưu hóa, trang Giới thiệu, danh sách công bố |
| Thư viện giao diện (ui) | 13 | Gồm 7 bài của directive nhập số |
| Thư viện dùng chung (common) | 162 | Gồm hàm đọc và định dạng số |
| Tổng | 501 | Không có bài thất bại |

@H3 5.5.2. Kiểm thử tính đúng của thuật toán

Vì không có bộ giải bên ngoài để đối chiếu, sinh viên kiểm thử theo tính chất toán học (property-based). Các tính chất đã kiểm thử gồm: tỷ trọng của cả sáu phương pháp không âm và cộng bằng 1; tỷ trọng của năm phương pháp có trần không vượt trần khi đặt trần 40%; danh mục phương sai tối thiểu đặt tỷ trọng cao hơn vào tài sản biến động thấp nhất; khi không có quan điểm, lợi suất hậu nghiệm bằng lợi suất cân bằng; một quan điểm tăng giá với độ tin cậy 90% làm tăng cả lợi suất hậu nghiệm lẫn tỷ trọng của tài sản đó; các chuỗi giá được căn chỉnh không nhìn trước dữ liệu tương lai; ba đường của backtest cùng độ dài và cùng bắt đầu ở 100; backtest trả rỗng khi không đủ lịch sử. Dữ liệu kiểm thử sinh bằng bộ tạo số giả ngẫu nhiên có hạt giống cố định, nên kết quả lặp lại được (yêu cầu NFR4).

@H3 5.5.3. Hiệu năng

Sinh viên đo thời gian phản hồi của endpoint tối ưu hóa với sáu tài sản, hai năm dữ liệu mô phỏng và backtest theo quý, mỗi phương pháp một lần chạy, trong môi trường container của sinh viên. Chỉ ba phương pháp được đo. Sharpe tối đa mất 3,4 giây, CVaR tối thiểu 3,5 giây và Black-Litterman có một quan điểm 1,7 giây. Cả ba dưới ngưỡng 5 giây, nên giả thuyết H1 được ủng hộ ở quy mô sáu tài sản. Yêu cầu NFR1 với 20 tài sản chưa được kiểm chứng, và sinh viên cũng chưa đo trên phần cứng chuẩn, vì vậy kết luận chỉ áp dụng cho quy mô đã đo. CVaR chậm hơn Black-Litterman vì mỗi kỳ backtest lặp 2.000 lần và mỗi lần sắp xếp các kịch bản.

@H3 5.5.4. Kiểm thử chất lượng độc lập

Sau khi hoàn thành các chức năng chính, sinh viên chạy vòng kiểm thử thứ nhất bằng một tác tử độc lập điều khiển trình duyệt. Tác tử, một trợ lý trí tuệ nhân tạo (AI) Claude điều khiển trình duyệt, truy cập từng trang ở các vai trò khách, người dùng và quản trị viên, chụp 27 ảnh và lập danh sách lỗi đánh số từ D1 đến D35 theo mức Critical, Major và Minor. Sinh viên đã sửa các lỗi Major D1 đến D8, D14 và D15, gồm dữ liệu demo không liên kết được với hồ sơ tài sản, trang còn tiếng Anh và trang gỡ bỏ chưa xử lý. Một lỗi hồi quy phát sinh sau đó (đường dẫn gốc hiện trang 404) do chính sinh viên phát hiện khi chạy thử và đã sửa kèm kiểm thử. Vòng kiểm thử thứ hai chưa thực hiện tại thời điểm viết báo cáo, và một số lỗi Minor còn mở (Phụ lục C).

@H3 5.5.5. Kết quả thực nghiệm minh họa

Sinh viên chạy tối ưu hóa trên tài khoản demo-user-12 (762 giao dịch) với tám khoản nắm giữ có tỷ trọng lớn nhất, hai năm dữ liệu mô phỏng, lãi suất phi rủi ro 3% mỗi năm và tỷ trọng tối đa 40%. Bảng 5.9 so sánh các danh mục trên dữ liệu trong mẫu. Đây là một lần chạy trên dữ liệu mô phỏng, nên sinh viên không suy ra kết luận đầu tư từ bảng này. Mục đích của bảng là kiểm tra các quan hệ mà lý thuyết dự báo.

@DATATABLE opt_compare

Các chỉ số trong Bảng 5.9 được tính như sau: lợi suất năm là trung bình lợi suất ngày nhân 252, độ biến động năm là độ lệch chuẩn của lợi suất ngày nhân căn bậc hai của 252, CVaR 95% ngày là mức lỗ ngày trung bình trong 5% ngày tệ nhất, và sụt giảm tối đa là mức giảm lớn nhất từ một đỉnh trước đó.

@DATATABLE weights_table

Hai quan hệ lý thuyết được xác nhận. Trong các danh mục chịu trần 40% (hiện tại, chia đều, phương sai tối thiểu, Sharpe tối đa và CVaR tối thiểu), danh mục Sharpe tối đa có tỷ số Sharpe cao nhất (0,82) và danh mục phương sai tối thiểu có độ biến động thấp nhất (8,3%). Một quan hệ khác cần giải thích: danh mục cân bằng rủi ro có tỷ số Sharpe (0,98) và danh mục nghịch đảo biến động (0,84) đều cao hơn danh mục Sharpe tối đa (0,82). Nguyên nhân là ràng buộc không đồng đều giữa các phương pháp. Trần 40% áp cho Sharpe tối đa, còn cân bằng rủi ro và nghịch đảo biến động chưa áp trần. Hai danh mục này đặt 65,1% và 58,1% vào quỹ trái phiếu (Bảng 5.10), tài sản có độ biến động 2,9% mỗi năm và lợi suất 9,5% mỗi năm trong mẫu, cao hơn hẳn trần 40%. Kết quả này chỉ ra hạn chế của bản cài đặt hiện tại (Mục 5.7) và cho thấy trần tỷ trọng là một ràng buộc có giá.

Bảng 5.11 trình bày kết quả backtest walk-forward của cùng cấu hình với phương pháp Sharpe tối đa, cửa sổ ước lượng 252 ngày và cân bằng lại hằng quý.

@DATATABLE backtest_compare

Trong giai đoạn ngoài mẫu, chiến lược tối ưu không vượt được chiến lược chia đều. Điều này phù hợp với phát hiện của DeMiguel và cộng sự [7]: ước lượng lợi suất từ cửa sổ một năm nhiễu đến mức lợi thế trong mẫu của tối ưu hóa không giữ được ngoài mẫu. Đây là một cấu hình trên một bộ dữ liệu mô phỏng, nên kết quả không đủ để đánh giá tối ưu hóa nói chung. Các chỉ số trong mẫu ở Bảng 5.9 vì vậy lạc quan hơn thực tế. Cụ thể, trong ngoài mẫu danh mục tối ưu lỗ 4,5% tổng cộng, trong khi danh mục chia đều lãi 2,9% và danh mục hiện tại lãi 1,8% (Bảng 5.11).

@H3 5.5.6. Các yếu tố ảnh hưởng đến độ tin cậy của kết quả

Có bốn yếu tố. Thứ nhất, dữ liệu là mô phỏng nên không phản ánh đặc điểm thị trường thật như đuôi dày hay phụ thuộc thay đổi theo thời gian. Thứ hai, tài khoản demo có thời gian nắm giữ và tỷ trọng do tập lệnh sinh ra, không phải hành vi của nhà đầu tư thật. Thứ ba, mọi kết quả dùng một cấu hình, nên chưa đánh giá độ nhạy theo tham số. Thứ tư, phép đo thời gian chạy trên một môi trường, chưa lặp nhiều lần để có khoảng tin cậy.

@H2 5.6. Hướng dẫn sử dụng và minh họa chức năng

Mục này minh họa các chức năng bằng ảnh chụp từ dữ liệu demo. Ảnh lấy từ bản dựng cuối của đợt thực tập, với dữ liệu demo. Bộ ảnh đầy đủ (41 ảnh) và chú thích nằm ở thư mục `docs/screenshots/bao-cao` của kho mã.

Người dùng bắt đầu bằng đăng nhập với mã bảo mật (Hình 5.4) và đến trang Tổng quan (Hình 5.5), nơi hiển thị tài sản ròng bằng VND cùng biểu đồ diễn biến.

@FIG screenshots/02-dang-nhap.png | Hình 5.4. Hộp thoại đăng nhập bằng mã bảo mật. Người dùng nhập mã bảo mật do hệ thống cấp khi tạo tài khoản.

@FIG screenshots/10-tong-quan.png | Hình 5.5. Trang Tổng quan với tài sản ròng bằng VND. Biểu đồ đường là diễn biến tài sản ròng theo thời gian.

Khi thêm giao dịch (Hình 5.6), ô số lượng và đơn giá tự thêm dấu chấm ngăn cách khi gõ: gõ 1234567 cho 1.234.567 và gõ 85000,5 cho 85.000,5. Đây là kết quả của directive ở Mục 5.4.5.

@FIG screenshots/18-them-giao-dich.png | Hình 5.6. Hộp thoại Thêm giao dịch với số nhập theo quy ước Việt Nam. Ô số lượng và đơn giá tự thêm dấu chấm ngăn cách hàng nghìn khi gõ.

Trang Phân tích (Hình 5.7) cho phép so sánh hiệu suất danh mục với một benchmark, ở đây là VN-Index mô phỏng. Bốn benchmark và mức chênh so với đỉnh hiển thị ở mục Thị trường (Hình 5.8).

@FIG screenshots/16-phan-tich-benchmark.png | Hình 5.7. Trang Phân tích, so sánh hiệu suất danh mục với VN-Index mô phỏng. Hai đường là hiệu suất tích lũy của danh mục và của chỉ số, tính theo phần trăm.

@FIG screenshots/14-thi-truong.png | Hình 5.8. Bốn benchmark mô phỏng và mức chênh so với đỉnh. Các chỉ số gồm VN-Index, VN30, S&P 500 và Bitcoin USD; xu hướng 50 và 200 ngày là đường trung bình động.

Trang Phân bổ có khối Black-Litterman không quan điểm (Hình 5.9). Vì chưa có quan điểm, tỷ trọng Black-Litterman trùng với tỷ trọng hiện tại. Khối này có liên kết sang trang Tối ưu hóa.

@FIG screenshots/22-phan-bo-black-litterman.png | Hình 5.9. Khối Black-Litterman trên trang Phân bổ. Ảnh đã cắt vùng chứa khối này, không chỉnh sửa khác.

Trang Tối ưu hóa mở đầu bằng khối chọn tài sản, phương pháp và tham số (Hình 5.10). Với Black-Litterman, người dùng thêm quan điểm (Hình 5.11): trong ví dụ, sinh viên thêm Vàng SJC vào danh sách, đặt quan điểm tuyệt đối Vinamilk sinh lời 12% mỗi năm với độ tin cậy 60% và quan điểm tương đối FPT vượt Vietcombank 3% mỗi năm.

@FIG screenshots/30-toi-uu-form.png | Hình 5.10. Trang Tối ưu hóa: chọn tài sản, phương pháp và tham số. Các trường gồm trần tỷ trọng, lãi suất phi rủi ro, khoảng dữ liệu và tùy chọn backtest.

@FIG screenshots/36-toi-uu-black-litterman-quan-diem.png | Hình 5.11. Nhập quan điểm cho Black-Litterman: một quan điểm tuyệt đối và một quan điểm tương đối. Thanh trượt đặt độ tin cậy từ 5% đến 95%; danh sách thả xuống là các tài sản có thể chọn.

Kết quả của phương pháp Sharpe tối đa (Hình 5.12) và CVaR tối thiểu (Hình 5.13) gồm biểu đồ tỷ trọng, bảng so sánh, đường biên hiệu quả và backtest. Kết quả Black-Litterman (Hình 5.14) có thêm bảng lợi suất cân bằng và lợi suất hậu nghiệm cho thấy quan điểm đã dịch chuyển kỳ vọng bao nhiêu.

@FIGEMPTY Hình 5.12. Kết quả Markowitz Sharpe tối đa. | Chèn ảnh chụp toàn trang kết quả Sharpe tối đa: tám khoản nắm giữ lớn nhất, tỷ trọng tối đa 40%, backtest theo quý

@FIGEMPTY Hình 5.13. Kết quả CVaR tối thiểu. | Chèn ảnh chụp toàn trang kết quả CVaR tối thiểu: cùng cấu hình như Hình 5.12

@FIGEMPTY Hình 5.14. Kết quả Black-Litterman với hai quan điểm, kèm lợi suất hậu nghiệm và backtest. | Chèn ảnh chụp toàn trang kết quả Black-Litterman với hai quan điểm

Công cụ FIRE (Financial Independence, Retire Early: độc lập tài chính, nghỉ hưu sớm) của phần mềm gốc (Hình 5.15) ước tính tài sản khi nghỉ hưu và khoản rút bền vững theo tỷ lệ rút an toàn (SWR), mặc định 4%. Trang X-ray (Hình 5.16) kiểm tra danh mục theo 16 quy tắc rủi ro.

@FIG screenshots/40-fire.png | Hình 5.15. Công cụ FIRE với số tiết kiệm hằng tháng nhập theo định dạng Việt Nam. Trục tung tính bằng triệu đồng (M); SWR là tỷ lệ rút an toàn.

@FIG screenshots/41-x-ray.png | Hình 5.16. Trang X-ray: các quy tắc rủi ro và trạng thái. Mỗi quy tắc hiển thị đạt hoặc không đạt cho danh mục hiện tại.

Người dùng có vai trò quản trị viên thấy thêm mục quản trị (Hình 5.17). Mục này gồm bốn nhóm chức năng: danh sách người dùng và vai trò, dữ liệu thị trường của các hồ sơ tài sản (gồm bốn benchmark mô phỏng), cài đặt hệ thống và theo dõi các tác vụ nền chạy trên Redis. Người đầu tiên đăng ký trên cơ sở dữ liệu trống trở thành quản trị viên. Quản trị viên cũng là người cập nhật giá lịch sử cho tài sản nhập tay, điều kiện để trang Tối ưu hóa dùng được tài sản đó.

@FIGEMPTY Hình 5.17. Trang quản trị: danh sách người dùng, dữ liệu thị trường và cài đặt hệ thống. | Chèn ảnh chụp trang quản trị tại đây

Ứng dụng dùng được trên điện thoại (Hình 5.18).

@FIG screenshots/62-di-dong-toi-uu.png | Hình 5.18. Trang Tối ưu hóa trên màn hình 375 px. Bố cục một cột, các khối xếp dọc.

@H2 5.7. Thảo luận, hạn chế và hướng phát triển

@H3 5.7.1. Thảo luận

Kết quả trả lời ba câu hỏi ở Mục 5.1.2. Về câu hỏi 1, việc mở rộng nền tảng có sẵn khả thi: sinh viên không viết lại hệ thống mà thêm các nhóm thay đổi (bản địa hóa, directive nhập số, dữ liệu demo, mô-đun tối ưu), và giữ nguyên phần ghi nhận bản quyền theo AGPL-3.0. Chi phí của cách làm này là kế thừa các quyết định thiết kế của phần mềm gốc, ví dụ ràng buộc ký hiệu UUID ở Mục 5.3.3.

Về câu hỏi 2, sáu biến thể cùng chạy trong một máy chủ TypeScript. Thời gian phản hồi đo cho ba phương pháp với sáu tài sản là từ 1,7 đến 3,5 giây. Không cần chạy thêm dịch vụ Python. Ngược lại, độ chính xác của bộ giải không sánh được với bộ giải chuyên dụng: CVaR dùng dưới gradient nên cho nghiệm gần tối ưu, không phải nghiệm chính xác như quy hoạch tuyến tính.

Về câu hỏi 3, kiểm thử theo tính chất bắt được các lỗi về ràng buộc và về hướng của tác động, nhưng không chứng minh giá trị số học đúng đến từng chữ số. Nếu cần độ chính xác cao, nên đối chiếu với một thư viện tối ưu độc lập trên vài bộ dữ liệu chuẩn.

@H3 5.7.2. Hạn chế

- Cân bằng rủi ro chưa áp trần tỷ trọng, nên so sánh giữa phương pháp này với các phương pháp có trần chưa công bằng (Mục 5.5.5).
- Lợi suất kỳ vọng ước lượng từ lịch sử nên nhiễu, nhất là khi có ít quan sát. Hệ thống cảnh báo khi dưới 250 quan sát chung, tương đương khoảng một năm giao dịch.
- Quy đổi hằng năm luôn dùng hệ số 252 ngày giao dịch. Khi danh mục có tiền mã hóa, chuỗi căn chỉnh gồm cả cuối tuần và có nhiều hơn 252 quan sát mỗi năm, nên lợi suất và độ biến động hằng năm bị ước lượng thấp. Cần suy hệ số này từ tần suất quan sát thực tế.
- Backtest chưa tính phí giao dịch, thuế và độ trượt giá, nên kết quả thực tế thấp hơn.
- Chưa chặn phía giao diện đường dẫn quản trị đối với người dùng thường (mục D24) và chưa cấu hình địa chỉ gốc của ứng dụng (mục D20); cả hai còn mở ở Phụ lục C.
- Các tài sản có lịch giao dịch khác nhau được điền giá gần nhất, làm giảm nhẹ độ biến động đo được của tài sản giao dịch ít ngày hơn.
- Khối Black-Litterman trên trang Phân bổ chưa nhận quan điểm. Chỉ trang Tối ưu hóa nhận quan điểm.
- Dữ liệu demo là mô phỏng, nên kết quả chỉ minh họa cách dùng.
- Kiểm thử chất lượng độc lập mới chạy một vòng và kịch bản Cypress chưa chạy tự động.
- Tối đa 20 tài sản mỗi lần, và tài sản thêm phải có giá lịch sử trong hệ thống.

@H3 5.7.3. Hướng phát triển

Bốn hướng phát triển được ưu tiên. Một là thêm trần tỷ trọng cho cân bằng rủi ro để so sánh công bằng. Hai là thay ước lượng hiệp phương sai mẫu bằng ước lượng co rút của Ledoit và Wolf [13] và đánh giá độ nhạy theo tham số. Ba là đưa phí giao dịch và thuế vào backtest. Bốn là chạy kiểm thử đầu cuối bằng Cypress trong quy trình tích hợp liên tục và chạy vòng kiểm thử độc lập thứ hai. Phần lý thuyết cũng cho phép mở rộng sang Black-Litterman nghịch đảo và phân cụm tài sản, hướng mà sinh viên đang nghiên cứu ở một bài báo riêng (xem Danh mục công trình khoa học của sinh viên ở cuối phần nội dung).

@H2 5.8. Kết luận

Dự án BL Advisor đạt mục tiêu đặt ra: một hệ thống web tiếng Việt cho phép người dùng theo dõi danh mục bằng VND và chạy tối ưu hóa trên chính khoản nắm giữ của mình. Trong 13 tuần thực tập, sinh viên đã Việt hóa nền tảng Ghostfolio, cài đặt sáu phương pháp phân bổ cùng đường biên hiệu quả và kiểm tra ngược, và kiểm chứng bằng 501 kiểm thử tự động. Kiểm tra ngược ngoài mẫu cho kết quả không thuận lợi với tối ưu hóa: danh mục Sharpe tối đa lỗ 4,5% trong khi danh mục chia đều lãi 2,9% (Mục 5.5.5), nên kết quả này không ủng hộ việc dùng tối ưu hóa mà không thận trọng. Ba giả thuyết được ủng hộ trong phạm vi đã đo: H1, thời gian chạy của ba phương pháp được đo (sáu tài sản) từ 1,7 đến 3,5 giây, dưới ngưỡng 5 giây; H2, mọi phương pháp có trần đều trả tỷ trọng không âm, cộng bằng 1 và không vượt trần; H3, quan điểm tăng giá với độ tin cậy cao làm tăng tỷ trọng.

Từ đợt thực tập, sinh viên rút ra hai bài học nghề nghiệp. Bài học thứ nhất là kiểm thử viết trước giúp giữ các thuật toán toán học đúng khi mã thay đổi nhiều lần. Bài học thứ hai là kiểm thử độc lập bằng người hoặc tác tử khác phát hiện các lỗi mà người viết mã không thấy, ví dụ lỗi trang gốc. Cả hai đều gần với yêu cầu kiểm soát chất lượng của môi trường sản xuất tại đơn vị thực tập.

Kết quả trên dữ liệu mô phỏng chỉ minh họa chức năng. Sinh viên khuyến nghị không dùng hệ thống để ra quyết định đầu tư thật cho đến khi hoàn thành các hạn chế ở Mục 5.7.2 và kiểm chứng trên dữ liệu thị trường thật.

@H2 Tuyên bố

Tuyên bố về dữ liệu. Mã nguồn công khai tại https://github.com/trungcandygit/TTTN_Nguyen_Van_Trung theo giấy phép AGPL-3.0. Dữ liệu demo hoàn toàn mô phỏng và sinh lại được bằng lệnh `npm run database:seed:demo`. Báo cáo không dùng dữ liệu của Công ty TNHH ITM Semiconductor Vietnam.

Tuyên bố về đạo đức. Nghiên cứu không có đối tượng người tham gia và không thu thập dữ liệu cá nhân thật. Các tài khoản demo chỉ dùng trong môi trường phát triển.

Đóng góp của tác giả (theo phân loại CRediT, Contributor Roles Taxonomy). Nguyễn Văn Trung: hình thành ý tưởng, xây dựng phương pháp, phát triển phần mềm, kiểm chứng, viết bản thảo. ThS. Vũ Hoài Thư (giảng viên phối hợp) và cán bộ hướng dẫn tại đơn vị thực tập: hướng dẫn và góp ý.

Xung đột lợi ích. Tác giả khai báo không có xung đột lợi ích. Đơn vị thực tập không tài trợ và không có quyền đối với sản phẩm.

Tài trợ. Dự án không nhận tài trợ riêng.

Việc dùng công cụ trí tuệ nhân tạo (AI). Sinh viên dùng trợ lý AI Claude (Anthropic) để hỗ trợ viết mã, viết kiểm thử, chụp ảnh giao diện và soạn thảo báo cáo. Sinh viên đã đọc, chạy và kiểm tra kết quả, quyết định phạm vi và nội dung, và chịu trách nhiệm về toàn bộ báo cáo và mã nguồn. Các số liệu trong báo cáo lấy từ các lần chạy kiểm thử và đo thực tế.
