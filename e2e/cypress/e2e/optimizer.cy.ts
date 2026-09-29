describe('Trang tối ưu hóa danh mục', () => {
  beforeEach(() => {
    cy.loginWithToken('demo-user-12');
  });

  it('hiển thị phân bổ đề xuất, đường biên và backtest', () => {
    cy.visit('/vi/portfolio/optimizer');
    cy.contains('h2', 'Tối ưu hóa danh mục').should('be.visible');

    cy.contains('button', 'Tối ưu hóa danh mục').click();

    cy.get('.results', { timeout: 60000 }).should('be.visible');
    cy.contains('h4', 'Phân bổ đề xuất').should('be.visible');
    cy.contains('h4', 'Đường biên hiệu quả').should('be.visible');
    cy.contains('h4', 'Kết quả backtest').should('be.visible');
    cy.get('.results canvas').should('have.length.at.least', 3);
  });

  it('báo lỗi khi chọn ít hơn 2 tài sản', () => {
    cy.visit('/vi/portfolio/optimizer');
    cy.get('.asset-chip input:checked').each(($input, index) => {
      if (index > 0) {
        cy.wrap($input).uncheck({ force: true });
      }
    });

    cy.contains('button', 'Tối ưu hóa danh mục').click();

    cy.contains('Hãy chọn ít nhất 2 tài sản').should('be.visible');
  });

  it('cho nhập quan điểm với phương pháp Black-Litterman', () => {
    cy.visit('/vi/portfolio/optimizer');
    cy.get('mat-select[name=method]').click();
    cy.contains('mat-option', 'Black-Litterman').click();
    cy.contains('button', '+ Thêm quan điểm').click();
    cy.contains('button', 'Tối ưu hóa danh mục').click();

    cy.get('.results', { timeout: 60000 }).should('be.visible');
    cy.contains('h4', 'Lợi suất kỳ vọng Black-Litterman').should('be.visible');
  });
});
