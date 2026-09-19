import type { Metadata } from "next";
import { AboutStory } from "@/components/about/AboutStory";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "How Portofino started, who cooks, and why the terrace sits a step above the waterline in the Jounieh Old Souk.",
  path: "/about/",
  image: "/images/og-default.png",
});

export default function AboutPage() {
  return <AboutStory />;
}
