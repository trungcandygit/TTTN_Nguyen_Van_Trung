describe('Trang gốc', () => {
  it('đường dẫn /vi/ không bị 404 khi chưa đăng nhập', () => {
    cy.visit('/vi/');

    cy.contains('Không tìm thấy trang').should('not.exist');
    cy.contains('Đăng nhập').should('be.visible');
  });

  it('đường dẫn không tồn tại hiện trang 404', () => {
    cy.visit('/vi/khong-ton-tai');

    cy.contains('Không tìm thấy trang').should('be.visible');
  });
});
