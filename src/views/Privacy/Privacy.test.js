import React from "react";
import { axe } from "jest-axe";

// Utilities
import { renderWithProviderRouter as render, testTitle } from "tests/utils";

// Component
import Privacy from ".";

test("should render privacy policy", () => {
  render(<Privacy />);

  const container = document.querySelector(".privacy-policy");

  expect(container).toBeInTheDocument();
});

testTitle(<Privacy />, "Privacy Policy");

test("should have no accessibility violations", async () => {
  render(<Privacy />);

  const results = await axe(document.body);

  expect(results).toHaveNoViolations();
});
