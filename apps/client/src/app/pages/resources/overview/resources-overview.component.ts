import { ChangeDetectionStrategy, Component } from '@angular/core';

interface GuideSection {
  id: string;
  title: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gf-resources-overview',
  styleUrls: ['./resources-overview.component.scss'],
  templateUrl: './resources-overview.component.html'
})
export class ResourcesOverviewComponent {
  protected readonly sections: GuideSection[] = [
    { id: 'bat-dau', title: '1. Tạo tài khoản và đăng nhập' },
    { id: 'thiet-lap', title: '2. Thiết lập ban đầu' },
    { id: 'tai-khoan', title: '3. Tạo tài khoản đầu tư' },
    { id: 'giao-dich', title: '4. Nhập giao dịch' },
    { id: 'tong-quan', title: '5. Đọc trang Tổng quan' },
    { id: 'phan-tich', title: '6. Phân tích và so sánh với benchmark' },
    { id: 'phan-bo', title: '7. Xem phân bổ' },
    { id: 'toi-uu-hoa', title: '8. Tối ưu hóa danh mục' },
    { id: 'black-litterman', title: '9. Mô hình Black-Litterman' },
    { id: 'fire', title: '10. Công cụ FIRE' },
    { id: 'x-ray', title: '11. X-ray' },
    { id: 'du-lieu', title: '12. Nhập và xuất dữ liệu' },
    { id: 'su-co', title: '13. Xử lý sự cố' },
    { id: 'thuat-ngu', title: '14. Thuật ngữ' }
  ];

  protected scrollTo(id: string) {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
