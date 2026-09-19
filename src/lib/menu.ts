import menuData from "@/content/menu.json";
import type { Locale } from "@/content/i18n";

/**
 * Typed view over src/content/menu.json — the only file that has to change
 * when a price moves or a dish comes off.
 *
 * Any string field may carry a per-locale sibling: `name_fr`, `description_fr`
 * and so on. When the site is showing French those win; otherwise the base
 * field is used. Nothing needs translating for the menu to work.
 */
export type DietaryTag = "V" | "VG" | "GF";

export type MenuItem = {
  name: string;
  description?: string;
  /** `null` means the price is not fixed — show `priceNote` instead. */
  price: number | null;
  priceNote?: string;
  tags?: DietaryTag[];
  signature?: boolean;
  [localised: string]: unknown;
};

export type MenuCategory = {
  id: string;
  name: string;
  description?: string;
  items: MenuItem[];
  [localised: string]: unknown;
};

export type Menu = {
  currency: string;
  currencySymbol: string;
  note?: string;
  tagLegend: Record<string, string>;
  categories: MenuCategory[];
};

export const menu = menuData as unknown as Menu;

/** Picks `field_<locale>` when present, else the base field. */
export function localised(
  record: Record<string, unknown>,
  field: string,
  locale: Locale,
): string {
  const translated = record[`${field}_${locale}`];
  if (typeof translated === "string" && translated.length > 0) return translated;
  const base = record[field];
  return typeof base === "string" ? base : "";
}

/** `$18`, `$18.50`. Prices in menu.json are plain numbers. */
export function formatPrice(price: number, symbol = menu.currencySymbol): string {
  const hasCents = !Number.isInteger(price);
  return `${symbol}${price.toFixed(hasCents ? 2 : 0)}`;
}
