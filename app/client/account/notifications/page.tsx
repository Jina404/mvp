"use client";

import ClientLayout from "@/components/ClientLayout";

export default function NotificationsPage() {
  return (
    <ClientLayout activeNav="overview" title="Notifications" subtitle="Manage notification preferences.">
      <div className="rounded-2xl border border-border bg-white/80 p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Notifications</h1>
        <p className="mt-2 text-sm text-slate-600">Choose how and when you receive notifications.</p>
      </div>
    </ClientLayout>
  );
}
