import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: ReactNode;
  /** Optional standfirst under the title. */
  intro?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  /** Heading level. The page's single <h1> lives elsewhere on most pages. */
  as?: "h1" | "h2";
  id?: string;
};

/** Eyebrow + brass hairline + display heading — the opening of every band. */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  tone = "light",
  as: Tag = "h2",
  id,
}: Props) {
  const centered = align === "center";

  return (
    <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className={`eyebrow ${tone === "dark" ? "eyebrow-on-dark" : ""}`}>
        {eyebrow}
      </p>
      <hr
        className={`hairline mt-3 w-16 ${centered ? "mx-auto" : ""}`}
        aria-hidden="true"
      />
      <Tag
        id={id}
        className={`mt-5 ${Tag === "h1" ? "text-h1" : "text-h2"} ${
          tone === "dark" ? "text-sand" : "text-navy"
        }`}
      >
        {title}
      </Tag>
      {intro ? (
        <p
          className={`mt-5 text-lead ${
            tone === "dark" ? "text-sand/80" : "text-ink-muted"
          }`}
        >
          {intro}
        </p>
      ) : null}
    </div>
  );
}
