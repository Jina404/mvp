"use client";

import { useState } from "react";
import {
  ChevronDown,
  Eye,
  CheckCircle2,
  Circle,
  MessageSquare,
  ExternalLink,
  Clock,
  ShieldCheck,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────── WorkStatus = "Pending" | "In Progress" | "Submitted" | "Approved";
type EscrowStatus = "Held" | "Ready to release" | "Released";

interface Milestone {
  name: string;
  cost: number;
  dueDate: string;
  workStatus: WorkStatus;
  escrowStatus: EscrowStatus;
  canRelease: boolean;
  deliverables?: string[];
  specialistNote?: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MILESTONES: Milestone[] = [
  {
    name: "Redesign Discovery",
    cost: 20000,
    dueDate: "2026-02-20",
    workStatus: "Approved",
    escrowStatus: "Released",
    canRelease: false,
    deliverables: [
      "User research report (12 interviews)",
      "Competitor audit spreadsheet",
      "IA sitemap v2",
      "Stakeholder alignment deck",
    ],
    specialistNote:
      "All discovery deliverables approved by the client. Research recordings are in the shared drive.",
  },
  {
    name: "Redesign Design",
    cost: 20000,
    dueDate: "2026-03-05",
    workStatus: "Submitted",
    escrowStatus: "Ready to release",
    canRelease: true,
    deliverables: [
      "Wireframes (mobile + desktop)",
      "Hi-fi mockups – 8 screens",
      "Design system tokens (Figma)",
      "Prototype link",
    ],
    specialistNote:
      "Hi-fi mockups are ready for review. Prototype link has been shared in the project channel.",
  },
  {
    name: "Redesign Build",
    cost: 20000,
    dueDate: "2026-03-25",
    workStatus: "In Progress",
    escrowStatus: "Held",
    canRelease: false,
    deliverables: [
      "Frontend implementation (Next.js)",
      "API integration layer",
      "Unit & integration tests",
      "Staging deployment",
    ],
    specialistNote:
      "Frontend scaffolding complete. Working on component library integration this week.",
  },
  {
    name: "Redesign Launch",
    cost: 20000,
    dueDate: "2026-04-10",
    workStatus: "Pending",
    escrowStatus: "Held",
    canRelease: false,
    deliverables: [
      "Production deployment",
      "DNS & SSL configuration",
      "Performance audit report",
      "Handover documentation",
    ],
    specialistNote: "Waiting for build phase completion before starting launch prep.",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ksh(value: number) {
  return `KSh ${value.toLocaleString()}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-KE", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Status Chips ─────────────────────────────────────────────────────────────

function WorkStatusChip({ status }: { status: WorkStatus }) {
  const styles: Record<WorkStatus, string> = {
    Pending:
      "bg-slate-100 text-slate-500 dark:bg-slate-700/50 dark:text-slate-400",
    "In Progress":
      "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    Submitted:
      "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
    Approved:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function EscrowChip({ status }: { status: EscrowStatus }) {
  const styles: Record<EscrowStatus, string> = {
    Held: "bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    "Ready to release":
      "bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-500/15 dark:text-purple-300 dark:border-purple-500/25",
    Released:
      "bg-slate-50 text-slate-500 dark:bg-slate-700/40 dark:text-slate-400",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase ${styles[status]}`}
    >
      {status === "Held" && <Clock className="h-3 w-3" />}
      {status === "Ready to release" && <ShieldCheck className="h-3 w-3" />}
      {status}
    </span>
  );
}

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepIndicator({
  step,
  isCompleted,
  isActive,
  isLast,
}: {
  step: number;
  isCompleted: boolean;
  isActive: boolean;
  isLast: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      {/* Circle */}
      <div
        className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all
          ${
            isCompleted
              ? "bg-purple-600 text-white shadow-md shadow-purple-500/25"
              : isActive
              ? "border-2 border-purple-500 bg-purple-50 text-purple-700 shadow-md shadow-purple-500/15 dark:bg-purple-500/15 dark:text-purple-300"
              : "border-2 border-slate-200 bg-white text-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-500"
          }`}
      >
        {isCompleted ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : (
          step
        )}
      </div>
      {/* Connecting line */}
      {!isLast && (
        <div
          className={`w-0.5 flex-1 min-h-[2rem] transition-colors ${
            isCompleted
              ? "bg-purple-400 dark:bg-purple-500"
              : "bg-slate-200 dark:bg-slate-700"
          }`}
        />
      )}
    </div>
  );
}

// ─── Milestone Card ───────────────────────────────────────────────────────────

function MilestoneCard({
  milestone,
  step,
  isLast,
  onRelease,
}: {
  milestone: Milestone;
  step: number;
  isLast: boolean;
  onRelease: (name: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const isCompleted = milestone.escrowStatus === "Released";
  const isActive = milestone.canRelease || milestone.workStatus === "In Progress" || milestone.workStatus === "Submitted";

  const deliverables = milestone.deliverables ?? [
    "Deliverable item 1",
    "Deliverable item 2",
    "Deliverable item 3",
  ];
  const specialistNote =
    milestone.specialistNote ?? "No specialist update yet.";

  return (
    <div className="flex gap-4 sm:gap-5">
      {/* Left stepper */}
      <StepIndicator
        step={step}
        isCompleted={isCompleted}
        isActive={isActive}
        isLast={isLast}
      />

      {/* Card */}
      <div className="flex-1 pb-8">
        <div
          className={`group rounded-2xl border transition-all duration-200
            ${
              milestone.canRelease
                ? "border-purple-200 bg-white shadow-md shadow-purple-500/5 dark:border-purple-500/25 dark:bg-[#1a1d24]"
                : "border-slate-200/80 bg-white shadow-sm dark:border-white/5 dark:bg-[#1E2329]"
            }
          `}
        >
          {/* Main row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 sm:p-5">
            {/* Title + Meta */}
            <div className="flex-1 min-w-0">
              <h3 className="text-[15px] font-semibold text-slate-900 dark:text-slate-100 truncate">
                {milestone.name}
              </h3>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                <span>Due {formatDate(milestone.dueDate)}</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {ksh(milestone.cost)}
                </span>
              </div>

              {/* Status chips */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <WorkStatusChip status={milestone.workStatus} />
                <EscrowChip status={milestone.escrowStatus} />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:ml-auto shrink-0">
              {milestone.canRelease ? (
                <button
                  onClick={() => onRelease(milestone.name)}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-500 hover:shadow-md hover:shadow-emerald-500/20 active:scale-[0.97]"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Approve & Release
                </button>
              ) : (
                <button
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 hover:border-slate-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
                >
                  <Eye className="h-4 w-4" />
                  View
                </button>
              )}

              {/* Expand chevron */}
              <button
                onClick={() => setExpanded(!expanded)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-white/5"
                aria-label="Toggle details"
              >
                <ChevronDown
                  className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                    expanded ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Expanded content */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              expanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="border-t border-slate-100 dark:border-white/5 px-4 sm:px-5 pb-5 pt-4">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Deliverables checklist */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                    Deliverables
                  </h4>
                  <ul className="space-y-2">
                    {deliverables.map((item, idx) => {
                      const done = isCompleted || (milestone.workStatus === "Submitted" && idx < deliverables.length);
                      return (
                        <li key={idx} className="flex items-start gap-2.5">
                          {done ? (
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                          ) : (
                            <Circle className="mt-0.5 h-4 w-4 shrink-0 text-slate-300 dark:text-slate-600" />
                          )}
                          <span
                            className={`text-sm ${
                              done
                                ? "text-slate-700 dark:text-slate-300"
                                : "text-slate-400 dark:text-slate-500"
                            }`}
                          >
                            {item}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Specialist note */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                    Specialist Update
                  </h4>
                  <div className="rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 p-3.5">
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {specialistNote}
                    </p>
                  </div>

                  {/* Action links */}
                  <div className="mt-4 flex flex-wrap gap-3">
                    {(milestone.workStatus === "Submitted" ||
                      milestone.workStatus === "Approved") && (
                      <button className="inline-flex items-center gap-1.5 rounded-lg bg-purple-50 px-3 py-2 text-xs font-semibold text-purple-700 transition-colors hover:bg-purple-100 dark:bg-purple-500/10 dark:text-purple-300 dark:hover:bg-purple-500/20">
                        <ExternalLink className="h-3.5 w-3.5" />
                        Open submission
                      </button>
                    )}
                    <button className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-slate-300">
                      <MessageSquare className="h-3.5 w-3.5" />
                      Message specialist
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MilestonePayments() {
  const [milestones, setMilestones] = useState<Milestone[]>(MILESTONES);

  const handleRelease = (name: string) => {
    setMilestones((prev) =>
      prev.map((m) =>
        m.name === name
          ? {
              ...m,
              canRelease: false,
              escrowStatus: "Released" as EscrowStatus,
              workStatus: "Approved" as WorkStatus,
            }
          : m
      )
    );
  };

  const totalCost = milestones.reduce((s, m) => s + m.cost, 0);
  const releasedTotal = milestones
    .filter((m) => m.escrowStatus === "Released")
    .reduce((s, m) => s + m.cost, 0);
  const heldTotal = milestones
    .filter((m) => m.escrowStatus === "Held")
    .reduce((s, m) => s + m.cost, 0);

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Milestone Payments
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Track payment status and release escrow for approved milestones.
        </p>

        {/* Summary bar */}
        <div className="mt-4 flex flex-wrap gap-3">
          <div className="rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 px-4 py-2.5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Total
            </div>
            <div className="mt-0.5 text-sm font-bold text-slate-800 dark:text-slate-200">
              {ksh(totalCost)}
            </div>
          </div>
          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10 px-4 py-2.5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-500">
              Released
            </div>
            <div className="mt-0.5 text-sm font-bold text-emerald-700 dark:text-emerald-400">
              {ksh(releasedTotal)}
            </div>
          </div>
          <div className="rounded-xl bg-amber-50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/10 px-4 py-2.5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-500">
              Held in escrow
            </div>
            <div className="mt-0.5 text-sm font-bold text-amber-700 dark:text-amber-400">
              {ksh(heldTotal)}
            </div>
          </div>
        </div>
      </div>

      {/* Stepper Timeline */}
      <div className="relative">
        {milestones.map((milestone, index) => (
          <MilestoneCard
            key={milestone.name}
            milestone={milestone}
            step={index + 1}
            isLast={index === milestones.length - 1}
            onRelease={handleRelease}
          />
        ))}
      </div>
    </div>
  );
}
