"use client";

import { useEffect, useState } from "react";

type Props = {
  label: string;
  categories: { id: string; name: string }[];
};

/**
 * Anchored category nav. Sticks under the header, tracks which section is in
 * view, and stays a plain list of links — so it works with no JavaScript, is
 * keyboard navigable by default, and deep links survive a page reload.
 */
export function MenuNav({ label, categories }: Props) {
  const [active, setActive] = useState(categories[0]?.id ?? "");

  useEffect(() => {
    const sections = categories
      .map((category) => document.getElementById(category.id))
      .filter((node): node is HTMLElement => node !== null);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      // Band just under the sticky header: whatever sits there is "current".
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [categories]);

  return (
    <nav
      aria-label={label}
      className="no-print sticky top-20 z-30 -mx-[var(--spacing-gutter)] border-y border-brass/30 bg-sand/95 backdrop-blur-sm lg:top-24"
    >
      <ul className="flex snap-x gap-1 overflow-x-auto px-[var(--spacing-gutter)] py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((category) => (
          <li key={category.id} className="snap-start">
            <a
              href={`#${category.id}`}
              aria-current={active === category.id ? "true" : undefined}
              className={`inline-block whitespace-nowrap rounded-sm px-4 py-2 text-sm tracking-wide transition-colors ${
                active === category.id
                  ? "bg-navy text-sand"
                  : "text-ink-muted hover:bg-shell hover:text-navy"
              }`}
            >
              {category.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
