"use client";

import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { useT } from "@/components/LocaleProvider";
import { SectionHeading } from "@/components/SectionHeading";

export function GalleryPageContent() {
  const t = useT();

  return (
    <div className="shell pb-section page-head">
      <SectionHeading
        as="h1"
        eyebrow={t.gallery.eyebrow}
        title={t.gallery.title}
        intro={t.gallery.intro}
      />
      <div className="mt-14">
        <GalleryGrid />
      </div>
    </div>
  );
}
