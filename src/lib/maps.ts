import { site } from "@/content/site";

const query = () =>
  encodeURIComponent(
    `${site.name}, ${site.address.street}, ${site.address.locality}, ${site.address.countryName}`,
  );

/** Opens directions in whichever maps app the visitor's device prefers. */
export function mapsDirectionsUrl(): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${query()}`;
}

/**
 * Keyless Google Maps embed, centred on the pin in site.ts.
 *
 * TODO (optional): swap for the Maps Embed API — `https://www.google.com/maps/
 * embed/v1/place?key=YOUR_KEY&q=…` — if you want a styled map or a verified
 * business pin. The keyless URL below needs no account and no billing.
 */
export function mapEmbedUrl(): string {
  const { lat, lng } = site.geo;
  const span = 0.01;
  const bbox = [lng - span, lat - span / 2, lng + span, lat + span / 2].join(",");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
}

/** Where the "open the map" fallback link points. */
export function mapLinkUrl(): string {
  return `https://www.google.com/maps/search/?api=1&query=${site.geo.lat},${site.geo.lng}`;
}
