"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  AlertTriangle,
  Bell,
  CreditCard,
  FolderKanban,
  Inbox,
  LayoutDashboard,
  LineChart,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  Sparkles,
  Users,
  Moon,
  Sun
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
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

  const isActive = (href: string) =>
    pathname === href || (href !== "/admin" && pathname.startsWith(href));

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("skilllink_role");
    }
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_10%_-20%,#f5f3ff,transparent)]">
      <div className="flex">
        <aside className="sticky top-0 hidden h-screen w-[270px] flex-col border-r border-border bg-white/80 px-4 py-6 backdrop-blur lg:flex">
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-700 to-purple-500 text-sm font-semibold text-white">
              SL
            </div>
            <div>
              <div className="text-base font-semibold text-slate-900">SkillLink Nexus</div>
              <div className="text-xs text-slate-500">Ops Control</div>
            </div>
          </div>

          <nav className="mt-8 space-y-1 text-sm">
            <Link
              className={`flex items-center gap-3 rounded-lg px-3 py-2 font-medium transition ${
                isActive("/admin") ? "bg-purple-50 text-purple-700" : "text-slate-600 hover:bg-slate-100"
              }`}
              href="/admin"
            >
              <LayoutDashboard className="h-4 w-4" />
              Command Center
            </Link>
            <Link
              className={`flex items-center gap-3 rounded-lg px-3 py-2 font-medium transition ${
                isActive("/admin/intake") ? "bg-purple-50 text-purple-700" : "text-slate-600 hover:bg-slate-100"
              }`}
              href="/admin/intake"
            >
              <Inbox className="h-4 w-4" />
              New Project Intake
            </Link>
            <Link
              className={`flex items-center gap-3 rounded-lg px-3 py-2 font-medium transition ${
                isActive("/admin/assignment") ? "bg-purple-50 text-purple-700" : "text-slate-600 hover:bg-slate-100"
              }`}
              href="/admin/assignment"
            >
              <Sparkles className="h-4 w-4" />
              Assignment Desk
            </Link>
            <Link
              className={`flex items-center gap-3 rounded-lg px-3 py-2 font-medium transition ${
                isActive("/admin/projects") ? "bg-purple-50 text-purple-700" : "text-slate-600 hover:bg-slate-100"
              }`}
              href="/admin/projects"
            >
              <FolderKanban className="h-4 w-4" />
              Delivery Tracking
            </Link>
            <Link
              className={`flex items-center gap-3 rounded-lg px-3 py-2 font-medium transition ${
                isActive("/admin/relay") ? "bg-purple-50 text-purple-700" : "text-slate-600 hover:bg-slate-100"
              }`}
              href="/admin/relay"
            >
              <MessageSquare className="h-4 w-4" />
              Client Comms
            </Link>
            <Link
              className={`flex items-center gap-3 rounded-lg px-3 py-2 font-medium transition ${
                isActive("/admin/users") ? "bg-purple-50 text-purple-700" : "text-slate-600 hover:bg-slate-100"
              }`}
              href="/admin/users"
            >
              <Users className="h-4 w-4" />
              Users
            </Link>
            <Link
              className={`flex items-center gap-3 rounded-lg px-3 py-2 font-medium transition ${
                isActive("/admin/specialists") ? "bg-purple-50 text-purple-700" : "text-slate-600 hover:bg-slate-100"
              }`}
              href="/admin/specialists"
            >
              <Users className="h-4 w-4" />
              Freelancer Pool
            </Link>
            <Link
              className={`flex items-center gap-3 rounded-lg px-3 py-2 font-medium transition ${
                isActive("/admin/escalations") ? "bg-purple-50 text-purple-700" : "text-slate-600 hover:bg-slate-100"
              }`}
              href="/admin/escalations"
            >
              <AlertTriangle className="h-4 w-4" />
              Escalations
            </Link>
            <Link
              className={`flex items-center gap-3 rounded-lg px-3 py-2 font-medium transition ${
                isActive("/admin/payments") ? "bg-purple-50 text-purple-700" : "text-slate-600 hover:bg-slate-100"
              }`}
              href="/admin/payments"
            >
              <CreditCard className="h-4 w-4" />
              Payments
            </Link>
            <Link
              className={`flex items-center gap-3 rounded-lg px-3 py-2 font-medium transition ${
                isActive("/admin/analytics") ? "bg-purple-50 text-purple-700" : "text-slate-600 hover:bg-slate-100"
              }`}
              href="/admin/analytics"
            >
              <LineChart className="h-4 w-4" />
              Reports
            </Link>
          </nav>

          <div className="mt-auto space-y-3 px-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleTheme("light")}
                className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 active:scale-95 ${
                  !dark
                    ? "bg-purple-100 text-purple-600"
                    : "text-slate-400 hover:text-slate-600"
                }`}
                aria-label="Light mode"
              >
                <Sun className="h-4 w-4" />
              </button>
              <button
                onClick={() => toggleTheme("dark")}
                className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 active:scale-95 ${
                  dark
                    ? "bg-purple-100 text-purple-600"
                    : "text-slate-400 hover:text-slate-600"
                }`}
                aria-label="Dark mode"
              >
                <Moon className="h-4 w-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
            <div className="rounded-xl border border-purple-100 bg-purple-50/70 p-4 text-xs text-purple-900">
              <div className="font-semibold">Delivery Pulse</div>
              <div className="mt-1 text-purple-700">Auto-assignments refreshed every hour.</div>
            </div>
          </div>
        </aside>

        <main className="flex-1 px-4 pb-12 pt-2 sm:px-6 sm:pt-3">
          <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <button
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-white text-slate-700"
                    aria-label="Open navigation"
                  >
                    <Menu className="h-4 w-4" />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0">
                  <div className="flex h-full flex-col gap-6 p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-700 to-purple-500 text-sm font-semibold text-white">
                        SL
                      </div>
                      <div>
                        <div className="text-base font-semibold text-slate-900">SkillLink Nexus</div>
                        <div className="text-xs text-slate-500">Ops Control</div>
                      </div>
                    </div>
                    <nav className="space-y-1 text-sm">
                      <Link
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 font-medium transition ${
                          isActive("/admin") ? "bg-purple-50 text-purple-700" : "text-slate-600 hover:bg-slate-100"
                        }`}
                        href="/admin"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Command Center
                      </Link>
                      <Link
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 font-medium transition ${
                          isActive("/admin/intake") ? "bg-purple-50 text-purple-700" : "text-slate-600 hover:bg-slate-100"
                        }`}
                        href="/admin/intake"
                      >
                        <Inbox className="h-4 w-4" />
                        New Project Intake
                      </Link>
                      <Link
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 font-medium transition ${
                          isActive("/admin/assignment") ? "bg-purple-50 text-purple-700" : "text-slate-600 hover:bg-slate-100"
                        }`}
                        href="/admin/assignment"
                      >
                        <Sparkles className="h-4 w-4" />
                        Assignment Desk
                      </Link>
                      <Link
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 font-medium transition ${
                          isActive("/admin/projects") ? "bg-purple-50 text-purple-700" : "text-slate-600 hover:bg-slate-100"
                        }`}
                        href="/admin/projects"
                      >
                        <FolderKanban className="h-4 w-4" />
                        Delivery Tracking
                      </Link>
                      <Link
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 font-medium transition ${
                          isActive("/admin/relay") ? "bg-purple-50 text-purple-700" : "text-slate-600 hover:bg-slate-100"
                        }`}
                        href="/admin/relay"
                      >
                        <MessageSquare className="h-4 w-4" />
                        Client Comms
                      </Link>
                      <Link
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 font-medium transition ${
                          isActive("/admin/users") ? "bg-purple-50 text-purple-700" : "text-slate-600 hover:bg-slate-100"
                        }`}
                        href="/admin/users"
                      >
                        <Users className="h-4 w-4" />
                        Users
                      </Link>
                      <Link
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 font-medium transition ${
                          isActive("/admin/specialists") ? "bg-purple-50 text-purple-700" : "text-slate-600 hover:bg-slate-100"
                        }`}
                        href="/admin/specialists"
                      >
                        <Users className="h-4 w-4" />
                        Freelancer Pool
                      </Link>
                      <Link
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 font-medium transition ${
                          isActive("/admin/escalations") ? "bg-purple-50 text-purple-700" : "text-slate-600 hover:bg-slate-100"
                        }`}
                        href="/admin/escalations"
                      >
                        <AlertTriangle className="h-4 w-4" />
                        Escalations
                      </Link>
                      <Link
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 font-medium transition ${
                          isActive("/admin/payments") ? "bg-purple-50 text-purple-700" : "text-slate-600 hover:bg-slate-100"
                        }`}
                        href="/admin/payments"
                      >
                        <CreditCard className="h-4 w-4" />
                        Payments
                      </Link>
                      <Link
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 font-medium transition ${
                          isActive("/admin/analytics") ? "bg-purple-50 text-purple-700" : "text-slate-600 hover:bg-slate-100"
                        }`}
                        href="/admin/analytics"
                      >
                        <LineChart className="h-4 w-4" />
                        Reports
                      </Link>
                    </nav>
                    <div className="mt-auto space-y-3">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Log out
                      </button>
                      <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleTheme("light")}
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 active:scale-95 ${
                          !dark
                            ? "bg-purple-100 text-purple-600"
                            : "text-slate-400 hover:text-slate-600"
                        }`}
                        aria-label="Light mode"
                      >
                        <Sun className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => toggleTheme("dark")}
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 active:scale-95 ${
                          dark
                            ? "bg-purple-100 text-purple-600"
                            : "text-slate-400 hover:text-slate-600"
                        }`}
                        aria-label="Dark mode"
                      >
                        <Moon className="h-4 w-4" />
                      </button>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
