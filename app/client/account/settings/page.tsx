"use client";

import ClientLayout from "@/components/ClientLayout";

export default function AccountSettingsPage() {
  return (
    <ClientLayout activeNav="overview" title="Settings" subtitle="Manage your account settings.">
      <div className="rounded-2xl border border-border bg-white/80 p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
        <p className="mt-2 text-sm text-slate-600">Configure your account preferences.</p>
      </div>
    </ClientLayout>
  );
}
