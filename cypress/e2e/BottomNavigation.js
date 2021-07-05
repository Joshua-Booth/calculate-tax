context("BottomNavigation", () => {
  it("does not display", () => {
    cy.visit("/").viewport("iphone-x");

    cy.get(".bottom-nav").should("not.exist");
  });
});
