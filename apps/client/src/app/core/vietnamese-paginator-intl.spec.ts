import { GfVietnamesePaginatorIntl } from './vietnamese-paginator-intl';

describe('GfVietnamesePaginatorIntl', () => {
  const intl = new GfVietnamesePaginatorIntl();

  it('translates the labels', () => {
    expect(intl.itemsPerPageLabel).toBe('Số dòng mỗi trang:');
    expect(intl.nextPageLabel).toBe('Trang sau');
    expect(intl.previousPageLabel).toBe('Trang trước');
    expect(intl.firstPageLabel).toBe('Trang đầu');
    expect(intl.lastPageLabel).toBe('Trang cuối');
  });

  it('formats the range label in Vietnamese', () => {
    expect(intl.getRangeLabel(0, 50, 759)).toBe('1 - 50 trên 759');
    expect(intl.getRangeLabel(15, 50, 759)).toBe('751 - 759 trên 759');
  });

  it('handles an empty list', () => {
    expect(intl.getRangeLabel(0, 50, 0)).toBe('0 trên 0');
  });
});
