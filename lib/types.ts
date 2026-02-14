export type ProjectStatus =
  | "New"
  | "Scoping"
  | "In Progress"
  | "Review"
  | "Completed"
  | "Pending Assignment"
  | "Active"
  | "In Review";
export type MilestoneStatus = "Pending" | "In Progress" | "Submitted" | "Approved" | "Changes Requested";
export type RiskLevel = "Green" | "Yellow" | "Red";

export type Milestone = {
  id: number;
  title: string;
  dueDate: string;
  assignedRole?: string;
  status: MilestoneStatus;
  revisions: number;
};

export type Deliverable = {
  id: number;
  name: string;
  version: string;
  uploadedAt: string;
  url: string;
};

export type Message = {
  id: number;
  projectId: number;
  senderType: "client" | "project_desk" | "specialist" | "system";
  body: string;
  createdAt: string;
  attachments: string[];
  roleLabel?: string;
  forwardedToSpecialist?: boolean;
};

export type FreelancerInboxMessage = {
  id: number;
  projectId: number;
  senderLabel: "Project Desk";
  body: string;
  createdAt: string;
  attachments: string[];
};

export type Feedback = {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
};

export type Invoice = {
  id: number;
  projectId: number;
  invoiceNumber: string;
  amount: string;
  status: "Unpaid" | "Paid";
  dueDate: string;
};

export type AssignmentRequest = {
  id: number;
  projectId: number;
  serviceType: string;
  budgetRange: string;
  deadline: string;
  complexityScore: number;
  recommendedSpecialist: string;
  confidence: number;
  alternativeSpecialists: string[];
  recommendedTeam?: {
    role: string;
    candidates: string[];
  }[];
  recommendationReasons?: string[];
  workloadSummary?: string;
  summary: string;
  requiredSkills: string[];
  estimatedTimeline: string;
  riskFactors: string[];
};

export type Specialist = {
  id: number;
  name: string;
  role: string;
  skills: string[];
  verificationStatus?: "Pending" | "Verified" | "Rejected";
  assessmentScore?: number;
  rating: number;
  reliabilityScore: number;
  deliveryScore?: number;
  onTimeRate?: number;
  avgDeliveryTime: string;
  pastProjects: number;
  availability: "Available" | "Busy" | "Paused";
  workloadCapacity?: "Low" | "Medium" | "High";
  activeProjects?: number;
  riskLevel?: "Low" | "Medium" | "High";
  riskHistory: string[];
};

export type Project = {
  id: number;
  title: string;
  client: string;
  serviceType: string;
  category?: string;
  description: string;
  budgetRange: string;
  budgetEstimate?: string;
  quoteAmount?: string;
  amountPaid?: string;
  paymentMethod?: string;
  freelancerPayout?: string;
  margin?: string;
  estimatedTimeline?: string;
  deadline: string;
  status: ProjectStatus;
  assignedSpecialistRole: string;
  assignedSpecialistName?: string;
  assignedRoles?: string[];
  riskLevel: RiskLevel;
  lastUpdate: string;
  deliverablesChecklist?: string[];
  requiredAssets?: string[];
  risksAssumptions?: string[];
  milestones: Milestone[];
  deliverables: Deliverable[];
  messages: Message[];
  invoices: Invoice[];
  feedback: Feedback[];
  clientContext: string;
};
