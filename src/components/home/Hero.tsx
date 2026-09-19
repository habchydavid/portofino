"use client";

import { SiteImage } from "@/components/SiteImage";
import Link from "next/link";
import { useT } from "@/components/LocaleProvider";

export function Hero() {
  const t = useT();

  return (
    <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden">
      {/* TODO: replace with a real photograph of the sea at golden hour.
          Keep it wide (at least 2400px) — it is the first thing anyone sees. */}
      <SiteImage
        src="/images/hero-sea-golden-hour.svg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover"
      />
      {/* Scrims. These are what keep the type accessible over *any*
          photograph, however bright: one carries the headline block, the other
          sits behind the transparent header. Do not lighten them without
          re-checking contrast against the new image. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-navy/90 via-navy/65 to-navy/30"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-navy/70 to-transparent"
      />

      <div className="shell pb-20 pt-32 sm:pb-28 lg:pb-32">
        <div className="max-w-3xl">
          <p className="eyebrow eyebrow-on-dark">{t.home.hero.eyebrow}</p>
          <h1 className="mt-6 text-display text-sand">{t.home.hero.title}</h1>
          <p className="mt-6 max-w-xl text-lead text-sand/90">
            {t.home.hero.subtitle}
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link href="/reservations/" className="btn btn-primary">
              {t.common.reserve}
            </Link>
            <Link href="/menu/" className="btn btn-on-dark">
              {t.common.viewMenu}
            </Link>
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-6 hidden justify-center lg:flex"
      >
        <span className="flex flex-col items-center gap-2 text-[0.6875rem] uppercase tracking-[0.22em] text-sand/70">
          {t.home.hero.scroll}
          <svg width="1" height="36" viewBox="0 0 1 36" aria-hidden="true">
            <line x1="0.5" y1="0" x2="0.5" y2="36" stroke="currentColor" />
          </svg>
        </span>
      </div>
    </section>
  );
}
