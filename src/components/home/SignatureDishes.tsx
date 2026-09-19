"use client";

import { SiteImage } from "@/components/SiteImage";
import Link from "next/link";
import { useT } from "@/components/LocaleProvider";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

/* TODO: point these at real dish photography. Names and copy live in the
   i18n dictionaries so they can be translated. */
const DISH_IMAGES = [
  "/images/dish-vongole.svg",
  "/images/dish-pesce-del-giorno.svg",
  "/images/dish-tiramisu.svg",
] as const;

export function SignatureDishes() {
  const t = useT();

  return (
    <section className="bg-shell py-section">
      <div className="shell">
        <Reveal>
          <SectionHeading
            eyebrow={t.home.dishes.eyebrow}
            title={t.home.dishes.title}
            intro={t.home.dishes.intro}
            align="center"
          />
        </Reveal>

        <ul className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          {t.home.dishes.items.map((dish, index) => (
            <Reveal as="li" key={dish.name} delay={index * 110}>
              <figure className="h-full">
                <div className="overflow-hidden">
                  <SiteImage
                    src={DISH_IMAGES[index] ?? DISH_IMAGES[0]}
                    alt={dish.alt}
                    width={1200}
                    height={1500}
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                    className="h-auto w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] hover:scale-[1.03]"
                  />
                </div>
                <figcaption className="mt-6">
                  <h3 className="text-h3 text-navy">{dish.name}</h3>
                  <p className="mt-3 leading-relaxed text-ink-muted">
                    {dish.description}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-14 text-center">
          <Link href="/menu/" className="btn btn-secondary">
            {t.home.dishes.cta}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
