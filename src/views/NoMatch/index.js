import React from "react";

import { withRouter } from "react-router-dom";

// Components
import Error from "components/Error";

// Utilities
import { setPageTitle } from "utils/page";

/**
 * Display page for pages that can't be found.
 *
 * @returns {React.Component} The no match (404) component
 */
function NoMatch() {
  setPageTitle("Not Found");

  return (
    <main className="content-container">
      <div className="mt-20">
        <Error status={404} />
      </div>
    </main>
  );
}

export default withRouter(NoMatch);
