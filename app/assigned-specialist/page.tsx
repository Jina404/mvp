"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, User } from "lucide-react";
import ClientLayout from "@/components/ClientLayout";

type MessageSender = "client" | "specialist" | "pm" | "system";

type ChatMessage = {
  id: string;
  sender: MessageSender;
  text: string;
  createdAt: string;
};

type Conversation = {
  id: string;
  specialistId: string;
  createdAt: string;
  messages: ChatMessage[];
};

const specialist = {
  id: "12H3",
  about: "Full-Stack Developer",
  vetted: true,
  skills: ["React", "Next.js", "Django", "PostgreSQL", "API Integrations"]
};

const projectManager = {
  id: "PM-04",
  name: "SkillLink Project Desk",
  role: "Project Manager",
  description: "Coordinates delivery, QA, and milestone approvals."
};

const qualityAssurance = {
  id: "QA-02",
  name: "SkillLink QA",
  role: "Quality Assurance",
  description: "Reviews submissions and validates deliverables."
};

const supportingSpecialists = [
  { id: "88K1", role: "UI/UX" },
  { id: "45M2", role: "Backend" }
];

const milestones = [
  {
    id: "m1",
    title: "Documentation",
    dueDate: "2026-02-19",
    status: "Submitted",
    submittedAt: "2026-02-19 10:05",
    note: "Summary of requirements, setup notes, and current limitations.",
    deliverables: {
      documentation: [
        { name: "Milestone-1-Summary.pdf", url: "#" },
        { name: "Setup-Instructions.docx", url: "#" },
        { name: "API-Notes.md", url: "#" }
      ],
      screenshots: [],
      links: [],
      finalDelivery: []
    }
  },
  {
    id: "m2",
    title: "Progress Evidence",
    dueDate: "2026-02-26",
    status: "Submitted",
    submittedAt: "2026-02-20 14:10",
    note: "UI progress with desktop + mobile snapshots.",
    deliverables: {
      documentation: [],
      screenshots: [
        { name: "homepage-desktop.png", url: "#", thumb: "#" },
        { name: "checkout-mobile.png", url: "#", thumb: "#" },
        { name: "dashboard-preview.mp4", url: "#", thumb: "#" }
      ],
      links: [],
      finalDelivery: []
    }
  },
  {
    id: "m3",
    title: "Links",
    dueDate: "2026-03-05",
    status: "Submitted",
    submittedAt: "2026-03-02 11:05",
    note: "Key delivery links for review and validation.",
    deliverables: {
      documentation: [],
      screenshots: [],
      links: [
        { label: "Staging", url: "https://staging.skilllinknexus.com" },
        { label: "GitHub", url: "https://github.com/..." },
        { label: "Pull request", url: "https://github.com/.../pull/12" },
        { label: "Figma", url: "https://figma.com/..." },
        { label: "Demo video", url: "https://loom.com/..." },
        { label: "API docs", url: "https://staging.skilllinknexus.com/docs" }
      ],
      finalDelivery: []
    }
  },
  {
    id: "m4",
    title: "Final Delivery / Handover",
    dueDate: "2026-03-12",
    status: "Pending",
    submittedAt: "",
    note: "Handover package will include deployment and sign-off checklist.",
    deliverables: {
      documentation: [],
      screenshots: [],
      links: [],
      finalDelivery: [
        { name: "final-delivery.zip", url: "#" },
        { name: "handover-notes.pdf", url: "#" },
        { name: "deployment-summary.pdf", url: "#" }
      ]
    }
  }
];

const storageKey = "skilllink_conversations";

const formatTimestamp = (value: string) =>
  new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });

const statusStyles: Record<string, string> = {
  Pending: "bg-slate-100 text-slate-600",
  Submitted: "bg-purple-100 text-purple-700",
  Approved: "bg-purple-100 text-purple-700",
  Released: "bg-emerald-100 text-emerald-700"
};

function SpecialistProfileCard({
  onMessage,
  hasConversation
}: {
  onMessage: () => void;
  hasConversation: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 shadow-md border border-slate-200 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(168,85,247,0.1),transparent_50%)]" />
            <User className="h-8 w-8 text-slate-500 relative z-10" />
          </div>
          <div>
            <div className="text-lg font-semibold text-slate-900">Specialist {specialist.id}</div>
            <div className="mt-1 text-sm text-slate-500">{specialist.about}</div>
            {specialist.vetted && (
              <span className="mt-2 inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                Lead Specialist
              </span>
            )}
          </div>
        </div>
        <button
          onClick={onMessage}
          className="inline-flex items-center justify-center rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700"
        >
          {hasConversation ? "Open chat" : "Message"}
        </button>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {specialist.skills.map((skill) => (
          <span
            key={skill}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-5 border-t border-slate-100 pt-4">
        <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Delivery Team</div>
        <div className="mt-2 space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 shadow-md border border-slate-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(168,85,247,0.1),transparent_50%)]" />
              <User className="h-5 w-5 text-slate-500 relative z-10" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-700">{projectManager.name}</div>
              <div className="text-[11px] text-slate-500">{projectManager.role}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 shadow-md border border-slate-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.1),transparent_50%)]" />
              <User className="h-5 w-5 text-slate-500 relative z-10" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-700">{qualityAssurance.name}</div>
              <div className="text-[11px] text-slate-500">{qualityAssurance.role}</div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Supporting Specialists</div>
            {supportingSpecialists.map((spec) => (
              <div key={spec.id} className="flex items-center gap-3 pl-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 shadow-md border border-slate-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(71,85,105,0.1),transparent_50%)]" />
                  <User className="h-5 w-5 text-slate-500 relative z-10" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-700">Specialist {spec.id}</div>
                  <div className="text-[11px] text-slate-500">{spec.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ConversationCard({
  isOpen,
  messages,
  messageText,
  onMessageChange,
  onSend,
  onStart,
  inputRef
}: {
  isOpen: boolean;
  messages: ChatMessage[];
  messageText: string;
  onMessageChange: (value: string) => void;
  onSend: () => void;
  onStart: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/60">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-900">Conversation</div>
          <div className="text-xs text-slate-500">Messages stay inside SkillLink Nexus.</div>
        </div>
        {isOpen && (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            Secure
          </span>
        )}
      </div>

      {!isOpen ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6">
          <div className="flex flex-wrap items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
              <MessageSquare className="h-5 w-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-slate-900">
                Start a conversation with Specialist {specialist.id}
              </div>
              <div className="mt-1 text-sm text-slate-500">
                Messages stay inside SkillLink Nexus and are tied to your project.
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  onClick={onStart}
                  className="inline-flex items-center justify-center rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700"
                >
                  Start conversation
                </button>
                <button
                  type="button"
                  className="text-xs font-semibold text-slate-500 hover:text-slate-700"
                >
                  Messaging policy
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-6 space-y-3">
            {messages.map((message) => {
              const senderLabel =
                message.sender === "client"
                  ? "You"
                  : message.sender === "pm"
                  ? "SkillLink Project Desk"
                  : message.sender === "specialist"
                  ? `Specialist ${specialist.id}`
                  : "System";

              return (
                <div
                  key={message.id}
                  className={`rounded-2xl px-4 py-3 text-sm shadow-sm ${
                    message.sender === "client"
                      ? "ml-auto max-w-[80%] bg-purple-600 text-white"
                      : message.sender === "pm"
                      ? "max-w-[85%] border border-purple-200 bg-purple-50 text-purple-800"
                      : message.sender === "system"
                      ? "max-w-[85%] border border-amber-100 bg-amber-50 text-amber-700"
                      : "max-w-[85%] border border-slate-100 bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="text-xs font-semibold uppercase tracking-wide opacity-70">
                      {senderLabel}
                    </div>
                    {message.sender === "pm" && (
                      <span className="rounded bg-purple-200 px-1.5 py-0.5 text-[9px] font-bold uppercase text-purple-700">
                        Project Manager
                      </span>
                    )}
                  </div>
                  <div className="mt-1 leading-relaxed">{message.text}</div>
                  <div className="mt-2 text-[11px] opacity-70">{formatTimestamp(message.createdAt)}</div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <input
              ref={inputRef}
              value={messageText}
              onChange={(event) => onMessageChange(event.target.value)}
              placeholder="Type a message"
              className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm focus:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
            <button
              onClick={onSend}
              className="rounded-xl border border-purple-200 bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700"
            >
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
}


function MilestonesCard() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-5 py-6 shadow-sm overflow-visible">
      <div className="text-sm font-semibold text-slate-900">Milestones</div>
      <div className="relative mt-4 space-y-6 overflow-visible">
        <div className="absolute left-3 top-3 h-[calc(100%-1.5rem)] w-px bg-slate-200" />
        {milestones.map((milestone) => {
          const isOpen = expandedId === milestone.id;
          const hasDocs = milestone.deliverables.documentation.length > 0;
          const hasScreens = milestone.deliverables.screenshots.length > 0;
          const hasLinks = milestone.deliverables.links.length > 0;
          const hasFinal = milestone.deliverables.finalDelivery.length > 0;

          return (
            <div key={milestone.id} className="relative pl-8">
              <button
                type="button"
                onClick={() => setExpandedId(isOpen ? null : milestone.id)}
                className={`flex w-full items-start gap-4 rounded-xl border px-2 py-2 text-left transition ${
                  isOpen
                    ? "border-slate-200 bg-slate-50"
                    : "border-transparent hover:border-slate-200 hover:bg-slate-50"
                }`}
              >
            <div
              className={`absolute left-[6px] top-2 h-3 w-3 rounded-full border-2 border-white ${
                milestone.status === "Released"
                  ? "bg-emerald-500"
                  : milestone.status === "Submitted" || milestone.status === "Approved"
                  ? "bg-purple-500"
                  : "bg-slate-300"
              }`}
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-slate-700">{milestone.title}</div>
              <div className="text-xs text-slate-500">Due {milestone.dueDate}</div>
            </div>
            <span className="h-fit rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
              View
            </span>
            <span
              className={`ml-2 mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs text-slate-500 transition ${
                isOpen ? "border-slate-300 bg-white" : "border-slate-200"
              }`}
              aria-hidden="true"
            >
              {isOpen ? "−" : "+"}
            </span>
              </button>

              {isOpen && (
                <div className="mt-2 space-y-2 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 max-h-96 overflow-y-auto">
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <div>
                      <span className="font-semibold text-slate-600">Submitted on:</span>{" "}
                      {milestone.submittedAt || "Not submitted"}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-600">Notes:</span>{" "}
                      {milestone.note || "No notes yet."}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Documentation</div>
                    {hasDocs ? (
                      <div className="space-y-2">
                        {milestone.deliverables.documentation.map((doc) => (
                          <a
                            key={doc.name}
                            href={doc.url}
                            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 hover:border-purple-200"
                          >
                            <span>{doc.name}</span>
                            <span className="text-xs font-semibold text-purple-600">View</span>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-slate-400">Nothing uploaded yet.</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Screenshots</div>
                    {hasScreens ? (
                      <div className="grid grid-cols-2 gap-3">
                        {milestone.deliverables.screenshots.map((shot) => (
                          <a
                            key={shot.name}
                            href={shot.url}
                            className="overflow-hidden rounded-xl border border-slate-200 bg-white"
                          >
                            <div className="flex h-20 items-center justify-center bg-slate-100 text-xs text-slate-400">
                              Thumbnail
                            </div>
                            <div className="px-3 py-2 text-xs text-slate-500">{shot.name}</div>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-slate-400">Nothing uploaded yet.</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Links</div>
                    {hasLinks ? (
                      <div className="space-y-2">
                        {milestone.deliverables.links.map((link) => (
                          <a
                            key={link.label}
                            href={link.url}
                            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 hover:border-purple-200"
                          >
                            <span>{link.label}</span>
                            <span className="text-xs font-semibold text-purple-600">Open</span>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-slate-400">Nothing uploaded yet.</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Final Delivery</div>
                    {hasFinal ? (
                      <div className="space-y-2">
                        {milestone.deliverables.finalDelivery.map((file) => (
                          <a
                            key={file.name}
                            href={file.url}
                            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 hover:border-purple-200"
                          >
                            <span>{file.name}</span>
                            <span className="text-xs font-semibold text-purple-600">Download</span>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-slate-400">Nothing uploaded yet.</div>
                    )}
                  </div>

                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:border-purple-200"
                  >
                    View all files
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AssignedSpecialistPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const stored = window.localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Conversation[];
        setConversations(parsed);
      } catch {
        setConversations([]);
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    window.localStorage.setItem(storageKey, JSON.stringify(conversations));
  }, [conversations, hydrated]);

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeId),
    [conversations, activeId]
  );

  const handleMessageClick = () => {
    const conversationId = `conv_${specialist.id}`;
    const existing = conversations.find((conversation) => conversation.id === conversationId);
    if (!existing) {
      const now = new Date().toISOString();
      const seeded: Conversation = {
        id: conversationId,
        specialistId: specialist.id,
        createdAt: now,
        messages: [
          {
            id: `msg_${Date.now()}`,
            sender: "system",
            text: `You're now connected to Specialist ${specialist.id}. Messages stay inside SkillLink Nexus.`,
            createdAt: now
          },
          {
            id: `msg_${Date.now() + 1}`,
            sender: "pm",
            text: `Hi — I'm your SkillLink Project Manager. I'll coordinate delivery, QA, and milestone approvals. Feel free to tag me if anything needs attention.`,
            createdAt: now
          }
        ]
      };
      setConversations((prev) => [...prev, seeded]);
    }
    setActiveId(conversationId);
    setIsChatOpen(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSend = () => {
    if (!activeConversation || !messageText.trim()) {
      return;
    }
    const trimmed = messageText.trim();
    const nextMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: "client",
      text: trimmed,
      createdAt: new Date().toISOString()
    };
    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === activeConversation.id
          ? { ...conversation, messages: [...conversation.messages, nextMessage] }
          : conversation
      )
    );
    setMessageText("");
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  if (!ready) return null;

  return (
    <ClientLayout
      activeNav="assigned-specialist"
      title="Assigned Specialist"
      subtitle="All communication stays inside SkillLink Nexus."
    >
      <div className="w-full max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[13fr_7fr] overflow-visible">
          <div className="space-y-6">
            <SpecialistProfileCard onMessage={handleMessageClick} hasConversation={Boolean(activeConversation)} />
            <ConversationCard
              isOpen={isChatOpen}
              messages={activeConversation?.messages ?? []}
              messageText={messageText}
              onMessageChange={setMessageText}
              onSend={handleSend}
              onStart={handleMessageClick}
              inputRef={inputRef}
            />
          </div>

          <div className="space-y-6 overflow-visible">
            <MilestonesCard />
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
