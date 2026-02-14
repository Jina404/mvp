"use client";

import ClientLayout from "@/components/ClientLayout";

export default function ContactSupportPage() {
  return (
    <ClientLayout activeNav="overview" title="Contact Support" subtitle="Reach our support team.">
      <div className="rounded-2xl border border-border bg-white/80 p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Contact Support</h1>
        <p className="mt-2 text-sm text-slate-600">Tell us what you need and we will route your request to the right team.</p>
        <div className="mt-5 space-y-2 text-sm text-slate-600">
          <p>Email: support@skilllinknexus.com</p>
          <p>WhatsApp: +254 700 000 000</p>
          <p>Hours: Mon – Fri, 9:00 AM – 6:00 PM EAT</p>
        </div>
      </div>
    </ClientLayout>
  );
}
