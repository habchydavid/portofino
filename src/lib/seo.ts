import type { Metadata } from "next";
import { absoluteUrl, site } from "@/content/site";

const DEFAULT_OG_IMAGE = "/images/og-default.png";

type PageMeta = {
  title: string;
  description: string;
  /** Path with a leading slash, e.g. "/menu". Use "/" for the home page. */
  path: string;
  /** Overrides the default social card. Path under /public. */
  image?: string;
  imageAlt?: string;
};

/**
 * Per-page metadata: title, description, canonical URL and Open Graph /
 * Twitter cards. `metadataBase` is set once in the root layout.
 */
export function pageMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  imageAlt = `${site.name} — ${site.tagline}`,
}: PageMeta): Metadata {
  const url = absoluteUrl(path);
  const isHome = path === "/";

  return {
    title: isHome ? `${site.name} — ${site.tagline}` : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: isHome ? `${site.name} — ${site.tagline}` : `${title} | ${site.name}`,
      description,
      url,
      locale: site.locale,
      images: [
        { url: absoluteUrl(image), width: 1200, height: 630, alt: imageAlt },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: isHome ? `${site.name} — ${site.tagline}` : `${title} | ${site.name}`,
      description,
      images: [absoluteUrl(image)],
    },
  };
}

/**
 * JSON-LD `Restaurant` node. Rendered once, in the root layout, so every page
 * carries it. Validate changes with the Rich Results Test — see README > SEO.
 */
export function restaurantJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": absoluteUrl("/#restaurant"),
    name: site.name,
    description: site.description,
    url: site.url,
    telephone: site.phoneE164,
    email: site.email,
    image: [absoluteUrl(DEFAULT_OG_IMAGE)],
    servesCuisine: [...site.cuisine],
    priceRange: site.priceRange,
    currenciesAccepted: site.currency,
    paymentAccepted: site.paymentAccepted.join(", "),
    acceptsReservations: absoluteUrl("/reservations/"),
    hasMenu: absoluteUrl("/menu/"),
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.geo.lat,
      longitude: site.geo.lng,
    },
    // Open 13:00 until 01:00 the following morning; schema.org reads a closing
    // time earlier than the opening time as crossing midnight.
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [...site.hours.days],
        opens: site.hours.opens,
        closes: site.hours.closes,
      },
    ],
    amenityFeature: [
      {
        "@type": "LocationFeatureSpecification",
        name: "Live music",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Beachfront terrace",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Outdoor seating",
        value: true,
      },
    ],
    sameAs: site.social.map((s) => s.url),
  };
}
