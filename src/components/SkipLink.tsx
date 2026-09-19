"use client";

import { useT } from "@/components/LocaleProvider";

/** First tab stop on every page. Hidden until it takes focus. */
export function SkipLink() {
  const t = useT();
  return (
    <a href="#main" className="skip-link no-print">
      {t.nav.skipToContent}
    </a>
  );
}
