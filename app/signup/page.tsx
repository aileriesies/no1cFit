"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/componentss/Navbar";

type Mode = "choose" | "email";

export default function SignupPage() {
  const [mode, setMode] = useState<Mode>("choose");
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    age: "",
    weight: "",
    height: "",
    gender: "",
  });

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [key]: e.target.value });

  async function handleOAuth(provider: "google" | "github") {
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) setError(error.message);
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { username: form.username } },
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          username: form.username || null,
          first_name: form.firstName,
          last_name: form.lastName,
          age: form.age ? Number(form.age) : null,
          weight: form.weight ? Number(form.weight) : null,
          height: form.height ? Number(form.height) : null,
          gender: form.gender,
          calorie_target: 2000,
        });

        if (profileError) {
          console.log(profileError);
          setError("Account created, but profile setup failed. You can complete it later.");
          return;
        }
      }

      window.location.href = "/dashboard";
    } catch (err) {
      console.log(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1B1B18]">
      <Navbar />

      <div className="min-h-screen flex items-center justify-center px-6 pt-24 pb-16">
        <div className="w-full max-w-md animate-fade-up">

          <p className="text-xs tracking-[0.25em] uppercase text-[#8C8C84] mb-2 font-[family-name:var(--font-body)]">
            Get started
          </p>
          <h1 className="text-5xl font-[family-name:var(--font-display)] font-extrabold uppercase tracking-tight mb-4">
            Create Account
          </h1>
          <div className="h-[6px] bg-[#1B1B18] mb-1" />
          <div className="h-[2px] bg-[#1B1B18] mb-6" />

          {error && (
            <p className="text-sm text-[#B3401F] font-[family-name:var(--font-body)] mb-4 border-l-2 border-[#B3401F] pl-3">
              {error}
            </p>
          )}

          {/* ---------- CHOOSE METHOD ---------- */}
          {mode === "choose" && (
            <div className="space-y-3">
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

              <div className="flex items-center gap-3 py-2">
                <div className="h-px bg-[#1B1B18]/15 flex-1" />
                <span className="text-xs uppercase tracking-wide text-[#8C8C84] font-[family-name:var(--font-body)]">
                  or use email
                </span>
                <div className="h-px bg-[#1B1B18]/15 flex-1" />
              </div>

              <button
                onClick={() => setMode("email")}
                className="w-full bg-[#1B1B18] text-[#FAFAF8] px-6 py-3.5 font-[family-name:var(--font-body)] font-semibold text-sm uppercase tracking-wide transition-transform duration-300 hover:-translate-y-0.5"
              >
                Sign up with Email
              </button>
            </div>
          )}

          {/* ---------- EMAIL FORM ---------- */}
          {mode === "email" && (
            <form onSubmit={handleSignup} className="space-y-4">
              <button
                type="button"
                onClick={() => setMode("choose")}
                className="text-xs uppercase tracking-wide text-[#8C8C84] hover:text-[#1B1B18] transition-colors mb-1 font-[family-name:var(--font-body)]"
              >
                ← Back to options
              </button>

              <Field label="Username" value={form.username} onChange={update("username")} placeholder="e.g. aileri_dev" />
              <Field label="Email" type="email" value={form.email} onChange={update("email")} placeholder="you@email.com" required />
              <Field label="Password" type="password" value={form.password} onChange={update("password")} placeholder="At least 6 characters" required />
              <Field label="Confirm Password" type="password" value={form.confirmPassword} onChange={update("confirmPassword")} placeholder="Re-enter your password" required />

              {/* Expandable extra info */}
              <button
                type="button"
                onClick={() => setShowMore(!showMore)}
                className="flex items-center justify-between w-full text-xs uppercase tracking-wide text-[#8C8C84] hover:text-[#1B1B18] transition-colors font-[family-name:var(--font-body)] pt-2"
              >
                <span>Add profile details (optional)</span>
                <span className={`transition-transform duration-300 ${showMore ? "rotate-180" : ""}`}>▾</span>
              </button>

              <div
                className={`grid overflow-hidden transition-all duration-500 ease-in-out ${
                  showMore ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden space-y-4 pt-1">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="First Name" value={form.firstName} onChange={update("firstName")} />
                    <Field label="Last Name" value={form.lastName} onChange={update("lastName")} />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <Field label="Age" type="number" value={form.age} onChange={update("age")} />
                    <Field label="Weight (kg)" type="number" value={form.weight} onChange={update("weight")} />
                    <Field label="Height (cm)" type="number" value={form.height} onChange={update("height")} />
                  </div>
                  <div className="border-b border-[#1B1B18]/20 pb-2">
                    <label className="block text-xs uppercase tracking-wide text-[#8C8C84] mb-1 font-[family-name:var(--font-body)]">
                      Gender
                    </label>
                    <select
                      value={form.gender}
                      onChange={update("gender")}
                      className="w-full bg-transparent outline-none text-base font-[family-name:var(--font-body)] py-1"
                    >
                      <option value="">Prefer not to say</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1B1B18] text-[#FAFAF8] px-6 py-3.5 font-[family-name:var(--font-body)] font-semibold text-sm uppercase tracking-wide transition-transform duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 mt-2"
              >
                {loading ? "Creating..." : "Create Account"}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-[#8C8C84] mt-8 font-[family-name:var(--font-body)]">
            Already have an account?{" "}
            <Link href="/login" className="text-[#1B1B18] font-semibold hover:text-[#2F5233] transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------- reusable field ---------- */
function Field({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="border-b border-[#1B1B18]/20 pb-2">
      <label className="block text-xs uppercase tracking-wide text-[#8C8C84] mb-1 font-[family-name:var(--font-body)]">
        {label}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent outline-none text-base font-[family-name:var(--font-body)] py-1"
      />
    </div>
  );
}