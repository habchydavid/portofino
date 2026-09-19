"use client";

import { useCallback, useId, useState } from "react";
import { useT } from "@/components/LocaleProvider";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { fill } from "@/content/i18n";

/**
 * Manual slider — no autoplay. Moving content that a reader cannot outpace is
 * a WCAG failure, and quotes this long need reading time anyway. Arrow keys
 * work when the slider has focus; the live region announces each change.
 */
export function Testimonials() {
  const t = useT();
  const quotes = t.home.testimonials.items;
  const [index, setIndex] = useState(0);
  const groupId = useId();

  const go = useCallback(
    (next: number) => setIndex((next + quotes.length) % quotes.length),
    [quotes.length],
  );

  const current = quotes[index];

  return (
    <section className="bg-shell py-section">
      <div className="shell">
        <Reveal>
          <SectionHeading
            eyebrow={t.home.testimonials.eyebrow}
            title={t.home.testimonials.title}
            align="center"
          />
        </Reveal>

        <Reveal
          className="mx-auto mt-14 max-w-3xl"
          delay={80}
        >
          <div
            role="group"
            aria-roledescription="carousel"
            aria-label={t.home.testimonials.title}
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") {
                event.preventDefault();
                go(index + 1);
              } else if (event.key === "ArrowLeft") {
                event.preventDefault();
                go(index - 1);
              }
            }}
          >
            <div aria-live="polite" aria-atomic="true">
              <figure
                key={index}
                id={`${groupId}-slide-${index}`}
                aria-roledescription="slide"
                aria-label={fill(t.home.testimonials.counterLabel, {
                  current: index + 1,
                  total: quotes.length,
                })}
                className="text-center"
              >
                <svg
                  width="36"
                  height="28"
                  viewBox="0 0 36 28"
                  aria-hidden="true"
                  className="mx-auto text-brass"
                  fill="currentColor"
                >
                  <path d="M0 28V16.8C0 7.5 4.6 1.9 13.7 0l1.5 4.2C9.9 5.9 7.2 9 7.2 13.4H14V28H0Zm22 0V16.8C22 7.5 26.6 1.9 35.7 0l1.5 4.2c-5.3 1.7-8 4.8-8 9.2H36V28H22Z" />
                </svg>

                <blockquote className="mt-8">
                  <p className="font-display text-h3 leading-relaxed text-navy sm:text-[1.75rem]">
                    &ldquo;{current.quote}&rdquo;
                  </p>
                </blockquote>
                <figcaption className="mt-6 text-sm text-ink-muted">
                  <span className="font-medium text-navy">{current.author}</span>
                  <span aria-hidden="true"> · </span>
                  {current.source}
                </figcaption>
              </figure>
            </div>

            <div className="mt-10 flex items-center justify-center gap-6">
              <SliderButton
                label={t.home.testimonials.previous}
                onClick={() => go(index - 1)}
                direction="prev"
              />

              <ul className="flex items-center gap-2">
                {quotes.map((quote, dot) => (
                  <li key={quote.quote.slice(0, 24)}>
                    <button
                      type="button"
                      onClick={() => go(dot)}
                      aria-current={dot === index ? "true" : undefined}
                      className="grid h-8 w-8 place-items-center"
                    >
                      <span className="sr-only">
                        {t.home.testimonials.goTo} {dot + 1}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`block h-1.5 w-1.5 rounded-full transition-colors ${
                          dot === index ? "bg-terracotta-deep" : "bg-navy/25"
                        }`}
                      />
                    </button>
                  </li>
                ))}
              </ul>

              <SliderButton
                label={t.home.testimonials.next}
                onClick={() => go(index + 1)}
                direction="next"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function SliderButton({
  label,
  onClick,
  direction,
}: {
  label: string;
  onClick: () => void;
  direction: "prev" | "next";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid h-11 w-11 place-items-center rounded-full border border-brass/50 text-navy transition-colors hover:border-navy hover:bg-navy hover:text-sand"
    >
      <span className="sr-only">{label}</span>
      <svg
        width="16"
        height="12"
        viewBox="0 0 16 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
        className={direction === "prev" ? "rotate-180" : ""}
      >
        <path d="M1 6h13M9.5 1L14.5 6l-5 5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
