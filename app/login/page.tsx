"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/componentss/Navbar";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleOAuth(
  provider: "google" | "github"
) {
  setError("");

  const { error } =
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo:
          `${window.location.origin}/auth/callback`
      }
    });

  if (error) {
    setError(error.message);
  }
}

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1B1B18]">
      <Navbar />

      <div className="min-h-screen flex items-center justify-center px-6 pt-24 pb-16">
        <div className="w-full max-w-md animate-fade-up">
          <p className="text-xs tracking-[0.25em] uppercase text-[#8C8C84] mb-2 font-[family-name:var(--font-body)]">
            Welcome back
          </p>
          <h1 className="text-5xl font-[family-name:var(--font-display)] font-extrabold uppercase tracking-tight mb-4">
            Sign In
          </h1>
          <div className="h-[6px] bg-[#1B1B18] mb-1" />
          <div className="h-[2px] bg-[#1B1B18] mb-6" />

          {error && (
            <p className="text-sm text-[#B3401F] font-[family-name:var(--font-body)] mb-4 border-l-2 border-[#B3401F] pl-3">
              {error}
            </p>
          )}

          <div className="space-y-3 mb-4">
            <button
              onClick={() => handleOAuth("google")}
              className="w-full flex items-center justify-center gap-3 border-2 border-[#1B1B18] px-6 py-3.5 font-[family-name:var(--font-body)] font-semibold text-sm transition-all duration-300 hover:bg-[#1B1B18] hover:text-[#FAFAF8]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 11v2.4h6.7c-.3 1.6-1.9 4.8-6.7 4.8-4 0-7.3-3.3-7.3-7.4S8 3.4 12 3.4c2.3 0 3.8.9 4.7 1.8l3.2-3.1C17.9.4 15.2-.6 12-.6 5.7-.6.6 4.5.6 10.8s5.1 11.4 11.4 11.4c6.6 0 11-4.6 11-11.1 0-.7-.1-1.3-.2-1.9H12z" />
              </svg>
              Continue with Google
            </button>

            <button
              onClick={() => handleOAuth("github")}
              className="w-full flex items-center justify-center gap-3 border-2 border-[#1B1B18] px-6 py-3.5 font-[family-name:var(--font-body)] font-semibold text-sm transition-all duration-300 hover:bg-[#1B1B18] hover:text-[#FAFAF8]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.7.1-.7 1.2.1 1.9 1.3 1.9 1.3 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.4-1.3-5.4-5.9 0-1.3.5-2.4 1.3-3.2-.1-.3-.6-1.5.1-3.2 0 0 1-.3 3.4 1.2a11.8 11.8 0 0 1 6.2 0c2.4-1.5 3.4-1.2 3.4-1.2.7 1.7.2 2.9.1 3.2.8.8 1.3 1.9 1.3 3.2 0 4.6-2.7 5.6-5.4 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3Z" />
              </svg>
              Continue with GitHub
            </button>
          </div>

          <div className="flex items-center gap-3 py-2 mb-4">
            <div className="h-px bg-[#1B1B18]/15 flex-1" />
            <span className="text-xs uppercase tracking-wide text-[#8C8C84] font-[family-name:var(--font-body)]">
              or use email
            </span>
            <div className="h-px bg-[#1B1B18]/15 flex-1" />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="border-b border-[#1B1B18]/20 pb-2">
              <label className="block text-xs uppercase tracking-wide text-[#8C8C84] mb-1 font-[family-name:var(--font-body)]">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent outline-none text-base font-[family-name:var(--font-body)] py-1"
                placeholder="you@email.com"
              />
            </div>

            <div className="border-b border-[#1B1B18]/20 pb-2">
              <label className="block text-xs uppercase tracking-wide text-[#8C8C84] mb-1 font-[family-name:var(--font-body)]">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent outline-none text-base font-[family-name:var(--font-body)] py-1"
                placeholder="Your password"
              />
            </div>

            <div className="text-right">
              <Link href="/forgot-password" className="text-xs text-[#8C8C84] hover:text-[#1B1B18] transition-colors font-[family-name:var(--font-body)]">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1B1B18] text-[#FAFAF8] px-6 py-3.5 font-[family-name:var(--font-body)] font-semibold text-sm uppercase tracking-wide transition-transform duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-[#8C8C84] mt-8 font-[family-name:var(--font-body)]">
            Don't have an account?{" "}
            <Link href="/signup" className="text-[#1B1B18] font-semibold hover:text-[#2F5233] transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}