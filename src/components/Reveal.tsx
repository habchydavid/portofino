"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Render as something other than a <div> — e.g. "section", "li", "figure". */
  as?: ElementType;
  className?: string;
  /** Stagger, in milliseconds, for items revealed as a group. */
  delay?: number;
};

/**
 * Fades and lifts its children into place the first time they scroll into
 * view.
 *
 * The hidden state is applied in an effect rather than in the markup, so a
 * visitor without JavaScript — or one whose observer never fires — sees the
 * content normally. `prefers-reduced-motion` is honoured in globals.css.
 */
export function Reveal({
  children,
  as: Tag = "div",
  className = "",
  delay = 0,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setShown(true);
      return;
    }

    // Anything already on screen when the page loads is simply there. Fading
    // it in after hydration would flash the content and, because a
    // transparent element has not painted yet, push out Largest Contentful
    // Paint. Only content below the fold gets the animation.
    if (node.getBoundingClientRect().top < window.innerHeight) {
      setShown(true);
      return;
    }

    // Only hide the content once we know we can bring it back.
    setArmed(true);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const classes = [armed ? "reveal" : "", shown ? "reveal-in" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag
      ref={ref}
      className={classes}
      style={delay && armed ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
