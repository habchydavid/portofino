"use client";

import { SiteImage } from "@/components/SiteImage";
import Link from "next/link";
import { useT } from "@/components/LocaleProvider";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

export function Story() {
  const t = useT();

  return (
    <section className="py-section">
      <div className="shell grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <SectionHeading eyebrow={t.home.story.eyebrow} title={t.home.story.title} />
          <div className="mt-6 space-y-5 text-lead text-ink-muted">
            {t.home.story.body.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>
          <Link
            href="/about/"
            className="mt-8 inline-flex items-center gap-2 border-b border-terracotta-deep pb-1 text-sm font-medium tracking-wide text-terracotta-deep transition-opacity hover:opacity-75"
          >
            {t.home.story.cta}
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </Reveal>

        <Reveal delay={120} className="relative">
          {/* Brass frame offset — a small piece of art direction, not a border. */}
          <div
            aria-hidden="true"
            className="absolute -right-3 -top-3 hidden h-full w-full border border-brass/50 sm:block"
          />
          <SiteImage
            src="/images/interior-kitchen.jpg"
            alt="The open kitchen at Portofino seen across the bar counter, with the red wood-fired oven and exposed timber roof beams"
            width={1080}
            height={769}
            sizes="(min-width: 1024px) 40vw, 90vw"
            className="relative h-auto w-full object-cover"
          />
        </Reveal>
      </div>
    </section>
  );
}
