import type { Dictionary, Locale } from "@/content/i18n";
import { fill, plural } from "@/content/i18n";
import { site } from "@/content/site";

export type ReservationValues = {
  name: string;
  phone: string;
  email: string;
  date: string; // yyyy-mm-dd, from <input type="date">
  time: string; // HH:mm, from <input type="time">
  partySize: string;
  notes: string;
};

export type ReservationField = keyof ReservationValues;

export type ReservationErrors = Partial<Record<ReservationField, string>>;

export const emptyReservation: ReservationValues = {
  name: "",
  phone: "",
  email: "",
  date: "",
  time: "",
  partySize: "2",
  notes: "",
};

/** Field order, used to focus and list errors the way the form reads. */
export const FIELD_ORDER: ReservationField[] = [
  "name",
  "phone",
  "email",
  "date",
  "time",
  "partySize",
];

/** Local date as yyyy-mm-dd — `toISOString` would shift across the timezone. */
export function todayIsoDate(now = new Date()): string {
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

/** Minutes past midnight for "HH:mm". */
function toMinutes(time: string): number | null {
  const match = /^(\d{2}):(\d{2})$/.exec(time);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
}

/** Service runs 13:00 → 01:00, so the window wraps past midnight. */
export function isWithinServiceHours(time: string): boolean {
  const minutes = toMinutes(time);
  if (minutes === null) return false;
  const opens = toMinutes(site.hours.opens) ?? 0;
  const closes = toMinutes(site.hours.closes) ?? 0;
  return opens <= closes
    ? minutes >= opens && minutes <= closes
    : minutes >= opens || minutes <= closes;
}

// Deliberately loose: international numbers vary, and a booking request is not
// the place to reject an unusual but real number. We only insist on a plausible
// run of digits.
const PHONE = /^\+?[\d\s()./-]{7,20}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validate(
  values: ReservationValues,
  t: Dictionary,
  today = todayIsoDate(),
): ReservationErrors {
  const e = t.reservations.form.errors;
  const errors: ReservationErrors = {};

  const name = values.name.trim();
  if (!name) errors.name = e.name;
  else if (name.length < 2) errors.name = e.nameShort;

  const phone = values.phone.trim();
  if (!phone) errors.phone = e.phone;
  else if (!PHONE.test(phone) || (phone.match(/\d/g) ?? []).length < 7)
    errors.phone = e.phoneInvalid;

  const email = values.email.trim();
  if (email && !EMAIL.test(email)) errors.email = e.emailInvalid;

  if (!values.date) errors.date = e.date;
  else if (values.date < today) errors.date = e.datePast;

  if (!values.time) errors.time = e.time;
  else if (!isWithinServiceHours(values.time)) errors.time = e.timeClosed;

  if (!values.partySize) errors.partySize = e.partySize;

  return errors;
}

/** Long date for the message body, in whichever language is showing. */
export function formatDate(date: string, locale: Locale): string {
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

export function formatPartySize(
  partySize: string,
  t: Dictionary,
): string {
  if (partySize === "9+") return t.reservations.form.guestsLarge;
  const count = Number(partySize);
  return plural(
    t.reservations.form.guests_one,
    t.reservations.form.guests_other,
    count,
  );
}

/**
 * Builds the message the guest sends us. There is no backend — this text,
 * dropped into WhatsApp, *is* the booking request.
 */
export function buildReservationMessage(
  values: ReservationValues,
  t: Dictionary,
  locale: Locale,
): string {
  return fill(t.reservations.whatsappMessage, {
    name: values.name.trim(),
    phone: values.phone.trim(),
    email: values.email.trim() || t.reservations.notProvided,
    date: formatDate(values.date, locale),
    time: values.time,
    partySize: formatPartySize(values.partySize, t),
    notes: values.notes.trim() || t.reservations.notProvided,
  });
}
