"use client";

import Link from "next/link";
import { useT } from "@/components/LocaleProvider";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { site } from "@/content/site";
import { mapsDirectionsUrl } from "@/lib/maps";

export function LocationHours() {
  const t = useT();

  return (
    <section className="py-section">
      <div className="shell grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <Reveal>
          <SectionHeading
            eyebrow={t.home.location.eyebrow}
            title={t.home.location.title}
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={mapsDirectionsUrl()}
              target="_blank"
              rel="noreferrer noopener"
              className="btn btn-primary"
            >
              {t.common.directions}
            </a>
            <Link href="/contact/" className="btn btn-secondary">
              {t.home.location.cta}
            </Link>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <dl className="divide-y divide-brass/30 border-y border-brass/30">
            <Row label={t.home.location.addressLabel}>
              <address className="not-italic">
                {site.address.street}
                <br />
                {site.address.locality}, {site.address.region}
                <br />
                {site.address.countryName}
              </address>
            </Row>

            <Row label={t.home.location.hoursLabel}>{site.hours.label}</Row>

            <Row label={t.home.location.musicLabel}>{site.liveMusic.label}</Row>

            <Row label={t.home.location.phoneLabel}>
              <a
                href={`tel:${site.phoneE164}`}
                className="border-b border-terracotta-deep/40 text-terracotta-deep transition-opacity hover:opacity-75"
              >
                {site.phone}
              </a>
            </Row>
          </dl>
        </Reveal>
      </div>
    </section>
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
    <div className="grid gap-1 py-5 sm:grid-cols-[10rem_1fr] sm:gap-6">
      <dt className="eyebrow pt-1">{label}</dt>
      <dd className="text-lead leading-relaxed text-ink-muted">{children}</dd>
    </div>
  );
}
