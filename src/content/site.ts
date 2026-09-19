/**
 * Single source of truth for everything about the restaurant that appears in
 * more than one place: contact details, hours, map, social links, SEO defaults.
 *
 * Every value marked TODO is a placeholder — swap it for the real one before
 * launch. Nothing else in the codebase hard-codes these.
 */

export const site = {
  name: "Portofino",
  // Shown after the name in the <title> of every page.
  tagline: "Italian on the Jounieh shore",
  positioning:
    "Italian cooking, the open sea, and a terrace that runs straight onto the sand.",
  // Where the site is actually served from, including any sub-path. Used for
  // canonical URLs, Open Graph images, sitemap.xml and the JSON-LD @id.
  // The deploy sets NEXT_PUBLIC_SITE_URL; the fallback is the production
  // domain.
  // TODO: replace the fallback with the real production domain.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://portofino-jounieh.com",
  locale: "en_GB",

  description:
    "Portofino is a beachfront Italian restaurant in the Jounieh Old Souk, Lebanon. Handmade pasta, wood-fired pizza and the day's catch, served on the sand from 1pm until 1am, with live music every weekend.",

  // --- Contact -------------------------------------------------------------
  // TODO: replace with the restaurant's real phone number.
  phone: "+961 9 123 456",
  // Same number, digits only, country code first — used for tel: and wa.me links.
  phoneE164: "+9619123456",
  // TODO: replace with the number that receives WhatsApp reservations.
  // Digits only, no "+" — this is what wa.me expects.
  whatsapp: "9619123456",
  // TODO: replace with the real reservations inbox.
  email: "reservations@portofino-jounieh.com",

  // --- Address -------------------------------------------------------------
  address: {
    // TODO: replace with the exact street address.
    street: "Old Souk, Seafront",
    locality: "Jounieh",
    region: "Keserwan",
    // TODO: confirm the postal code.
    postalCode: "1200",
    country: "LB",
    countryName: "Lebanon",
  },
  // TODO: replace with the restaurant's exact pin. Used for JSON-LD geo and
  // the map embed on /contact.
  geo: { lat: 33.9808, lng: 35.6178 },

  // --- Hours ---------------------------------------------------------------
  // Open daily 1:00 PM – 1:00 AM. Closing past midnight is expressed as
  // "25:00" in schema.org terms; kept literal here and formatted where shown.
  hours: {
    label: "Every day, 1:00 PM – 1:00 AM",
    opens: "13:00",
    closes: "01:00",
    days: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
  },
  // TODO: confirm which nights the musicians actually play.
  liveMusic: {
    label: "Live music — Friday & Saturday, from 9:00 PM",
    days: ["Friday", "Saturday"],
  },

  priceRange: "$$$",
  cuisine: ["Italian", "Seafood", "Mediterranean"],
  // TODO: confirm accepted payment methods.
  paymentAccepted: ["Cash", "Credit Card"],
  currency: "USD",
  currencySymbol: "$",

  // --- Social --------------------------------------------------------------
  // TODO: replace each handle/URL, or delete the entry to drop it from the UI.
  social: [
    { name: "Instagram", url: "https://instagram.com/portofino.jounieh" },
    { name: "Facebook", url: "https://facebook.com/portofino.jounieh" },
    { name: "TripAdvisor", url: "https://tripadvisor.com" },
  ],
} as const;

/**
 * Absolute URL for a path on this site.
 *
 * `new URL("/menu/", base)` throws away a sub-path in `base`, which silently
 * breaks canonical URLs and the sitemap on GitHub Pages. Join instead.
 */
export function absoluteUrl(path: string): string {
  return `${site.url.replace(/\/$/, "")}${path}`;
}

/** `https://wa.me/<number>?text=…` with the message pre-filled and encoded. */
export function whatsappLink(message: string): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** Address on one line, for meta descriptions and the footer. */
export function addressLine(): string {
  const { street, locality, countryName } = site.address;
  return `${street}, ${locality}, ${countryName}`;
}
