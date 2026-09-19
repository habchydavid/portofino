import type { Metadata } from "next";
import { ContactPageContent } from "@/components/contact/ContactPage";
import { addressLine, site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: `Portofino, ${addressLine()}. ${site.hours.label}. Phone ${site.phone} — directions, opening hours and social links.`,
  path: "/contact/",
  image: "/images/og-default.png",
});

export default function ContactPage() {
  return <ContactPageContent />;
}
