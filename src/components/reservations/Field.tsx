"use client";

import type { ReactNode } from "react";

type Props = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  requiredLabel: string;
  children: (props: {
    id: string;
    "aria-invalid": boolean | undefined;
    "aria-describedby": string | undefined;
    className: string;
  }) => ReactNode;
};

const CONTROL =
  "w-full rounded-sm border bg-sand px-4 py-3 text-base text-navy placeholder:text-ink-muted/60 transition-colors focus:border-navy";

/**
 * Label, control, hint and error message wired together with the ids that
 * screen readers need. The control itself is passed in as a render prop so
 * inputs, selects and textareas all share this plumbing.
 */
export function Field({
  id,
  label,
  error,
  hint,
  required,
  requiredLabel,
  children,
}: Props) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-navy">
        {label}
        {required ? (
          <span className="text-terracotta-deep">
            {" "}
            *<span className="sr-only"> ({requiredLabel})</span>
          </span>
        ) : null}
      </label>

      <div className="mt-2">
        {children({
          id,
          "aria-invalid": error ? true : undefined,
          "aria-describedby": describedBy,
          className: `${CONTROL} ${
            error ? "border-terracotta-deep" : "border-brass/45"
          }`,
        })}
      </div>

      {hint ? (
        <p id={hintId} className="mt-1.5 text-xs text-ink-muted">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} className="mt-1.5 text-sm text-terracotta-deep">
          {error}
        </p>
      ) : null}
    </div>
  );
}
