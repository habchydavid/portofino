"use client";

import { SiteImage } from "@/components/SiteImage";
import Link from "next/link";
import { useT } from "@/components/LocaleProvider";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

export function TerraceHighlight() {
  const t = useT();

  return (
    <section className="py-section">
      <div className="shell grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
        <Reveal className="order-2 lg:order-1">
          {/* TODO: replace with a wide photograph of the terrace at dusk. */}
          <SiteImage
            src="/images/terrace-dusk.svg"
            alt={t.home.terrace.alt}
            width={1800}
            height={1200}
            sizes="(min-width: 1024px) 55vw, 95vw"
            className="h-auto w-full object-cover"
          />
        </Reveal>

        <Reveal delay={120} className="order-1 lg:order-2">
          <SectionHeading
            eyebrow={t.home.terrace.eyebrow}
            title={t.home.terrace.title}
          />
          <div className="mt-6 space-y-5 text-lead text-ink-muted">
            {t.home.terrace.body.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>
          <Link href="/reservations/" className="btn btn-secondary mt-8">
            {t.home.terrace.cta}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
