import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/content/site";

// Required by `output: export` — both files are generated once, at build time.
export const dynamic = "force-static";

/** Emitted as /sitemap.xml at build time. Add new routes here. */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/menu/", priority: 0.9 },
    { path: "/reservations/", priority: 0.9 },
    { path: "/about/", priority: 0.7 },
    { path: "/gallery/", priority: 0.6 },
    { path: "/contact/", priority: 0.7 },
  ];

  const lastModified = new Date();

  return routes.map(({ path, priority }) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency: "monthly",
    priority,
  }));
}
