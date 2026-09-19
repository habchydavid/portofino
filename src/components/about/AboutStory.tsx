"use client";

import { SiteImage } from "@/components/SiteImage";
import Link from "next/link";
import { useT } from "@/components/LocaleProvider";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { site } from "@/content/site";

/* TODO: replace with real photography. One image per section, in order. */
const SECTION_IMAGES = [
  { src: "/images/about-origins.svg", width: 1400, height: 1050 },
  { src: "/images/about-chef.svg", width: 1200, height: 1500 },
  { src: "/images/about-terrace.svg", width: 1600, height: 1000 },
] as const;

export function AboutStory() {
  const t = useT();

  return (
    <>
      <div className="shell pb-16 page-head">
        <SectionHeading
          as="h1"
          eyebrow={t.about.eyebrow}
          title={t.about.title}
          intro={t.about.lead}
        />
      </div>

      <div className="shell pb-section">
        {t.about.sections.map((section, index) => {
          const image = SECTION_IMAGES[index] ?? SECTION_IMAGES[0];
          const imageFirst = index % 2 === 1;

          return (
            <Reveal
              as="section"
              key={section.heading}
              className="grid items-center gap-10 border-t border-brass/25 py-14 first:border-0 first:pt-0 lg:grid-cols-2 lg:gap-20 lg:py-20"
            >
              <div className={imageFirst ? "lg:order-2" : undefined}>
                <h2 className="text-h2 text-navy">{section.heading}</h2>
                <div className="mt-6 space-y-5 text-lead text-ink-muted">
                  {section.body.map((paragraph) => (
                    <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                  ))}
                </div>
              </div>

              <div className={imageFirst ? "lg:order-1" : undefined}>
                <SiteImage
                  src={image.src}
                  alt={section.alt}
                  width={image.width}
                  height={image.height}
                  sizes="(min-width: 1024px) 45vw, 92vw"
                  className="h-auto w-full object-cover"
                />
              </div>
            </Reveal>
          );
        })}
      </div>

      <section className="bg-navy py-section text-sand">
        <div className="shell-narrow text-center">
          <Reveal>
            <h2 className="text-h2 text-sand">{t.about.cta.title}</h2>
            <p className="mx-auto mt-5 max-w-xl text-lead text-sand/80">
              {t.about.cta.body}
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link href="/reservations/" className="btn btn-primary">
                {t.common.reserve}
              </Link>
              <a href={`tel:${site.phoneE164}`} className="btn btn-on-dark">
                {t.common.callUs}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
