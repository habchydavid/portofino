/**
 * Prefixes a root-relative asset path with the site's base path.
 *
 * Next applies `basePath` to `<Link>` automatically, but **not** to the `src`
 * of `next/image` when images are unoptimized — which is the case for a static
 * export. Without this, every photograph 404s as soon as the site is served
 * from a sub-path (a GitHub Pages project site, a staging prefix).
 *
 * Use `components/SiteImage` rather than calling this directly; it is exported
 * for the handful of places that need a raw URL.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  return path.startsWith("/") ? `${basePath}${path}` : path;
}
