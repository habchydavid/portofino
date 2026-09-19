import type { Metadata } from "next";
import { MenuBoard } from "@/components/menu/MenuBoard";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Menu",
  description:
    "Antipasti, handmade pasta, wood-fired pizza, the day's catch and dolci at Portofino — the beachfront Italian restaurant in the Jounieh Old Souk. Vegetarian and gluten-free dishes marked throughout.",
  path: "/menu/",
  image: "/images/og-default.png",
});

export default function MenuPage() {
  return <MenuBoard />;
}
