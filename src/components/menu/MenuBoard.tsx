"use client";

import { useLocale } from "@/components/LocaleProvider";
import { MenuNav } from "@/components/menu/MenuNav";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { fill } from "@/content/i18n";
import { formatPrice, localised, menu } from "@/lib/menu";

export function MenuBoard() {
  const { t, locale } = useLocale();

  const categories = menu.categories.map((category) => ({
    ...category,
    displayName: localised(category, "name", locale),
  }));

  return (
    <>
      <div className="shell pb-10 page-head">
        <SectionHeading
          as="h1"
          eyebrow={t.menuPage.eyebrow}
          title={t.menuPage.title}
          intro={fill(t.menuPage.intro, { currency: menu.currency })}
        />

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <TagLegend label={t.menuPage.tagsLabel} legend={menu.tagLegend} />
          <button
            type="button"
            onClick={() => window.print()}
            className="no-print inline-flex items-center gap-2 border-b border-terracotta-deep pb-0.5 text-sm text-terracotta-deep transition-opacity hover:opacity-75"
          >
            <PrinterIcon />
            {t.menuPage.printCta}
          </button>
        </div>
      </div>

      <div className="shell">
        <MenuNav
          label={t.menuPage.jumpLabel}
          categories={categories.map((c) => ({ id: c.id, name: c.displayName }))}
        />
      </div>

      <div className="shell pb-section pt-4">
        {categories.map((category) => (
          <section
            key={category.id}
            id={category.id}
            aria-labelledby={`${category.id}-heading`}
            className="scroll-mt-40 border-b border-brass/25 py-12 last:border-0 lg:py-16"
          >
            <Reveal>
              <div className="grid gap-8 lg:grid-cols-[18rem_1fr] lg:gap-16">
                <header className="lg:sticky lg:top-40 lg:self-start">
                  <h2
                    id={`${category.id}-heading`}
                    className="text-h2 text-navy"
                  >
                    {category.displayName}
                  </h2>
                  {localised(category, "description", locale) ? (
                    <p className="mt-4 leading-relaxed text-ink-muted">
                      {localised(category, "description", locale)}
                    </p>
                  ) : null}
                </header>

                <ul className="space-y-8">
                  {category.items.map((item) => {
                    const name = localised(item, "name", locale);
                    return (
                      <li key={name} className="menu-item">
                        <div className="flex items-baseline gap-3">
                          <h3 className="font-display text-h3 leading-snug text-navy">
                            {name}
                          </h3>
                          {/* Brass leader line between dish and price. */}
                          <span
                            aria-hidden="true"
                            className="mb-1 h-px flex-1 bg-brass/40"
                          />
                          <p className="shrink-0 font-display text-h3 leading-snug text-navy tabular-nums">
                            {item.price === null
                              ? (localised(item, "priceNote", locale) ||
                                  t.menuPage.marketPrice)
                              : formatPrice(item.price)}
                          </p>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
                          {item.signature ? (
                            <span className="eyebrow text-[0.6875rem]">
                              {t.menuPage.signature}
                            </span>
                          ) : null}
                          {item.tags?.length ? (
                            <ul className="flex gap-1.5">
                              {item.tags.map((tag) => (
                                <li key={tag}>
                                  <abbr
                                    title={menu.tagLegend[tag] ?? tag}
                                    className="inline-block rounded-sm border border-sea/40 px-1.5 py-0.5 text-[0.625rem] font-medium tracking-[0.08em] text-sea no-underline"
                                  >
                                    {tag}
                                  </abbr>
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </div>

                        {localised(item, "description", locale) ? (
                          <p className="mt-2 max-w-prose leading-relaxed text-ink-muted">
                            {localised(item, "description", locale)}
                          </p>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Reveal>
          </section>
        ))}

        <div className="mt-12 space-y-2 border-t border-brass/30 pt-8 text-sm text-ink-muted">
          <p>{t.menuPage.allergyNote}</p>
          {menu.note ? <p>{menu.note}</p> : null}
        </div>
      </div>
    </>
  );
}

function TagLegend({
  label,
  legend,
}: {
  label: string;
  legend: Record<string, string>;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-muted">
      <span className="eyebrow">{label}</span>
      {Object.entries(legend).map(([tag, meaning]) => (
        <span key={tag} className="inline-flex items-center gap-1.5">
          <span className="inline-block rounded-sm border border-sea/40 px-1.5 py-0.5 text-[0.625rem] font-medium tracking-[0.08em] text-sea">
            {tag}
          </span>
          {meaning}
        </span>
      ))}
    </div>
  );
}

function PrinterIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4.5 6V1.5h7V6M4.5 12H3a1.5 1.5 0 0 1-1.5-1.5v-3A1.5 1.5 0 0 1 3 6h10a1.5 1.5 0 0 1 1.5 1.5v3A1.5 1.5 0 0 1 13 12h-1.5M4.5 10h7v4.5h-7z" />
    </svg>
  );
}
