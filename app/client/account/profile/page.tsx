"use client";

import ClientLayout from "@/components/ClientLayout";

export default function ProfilePage() {
  return (
    <ClientLayout activeNav="overview" title="Profile" subtitle="Manage your account profile.">
      <div className="rounded-2xl border border-border bg-white/80 p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Profile</h1>
        <p className="mt-2 text-sm text-slate-600">Your account details and preferences.</p>
      </div>
    </ClientLayout>
  );
}
