import type { Metadata } from "next";
import { ReservationsPageContent } from "@/components/reservations/ReservationsPage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Reservations",
  description:
    "Book a table at Portofino, on the beachfront in the Jounieh Old Souk. Send your request on WhatsApp in one tap, or call us — open every day from 1pm until 1am.",
  path: "/reservations/",
  image: "/images/og-default.png",
});

export default function ReservationsPage() {
  return <ReservationsPageContent />;
}
