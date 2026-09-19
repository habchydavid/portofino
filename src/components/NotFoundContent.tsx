"use client";

import Link from "next/link";
import { useT } from "@/components/LocaleProvider";

export function NotFoundContent() {
  const t = useT();

  return (
    <div className="shell-narrow flex min-h-[70svh] flex-col justify-center py-40 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-5 text-h1 text-navy">{t.notFound.title}</h1>
      <p className="mx-auto mt-5 max-w-lg text-lead text-ink-muted">
        {t.notFound.body}
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-primary">
          {t.notFound.cta}
        </Link>
        <Link href="/menu/" className="btn btn-secondary">
          {t.common.viewMenu}
        </Link>
      </div>
    </div>
  );
}
