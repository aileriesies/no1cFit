"use client";

import Link from "next/link";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#FAFAF8]/90 backdrop-blur-sm border-b border-[#1B1B18]/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 border-2 border-[#1B1B18] flex items-center justify-center font-[family-name:var(--font-display)] font-extrabold text-sm group-hover:bg-[#1B1B18] group-hover:text-[#FAFAF8] transition-colors duration-300">
            N1
          </div>
          <span className="font-[family-name:var(--font-display)] font-extrabold uppercase tracking-tight text-lg">
            No1CFit
          </span>
        </Link>

        <div className="hidden sm:flex items-center gap-6 font-[family-name:var(--font-body)] text-sm">
          <Link href="/story" className="text-[#8C8C84] hover:text-[#1B1B18] transition-colors">
            Our Story
          </Link>
          <Link href="/login" className="text-[#8C8C84] hover:text-[#1B1B18] transition-colors">          </Link>
          <Link href="/signup"> 
            <button className="border-2 border-[#1B1B18] px-4 py-1.5 font-semibold uppercase tracking-wide text-xs transition-all duration-300 hover:bg-[#1B1B18] hover:text-[#FAFAF8]">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}