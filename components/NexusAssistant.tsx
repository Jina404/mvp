"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CAT_QUESTIONS, SERVICE_TYPES, TIMELINE_OPTIONS } from "@/components/RequestSurvey";
import {
  Check,
  ClipboardCopy,
  MessageCirclePlus,
  Mic,
  Paperclip,
  RotateCcw,
  Send,
  X
} from "lucide-react";

type Role = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: Role;
  content: string;
};

type Confidence = "low" | "medium" | "high";

type SummaryField = {
  label: string;
  value: string;
  confidence: Confidence;
};

type SummaryState = {
  title: SummaryField;
  serviceType: SummaryField;
  budget: SummaryField;
  deadline: SummaryField;
  requirements: SummaryField;
  deliverables: SummaryField;
  risks: SummaryField;
};

type IntakeState = {
  category: string;
  projectTitle: string;
  description: string;
  catAnswers: Record<string, string | string[]>;
  timeline: string;
  budgetType: "" | "suggest" | "custom";
  budgetAmount: string;
};

type ChatStep =
  | { type: "category" }
  | { type: "project-title" }
  | { type: "description" }
  | { type: "cat-question"; qId: string }
  | { type: "timeline" }
  | { type: "budget-type" }
  | { type: "budget-amount" }
  | { type: "complete" };

type Props = {
  onClose: () => void;
};

const emptySummary: SummaryState = {
  title: { label: "Project title", value: "TBD", confidence: "low" },
  serviceType: { label: "Service type", value: "TBD", confidence: "low" },
  budget: { label: "Budget range", value: "TBD", confidence: "low" },
  deadline: { label: "Deadline", value: "TBD", confidence: "low" },
  requirements: { label: "Requirements", value: "TBD", confidence: "low" },
  deliverables: { label: "Deliverables", value: "TBD", confidence: "low" },
  risks: { label: "Risks / assumptions", value: "TBD", confidence: "low" }
};
const emptyIntake: IntakeState = {
  category: "",
  projectTitle: "",
  description: "",
  catAnswers: {},
  timeline: "",
  budgetType: "",
  budgetAmount: ""
};

const getServiceLabel = (value: string) => SERVICE_TYPES.find((svc) => svc.value === value)?.label ?? "TBD";

const normalizeText = (value: string) => value.trim().toLowerCase();

const formatOptions = (options: string[]) => options.map((option) => `- ${option}`).join("\n");

const isQuestionVisible = (qId: string, state: IntakeState) => {
  const question = CAT_QUESTIONS[state.category]?.find((item) => item.id === qId);
  if (!question?.showIf) {
    return true;
  }
  const answer = state.catAnswers[question.showIf.field];
  return typeof answer === "string"
    ? answer === question.showIf.value
    : Array.isArray(answer) && answer.includes(question.showIf.value);
};

const buildSteps = (state: IntakeState): ChatStep[] => {
  const steps: ChatStep[] = [
    { type: "category" },
    { type: "project-title" },
    { type: "description" }
  ];

  const catQuestions = CAT_QUESTIONS[state.category] ?? [];
  for (const q of catQuestions) {
    if (!q.showIf || isQuestionVisible(q.id, state)) {
      steps.push({ type: "cat-question", qId: q.id });
    }
  }

  steps.push({ type: "timeline" }, { type: "budget-type" });
  if (state.budgetType === "custom" && !state.budgetAmount.trim()) {
    steps.push({ type: "budget-amount" });
  }
  steps.push({ type: "complete" });
  return steps;
};

const matchServiceType = (input: string) => {
  const normalized = normalizeText(input);
  const direct = SERVICE_TYPES.find(
    (svc) => svc.value.toLowerCase() === normalized || svc.label.toLowerCase() === normalized
  );
  if (direct) {
    return direct;
  }

  const keywordMap: Array<{ key: string; value: string }> = [
    { key: "web", value: "web-development" },
    { key: "website", value: "web-development" },
    { key: "app", value: "mobile-app" },
    { key: "mobile", value: "mobile-app" },
    { key: "ui", value: "ui-ux-design" },
    { key: "ux", value: "ui-ux-design" },
    { key: "design", value: "ui-ux-design" },
    { key: "brand", value: "branding" },
    { key: "marketing", value: "marketing" },
    { key: "data", value: "data-analytics" },
    { key: "analytics", value: "data-analytics" }
  ];

  const keyword = keywordMap.find((entry) => normalized.includes(entry.key));
  return keyword ? SERVICE_TYPES.find((svc) => svc.value === keyword.value) ?? null : null;
};

const matchOption = (input: string, options: string[]) => {
  const normalized = normalizeText(input);
  if (!normalized) {
    return null;
  }
  const direct = options.find((option) => normalizeText(option) === normalized);
  if (direct) {
    return direct;
  }
  const contains = options.find((option) => normalizeText(option).includes(normalized));
  if (contains) {
    return contains;
  }
  const reversed = options.find((option) => normalized.includes(normalizeText(option)));
  return reversed ?? null;
};

const matchMultiOptions = (input: string, options: string[]) => {
  const normalized = normalizeText(input);
  if (!normalized) {
    return [];
  }
  const byFullMatch = options.filter((option) => normalized.includes(normalizeText(option)));
  if (byFullMatch.length > 0) {
    return byFullMatch;
  }

  const tokens = normalized.split(/,| and /).map((token) => token.trim()).filter(Boolean);
  const matched = new Set<string>();
  for (const token of tokens) {
    const option = matchOption(token, options);
    if (option) {
      matched.add(option);
    }
  }

  return Array.from(matched);
};

const matchTimeline = (input: string) => {
  const normalized = normalizeText(input);
  const direct = TIMELINE_OPTIONS.find(
    (option) => normalizeText(option.label) === normalized || normalizeText(option.value) === normalized
  );
  if (direct) {
    return direct.value;
  }
  if (normalized.includes("urgent") || normalized.includes("1-3")) {
    return "urgent";
  }
  if (normalized.includes("normal") || normalized.includes("1-2") || normalized.includes("1 to 2")) {
    return "normal";
  }
  if (normalized.includes("flexible") || normalized.includes("2+")) {
    return "flexible";
  }
  return "";
};

const parseBudget = (input: string) => {
  const normalized = normalizeText(input);
  const hasAmount = /\d/.test(input);
  if (hasAmount) {
    return { type: "custom" as const, amount: input.trim() };
  }
  if (normalized.includes("suggest") || normalized.includes("not sure") || normalized.includes("best")) {
    return { type: "suggest" as const, amount: "" };
  }
  if (normalized.includes("budget") || normalized.includes("have") || normalized.includes("my")) {
    return { type: "custom" as const, amount: "" };
  }
  return { type: "" as const, amount: "" };
};

const buildSummaryFromIntake = (state: IntakeState): SummaryState => {
  const serviceLabel = state.category ? getServiceLabel(state.category) : "TBD";
  const timelineLabel = TIMELINE_OPTIONS.find((option) => option.value === state.timeline)?.label ?? "TBD";
  const budgetValue = state.budgetType === "custom"
    ? state.budgetAmount || "TBD"
    : state.budgetType === "suggest"
      ? "Suggest the best price"
      : "TBD";

  const catLines = Object.entries(state.catAnswers)
    .map(([id, value]) => {
      const question = CAT_QUESTIONS[state.category]?.find((item) => item.id === id);
      const answerText = Array.isArray(value) ? value.join(", ") : value;
      return question ? `${question.question}: ${answerText}` : "";
    })
    .filter(Boolean);

  const requirementsText = [state.description, ...catLines].filter(Boolean).join(" ");

  const toField = (label: string, value: string): SummaryField => {
    const normalized = value?.trim() ? value.trim() : "TBD";
    const confidence: Confidence = normalized === "TBD" ? "low" : normalized.length > 24 ? "high" : "medium";
    return { label, value: normalized, confidence };
  };

  return {
    title: toField("Project title", state.projectTitle),
    serviceType: toField("Service type", serviceLabel),
    budget: toField("Budget range", budgetValue),
    deadline: toField("Deadline", timelineLabel),
    requirements: toField("Requirements", requirementsText),
    deliverables: toField("Deliverables", "TBD"),
    risks: toField("Risks / assumptions", "TBD")
  };
};

const stepMatches = (a: ChatStep, b: ChatStep) => {
  if (a.type !== b.type) {
    return false;
  }
  if (a.type === "cat-question" && b.type === "cat-question") {
    return a.qId === b.qId;
  }
  return true;
};

const buildQuestionForStep = (step: ChatStep, state: IntakeState) => {
  switch (step.type) {
    case "category":
      return [
        "What are you looking to build?",
        "Choose one:",
        formatOptions(SERVICE_TYPES.map((svc) => svc.label))
      ].join("\n");
    case "project-title":
      return "Give your project a short name.";
    case "description":
      return "Tell me what you need. A few sentences is perfect.";
    case "cat-question": {
      const question = CAT_QUESTIONS[state.category]?.find((item) => item.id === step.qId);
      if (!question) {
        return "Share any extra detail you think matters.";
      }
      if (question.type === "text") {
        return [question.question, question.placeholder ?? "Share a little more detail."].join("\n");
      }
      const header = question.type === "multi"
        ? `${question.question}\nSelect all that apply (comma separated).`
        : `${question.question}\nChoose one:`;
      return question.options ? [header, formatOptions(question.options)].join("\n") : question.question;
    }
    case "timeline":
      return [
        "When do you need this completed?",
        "Choose one:",
        formatOptions(TIMELINE_OPTIONS.map((option) => option.label))
      ].join("\n");
    case "budget-type":
      return [
        "Do you have a budget in mind?",
        "Choose one:",
        formatOptions(["Suggest the best price", "I have a budget (enter amount)"])
      ].join("\n");
    case "budget-amount":
      return "What budget range should we plan for? (e.g. $2,000 or KES 250,000)";
    case "complete":
      return "All set. Review the summary on the right, then click Confirm & Submit Request.";
    default:
      return "Tell me more.";
  }
};

const buildFollowUpMessage = (currentStep: ChatStep, nextStep: ChatStep, state: IntakeState) => {
  if (nextStep.type === "complete") {
    return buildQuestionForStep(nextStep, state);
  }

  const acknowledgements: Record<ChatStep["type"], string> = {
    category: "Great. ",
    "project-title": "Nice. ",
    description: "Thanks. ",
    "cat-question": "Got it. ",
    timeline: "Thanks. ",
    "budget-type": "Understood. ",
    "budget-amount": "Perfect. ",
    complete: ""
  };

  const prefix = acknowledgements[currentStep.type] ?? "";
  return `${prefix}${buildQuestionForStep(nextStep, state)}`;
};

export default function NexusAssistant({ onClose }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [summaryReady, setSummaryReady] = useState(false);
  const [introTyping, setIntroTyping] = useState(true);
  const [reactions, setReactions] = useState<Record<string, "up" | "down" | null>>({});
  const [summary, setSummary] = useState<SummaryState>(emptySummary);
  const [intake, setIntake] = useState<IntakeState>(emptyIntake);
  const steps = useMemo(() => buildSteps(intake), [intake]);
  const [stepIdx, setStepIdx] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [showScroll, setShowScroll] = useState(false);
  const messagesRef = useRef<ChatMessage[]>([]);

  const welcomeState = messages.length === 0;
  const isComplete = steps[Math.min(stepIdx, steps.length - 1)]?.type === "complete";

  const updateMessages = (updater: (prev: ChatMessage[]) => ChatMessage[]) => {
    setMessages((prev) => {
      const next = updater(prev);
      messagesRef.current = next;
      return next;
    });
  };

  const queueAssistantMessage = (content: string) => {
    const assistantId = `${Date.now()}-a`;
    updateMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }]);
    setIsThinking(true);
    window.setTimeout(() => {
      updateMessages((prev) =>
        prev.map((msg) => (msg.id === assistantId ? { ...msg, content } : msg))
      );
      setIsThinking(false);
    }, 320);
  };

  const startConversation = () => {
    const intro =
      "Hi! I’m the SkillLink Nexus Project Assistant. I’ll ask a few quick questions to prepare your request.";
    const question = buildQuestionForStep({ type: "category" }, emptyIntake);
    const introMessage: ChatMessage = {
      id: "intro-message",
      role: "assistant",
      content: `${intro}\n\n${question}`
    };
    messagesRef.current = [introMessage];
    setMessages([introMessage]);
    setIntroTyping(false);
    setStepIdx(0);
  };

  const handleNewChat = () => {
    setInput("");
    setSummary(emptySummary);
    setIntake(emptyIntake);
    setStepIdx(0);
    setSubmitted(false);
    setIsSubmitting(false);
    setReactions({});
    setSummaryReady(false);
    setIntroTyping(true);
    messagesRef.current = [];
    setMessages([]);
  };

  const handleRevealSummary = () => {
    setSummaryReady(true);
  };

  const handleSubmitRequest = async () => {
    if (isSubmitting || submitted) {
      return;
    }
    setIsSubmitting(true);
    try {
      const { addProject, runAiAssignment } = await import("@/lib/mockDb");
      const serviceLabel = intake.category ? getServiceLabel(intake.category) : "TBD";
      const timelineLabel = TIMELINE_OPTIONS.find((option) => option.value === intake.timeline)?.label ?? "TBD";
      const budgetLabel = intake.budgetType === "custom"
        ? intake.budgetAmount || "TBD"
        : intake.budgetType === "suggest"
          ? "Suggest the best price"
          : "TBD";

      const detailLines = Object.entries(intake.catAnswers)
        .map(([id, value]) => {
          const question = CAT_QUESTIONS[intake.category]?.find((item) => item.id === id);
          const answer = Array.isArray(value) ? value.join(", ") : value;
          return question ? `${question.question}: ${answer}` : "";
        })
        .filter(Boolean);
      const description = [intake.description, ...detailLines].filter(Boolean).join(" ");

      const newProject = addProject({
        title: intake.projectTitle || "New request",
        client: "Client",
        serviceType: serviceLabel,
        category: serviceLabel,
        description,
        budgetRange: budgetLabel,
        budgetEstimate: budgetLabel,
        quoteAmount: budgetLabel,
        amountPaid: "KES 0",
        paymentMethod: "Unspecified",
        freelancerPayout: "KES 0",
        margin: "KES 0",
        estimatedTimeline: timelineLabel,
        deadline: timelineLabel,
        status: "New",
        assignedSpecialistRole: "Pending",
        assignedRoles: ["Developer", "Designer", "Project Manager"],
        deliverablesChecklist: [],
        requiredAssets: [],
        risksAssumptions: [],
        clientContext: description
      });
      runAiAssignment(newProject.id);
      setSubmitted(true);
      updateMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-system`,
          role: "assistant",
          content: "Your request is submitted. A project manager will reach out with the next steps."
        }
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSend = (value?: string) => {
    if (isThinking) {
      return;
    }
    const text = (value ?? input).trim();
    if (!text) {
      return;
    }

    const userMessage: ChatMessage = { id: `${Date.now()}-u`, role: "user", content: text };
    updateMessages((prev) => [...prev, userMessage]);
    setInput("");

    const currentStep = steps[Math.min(stepIdx, steps.length - 1)];
    if (!currentStep) {
      return;
    }

    let nextIntake = { ...intake };
    let correction: string | null = null;

    switch (currentStep.type) {
      case "category": {
        const match = matchServiceType(text);
        if (!match) {
          correction = `I didn’t catch that. Please choose one:\n${formatOptions(SERVICE_TYPES.map((svc) => svc.label))}`;
        } else {
          nextIntake = { ...nextIntake, category: match.value, catAnswers: {} };
        }
        break;
      }
      case "project-title":
        nextIntake = { ...nextIntake, projectTitle: text };
        break;
      case "description":
        nextIntake = { ...nextIntake, description: text };
        break;
      case "cat-question": {
        const question = CAT_QUESTIONS[nextIntake.category]?.find((item) => item.id === currentStep.qId);
        if (!question) {
          break;
        }
        if (question.type === "single") {
          const choice = question.options ? matchOption(text, question.options) : null;
          if (!choice) {
            correction = `Please choose one option:\n${formatOptions(question.options ?? [])}`;
          } else {
            nextIntake = {
              ...nextIntake,
              catAnswers: { ...nextIntake.catAnswers, [question.id]: choice }
            };
          }
        }
        if (question.type === "multi") {
          const selections = question.options ? matchMultiOptions(text, question.options) : [];
          if (selections.length === 0) {
            correction = `Please select at least one option:\n${formatOptions(question.options ?? [])}`;
          } else {
            nextIntake = {
              ...nextIntake,
              catAnswers: { ...nextIntake.catAnswers, [question.id]: selections }
            };
          }
        }
        if (question.type === "text") {
          nextIntake = {
            ...nextIntake,
            catAnswers: { ...nextIntake.catAnswers, [question.id]: text }
          };
        }
        break;
      }
      case "timeline": {
        const timelineValue = matchTimeline(text);
        if (!timelineValue) {
          correction = `Please choose one timeline:\n${formatOptions(TIMELINE_OPTIONS.map((option) => option.label))}`;
        } else {
          nextIntake = { ...nextIntake, timeline: timelineValue };
        }
        break;
      }
      case "budget-type": {
        const parsed = parseBudget(text);
        if (!parsed.type) {
          correction = `Please choose one:\n${formatOptions(["Suggest the best price", "I have a budget (enter amount)"])}`;
        } else {
          nextIntake = {
            ...nextIntake,
            budgetType: parsed.type,
            budgetAmount: parsed.amount
          };
        }
        break;
      }
      case "budget-amount":
        nextIntake = { ...nextIntake, budgetAmount: text };
        break;
      case "complete":
        queueAssistantMessage(buildQuestionForStep(currentStep, nextIntake));
        return;
    }

    if (correction) {
      queueAssistantMessage(correction);
      return;
    }

    setIntake(nextIntake);

    const nextSteps = buildSteps(nextIntake);
    const currentIndex = nextSteps.findIndex((step) => stepMatches(step, currentStep));
    const nextIndex = currentIndex >= 0 ? Math.min(currentIndex + 1, nextSteps.length - 1) : 0;
    setStepIdx(nextIndex);

    const nextStep = nextSteps[nextIndex];
    if (nextStep.type === "complete") {
      setSummaryReady(true);
    }
    queueAssistantMessage(buildFollowUpMessage(currentStep, nextStep, nextIntake));
  };

  const handleRegenerate = () => {
    const currentStep = steps[Math.min(stepIdx, steps.length - 1)];
    if (!currentStep) {
      return;
    }
    queueAssistantMessage(buildQuestionForStep(currentStep, intake));
  };

  const handleCopy = async (text: string) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    }
  };

  const handleScroll = () => {
    const el = listRef.current;
    if (!el) {
      return;
    }
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
    setShowScroll(!nearBottom);
  };

  useEffect(() => {
    setSummary(buildSummaryFromIntake(intake));
  }, [intake]);

  useEffect(() => {
    if (stepIdx >= steps.length) {
      setStepIdx(Math.max(steps.length - 1, 0));
    }
  }, [steps, stepIdx]);

  useEffect(() => {
    messagesRef.current = messages;
    handleScroll();
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      return;
    }
    setIntroTyping(true);
    const timer = window.setTimeout(() => {
      startConversation();
    }, 900);

    return () => window.clearTimeout(timer);
  }, [messages.length]);

  return (
    <div className="flex h-full flex-col gap-4 lg:flex-row lg:items-stretch">
      <div className="flex h-full min-h-[280px] flex-1 flex-col rounded-[24px] border border-slate-200 bg-white dark:border-white/5 dark:bg-[#1E2329] sm:rounded-[24px]">
        <div className="sticky top-0 z-10 border-b border-slate-200 bg-white dark:border-white/5 dark:bg-[#1E2329] px-5 py-3 sm:px-6 rounded-t-[24px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900">
                <img src="/ai.png" alt="Nexus Assistant DP" className="h-7 w-7 rounded-full bg-white" style={{objectFit: 'contain'}} />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Nexus Assistant</div>
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className={`h-2 w-2 rounded-full ${isThinking ? "bg-amber-400" : "bg-emerald-500"}`} />
                  {isThinking ? "Thinking..." : "Online"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={handleNewChat} aria-label="New chat">
                <MessageCirclePlus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleRevealSummary} aria-label="Save summary">
                <Check className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="relative flex-1 overflow-y-auto px-4 py-5 sm:px-6" ref={listRef} onScroll={handleScroll}>
          {welcomeState ? (
            <div className="flex h-full items-center justify-center text-center">
              {introTyping ? (
                <div className="typing-dots" aria-label="Assistant is typing">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              ) : (
                <div className="max-w-xl text-sm text-slate-500 dark:text-slate-400">
                  Hi 👋 I’m the SkillLink Nexus Project Assistant.
                  <br />
                  Tell me what you need, and I’ll summarize it into a project brief and route it to the right specialist.
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm animate-message sm:max-w-[70%] ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white"
                        : "bg-slate-100 text-slate-700 dark:bg-[#2B3139] dark:text-slate-200"
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.content}</div>
                    {msg.role === "assistant" && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <button
                          className="rounded-full border border-slate-200 dark:border-white/10 px-2 py-1"
                          type="button"
                          onClick={() => handleCopy(msg.content)}
                        >
                          <ClipboardCopy className="h-3 w-3" />
                        </button>
                        <button
                          className="rounded-full border border-slate-200 dark:border-white/10 px-2 py-1"
                          type="button"
                          onClick={handleRegenerate}
                        >
                          <RotateCcw className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isThinking && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-slate-100 dark:bg-[#2B3139] px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <div className="typing-dots" aria-label="Assistant is typing">
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                      </div>
                      <span>Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {showScroll && (
            <button
              className="fixed bottom-28 right-4 rounded-full border border-slate-200 bg-white dark:border-white/10 dark:bg-[#1E2329] p-2 text-slate-600 dark:text-slate-300 shadow-sm sm:right-8"
              type="button"
              onClick={() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" })}
              aria-label="Scroll to bottom"
            >
              ↓
            </button>
          )}
        </div>

        <div className="border-t border-slate-200 dark:border-white/5 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white dark:border-white/10 dark:bg-[#1E2329] px-3 py-2.5 sm:px-4">
            <Textarea
              className="min-h-[40px] flex-1 border-none p-0 text-sm shadow-none focus-visible:ring-0"
              placeholder={submitted ? "Request submitted" : "Message..."}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  handleSend();
                }
              }}
              disabled={submitted}
            />
            <Button variant="ghost" size="icon" aria-label="Attach file">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Voice input">
              <Mic className="h-4 w-4" />
            </Button>
            <Button
              className="h-9 w-9 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/15"
              size="icon"
              onClick={() => handleSend()}
              disabled={!input.trim() || isThinking || submitted}
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-2 text-xs text-slate-400 dark:text-slate-500">Enter to send, Shift+Enter for new line.</div>
        </div>
      </div>

      <div className="flex w-full flex-col rounded-[20px] border border-slate-200 bg-white dark:border-white/5 dark:bg-[#1E2329] p-4 sm:rounded-[24px] sm:p-6 lg:max-w-[360px] lg:h-full">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Project Summary</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Live brief from your conversation.</div>
          </div>
          <Badge variant="secondary">Live</Badge>
        </div>

        <div className="mt-4 text-sm text-slate-700 dark:text-slate-300">
          {!summaryReady && !isComplete ? (
            messages.length === 0 ? (
              <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                Start chatting to generate a live project summary.
              </p>
            ) : (
              <div className="rounded-2xl border border-slate-100 bg-slate-50 dark:border-white/5 dark:bg-white/5 px-4 py-4 text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  Generating project summary...
                </div>
                <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Keep answering the questions and I will build the summary for you.
                </div>
              </div>
            )
          ) : (
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              {summary.title.value !== "TBD" ? `Project: ${summary.title.value}. ` : ""}
              {summary.serviceType.value !== "TBD" ? `Service: ${summary.serviceType.value}. ` : ""}
              {summary.budget.value !== "TBD" ? `Budget: ${summary.budget.value}. ` : ""}
              {summary.deadline.value !== "TBD" ? `Deadline: ${summary.deadline.value}. ` : ""}
              {summary.requirements.value !== "TBD" ? `Requirements: ${summary.requirements.value}. ` : ""}
              {summary.deliverables.value !== "TBD" ? `Deliverables: ${summary.deliverables.value}. ` : ""}
              {summary.risks.value !== "TBD" ? `Risks/assumptions: ${summary.risks.value}.` : ""}
            </p>
          )}
        </div>

        {isComplete && !submitted ? (
          <Button className="mt-6 w-full" onClick={handleSubmitRequest} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Confirm & Submit Request"}
          </Button>
        ) : null}
        {submitted ? (
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10 px-4 py-3 text-xs text-emerald-700 dark:text-emerald-300">
            Request submitted. We will follow up shortly.
          </div>
        ) : null}
      </div>
      <style jsx>{`
        .animate-message {
          animation: messageFade 0.25s ease;
        }

        .typing-dots {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          min-height: 12px;
        }

        .typing-dot {
          width: 7px;
          height: 7px;
          background: #94a3b8;
          border-radius: 999px;
          display: inline-block;
          animation: typingBounce 1s infinite ease-in-out;
        }

        .typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes messageFade {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes typingBounce {
          0%,
          80%,
          100% {
            transform: translateY(0);
            opacity: 0.35;
          }
          40% {
            transform: translateY(-5px);
            opacity: 1;
          }
        }

        @media (max-width: 640px) {
          .animate-message {
            animation-duration: 0.2s;
          }
        }
      `}</style>
    </div>
  );
}
