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
export type QAStatus = "Pending" | "Verified" | "Issues";

export type Milestone = {
  id: number;
  title: string;
  dueDate: string;
  assignedRole?: string;
  status: MilestoneStatus;
  revisions: number;
  qaStatus?: QAStatus;
  qaIssues?: string[];
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
  recommendedTeam: {
    role: string;
    candidates: string[];
  }[];
  recommendationReasons: string[];
  workloadSummary: string;
  summary: string;
  requiredSkills: string[];
  estimatedTimeline: string;
  riskFactors: string[];
};

export type AccessRequest = {
  id: number;
  orgName: string;
  orgType: string;
  location: string;
  website: string;
  about: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  consent: boolean;
  status: "New" | "Accepted" | "Rejected";
  createdAt: string;
};

export type Specialist = {
  id: number;
  name: string;
  role: string;
  skills: string[];
  verificationStatus: "Pending" | "Verified" | "Rejected";
  assessmentScore: number;
  rating: number;
  reliabilityScore: number;
  deliveryScore: number;
  onTimeRate: number;
  avgDeliveryTime: string;
  pastProjects: number;
  availability: "Available" | "Busy" | "Paused";
  workloadCapacity: "Low" | "Medium" | "High";
  activeProjects: number;
  riskLevel: "Low" | "Medium" | "High";
  riskHistory: string[];
};

export type Project = {
  id: number;
  title: string;
  client: string;
  serviceType: string;
  category: string;
  description: string;
  budgetRange: string;
  budgetEstimate: string;
  quoteAmount: string;
  amountPaid: string;
  paymentMethod: string;
  freelancerPayout: string;
  margin: string;
  estimatedTimeline: string;
  deadline: string;
  status: ProjectStatus;
  assignedSpecialistRole: string;
  assignedSpecialistName?: string;
  assignedRoles: string[];
  riskLevel: RiskLevel;
  lastUpdate: string;
  deliverablesChecklist: string[];
  requiredAssets: string[];
  risksAssumptions: string[];
  milestones: Milestone[];
  deliverables: Deliverable[];
  messages: Message[];
  invoices: Invoice[];
  feedback: Feedback[];
  clientContext: string;
};

export type FreelancerInboxMessage = {
  id: number;
  projectId: number;
  senderLabel: "Project Desk";
  body: string;
  createdAt: string;
  attachments: string[];
};

const now = new Date();

let mockProjects: Project[] = [
  {
    id: 1,
    title: "Website Redesign",
    client: "ABC Technologies",
    serviceType: "Web Dev",
    category: "Website",
    description: "Modernize the marketing site with conversion-focused layouts.",
    budgetRange: "KES 150,000 - 250,000",
    budgetEstimate: "KES 200,000",
    quoteAmount: "KES 200,000",
    amountPaid: "KES 75,000",
    paymentMethod: "M-Pesa",
    freelancerPayout: "KES 50,000",
    margin: "KES 25,000",
    estimatedTimeline: "4-6 weeks",
    deadline: "2026-03-15",
    status: "In Progress",
    assignedSpecialistRole: "Web Developer",
    assignedSpecialistName: "Grace",
    assignedRoles: ["Developer", "Designer", "QA Reviewer"],
    riskLevel: "Yellow",
    lastUpdate: "2026-03-04 10:10",
    deliverablesChecklist: ["Homepage redesign", "UI kit", "Responsive templates"],
    requiredAssets: ["Brand guidelines", "Latest product copy"],
    risksAssumptions: ["Client approvals within 48 hours", "Content is finalized"],
    milestones: [
      {
        id: 11,
        title: "Discovery & IA",
        dueDate: "2026-03-05",
        status: "Approved",
        revisions: 0,
        qaStatus: "Verified",
        qaIssues: []
      },
      {
        id: 12,
        title: "Homepage Design",
        dueDate: "2026-03-10",
        status: "Submitted",
        revisions: 1,
        qaStatus: "Pending",
        qaIssues: []
      },
      {
        id: 13,
        title: "Build & QA",
        dueDate: "2026-03-15",
        status: "Pending",
        revisions: 0,
        qaStatus: "Pending",
        qaIssues: []
      }
    ],
    deliverables: [
      { id: 101, name: "Homepage wireframes.pdf", version: "v2", uploadedAt: "2026-03-02", url: "#" },
      { id: 102, name: "UI kit.fig", version: "v1", uploadedAt: "2026-03-03", url: "#" }
    ],
    messages: [
      {
        id: 201,
        projectId: 1,
        senderType: "project_desk",
        body: "Your homepage design is ready for review. Please approve or request changes.",
        createdAt: "2026-03-04 10:10",
        attachments: ["Homepage Design.pdf"],
        forwardedToSpecialist: true
      },
      {
        id: 202,
        projectId: 1,
        senderType: "client",
        body: "Thanks! Reviewing now. Can we emphasize the CTA above the fold?",
        createdAt: "2026-03-04 11:00",
        attachments: [],
        forwardedToSpecialist: false
      }
    ],
    invoices: [
      {
        id: 301,
        projectId: 1,
        invoiceNumber: "INV-1001",
        amount: "KES 75,000",
        status: "Unpaid",
        dueDate: "2026-03-12"
      }
    ],
    feedback: [],
    clientContext: "Client type: SME, Sector: Technology"
  },
  {
    id: 2,
    title: "Brand Identity Refresh",
    client: "Brightway NGO",
    serviceType: "Branding",
    category: "Branding",
    description: "Refresh brand visuals for new donor campaign.",
    budgetRange: "KES 80,000 - 120,000",
    budgetEstimate: "KES 100,000",
    quoteAmount: "KES 100,000",
    amountPaid: "KES 0",
    paymentMethod: "Bank Transfer",
    freelancerPayout: "KES 0",
    margin: "KES 0",
    estimatedTimeline: "3-4 weeks",
    deadline: "2026-03-20",
    status: "Pending Assignment",
    assignedSpecialistRole: "Unassigned",
    riskLevel: "Green",
    lastUpdate: "2026-03-03 09:00",
    assignedRoles: ["Designer", "Project Manager"],
    deliverablesChecklist: ["Logo refresh", "Brand guide", "Social media kit"],
    requiredAssets: ["Existing logo files", "Campaign goals"],
    risksAssumptions: ["Stakeholder approvals on time"],
    milestones: [
      {
        id: 21,
        title: "Discovery Workshop",
        dueDate: "2026-03-08",
        status: "Pending",
        revisions: 0,
        qaStatus: "Pending",
        qaIssues: []
      },
      {
        id: 22,
        title: "Logo Concepts",
        dueDate: "2026-03-14",
        status: "Pending",
        revisions: 0,
        qaStatus: "Pending",
        qaIssues: []
      }
    ],
    deliverables: [],
    messages: [
      {
        id: 203,
        projectId: 2,
        senderType: "system",
        body: "Request received. SkillLink Nexus will assign a verified specialist within 24 hours.",
        createdAt: "2026-03-03 09:00",
        attachments: []
      }
    ],
    invoices: [],
    feedback: [],
    clientContext: "Client type: NGO, Sector: Education"
  }
];

let assignmentRequests: AssignmentRequest[] = [
  {
    id: 1,
    projectId: 2,
    serviceType: "Branding",
    budgetRange: "KES 80,000 - 120,000",
    deadline: "2026-03-20",
    complexityScore: 62,
    recommendedSpecialist: "Sarah Omondi",
    confidence: 86,
    alternativeSpecialists: ["Grace Akinyi", "John Mwangi", "David Kimani"],
    recommendedTeam: [
      { role: "Designer", candidates: ["Sarah Omondi", "Grace Akinyi"] },
      { role: "Project Manager", candidates: ["Ops Desk"] }
    ],
    recommendationReasons: ["Skills match", "High delivery score", "Available capacity"],
    workloadSummary: "Medium workload (2 active projects)",
    summary: "Client needs a brand refresh for an NGO launch campaign with donor-facing assets.",
    requiredSkills: ["Brand Strategy", "Logo Design", "Social Media Kit"],
    estimatedTimeline: "14-18 days",
    riskFactors: ["Tight stakeholder feedback loop", "Short timeline"]
  }
];

let accessRequests: AccessRequest[] = [];

let specialists: Specialist[] = [
  {
    id: 1,
    name: "Sarah Omondi",
    role: "Brand Designer",
    skills: ["Brand Strategy", "Logo Design", "Figma"],
    verificationStatus: "Verified",
    assessmentScore: 92,
    rating: 4.8,
    reliabilityScore: 92,
    deliveryScore: 91,
    onTimeRate: 94,
    avgDeliveryTime: "12 days",
    pastProjects: 18,
    availability: "Available",
    workloadCapacity: "High",
    activeProjects: 2,
    riskLevel: "Low",
    riskHistory: ["1 delayed milestone (Q4)"]
  },
  {
    id: 2,
    name: "Grace Akinyi",
    role: "Web Developer",
    skills: ["React", "Next.js", "CMS"],
    verificationStatus: "Verified",
    assessmentScore: 95,
    rating: 4.9,
    reliabilityScore: 95,
    deliveryScore: 93,
    onTimeRate: 96,
    avgDeliveryTime: "10 days",
    pastProjects: 24,
    availability: "Busy",
    workloadCapacity: "Low",
    activeProjects: 4,
    riskLevel: "Low",
    riskHistory: []
  },
  {
    id: 3,
    name: "John Mwangi",
    role: "Full Stack Developer",
    skills: ["Node.js", "APIs", "Postgres"],
    verificationStatus: "Verified",
    assessmentScore: 88,
    rating: 4.7,
    reliabilityScore: 88,
    deliveryScore: 85,
    onTimeRate: 87,
    avgDeliveryTime: "14 days",
    pastProjects: 20,
    availability: "Available",
    workloadCapacity: "Medium",
    activeProjects: 3,
    riskLevel: "Medium",
    riskHistory: ["2 revisions overrun"]
  },
  {
    id: 4,
    name: "David Kimani",
    role: "Data Specialist",
    skills: ["Analytics", "Dashboards", "Python"],
    verificationStatus: "Pending",
    assessmentScore: 79,
    rating: 4.6,
    reliabilityScore: 84,
    deliveryScore: 80,
    onTimeRate: 83,
    avgDeliveryTime: "16 days",
    pastProjects: 12,
    availability: "Available",
    workloadCapacity: "Medium",
    activeProjects: 1,
    riskLevel: "Medium",
    riskHistory: ["1 replacement (Q1)"]
  }
];

let freelancerInbox: FreelancerInboxMessage[] = [
  {
    id: 401,
    projectId: 1,
    senderLabel: "Project Desk",
    body: "Please incorporate CTA emphasis above the fold per client feedback.",
    createdAt: "2026-03-04 11:05",
    attachments: []
  }
];

let projectIdCounter = 3;
let messageIdCounter = 300;
let invoiceIdCounter = 400;
let feedbackIdCounter = 500;
let assignmentIdCounter = 20;
let accessRequestIdCounter = 1;

const STORAGE_KEY = "skilllink_mock_db";
let initialized = false;

type PersistedState = {
  projects: Project[];
  assignmentRequests: AssignmentRequest[];
  accessRequests: AccessRequest[];
  specialists: Specialist[];
  freelancerInbox: FreelancerInboxMessage[];
  counters: {
    projectIdCounter: number;
    messageIdCounter: number;
    invoiceIdCounter: number;
    feedbackIdCounter: number;
    assignmentIdCounter: number;
    accessRequestIdCounter: number;
  };
};

const toIsoDate = (date: Date) => date.toISOString().split("T")[0];
const isValidDate = (date: Date) => !Number.isNaN(date.getTime());

const CATEGORY_ROLES: Record<string, string[]> = {
  Website: ["Developer", "Designer", "QA Reviewer", "Project Manager"],
  Chatbot: ["Developer", "QA Reviewer", "Project Manager"],
  Branding: ["Designer", "Project Manager"],
  Marketing: ["Marketer", "Designer", "Project Manager"],
  Software: ["Developer", "QA Reviewer", "Project Manager"],
  Default: ["Developer", "Designer", "Project Manager"]
};

const roleLabelForSpecialist = (role: string) => {
  const lowered = role.toLowerCase();
  if (lowered.includes("design")) {
    return "Designer";
  }
  if (lowered.includes("marketing")) {
    return "Marketer";
  }
  if (lowered.includes("qa")) {
    return "QA Reviewer";
  }
  if (lowered.includes("data")) {
    return "Developer";
  }
  return "Developer";
};

const buildRecommendedTeam = (category: string) => {
  const roles = CATEGORY_ROLES[category] ?? CATEGORY_ROLES.Default;
  const ranked = [...specialists].sort((a, b) => b.reliabilityScore - a.reliabilityScore);

  return roles.map((role) => {
    const candidates = ranked
      .filter((specialist) => roleLabelForSpecialist(specialist.role) === role)
      .slice(0, 3)
      .map((specialist) => specialist.name);

    return {
      role,
      candidates: candidates.length > 0 ? candidates : ["Ops Desk"]
    };
  });
};

const buildAssignmentRequest = (project: Project) => {
  const category = project.category || project.serviceType;
  const recommendedTeam = buildRecommendedTeam(category);
  const requiredSkills = [category, ...recommendedTeam.map((team) => team.role)];
  const topCandidate = recommendedTeam[0]?.candidates[0];
  const topSpecialist = specialists.find((specialist) => specialist.name === topCandidate);
  const recommendationReasons = [
    "Skills match",
    `Delivery score ${topSpecialist?.deliveryScore ?? 0}%`,
    `On-time rate ${topSpecialist?.onTimeRate ?? 0}%`,
    `Availability ${topSpecialist?.availability ?? "Unknown"}`
  ];
  const workloadSummary = topSpecialist
    ? `${topSpecialist.workloadCapacity} workload (${topSpecialist.activeProjects} active projects)`
    : "Workload pending";
  return {
    id: assignmentIdCounter++,
    projectId: project.id,
    serviceType: project.serviceType,
    budgetRange: project.budgetRange,
    deadline: project.deadline,
    complexityScore: 58,
    recommendedSpecialist: topCandidate ?? "TBD",
    confidence: 82,
    alternativeSpecialists: specialists.slice(1, 4).map((specialist) => specialist.name),
    recommendedTeam,
    recommendationReasons,
    workloadSummary,
    summary: `AI recommends a ${category} delivery squad with ${requiredSkills.join(", ")} coverage.`,
    requiredSkills,
    estimatedTimeline: project.estimatedTimeline,
    riskFactors: ["New request", "Timeline pending"]
  };
};

const pickBestSpecialist = (category: string) => {
  const desiredRoles = CATEGORY_ROLES[category] ?? CATEGORY_ROLES.Default;
  const ranked = [...specialists]
    .filter((specialist) => specialist.availability === "Available")
    .sort((a, b) => (b.deliveryScore + b.reliabilityScore) - (a.deliveryScore + a.reliabilityScore));

  for (const role of desiredRoles) {
    const match = ranked.find((specialist) => roleLabelForSpecialist(specialist.role) === role);
    if (match) {
      return match;
    }
  }

  return ranked[0] ?? specialists[0] ?? null;
};

const generateMilestones = (deadline: string) => {
  const candidate = deadline ? new Date(deadline) : new Date();
  const base = isValidDate(candidate) ? candidate : new Date();
  const offsets = [7, 14, 21, 28];
  const titles = ["Requirements", "First Draft", "Review", "Final Delivery"];

  return titles.map((title, index) => {
    const due = new Date(base);
    due.setDate(due.getDate() + offsets[index]);
    return {
      id: Number(`${base.getMonth() + 1}${base.getDate()}${index + 1}`),
      title,
      dueDate: toIsoDate(due),
      status: "Pending" as const,
      revisions: 0,
      qaStatus: "Pending" as const,
      qaIssues: [] as string[]
    };
  });
};

const qaIssuesForCategory = (category: string) => {
  switch (category) {
    case "Website":
      return ["Missing mobile navigation", "Homepage CTA contrast below threshold"];
    case "Design":
    case "Branding":
      return ["Typography scale not consistent", "Asset export sizes missing"];
    case "Chatbot":
      return ["Fallback response missing", "Two dead-end paths found"];
    case "Marketing":
      return ["Tone inconsistent with brief", "Compliance disclaimer missing"];
    case "Software":
      return ["Edge-case validation missing", "No QA checklist attached"];
    default:
      return ["Checklist pending review"];
  }
};

const getProjectRoles = (category: string) => {
  const roles = CATEGORY_ROLES[category] ?? CATEGORY_ROLES.Default;
  return roles.filter((role) => role !== "Project Manager");
};

const createInitialMessages = (projectId: number, category: string) => {
  const messages: Message[] = [
    {
      id: messageIdCounter++,
      projectId,
      senderType: "system",
      body: "Request submitted. SkillLink Nexus will assign a verified specialist within 24 hours.",
      createdAt: `${toIsoDate(now)} 09:00`,
      attachments: []
    },
    {
      id: messageIdCounter++,
      projectId,
      senderType: "project_desk",
      body: "Hi, I am your Project Manager at SkillLink Nexus. I will coordinate the team and keep you updated.",
      createdAt: `${toIsoDate(now)} 09:02`,
      attachments: []
    }
  ];

  getProjectRoles(category).forEach((role, index) => {
    messages.push({
      id: messageIdCounter++,
      projectId,
      senderType: "specialist",
      roleLabel: role,
      body: `Hi, I am your ${role}. Share any notes or preferences and I will get started.`,
      createdAt: `${toIsoDate(now)} 09:0${3 + index}`,
      attachments: []
    });
  });

  return messages;
};

const loadFromStorage = () => {
  if (typeof window === "undefined") {
    return false;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return false;
  }

  try {
    const parsed = JSON.parse(raw) as PersistedState;
    if (!parsed.projects || !parsed.freelancerInbox || !parsed.counters) {
      return false;
    }

    mockProjects = parsed.projects;
    assignmentRequests = parsed.assignmentRequests ?? assignmentRequests;
    accessRequests = parsed.accessRequests ?? accessRequests;
    specialists = parsed.specialists ?? specialists;
    freelancerInbox = parsed.freelancerInbox;
    projectIdCounter = parsed.counters.projectIdCounter;
    messageIdCounter = parsed.counters.messageIdCounter;
    invoiceIdCounter = parsed.counters.invoiceIdCounter;
    feedbackIdCounter = parsed.counters.feedbackIdCounter;
    assignmentIdCounter = parsed.counters.assignmentIdCounter ?? assignmentIdCounter;
    accessRequestIdCounter = parsed.counters.accessRequestIdCounter ?? accessRequestIdCounter;
    return true;
  } catch (error) {
    return false;
  }
};

const saveToStorage = () => {
  if (typeof window === "undefined") {
    return;
  }

  const payload: PersistedState = {
    projects: mockProjects,
    assignmentRequests,
    accessRequests,
    specialists,
    freelancerInbox,
    counters: {
      projectIdCounter,
      messageIdCounter,
      invoiceIdCounter,
      feedbackIdCounter,
      assignmentIdCounter,
      accessRequestIdCounter
    }
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};

export const initMockDb = () => {
  if (initialized) {
    return false;
  }

  initialized = true;
  const loaded = loadFromStorage();
  if (!loaded) {
    saveToStorage();
  }
  return loaded;
};

const ensureInitialized = () => {
  if (!initialized) {
    initMockDb();
  }
};

export const getProjects = () => {
  ensureInitialized();
  return mockProjects;
};

export const getAccessRequests = () => {
  ensureInitialized();
  return accessRequests;
};

export const addAccessRequest = (payload: Omit<AccessRequest, "id" | "createdAt" | "status">) => {
  ensureInitialized();
  const newRequest: AccessRequest = {
    ...payload,
    id: accessRequestIdCounter++,
    status: "New",
    createdAt: new Date().toISOString()
  };

  accessRequests.unshift(newRequest);
  saveToStorage();
  return newRequest;
};

export const updateAccessRequestStatus = (id: number, status: AccessRequest["status"]) => {
  ensureInitialized();
  const request = accessRequests.find((item) => item.id === id);
  if (!request) {
    return;
  }
  request.status = status;
  saveToStorage();
  return request;
};

export const getProjectById = (id: number) => {
  ensureInitialized();
  return mockProjects.find((project) => project.id === id);
};

export const addProject = (
  project: Omit<Project, "id" | "messages" | "milestones" | "deliverables" | "invoices" | "feedback" | "riskLevel" | "lastUpdate"> &
    Partial<Pick<Project, "category" | "budgetEstimate" | "estimatedTimeline" | "deliverablesChecklist" | "requiredAssets" | "risksAssumptions">> & {
      milestones?: Milestone[];
    }
) => {
  ensureInitialized();
  const newProjectId = projectIdCounter++;
  const category = project.category ?? project.serviceType;
  const deliverablesChecklist = project.deliverablesChecklist ?? [];
  const requiredAssets = project.requiredAssets ?? [];
  const risksAssumptions = project.risksAssumptions ?? [];
  const estimatedTimeline = project.estimatedTimeline ?? "TBD";
  const budgetEstimate = project.budgetEstimate ?? project.budgetRange;
  const milestones = project.milestones ?? generateMilestones(project.deadline);
  const assignedRoles = project.assignedRoles ?? getProjectRoles(category);
  const quoteAmount = project.quoteAmount ?? budgetEstimate ?? "TBD";
  const amountPaid = project.amountPaid ?? "KES 0";
  const paymentMethod = project.paymentMethod ?? "Unspecified";
  const freelancerPayout = project.freelancerPayout ?? "KES 0";
  const margin = project.margin ?? "KES 0";
  const newProject: Project = {
    ...project,
    category,
    deliverablesChecklist,
    requiredAssets,
    risksAssumptions,
    estimatedTimeline,
    budgetEstimate,
    quoteAmount,
    amountPaid,
    paymentMethod,
    freelancerPayout,
    margin,
    id: newProjectId,
    riskLevel: "Green",
    lastUpdate: `${toIsoDate(now)} 09:00`,
    assignedRoles,
    milestones,
    deliverables: [],
    invoices: [],
    feedback: [],
    messages: createInitialMessages(newProjectId, category)
  };

  mockProjects.unshift(newProject);
  assignmentRequests.unshift(buildAssignmentRequest(newProject));

  saveToStorage();
  return newProject;
};

export const addClientMessage = (projectId: number, body: string, attachments: string[]) => {
  ensureInitialized();
  const project = getProjectById(projectId);
  if (!project) {
    return;
  }

  project.messages.push({
    id: messageIdCounter++,
    projectId,
    senderType: "client",
    body,
    createdAt: `${toIsoDate(now)} 09:15`,
    attachments,
    forwardedToSpecialist: false
  });
  project.lastUpdate = `${toIsoDate(now)} 09:15`;
  saveToStorage();
};

export const addSpecialistMessage = (projectId: number, body: string) => {
  ensureInitialized();
  const project = getProjectById(projectId);
  if (!project) {
    return;
  }

  project.messages.push({
    id: messageIdCounter++,
    projectId,
    senderType: "specialist",
    body,
    createdAt: `${toIsoDate(now)} 09:25`,
    attachments: []
  });
  project.lastUpdate = `${toIsoDate(now)} 09:25`;
  saveToStorage();
};

export const addSystemMessage = (projectId: number, body: string) => {
  ensureInitialized();
  const project = getProjectById(projectId);
  if (!project) {
    return;
  }

  project.messages.push({
    id: messageIdCounter++,
    projectId,
    senderType: "system",
    body,
    createdAt: `${toIsoDate(now)} 09:20`,
    attachments: []
  });
  project.lastUpdate = `${toIsoDate(now)} 09:20`;
  saveToStorage();
};

export const updateMilestoneStatus = (projectId: number, milestoneId: number, status: MilestoneStatus) => {
  ensureInitialized();
  const project = getProjectById(projectId);
  if (!project) {
    return;
  }

  const milestone = project.milestones.find((item) => item.id === milestoneId);
  if (milestone) {
    milestone.status = status;
    milestone.revisions = status === "Changes Requested" ? milestone.revisions + 1 : milestone.revisions;
    if (status === "Submitted") {
      milestone.qaStatus = "Pending";
      milestone.qaIssues = [];
    }
  }

  project.lastUpdate = `${toIsoDate(now)} 09:30`;
  saveToStorage();
  return project;
};

export const addProjectMilestone = (projectId: number, title: string, dueDate: string, assignedRole: string) => {
  ensureInitialized();
  const project = getProjectById(projectId);
  if (!project) {
    return;
  }

  project.milestones.push({
    id: messageIdCounter++,
    title,
    dueDate,
    assignedRole,
    status: "Pending",
    revisions: 0,
    qaStatus: "Pending",
    qaIssues: []
  });
  project.lastUpdate = `${toIsoDate(now)} 10:05`;
  saveToStorage();
  return project;
};

export const updateProjectBrief = (projectId: number, updates: Partial<Project>) => {
  ensureInitialized();
  const project = getProjectById(projectId);
  if (!project) {
    return;
  }

  Object.assign(project, updates);
  project.lastUpdate = `${toIsoDate(now)} 10:12`;
  saveToStorage();
  return project;
};

export const updateProjectPricing = (projectId: number, updates: Partial<Project>) => {
  ensureInitialized();
  const project = getProjectById(projectId);
  if (!project) {
    return;
  }

  Object.assign(project, updates);
  project.lastUpdate = `${toIsoDate(now)} 10:15`;
  saveToStorage();
  return project;
};

export const requestMissingAssets = (projectId: number, assets: string[]) => {
  ensureInitialized();
  const project = getProjectById(projectId);
  if (!project) {
    return;
  }

  project.requiredAssets = Array.from(new Set([...project.requiredAssets, ...assets]));
  addSystemMessage(projectId, `Requested assets: ${assets.join(", ")}`);
  saveToStorage();
  return project;
};

export const updateProjectStatus = (projectId: number, status: ProjectStatus) => {
  ensureInitialized();
  const project = getProjectById(projectId);
  if (!project) {
    return;
  }
  project.status = status;
  project.lastUpdate = `${toIsoDate(now)} 10:18`;
  saveToStorage();
  return project;
};

export const extendProjectDeadline = (projectId: number, deadline: string) => {
  ensureInitialized();
  const project = getProjectById(projectId);
  if (!project) {
    return;
  }
  project.deadline = deadline;
  addSystemMessage(projectId, `Deadline extended to ${deadline}.`);
  saveToStorage();
  return project;
};

export const sendWarningToFreelancer = (projectId: number, reason: string) => {
  ensureInitialized();
  const project = getProjectById(projectId);
  if (!project) {
    return;
  }
  addSystemMessage(projectId, `Warning issued: ${reason}`);
  saveToStorage();
  return project;
};

export const markSpecialistUnreliable = (projectId: number) => {
  ensureInitialized();
  const project = getProjectById(projectId);
  if (!project || !project.assignedSpecialistName) {
    return;
  }
  const specialist = specialists.find((item) => item.name === project.assignedSpecialistName);
  if (!specialist) {
    return;
  }
  specialist.riskLevel = "High";
  specialist.reliabilityScore = Math.max(0, specialist.reliabilityScore - 10);
  specialist.riskHistory.push("Marked unreliable by PM");
  saveToStorage();
  return specialist;
};

export const getAnalyticsSummary = () => {
  ensureInitialized();
  const totalClients = new Set(mockProjects.map((project) => project.client)).size;
  const activeProjects = mockProjects.filter((project) => project.status === "Active" || project.status === "In Progress").length;
  const completedProjects = mockProjects.filter((project) => project.status === "Completed").length;
  const completionRate = mockProjects.length === 0 ? 0 : Math.round((completedProjects / mockProjects.length) * 100);
  const averageProjectValue = mockProjects.length === 0
    ? 0
    : Math.round(
        mockProjects.reduce((sum, project) => {
          const rawValue = project.budgetEstimate ?? project.budgetRange ?? "0";
          const numeric = Number(rawValue.replace(/[^0-9]/g, "") || 0);
          return sum + numeric;
        }, 0) / mockProjects.length
      );
  const categoryDemand = mockProjects.reduce<Record<string, number>>((acc, project) => {
    const category = project.category || project.serviceType || "Other";
    acc[category] = (acc[category] ?? 0) + 1;
    return acc;
  }, {});
  const topFreelancers = [...specialists].sort((a, b) => b.deliveryScore - a.deliveryScore).slice(0, 3);

  return {
    totalClients,
    activeProjects,
    completionRate,
    averageProjectValue,
    repeatClients: Math.max(0, totalClients - 1),
    topFreelancers,
    categoryDemand
  };
};

export const runQualityCheck = (projectId: number, milestoneId: number) => {
  ensureInitialized();
  const project = getProjectById(projectId);
  if (!project) {
    return;
  }

  const milestone = project.milestones.find((item) => item.id === milestoneId);
  if (!milestone) {
    return;
  }

  const isFinal = milestone.title.toLowerCase().includes("final");
  const category = project.category || project.serviceType;
  const issues = isFinal ? [] : qaIssuesForCategory(category);
  milestone.qaStatus = issues.length > 0 ? "Issues" : "Verified";
  milestone.qaIssues = issues;
  project.lastUpdate = `${toIsoDate(now)} 10:30`;
  addSystemMessage(
    projectId,
    issues.length > 0
      ? "AI QA flagged issues. Please review before client approval."
      : "AI QA verified this milestone."
  );
  saveToStorage();
  return milestone;
};

export const escalateProject = (projectId: number, reason: string) => {
  ensureInitialized();
  const project = getProjectById(projectId);
  if (!project) {
    return;
  }

  project.riskLevel = "Red";
  project.lastUpdate = `${toIsoDate(now)} 10:40`;
  addSystemMessage(projectId, `Project escalated: ${reason}`);
  saveToStorage();
  return project;
};

export const replaceSpecialist = (projectId: number) => {
  ensureInitialized();
  const project = getProjectById(projectId);
  if (!project) {
    return;
  }

  const replacement = specialists.find(
    (specialist) => specialist.availability === "Available" && specialist.name !== project.assignedSpecialistName
  );
  if (!replacement) {
    addSystemMessage(projectId, "Replacement requested but no available specialist found.");
    return;
  }

  project.assignedSpecialistName = replacement.name;
  project.assignedSpecialistRole = replacement.role;
  project.lastUpdate = `${toIsoDate(now)} 10:45`;
  addSystemMessage(projectId, `Specialist replaced with ${replacement.role}.`);
  saveToStorage();
  return project;
};

export const addFeedback = (projectId: number, rating: number, comment: string) => {
  ensureInitialized();
  const project = getProjectById(projectId);
  if (!project) {
    return;
  }

  project.feedback.push({
    id: feedbackIdCounter++,
    rating,
    comment,
    createdAt: `${toIsoDate(now)} 09:30`
  });
  project.lastUpdate = `${toIsoDate(now)} 09:30`;
  saveToStorage();
};

export const getInvoices = () => {
  ensureInitialized();
  return mockProjects.flatMap((project) => project.invoices.map((invoice) => ({ ...invoice })));
};

export const addInvoice = (projectId: number, amount: string, dueDate: string) => {
  ensureInitialized();
  const project = getProjectById(projectId);
  if (!project) {
    return;
  }

  const invoice = {
    id: invoiceIdCounter++,
    projectId,
    invoiceNumber: `INV-${1000 + invoiceIdCounter}`,
    amount,
    status: "Unpaid" as const,
    dueDate
  };

  project.invoices.push(invoice);
  project.lastUpdate = `${toIsoDate(now)} 09:40`;
  saveToStorage();
  return invoice;
};

export const getAssignmentRequests = () => {
  ensureInitialized();
  return assignmentRequests;
};

export const assignProjectToSpecialist = (projectId: number, specialistName: string, specialistRole: string) => {
  ensureInitialized();
  const project = getProjectById(projectId);
  if (!project) {
    return;
  }

  project.status = "In Progress";
  project.assignedSpecialistName = specialistName;
  project.assignedSpecialistRole = specialistRole;
  project.lastUpdate = `${toIsoDate(now)} 10:00`;

  assignmentRequests = assignmentRequests.filter((request) => request.projectId !== projectId);
  addSystemMessage(projectId, "Specialist assigned by SkillLink Nexus.");
  saveToStorage();
  return project;
};

export const runAiAssignment = (projectId: number) => {
  ensureInitialized();
  const project = getProjectById(projectId);
  if (!project) {
    return;
  }

  const existingRequest = assignmentRequests.find((request) => request.projectId === projectId);
  if (!existingRequest) {
    assignmentRequests.unshift(buildAssignmentRequest(project));
  }

  const specialist = pickBestSpecialist(project.category);
  if (!specialist) {
    addSystemMessage(projectId, "AI could not find an available specialist. Manual assignment needed.");
    saveToStorage();
    return;
  }

  return assignProjectToSpecialist(projectId, specialist.name, specialist.role);
};

export const addProjectDeskMessage = (projectId: number, body: string, attachments: string[]) => {
  ensureInitialized();
  const project = getProjectById(projectId);
  if (!project) {
    return;
  }

  project.messages.push({
    id: messageIdCounter++,
    projectId,
    senderType: "project_desk",
    body,
    createdAt: `${toIsoDate(now)} 10:10`,
    attachments
  });
  project.lastUpdate = `${toIsoDate(now)} 10:10`;
  saveToStorage();
};

export const sendDeskToSpecialist = (projectId: number, body: string, attachments: string[]) => {
  ensureInitialized();
  const project = getProjectById(projectId);
  if (!project) {
    return;
  }

  project.messages.push({
    id: messageIdCounter++,
    projectId,
    senderType: "project_desk",
    body,
    createdAt: `${toIsoDate(now)} 10:20`,
    attachments,
    forwardedToSpecialist: true
  });

  freelancerInbox.push({
    id: messageIdCounter++,
    projectId,
    senderLabel: "Project Desk",
    body,
    createdAt: `${toIsoDate(now)} 10:20`,
    attachments
  });

  project.lastUpdate = `${toIsoDate(now)} 10:20`;
  saveToStorage();
};

export const removeAssignmentRequest = (id: number) => {
  ensureInitialized();
  assignmentRequests = assignmentRequests.filter((request) => request.id !== id);
  saveToStorage();
};

export const getSpecialists = () => {
  ensureInitialized();
  return specialists;
};

export const updateSpecialistAvailability = (id: number, availability: Specialist["availability"]) => {
  ensureInitialized();
  const specialist = specialists.find((item) => item.id === id);
  if (specialist) {
    specialist.availability = availability;
  }
  saveToStorage();
};

export const updateSpecialistVerification = (id: number, status: Specialist["verificationStatus"]) => {
  ensureInitialized();
  const specialist = specialists.find((item) => item.id === id);
  if (specialist) {
    specialist.verificationStatus = status;
  }
  saveToStorage();
};

export const addSpecialistSkill = (id: number, skill: string) => {
  ensureInitialized();
  const specialist = specialists.find((item) => item.id === id);
  if (specialist && skill.trim()) {
    specialist.skills = Array.from(new Set([...specialist.skills, skill.trim()]));
  }
  saveToStorage();
};

export const getRelayInbox = () => {
  ensureInitialized();
  return mockProjects
    .flatMap((project) =>
      project.messages
        .filter((message) => message.senderType === "client" && !message.forwardedToSpecialist)
        .map((message) => ({ project, message }))
    );
};

export const forwardToSpecialist = (projectId: number, messageId: number) => {
  ensureInitialized();
  const project = getProjectById(projectId);
  if (!project) {
    return;
  }

  const message = project.messages.find((item) => item.id === messageId);
  if (!message) {
    return;
  }

  message.forwardedToSpecialist = true;
  freelancerInbox.push({
    id: messageIdCounter++,
    projectId,
    senderLabel: "Project Desk",
    body: message.body,
    createdAt: message.createdAt,
    attachments: message.attachments
  });
  saveToStorage();
};

export const getFreelancerInbox = () => {
  ensureInitialized();
  return freelancerInbox;
};

export const upcomingDeadlinesCount = (days: number) => {
  ensureInitialized();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() + days);

  return mockProjects.filter((project) => new Date(project.deadline) <= cutoff).length;
};

export const projectsAtRiskCount = () => {
  ensureInitialized();
  return mockProjects.filter((project) => project.riskLevel === "Red").length;
};

export const pendingApprovalsCount = () => {
  ensureInitialized();
  return mockProjects
    .flatMap((project) => project.milestones)
    .filter((milestone) => milestone.status === "Submitted").length;
};

export const availableSpecialistsCount = () => {
  ensureInitialized();
  return specialists.filter((specialist) => specialist.availability === "Available").length;
};

export const averageAssignTimeHours = () => 3;
export const onTimeDeliveryRate = () => 92;
