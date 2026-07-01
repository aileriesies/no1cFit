"use client";

import Link from "next/link";

const features = [
  { label: "Smart Food Search", value: "USDA-powered" },
  { label: "AI Meal Logging", value: "One tap" },
  { label: "Real Progress", value: "Every day" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1B1B18] flex items-center justify-center px-6">
      <div className="w-full max-w-xl">

        {/* Eyebrow */}
        <p
          className="animate-fade-up text-xs tracking-[0.25em] uppercase text-[#8C8C84] mb-3 font-[family-name:var(--font-body)]"
          style={{ animationDelay: "0ms" }}
        >
          Nutrition, simplified
        </p>

        {/* Title */}
        <h1
          className="animate-fade-up text-7xl sm:text-8xl font-[family-name:var(--font-display)] font-extrabold uppercase tracking-tight leading-[0.9]"
          style={{ animationDelay: "80ms" }}
        >
          No1CFit
        </h1>

        {/* Nutrition-label double rule */}
        <div className="mt-5 mb-4">
          <div className="h-[6px] bg-[#1B1B18] animate-rule" style={{ animationDelay: "260ms" }} />
          <div className="h-[2px] bg-[#1B1B18] mt-1 animate-rule" style={{ animationDelay: "340ms" }} />
        </div>

        {/* Serving size gag line */}
        <div
          className="animate-fade-up flex justify-between text-sm font-[family-name:var(--font-body)] font-semibold pb-3 border-b border-[#1B1B18]/15"
          style={{ animationDelay: "420ms" }}
        >
          <span>Serving Size: 1 Life</span>
          <span>Servings Per Container: ∞</span>
        </div>

        {/* Feature rows, styled like label line items */}
        <div className="animate-fade-up mt-1 mb-8" style={{ animationDelay: "500ms" }}>
          {features.map((f, i) => (
            <div
              key={f.label}
              className={`flex items-center justify-between py-2.5 text-sm font-[family-name:var(--font-body)] ${
                i !== features.length - 1 ? "border-b border-[#1B1B18]/10" : ""
              }`}
            >
              <span className="text-[#1B1B18]">{f.label}</span>
              <span className="font-semibold text-[#2F5233]">{f.value}</span>
            </div>
          ))}
        </div>

        {/* Tagline */}
        <p
          className="animate-fade-up text-sm italic text-[#8C8C84] mb-8 font-[family-name:var(--font-body)]"
          style={{ animationDelay: "560ms" }}
        >
          "Small daily actions become life-changing results."
        </p>

        {/* CTAs */}
        <div
          className="animate-fade-up flex gap-3 flex-wrap"
          style={{ animationDelay: "640ms" }}
        >
          <Link href="/signup">
            <button className="group relative bg-[#1B1B18] text-[#FAFAF8] px-8 py-3.5 font-[family-name:var(--font-body)] font-semibold text-sm uppercase tracking-wide overflow-hidden transition-transform duration-300 hover:-translate-y-0.5">
              <span className="relative z-10">Create Account</span>
              <span className="absolute inset-0 bg-[#F4A331] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="absolute inset-0 flex items-center justify-center z-10 text-[#1B1B18] font-semibold text-sm uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                Create Account
              </span>
            </button>
          </Link>

          <Link href="/login">
            <button className="border-2 border-[#1B1B18] px-8 py-3.5 font-[family-name:var(--font-body)] font-semibold text-sm uppercase tracking-wide transition-all duration-300 hover:bg-[#1B1B18] hover:text-[#FAFAF8] hover:-translate-y-0.5">
              Sign In
            </button>
          </Link>
        </div>

        {/* Ghost links */}
        <div
          className="animate-fade-up mt-6 font-[family-name:var(--font-body)] flex items-center justify-center gap-6"
          style={{ animationDelay: "720ms" }}
        >
          <Link
            href="/story"
            className="text-sm text-[#8C8C84] hover:text-[#2F5233] transition-colors duration-300 inline-flex items-center gap-1 group"
          >
            Our Story
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>

          <span className="text-[#1B1B18]/15">|</span>

          <Link
            href="/dashboard"
            className="text-sm text-[#8C8C84] hover:text-[#2F5233] transition-colors duration-300 inline-flex items-center gap-1 group"
          >
            Continue to Dashboard
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}