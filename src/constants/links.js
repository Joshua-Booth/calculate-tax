/**
 * Action types for reducers.
 *
 * @file links.js
 * @module constants - Link objects
 * @author Joshua Booth
 * @see https://github.com/joshua-booth/creact
 */

// Constants
import { SUPPORT_EMAIL } from "constants/urls";

/** Link objects for the bottom navigation component. */
export const BOTTOM_LINKS = [];

/** Link objects for the more component. */
export const MORE_LINKS = [];

/** Link objects for the side navigation component. */
export const SIDE_LINKS = [];

/** Link objects for the footer component. */
export const FOOTER_LINKS = [
  { label: "Privacy Policy", type: "link", value: "/privacy" },
  { label: "Contact", type: "mail", value: SUPPORT_EMAIL },
];
