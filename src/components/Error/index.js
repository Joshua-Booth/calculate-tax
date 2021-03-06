import React from "react";
import PropTypes from "prop-types";

// Assets
import { AngleLeftIcon, RedoAltIcon } from "assets/icons";

// Constants
import { SUPPORT_EMAIL } from "constants/urls";
import { HTTP_STATUS_CODES } from "constants/statusCodes";

/**
 * Render a full Error to the user.
 *
 * @param {object} error Error object and page title
 * @param {number} [error.status] Error status code
 * @param {object} error.response Error response object
 * @param {string} [error.title] Optional title to show above the error
 * @example
 * // JSX
 * <Error status={404} response={error.response} title={"Help"} />
 * @returns {React.Component} The error component
 */
function Error({ status, response, title }) {
  const goBack = () => window.history.back();
  const reload = () => window.location.reload(true);

  if (!status && !response) {
    return null;
  }

  let errorType,
    statusText = null;
  if (status >= 500) {
    errorType = "on our end";
  } else if (status >= 400) {
    errorType = "on your end";
  } else {
    errorType =
      `! The server received an unexpected status of '${status}'` +
      `and the message '${response.statusText}'`;
  }

  if (response && response.statusText) {
    statusText = response.statusText;
  } else {
    if (response && response.message && response.message.includes("Error")) {
      statusText = response.message;
    } else {
      statusText = "Error: " + HTTP_STATUS_CODES[status];
    }
  }

  return (
    <>
      {title && (
        <h1 className="pb-5 text-center" data-hj-allow>
          {title}
        </h1>
      )}
      <div title="Error" className="page-box" data-testid="error" data-hj-allow>
        <span className="text-6xl" data-testid="status-code">
          {status}
        </span>
        <h1 id="status-text" className="pb-1" data-testid="status-text">
          {statusText}
        </h1>
        <h2 className="pb-5" data-testid="error-type">
          Oops! Something went wrong{errorType ? " " + errorType : ""}.
        </h2>
        <div className="mx-auto">
          <p>
            If you believe this is a mistake, you can contact support&nbsp;
            &nbsp;via email&nbsp;
            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
          </p>
          <button
            className="text-current border-0 bg-white p-1 px-2"
            onClick={goBack}
            aria-label="Go Back"
          >
            <AngleLeftIcon className="la-2x" />
            <span style={{ verticalAlign: "super" }}>Back</span>
          </button>
          <button
            className="text-current border-0 bg-white p-1 pl-0 ml-5"
            onClick={reload}
            aria-label="Reload Page"
          >
            <RedoAltIcon className="la-2x mr-2" />
            <span style={{ verticalAlign: "super" }}>Reload</span>
          </button>
        </div>
      </div>
    </>
  );
}

/** @memberof Error */
Error.propTypes = {
  /** HTTP error status code. */
  status: PropTypes.number.isRequired,
  /** HTTP response object. */
  response: PropTypes.object.isRequired,
  /** Optional title of the page before the error. */
  title: PropTypes.string,
};

export default Error;
