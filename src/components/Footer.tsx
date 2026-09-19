"use client";

import Link from "next/link";
import { useT } from "@/components/LocaleProvider";
import { site } from "@/content/site";

const EXPLORE = [
  { href: "/menu/", key: "menu" },
  { href: "/about/", key: "about" },
  { href: "/gallery/", key: "gallery" },
  { href: "/reservations/", key: "reservations" },
  { href: "/contact/", key: "contact" },
] as const;

export function Footer() {
  const t = useT();
  const year = new Date().getFullYear();

  return (
    <footer data-site-footer className="bg-navy text-sand">
      <div className="shell grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:py-20">
        <div>
          <p className="font-display text-3xl">Portofino</p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-sand/75">
            {t.footer.tagline}
          </p>
          <Link href="/reservations/" className="btn btn-on-dark mt-8">
            {t.common.reserve}
          </Link>
        </div>

        <nav aria-label={`${t.footer.navLabel} — ${t.footer.exploreLabel}`}>
          <h2 className="eyebrow eyebrow-on-dark font-sans">
            {t.footer.exploreLabel}
          </h2>
          <ul className="mt-5 space-y-3 text-sm">
            {EXPLORE.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sand/80 transition-colors hover:text-sand"
                >
                  {t.nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="eyebrow eyebrow-on-dark font-sans">
            {t.footer.visitLabel}
          </h2>
          <address className="mt-5 space-y-3 text-sm not-italic text-sand/80">
            <p>
              {site.address.street}
              <br />
              {site.address.locality}, {site.address.countryName}
            </p>
            <p>
              <a
                href={`tel:${site.phoneE164}`}
                className="transition-colors hover:text-sand"
              >
                {site.phone}
              </a>
            </p>
            <p>
              <a
                href={`mailto:${site.email}`}
                className="transition-colors hover:text-sand"
              >
                {site.email}
              </a>
            </p>
          </address>
          <p className="mt-5 text-sm text-sand/80">{site.hours.label}</p>

          <h2 className="eyebrow eyebrow-on-dark mt-8 font-sans">
            {t.footer.followLabel}
          </h2>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {site.social.map((channel) => (
              <li key={channel.name}>
                <a
                  href={channel.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-sand/80 transition-colors hover:text-sand"
                >
                  {channel.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-sand/15">
        <div className="shell flex flex-col gap-2 py-6 text-xs text-sand/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. {t.footer.rights}
          </p>
          {/* TODO: delete this line or replace it with your own credit. */}
          <p>{t.footer.credit}</p>
        </div>
      </div>
    </footer>
  );
}
