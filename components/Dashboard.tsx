"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Banknote,
  Bell,
  Bot,
  CalendarClock,
  CheckSquare,
  CreditCard,
  FolderKanban,
  Home,
  Mail,
  Menu,
  Moon,
  Sparkles,
  Sun,
  UserCheck,
  ArrowUpRight,
  TrendingUp,
  Shield,
  Clock,
  type LucideIcon
} from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import RequestSurvey from "./RequestSurvey";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { getProjects, initMockDb, upcomingDeadlinesCount } from "@/lib/mockDb";
import NexusAssistant from "@/components/NexusAssistant";
import AccountMenu from "@/components/AccountMenu";

/* ───────────────────────── helpers ───────────────────────── */

function NavLink({
  href,
  active,
  icon: Icon,
  label,
  badge
}: {
  href: string;
  active: boolean;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: number;
}) {
  return (
    <Link
      className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200
        ${active
          ? "bg-purple-50/80 text-purple-700 shadow-sm shadow-purple-100/50 dark:bg-purple-500/10 dark:text-purple-400 dark:shadow-none"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-slate-200"
        }`}
      href={href}
    >
      {active && (
        <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-purple-600 transition-all duration-300" />
      )}
      <Icon className={`h-[18px] w-[18px] transition-colors duration-200 ${active ? "text-purple-600 dark:text-purple-400" : "text-slate-500 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200"}`} />
      {label}
      {badge !== undefined && badge > 0 && (
        <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-semibold text-white">
          {badge}
        </span>
      )}
    </Link>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
  sublabel,
  onClick,
  delay = "0ms",
  highlight = false
}: {
  icon: LucideIcon;
  value: number;
  label: string;
  sublabel: string;
  onClick: () => void;
  delay?: string;
  highlight?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{ animationDelay: delay }}
      className={`animate-fade-in-up group flex items-center gap-3 text-left transition-all duration-300 active:scale-[0.98] ${
        highlight
          ? "rounded-xl border border-purple-200 bg-purple-50/80 px-4 py-3.5 shadow-sm hover:shadow-md hover:border-purple-300 dark:border-purple-500/20 dark:bg-purple-500/10 dark:hover:border-purple-500/30"
          : "rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-sm hover:border-slate-200 dark:border-white/5 dark:bg-[#1E2329] dark:hover:border-white/10"
      }`}
    >
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-105 ${
        highlight ? "bg-purple-100 dark:bg-purple-500/20" : "bg-slate-50 dark:bg-white/5"
      }`}>
        <Icon className={`h-4 w-4 ${highlight ? "text-purple-600 dark:text-purple-400" : "text-slate-500 dark:text-slate-400"}`} strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <div suppressHydrationWarning className={`text-base font-semibold tabular-nums ${highlight ? "text-purple-900 dark:text-purple-300" : "text-slate-900 dark:text-slate-100"}`}>{value}</div>
        <div className={`truncate text-xs ${highlight ? "font-medium text-purple-700/70 dark:text-purple-400/70" : "text-slate-500 dark:text-slate-400"}`}>{label}</div>
        <div className={`text-[10px] ${highlight ? "font-medium text-purple-600 dark:text-purple-400" : "text-slate-400 dark:text-slate-500"}`}>{sublabel}</div>
      </div>
    </button>
  );
}

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-shimmer rounded-xl bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 dark:from-white/5 dark:via-white/[0.02] dark:to-white/5 bg-[length:200%_100%] ${className}`} />
  );
}

/* ───────────────────────── main ───────────────────────── */

export default function Dashboard({
  activeSection = "overview"
}: {
  activeSection?: "overview" | "assigned-specialist" | "idea-chatbot";
}) {
  const router = useRouter();
  const [refresh, setRefresh] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);

  /* ── Dark mode toggle ── */
  useEffect(() => {
    const saved = localStorage.getItem("skilllink_theme");
    if (saved === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = (mode: "light" | "dark") => {
    const isDark = mode === "dark";
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("skilllink_theme", mode);
  };
  const projects = useMemo(() => (mounted ? getProjects() : []), [refresh, mounted]);
  const ideaOpen = activeSection === "idea-chatbot";
  const overviewActive = activeSection === "overview";
  const specialistActive = activeSection === "assigned-specialist";

  const heroTitle =
    activeSection === "assigned-specialist"
      ? "Assigned Specialist"
      : activeSection === "idea-chatbot"
      ? "Idea Chatbot"
      : "Client HQ";
  const heroSubtitle =
    activeSection === "assigned-specialist"
      ? "All communication stays inside SkillLink Nexus."
      : activeSection === "idea-chatbot"
      ? "Chat with our AI to brainstorm and draft your project brief."
      : "Delivery, approvals, and chat visibility for every project.";

  useEffect(() => {
    const loaded = initMockDb();
    if (loaded) setRefresh((v) => v + 1);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const role = window.localStorage.getItem("skilllink_role");
    if (role === "admin") { router.replace("/admin"); return; }
    if (role !== "client") router.replace("/");
  }, [router]);

  const stats = useMemo(() => {
    if (!mounted) return { activeProjects: 0, pendingApprovals: 0, upcomingDeadlines: 0, unreadMessages: 0 };
    const activeProjects = projects.filter((p) => ["Active", "In Progress"].includes(p.status)).length;
    const pendingApprovals = projects.flatMap((p) => p.milestones).filter((m) => m.status === "Submitted").length;
    const upcomingDeadlines = upcomingDeadlinesCount(7);
    const unreadMessages = projects.flatMap((p) => p.messages).filter((m) => m.senderType === "project_desk" && !m.forwardedToSpecialist).length;
    return { activeProjects, pendingApprovals, upcomingDeadlines, unreadMessages };
  }, [projects, mounted]);

  const activeList = projects.filter((p) => p.status !== "Completed");
  const primaryProject = activeList[0];
  const submittedMilestone = primaryProject?.milestones.find((m) => m.status === "Submitted");
  const milestoneProgress = primaryProject
    ? Math.round((primaryProject.milestones.filter((m) => m.status === "Approved").length / Math.max(primaryProject.milestones.length, 1)) * 100)
    : 0;
  const assignedChatMessages = primaryProject
    ? [
        { id: "system-1", sender: "System", body: "Milestone 2 submitted for review.", createdAt: "Today 9:10 AM", tone: "system" as const, attachments: [] as string[] },
        { id: "desk-1", sender: "Project Desk", body: primaryProject.messages[0]?.body ?? "Your deliverable is ready for review.", createdAt: primaryProject.messages[0]?.createdAt ?? "Today 9:12 AM", tone: "desk" as const, attachments: primaryProject.messages[0]?.attachments ?? ["Homepage Design.pdf"] },
        { id: "client-1", sender: "You", body: primaryProject.messages[1]?.body ?? "Reviewing now. I will share feedback shortly.", createdAt: primaryProject.messages[1]?.createdAt ?? "Today 9:18 AM", tone: "client" as const, attachments: [] as string[] },
        { id: "system-2", sender: "System", body: "SkillLink QA marked as Passed.", createdAt: "Today 9:30 AM", tone: "system" as const, attachments: [] as string[] }
      ]
    : [];

  /* ── sidebar nav items ── */
  const sidebarNav = (
    <div className="space-y-1">
      <NavLink href="/dashboard" active={overviewActive} icon={Home} label="Dashboard" />
      <NavLink href="/idea-chatbot" active={ideaOpen} icon={Bot} label="Idea Chatbot" />
      <NavLink href="/assigned-specialist" active={specialistActive} icon={UserCheck} label="Assigned Specialist" />
      <NavLink href="/payments" active={false} icon={Banknote} label="Payments" />
      <NavLink href="/invoices" active={false} icon={CreditCard} label="Invoices" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 dark:from-[#181A20] dark:via-[#181A20] dark:to-[#181A20] transition-colors duration-300">
      <div className="flex">
        {/* ────────────── DESKTOP SIDEBAR ────────────── */}
        <aside className="sticky top-0 hidden h-screen w-[220px] flex-col border-r border-slate-200/60 bg-white/90 backdrop-blur-xl dark:border-white/5 dark:bg-[#1E2329]/95 lg:flex">
          <div className="flex items-center gap-3 px-5 py-5">
            <Image src="/logo.png" alt="SkillLink Nexus" width={36} height={36} className="rounded-lg" />
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">SkillLink Nexus</div>
              <div className="text-[11px] font-medium text-slate-400 dark:text-slate-500">Client Portal</div>
            </div>
          </div>

          <div className="mx-4 border-t border-slate-100 dark:border-white/5" />

          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-300 dark:text-slate-600">Navigation</div>
            {sidebarNav}
          </nav>

          <div className="mx-4 border-t border-slate-100 dark:border-white/5" />
          <div className="flex items-center justify-start gap-1.5 px-5 py-4">
            <button
              onClick={() => toggleTheme("light")}
              className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 active:scale-95 ${
                !dark
                  ? "bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400"
                  : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
              }`}
              aria-label="Light mode"
            >
              <Sun className="h-4 w-4" />
            </button>
            <button
              onClick={() => toggleTheme("dark")}
              className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 active:scale-95 ${
                dark
                  ? "bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400"
                  : "text-slate-400 hover:text-slate-600"
              }`}
              aria-label="Dark mode"
            >
              <Moon className="h-4 w-4" />
            </button>
          </div>
        </aside>

        {/* ────────────── MAIN CONTENT ────────────── */}
        <main className="relative flex-1 overflow-x-hidden">
          {/* ── Top bar ── */}
          <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/60 bg-white/80 px-4 py-3 backdrop-blur-xl dark:border-white/5 dark:bg-[#1E2329]/80 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="lg:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <button className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-200 hover:bg-slate-50 hover:shadow active:scale-95 dark:border-white/10 dark:bg-[#1E2329] dark:text-slate-300 dark:hover:bg-white/5" aria-label="Open navigation">
                      <Menu className="h-4 w-4" />
                    </button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[240px] p-0">
                    <div className="flex h-full flex-col">
                      <div className="flex items-center gap-3 px-5 py-5">
                        <Image src="/logo.png" alt="SkillLink Nexus" width={36} height={36} className="rounded-lg" />
                        <div>
                          <div className="text-sm font-bold text-slate-900 tracking-tight">SkillLink Nexus</div>
                          <div className="text-[11px] font-medium text-slate-400">Client Portal</div>
                        </div>
                      </div>
                      <div className="mx-4 border-t border-slate-100" />
                      <nav className="flex-1 overflow-y-auto px-3 py-4">
                        <div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-300">Navigation</div>
                        {sidebarNav}
                      </nav>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
              <div className="hidden lg:block">
                <h1 className="text-sm font-bold text-slate-900 dark:text-slate-100">{heroTitle}</h1>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{heroSubtitle}</p>
              </div>
            </div>
            <AccountMenu />
          </header>

          <div className="px-4 pb-16 pt-4 sm:px-6 lg:px-8">
            {/* Mobile-only hero (hidden on lg since header shows it) */}
            <div className="animate-fade-in lg:hidden">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{heroTitle}</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{heroSubtitle}</p>
            </div>

            {activeSection === "overview" && (
              <div className="animate-fade-in" style={{ animationDelay: "50ms" }}>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Link
                    className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-purple-200 transition-all duration-200 hover:bg-purple-700 hover:shadow-md hover:shadow-purple-200/50 active:scale-[0.98] dark:shadow-none dark:bg-purple-600 dark:hover:bg-purple-500"
                    href="/dashboard#request-service"
                  >
                    <Sparkles className="h-4 w-4" />
                    Request a Service
                  </Link>
                  <Link
                    className="inline-flex items-center gap-2 rounded-xl border border-purple-200 bg-purple-50 px-4 py-2.5 text-sm font-semibold text-purple-700 shadow-sm transition-all duration-200 hover:bg-purple-100 hover:border-purple-300 hover:shadow-md active:scale-[0.98] dark:border-purple-500/20 dark:bg-purple-500/10 dark:text-purple-400 dark:hover:bg-purple-500/20 dark:hover:border-purple-500/30"
                    href="/idea-chatbot"
                  >
                    <Bot className="h-4 w-4" />
                    AI-Guided Request
                  </Link>
                </div>
              </div>
            )}

            {/* ── OVERVIEW ── */}
            {activeSection === "overview" && (
              <>
                {/* Stats */}
                {!mounted ? (
                  <div className="mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
                    {[1,2,3,4].map((i) => <Skeleton key={i} className="h-[76px]" />)}
                  </div>
                ) : (
                  <div className="mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
                    <StatCard icon={FolderKanban} value={stats.activeProjects} label="Active Projects" sublabel="Specialist assigned" onClick={() => document.getElementById("active-projects")?.scrollIntoView({ behavior: "smooth" })} delay="100ms" />
                    <StatCard icon={CheckSquare} value={stats.pendingApprovals} label="Pending Approvals" sublabel="Milestones awaiting approval" onClick={() => document.getElementById("pending-approvals")?.scrollIntoView({ behavior: "smooth" })} delay="150ms" />
                    <StatCard icon={CalendarClock} value={stats.upcomingDeadlines} label="Deadlines" sublabel="Due this week" onClick={() => document.getElementById("upcoming-deadlines")?.scrollIntoView({ behavior: "smooth" })} delay="200ms" />
                    <StatCard icon={Mail} value={stats.unreadMessages} label="Messages" sublabel="From your specialist" onClick={() => router.push("/assigned-specialist#project-chat")} delay="250ms" />
                  </div>
                )}

                {/* Managed delivery notice */}
                <div className="animate-fade-in-up mt-4 flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-white/5 dark:bg-[#1E2329]" style={{ animationDelay: "300ms" }}>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      <span className="font-medium text-slate-800 dark:text-slate-200">Specialist matched within 24 hrs.</span>{" "}
                      Non-performers are replaced at no extra cost.
                    </p>
                  </div>
                  <Link href="/request" className="shrink-0 text-xs font-medium text-purple-600 hover:text-purple-700 hover:underline dark:text-purple-400 dark:hover:text-purple-300">Matching policy</Link>
                </div>

                {/* Request form */}
                <section id="request-service" className="animate-fade-in-up mt-10 scroll-mt-24" style={{ animationDelay: "350ms" }}>
                  <RequestSurvey variant="embedded" />
                </section>

                {/* Active Projects */}
                <div id="active-projects" className="mt-12 scroll-mt-24">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Active Projects</h2>
                      <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Track progress across all your engagements.</p>
                    </div>
                    <Link
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-50 hover:shadow active:scale-[0.98] dark:border-white/10 dark:bg-[#1E2329] dark:text-slate-300 dark:hover:bg-white/5"
                      href="/dashboard#request-service"
                    >
                      New Request
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  {activeList.length === 0 ? (
                    <div className="mt-6 rounded-2xl border-2 border-dashed border-slate-200 bg-white/60 p-12 text-center dark:border-white/10 dark:bg-white/[0.02]">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 dark:bg-purple-500/10">
                        <FolderKanban className="h-6 w-6 text-purple-400" />
                      </div>
                      <div className="mt-4 text-sm font-semibold text-slate-800 dark:text-slate-200">No active projects yet</div>
                      <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Submit a request and we'll assign a specialist within 24 hours.</div>
                      <Link
                        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-purple-700 active:scale-[0.98]"
                        href="/request"
                      >
                        Request a Service
                      </Link>
                    </div>
                  ) : (
                    <div className="mt-6 grid gap-4 lg:grid-cols-2">
                      {activeList.map((project, i) => (
                        <div key={project.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
                          <ProjectCard project={project} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Pending Approvals */}
                <div id="pending-approvals" className="mt-12 scroll-mt-24">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Pending Approvals</h2>
                  <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Milestones awaiting your sign-off.</p>
                  {(() => {
                    const pendingProjects = projects.filter((p) => p.milestones.some((m) => m.status === "Submitted"));
                    return pendingProjects.length === 0 ? (
                      <div className="mt-4 rounded-2xl border-2 border-dashed border-slate-200 bg-white/60 p-10 text-center dark:border-white/10 dark:bg-white/[0.02]">
                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-500/10">
                          <CheckSquare className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div className="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-200">No pending approvals</div>
                        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">All milestones are up to date.</div>
                      </div>
                    ) : (
                      <div className="mt-4 grid gap-4 lg:grid-cols-2">
                        {pendingProjects.map((project) => (
                          <ProjectCard key={project.id} project={project} />
                        ))}
                      </div>
                    );
                  })()}
                </div>

                {/* Upcoming Deadlines */}
                <div id="upcoming-deadlines" className="mt-12 scroll-mt-24">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Upcoming Deadlines</h2>
                  <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Milestones due in the next 7 days.</p>
                  {(() => {
                    const now = new Date();
                    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                    const deadlineProjects = projects.filter((p) =>
                      p.milestones.some((m) => {
                        const due = new Date(m.dueDate);
                        return m.status !== "Approved" && due >= now && due <= weekFromNow;
                      })
                    );
                    return deadlineProjects.length === 0 ? (
                      <div className="mt-4 rounded-2xl border-2 border-dashed border-slate-200 bg-white/60 p-10 text-center dark:border-white/10 dark:bg-white/[0.02]">
                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 dark:bg-sky-500/10">
                          <Clock className="h-5 w-5 text-sky-400" />
                        </div>
                        <div className="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-200">No upcoming deadlines</div>
                        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Nothing due in the next 7 days.</div>
                      </div>
                    ) : (
                      <div className="mt-4 grid gap-4 lg:grid-cols-2">
                        {deadlineProjects.map((project) => (
                          <ProjectCard key={project.id} project={project} />
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </>
            )}

            {/* ── ASSIGNED SPECIALIST ── */}
            {activeSection === "assigned-specialist" && (
              <section id="assigned-specialist" className="animate-fade-in-up mt-8 scroll-mt-24">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Assigned Specialist: Specialist 129H</h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">All communication stays inside SkillLink Nexus.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button className="rounded-xl shadow-sm transition-all duration-200 hover:shadow active:scale-[0.98]">Message</Button>
                    <Button variant="outline" className="rounded-xl transition-all duration-200 active:scale-[0.98]">View milestones</Button>
                    {submittedMilestone && (
                      <Button className="rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-200 transition-all duration-200 hover:bg-emerald-700 hover:shadow-md active:scale-[0.98]">
                        Approve &amp; Release Payment
                      </Button>
                    )}
                  </div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                  {/* Chat */}
                  <div id="project-chat" className="animate-fade-in-up rounded-2xl border border-slate-200/60 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] scroll-mt-24 dark:border-white/5 dark:bg-[#1E2329]" style={{ animationDelay: "100ms" }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-slate-100">Project Chat</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Messages are logged and tied to your project.</div>
                      </div>
                      <Badge className="rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400">Secure</Badge>
                    </div>
                    <div className="mt-4 h-[420px] space-y-3 overflow-y-auto rounded-xl border border-slate-100 bg-slate-50/50 p-4 scroll-smooth dark:border-white/5 dark:bg-white/[0.02]">
                      {assignedChatMessages.length === 0 ? (
                        <div className="text-sm text-slate-500">No messages yet.</div>
                      ) : (
                        assignedChatMessages.map((message, i) => (
                          <div
                            key={message.id}
                            className={`flex animate-fade-in-up ${message.tone === "client" ? "justify-end" : "justify-start"}`}
                            style={{ animationDelay: `${i * 80}ms` }}
                          >
                            <div
                              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm transition-all duration-200 hover:shadow-md ${
                                message.tone === "client"
                                  ? "bg-purple-600 text-white"
                                  : message.tone === "system"
                                  ? "bg-amber-50 text-amber-900 border border-amber-100 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20"
                                  : "bg-white text-slate-700 border border-slate-100 dark:bg-[#2B3139] dark:text-slate-300 dark:border-white/5"
                              }`}
                            >
                              <div className="text-[10px] font-bold uppercase tracking-wider opacity-60">{message.sender}</div>
                              <div className="mt-1 leading-relaxed">{message.body}</div>
                              {message.attachments.length > 0 && (
                                <div className="mt-2 space-y-1 text-xs">
                                  {message.attachments.map((att) => (
                                    <div key={att} className="rounded-lg bg-slate-100/80 px-2.5 py-1 text-slate-600 dark:bg-white/5 dark:text-slate-400">{att}</div>
                                  ))}
                                </div>
                              )}
                              <div className="mt-1.5 text-[10px] opacity-50">{message.createdAt}</div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="mt-3 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-500 transition-all duration-200 focus-within:border-purple-300 focus-within:ring-2 focus-within:ring-purple-100 dark:border-white/10 dark:bg-[#2B3139] dark:text-slate-400">
                      <span className="flex-1">Type a message or drop files...</span>
                      <Button variant="outline" size="sm" className="rounded-lg transition-all duration-200 active:scale-95">Send</Button>
                    </div>
                  </div>

                  {/* Progress & Milestones */}
                  <div className="animate-fade-in-up rounded-2xl border border-slate-200/60 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:border-white/5 dark:bg-[#1E2329]" style={{ animationDelay: "150ms" }}>
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-100">Progress + Milestones</div>
                    <div className="mt-4 space-y-4">
                      <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-white/5 dark:bg-white/[0.02]">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Progress Updates</div>
                        <div className="mt-3 flex items-center justify-between text-sm text-slate-700 dark:text-slate-300">
                          <span>Weekly check-ins / daily logs</span>
                          <span className="text-lg font-bold text-slate-900 dark:text-slate-100 tabular-nums">{milestoneProgress}%</span>
                        </div>
                        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                          <div className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-700 ease-out" style={{ width: `${milestoneProgress}%` }} />
                        </div>
                        <div className="mt-3 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                          <div className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />Mon: Homepage responsive pass completed.</div>
                          <div className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />Wed: CTA copy testing shared with QA.</div>
                          <div className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />Fri: Final QA sweep scheduled.</div>
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-white/5 dark:bg-white/[0.02]">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Milestones</div>
                        <div className="mt-3 space-y-3 text-sm text-slate-700 dark:text-slate-300">
                          {(primaryProject?.milestones ?? []).map((milestone) => (
                            <div key={milestone.id} className="flex items-center justify-between gap-3 rounded-lg p-2 transition-colors duration-200 hover:bg-white dark:hover:bg-white/5">
                              <div>
                                <div className="font-medium text-slate-900 dark:text-slate-200">{milestone.title}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">Due {milestone.dueDate}</div>
                              </div>
                              <Badge
                                variant={milestone.status === "Approved" ? "secondary" : milestone.status === "Submitted" ? "default" : "outline"}
                                className="rounded-lg"
                              >
                                {milestone.status === "Approved" ? "Approved - Paid" : milestone.status}
                              </Badge>
                            </div>
                          ))}
                          {!primaryProject && <div className="text-xs text-slate-500">No milestones yet.</div>}
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-white/5 dark:bg-white/[0.02]">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Trust &amp; Privacy</div>
                        <ul className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                          <li className="flex items-start gap-2"><Shield className="mt-0.5 h-3 w-3 shrink-0 text-purple-400" />Client never sees the freelancer's real identity if you want privacy.</li>
                          <li className="flex items-start gap-2"><Shield className="mt-0.5 h-3 w-3 shrink-0 text-purple-400" />Chat is tied to the project and cannot move to WhatsApp.</li>
                          <li className="flex items-start gap-2"><Shield className="mt-0.5 h-3 w-3 shrink-0 text-purple-400" />Payment is released only after approval.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* ── IDEA CHATBOT ── */}
            {activeSection === "idea-chatbot" && (
              <div className="animate-fade-in mt-6">
                <div className="flex h-[calc(100vh-180px)] w-full flex-col rounded-2xl border border-slate-200/60 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:border-white/5 dark:bg-[#1E2329]">
                  <div className="flex-1 overflow-hidden px-4 py-4 sm:px-6 sm:py-6">
                    <div className="mx-auto h-full max-w-6xl">
                      <NexusAssistant onClose={() => router.push("/dashboard")} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
