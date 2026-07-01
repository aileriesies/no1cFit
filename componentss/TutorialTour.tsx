"use client";

import { useEffect, useState, useCallback } from "react";

export type TourStep = {
  target: string;       // matches data-tour="..." attribute
  title: string;
  description: string;
};

const STORAGE_KEY = "no1cfit_tutorial_seen";

export function hasSeenTutorial() {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(STORAGE_KEY) === "true";
}

function markTutorialSeen() {
  localStorage.setItem(STORAGE_KEY, "true");
}

export function TutorialTour({
  steps,
  active,
  onClose,
}: {
  steps: TourStep[];
  active: boolean;
  onClose: () => void;
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);

  const measure = useCallback(() => {
    const step = steps[stepIndex];
    if (!step) return;
    const el = document.querySelector(`[data-tour="${step.target}"]`);
    if (el) {
      setRect(el.getBoundingClientRect());
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      setRect(null);
    }
  }, [stepIndex, steps]);

  useEffect(() => {
    if (!active) return;
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [active, measure]);

  useEffect(() => {
    if (active) setStepIndex(0);
  }, [active]);

  if (!active) return null;

  const step = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;

  function finish() {
    markTutorialSeen();
    onClose();
  }

  function next() {
    if (isLast) {
      finish();
    } else {
      setStepIndex((i) => i + 1);
    }
  }

  // Tooltip position: below target if room, else above
  const tooltipTop = rect ? (rect.bottom + 220 < window.innerHeight ? rect.bottom + 16 : rect.top - 220) : window.innerHeight / 2 - 100;
  const tooltipLeft = rect ? Math.min(Math.max(rect.left, 16), window.innerWidth - 336) : window.innerWidth / 2 - 160;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Dark overlay with spotlight cutout */}
      <div
        className="absolute inset-0 transition-all duration-300"
        style={{
          boxShadow: rect
            ? `0 0 0 9999px rgba(27,27,24,0.7)`
            : "none",
          background: rect ? "transparent" : "rgba(27,27,24,0.7)",
          ...(rect && {
            clipPath: `polygon(
              0 0, 0 100%, ${rect.left - 6}px 100%, ${rect.left - 6}px ${rect.top - 6}px,
              ${rect.right + 6}px ${rect.top - 6}px, ${rect.right + 6}px ${rect.bottom + 6}px,
              ${rect.left - 6}px ${rect.bottom + 6}px, ${rect.left - 6}px 100%, 100% 100%, 100% 0
            )`,
          }),
        }}
      />

      {/* Highlight ring around target */}
      {rect && (
        <div
          className="absolute border-2 border-[#F4A331] pointer-events-none transition-all duration-300"
          style={{
            top: rect.top - 6,
            left: rect.left - 6,
            width: rect.width + 12,
            height: rect.height + 12,
          }}
        />
      )}

      {/* Tooltip card */}
      <div
        className="absolute w-[320px] bg-[#FAFAF8] border-2 border-[#1B1B18] p-5 transition-all duration-300"
        style={{ top: tooltipTop, left: tooltipLeft }}
      >
        <div className="flex items-center justify-between text-xs uppercase tracking-wide text-[#8C8C84] mb-3 font-[family-name:var(--font-body)]">
          <span>Step {stepIndex + 1} / {steps.length}</span>
          <button onClick={finish} className="hover:text-[#1B1B18] transition-colors">
            Skip
          </button>
        </div>

        <div className="h-[3px] bg-[#1B1B18]/10 mb-4">
          <div
            className="h-full bg-[#2F5233] transition-all duration-300"
            style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>

        <h3 className="font-[family-name:var(--font-display)] font-extrabold uppercase text-lg tracking-tight mb-2">
          {step.title}
        </h3>
        <p className="font-[family-name:var(--font-body)] text-sm text-[#1B1B18]/80 leading-relaxed mb-5">
          {step.description}
        </p>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
            disabled={stepIndex === 0}
            className="text-xs uppercase tracking-wide text-[#8C8C84] hover:text-[#1B1B18] transition-colors disabled:opacity-0 font-[family-name:var(--font-body)]"
          >
            ← Back
          </button>
          <button
            onClick={next}
            className="bg-[#1B1B18] text-[#FAFAF8] px-5 py-2 font-[family-name:var(--font-body)] font-semibold text-xs uppercase tracking-wide transition-transform duration-300 hover:-translate-y-0.5"
          >
            {isLast ? "Finish" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}