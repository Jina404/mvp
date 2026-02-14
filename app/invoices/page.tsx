"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getInvoices, getProjects, initMockDb } from "@/lib/mockDb";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import ClientLayout from "@/components/ClientLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Download,
  Eye,
  FileText,
  X,
} from "lucide-react";

/* ─── Sample data ──────────────────────────────────────────────────────────── */

const SAMPLE_INVOICES = [
  { id: "s2", invoiceNumber: "INV-1002", amount: "KES 18,500", rawAmount: 18500, status: "Paid", dueDate: "2026-02-28", project: "Mobile App",           company: "TechStart Inc" },
  { id: "s3", invoiceNumber: "INV-1003", amount: "KES 31,750", rawAmount: 31750, status: "Paid", dueDate: "2026-03-15", project: "Brand Refresh",         company: "Creative Co" },
  { id: "s5", invoiceNumber: "INV-1005", amount: "KES 45,300", rawAmount: 45300, status: "Paid", dueDate: "2026-01-10", project: "API Development",       company: "DataFlow Systems" },
];

function ksh(v: number) {
  return `KES ${v.toLocaleString()}`;
}

/* ─── Status pill ──────────────────────────────────────────────────────────── */

const statusStyle: Record<string, string> = {
  Paid: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
};

function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${
        statusStyle[status] ?? statusStyle.Paid
      }`}
    >
      {status}
    </span>
  );
}

/* ─── Drawer ───────────────────────────────────────────────────────────────── */

function InvoiceDrawer({
  invoice,
  onClose,
}: {
  invoice: any;
  onClose: () => void;
}) {
  if (!invoice) return null;

  const rows: [string, React.ReactNode][] = [
    ["Invoice", `#${invoice.invoiceNumber}`],
    ["Company", invoice.company ?? "—"],
    ["Project", invoice.project ?? "—"],
    ["Amount", invoice.amount],
    ["Due date", invoice.dueDate],
    ["Status", <StatusPill key="s" status={invoice.status} />],
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Panel */}
      <aside className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[420px] flex-col border-l border-slate-200 bg-white shadow-xl dark:border-white/5 dark:bg-[#151921]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 px-6 py-5">
          <h2 className="text-[15px] font-semibold text-slate-900 dark:text-slate-100">
            Invoice #{invoice.invoiceNumber}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/5"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-4">
            {rows.map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-slate-500 dark:text-slate-400">
                  {label}
                </span>
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div className="mt-8">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Notes
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Auto-generated invoice for milestone payment. Contact support if
              you need adjustments.
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="border-t border-slate-100 dark:border-white/5 px-6 py-4">
          <div className="flex gap-3">
            <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
              <Download className="h-4 w-4" />
              Download PDF
            </button>
            <button className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5">
              <Eye className="h-4 w-4" />
              View
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────────────── */

export default function InvoicesPage() {
  const router = useRouter();
  const [refresh, setRefresh] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState<any>(null);

  const realInvoices = useMemo(() => getInvoices(), [refresh]);
  const projects = useMemo(() => getProjects(), [refresh]);

  // Merge real + sample so the table is never empty
  const allInvoices = useMemo(() => {
    const real = realInvoices.map((inv: any) => ({
      ...inv,
      company: "Acme Logistics",
      project:
        projects.find((p: any) => p.id === inv.projectId)?.title ?? "Project",
      rawAmount: parseInt(String(inv.amount).replace(/[^0-9]/g, ""), 10) || 0,
    }));
    return real.length >= 4 ? real : [...real, ...SAMPLE_INVOICES].slice(0, 6);
  }, [realInvoices, projects]);

  // Filter
  const filtered = allInvoices.filter((inv: any) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      inv.invoiceNumber.toLowerCase().includes(q) ||
      inv.company?.toLowerCase().includes(q) ||
      inv.project?.toLowerCase().includes(q);
    const matchStatus =
      statusFilter === "All" || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  useEffect(() => {
    const loaded = initMockDb();
    if (loaded) setRefresh((v) => v + 1);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const role = window.localStorage.getItem("skilllink_role");
    if (role === "admin") { router.replace("/admin"); return; }
    if (role !== "client") { router.replace("/"); return; }
    setReady(true);
  }, [router]);

  if (!ready) return null;

  return (
    <ClientLayout
      activeNav="invoices"
      title="Invoices"
      subtitle="Invoices are auto-generated for every milestone."
    >
      <div className="space-y-8">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <>
            {/* ── Search + filter ─────────────────────────────────────────── */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search invoices…"
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-white/20"
                />
              </div>
              <div className="flex gap-1.5">
                {["All", "Paid"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                      statusFilter === s
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Table (desktop) ─────────────────────────────────────────── */}
            <div className="hidden sm:block">
              <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-white/5">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-200 bg-slate-50/60 dark:border-white/5 dark:bg-white/[0.02]">
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Invoice</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Project</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Amount</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Due</TableHead>
                      <TableHead className="text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6}>
                          <div className="flex flex-col items-center gap-1.5 py-16 text-center">
                            <FileText className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                            <div className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                              No invoices match your filters
                            </div>
                            <div className="text-xs text-slate-400 dark:text-slate-500">
                              Try a different search or status.
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filtered.map((inv: any) => (
                        <TableRow
                          key={inv.id}
                          onClick={() => setSelected(inv)}
                          className="cursor-pointer border-slate-100 transition-colors hover:bg-slate-50/80 dark:border-white/5 dark:hover:bg-white/[0.02]"
                        >
                          <TableCell className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {inv.invoiceNumber}
                          </TableCell>
                          <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                            {inv.project}
                          </TableCell>
                          <TableCell className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {inv.amount}
                          </TableCell>
                          <TableCell>
                            <StatusPill status={inv.status} />
                          </TableCell>
                          <TableCell className="text-sm text-slate-500 dark:text-slate-400">
                            {inv.dueDate}
                          </TableCell>
                          <TableCell className="text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelected(inv);
                              }}
                              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-slate-200"
                            >
                              <Download className="h-3.5 w-3.5" />
                              PDF
                            </button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* ── Cards (mobile) ──────────────────────────────────────────── */}
            <div className="space-y-2 sm:hidden">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center gap-1.5 rounded-xl border border-dashed border-slate-200 py-16 text-center dark:border-white/10">
                  <FileText className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                  <div className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                    No invoices match
                  </div>
                </div>
              ) : (
                filtered.map((inv: any) => (
                  <button
                    key={inv.id}
                    onClick={() => setSelected(inv)}
                    className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-left transition-colors hover:bg-slate-50 dark:border-white/5 dark:bg-white/[0.02] dark:hover:bg-white/[0.04]"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {inv.invoiceNumber}
                        </span>
                        <StatusPill status={inv.status} />
                      </div>
                      <div className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                        {inv.project}
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {inv.amount}
                      </div>
                      <div className="mt-0.5 text-xs text-slate-400">
                        {inv.dueDate}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* ── Drawer ──────────────────────────────────────────────────────── */}
      <InvoiceDrawer invoice={selected} onClose={() => setSelected(null)} />
    </ClientLayout>
  );
}
