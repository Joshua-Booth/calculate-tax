import React from "react";
import { withRouter, NavLink } from "react-router-dom";

// Constants
import { SIDE_LINKS } from "constants/links";

// Styles
import "./styles.scss";

/**
 * Component for displaying the sidebar navigation for desktop users.
 *
 * @example
 * return (
 *   <SideNavigation />
 * )
 * @returns {React.Component} The sidebar navigation
 */
function SideNavigation() {
  const renderLinks = () => {
    return SIDE_LINKS.map((link, index) => {
      return (
        <li className="side-nav__link-item flex" key={index}>
          <NavLink
            to={`/${link.path}`}
            className="side-nav__link nav-link"
            activeClassName="active-link"
            aria-label={`${link.label}`}
          >
            {link.icon}
            <span className="side-nav__link-label">{link.label}</span>
          </NavLink>
        </li>
      );
    });
  };

  return (
    <nav className="side-nav flex items-center justify-between flex-wrap scroll-bar py-0 pl-1 pr-0">
      <ul className="side-nav__links flex flex-col mb-0 pl-0 no-bullet-style ml-4">
        {renderLinks()}
      </ul>
    </nav>
  );
}

export default withRouter(SideNavigation);
