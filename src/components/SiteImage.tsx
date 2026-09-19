import Image, { type ImageProps } from "next/image";
import { asset } from "@/lib/asset";

/**
 * `next/image` with the site's base path applied to the source.
 *
 * Use this everywhere instead of importing `next/image` directly, so no call
 * site has to remember the prefix. Everything else about the component is
 * unchanged — `fill`, `sizes`, `priority` and the rest pass straight through.
 */
export function SiteImage({ src, alt, ...props }: ImageProps) {
  // `alt` is pulled out and passed explicitly rather than left in the spread:
  // it keeps jsx-a11y able to see it, so a missing alt is still a lint error
  // at every call site.
  return (
    <Image {...props} alt={alt} src={typeof src === "string" ? asset(src) : src} />
  );
}
