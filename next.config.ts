import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

/**
 * Sub-path the site is served from, without a trailing slash.
 *
 * Empty for a normal domain (`portofino.com`). A GitHub Pages *project* site
 * lives under the repository name, so the Pages workflow sets this to
 * `/portofino`. Next then prefixes every internal link and asset for us.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Static export: `next build` emits a fully static site into ./out.
  // Deployable to GitHub Pages, Vercel, Netlify or any static host.
  output: "export",
  // The export target has no image optimisation server, so next/image runs
  // unoptimized. Ship correctly sized assets (see README > Images).
  images: { unoptimized: true },
  // Every route is exported as <route>/index.html, so links keep their slash.
  trailingSlash: true,
  basePath,
  outputFileTracingRoot: dirname(fileURLToPath(import.meta.url)),
};

export default nextConfig;
