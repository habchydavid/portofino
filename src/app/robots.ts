import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/content/site";

// Required by `output: export` — both files are generated once, at build time.
export const dynamic = "force-static";

/** Emitted as /robots.txt at build time. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
