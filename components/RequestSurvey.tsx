"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  Check,
  CheckCircle2,
  Code2,
  Megaphone,
  Palette,
  Pen,
  Shield,
  Smartphone,
  Upload,
  Wrench
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

/* ================================================================== */
/*  Service types                                                      */
/* ================================================================== */
export const SERVICE_TYPES = [
  { value: "web-development", label: "Web Development", icon: Code2, desc: "Websites, web apps, landing pages" },
  { value: "mobile-app", label: "Mobile App", icon: Smartphone, desc: "iOS, Android, or cross-platform apps" },
  { value: "ui-ux-design", label: "UI / UX Design", icon: Palette, desc: "Interfaces, prototypes, user research" },
  { value: "branding", label: "Branding & Identity", icon: Pen, desc: "Logos, brand guides, visual identity" },
  { value: "marketing", label: "Digital Marketing", icon: Megaphone, desc: "SEO, social media, paid ads, content" },
  { value: "data-analytics", label: "Data & Analytics", icon: BarChart3, desc: "Dashboards, BI, data pipelines" },
  { value: "custom", label: "Something Else", icon: Wrench, desc: "Tell us what you need" }
];

/* ================================================================== */
/*  Category-specific questions                                        */
/* ================================================================== */
export type CatQ = {
  id: string;
  question: string;
  type: "single" | "multi" | "text";
  options?: string[];
  placeholder?: string;
  showIf?: { field: string; value: string };
};

export const CAT_QUESTIONS: Record<string, CatQ[]> = {
  "web-development": [
    { id: "web-starting", question: "Where are you starting from?", type: "single", options: ["I'm starting from scratch", "I already have a website and need improvements", "I only need fixes / small changes"] },
    { id: "web-type", question: "What type of web project is it?", type: "single", options: ["Landing page", "Company website", "Web app / dashboard system"] },
    { id: "web-features", question: "What do you want included?", type: "multi", options: ["Contact form", "Blog / CMS", "User login / accounts", "Admin dashboard", "Booking / appointments", "E-commerce (products + checkout)", "Chat / messaging", "File upload", "Email notifications", "Multi-language"] },
    { id: "web-payments", question: "Do you need payments?", type: "single", options: ["No", "Yes"] },
    { id: "web-payment-methods", question: "Which payment method should we integrate?", type: "multi", options: ["M-Pesa", "Card payments (Stripe)", "PayPal", "Bank transfer", "Other"], showIf: { field: "web-payments", value: "Yes" } },
    { id: "web-content", question: "Do you already have content ready?", type: "single", options: ["Yes (text/images ready)", "No (I need help with content)"] },
    { id: "web-hosting", question: "Do you already have hosting + domain?", type: "single", options: ["Yes", "No (I need help setting it up)"] }
  ],
  "mobile-app": [
    { id: "app-starting", question: "Where are you starting from?", type: "single", options: ["New app from scratch", "I already have an app and need improvements", "Bug fixes only"] },
    { id: "app-platform", question: "Which platform do you want?", type: "single", options: ["Android", "iOS", "Both (recommended)"] },
    { id: "app-kind", question: "What kind of app is it?", type: "single", options: ["Simple app (few screens)", "Business app (login + dashboard)", "Marketplace app (users + payments + chat)", "Social app (profiles + feed + messaging)"] },
    { id: "app-features", question: "What features do you need?", type: "multi", options: ["User login / accounts", "Admin dashboard", "Push notifications", "GPS / location", "In-app chat", "File upload", "Offline mode", "Analytics tracking"] },
    { id: "app-payments", question: "Do you need payments inside the app?", type: "single", options: ["No", "Yes"] },
    { id: "app-payment-methods", question: "Which payment method should we integrate?", type: "multi", options: ["M-Pesa STK Push", "Card payments (Stripe)", "PayPal", "In-app purchases", "Subscription billing"], showIf: { field: "app-payments", value: "Yes" } },
    { id: "app-designs", question: "Do you already have UI designs?", type: "single", options: ["Yes (Figma or screenshots)", "No (I need UI/UX design)"] }
  ],
  "ui-ux-design": [
    { id: "ux-target", question: "What are you designing?", type: "single", options: ["Website", "Mobile app", "Web app dashboard"] },
    { id: "ux-screens", question: "How many screens/pages do you need designed?", type: "single", options: ["1\u20133", "4\u201310", "11\u201325", "25+"] },
    { id: "ux-deliverables", question: "What do you want delivered?", type: "multi", options: ["Wireframes", "Full UI design (Figma)", "Clickable prototype", "Design system (components, buttons, styles)"] },
    { id: "ux-branding", question: "Do you already have branding?", type: "single", options: ["Yes (logo/colors/fonts)", "No (I need branding too)"] },
    { id: "ux-research", question: "Do you want research included?", type: "single", options: ["No", "Yes (UX audit / competitor analysis / user research)"] }
  ],
  branding: [
    { id: "brand-scope", question: "What do you need?", type: "single", options: ["Logo only", "Logo + brand colors/fonts", "Full brand identity kit", "Full brand guidelines document"] },
    { id: "brand-concepts", question: "How many logo concepts would you like?", type: "single", options: ["1 concept", "2\u20133 concepts", "4+ concepts"] },
    { id: "brand-social", question: "Do you need social media assets?", type: "single", options: ["No", "Yes (profile, banner, templates)"] },
    { id: "brand-reference", question: "Do you have a style reference?", type: "single", options: ["Yes (I will upload/link examples)", "No (help me choose)"] }
  ],
  marketing: [
    { id: "mkt-goal", question: "What\u2019s your main goal?", type: "single", options: ["Get more leads", "Grow social media", "Sell products", "Increase website traffic"] },
    { id: "mkt-service", question: "What service do you need?", type: "single", options: ["SEO setup", "Social media management", "Paid ads (Google/Facebook)", "Content writing"] },
    { id: "mkt-duration", question: "Is this a one-time setup or ongoing?", type: "single", options: ["One-time setup", "Monthly management"] },
    { id: "mkt-ad-budget", question: "Do you already have an advertising budget?", type: "single", options: ["Yes (enter amount)", "No (suggest one)"], showIf: { field: "mkt-service", value: "Paid ads (Google/Facebook)" } },
    { id: "mkt-seo-website", question: "Do you already have a website?", type: "single", options: ["Yes (optimize it)", "No (I need a website first)"], showIf: { field: "mkt-service", value: "SEO setup" } }
  ],
  "data-analytics": [
    { id: "data-need", question: "What do you need help with?", type: "single", options: ["Excel automation", "Dashboard (Power BI / Tableau)", "Web dashboard", "Database setup", "Data cleaning"] },
    { id: "data-source", question: "Where is your data coming from?", type: "single", options: ["Excel files", "Google Sheets", "SQL database", "APIs", "Mixed sources"] },
    { id: "data-complexity", question: "How complex is it?", type: "single", options: ["Small (1 dataset)", "Medium (2\u20135 datasets)", "Large (many sources + automation)"] },
    { id: "data-output", question: "What do you want as the final output?", type: "single", options: ["Report only", "Live dashboard", "Automated scheduled reports"] }
  ],
  custom: [
    { id: "custom-description", question: "Describe what you need", type: "text", placeholder: "Tell us what you need help with. The more detail you share, the more accurate our estimate will be." }
  ]
};

export const TIMELINE_OPTIONS = [
  { value: "urgent", label: "Urgent (1\u20133 days)" },
  { value: "normal", label: "Normal (within 1\u20132 weeks)" },
  { value: "flexible", label: "Flexible (2+ weeks)" }
];

/* ================================================================== */
/*  Step definitions                                                   */
/* ================================================================== */
type StepDef =
  | { type: "category" }
  | { type: "describe" }
  | { type: "cat-question"; qId: string }
  | { type: "timeline" }
  | { type: "budget" }
  | { type: "review" };

function phaseOf(step: StepDef) {
  switch (step.type) {
    case "category":
    case "describe":
      return { label: "Your project", n: 1, total: 4 };
    case "cat-question":
      return { label: "Project details", n: 2, total: 4 };
    case "timeline":
    case "budget":
      return { label: "Timeline & budget", n: 3, total: 4 };
    case "review":
      return { label: "Review & submit", n: 4, total: 4 };
  }
}

/* ================================================================== */
/*  Sub-components                                                     */
/* ================================================================== */
function OptionCard({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      className={`flex items-center justify-between rounded-2xl border-2 px-4 py-3 text-left transition-all ${
        selected ? "border-purple-600 bg-purple-50 ring-1 ring-purple-600 dark:bg-purple-500/10 dark:border-purple-500" : "border-slate-200 bg-white hover:border-slate-300 dark:border-white/10 dark:bg-[#1E2329] dark:hover:border-white/20"
      }`}
      onClick={onClick}
    >
      <span className="text-sm font-medium text-slate-900 dark:text-slate-200">{label}</span>
      {selected && <Check className="h-4 w-4 shrink-0 text-purple-600 dark:text-purple-400" />}
    </button>
  );
}

function ReviewRow({ label, value, onEdit, multiline }: { label: string; value: string; onEdit: () => void; multiline?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 py-3.5">
      <div className="min-w-0 flex-1">
        <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">{label}</div>
        <div className={`mt-0.5 text-sm text-slate-800 dark:text-slate-200 ${multiline ? "whitespace-pre-wrap" : "truncate"}`}>{value}</div>
      </div>
      <button type="button" className="shrink-0 text-xs font-semibold text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300" onClick={onEdit}>
        Edit
      </button>
    </div>
  );
}

/* ================================================================== */
/*  Main component                                                     */
/* ================================================================== */
type Props = { variant?: "page" | "embedded" };

export default function RequestSurvey({ variant = "page" }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const isEmbedded = variant === "embedded";

  /* ── state ─────────────────────────────────────────────────────── */
  const [category, setCategory] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploadNames, setUploadNames] = useState<string[]>([]);
  const [catAnswers, setCatAnswers] = useState<Record<string, string | string[]>>({});
  const [timeline, setTimeline] = useState("");
  const [budgetType, setBudgetType] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");

  const [stepIdx, setStepIdx] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  /* ── dynamic steps ─────────────────────────────────────────────── */
  const steps = useMemo<StepDef[]>(() => {
    const s: StepDef[] = [{ type: "category" }, { type: "describe" }];
    if (category && CAT_QUESTIONS[category]) {
      for (const q of CAT_QUESTIONS[category]) {
        if (q.showIf) {
          const ans = catAnswers[q.showIf.field];
          if (typeof ans === "string" ? ans !== q.showIf.value : !Array.isArray(ans) || !ans.includes(q.showIf.value)) continue;
        }
        s.push({ type: "cat-question", qId: q.id });
      }
    }
    s.push({ type: "timeline" }, { type: "budget" }, { type: "review" });
    return s;
  }, [category, catAnswers]);

  const idx = Math.min(stepIdx, steps.length - 1);
  const cur = steps[idx];
  const phase = phaseOf(cur);
  const progress = Math.round(((idx + 1) / steps.length) * 100);

  /* ── helpers ───────────────────────────────────────────────────── */
  const catQ = (id: string) => CAT_QUESTIONS[category]?.find((q) => q.id === id);
  const setCat = (id: string, v: string | string[]) => setCatAnswers((p) => ({ ...p, [id]: v }));
  const toggleMulti = (id: string, opt: string) =>
    setCatAnswers((p) => {
      const arr = (p[id] as string[]) ?? [];
      return { ...p, [id]: arr.includes(opt) ? arr.filter((v) => v !== opt) : [...arr, opt] };
    });

  const handleCategoryChange = (v: string) => {
    setCategory(v);
    setCatAnswers({});
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setUploadNames((p) => [...p, ...Array.from(e.target.files!).map((f) => f.name)]);
  };

  /* ── validation ────────────────────────────────────────────────── */
  const validate = (): string | null => {
    switch (cur.type) {
      case "category":
        return category ? null : "Please select a service type.";
      case "describe":
        if (!projectTitle.trim()) return "Please give your project a name.";
        if (!description.trim()) return "Please describe what you need.";
        return null;
      case "cat-question": {
        const q = catQ(cur.qId);
        if (!q) return null;
        if (q.type === "single") return catAnswers[q.id] ? null : "Please select an option.";
        if (q.type === "multi") {
          const a = catAnswers[q.id] as string[] | undefined;
          return a && a.length > 0 ? null : "Please select at least one option.";
        }
        if (q.type === "text") {
          const a = catAnswers[q.id] as string | undefined;
          return a && a.trim() ? null : "Please fill in this field.";
        }
        return null;
      }
      case "timeline":
        return timeline ? null : "Please select a timeline.";
      case "budget":
        if (!budgetType) return "Please select a budget preference.";
        if (budgetType === "custom" && !budgetAmount.trim()) return "Please enter your budget.";
        return null;
      default:
        return null;
    }
  };

  const next = () => {
    const msg = validate();
    if (msg) { setError(msg); return; }
    setError("");
    setStepIdx((i) => Math.min(i + 1, steps.length - 1));
  };
  const prev = () => { setError(""); setStepIdx((i) => Math.max(i - 1, 0)); };
  const goTo = (type: string, qId?: string) => {
    const i = steps.findIndex((s) => (type === "cat-question" ? s.type === "cat-question" && (s as { qId: string }).qId === qId : s.type === type));
    if (i >= 0) { setError(""); setStepIdx(i); }
  };

  /* ── reset + submit ────────────────────────────────────────────── */
  const resetAll = () => {
    setCategory(""); setProjectTitle(""); setDescription(""); setUploadNames([]); setCatAnswers({});
    setTimeline(""); setBudgetType(""); setBudgetAmount(""); setStepIdx(0); setError(""); setSubmitted(false); setIsSubmitting(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { addProject, runAiAssignment } = await import("@/lib/mockDb");
      const svcLabel = SERVICE_TYPES.find((s) => s.value === category)?.label ?? category;
      const budgetLabel = budgetType === "custom" ? budgetAmount : "Suggest the best price";
      const tlLabel = TIMELINE_OPTIONS.find((t) => t.value === timeline)?.label ?? timeline;
      const newProject = addProject({
        title: projectTitle, client: "Client", serviceType: svcLabel, category: svcLabel, description,
        budgetRange: budgetLabel, budgetEstimate: budgetLabel, quoteAmount: budgetLabel,
        amountPaid: "KES 0", paymentMethod: "Unspecified", freelancerPayout: "KES 0", margin: "KES 0",
        estimatedTimeline: tlLabel, deadline: tlLabel, status: "New", assignedSpecialistRole: "Pending",
        assignedRoles: ["Developer", "Designer", "Project Manager"],
        deliverablesChecklist: [], requiredAssets: [], risksAssumptions: [], clientContext: description
      });
      runAiAssignment(newProject.id);
      setSubmitted(true);
    } catch {
      toast({ title: "Submission failed", description: "Something went wrong. Please try again.", variant: "destructive" });
    }
    setIsSubmitting(false);
  };

  /* ================================================================ */
  /*  Submitted screen                                                 */
  /* ================================================================ */
  if (submitted) {
    return (
      <div className={isEmbedded ? "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#1E2329]" : "flex min-h-screen items-center justify-center bg-slate-50 dark:bg-[#181A20] px-4"}>
        <div className={isEmbedded ? "text-center" : "w-full max-w-lg rounded-2xl border border-slate-200 bg-white px-8 py-12 text-center shadow-lg dark:border-white/10 dark:bg-[#1E2329]"}>
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/10">
            <CheckCircle2 className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Request received.</h1>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            We&apos;re preparing your estimate and matching a specialist.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            {isEmbedded ? (
              <>
                <Button onClick={resetAll}>Start another request</Button>
                <Button variant="outline" onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
              </>
            ) : (
              <>
                <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
                <Button variant="outline" onClick={() => router.push("/")}>Back to Home</Button>
              </>
            )}
          </div>
          <div className="mx-auto mt-8 flex max-w-sm items-start gap-3 rounded-xl bg-slate-50 dark:bg-white/5 px-4 py-3 text-left">
            <Shield className="mt-0.5 h-4 w-4 shrink-0 text-purple-600 dark:text-purple-400" />
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Your project is managed.</span>{" "}
              You&apos;ll communicate inside the platform, track progress through milestones, and only release payment when work is approved.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ================================================================ */
  /*  Render step content                                              */
  /* ================================================================ */
  const renderStep = () => {
    switch (cur.type) {
      /* ─── category ──────────────────────────────────────── */
      case "category":
        return (
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">What are you looking to build?</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Pick the closest match. You can explain the details next.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {SERVICE_TYPES.map((svc) => (
                <button
                  key={svc.value}
                  type="button"
                  className={`flex items-start gap-3.5 rounded-2xl border-2 px-4 py-3 text-left transition-all ${
                    category === svc.value ? "border-purple-600 bg-purple-50 ring-1 ring-purple-600 dark:bg-purple-500/10 dark:border-purple-500" : "border-slate-200 bg-white hover:border-slate-300 dark:border-white/10 dark:bg-[#1E2329] dark:hover:border-white/20"
                  }`}
                  onClick={() => handleCategoryChange(svc.value)}
                >
                  <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-400">
                    <svc.icon className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-200">
                      {svc.label}
                      {category === svc.value && <Check className="h-4 w-4 text-purple-600 dark:text-purple-400" />}
                    </div>
                    <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{svc.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      /* ─── describe ──────────────────────────────────────── */
      case "describe":
        return (
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Describe your project</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">A clear brief helps us estimate faster and assign the right specialist.</p>
            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Give your project a short name</label>
                <Input placeholder="Example: NGO website with donation page" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Tell us what you need</label>
                <Textarea
                  rows={4}
                  placeholder="Describe your project in a few sentences. Mention what you want, who it's for, and any important features."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Upload anything that helps (optional)</label>
                <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-6 text-center transition hover:border-slate-300 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20">
                  <Upload className="h-5 w-5 text-slate-400" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">Click to browse files</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">Screenshots, docs, PDFs, existing files</span>
                  <input type="file" multiple className="hidden" onChange={handleFiles} />
                </label>
                {uploadNames.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {uploadNames.map((name, i) => (
                      <div key={i} className="flex items-center gap-2 rounded-lg bg-purple-50 dark:bg-purple-500/10 px-3 py-1.5 text-sm text-purple-700 dark:text-purple-400">
                        <Check className="h-3 w-3" />
                        {name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      /* ─── category question ─────────────────────────────── */
      case "cat-question": {
        const q = catQ(cur.qId);
        if (!q) return null;
        return (
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{q.question}</h2>
            {q.type === "multi" && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Select all that apply</p>}
            {q.type === "single" && q.options && (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {q.options.map((opt) => (
                  <OptionCard key={opt} label={opt} selected={(catAnswers[q.id] as string) === opt} onClick={() => setCat(q.id, opt)} />
                ))}
              </div>
            )}
            {q.type === "multi" && q.options && (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {q.options.map((opt) => (
                  <OptionCard key={opt} label={opt} selected={((catAnswers[q.id] as string[]) ?? []).includes(opt)} onClick={() => toggleMulti(q.id, opt)} />
                ))}
              </div>
            )}
            {q.type === "text" && (
              <div className="mt-6">
                <Textarea rows={5} placeholder={q.placeholder ?? ""} value={(catAnswers[q.id] as string) ?? ""} onChange={(e) => setCat(q.id, e.target.value)} />
              </div>
            )}
          </div>
        );
      }

      /* ─── timeline ──────────────────────────────────────── */
      case "timeline":
        return (
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">When do you need this completed?</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">We&apos;ll prioritize accordingly.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {TIMELINE_OPTIONS.map((opt) => (
                <OptionCard key={opt.value} label={opt.label} selected={timeline === opt.value} onClick={() => setTimeline(opt.value)} />
              ))}
            </div>
          </div>
        );

      /* ─── budget ────────────────────────────────────────── */
      case "budget":
        return (
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Do you have a budget in mind?</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">This helps us scope the project correctly.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <OptionCard label="Suggest the best price" selected={budgetType === "suggest"} onClick={() => setBudgetType("suggest")} />
              <OptionCard label="I have a budget (enter amount)" selected={budgetType === "custom"} onClick={() => setBudgetType("custom")} />
            </div>
            {budgetType === "custom" && (
              <div className="mt-5">
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Your budget</label>
                <Input placeholder="e.g. $2,000 or KES 250,000" value={budgetAmount} onChange={(e) => setBudgetAmount(e.target.value)} />
              </div>
            )}
          </div>
        );

      /* ─── review ────────────────────────────────────────── */
      case "review": {
        const svcLabel = SERVICE_TYPES.find((s) => s.value === category)?.label ?? category;
        const visibleCatQs = (CAT_QUESTIONS[category] ?? []).filter((q) => {
          if (!q.showIf) return true;
          const ans = catAnswers[q.showIf.field];
          return typeof ans === "string" ? ans === q.showIf.value : Array.isArray(ans) && ans.includes(q.showIf.value);
        });
        return (
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Review your request</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">We&apos;ll estimate your project, generate a delivery plan, and assign the best available specialist.</p>
            <div className="mt-6 divide-y divide-slate-100 dark:divide-white/5 rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#1E2329]">
              <ReviewRow label="Service" value={svcLabel} onEdit={() => goTo("category")} />
              <ReviewRow label="Project name" value={projectTitle || "\u2014"} onEdit={() => goTo("describe")} />
              <ReviewRow label="Description" value={description || "\u2014"} onEdit={() => goTo("describe")} multiline />
              {uploadNames.length > 0 && <ReviewRow label="Files" value={uploadNames.join(", ")} onEdit={() => goTo("describe")} />}
              {visibleCatQs.map((q) => {
                const ans = catAnswers[q.id];
                const display = Array.isArray(ans) ? ans.join(", ") : (ans as string) || "\u2014";
                return <ReviewRow key={q.id} label={q.question} value={display} onEdit={() => goTo("cat-question", q.id)} />;
              })}
              <ReviewRow label="Timeline" value={TIMELINE_OPTIONS.find((t) => t.value === timeline)?.label ?? "\u2014"} onEdit={() => goTo("timeline")} />
              <ReviewRow label="Budget" value={budgetType === "custom" ? budgetAmount : budgetType === "suggest" ? "Suggest the best price" : "\u2014"} onEdit={() => goTo("budget")} />
            </div>
            <div className="mt-6 flex items-start gap-3 rounded-xl bg-slate-50 dark:bg-white/5 px-4 py-3">
              <Shield className="mt-0.5 h-4 w-4 shrink-0 text-purple-600 dark:text-purple-400" />
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Your project is managed.</span>{" "}
                You&apos;ll communicate inside the platform, track progress through milestones, and only release payment when work is approved.
              </p>
            </div>
          </div>
        );
      }
    }
  };

  /* ================================================================ */
  /*  Main render                                                      */
  /* ================================================================ */
  return (
    <div className={isEmbedded ? "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#1E2329]" : "flex min-h-screen flex-col bg-slate-50 dark:bg-[#181A20]"}>
      {/* ── header ────────────────────────────────────────── */}
      {!isEmbedded ? (
        <>
          <div className="border-b border-slate-200 bg-white dark:border-white/5 dark:bg-[#1E2329]">
            <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
              <button className="text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200" onClick={() => router.push("/")}>
                &larr; SkillLink Nexus
              </button>
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500">{phase.label} &bull; {phase.n}/{phase.total}</span>
            </div>
          </div>
          <div className="bg-white dark:bg-[#1E2329]">
            <div className="mx-auto max-w-3xl px-6">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                <div className="h-full rounded-full bg-purple-600 transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-purple-600">Request a Service</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
              <div className="h-full rounded-full bg-purple-600 transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </>
      )}

      {/* ── content ───────────────────────────────────────── */}
      <div className={isEmbedded ? "mt-6" : "flex flex-1 items-start justify-center px-4 py-10 sm:items-center sm:py-0"}>
        <div className={isEmbedded ? "" : "w-full max-w-2xl"}>
          {renderStep()}

          {error && <p className="mt-4 text-sm font-medium text-rose-600 dark:text-rose-400">{error}</p>}

          {/* ── navigation ──────────────────────────────────── */}
          <div className="mt-8 flex items-center justify-between">
            {idx > 0 ? (
              <Button variant="ghost" onClick={prev} className="text-slate-500">
                Previous
              </Button>
            ) : (
              <span />
            )}
            {cur.type !== "review" ? (
              <Button onClick={next}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting} className="gap-2">
                {isSubmitting ? "Submitting\u2026" : "Submit Request"}
                {!isSubmitting && <Check className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
