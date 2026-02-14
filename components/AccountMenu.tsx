"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  HelpCircle,
  LifeBuoy,
  LogOut,
  Settings,
  Shield,
  User
} from "lucide-react";

export default function AccountMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("skilllink_role");
      window.localStorage.removeItem("skilllink_user");
    }
    setOpen(false);
    router.push("/");
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-[0_1px_3px_rgba(0,0,0,0.04)] ring-1 ring-transparent transition-all duration-200 hover:shadow-md hover:ring-purple-200/60 hover:border-purple-100 active:scale-[0.98] dark:border-white/10 dark:bg-[#1E2329] dark:hover:ring-purple-500/20 dark:hover:border-purple-500/10"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-indigo-500 text-[11px] font-bold text-white shadow-sm shadow-purple-200/50">
          AL
        </div>
        <span className="hidden text-[13px] font-semibold text-slate-700 dark:text-slate-300 sm:inline">Acme Logistics</span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-60 origin-top-right animate-scale-in rounded-2xl border border-slate-200/60 bg-white py-1.5 shadow-xl shadow-slate-200/50 dark:border-white/10 dark:bg-[#1E2329] dark:shadow-black/30">
          {/* Account */}
          <div className="px-4 pb-1 pt-2.5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Account</p>
          </div>
          <MenuLink href="/client/account/profile" icon={User} label="Profile" onClick={() => setOpen(false)} />

          {/* Settings */}
          <div className="px-4 pb-1 pt-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Settings</p>
          </div>
          <MenuLink href="/client/account/settings" icon={Settings} label="Settings" onClick={() => setOpen(false)} />
          <MenuLink href="/client/account/security" icon={Shield} label="Security" onClick={() => setOpen(false)} />
          <MenuLink href="/client/account/notifications" icon={Bell} label="Notifications" onClick={() => setOpen(false)} />

          {/* Support */}
          <div className="px-4 pb-1 pt-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Support</p>
          </div>
          <MenuLink href="/client/support" icon={HelpCircle} label="Help Center" onClick={() => setOpen(false)} />
          <MenuLink href="/client/support/contact" icon={LifeBuoy} label="Contact Support" onClick={() => setOpen(false)} />

          {/* Divider + Logout */}
          <div className="mx-3 my-1.5 border-t border-slate-100 dark:border-white/5" />
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg mx-1.5 px-3 py-2 text-[13px] font-medium text-red-600 transition-all duration-200 hover:bg-red-50 active:scale-[0.98] dark:text-red-400 dark:hover:bg-red-500/10"
            style={{ width: "calc(100% - 12px)" }}
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

function MenuLink({
  href,
  icon: Icon,
  label,
  onClick
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="mx-1.5 flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-600 transition-all duration-200 hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98] dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-slate-200"
    >
      <Icon className="h-4 w-4 text-slate-400 dark:text-slate-500" />
      {label}
    </Link>
  );
}