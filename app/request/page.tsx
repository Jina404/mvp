"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  CheckCircle2,
  ChevronDown,
  Lock,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import logo from "../../logo.png";
import { addAccessRequest } from "@/lib/mockDb";

/* ─── Constants ────────────────────────────────────────────────────────────── */

const ORG_TYPES = ["Business / Corporate", "NGO", "CBO", "Individual"];

/* ─── Helpers ──────────────────────────────────────────────────────────────── */

type FormState = {
  orgName: string;
  orgType: string;
  location: string;
  website: string;
  about: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  consent: boolean;
};

const initial: FormState = {
  orgName: "",
  orgType: "",
  location: "",
  website: "",
  about: "",
  fullName: "",
  email: "",
  phone: "",
  role: "",
  consent: false,
};

type Errors = Partial<Record<keyof FormState, string>>;

function validate(f: FormState): Errors {
  const e: Errors = {};
  if (!f.orgName.trim()) e.orgName = "Organization name is required.";
  if (!f.orgType) e.orgType = "Organization type is required.";
  if (!f.location.trim()) e.location = "Location is required.";
  if (!f.about.trim()) e.about = "Please tell us about your organization.";
  if (!f.fullName.trim()) e.fullName = "Full name is required.";
  if (!f.email.trim()) e.email = "Work email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
    e.email = "Enter a valid email address.";
  if (!f.phone.trim()) e.phone = "Phone number is required.";
  if (!f.role.trim()) e.role = "Role is required.";
  if (!f.consent) e.consent = "You must agree to continue.";
  return e;
}

/* ─── Custom Select ────────────────────────────────────────────────────────── */

function FormSelect({
  value,
  onChange,
  options,
  placeholder,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  error?: boolean;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-10 w-full appearance-none rounded-lg border bg-white px-3 pr-9 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 ${
          error
            ? "border-red-300 focus:ring-red-500/30 focus:border-red-500"
            : "border-slate-200 hover:border-slate-300"
        } ${!value ? "text-slate-400 dark:text-slate-500" : "text-slate-900 dark:text-slate-100"}`}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
}

/* ─── Field wrapper ────────────────────────────────────────────────────────── */

function Field({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-[13px] font-medium text-slate-700 dark:text-slate-200">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {hint && (
        <p className="text-[11px] leading-tight text-slate-400 dark:text-slate-500">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p className="mt-0.5 text-[11px] font-medium text-red-500">{error}</p>
      )}
    </div>
  );
}

/* ─── Section heading ──────────────────────────────────────────────────────── */

function SectionHeading({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-2.5 pb-0.5">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-purple-50 text-purple-700 dark:bg-purple-900/40 dark:text-purple-200">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div>
        <h3 className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </h3>
        <p className="text-[11px] text-slate-400 dark:text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  PAGE                                                                      */
/* ═══════════════════════════════════════════════════════════════════════════ */

export default function RequestAccessPage() {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    // Simulated submission delay
    await new Promise((r) => setTimeout(r, 1800));
        addAccessRequest({
          orgName: form.orgName,
          orgType: form.orgType,
          location: form.location,
          website: form.website,
          about: form.about,
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          role: form.role,
          consent: form.consent
        });
        setSubmitting(false);
        setSubmitted(true);
  };

  /* ── Success state ─────────────────────────────────────────────────────── */

  if (submitted) {
    return (
      <div className="login-container">
        <div className="login-card" style={{ maxWidth: 480 }}>
          <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/30">
                <CheckCircle2 className="h-7 w-7 text-emerald-600" />
              </div>
              <h2 className="mt-5 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                Request received
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                We&apos;ll email you within <strong className="text-slate-700 dark:text-slate-200">24–48 hours</strong> with
                next steps. In the meantime, feel free to reach out directly.
              </p>

              <div className="mt-8 w-full space-y-3 rounded-xl bg-slate-50 px-5 py-4 text-left dark:bg-slate-800/60">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-300">info@skilllinknexus.com</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-300">+254 202 009 009</span>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-lg bg-purple-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-purple-800"
                >
                  Back to home
                </Link>
                <Link
                  href="/#samples"
                  className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  View sample deliveries
                </Link>
              </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Form ───────────────────────────────────────────────────────────────── */

  return (
    <div className="login-container" style={{ alignItems: "flex-start", paddingTop: "1.5rem", paddingBottom: "1.5rem" }}>

      <div className="w-full" style={{ maxWidth: 920 }}>
        {/* ─── Header ──────────────────────────────────────────────────── */}
        <div className="mb-5 flex flex-col items-center text-center">
          <Image src={logo} alt="SkillLink Nexus" width={40} height={40} priority />
          <h1 className="mt-3 text-xl font-semibold text-slate-900 dark:text-slate-100">
            Request access to the Client Portal
          </h1>
          <p className="mt-1 text-[13px] text-slate-500 dark:text-slate-400">
            Create a client workspace for your organization. We&apos;ll verify details and activate your account.
          </p>
        </div>

        {/* ─── Form ───────────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} noValidate>

          {/* 2-col cards on desktop, stacked on mobile */}
          <div className="grid gap-4 lg:grid-cols-2">

            {/* ── Left card: Organization details ─────────────────────── */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <SectionHeading
                icon={Building2}
                title="Organization details"
                subtitle="Tell us about your organization."
              />

              <div className="mt-4 space-y-3">
                <Field label="Organization name" required error={errors.orgName}>
                  <Input
                    value={form.orgName}
                    onChange={(e) => set("orgName", e.target.value)}
                    placeholder="e.g. Acme Logistics / Hope Community CBO"
                    className={`h-9 rounded-lg border-slate-200 bg-white text-sm hover:border-slate-300 focus-visible:ring-purple-500/30 focus-visible:border-purple-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 ${errors.orgName ? "border-red-300" : ""}`}
                  />
                </Field>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Organization type" required error={errors.orgType}>
                    <FormSelect
                      value={form.orgType}
                      onChange={(v) => set("orgType", v)}
                      options={ORG_TYPES}
                      placeholder="Select type"
                      error={!!errors.orgType}
                    />
                  </Field>

                  <Field label="Location" required error={errors.location} hint="City, Country">
                    <Input
                      value={form.location}
                      onChange={(e) => set("location", e.target.value)}
                      placeholder="e.g. Nairobi, Kenya"
                      className={`h-9 rounded-lg border-slate-200 bg-white text-sm hover:border-slate-300 focus-visible:ring-purple-500/30 focus-visible:border-purple-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 ${errors.location ? "border-red-300" : ""}`}
                    />
                  </Field>
                </div>

                <Field label="Website" hint="Optional">
                  <Input
                    value={form.website}
                    onChange={(e) => set("website", e.target.value)}
                    placeholder="https://example.com"
                    className="h-9 rounded-lg border-slate-200 bg-white text-sm hover:border-slate-300 focus-visible:ring-purple-500/30 focus-visible:border-purple-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
                  />
                </Field>

                <Field label="About the organization" required error={errors.about} hint="What do you do? Who do you serve?">
                  <Textarea
                    value={form.about}
                    onChange={(e) => set("about", e.target.value)}
                    placeholder="e.g. We provide last-mile delivery for SMEs across Nairobi…"
                    rows={3}
                    className={`max-h-24 rounded-lg border-slate-200 bg-white text-sm hover:border-slate-300 focus-visible:ring-purple-500/30 focus-visible:border-purple-500 resize-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 ${errors.about ? "border-red-300" : ""}`}
                  />
                </Field>
              </div>
            </div>

            {/* ── Right card: Account owner ────────────────────────────── */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <SectionHeading
                icon={User}
                title="Account owner (primary contact)"
                subtitle="Who should we activate and coordinate with?"
              />

              <div className="mt-4 space-y-3">
                <Field label="Full name" required error={errors.fullName}>
                  <Input
                    value={form.fullName}
                    onChange={(e) => set("fullName", e.target.value)}
                    placeholder="e.g. Jane Muthoni"
                    className={`h-9 rounded-lg border-slate-200 bg-white text-sm hover:border-slate-300 focus-visible:ring-purple-500/30 focus-visible:border-purple-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 ${errors.fullName ? "border-red-300" : ""}`}
                  />
                </Field>

                <Field label="Work email" required error={errors.email}>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="e.g. jane@company.co.ke"
                    className={`h-9 rounded-lg border-slate-200 bg-white text-sm hover:border-slate-300 focus-visible:ring-purple-500/30 focus-visible:border-purple-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 ${errors.email ? "border-red-300" : ""}`}
                  />
                </Field>

                <Field label="Phone number (with country code)" required error={errors.phone}>
                  <Input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="e.g. +254 7XX XXX XXX"
                    className={`h-9 rounded-lg border-slate-200 bg-white text-sm hover:border-slate-300 focus-visible:ring-purple-500/30 focus-visible:border-purple-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 ${errors.phone ? "border-red-300" : ""}`}
                  />
                </Field>

                <Field label="Role / title" required error={errors.role}>
                  <Input
                    value={form.role}
                    onChange={(e) => set("role", e.target.value)}
                    placeholder="e.g. Operations Manager / Founder / Program Lead"
                    className={`h-9 rounded-lg border-slate-200 bg-white text-sm hover:border-slate-300 focus-visible:ring-purple-500/30 focus-visible:border-purple-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 ${errors.role ? "border-red-300" : ""}`}
                  />
                </Field>
              </div>
            </div>
          </div>

          {/* ── Footer: consent + submit ──────────────────────────────── */}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-1">
            <label className="group flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => set("consent", e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500/30 accent-purple-600"
              />
              <span className="text-[13px] leading-snug text-slate-600 transition-colors group-hover:text-slate-800 dark:text-slate-300 dark:group-hover:text-slate-100">
                I agree to the{" "}
                <span className="font-medium text-purple-700 hover:underline cursor-pointer">
                  Privacy Policy
                </span>{" "}
                and to be contacted about my access request.
              </span>
            </label>

            <Button
              type="submit"
              disabled={submitting}
              className="shrink-0 h-10 rounded-lg bg-purple-700 px-6 text-sm font-semibold text-white shadow-sm transition-all hover:bg-purple-800 disabled:opacity-70"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Submitting…
                </span>
              ) : (
                "Submit request"
              )}
            </Button>
          </div>
          {errors.consent && (
            <p className="mt-1.5 px-1 text-[11px] font-medium text-red-500">
              {errors.consent}
            </p>
          )}

          {/* Trust line + sign in */}
          <div className="mt-3 flex flex-col items-center gap-1.5 text-center">
            <div className="flex items-center gap-1.5">
              <Lock className="h-3 w-3 text-slate-300" />
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Your details stay private. We never share your information.
              </p>
            </div>
            <p className="text-[12px] text-slate-500 dark:text-slate-400">
              Already have access?
              <Link className="ml-1 font-semibold text-purple-600 hover:text-purple-700" href="/login">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
