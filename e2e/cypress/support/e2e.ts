/// <reference types="cypress" />

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /** Logs in with a security token (see docs/DEMO_ACCOUNTS.md). */
      loginWithToken(accessToken: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('loginWithToken', (accessToken: string) => {
  cy.request('POST', '/api/v1/auth/anonymous', { accessToken }).then(
    ({ body }) => {
      window.localStorage.setItem('auth-token', body.authToken);
      window.sessionStorage.setItem('auth-token', body.authToken);
    }
  );
});

export {};
