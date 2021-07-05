import React from "react";

import { Switch, Route } from "react-router-dom";

// View Components
import Landing from "views/Landing";
import Privacy from "views/Privacy";
import NoMatch from "views/NoMatch";

/**
 * Container for app routes.
 *
 * @function
 * @returns {React.Component} The router component
 */
const Router = () => (
  <Switch>
    <Route exact path="/" component={Landing} />
    <Route path="/privacy" component={Privacy} />
    <Route component={NoMatch} />
  </Switch>
);

export default Router;
