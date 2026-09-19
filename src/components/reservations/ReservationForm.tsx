"use client";

import { useRef, useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { Field } from "@/components/reservations/Field";
import { fill, plural } from "@/content/i18n";
import { site, whatsappLink } from "@/content/site";
import {
  buildReservationMessage,
  emptyReservation,
  FIELD_ORDER,
  todayIsoDate,
  validate,
  type ReservationErrors,
  type ReservationField,
  type ReservationValues,
} from "@/lib/reservation";

const PARTY_SIZES = ["1", "2", "3", "4", "5", "6", "7", "8", "9+"] as const;

/**
 * No backend: the form validates in the browser and then hands the guest a
 * WhatsApp message that is already written out. Calling is offered alongside,
 * not buried — plenty of people would rather just ring.
 */
export function ReservationForm() {
  const { t, locale } = useLocale();
  const f = t.reservations.form;

  const [values, setValues] = useState<ReservationValues>(emptyReservation);
  const [errors, setErrors] = useState<ReservationErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [sentLink, setSentLink] = useState<string | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const set = (field: ReservationField) => (value: string) => {
    setValues((previous) => ({ ...previous, [field]: value }));
    // Clear an error as soon as the guest starts fixing it; re-check on submit.
    if (errors[field]) {
      setErrors((previous) => {
        const next = { ...previous };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);

    const found = validate(values, t);
    setErrors(found);

    if (Object.keys(found).length > 0) {
      // Send focus to the summary so the errors are announced, then let the
      // guest tab straight into the first bad field.
      summaryRef.current?.focus();
      const first = FIELD_ORDER.find((field) => found[field]);
      if (first) {
        formRef.current
          ?.querySelector<HTMLElement>(`#reservation-${first}`)
          ?.focus({ preventScroll: true });
      }
      return;
    }

    const link = whatsappLink(buildReservationMessage(values, t, locale));
    setSentLink(link);
    window.open(link, "_blank", "noopener,noreferrer");
  };

  const errorList = FIELD_ORDER.filter((field) => errors[field]);

  if (sentLink) {
    return (
      <div className="rounded-sm border border-brass/40 bg-shell p-8">
        <h2 className="text-h3 text-navy">{f.successTitle}</h2>
        <p className="mt-4 leading-relaxed text-ink-muted">
          {fill(f.successBody, { phone: site.phone })}
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <a
            href={sentLink}
            target="_blank"
            rel="noreferrer noopener"
            className="btn btn-primary"
          >
            {f.successRetry}
          </a>
          <a href={`tel:${site.phoneE164}`} className="btn btn-secondary">
            {t.common.callUs}
          </a>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate>
      {submitted && errorList.length > 0 ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="mb-8 rounded-sm border border-terracotta-deep/50 bg-terracotta/10 p-5"
        >
          <h2 className="text-sm font-semibold text-terracotta-deep">
            {f.errorsTitle}
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-navy">
            {errorList.map((field) => (
              <li key={field}>
                <a
                  href={`#reservation-${field}`}
                  className="underline underline-offset-2"
                >
                  {errors[field]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <fieldset className="space-y-6">
        <legend className="eyebrow mb-4">{f.legend}</legend>

        <Field
          id="reservation-name"
          label={f.name}
          error={errors.name}
          required
          requiredLabel={t.common.required}
        >
          {(props) => (
            <input
              {...props}
              type="text"
              name="name"
              autoComplete="name"
              placeholder={f.namePlaceholder}
              value={values.name}
              onChange={(e) => set("name")(e.target.value)}
            />
          )}
        </Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field
            id="reservation-phone"
            label={f.phone}
            error={errors.phone}
            required
            requiredLabel={t.common.required}
          >
            {(props) => (
              <input
                {...props}
                type="tel"
                name="phone"
                autoComplete="tel"
                inputMode="tel"
                placeholder={f.phonePlaceholder}
                value={values.phone}
                onChange={(e) => set("phone")(e.target.value)}
              />
            )}
          </Field>

          <Field
            id="reservation-email"
            label={f.email}
            error={errors.email}
            hint={f.emailHint}
            requiredLabel={t.common.required}
          >
            {(props) => (
              <input
                {...props}
                type="email"
                name="email"
                autoComplete="email"
                inputMode="email"
                placeholder={f.emailPlaceholder}
                value={values.email}
                onChange={(e) => set("email")(e.target.value)}
              />
            )}
          </Field>
        </div>
      </fieldset>

      <fieldset className="mt-10 space-y-6">
        <legend className="eyebrow mb-4">{f.legendBooking}</legend>

        <div className="grid gap-6 sm:grid-cols-3">
          <Field
            id="reservation-date"
            label={f.date}
            error={errors.date}
            required
            requiredLabel={t.common.required}
          >
            {(props) => (
              <input
                {...props}
                type="date"
                name="date"
                min={todayIsoDate()}
                value={values.date}
                onChange={(e) => set("date")(e.target.value)}
              />
            )}
          </Field>

          <Field
            id="reservation-time"
            label={f.time}
            error={errors.time}
            hint={f.hoursNote}
            required
            requiredLabel={t.common.required}
          >
            {(props) => (
              <input
                {...props}
                type="time"
                name="time"
                step={900}
                value={values.time}
                onChange={(e) => set("time")(e.target.value)}
              />
            )}
          </Field>

          <Field
            id="reservation-partySize"
            label={f.partySize}
            error={errors.partySize}
            required
            requiredLabel={t.common.required}
          >
            {(props) => (
              <select
                {...props}
                name="partySize"
                value={values.partySize}
                onChange={(e) => set("partySize")(e.target.value)}
              >
                {PARTY_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size === "9+"
                      ? f.guestsLarge
                      : plural(f.guests_one, f.guests_other, Number(size))}
                  </option>
                ))}
              </select>
            )}
          </Field>
        </div>

        <Field
          id="reservation-notes"
          label={f.notes}
          hint={f.notesHint}
          requiredLabel={t.common.required}
        >
          {(props) => (
            <textarea
              {...props}
              name="notes"
              rows={4}
              placeholder={f.notesPlaceholder}
              value={values.notes}
              onChange={(e) => set("notes")(e.target.value)}
            />
          )}
        </Field>
      </fieldset>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
        <button type="submit" className="btn btn-primary">
          <WhatsAppIcon />
          {f.submit}
        </button>
        <a href={`tel:${site.phoneE164}`} className="btn btn-secondary">
          {fill(f.orCall, { phone: site.phone })}
        </a>
      </div>
    </form>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.17 8.17 0 0 1-1.25-4.38c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.69 8.23-8.25 8.23Zm4.52-6.16c-.25-.13-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.13-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.22.25-.85.84-.85 2.05 0 1.2.88 2.37 1 2.53.12.17 1.72 2.63 4.17 3.69.58.25 1.04.4 1.39.51.58.19 1.12.16 1.54.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.29Z" />
    </svg>
  );
}
