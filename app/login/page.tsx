"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const adminEmail = "info@skilllinknexus.com";
const adminPassword = "Admin";
const clientEmail = "client@skilllinknexus.com";
const clientPassword = "Client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const role = window.localStorage.getItem("skilllink_role");
    if (role === "admin") {
      router.replace("/admin");
    } else if (role === "client") {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleLogin = () => {
    setError("");

    if (!email || !password) {
      setError("Please enter your email or username and password.");
      return;
    }

    const isAdmin = email === adminEmail && password === adminPassword;
    const isClient = email === clientEmail && password === clientPassword;

    if (!isAdmin && !isClient) {
      setError("Invalid credentials");
      return;
    }

    if (typeof window !== "undefined") {
      window.localStorage.setItem("skilllink_role", isAdmin ? "admin" : "client");
    }

    router.replace(isAdmin ? "/admin" : "/dashboard");
  };

  return (
    <div className="login-container">
      <div className="w-full max-w-[420px] rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
        <div className="flex flex-col items-center text-center">
          <Image src="/logo.png" alt="SkillLink Nexus logo" width={48} height={48} priority />
          <h1 className="mt-4 text-xl font-semibold text-slate-900">Sign in</h1>
          <p className="mt-1 text-sm text-slate-500">Use your email or username and password.</p>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-[13px] font-medium text-slate-700">Email or username</label>
            <div className="relative mt-1">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M4 6h16v12H4z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="m4 7 8 6 8-6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <input
                type="text"
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 pl-10 text-sm text-slate-900 placeholder:text-slate-400 transition hover:border-slate-300 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
                placeholder="e.g. client@company.com or acme-logistics"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-[13px] font-medium text-slate-700">Password</label>
            <div className="relative mt-1">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M6 10h12v10H6z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 10V8a4 4 0 0 1 8 0v2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 transition hover:border-slate-300 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-slate-400 transition hover:text-slate-600"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M3 3l18 18"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10.6 10.6A2.5 2.5 0 0 0 14 14"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7.2 7.2C4.4 9 2 12 2 12s3.5 6 10 6c1.6 0 3-.3 4.2-.8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17.6 17.6C20.4 15.8 22 12 22 12s-3.5-6-10-6c-1.4 0-2.7.2-3.8.6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-600">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
            Remember me
          </label>
          <Link className="font-medium text-purple-700 transition hover:text-purple-800" href="/client/support/contact">
            Forgot password?
          </Link>
        </div>

        {error && (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
            {error}
          </div>
        )}

        <button
          className="mt-4 h-10 w-full rounded-lg bg-purple-700 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-800"
          onClick={handleLogin}
        >
          Sign in
        </button>

        <p className="mt-3 text-center text-xs text-slate-500">
          Need help? Contact{" "}
          <a className="font-medium text-purple-700 hover:text-purple-800" href="mailto:info@skilllinknexus.com">
            info@skilllinknexus.com
          </a>
        </p>

        <div className="mt-5 text-center text-xs text-slate-500">
          Need access?{" "}
          <Link className="font-semibold text-purple-700 hover:text-purple-800" href="/request">
            Request access →
          </Link>
        </div>
      </div>
    </div>
  );
}
