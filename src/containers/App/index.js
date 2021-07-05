import React, { useState, useEffect } from "react";
import ReactGA from "react-ga";
import PropTypes from "prop-types";

import { withRouter } from "react-router-dom";

// Components
import UpdateAlert from "components/UpdateAlert";
import Router from "components/Router";
import { Header, Footer } from "components/Layout";

// eslint-disable-next-line prefer-const
export let serviceWorkerCallbacks = {
  onUpdate: function () {},
};

/**
 * App component, containing the page structure of every page.
 *
 * @param {...object} props Component properties
 * @param {object} props.history History object for Google Analytics tracking
 * @returns {React.Component} The app component
 */
const App = ({ history }) => {
  const [showUpdateAlert, setShowUpdateAlert] = useState(false);

  useEffect(() => {
    // Show app update modal
    serviceWorkerCallbacks.onUpdate = () => {
      setShowUpdateAlert(true);
    };

    history.listen(() => {
      // Google Analytics
      ReactGA.set({ page: window.location.pathname });
      ReactGA.pageview(window.location.pathname);
    });
  }, []);

  return (
    <div className="min-h-full relative">
      {showUpdateAlert && <UpdateAlert />}
      <Header title="Tax Calculator" />
      <Router />
      <Footer />
    </div>
  );
};

App.propTypes = {
  /** History object for Google Analytics to track user page views. */
  history: PropTypes.object.isRequired,
};

export default withRouter(App);
