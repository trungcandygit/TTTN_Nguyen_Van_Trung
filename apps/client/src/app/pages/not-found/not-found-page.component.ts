import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'page' },
  imports: [MatButtonModule, RouterModule],
  selector: 'gf-not-found-page',
  template: `
    <div class="container py-5 text-center">
      <h1 class="h3 mb-3">Không tìm thấy trang</h1>
      <p class="mb-4 text-muted">
        Đường dẫn bạn truy cập không tồn tại hoặc đã bị gỡ bỏ.
      </p>
      <a color="primary" mat-flat-button [routerLink]="['/']">Về trang chủ</a>
    </div>
  `
})
export class GfNotFoundPageComponent {}
