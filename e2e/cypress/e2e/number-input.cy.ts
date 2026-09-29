describe('Ô nhập số theo định dạng Việt Nam', () => {
  beforeEach(() => {
    cy.loginWithToken('demo-user-12');
  });

  it('tự thêm dấu chấm ngăn cách hàng nghìn khi nhập', () => {
    cy.visit('/vi/portfolio/activities/create');

    cy.get('input[formcontrolname=quantity]').type('1234567');
    cy.get('input[formcontrolname=quantity]').should('have.value', '1.234.567');

    cy.get('input[formcontrolname=unitPrice]').type('85000,5');
    cy.get('input[formcontrolname=unitPrice]').should('have.value', '85.000,5');
  });
});
