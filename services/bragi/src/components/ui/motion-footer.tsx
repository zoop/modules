import * as React from "react";
import { gsap } from "gsap";
import { ArrowUp, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

const MARQUEE_ITEMS = [
  "Read the photos",
  "Read the paperwork",
  "One report out",
  "Explainable by design",
  "Vahan-checked",
  "PDF & JSON",
];

function MagneticPill({
  href,
  children,
  variant = "ghost",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "accent" | "ghost";
}) {
  const ref = React.useRef<HTMLAnchorElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: "power3.out" });
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
  };

  return (
    <a
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn(
        "group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-colors",
        variant === "accent"
          ? "bg-brand text-navy-950 hover:bg-brand/90"
          : "border border-foreground/20 text-foreground hover:border-foreground/40 hover:bg-foreground/5",
      )}
    >
      {children}
      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
    </a>
  );
}

export default function MotionFooter() {
  const rootRef = React.useRef<HTMLElement>(null);
  const wordmarkRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Match the rest of the page: no authored entrance motion under reduced-motion.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      if (wordmarkRef.current) {
        gsap.fromTo(
          wordmarkRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" },
        );
      }
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const toTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer
      ref={rootRef}
      className="relative isolate overflow-hidden bg-aurora text-foreground [--foreground:#e8eef3]"
    >
      {/* grid + aurora backdrop (bg-aurora already gives navy gradient + glows) */}
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />

      {/* diagonal marquee */}
      <div className="relative -rotate-2 border-y border-white/10 bg-white/[0.02] py-4">
        <div className="flex gap-6 whitespace-nowrap will-change-transform marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-6 font-display text-sm font-medium uppercase tracking-widest text-white/70"
            >
              {item}
              <span className="text-brand">✦</span>
            </span>
          ))}
        </div>
      </div>

      <div className="relative mx-auto max-w-[90rem] px-6 pt-24 pb-10">
        {/* heading + CTAs */}
        <div className="max-w-2xl">
          <h2 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
            See it on your own claim files
          </h2>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <MagneticPill href="#demo" variant="accent">
              Request a demo
            </MagneticPill>
            <MagneticPill href="#developers">See the API</MagneticPill>
          </div>
        </div>

        {/* giant background wordmark */}
        <div
          ref={wordmarkRef}
          aria-hidden="true"
          className="pointer-events-none mt-16 select-none text-center font-display text-[clamp(2.5rem,14vw,13rem)] font-bold leading-none tracking-tighter text-white/[0.06]"
        >
          MODULES
        </div>

        {/* bottom row */}
        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Modules</p>
          <nav className="flex items-center gap-6">
            <a href="#" className="transition-colors hover:text-white">Privacy</a>
            <a href="#" className="transition-colors hover:text-white">Terms</a>
            <a href="#developers" className="transition-colors hover:text-white">Developers</a>
          </nav>
          <button
            type="button"
            onClick={toTop}
            aria-label="Back to top"
            className="group inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-medium text-white/70 transition-colors hover:border-white/40 hover:text-white"
          >
            Back to top
            <ArrowUp className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-33.333%); }
        }
        .marquee-track {
          animation: marquee-scroll 24s linear infinite;
        }
      `}</style>
    </footer>
  );
}
