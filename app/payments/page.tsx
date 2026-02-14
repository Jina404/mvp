"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PaymentSection from "@/components/PaymentSection";
import ClientLayout from "@/components/ClientLayout";

export default function PaymentsPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const role = window.localStorage.getItem("skilllink_role");
    if (role === "admin") {
      router.replace("/admin");
      return;
    }
    if (role !== "client") {
      router.replace("/");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) return null;

  return (
    <ClientLayout
      activeNav="payments"
      title="Payments"
      subtitle="Pay directly from your method to fund escrow and release milestones."
    >
      <PaymentSection />
    </ClientLayout>
  );
}
