import en from "./en.json";
import fr from "./fr.json";

/**
 * Bilingual-ready wiring. Every string the site renders comes from one of the
 * JSON dictionaries in this folder — nothing is hard-coded in a component.
 *
 * English is the primary locale: it is what the static HTML is built with, and
 * what search engines index. French is offered through the header switcher and
 * applied on the client. See README > Adding a language for how to add a third
 * locale, or how to promote French to its own /fr URL space.
 */
export const locales = ["en", "fr"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** The shape every dictionary must satisfy, taken from the English one. */
export type Dictionary = typeof en;

export const dictionaries: Record<Locale, Dictionary> = {
  en,
  fr: fr as Dictionary,
};

export function getDictionary(locale: Locale = defaultLocale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

export function isLocale(value: string | null | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/**
 * Fills `{placeholders}` in a dictionary string.
 * `t("Image {current} of {total}", { current: 2, total: 9 })`
 */
export function fill(
  template: string,
  vars: Record<string, string | number> = {},
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}

/** Minimal plural picker: dictionaries carry `key_one` / `key_other`. */
export function plural(
  one: string,
  other: string,
  count: number,
  vars: Record<string, string | number> = {},
): string {
  return fill(count === 1 ? one : other, { count, ...vars });
}
