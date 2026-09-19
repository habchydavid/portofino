"use client";

import { SiteImage } from "@/components/SiteImage";
import Link from "next/link";
import { useT } from "@/components/LocaleProvider";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

/* Paired by position with the dishes in the i18n dictionaries, whose copy is
   translated. Each photograph carries its own dimensions because they are not
   all the same shape.
   TODO: dish three still has placeholder artwork — a dessert photograph. */
const DISH_IMAGES = [
  { src: "/images/dish-gamberoni.jpg", width: 1080, height: 1269 },
  { src: "/images/dish-pizza-fichi.jpg", width: 1080, height: 1389 },
  { src: "/images/dish-tiramisu.svg", width: 1200, height: 1500 },
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
          {t.home.dishes.items.map((dish, index) => {
            const image = DISH_IMAGES[index] ?? DISH_IMAGES[0];
            return (
            <Reveal as="li" key={dish.name} delay={index * 110}>
              <figure className="h-full">
                {/* Fixed 4:5 window so three photographs of different shapes
                    still line up as a row of equal cards. */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  <SiteImage
                    src={image.src}
                    alt={dish.alt}
                    width={image.width}
                    height={image.height}
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] hover:scale-[1.03]"
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
            );
          })}
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
