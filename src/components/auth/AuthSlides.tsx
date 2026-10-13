"use client";

import { useEffect, useState } from "react";
import { AuthIllustration } from "@/components/auth/AuthIllustration";
import { SignupIllustration } from "@/components/auth/SignupIllustration";
import { ChatArt, FindArt, RequestArt } from "@/components/auth/slide-art";

const SLIDES = [
  {
    Art: FindArt,
    bg: "bg-clay-50",
    title: "Find the exact piece",
    text: "Search by brand, product and part. Don’t buy a whole new appliance for one broken piece.",
  },
  {
    Art: AuthIllustration,
    bg: "bg-moss-50",
    title: "Confirmed matches only",
    text: "Every listing is matched to a specific product, so you know it fits before you message.",
  },
  {
    Art: SignupIllustration,
    bg: "bg-clay-50",
    title: "Got a spare? List it",
    text: "Turn leftover parts into cash and help someone finish their repair.",
  },
  {
    Art: RequestArt,
    bg: "bg-moss-50",
    title: "Can’t find it? Ask for it",
    text: "Post a request and we’ll email you the moment a matching part is listed.",
  },
  {
    Art: ChatArt,
    bg: "bg-ink-50",
    title: "Chat directly",
    text: "Message sellers inside Piqnex. Rate them after, so good sellers stand out.",
  },
];

const INTERVAL_MS = 3000;

/** Auto-advancing illustration slides for the login page (desktop only). */
export function AuthSlides() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (paused || reduced) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % SLIDES.length),
      INTERVAL_MS,
    );
    return () => window.clearInterval(id);
  }, [paused, reduced, index]);

  return (
    <aside
      className={`relative hidden overflow-hidden p-8 transition-colors duration-500 lg:sticky lg:top-24 lg:m-6 lg:flex lg:h-[calc(100vh-8rem)] lg:min-h-[480px] lg:flex-col lg:justify-between lg:gap-4 lg:self-start lg:rounded-3xl xl:p-10 ${SLIDES[index].bg}`}
      aria-roledescription="carousel"
      aria-label="What Piqnex is for"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="grid min-h-0 flex-1 [&>*]:col-start-1 [&>*]:row-start-1">
        {SLIDES.map(({ Art, title, text }, i) => (
          <div
            key={title}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${SLIDES.length}`}
            aria-hidden={i !== index}
            className={`flex min-h-0 flex-col justify-between gap-4 transition-all duration-500 ${
              i === index
                ? "translate-x-0 opacity-100"
                : "pointer-events-none translate-x-4 opacity-0"
            }`}
          >
            <div className="flex min-h-0 flex-1 items-center justify-center">
              <Art className="h-full max-h-[400px] w-full" />
            </div>
            <div>
              <h2 className="font-display text-2xl leading-tight text-ink-900 xl:text-3xl">
                {title}
              </h2>
              <p className="mt-2 max-w-md text-sm text-ink-600 xl:text-base">
                {text}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div
        className="flex items-center gap-2"
        role="tablist"
        aria-label="Choose slide"
      >
        {SLIDES.map(({ title }, i) => (
          <button
            key={title}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Show slide ${i + 1}: ${title}`}
            onClick={() => setIndex(i)}
            className={`h-2.5 rounded-full transition-all ${
              i === index
                ? "w-8 bg-clay-600"
                : "w-2.5 bg-ink-300 hover:bg-ink-400"
            }`}
          />
        ))}
      </div>
    </aside>
  );
}
