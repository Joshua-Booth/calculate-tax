import React from "react";

/**
 * Temporary display component used while the app is being built.
 *
 * @returns {React.Component} The coming soon component
 */
function ComingSoon() {
  return (
    <div className="mx-auto text-center my-36">
      <h3 className="text-5xl mb-10">Coming Soon...</h3>
      <p>This new web app is currently being built!</p>
      <p>
        Feel free to check out the progress on{" "}
        <a
          href="https://github.com/Joshua-Booth/calculate-tax"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
        .
      </p>
    </div>
  );
}

export default ComingSoon;
