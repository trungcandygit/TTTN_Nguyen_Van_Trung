import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable()
export class GfVietnamesePaginatorIntl extends MatPaginatorIntl {
  public override firstPageLabel = 'Trang đầu';
  public override itemsPerPageLabel = 'Số dòng mỗi trang:';
  public override lastPageLabel = 'Trang cuối';
  public override nextPageLabel = 'Trang sau';
  public override previousPageLabel = 'Trang trước';

  public override getRangeLabel = (
    page: number,
    pageSize: number,
    length: number
  ) => {
    if (length === 0 || pageSize === 0) {
      return `0 trên ${length}`;
    }

    const startIndex = page * pageSize;
    const endIndex = Math.min(startIndex + pageSize, length);

    return `${startIndex + 1} - ${endIndex} trên ${length}`;
  };
}
