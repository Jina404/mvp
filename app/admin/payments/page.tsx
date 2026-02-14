"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { getProjects, initMockDb, updateProjectPricing } from "@/lib/mockDb";

export default function PaymentsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [refresh, setRefresh] = useState(0);
  const projects = useMemo(() => getProjects(), [refresh]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    const loaded = initMockDb();
    if (loaded) {
      setRefresh((value) => value + 1);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const role = window.localStorage.getItem("skilllink_role");
    if (role !== "admin") {
      router.replace("/");
    }
  }, [router]);

  const selected = selectedId ? projects.find((project) => project.id === selectedId) : projects[0];

  const handleSave = () => {
    if (!selected) {
      toast({ title: "Select a project", description: "Choose a project to edit.", variant: "destructive" });
      return;
    }

    updateProjectPricing(selected.id, {
      quoteAmount: selected.quoteAmount,
      amountPaid: selected.amountPaid,
      paymentMethod: selected.paymentMethod,
      freelancerPayout: selected.freelancerPayout,
      margin: selected.margin
    });
    setRefresh((value) => value + 1);
    toast({ title: "Payment info saved", description: "Financial details updated." });
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Payments + Invoices</h1>
          <p className="mt-2 text-sm text-slate-500">Track quotes, payouts, and margins across every project.</p>
        </div>
        <Link className={buttonVariants({ variant: "outline" })} href="/admin">
          Back to Command Center
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">Projects</div>
            <Badge variant="secondary">Payments</Badge>
          </div>
          <div className="mt-4 space-y-2">
            {projects.map((project) => (
              <button
                key={project.id}
                className={`flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left text-sm transition ${
                  selected?.id === project.id
                    ? "border-purple-200 bg-purple-50/70"
                    : "border-border bg-white hover:bg-slate-50"
                }`}
                onClick={() => setSelectedId(project.id)}
              >
                <div>
                  <div className="font-medium text-slate-900">{project.title}</div>
                  <div className="text-xs text-slate-500">{project.client}</div>
                </div>
                <Badge variant="subtle">{project.quoteAmount}</Badge>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">Payment Details</div>
            <Badge variant="secondary">Finance</Badge>
          </div>
          {!selected ? (
            <div className="mt-6 rounded-xl border border-dashed border-border p-6 text-center">
              <div className="text-sm font-medium text-slate-700">Select a project to edit</div>
              <div className="mt-1 text-xs text-slate-500">Choose from the list on the left.</div>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500">Quote Amount</label>
                <Input
                  value={selected.quoteAmount ?? ""}
                  onChange={(event) => updateProjectPricing(selected.id, { quoteAmount: event.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500">Amount Paid</label>
                <Input
                  value={selected.amountPaid ?? ""}
                  onChange={(event) => updateProjectPricing(selected.id, { amountPaid: event.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500">Payment Method</label>
                <select
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={selected.paymentMethod ?? "Other"}
                  onChange={(event) => updateProjectPricing(selected.id, { paymentMethod: event.target.value })}
                >
                  <option>M-Pesa</option>
                  <option>Bank Transfer</option>
                  <option>PayPal</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500">Freelancer Payout</label>
                <Input
                  value={selected.freelancerPayout ?? ""}
                  onChange={(event) => updateProjectPricing(selected.id, { freelancerPayout: event.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500">Margin</label>
                <Input
                  value={selected.margin ?? ""}
                  onChange={(event) => updateProjectPricing(selected.id, { margin: event.target.value })}
                />
              </div>
              <Button onClick={handleSave}>Save Payment Info</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
