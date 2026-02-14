"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  BadgeCheck,
  Banknote,
  CreditCard,
  Eye,
  Lock,
  Shield,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MilestonePayments from "@/components/MilestonePayments";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  type PaymentState,
  type PaymentMethod,
  type EscrowSummary,
  getPaymentState,
  approveAndRelease,
  fundProjectEscrow,
  getEscrowSummary,
} from "@/lib/paymentStore";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ksh(value: number) {
  return `KSh ${value.toLocaleString()}`;
}


const ESCROW_LABEL: Record<string, string> = {
  UNFUNDED: "Unfunded",
  HELD_IN_ESCROW: "Held",
  READY_TO_RELEASE: "Ready to release",
  RELEASED: "Released",
};

const ESCROW_BADGE_VARIANT: Record<string, "default" | "secondary" | "outline" | "subtle"> = {
  UNFUNDED: "outline",
  HELD_IN_ESCROW: "secondary",
  READY_TO_RELEASE: "default",
  RELEASED: "subtle",
};

const TXN_ICON: Record<string, typeof ArrowDownLeft> = {
  TOP_UP: ArrowDownLeft,
  ESCROW_HOLD: Lock,
  ESCROW_RELEASE: ArrowUpRight,
  REFUND_TO_WALLET: ArrowDownLeft,
};

const TXN_COLOR: Record<string, string> = {
  TOP_UP: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400",
  ESCROW_HOLD: "text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400",
  ESCROW_RELEASE: "text-purple-600 bg-purple-50 dark:bg-purple-500/10 dark:text-purple-400",
  REFUND_TO_WALLET: "text-sky-600 bg-sky-50 dark:bg-sky-500/10 dark:text-sky-400",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function PaymentSection() {
  const [state, setState] = useState<PaymentState | null>(null);
  const [escrow, setEscrow] = useState<EscrowSummary>({ held: 0, released: 0, remaining: 0 });
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [fundProjectOpen, setFundProjectOpen] = useState(false);
  const [fundingMethod, setFundingMethod] = useState<PaymentMethod>("MPESA");
  const [mpesaMobileNumber, setMpesaMobileNumber] = useState("");
  const [mpesaNumberError, setMpesaNumberError] = useState("");
  const [mpesaPinOpen, setMpesaPinOpen] = useState(false);
  const [mpesaPin, setMpesaPin] = useState("");
  const [justFunded, setJustFunded] = useState(false);
  const [confirmReleaseId, setConfirmReleaseId] = useState<number | null>(null);
  const [viewMilestoneId, setViewMilestoneId] = useState<number | null>(null);

  const refresh = useCallback(
    (projectId?: number) => {
      const s = getPaymentState();
      setState(s);
      const pid = projectId ?? selectedProjectId ?? s.projects[0]?.id ?? 1;
      if (selectedProjectId === null) {
        setSelectedProjectId(pid);
      }
      setEscrow(getEscrowSummary(pid));
    },
    [selectedProjectId]
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (selectedProjectId !== null) {
      setEscrow(getEscrowSummary(selectedProjectId));
    }
  }, [selectedProjectId]);

  if (!state) return null;
  const activeProjectId = selectedProjectId ?? state.projects[0]?.id;
  const activeProject = state.projects.find((project) => project.id === activeProjectId);
  if (!activeProjectId || !activeProject) return null;

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleFundProject = () => {

    // Validate M-PESA mobile number if selected
    if (fundingMethod === "MPESA") {
      const trimmed = mpesaMobileNumber.trim();
      if (!/^(01|07)\d{8}$/.test(trimmed)) {
        setMpesaNumberError("Enter a valid M-Pesa number");
        return;
      } else {
        setMpesaNumberError("");
      }
    }

    // For M-PESA, show PIN modal instead of processing immediately
    if (fundingMethod === "MPESA") {
      setMpesaPinOpen(true);
      return;
    }

    // For other payment methods, process immediately
    processFundProject();
  };

  const processFundProject = () => {
    // Read fresh state to avoid stale closure issues
    const freshState = getPaymentState();
    const unfunded = freshState.milestonePayments
      .filter((m) => m.projectId === activeProjectId && m.escrowStatus === "UNFUNDED")
      .map((m) => m.milestoneId);
    if (unfunded.length > 0) {
      fundProjectEscrow(activeProjectId, unfunded, fundingMethod, false);
    }

    // Always close modals and reset state
    setMpesaPinOpen(false);
    setFundProjectOpen(false);
    setMpesaMobileNumber("");
    setMpesaPin("");
    setMpesaNumberError("");
    setJustFunded(true);
    setTimeout(() => setJustFunded(false), 6000);
    refresh();
  };

  const handleMpesaPinConfirm = () => {
    if (!mpesaPin.trim()) {
      alert("Please enter your M-Pesa PIN");
      return;
    }
    processFundProject();
  };

  const handleApproveRelease = (milestoneId: number) => {
    approveAndRelease(activeProjectId, milestoneId);
    setConfirmReleaseId(null);
    refresh();
  };

  const handlePayNow = (projectId: number) => {
    setSelectedProjectId(projectId);
    setFundProjectOpen(true);
  };

  // ─── Derived data ─────────────────────────────────────────────────────────

  const projectMilestones = state.milestonePayments.filter(
    (m) => m.projectId === activeProjectId
  );
  const unfundedMilestones = projectMilestones.filter(
    (m) => m.escrowStatus === "UNFUNDED"
  );
  const unfundedTotal = unfundedMilestones.reduce((s, m) => s + m.cost, 0);

  const allTxns = state.transactions.filter(
    (txn) => !txn.projectId || txn.projectId === activeProjectId
  );

  const hasUnfunded = unfundedMilestones.length > 0;

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      <style>{`
        input[type="password"]:-webkit-autofill,
        input[type="password"]:-webkit-autofill:hover,
        input[type="password"]:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px transparent inset !important;
          -webkit-text-fill-color: currentColor !important;
        }
      `}</style>
      <section className="mt-4">
      {/* ── Project list with Pay Now ────────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-white dark:bg-[#1E2329] dark:border-white/5 p-5 shadow-sm">
        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Projects</div>
        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Choose a project to fund escrow immediately.
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {state.projects.map((project) => (
            <div
              key={project.id}
              className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 transition-colors ${
                activeProjectId === project.id
                  ? "border-emerald-300 bg-emerald-50/60 dark:border-emerald-500/30 dark:bg-emerald-500/10"
                  : "border-border bg-white dark:bg-[#1E2329] dark:border-white/5"
              }`}
            >
              <div>
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {project.title}
                </div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Quote: {ksh(project.quoteTotal)}
                </div>
              </div>
              {(() => {
                const projectUnfunded = state.milestonePayments
                  .filter((m) => m.projectId === project.id && m.escrowStatus === "UNFUNDED")
                  .length;
                return (
                  <Button 
                    size="sm" 
                    onClick={() => handlePayNow(project.id)}
                    disabled={projectUnfunded === 0}
                    variant={projectUnfunded === 0 ? "outline" : "default"}
                  >
                    {projectUnfunded === 0 ? "Paid" : "Pay Now"}
                  </Button>
                );
              })()}
            </div>
          ))}
        </div>
      </div>

      {/* ── Top row: Escrow + Funding ─────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Escrow Panel */}
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-border bg-white dark:bg-[#1E2329] dark:border-white/5 p-6 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
              <Shield className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              Escrow (Held Funds)
            </div>
            <div className="mt-3 text-xs text-slate-600 dark:text-slate-400">{activeProject.title}</div>
            <div className="mt-4">
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Amount Paid</div>
                <div className="mt-1 text-lg font-bold text-amber-600">
                  {ksh(escrow.held)}
                </div>
              </div>
            </div>
            <div className="mt-4 rounded-lg bg-amber-50 dark:bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
              <Lock className="mr-1.5 inline h-3 w-3" />
              Funds are released only when you approve a milestone.
            </div>
          </div>

          {/* Fund Project button */}
          {hasUnfunded && (
            <div className="rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/50 dark:border-emerald-500/30 dark:bg-emerald-500/10 p-6">
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Fund This Project
              </div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Secure funds in escrow so work can begin immediately.
              </div>
              <Button
                className="mt-4"
                onClick={() => setFundProjectOpen(true)}
              >
                <Banknote className="h-4 w-4" />
                Fund Project ({ksh(unfundedTotal)})
              </Button>
            </div>
          )}

          {/* Just-funded banner */}
          {justFunded && (
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10 px-5 py-4 text-sm font-medium text-emerald-800 dark:text-emerald-300 animate-in fade-in slide-in-from-top-2">
              <BadgeCheck className="h-5 w-5 flex-shrink-0 text-emerald-600" />
              Funds secured in escrow. Work can start immediately.
            </div>
          )}
        </div>
      </div>

      {/* ── Milestone Payments (Stepper) ───────────────────────────────── */}
      <div className="mt-8">
        <MilestonePayments />
      </div>

      {/* ── Transaction Log ────────────────────────────────────────────────── */}
      <div className="mt-8 rounded-2xl border border-border bg-white dark:bg-[#1E2329] dark:border-white/5 p-6 shadow-sm">
        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Payment Activity
        </div>
        <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          Full history of wallet and escrow movements.
        </div>
        {allTxns.length === 0 ? (
          <div className="mt-4 text-xs text-slate-400 dark:text-slate-500">No activity yet.</div>
        ) : (
          <div className="mt-4 space-y-2">
            {allTxns.map((txn) => {
              const Icon = TXN_ICON[txn.type] ?? ArrowDownLeft;
              const color = TXN_COLOR[txn.type] ?? "text-slate-600 bg-slate-50 dark:bg-white/5 dark:text-slate-400";
              return (
                <div
                  key={txn.id}
                  className="flex items-start gap-3 rounded-lg px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-white/5"
                >
                  <div
                    className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${color}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-slate-700 dark:text-slate-200">{txn.description}</div>
                    <div className="mt-0.5 text-slate-400 dark:text-slate-500">
                      {new Date(txn.createdAt).toLocaleString()}
                    </div>
                  </div>
                  {txn.amount > 0 && (
                    <div
                      className={`flex-shrink-0 font-semibold ${
                        txn.type === "TOP_UP" || txn.type === "REFUND_TO_WALLET"
                          ? "text-emerald-600"
                          : txn.type === "ESCROW_HOLD"
                          ? "text-amber-600"
                          : "text-purple-600"
                      }`}
                    >
                      {ksh(txn.amount)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Fund Project Modal ────────────────────────────────────────────── */}
      <Dialog open={fundProjectOpen} onOpenChange={(open) => {
        if (!open) {
          setMpesaMobileNumber("");
          setMpesaPin("");
          setMpesaPinOpen(false);
        }
        setFundProjectOpen(open);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fund This Project</DialogTitle>
            <DialogDescription>
              Pay directly from your selected method. Funds are held in escrow
              until you approve milestones.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-200">
                Payment Method
              </label>
              <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
                Pay using the method your business already trusts. Every payment is held securely in escrow and released instantly when you approve delivery.
              </p>
              <div className="grid grid-cols-4 gap-2">
                {(
                  [
                    { method: "MPESA" as PaymentMethod, label: "M-PESA", imageSrc: "/mpesa.png", Icon: undefined },
                    { method: "Card" as PaymentMethod, label: "Card", Icon: CreditCard, imageSrc: undefined },
                    { method: "Bank" as PaymentMethod, label: "Bank", Icon: Building2, imageSrc: undefined },
                    { method: "PayPal" as PaymentMethod, label: "PayPal", imageSrc: "/paypal.png", Icon: undefined },
                  ]
                ).map(({ method, Icon, label, imageSrc }) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setFundingMethod(method)}
                    className={`flex flex-col items-center gap-1 rounded-xl border-2 px-2.5 py-2 text-[11px] font-medium transition-colors ${
                      fundingMethod === method
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-500/50 dark:bg-emerald-500/10 dark:text-emerald-300"
                        : "border-border bg-white text-slate-600 hover:bg-slate-50 dark:bg-[#1E2329] dark:text-slate-300 dark:border-white/10 dark:hover:bg-white/5"
                    }`}
                  >
                    {imageSrc ? (
                      <img src={imageSrc} alt={label} className="h-4 w-4" />
                    ) : Icon ? (
                      <Icon className="h-4 w-4" />
                    ) : null}
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {fundingMethod === "MPESA" && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-500/20 dark:bg-amber-500/10 px-4 py-3 space-y-3">
                <div>
                  <div className="text-xs font-medium text-amber-900 dark:text-amber-300">M-Pesa</div>
                  <div className="mt-2 text-xs text-amber-800 dark:text-amber-400">
                    Enter your M-Pesa number, confirm the STK prompt on your phone, and your funds are placed in escrow immediately.
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-amber-900 dark:text-amber-300 mb-1.5">
                    M-Pesa Mobile Number
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="0790972886"
                    autoComplete="off"
                    data-lpignore="true"
                    data-form-type="other"
                    name={`mpesa-${Date.now()}`}
                    value={mpesaMobileNumber}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\s+/g, ""); // Remove spaces
                      // Only allow digits, max 10
                      val = val.replace(/[^\d]/g, "").slice(0, 10);
                      setMpesaMobileNumber(val);
                      // Only show error when input can no longer lead to a valid number
                      if (!val) {
                        setMpesaNumberError("");
                      } else if (/^0[17]\d{8}$/.test(val)) {
                        // Complete valid number
                        setMpesaNumberError("");
                      } else if (val.length === 1 && val !== "0") {
                        // First digit must be 0
                        setMpesaNumberError("Enter a valid M-Pesa number");
                      } else if (val.length >= 2 && !/^0[17]/.test(val)) {
                        // Second digit must be 1 or 7
                        setMpesaNumberError("Enter a valid M-Pesa number");
                      } else if (val.length === 10 && !/^0[17]\d{8}$/.test(val)) {
                        // 10 digits but invalid
                        setMpesaNumberError("Enter a valid M-Pesa number");
                      } else {
                        // Still typing a potentially valid number
                        setMpesaNumberError("");
                      }
                    }}
                    className={`w-full rounded-lg border ${mpesaNumberError && mpesaMobileNumber ? 'border-red-500' : 'border-amber-300 dark:border-amber-500/30'} bg-white dark:bg-[#181A20] px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500`}
                  />
                  {mpesaNumberError && mpesaMobileNumber && (
                    <div className="mt-1 text-xs text-red-600 font-medium">
                      {mpesaNumberError}
                    </div>
                  )}
                </div>
              </div>
            )}

            {fundingMethod === "Card" && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-500/20 dark:bg-blue-500/10 px-4 py-3">
                <div className="text-xs font-medium text-blue-900 dark:text-blue-300">Card (Visa / Mastercard)</div>
                <div className="mt-2 text-xs text-blue-800 dark:text-blue-400">
                  Enter your card details through a secure encrypted checkout. SkillLink Nexus does not store your card details — the payment is processed by a certified payment provider.
                </div>
              </div>
            )}

            {fundingMethod === "Bank" && (
              <div className="rounded-lg border border-purple-200 bg-purple-50 dark:border-purple-500/20 dark:bg-purple-500/10 px-4 py-3">
                <div className="text-xs font-medium text-purple-900 dark:text-purple-300">Bank Transfer</div>
                <div className="mt-2 text-xs text-purple-800 dark:text-purple-400">
                  Pay using your normal bank process (mobile banking, internet banking, or branch). You receive a reference code so the payment is automatically matched to your project.
                </div>
              </div>
            )}

            {fundingMethod === "PayPal" && (
              <div className="rounded-lg border border-indigo-200 bg-indigo-50 dark:border-indigo-500/20 dark:bg-indigo-500/10 px-4 py-3">
                <div className="text-xs font-medium text-indigo-900 dark:text-indigo-300">PayPal</div>
                <div className="mt-2 text-xs text-indigo-800 dark:text-indigo-400">
                  You'll be redirected to PayPal to log in and confirm the payment. Once approved, PayPal confirms the transaction and the funds are held in escrow.
                </div>
              </div>
            )}

            <div className="rounded-lg bg-slate-50 dark:bg-white/5 px-4 py-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Payment amount</span>
                <span className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {ksh(activeProject.quoteTotal)}
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Charge method</span>
                <span className="font-medium text-slate-600 dark:text-slate-300">{fundingMethod}</span>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={handleFundProject}
              disabled={fundingMethod === "MPESA" && !mpesaMobileNumber.trim()}
            >
              <Lock className="h-4 w-4" />
              Pay Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Approve & Release confirmation ────────────────────────────────── */}
      <Dialog
        open={confirmReleaseId !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmReleaseId(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve & Release Funds</DialogTitle>
            <DialogDescription>
              This will mark the milestone as approved and release the held
              escrow funds to the specialist.
            </DialogDescription>
          </DialogHeader>
          {confirmReleaseId !== null && (() => {
            const mp = projectMilestones.find(
              (m) => m.milestoneId === confirmReleaseId
            );
            if (!mp) return null;
            return (
              <div className="mt-4 space-y-4">
                <div className="rounded-lg bg-purple-50 dark:bg-purple-500/10 px-4 py-3 text-sm">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    {mp.milestoneTitle}
                  </div>
                  <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                    {ksh(mp.cost)} will be released to the specialist.
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setConfirmReleaseId(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => handleApproveRelease(confirmReleaseId)}
                  >
                    <BadgeCheck className="h-4 w-4" />
                    Approve & Release
                  </Button>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* ── View Milestone ─────────────────────────────────────────────── */}
      <Dialog
        open={viewMilestoneId !== null}
        onOpenChange={(open) => {
          if (!open) setViewMilestoneId(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Milestone Details</DialogTitle>
            <DialogDescription>
              Review milestone payment and escrow status.
            </DialogDescription>
          </DialogHeader>
          {viewMilestoneId !== null && (() => {
            const mp = projectMilestones.find(
              (m) => m.milestoneId === viewMilestoneId
            );
            if (!mp) return null;
            return (
              <div className="mt-4 space-y-3 text-sm">
                <div className="rounded-lg bg-slate-50 dark:bg-white/5 px-4 py-3">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    {mp.milestoneTitle}
                  </div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Project: {activeProject.title}
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-border dark:border-white/10 px-3 py-2">
                    <div className="text-xs text-slate-500 dark:text-slate-400">Cost</div>
                    <div className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                      {ksh(mp.cost)}
                    </div>
                  </div>
                  <div className="rounded-lg border border-border dark:border-white/10 px-3 py-2">
                    <div className="text-xs text-slate-500 dark:text-slate-400">Work Status</div>
                    <div className="mt-1">
                      <Badge
                        variant={
                          mp.workStatus === "Approved"
                            ? "default"
                            : mp.workStatus === "Submitted"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {mp.workStatus}
                      </Badge>
                    </div>
                  </div>
                  <div className="rounded-lg border border-border dark:border-white/10 px-3 py-2 sm:col-span-2">
                    <div className="text-xs text-slate-500 dark:text-slate-400">Escrow Status</div>
                    <div className="mt-1">
                      <Badge variant={ESCROW_BADGE_VARIANT[mp.escrowStatus]}>
                        {ESCROW_LABEL[mp.escrowStatus]}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" onClick={() => setViewMilestoneId(null)}>
                    Close
                  </Button>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* ── M-PESA PIN Modal ──────────────────────────────────────────────── */}
      <Dialog open={mpesaPinOpen} onOpenChange={(open) => {
        if (!open) {
          setMpesaPin("");
        }
        setMpesaPinOpen(open);
      }}>
        <DialogContent className="w-80 border-0 rounded-2xl p-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 leading-snug">
                Do you want to pay {ksh(activeProject.quoteTotal)} to SkillLink Nexus Ltd with Account no. 454361. Lipa na Mpesa?
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-900 dark:text-slate-100">
                Enter M-PESA PIN:
              </label>
              <input
                type="text"
                inputMode="numeric"
                autoFocus
                autoComplete="off"
                spellCheck="false"
                data-lpignore="true"
                data-form-type="other"
                name={`pin-${Date.now()}`}
                value={mpesaPin}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^\d]/g, "").slice(0, 4);
                  setMpesaPin(val);
                }}
                maxLength={4}
                style={{ WebkitTextSecurity: 'disc' } as React.CSSProperties}
                className="w-full bg-transparent border-b-2 border-slate-400 px-0 py-2 text-xl tracking-widest font-medium focus:outline-none focus:border-blue-500 caret-blue-500"
              />
            </div>

            <div className="flex gap-8 pt-3">
              <button
                type="button"
                onClick={() => setMpesaPinOpen(false)}
                className="flex-1 text-blue-600 text-base font-medium hover:text-blue-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleMpesaPinConfirm}
                className="flex-1 text-blue-600 text-base font-medium hover:text-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={mpesaPin.length < 4}
              >
                Send
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
    </>
  );
}
