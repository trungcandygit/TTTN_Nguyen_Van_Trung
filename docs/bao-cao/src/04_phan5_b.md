@H2 5.3. Phân tích và thiết kế hệ thống

@H3 5.3.1. Yêu cầu

Sinh viên xác định yêu cầu theo cấu trúc của ISO/IEC/IEEE 29148, gộp thành yêu cầu chức năng và phi chức năng. Bảng 5.2 liệt kê các yêu cầu chức năng (mã FR) của phần sinh viên bổ sung, và Bảng 5.3 liệt kê yêu cầu phi chức năng (mã NFR). Yêu cầu chức năng của phần mềm gốc (tài khoản, giao dịch, hiệu suất) được giữ nguyên và không nêu lại.

@TABLE Bảng 5.2. Yêu cầu chức năng của phần bổ sung
| Mã | Yêu cầu | Mức ưu tiên |
| FR1 | Giao diện tiếng Việt mặc định, đường dẫn gốc chuyển về trang giới thiệu hoặc trang Tổng quan | Cao |
| FR2 | VND là tiền tệ mặc định cho người dùng mới, số hiển thị theo vi-VN | Cao |
| FR3 | Ô nhập tiền, số lượng, phí, số dư tự thêm dấu chấm ngăn cách khi gõ | Cao |
| FR4 | Người dùng chọn 2 đến 20 tài sản: khoản đang giữ hoặc mã thêm có giá lịch sử | Cao |
| FR5 | Sáu phương pháp: Sharpe tối đa, phương sai tối thiểu, trung bình-phương sai, CVaR tối thiểu, Black-Litterman, cân bằng rủi ro | Cao |
| FR6 | Tham số: tỷ trọng tối đa, khoảng dữ liệu lịch sử, lãi suất phi rủi ro, mức tin cậy CVaR, hệ số ngại rủi ro, τ | Cao |
| FR7 | Nhập tối đa 10 quan điểm tuyệt đối hoặc tương đối, mỗi quan điểm có độ tin cậy 5% đến 95% | Cao |
| FR8 | Kết quả gồm tỷ trọng hiện tại so với đề xuất, bảng so sánh sáu danh mục chuẩn, đường biên hiệu quả | Cao |
| FR9 | Kiểm tra ngược walk-forward với cửa sổ ước lượng và tần suất cân bằng lại do người dùng chọn | Trung bình |
| FR10 | Giá của tài sản khác tiền tệ được quy đổi về tiền tệ cơ sở theo tỷ giá từng ngày | Trung bình |
| FR11 | Bốn chỉ số tham chiếu mô phỏng làm benchmark thị trường | Trung bình |
| FR12 | Bộ dữ liệu demo tái lập được với 1 quản trị viên và 15 người dùng | Trung bình |

Yêu cầu phi chức năng dựa trên các đặc tính chất lượng của mô hình ISO/IEC 25010 [9]: hiệu năng, độ tin cậy, khả năng bảo trì, bảo mật và khả năng sử dụng.

@TABLE Bảng 5.3. Yêu cầu phi chức năng
| Mã | Yêu cầu | Cách kiểm chứng |
| NFR1 | Hiệu năng: một lần tối ưu hóa kèm backtest dưới 5 giây với tối đa 20 tài sản | Đo thời gian trên dữ liệu demo (Mục 5.5.3) |
| NFR2 | Đúng đắn: tỷ trọng không âm, tổng bằng 1, không vượt trần | Kiểm thử đơn vị theo tính chất |
| NFR3 | Khả năng bảo trì: mô-đun tối ưu tách khỏi lớp truy cập dữ liệu | Hàm thuần trong `optimizer.math.ts` và `optimizer.engine.ts` |
| NFR4 | Tính tái lập: cùng dữ liệu và tham số cho cùng kết quả | Hạt giống cố định, không dùng số ngẫu nhiên khi tối ưu |
| NFR5 | Bảo mật và quyền riêng tư: không gửi mã đăng nhập cho bên thứ ba | Kiểm thử trang Giới thiệu không gọi API ngoài |
| NFR6 | Khả năng dùng: ứng dụng dùng được trên màn hình 375 px | Ảnh chụp điện thoại ở Mục 5.6 |
| NFR7 | Dung lượng: bản dựng giao diện dưới 20 MB | Đo thư mục `dist/apps/client` |

@H3 5.3.2. Kiến trúc tổng quan

Hệ thống gồm bốn thành phần chạy độc lập (Hình 5.1). Trình duyệt tải giao diện Angular và gọi máy chủ qua giao thức truyền siêu văn bản (HTTP) theo kiểu REST (Representational State Transfer) ở đường dẫn `/api/v1`. Máy chủ NestJS xử lý nghiệp vụ, đọc và ghi PostgreSQL qua Prisma, và dùng Redis làm bộ nhớ đệm và hàng đợi tác vụ nền. Trong máy chủ, hai dịch vụ của sinh viên nằm cạnh các dịch vụ gốc: `BlackLittermanService` cho khối trên trang Phân bổ và `OptimizerService` cho trang Tối ưu hóa. Cả hai đọc khoản nắm giữ từ `PortfolioService`, giá từ `MarketDataService` và tỷ giá từ `ExchangeRateDataService`.

@FIG hinh/kien-truc.png | Hình 5.1. Kiến trúc hệ thống BL Advisor. Mũi tên liền là yêu cầu hoặc lời gọi, mũi tên đứt là phản hồi. HTTP: giao thức truyền siêu văn bản; JWT: mã thông báo JSON Web Token; Prisma: lớp truy cập cơ sở dữ liệu.

@TABLE Bảng 5.4. Công nghệ sử dụng
| Lớp | Công nghệ | Vai trò |
| Kho mã | Nx 23 | Quản lý ba dự án `api`, `client` và các thư viện dùng chung |
| Giao diện | Angular 22, Angular Material, Chart.js | Trang web, biểu đồ |
| Máy chủ | NestJS 11, TypeScript 6 | API, nghiệp vụ, tối ưu hóa |
| Cơ sở dữ liệu | PostgreSQL 16, Prisma 7 | Lưu người dùng, tài khoản, giao dịch, giá |
| Bộ nhớ đệm | Redis | Đệm kết quả, hàng đợi tác vụ nền |
| Kiểm thử | Jest, Playwright (kiểm thử độc lập), Cypress (kịch bản) | Đơn vị, giao diện, đầu cuối |
| Môi trường chạy | Node.js 22 | Chạy máy chủ và công cụ dựng |

Sinh viên chọn giữ nguyên bộ công nghệ của Ghostfolio thay vì viết lại bằng ngôn ngữ khác. Lý do là chi phí: một máy chủ duy nhất bằng TypeScript cho phép dùng chung kiểu dữ liệu giữa giao diện và máy chủ qua thư viện `libs/common`, và tránh chạy thêm một dịch vụ Python riêng chỉ để tính toán. Cái giá phải trả là bộ giải tự viết (Mục 5.4.2, 5.7).

@H3 5.3.3. Thiết kế dữ liệu

Bản thiết kế dữ liệu dùng lược đồ Prisma của Ghostfolio và không thêm bảng mới. Sinh viên chỉ dùng thêm các bản ghi có sẵn theo cách mới. Hồ sơ tài sản (SymbolProfile) lưu tên, tiền tệ, nguồn dữ liệu và ký hiệu. Giá lịch sử (MarketData) lưu giá theo ngày. Giao dịch (Order, hiển thị là Activity) nối người dùng, tài khoản và hồ sơ tài sản. Danh sách benchmark thị trường nằm trong bảng thuộc tính Property với khóa `BENCHMARKS`, là một chuỗi JSON (JavaScript Object Notation) chứa mã các hồ sơ được chọn.

@FIG hinh/du-lieu.png | Hình 5.2. Các thực thể dữ liệu dự án sử dụng. Mũi tên chỉ hướng tham chiếu, 1..n và n..1 là bản số của quan hệ; UUID: mã định danh duy nhất toàn cầu.

Một ràng buộc của phần mềm gốc ảnh hưởng đến thiết kế dữ liệu demo: giao dịch chỉ nối được với hồ sơ tài sản nhập tay khi ký hiệu là mã định danh duy nhất toàn cầu (UUID). Vì vậy tập lệnh nạp dữ liệu sinh ký hiệu UUID xác định theo băm MD5 của tên mã, và giữ tên gọi dễ đọc ở trường tên của hồ sơ.

@H3 5.3.4. Thiết kế giao diện lập trình

Trang Tối ưu hóa dùng một endpoint mới, và trang Phân bổ dùng một endpoint đã có (Bảng 5.5). Endpoint POST nhận thân yêu cầu gồm danh sách tài sản, phương pháp và tham số; một lớp kiểm tra dữ liệu vào (class-validator) từ chối yêu cầu sai kiểu hoặc ngoài khoảng cho phép trước khi tính toán.

@TABLE Bảng 5.5. Các endpoint của phần bổ sung
| Phương thức và đường dẫn | Mục đích | Quyền |
| GET /api/v1/portfolio/allocations/black-litterman | Tỷ trọng Black-Litterman không quan điểm cho khoản nắm giữ hiện tại | Người dùng đã đăng nhập, phạm vi đọc danh mục |
| POST /api/v1/portfolio/optimizer | Tối ưu hóa theo phương pháp đã chọn, kèm so sánh, đường biên, backtest | Người dùng đã đăng nhập, phạm vi đọc danh mục |
| GET /api/v1/benchmarks | Danh sách benchmark thị trường và xu hướng 50, 200 ngày | Người dùng đã đăng nhập |

@H3 5.3.5. Thiết kế luồng xử lý tối ưu hóa

Hình 5.3 mô tả luồng xử lý một yêu cầu. Máy chủ kiểm tra yêu cầu, lấy hồ sơ tài sản và khoản nắm giữ, đọc giá lịch sử, quy đổi giá về tiền tệ cơ sở, căn chỉnh chuỗi giá theo ngày, tính lợi suất, rồi chạy phương pháp đã chọn cùng ba phương pháp tham chiếu và các danh mục chuẩn. Nếu người dùng bật kiểm tra ngược, máy chủ chạy thêm vòng walk-forward. Cuối cùng máy chủ ghép kết quả và trả về một phản hồi.

@FIG hinh/luong-xu-ly.png | Hình 5.3. Luồng xử lý một yêu cầu tối ưu hóa, đọc từ trái sang phải ở hàng đầu rồi quay lại ở hàng sau. Ô vàng là bước tính toán; DTO: đối tượng truyền dữ liệu.

@H3 5.3.6. Bảo mật và quyền riêng tư

Hệ thống không dùng mật khẩu. Khi tạo tài khoản, máy chủ sinh một mã bảo mật, băm bằng HMAC-SHA512 với một chuỗi muối bí mật và chỉ lưu giá trị băm. Khi đăng nhập, máy chủ băm mã người dùng nhập, đối chiếu với cơ sở dữ liệu rồi phát một JSON Web Token (JWT) có thời hạn. Mọi endpoint mới kiểm tra token và phạm vi quyền. Trang Giới thiệu trước đây gọi một dịch vụ ngoài để lấy danh sách công bố. Sinh viên thay bằng danh sách cố định trong mã nguồn, vì gọi dịch vụ bên thứ ba làm tăng bề mặt rủi ro mà không cần thiết. Dữ liệu demo hoàn toàn mô phỏng và không chứa thông tin cá nhân, phù hợp yêu cầu của Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân [19]. Các mã đăng nhập demo chỉ dùng trong môi trường phát triển.

@H2 5.4. Cài đặt

@H3 5.4.1. Cấu trúc mã nguồn

Kho mã có khoảng 900 tệp TypeScript ngoài thư mục công cụ. Phần của sinh viên gồm các tệp sau, Bảng 5.6 liệt kê vai trò từng tệp.

@TABLE Bảng 5.6. Các tệp chính của phần bổ sung
| Tệp | Vai trò |
| apps/api/src/app/portfolio/black-litterman.service.ts | Phép toán ma trận và mô hình Black-Litterman gốc, dịch vụ đọc danh mục |
| apps/api/src/app/portfolio/optimizer/optimizer.math.ts | Thuật toán tối ưu: chiếu, Markowitz, CVaR, cân bằng rủi ro, chỉ số |
| apps/api/src/app/portfolio/optimizer/optimizer.engine.ts | Căn chỉnh giá, dựng quan điểm, chọn phương pháp, backtest |
| apps/api/src/app/portfolio/optimizer/optimizer.service.ts | Đọc giá và tỷ giá, dựng phản hồi |
| apps/api/src/app/portfolio/optimizer/optimize-portfolio.dto.ts | Kiểm tra dữ liệu vào |
| apps/client/src/app/pages/portfolio/optimizer | Trang tối ưu hóa: thành phần, hàm hỗ trợ, kiểm thử |
| libs/ui/src/lib/number-input | Directive nhập số theo quy ước Việt Nam |
| libs/common/src/lib/number-input.helper.ts | Hàm đọc và định dạng số |
| prisma/seed-demo.mts | Sinh dữ liệu demo và benchmark mô phỏng |

@H3 5.4.2. Thuật toán tối ưu hóa

Toàn bộ thuật toán viết bằng TypeScript thuần và dùng ma trận là mảng hai chiều, vì số tài sản nhỏ (tối đa 20). Sáu thành phần chính như sau.

Chiếu lên tập tỷ trọng có trần. Mọi phương pháp cần chiếu một vectơ v lên tập {w : Σw_i = 1, 0 ≤ w_i ≤ c}. Hàm `projectToCappedSimplex` tìm ngưỡng τ sao cho tổng các phần tử cắt min(c, max(0, v_i − τ)) bằng 1, bằng cách chia đôi 200 lần. Nếu trần c nhỏ hơn 1/n thì bài toán vô nghiệm, hàm nâng trần lên 1/n và hệ thống cảnh báo người dùng.

Bài toán bậc hai. Phương sai tối thiểu, trung bình-phương sai và mọi bước của đường biên đều có dạng cực tiểu hóa (1/2)x'Ax − b'x trên tập trên. Hàm `minimizeQuadratic` dùng gradient chiếu gia tốc kiểu Nesterov với bước 1/λ_max(A), trong đó λ_max tính bằng phép lặp lũy thừa, tối đa 5.000 vòng, dừng khi thay đổi lớn nhất nhỏ hơn 10⁻¹³.

Sharpe tối đa. Tỷ số Sharpe dọc theo đường biên có một đỉnh theo hệ số ngại rủi ro δ. Hàm `maximizeSharpe` tìm kiếm tỷ lệ vàng trên log₁₀δ trong khoảng [−3, 6] với 40 vòng, mỗi vòng giải bài toán trung bình-phương sai. Nếu không tài sản nào có lợi suất vượt r_f, hàm trả danh mục phương sai tối thiểu.

CVaR tối thiểu. Hàm `minimizeCVaR` dùng phương pháp dưới gradient chiếu trên các kịch bản lịch sử. Mỗi vòng, hàm chọn k kịch bản tệ nhất, tính dưới gradient là trung bình của các dòng lợi suất tương ứng, đi một bước chuẩn hóa 0,05/√(vòng + 1), rồi chiếu. Hàm chạy 2.000 vòng, khởi tạo từ tốt hơn trong hai danh mục (chia đều và phương sai tối thiểu) và giữ nghiệm có CVaR thấp nhất, nên kết quả không bao giờ kém điểm xuất phát.

Cân bằng rủi ro. Hàm `riskParityWeights` dùng giảm tọa độ tuần hoàn (cyclical coordinate descent) do Griveau-Billion và cộng sự đề xuất. Với mỗi tài sản i, hàm cập nhật tỷ trọng theo công thức (8), trong đó q = 1/n là ngân sách rủi ro của mỗi tài sản.

@EQ w_i \leftarrow \frac{-b_i + \sqrt{b_i^{2} + 4\,a_i\,q}}{2\,a_i},\qquad a_i = \Sigma_{ii},\quad b_i = \sum_{j\neq i}\Sigma_{ij}\,w_j | (8)

Hàm lặp tối đa 1.000 lượt và chuẩn hóa tổng về 1. Bản cài hiện tại chưa áp trần tỷ trọng (Mục 5.7).

Black-Litterman có độ tin cậy. Với quan điểm k có dòng p_k của ma trận chọn và độ tin cậy c_k, độ bất định của quan điểm là:

@EQ \Omega_{kk} = \tau\, p_k^{\top}\Sigma\, p_k\;\frac{1-c_k}{c_k} | (9)

Cách gắn độ tin cậy này theo Idzorek [10]. Khi c_k = 0,5, công thức (9) trả về mặc định của He và Litterman [3]. Hệ số ngại rủi ro δ lấy từ (E[R_m] − r_f)/Var(R_m) của danh mục hiện tại, giới hạn trong khoảng [1, 10], và dùng 2,5 khi giá trị này không dương. Sau khi có E[R] và M⁻¹ từ công thức (6), hàm không dùng công thức không ràng buộc (7) mà giải bài toán trung bình-phương sai không âm có trần với ma trận hiệp phương sai Σ + M⁻¹ và lợi suất E[R]. Lựa chọn này tránh tỷ trọng âm và tỷ trọng vượt trần, vốn là hạn chế của công thức (7).

@H3 5.4.3. Chuẩn bị dữ liệu và kiểm tra ngược

Hàm `alignPrices` gom các chuỗi giá theo hợp các ngày, điền giá gần nhất vào ngày thiếu và bắt đầu từ ngày đầu tiên mọi tài sản đều có giá, nên không nhìn trước dữ liệu tương lai. Giá của tài sản khác tiền tệ cơ sở được nhân với tỷ giá của đúng ngày trước khi căn chỉnh. Lợi suất là lợi suất đơn hằng ngày, còn μ và Σ tính hằng năm bằng cách nhân 252 ngày giao dịch. Cần ít nhất 60 quan sát chung, hệ thống cảnh báo khi dưới 250 quan sát.

Hàm `runBacktest` chia phần dữ liệu ngoài mẫu thành các kỳ. Tại đầu mỗi kỳ, hàm ước lượng tỷ trọng từ cửa sổ `lookback` ngày ngay trước đó (mặc định 252), giữ danh mục và để tỷ trọng trôi theo giá đến kỳ sau. Tần suất là 21, 63 hoặc 252 ngày, và hàm nâng bước để số lần cân bằng lại không quá 30. Ba chiến lược cùng chạy trên các mốc này: phương pháp đã chọn, chia đều và giữ tỷ trọng hiện tại. Đường giá trị bắt đầu từ 100.

@H3 5.4.4. Giao diện Angular

Trang tối ưu hóa là một thành phần Angular độc lập gồm bốn khối: chọn tài sản, chọn phương pháp và tham số, nhập quan điểm, kiểm tra ngược. Khối chọn tài sản lấy khoản nắm giữ qua `fetchPortfolioHoldings` và chọn sẵn tám khoản có tỷ trọng lớn nhất. Ô tìm mã dùng `fetchSymbols` với độ trễ 300 ms. Ba biểu đồ (cột tỷ trọng, đường biên, đường backtest) vẽ bằng Chart.js. Số hiển thị qua `Intl.NumberFormat` theo vùng ngôn ngữ của người dùng. Hàm hỗ trợ `buildOptimizerRequest` đổi đơn vị phần trăm trên biểu mẫu sang phân số cho máy chủ và bỏ quan điểm không hợp lệ.

@H3 5.4.5. Việt hóa và ô nhập số

Bản dựng chỉ giữ ngôn ngữ `vi`, và hằng số `SUPPORTED_LANGUAGE_CODES` giảm xuống còn `['vi']`. Vùng ngôn ngữ mặc định là vi-VN. Với ô nhập số, dự án dùng một directive `gfNumberInput` theo giao diện ControlValueAccessor, dùng được với cả biểu mẫu phản ứng và `ngModel`. Khi người dùng gõ, directive gọi `formatTypedNumber` để nhóm chữ số bằng dấu chấm, giữ dấu phẩy thập phân và ghi giá trị số vào mô hình. Để con trỏ không nhảy khi định dạng lại, directive đếm số chữ số và dấu phẩy nằm trước con trỏ, rồi đặt con trỏ về đúng vị trí đó trong chuỗi mới.

@H3 5.4.6. Dữ liệu demo và benchmark mô phỏng

Tập lệnh `seed-demo.mts` sinh giá bằng mô hình chuyển động Brown hình học có một nhân tố theo nhóm tài sản và một nhân tố toàn cầu. Với tài sản i thuộc nhóm g, lợi suất log ở bước thời gian Δt là:

@EQ \ln\frac{S_{t+\Delta t}}{S_t} = \left(\mu_i - \frac{\sigma_i^{2}}{2}\right)\Delta t + \sigma_i\sqrt{\Delta t}\,\Bigl(\beta\, f_g + \beta_0\, f_0 + \sqrt{1-\beta^{2}-\beta_0^{2}}\;\varepsilon_i\Bigr) | (10)

Trong công thức (10), S là giá, μ_i và σ_i là lợi suất và độ biến động hằng năm đặt cho tài sản, f_g là nhân tố của nhóm, f_0 là nhân tố toàn cầu, ε_i là nhiễu riêng, β bằng 0,6 (0,7 với tiền mã hóa) và β_0 bằng 0,2. Các nhân tố và nhiễu là số chuẩn tắc độc lập. Hạt giống cố định làm cho mọi lần nạp cho cùng dữ liệu. Có sáu nhóm tài sản: cổ phiếu Việt Nam, cổ phiếu Mỹ, tiền mã hóa, vàng, trái phiếu và chỉ số. Tiền mã hóa có giá cả cuối tuần, các nhóm khác chỉ có ngày làm việc.

Bảng 5.7 cho thấy quy mô dữ liệu. Bốn chỉ số tham chiếu (VN-Index, VN30, S&P 500, Bitcoin USD) được gán giá cho mọi ngày trong lịch, kể cả cuối tuần, vì phần mềm gốc tính xu hướng 200 ngày trên 400 điểm giá gần nhất và cần đủ điểm.

@TABLE Bảng 5.7. Quy mô dữ liệu demo
| Đại lượng | Giá trị |
| Tài khoản | 16 (1 quản trị viên, 15 người dùng) |
| Giao dịch | 4.519 (BUY, SELL, DIVIDEND, FEE, INTEREST, LIABILITY) |
| Hồ sơ tài sản | 26 (22 tài sản giao dịch, 4 chỉ số tham chiếu) |
| Dòng giá lịch sử | 45.203 |
| Giai đoạn | từ năm 2021 đến ngày chạy lệnh |

@H3 5.4.7. Dựng và triển khai

Bản dựng giao diện chỉ biên dịch ngôn ngữ `vi`. Kích thước thư mục `dist/apps/client` giảm từ 262 MB xuống 17 MB, và thời gian dựng còn khoảng 25 giây. Máy chủ chạy ở cổng 3333 và phục vụ luôn phần giao diện đã dựng. Khi phát triển, giao diện chạy ở cổng 4200 và chuyển tiếp yêu cầu API về cổng 3333. Kho mã có sẵn tệp Docker Compose cho cả ba dịch vụ. Với môi trường công khai, sinh viên khuyến nghị máy chủ ảo 2 GB bộ nhớ, đặt hai chuỗi bí mật ngẫu nhiên (`ACCESS_TOKEN_SALT`, `JWT_SECRET_KEY`) và không nạp dữ liệu demo.
