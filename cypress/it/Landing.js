context("Landing", () => {
  it("contains title", () => {
    cy.visit("/");

    cy.contains(/tax calculator/i).should("exist");
  });
});
