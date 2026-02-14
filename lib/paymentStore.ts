// ─── Payment simulation store (client-side, persisted to localStorage) ───

export type WalletTransactionType = "TOP_UP" | "ESCROW_HOLD" | "ESCROW_RELEASE" | "REFUND_TO_WALLET";

export type MilestonePaymentStatus = "UNFUNDED" | "HELD_IN_ESCROW" | "READY_TO_RELEASE" | "RELEASED";

export type PaymentMethod = "MPESA" | "Card" | "Bank" | "PayPal";

export interface WalletTransaction {
  id: string;
  type: WalletTransactionType;
  amount: number;
  description: string;
  createdAt: string;
  projectId?: number;
  milestoneId?: number;
}

export interface MilestonePayment {
  milestoneId: number;
  milestoneTitle: string;
  projectId: number;
  cost: number;
  workStatus: "In Progress" | "Submitted" | "Approved";
  escrowStatus: MilestonePaymentStatus;
}

export interface PaymentProject {
  id: number;
  title: string;
  quoteTotal: number;
}

export interface EscrowSummary {
  held: number;
  released: number;
  remaining: number;
}

export interface PaymentState {
  walletBalance: number;
  transactions: WalletTransaction[];
  projects: PaymentProject[];
  milestonePayments: MilestonePayment[];
}

const STORAGE_KEY = "skilllink_payment_state";

function generateId(): string {
  return `txn_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function buildMilestonesForProject(
  projectId: number,
  titlePrefix: string,
  costPer: number,
  workStatuses: Array<"In Progress" | "Submitted" | "Approved">,
  escrowStatuses: MilestonePaymentStatus[]
): MilestonePayment[] {
  const titles = [
    `${titlePrefix} Discovery`,
    `${titlePrefix} Design`,
    `${titlePrefix} Build`,
    `${titlePrefix} Launch`,
  ];

  return titles.map((title, index) => ({
    milestoneId: index + 1,
    milestoneTitle: title,
    projectId,
    cost: costPer,
    workStatus: workStatuses[index] ?? "In Progress",
    escrowStatus: escrowStatuses[index] ?? "UNFUNDED",
  }));
}

function defaultState(): PaymentState {
  const projects: PaymentProject[] = [
    { id: 1, title: "Website Redesign", quoteTotal: 80000 },
    { id: 2, title: "Mobile App MVP", quoteTotal: 120000 },
    { id: 3, title: "Brand Refresh Kit", quoteTotal: 60000 },
    { id: 4, title: "E-commerce Launch", quoteTotal: 100000 },
    { id: 5, title: "Data Dashboard", quoteTotal: 90000 },
    { id: 6, title: "AI Support Bot", quoteTotal: 70000 },
    { id: 7, title: "Marketing Site", quoteTotal: 50000 },
    { id: 8, title: "Customer Portal", quoteTotal: 110000 },
  ];

  const milestonePayments = [
    ...buildMilestonesForProject(
      1,
      "Redesign",
      20000,
      ["Approved", "Submitted", "In Progress", "In Progress"],
      ["RELEASED", "READY_TO_RELEASE", "HELD_IN_ESCROW", "UNFUNDED"]
    ),
    ...buildMilestonesForProject(
      2,
      "App",
      30000,
      ["Submitted", "Submitted", "In Progress", "In Progress"],
      ["READY_TO_RELEASE", "READY_TO_RELEASE", "HELD_IN_ESCROW", "UNFUNDED"]
    ),
    ...buildMilestonesForProject(
      3,
      "Brand",
      15000,
      ["Approved", "Approved", "Submitted", "In Progress"],
      ["RELEASED", "RELEASED", "READY_TO_RELEASE", "HELD_IN_ESCROW"]
    ),
    ...buildMilestonesForProject(
      4,
      "Commerce",
      25000,
      ["In Progress", "In Progress", "In Progress", "In Progress"],
      ["HELD_IN_ESCROW", "HELD_IN_ESCROW", "UNFUNDED", "UNFUNDED"]
    ),
    ...buildMilestonesForProject(
      5,
      "Analytics",
      22500,
      ["Submitted", "In Progress", "In Progress", "In Progress"],
      ["READY_TO_RELEASE", "HELD_IN_ESCROW", "HELD_IN_ESCROW", "UNFUNDED"]
    ),
    ...buildMilestonesForProject(
      6,
      "AI Bot",
      17500,
      ["Approved", "Submitted", "Submitted", "In Progress"],
      ["RELEASED", "READY_TO_RELEASE", "READY_TO_RELEASE", "HELD_IN_ESCROW"]
    ),
    ...buildMilestonesForProject(
      7,
      "Marketing",
      12500,
      ["In Progress", "In Progress", "In Progress", "Submitted"],
      ["UNFUNDED", "UNFUNDED", "HELD_IN_ESCROW", "READY_TO_RELEASE"]
    ),
    ...buildMilestonesForProject(
      8,
      "Portal",
      27500,
      ["Submitted", "In Progress", "In Progress", "In Progress"],
      ["READY_TO_RELEASE", "HELD_IN_ESCROW", "UNFUNDED", "UNFUNDED"]
    ),
  ];

  const now = Date.now();
  const daysAgo = (days: number) => new Date(now - days * 86400000).toISOString();

  const transactions: WalletTransaction[] = [
    {
      id: "txn_init_1",
      type: "TOP_UP",
      amount: 300000,
      description: "Initial wallet top-up via Bank",
      createdAt: daysAgo(10),
    },
    {
      id: "txn_init_2",
      type: "TOP_UP",
      amount: 200000,
      description: "Top-up via MPESA",
      createdAt: daysAgo(6),
    },
  ];

  const addHold = (projectId: number, milestoneId: number, days: number) => {
    const mp = milestonePayments.find(
      (m) => m.projectId === projectId && m.milestoneId === milestoneId
    );
    if (!mp) return;
    transactions.push({
      id: generateId(),
      type: "ESCROW_HOLD",
      amount: mp.cost,
      description: `Funded ${mp.milestoneTitle} (Escrow Hold) — Project #${projectId}`,
      createdAt: daysAgo(days),
      projectId,
      milestoneId,
    });
  };

  const addRelease = (projectId: number, milestoneId: number, days: number) => {
    const mp = milestonePayments.find(
      (m) => m.projectId === projectId && m.milestoneId === milestoneId
    );
    if (!mp) return;
    transactions.push({
      id: generateId(),
      type: "ESCROW_RELEASE",
      amount: mp.cost,
      description: `${mp.milestoneTitle} approved → Released to Specialist — KSh ${mp.cost.toLocaleString()}`,
      createdAt: daysAgo(days),
      projectId,
      milestoneId,
    });
  };

  addHold(1, 2, 5);
  addHold(2, 1, 5);
  addHold(3, 3, 4);
  addHold(6, 2, 4);
  addRelease(1, 1, 3);
  addRelease(3, 2, 2);
  addRelease(6, 1, 1);

  transactions.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  return {
    walletBalance: 500000,
    transactions,
    projects,
    milestonePayments,
  };
}

// ─── Read / Write ─────────────────────────────────────────────────────────────

export function getPaymentState(): PaymentState {
  if (typeof window === "undefined") return defaultState();
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const state = defaultState();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return state;
  }
  const parsed = JSON.parse(raw) as PaymentState;
  const base = defaultState();
  const needsReset =
    !parsed.projects ||
    parsed.projects.length < base.projects.length ||
    !parsed.milestonePayments ||
    parsed.milestonePayments.length < base.milestonePayments.length;

  if (needsReset) {
    saveState(base);
    return base;
  }

  return parsed;
}

function saveState(state: PaymentState) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}

// ─── Actions ──────────────────────────────────────────────────────────────────

export function topUpWallet(amount: number, method: PaymentMethod): PaymentState {
  const state = getPaymentState();
  state.walletBalance += amount;
  state.transactions.unshift({
    id: generateId(),
    type: "TOP_UP",
    amount,
    description: `Wallet top-up via ${method}`,
    createdAt: new Date().toISOString(),
  });
  saveState(state);
  return state;
}

export function fundProjectEscrow(
  projectId: number,
  milestoneIds: number[],
  method: PaymentMethod = "MPESA",
  useWallet: boolean = true
): PaymentState {
  const state = getPaymentState();

  for (const mid of milestoneIds) {
    const mp = state.milestonePayments.find(
      (m) => m.milestoneId === mid && m.projectId === projectId
    );
    if (!mp || mp.escrowStatus !== "UNFUNDED") continue;

    if (useWallet) {
      if (state.walletBalance < mp.cost) continue;
      state.walletBalance -= mp.cost;
    }
    mp.escrowStatus = "HELD_IN_ESCROW";

    state.transactions.unshift({
      id: generateId(),
      type: "ESCROW_HOLD",
      amount: mp.cost,
      description: `Funded ${mp.milestoneTitle} (Escrow Hold) — Project #${projectId} via ${method}`,
      createdAt: new Date().toISOString(),
      projectId,
      milestoneId: mid,
    });
  }

  saveState(state);
  return state;
}

export function approveAndRelease(
  projectId: number,
  milestoneId: number
): PaymentState {
  const state = getPaymentState();
  const mp = state.milestonePayments.find(
    (m) => m.milestoneId === milestoneId && m.projectId === projectId
  );
  if (!mp || mp.escrowStatus !== "READY_TO_RELEASE") return state;

  mp.escrowStatus = "RELEASED";
  mp.workStatus = "Approved";

  state.transactions.unshift({
    id: generateId(),
    type: "ESCROW_RELEASE",
    amount: mp.cost,
    description: `${mp.milestoneTitle} approved → Released to Specialist — KSh ${mp.cost.toLocaleString()}`,
    createdAt: new Date().toISOString(),
    projectId,
    milestoneId,
  });

  state.transactions.unshift({
    id: generateId(),
    type: "ESCROW_RELEASE",
    amount: 0,
    description: `Escrow balance updated after releasing ${mp.milestoneTitle}`,
    createdAt: new Date().toISOString(),
    projectId,
    milestoneId,
  });

  saveState(state);
  return state;
}

export function fundAllMilestones(projectId: number): PaymentState {
  const state = getPaymentState();
  const unfunded = state.milestonePayments
    .filter((m) => m.projectId === projectId && m.escrowStatus === "UNFUNDED")
    .map((m) => m.milestoneId);
  if (unfunded.length === 0) return state;
  return fundProjectEscrow(projectId, unfunded);
}

export function getEscrowSummary(projectId: number): EscrowSummary {
  const state = getPaymentState();
  const mps = state.milestonePayments.filter((m) => m.projectId === projectId);

  const held = mps
    .filter((m) => m.escrowStatus === "HELD_IN_ESCROW" || m.escrowStatus === "READY_TO_RELEASE")
    .reduce((s, m) => s + m.cost, 0);
  const released = mps
    .filter((m) => m.escrowStatus === "RELEASED")
    .reduce((s, m) => s + m.cost, 0);

  return { held, released, remaining: held };
}

export function resetPaymentState(): PaymentState {
  const state = defaultState();
  saveState(state);
  return state;
}
