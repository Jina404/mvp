"use client";

import ClientLayout from "@/components/ClientLayout";

export default function HelpCenterPage() {
  return (
    <ClientLayout activeNav="overview" title="Help Center" subtitle="Browse articles and FAQs.">
      <div className="rounded-2xl border border-border bg-white/80 p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Help Center</h1>
        <p className="mt-2 text-sm text-slate-600">Browse articles, guides, and frequently asked questions.</p>
      </div>
    </ClientLayout>
  );
}
