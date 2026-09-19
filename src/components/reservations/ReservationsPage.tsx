"use client";

import { useT } from "@/components/LocaleProvider";
import { ReservationForm } from "@/components/reservations/ReservationForm";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { site } from "@/content/site";

export function ReservationsPageContent() {
  const t = useT();

  return (
    <div className="shell pb-section page-head">
      <SectionHeading
        as="h1"
        eyebrow={t.reservations.eyebrow}
        title={t.reservations.title}
        intro={t.reservations.intro}
      />

      <div className="mt-14 grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
        <Reveal>
          <ReservationForm />
        </Reveal>

        <Reveal as="aside" delay={120} className="lg:pt-2">
          <div className="border-t border-brass/40 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <h2 className="text-h3 text-navy">{t.reservations.aside.title}</h2>
            <ul className="mt-6 space-y-4 text-ink-muted">
              {t.reservations.aside.items.map((item) => (
                <li key={item.slice(0, 24)} className="flex gap-3 leading-relaxed">
                  <span aria-hidden="true" className="mt-2.5 h-px w-4 shrink-0 bg-brass" />
                  {item}
                </li>
              ))}
            </ul>

            <dl className="mt-8 space-y-3 text-sm">
              <div>
                <dt className="eyebrow">{t.contact.hoursLabel}</dt>
                <dd className="mt-1 text-ink-muted">{site.hours.label}</dd>
              </div>
              <div>
                <dt className="eyebrow">{t.contact.phoneLabel}</dt>
                <dd className="mt-1">
                  <a
                    href={`tel:${site.phoneE164}`}
                    className="border-b border-terracotta-deep/40 text-terracotta-deep transition-opacity hover:opacity-75"
                  >
                    {site.phone}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
