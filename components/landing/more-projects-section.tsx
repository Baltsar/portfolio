"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ProjectCard } from "@/components/live-project/project-card";
import type { Messages } from "@/lib/i18n";

type MoreProjectsSectionProps = {
  messages: Messages;
};

export function MoreProjectsSection({ messages }: MoreProjectsSectionProps) {
  const [open, setOpen] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const updateScrollState = useCallback(() => {
    const el = sliderRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  useEffect(() => {
    if (!open) return;
    const el = sliderRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState);
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      ro.disconnect();
    };
  }, [open, updateScrollState]);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  return (
    <section
      id="more-work"
      className="mt-10 border-t border-[var(--border-glass)] pt-8"
      aria-label={messages.sections.moreWork}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-3 rounded-lg py-2.5 pl-2 pr-2 text-left font-statement text-xs font-medium uppercase tracking-[0.2em] text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--accent-blue)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-blue)] sm:text-sm"
        aria-expanded={open}
        aria-controls="more-projects-slider"
      >
        <span>{messages.nav.moreProjects}</span>
        <span
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[var(--bg-card)] text-[var(--text-primary)] shadow-[0_2px_8px_rgba(0,0,0,0.25)] transition-all hover:bg-[var(--bg-hover)] hover:text-[var(--accent-blue)]"
          aria-hidden
        >
          {open ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 15l-6-6-6 6" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          )}
        </span>
      </button>

      <div
        id="more-projects-slider"
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
        aria-hidden={!open}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="relative pt-6">
            <div
              ref={sliderRef}
              className="flex gap-6 overflow-x-auto pb-2 scroll-smooth scrollbar-hide"
            >
              {messages.projects.slice(2).map((project, i) => (
                <div
                  key={i}
                  className="min-w-[280px] max-w-[280px] flex-shrink-0 sm:min-w-[300px] sm:max-w-[300px]"
                >
                  <ProjectCard project={project} messages={messages} />
                </div>
              ))}
            </div>
            {open && canScrollLeft && (
              <button
                type="button"
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--bg-card)] text-[var(--text-primary)] shadow-[0_2px_12px_rgba(0,0,0,0.35)] transition-all hover:bg-[var(--bg-hover)] hover:text-[var(--accent-blue)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-blue)]"
                aria-label={messages.nav.scrollLeft}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            {open && canScrollRight && (
              <button
                type="button"
                onClick={scrollRight}
                className="absolute right-0 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--bg-card)] text-[var(--text-primary)] shadow-[0_2px_12px_rgba(0,0,0,0.35)] transition-all hover:bg-[var(--bg-hover)] hover:text-[var(--accent-blue)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-blue)]"
                aria-label={messages.nav.scrollRight}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
