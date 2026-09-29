import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL ?? 'http://localhost:3333',
    defaultCommandTimeout: 15000,
    setupNodeEvents() {},
    specPattern: 'e2e/cypress/e2e/**/*.cy.ts',
    supportFile: 'e2e/cypress/support/e2e.ts',
    video: false,
    viewportHeight: 900,
    viewportWidth: 1280
  }
});
