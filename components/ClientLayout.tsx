"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Banknote,
  Bot,
  CreditCard,
  Home,
  Menu,
  Moon,
  Sun,
  UserCheck
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import AccountMenu from "@/components/AccountMenu";

const navItems = [
  { key: "overview", label: "Dashboard", href: "/dashboard", icon: Home },
  { key: "idea", label: "Idea Chatbot", href: "/idea-chatbot", icon: Bot },
  { key: "assigned-specialist", label: "Assigned Specialist", href: "/assigned-specialist", icon: UserCheck },
  { key: "payments", label: "Payments", href: "/payments", icon: Banknote },
  { key: "invoices", label: "Invoices", href: "/invoices", icon: CreditCard }
] as const;

type NavKey = (typeof navItems)[number]["key"];

type ClientLayoutProps = {
  activeNav: NavKey;
  title: string;
  subtitle: string;
  children: ReactNode;
};

function NavLink({
  href,
  active,
  icon: Icon,
  label
}: {
  href: string;
  active: boolean;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
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
    </Link>
  );
}

export default function ClientLayout({ activeNav, title, subtitle, children }: ClientLayoutProps) {
  const [dark, setDark] = useState(false);

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

  const sidebarNav = (
    <div className="space-y-1">
      {navItems.map((item) => (
        <NavLink key={item.key} href={item.href} active={item.key === activeNav} icon={item.icon} label={item.label} />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 dark:from-[#181A20] dark:via-[#181A20] dark:to-[#181A20] transition-colors duration-300">
      <div className="flex">
        {/* Desktop sidebar */}
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

        {/* Main */}
        <main className="relative flex-1 overflow-x-hidden">
          {/* Top bar */}
          <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/60 bg-white/80 px-4 py-3 backdrop-blur-xl dark:border-white/5 dark:bg-[#1E2329]/80 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="lg:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <button
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-200 hover:bg-slate-50 hover:shadow active:scale-95 dark:border-white/10 dark:bg-[#1E2329] dark:text-slate-300 dark:hover:bg-white/5"
                      aria-label="Open navigation"
                    >
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
                <h1 className="text-sm font-bold text-slate-900 dark:text-slate-100">{title}</h1>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{subtitle}</p>
              </div>
            </div>
            <AccountMenu />
          </header>

          <div className="px-4 pb-16 pt-6 sm:px-6 lg:px-8">
            {/* Mobile-only hero */}
            <div className="animate-fade-in lg:hidden">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{title}</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
            </div>
            <div className="mt-6 animate-fade-in-up">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}