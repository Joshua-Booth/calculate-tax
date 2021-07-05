/**
 * Action types for reducers.
 *
 * @file urls.js
 * @module constants - URLs
 * @author Joshua Booth
 * @see https://github.com/joshua-booth/creact
 */

/** API ROOT URL. */
export const ROOT_URL = process.env.REACT_APP_ROOT_URL;

/**
 * Application related URLs.
 *
 * @type {object}
 * @property {string} PRIVACY_POLICY Privacy policy URL
 * @property {string} TERMS_OF_USE Terms of Use policy URL
 */
export const AppUrls = {
  PRIVACY_POLICY: `${ROOT_URL}/app/privacy_policy/`,
  TERMS_OF_USE: `${ROOT_URL}/app/terms_of_use/`,
};

/** Site support email address. */
export const SUPPORT_EMAIL = "contact@joshuabooth.nz";

/**
 * Social media URLs.
 *
 * @type {object}
 * @property {string} FACEBOOK Facebook URL
 * @property {string} TWITTER Twitter URL
 * @property {string} INSTAGRAM Instagram URL
 */
export const SocialUrls = {
  FACEBOOK: "https://www.facebook.com/",
  TWITTER: "https://twitter.com/",
  INSTAGRAM: "https://www.instagram.com/",
};
