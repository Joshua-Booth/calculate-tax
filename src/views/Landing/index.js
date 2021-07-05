import React from "react";

// Components
import ComingSoon from "./ComingSoon";

// Utilities
import { setPageTitle } from "utils/page";

/**
 * Landing page component.
 *
 * @returns {React.Component} The landing component
 */
function Landing() {
  setPageTitle();

  return (
    <main className="container mx-auto h-full">
      <section className="mx-6">
        <h2 className="subtitle ml-2 md:text-center">Enter your details</h2>
        <ComingSoon />
      </section>
    </main>
  );
}

export default Landing;
