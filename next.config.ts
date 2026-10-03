import type { NextConfig } from "next";

// A static site: `next build` writes plain HTML, CSS and JS to out/, which Netlify serves.
const nextConfig: NextConfig = {
  output: "export",
};

export default nextConfig;
