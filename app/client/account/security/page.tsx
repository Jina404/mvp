"use client";

import ClientLayout from "@/components/ClientLayout";

export default function SecurityPage() {
  return (
    <ClientLayout activeNav="overview" title="Security" subtitle="Manage passwords and two-factor auth.">
      <div className="rounded-2xl border border-border bg-white/80 p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Security</h1>
        <p className="mt-2 text-sm text-slate-600">Manage your password, two-factor authentication, and active sessions.</p>
      </div>
    </ClientLayout>
  );
}
