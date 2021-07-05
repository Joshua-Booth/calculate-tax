Cypress.Commands.add("assertRoot", () => {
  cy.url().should("eq", `${Cypress.config().baseUrl}/`);
});

Cypress.Commands.add("assertPath", (path) => {
  cy.url().should("eq", `${Cypress.config().baseUrl}/${path}`);
});
