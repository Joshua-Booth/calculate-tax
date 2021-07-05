import React from "react";
import PropTypes from "prop-types";

import { withRouter, NavLink } from "react-router-dom";

// Styles
import "./styles.scss";

/**
 * Header component containing the logo and links to important site pages.
 *
 * @param {...object} props Component properties
 * @param {string} props.title The title of the page
 * @example
 * return (
 *   <Header />
 * )
 * @returns {React.Component} The header component
 */
function Header({ title }) {
  return (
    <header className="relative p-0">
      <NavLink to="/" className="absolute top-0 mt-4 ml-6" aria-label="Home">
        <h1>{title}</h1>
      </NavLink>
    </header>
  );
}

Header.propTypes = {
  /** The title of the page */
  title: PropTypes.string.isRequired,
};

export default withRouter(Header);
