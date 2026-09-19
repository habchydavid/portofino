import type { Metadata } from "next";
import { GalleryPageContent } from "@/components/gallery/GalleryPage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Gallery",
  description:
    "The dining room, the beachfront terrace, the wood oven and the plates — photographs of Portofino in the Jounieh Old Souk.",
  path: "/gallery/",
  image: "/images/og-default.png",
});

export default function GalleryPage() {
  return <GalleryPageContent />;
}
