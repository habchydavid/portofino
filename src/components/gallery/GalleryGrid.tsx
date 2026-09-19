"use client";

import { SiteImage } from "@/components/SiteImage";
import { useCallback, useEffect, useRef, useState } from "react";
import { useT } from "@/components/LocaleProvider";
import { Reveal } from "@/components/Reveal";
import { fill } from "@/content/i18n";
import galleryData from "@/content/gallery.json";

type GalleryImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

const images = galleryData.images as GalleryImage[];

/**
 * Masonry grid with a lightbox.
 *
 * The grid is CSS multi-column, so the browser does the packing and the
 * markup stays a plain list. The lightbox is a native <dialog> opened with
 * showModal(), which gives us the focus trap, the inert background and
 * Escape-to-close without reimplementing any of them.
 */
export function GalleryGrid() {
  const t = useT();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggersRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [index, setIndex] = useState<number | null>(null);

  const open = useCallback((next: number) => {
    setIndex(next);
    dialogRef.current?.showModal();
  }, []);

  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  const step = useCallback((delta: number) => {
    setIndex((current) =>
      current === null ? null : (current + delta + images.length) % images.length,
    );
  }, []);

  // Arrow keys move through the set while the dialog is open.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
      }
    };

    // Return focus to the thumbnail that opened the lightbox.
    const onClose = () => {
      const last = index;
      setIndex(null);
      if (last !== null) triggersRef.current[last]?.focus();
    };

    dialog.addEventListener("keydown", onKeyDown);
    dialog.addEventListener("close", onClose);
    return () => {
      dialog.removeEventListener("keydown", onKeyDown);
      dialog.removeEventListener("close", onClose);
    };
  }, [index, step]);

  const current = index === null ? null : images[index];

  return (
    <>
      <ul className="columns-1 gap-6 sm:columns-2 lg:columns-3 [&>li]:mb-6">
        {images.map((image, i) => (
          <Reveal
            as="li"
            key={image.src}
            delay={(i % 3) * 90}
            className="break-inside-avoid"
          >
            <button
              type="button"
              ref={(node) => {
                triggersRef.current[i] = node;
              }}
              onClick={() => open(i)}
              className="group block w-full overflow-hidden bg-shell"
            >
              <span className="sr-only">
                {t.gallery.openLabel}: {image.alt}
              </span>
              <SiteImage
                src={image.src}
                alt=""
                width={image.width}
                height={image.height}
                sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 92vw"
                className="h-auto w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.03]"
              />
            </button>
          </Reveal>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label={t.gallery.title}
        className="max-h-dvh max-w-dvw bg-transparent p-0 backdrop:bg-navy/90 open:fixed open:inset-0 open:m-auto open:h-dvh open:w-dvw"
        onClick={(event) => {
          // Click on the backdrop (the dialog element itself) closes.
          if (event.target === dialogRef.current) close();
        }}
      >
        {current ? (
          <div className="flex h-dvh w-dvw flex-col">
            <div className="flex items-center justify-between gap-4 px-4 py-3 text-sand sm:px-6">
              <p className="text-sm tracking-wide text-sand/80">
                {fill(t.gallery.counterLabel, {
                  current: (index ?? 0) + 1,
                  total: images.length,
                })}
              </p>
              <button
                type="button"
                onClick={close}
                className="grid h-11 w-11 place-items-center rounded-full border border-sand/40 text-sand transition-colors hover:bg-sand hover:text-navy"
              >
                <span className="sr-only">{t.gallery.closeLabel}</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M3 3l10 10M13 3L3 13" />
                </svg>
              </button>
            </div>

            <figure className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-4 pb-6 sm:px-6">
              <SiteImage
                key={current.src}
                src={current.src}
                alt={current.alt}
                width={current.width}
                height={current.height}
                sizes="92vw"
                className="max-h-[72dvh] w-auto max-w-full object-contain"
              />
              <figcaption className="max-w-2xl text-center text-sm text-sand/80">
                {current.alt}
              </figcaption>
            </figure>

            <div className="flex items-center justify-center gap-4 pb-6">
              <LightboxButton
                label={t.gallery.previousLabel}
                onClick={() => step(-1)}
                direction="prev"
              />
              <LightboxButton
                label={t.gallery.nextLabel}
                onClick={() => step(1)}
                direction="next"
              />
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}

function LightboxButton({
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
      className="grid h-12 w-12 place-items-center rounded-full border border-sand/40 text-sand transition-colors hover:bg-sand hover:text-navy"
    >
      <span className="sr-only">{label}</span>
      <svg
        width="18"
        height="14"
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
