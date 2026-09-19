"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { locales, type Locale } from "@/content/i18n";

const NAV = [
  { href: "/", key: "home" },
  { href: "/menu/", key: "menu" },
  { href: "/about/", key: "about" },
  { href: "/gallery/", key: "gallery" },
  { href: "/contact/", key: "contact" },
] as const;

const LOCALE_LABELS: Record<Locale, string> = { en: "EN", fr: "FR" };

export function Header() {
  const pathname = usePathname();
  const { t, locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // The home page opens with a full-bleed hero, so the bar starts transparent
  // there and picks up a background as soon as the page moves.
  const overHero = pathname === "/" && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile panel on navigation.
  useEffect(() => setOpen(false), [pathname]);

  // While the panel is open: lock the page, close on Escape, keep focus inside.
  useEffect(() => {
    if (!open) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    panelRef.current?.querySelector<HTMLElement>("a[href]")?.focus();

    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      data-site-header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        overHero
          ? "bg-transparent"
          : "border-b border-brass/25 bg-sand/95 backdrop-blur-sm"
      }`}
    >
      <div className="shell flex h-20 items-center justify-between gap-6 lg:h-24">
        <Link
          href="/"
          className={`font-display text-2xl tracking-tight lg:text-[1.75rem] ${
            overHero ? "text-sand" : "text-navy"
          }`}
        >
          Portofino
          <span className="sr-only"> — {t.nav.home}</span>
        </Link>

        <nav
          aria-label={t.nav.primaryLabel}
          className="hidden items-center gap-8 lg:flex"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`relative py-2 text-sm tracking-wide transition-opacity ${
                overHero ? "text-sand hover:opacity-80" : "text-navy hover:opacity-70"
              } ${
                isActive(item.href)
                  ? "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-current"
                  : ""
              }`}
            >
              {t.nav[item.key]}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LocaleSwitcher
            label={t.nav.languageLabel}
            locale={locale}
            onChange={setLocale}
            onDark={overHero}
          />

          <Link
            href="/reservations/"
            className={`btn hidden h-11 min-h-0 px-5 text-[0.8125rem] sm:inline-flex ${
              overHero ? "btn-on-dark" : "btn-primary"
            }`}
          >
            {t.common.reserve}
          </Link>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className={`-mr-2 inline-flex h-11 w-11 items-center justify-center lg:hidden ${
              overHero ? "text-sand" : "text-navy"
            }`}
          >
            <span className="sr-only">
              {open ? t.nav.closeMenu : t.nav.openMenu}
            </span>
            <MenuIcon open={open} />
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      <div
        id="mobile-nav"
        ref={panelRef}
        hidden={!open}
        className="border-t border-brass/25 bg-sand lg:hidden"
      >
        <nav aria-label={t.nav.primaryLabel} className="shell py-6">
          <ul className="flex flex-col">
            {NAV.map((item) => (
              <li key={item.href} className="border-b border-brass/20 last:border-0">
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="block py-4 font-display text-2xl text-navy"
                >
                  {t.nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/reservations/" className="btn btn-primary mt-6 w-full">
            {t.common.reserve}
          </Link>
        </nav>
      </div>
    </header>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {open ? (
        <>
          <path d="M4 4l14 14" />
          <path d="M18 4L4 18" />
        </>
      ) : (
        <>
          <path d="M2 6h18" />
          <path d="M2 11h18" />
          <path d="M2 16h18" />
        </>
      )}
    </svg>
  );
}

function LocaleSwitcher({
  label,
  locale,
  onChange,
  onDark,
}: {
  label: string;
  locale: Locale;
  onChange: (next: Locale) => void;
  onDark: boolean;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className={`flex items-center rounded-sm border text-[0.6875rem] font-medium tracking-[0.12em] ${
        onDark ? "border-sand/40 text-sand" : "border-brass/50 text-navy"
      }`}
    >
      {locales.map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            onClick={() => onChange(code)}
            aria-pressed={active}
            className={`px-2.5 py-1.5 transition-colors ${
              active
                ? onDark
                  ? "bg-sand text-navy"
                  : "bg-navy text-sand"
                : "opacity-85 hover:opacity-100"
            }`}
          >
            {LOCALE_LABELS[code]}
          </button>
        );
      })}
    </div>
  );
}
