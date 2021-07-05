import React from "react";

// Components
import Policy from "./Policy";

// Styles
import "./styles.scss";

// Utilities
import { setPageTitle } from "utils/page";

/**
 * Component for the privacy policy page.
 *
 * @returns {React.Component} The privacy component
 */
function Privacy() {
  setPageTitle("Privacy Policy");

  return (
    <main className="privacy-policy mx-auto flex-wrap text-left">
      <Policy />
    </main>
  );
}

export default Privacy;
