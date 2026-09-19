"use client";

import { useT } from "@/components/LocaleProvider";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { site } from "@/content/site";
import { mapEmbedUrl, mapLinkUrl, mapsDirectionsUrl } from "@/lib/maps";

export function ContactPageContent() {
  const t = useT();

  return (
    <>
      <div className="shell pb-14 page-head">
        <SectionHeading
          as="h1"
          eyebrow={t.contact.eyebrow}
          title={t.contact.title}
          intro={t.contact.intro}
        />
      </div>

      <div className="shell grid gap-12 pb-section lg:grid-cols-[1fr_1.25fr] lg:gap-16">
        <Reveal>
          <dl className="divide-y divide-brass/30 border-y border-brass/30">
            <Row label={t.contact.addressLabel}>
              <address className="not-italic">
                {site.address.street}
                <br />
                {site.address.locality}, {site.address.region}
                <br />
                {site.address.countryName}
              </address>
              <a
                href={mapsDirectionsUrl()}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-3 inline-block border-b border-terracotta-deep/40 text-sm text-terracotta-deep transition-opacity hover:opacity-75"
              >
                {t.common.directions}
              </a>
            </Row>

            <Row label={t.contact.hoursLabel}>
              <p>{site.hours.label}</p>
              <p className="mt-2 text-base text-ink-muted">{site.liveMusic.label}</p>
            </Row>

            <Row label={t.contact.phoneLabel}>
              <a
                href={`tel:${site.phoneE164}`}
                className="border-b border-terracotta-deep/40 text-terracotta-deep transition-opacity hover:opacity-75"
              >
                {site.phone}
              </a>
            </Row>

            <Row label={t.contact.emailLabel}>
              <a
                href={`mailto:${site.email}`}
                className="break-words border-b border-terracotta-deep/40 text-terracotta-deep transition-opacity hover:opacity-75"
              >
                {site.email}
              </a>
            </Row>

            <Row label={t.contact.parkingLabel}>
              {/* TODO: replace with real parking guidance. */}
              <p className="text-base">{t.contact.parkingBody}</p>
            </Row>

            <Row label={t.contact.socialLabel}>
              <ul className="flex flex-wrap gap-x-5 gap-y-2 text-base">
                {site.social.map((channel) => (
                  <li key={channel.name}>
                    <a
                      href={channel.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="border-b border-terracotta-deep/40 text-terracotta-deep transition-opacity hover:opacity-75"
                    >
                      {channel.name}
                    </a>
                  </li>
                ))}
              </ul>
            </Row>
          </dl>
        </Reveal>

        <Reveal delay={120}>
          <div className="relative aspect-[4/3] w-full overflow-hidden border border-brass/40 bg-shell lg:aspect-auto lg:h-full lg:min-h-[32rem]">
            {/* Keyless embed — no API key, no billing account, no cookies set
                before the visitor interacts. See lib/maps.ts to swap it for
                the Google Maps Embed API. */}
            <iframe
              title={t.contact.mapTitle}
              src={mapEmbedUrl()}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
          <a
            href={mapLinkUrl()}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-3 inline-block text-sm text-ink-muted underline underline-offset-4 transition-colors hover:text-navy"
          >
            {t.contact.mapFallback}
          </a>
        </Reveal>
      </div>
    </>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1 py-5 sm:grid-cols-[9rem_1fr] sm:gap-6">
      <dt className="eyebrow pt-1.5">{label}</dt>
      <dd className="text-lead leading-relaxed text-ink-muted">{children}</dd>
    </div>
  );
}
