"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";

/* ---------- scroll reveal ---------- */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ---------- section label, nutrition-panel style ---------- */
function SectionLabel({ index, total, title }: { index: string; total: string; title: string }) {
  return (
    <Reveal className="mb-8">
      <div className="flex items-baseline justify-between border-b-2 border-[#1B1B18] pb-2 mb-2">
        <span className="text-xs tracking-[0.25em] uppercase text-[#8C8C84] font-[family-name:var(--font-body)]">
          Section {index} / {total}
        </span>
      </div>
      <h2 className="text-4xl sm:text-5xl font-[family-name:var(--font-display)] font-extrabold uppercase tracking-tight">
        {title}
      </h2>
    </Reveal>
  );
}

export default function StoryPage() {
  return (
    <div className="bg-[#FAFAF8] text-[#1B1B18]">

      {/* ---------- HERO ---------- */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <Reveal>
          <p className="text-xs tracking-[0.3em] uppercase text-[#8C8C84] mb-4 font-[family-name:var(--font-body)]">
            The Story Behind
          </p>
        </Reveal>
        <Reveal delay={100}>
          <h1 className="text-6xl sm:text-8xl font-[family-name:var(--font-display)] font-extrabold uppercase tracking-tight leading-[0.9]">
            No1CFit
          </h1>
        </Reveal>
        <Reveal delay={220} className="mt-6 max-w-md">
          <p className="text-[#8C8C84] font-[family-name:var(--font-body)] text-lg">
            No one cares where you're starting. Everybody can fit — today.
          </p>
        </Reveal>
        <Reveal delay={340} className="mt-14">
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <span className="text-xs uppercase tracking-widest text-[#8C8C84] font-[family-name:var(--font-body)]">
              Scroll
            </span>
            <span className="text-lg">↓</span>
          </div>
        </Reveal>
      </section>

      {/* ---------- 01 THE BEGINNING ---------- */}
      <section className="max-w-2xl mx-auto px-6 py-28">
        <SectionLabel index="01" total="08" title="How it was built" />
        <Reveal delay={100}>
          <p className="font-[family-name:var(--font-body)] text-lg leading-relaxed text-[#1B1B18]/80 mb-4">
            No1CFit started the way most real things do — not with a perfect plan, but with a blank
            VS Code window and a stubborn idea. No boilerplate, no template. Just Next.js, Supabase,
            and a habit of building by feel instead of following a script line by line.
          </p>
          <p className="font-[family-name:var(--font-body)] text-lg leading-relaxed text-[#1B1B18]/80">
            Auth first. Then a way to actually search real food data. Then a dashboard to see it
            all come together. Piece by piece, the same way anyone builds a healthier routine —
            one small, deliberate step at a time.
          </p>
        </Reveal>
      </section>

      {/* ---------- 02 THE SPARK ---------- */}
      <section className="max-w-2xl mx-auto px-6 py-28">
        <SectionLabel index="02" total="08" title="Where it came from" />
        <Reveal delay={100}>
          <p className="font-[family-name:var(--font-body)] text-lg leading-relaxed text-[#1B1B18]/80">
            Most calorie trackers feel like spreadsheets wearing an app icon — cold, clinical,
            built for people who already know exactly what they're doing. No1CFit came from
            wanting the opposite: something that meets people where they actually are, whether
            that's day one or day one thousand.
          </p>
        </Reveal>
      </section>

      {/* ---------- 03 WHAT IS IT ---------- */}
      <section className="max-w-2xl mx-auto px-6 py-28">
        <SectionLabel index="03" total="08" title="What No1CFit is" />
        <Reveal delay={100}>
          <p className="font-[family-name:var(--font-body)] text-lg leading-relaxed text-[#1B1B18]/80 mb-6">
            An AI-assisted food and fitness tracker. Search real food data, log meals in seconds,
            and see your progress laid out clearly — no guesswork, no shame, no 40-step forms.
          </p>
        </Reveal>
        <Reveal delay={200}>
          <div className="border-t border-[#1B1B18]/15">
            {[
              ["Food Search", "Real USDA nutrition data"],
              ["Meal Logging", "Seconds, not minutes"],
              ["Progress Dashboard", "Clear, not clinical"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex justify-between py-3 border-b border-[#1B1B18]/15 font-[family-name:var(--font-body)] text-sm"
              >
                <span>{label}</span>
                <span className="font-semibold text-[#2F5233]">{value}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ---------- 04 THE NAME ---------- */}
      <section className="max-w-2xl mx-auto px-6 py-28 text-center">
        <SectionLabel index="04" total="08" title="Why 'No1CFit'" />
        <Reveal delay={100}>
          <p className="font-[family-name:var(--font-body)] text-lg leading-relaxed text-[#1B1B18]/80 mb-10">
            It's not just a name. It's the whole point, hiding in plain sight.
          </p>
        </Reveal>
        <div className="space-y-3">
          {["NO ONE CARES", "EVERYBODY CAN FIT", "TODAY"].map((line, i) => (
            <Reveal key={line} delay={200 + i * 150}>
              <p className="text-3xl sm:text-4xl font-[family-name:var(--font-display)] font-extrabold uppercase tracking-tight">
                {line}
              </p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={700} className="mt-10">
          <p className="font-[family-name:var(--font-body)] text-[#8C8C84] italic">
            Where you started doesn't matter. What you do today does.
          </p>
        </Reveal>
      </section>

      {/* ---------- 05 WHO IT'S FOR ---------- */}
      <section className="max-w-2xl mx-auto px-6 py-28">
        <SectionLabel index="05" total="08" title="Who it's for" />
        <Reveal delay={100}>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "Complete beginners who don't know where to start",
              "Busy people who need logging to take seconds, not minutes",
              "Anyone tracking macros without wanting to feel like a lab report",
              "Anyone who's tried other apps and quit because they felt cold",
            ].map((text) => (
              <div
                key={text}
                className="border border-[#1B1B18]/20 p-5 font-[family-name:var(--font-body)] text-sm leading-relaxed hover:border-[#1B1B18] hover:bg-[#1B1B18] hover:text-[#FAFAF8] transition-all duration-300"
              >
                {text}
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ---------- 06+07 MISSION / VISION ---------- */}
      <section className="max-w-2xl mx-auto px-6 py-28">
        <div className="grid sm:grid-cols-2 gap-8">
          <Reveal>
            <span className="text-xs tracking-[0.25em] uppercase text-[#8C8C84] font-[family-name:var(--font-body)]">
              Section 06 / 08
            </span>
            <h3 className="text-3xl font-[family-name:var(--font-display)] font-extrabold uppercase tracking-tight mt-2 mb-4 border-b-2 border-[#1B1B18] pb-3">
              Mission
            </h3>
            <p className="font-[family-name:var(--font-body)] text-base leading-relaxed text-[#1B1B18]/80">
              Make tracking food and fitness feel simple enough that anyone actually sticks with
              it — not for a week, but for good.
            </p>
          </Reveal>
          <Reveal delay={150}>
            <span className="text-xs tracking-[0.25em] uppercase text-[#8C8C84] font-[family-name:var(--font-body)]">
              Section 07 / 08
            </span>
            <h3 className="text-3xl font-[family-name:var(--font-display)] font-extrabold uppercase tracking-tight mt-2 mb-4 border-b-2 border-[#1B1B18] pb-3">
              Vision
            </h3>
            <p className="font-[family-name:var(--font-body)] text-base leading-relaxed text-[#1B1B18]/80">
              A world where "getting fit" isn't gatekept by expensive apps or intimidating
              interfaces — where day one feels just as welcome as day one thousand.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------- 08 THE BUILDER ---------- */}
      <section className="max-w-2xl mx-auto px-6 py-28">
        <SectionLabel index="08" total="08" title="Built by" />
        <Reveal delay={100}>
          <div className="border-t-2 border-[#1B1B18] pt-6">
            <p className="text-2xl font-[family-name:var(--font-display)] font-bold uppercase tracking-tight mb-2">
              Aileri
            </p>
            <p className="font-[family-name:var(--font-body)] text-base leading-relaxed text-[#1B1B18]/80 mb-4">
              IT graduate, full-stack developer, building No1CFit end to end — from auth to the
              last pixel — as a hands-on way to grow, learn, and ship something real.
            </p>
            <div className="flex gap-4 text-sm font-[family-name:var(--font-body)] font-semibold">
              <a href="https://ibe-profile.vercel.app/" className="hover:text-[#2F5233] transition-colors">Portfolio ↗</a>
              <a href="https://github.com/aileriesies" className="hover:text-[#2F5233] transition-colors">GitHub ↗</a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center border-t-2 border-[#1B1B18]">
        <Reveal>
          <h2 className="text-4xl sm:text-5xl font-[family-name:var(--font-display)] font-extrabold uppercase tracking-tight mb-6">
            Ready to fit today?
          </h2>
        </Reveal>
        <Reveal delay={150}>
          <Link href="/signup">
            <button className="bg-[#1B1B18] text-[#FAFAF8] px-8 py-3.5 font-[family-name:var(--font-body)] font-semibold text-sm uppercase tracking-wide transition-transform duration-300 hover:-translate-y-0.5">
              Create Account
            </button>
          </Link>
        </Reveal>
      </section>
    </div>
  );
}