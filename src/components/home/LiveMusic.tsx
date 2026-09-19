"use client";

import { SiteImage } from "@/components/SiteImage";
import Link from "next/link";
import { useT } from "@/components/LocaleProvider";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

/** Dark band, mid-page — the visual break between the terrace and the guests. */
export function LiveMusic() {
  const t = useT();

  return (
    <section className="relative isolate overflow-hidden bg-navy py-section text-sand">
      {/* TODO: replace with a photograph of the weekend musicians. */}
      <SiteImage
        src="/images/live-music.svg"
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover opacity-30"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-navy/60" />

      <div className="shell">
        <Reveal className="max-w-2xl">
          <SectionHeading
            eyebrow={t.home.music.eyebrow}
            title={t.home.music.title}
            tone="dark"
          />
          <p className="mt-6 text-lead text-sand/85">{t.home.music.body}</p>
          <Link href="/reservations/" className="btn btn-on-dark mt-8">
            {t.home.music.cta}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
