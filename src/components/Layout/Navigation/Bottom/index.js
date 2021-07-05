import React from "react";

import { withRouter, NavLink } from "react-router-dom";
import { FixedBottom } from "react-fixed-bottom";

// Constants
import { BOTTOM_LINKS } from "constants/links";

// Styles
import "./styles.scss";

// Utilities
import { isInStandaloneMode, isiOS } from "utils/device";

/**
 * Component for displaying the bottom mobile navigation.
 *
 * @example
 * return (
 *   <BottomNavigation />
 * )
 * @returns {React.Component} The bottom navigation component
 */
function BottomBar() {
  const renderNavigation = () => (
    <nav className="bottom-nav flex flex-wrap items-center justify-between p-2">
      {renderLinks()}
    </nav>
  );

  const renderLinks = () => {
    return BOTTOM_LINKS.map((link, index) => {
      return (
        <NavLink
          exact
          to={`/${link.path}`}
          key={index}
          className={`bottom-nav__link nav-link ${
            BOTTOM_LINKS.length < 3 ? "mx-auto" : ""
          }`}
          activeClassName="active-link"
          aria-label={`${link.label}`}
        >
          {link.icon}
          <span className="bottom-nav__link-label">{link.label}</span>
        </NavLink>
      );
    });
  };

  return (
    <>
      {isiOS() && !isInStandaloneMode() ? (
        <FixedBottom offset={0}>{renderNavigation()}</FixedBottom>
      ) : (
        renderNavigation()
      )}
    </>
  );
}

export default withRouter(BottomBar);
