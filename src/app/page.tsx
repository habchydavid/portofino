import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { LiveMusic } from "@/components/home/LiveMusic";
import { LocationHours } from "@/components/home/LocationHours";
import { SignatureDishes } from "@/components/home/SignatureDishes";
import { Story } from "@/components/home/Story";
import { TerraceHighlight } from "@/components/home/TerraceHighlight";
import { Testimonials } from "@/components/home/Testimonials";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: site.name,
  description: site.description,
  path: "/",
  image: "/images/og-default.png",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <Story />
      <SignatureDishes />
      <TerraceHighlight />
      <LiveMusic />
      <Testimonials />
      <LocationHours />
    </>
  );
}
