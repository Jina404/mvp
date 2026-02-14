"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  addProjectDeskMessage,
  escalateProject,
  forwardToSpecialist,
  getFreelancerInbox,
  getProjects,
  getRelayInbox,
  initMockDb,
  sendDeskToSpecialist
} from "@/lib/mockDb";

export default function RelayDeskPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [refresh, setRefresh] = useState(0);
  const relayInbox = useMemo(() => getRelayInbox(), [refresh]);
  const projects = useMemo(() => getProjects(), [refresh]);
  const freelancerInbox = useMemo(() => getFreelancerInbox(), [refresh]);
  const [replyText, setReplyText] = useState("");
  const [replyProjectId, setReplyProjectId] = useState<number | "">("");
  const [chatProjectId, setChatProjectId] = useState<number | "">("");
  const [chatMessage, setChatMessage] = useState("");
  const templates = [
    "Thanks for the update. We are reviewing and will respond within 24 hours.",
    "We are waiting on client assets to proceed. Please share the files.",
    "Your milestone is under review. Expect feedback by end of day.",
    "We approved the milestone. Proceed to the next phase."
  ];

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

  const overdueAlerts = projects.flatMap((project) =>
    project.milestones
      .filter((milestone) => new Date(milestone.dueDate) < new Date() && milestone.status !== "Approved")
      .map((milestone) => ({ project, milestone }))
  );

  const specialistMessages = projects.flatMap((project) =>
    project.messages.filter((message) => message.senderType === "specialist").map((message) => ({ project, message }))
  );

  const handleForward = (projectId: number, messageId: number) => {
    forwardToSpecialist(projectId, messageId);
    setRefresh((value) => value + 1);
    toast({ title: "Forwarded", description: "Message sent to the specialist." });
  };

  const handleReplyClient = (projectId: number) => {
    if (!replyText.trim()) {
      toast({ title: "Message required", description: "Draft a reply first.", variant: "destructive" });
      return;
    }
    addProjectDeskMessage(projectId, replyText.trim(), []);
    setReplyText("");
    setReplyProjectId("");
    setRefresh((value) => value + 1);
    toast({ title: "Reply sent", description: "Client will receive the update." });
  };

  const handleRequestUpdate = (projectId: number) => {
    sendDeskToSpecialist(projectId, "Please share a status update for this project.", []);
    setRefresh((value) => value + 1);
    toast({ title: "Update requested", description: "Specialist has been notified." });
  };

  const handleSendPmMessage = () => {
    if (!chatProjectId || !chatMessage.trim()) {
      toast({ title: "Message required", description: "Select a project and type a message.", variant: "destructive" });
      return;
    }
    addProjectDeskMessage(chatProjectId, chatMessage.trim(), []);
    setChatMessage("");
    setRefresh((value) => value + 1);
    toast({ title: "Message sent", description: "Sent as Project Manager." });
  };

  const handleEscalate = (projectId: number) => {
    escalateProject(projectId, "Overdue milestone flagged by system.");
    setRefresh((value) => value + 1);
    toast({ title: "Escalated", description: "Issue logged for Ops review." });
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Project Desk Inbox</h1>
          <p className="mt-2 text-sm text-slate-500">Relay communications without revealing client identity.</p>
        </div>
        <Link className={buttonVariants({ variant: "outline" })} href="/admin">
          Back to Ops Overview
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">Client Messages</div>
            <Badge variant="secondary">Inbox</Badge>
          </div>
          <div className="mt-4 space-y-3">
            {relayInbox.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-4 text-center">
                <div className="text-sm font-medium text-slate-700">No pending client messages</div>
                <div className="mt-1 text-xs text-slate-500">All client updates have been forwarded.</div>
              </div>
            ) : (
              relayInbox.map(({ project, message }) => (
                <div key={message.id} className="rounded-xl border border-border p-4">
                  <div className="text-sm font-semibold text-slate-900">{project.title}</div>
                  <div className="mt-1 text-xs text-slate-500">Client context: {project.clientContext}</div>
                  <div className="mt-3 text-sm text-slate-600">{message.body}</div>
                  <Button className="mt-3" onClick={() => handleForward(project.id, message.id)}>
                    Forward to Specialist
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">Specialist Messages</div>
            <Badge variant="secondary">Updates</Badge>
          </div>
          <div className="mt-4 space-y-3">
            {specialistMessages.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-4 text-center">
                <div className="text-sm font-medium text-slate-700">No specialist updates yet</div>
                <div className="mt-1 text-xs text-slate-500">Request updates when needed.</div>
              </div>
            ) : (
              specialistMessages.map(({ project, message }) => (
                <div key={message.id} className="rounded-xl border border-border p-4">
                  <div className="text-sm font-semibold text-slate-900">{project.title}</div>
                  <div className="mt-1 text-xs text-slate-500">From Specialist</div>
                  <div className="mt-3 text-sm text-slate-600">{message.body}</div>
                  <Button className="mt-3" variant="secondary" onClick={() => handleRequestUpdate(project.id)}>
                    Request update
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">Freelancer Inbox (Project Desk)</div>
            <Badge variant="secondary">Relay</Badge>
          </div>
          <div className="mt-4 space-y-3">
            {freelancerInbox.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-4 text-center">
                <div className="text-sm font-medium text-slate-700">No relayed messages</div>
                <div className="mt-1 text-xs text-slate-500">Forwarded messages appear here with identity hidden.</div>
              </div>
            ) : (
              freelancerInbox.map((item) => (
                <div key={item.id} className="rounded-xl border border-border p-4">
                  <div className="text-sm font-semibold text-slate-900">{item.senderLabel}</div>
                  <div className="mt-1 text-xs text-slate-500">Project #{item.projectId}</div>
                  <div className="mt-3 text-sm text-slate-600">{item.body}</div>
                  <Badge className="mt-3" variant="subtle">Relayed</Badge>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">System Alerts</div>
            <Badge variant="secondary">Risk</Badge>
          </div>
          <div className="mt-4 space-y-3">
            {overdueAlerts.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-4 text-center">
                <div className="text-sm font-medium text-slate-700">No overdue milestones</div>
                <div className="mt-1 text-xs text-slate-500">Delivery is on track.</div>
              </div>
            ) : (
              overdueAlerts.map(({ project, milestone }) => (
                <div key={`${project.id}-${milestone.id}`} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-4">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{project.title}</div>
                    <div className="mt-1 text-xs text-slate-500">Milestone overdue: {milestone.title}</div>
                  </div>
                  <Button variant="secondary" onClick={() => handleEscalate(project.id)}>
                    Escalate
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">Reply to Client</div>
            <Badge variant="secondary">Desk</Badge>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {templates.map((template) => (
              <Button key={template} variant="outline" size="sm" onClick={() => setReplyText(template)}>
                {template.slice(0, 24)}...
              </Button>
            ))}
          </div>
          <select
            className="mt-3 h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={replyProjectId}
            onChange={(event) => setReplyProjectId(event.target.value ? Number(event.target.value) : "")}
          >
            <option value="">Select project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>
          <Textarea
            className="mt-3"
            placeholder="Draft an update for the client..."
            value={replyText}
            onChange={(event) => setReplyText(event.target.value)}
          />
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              onClick={() => {
                if (replyProjectId) {
                  handleReplyClient(replyProjectId);
                }
              }}
            >
              Send to Client
            </Button>
            <Button variant="outline" onClick={() => setReplyText("")}>Clear</Button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-900">Project Chats</div>
          <Badge variant="secondary">PM</Badge>
        </div>
        <select
          className="mt-4 h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          value={chatProjectId}
          onChange={(event) => setChatProjectId(event.target.value ? Number(event.target.value) : "")}
        >
          <option value="">Select project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.title}
            </option>
          ))}
        </select>
        {chatProjectId ? (
          <div className="mt-4">
            <div className="max-h-[280px] space-y-3 overflow-y-auto rounded-xl border border-border bg-slate-50 p-4">
              {projects
                .find((project) => project.id === chatProjectId)
                ?.messages.map((message) => (
                  <div key={message.id} className="rounded-lg bg-white p-3 shadow-sm">
                    <div className="text-xs font-semibold text-slate-500">
                      {message.senderType === "project_desk"
                        ? "Project Manager"
                        : message.senderType === "specialist"
                          ? message.roleLabel ?? "Specialist"
                          : message.senderType}
                    </div>
                    <div className="mt-1 text-sm text-slate-700">{message.body}</div>
                  </div>
                ))}
            </div>
            <Textarea
              className="mt-3"
              placeholder="Send message as Project Manager..."
              value={chatMessage}
              onChange={(event) => setChatMessage(event.target.value)}
            />
            <Button className="mt-3" onClick={handleSendPmMessage}>
              Send as Project Manager
            </Button>
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-dashed border-border p-4 text-center">
            <div className="text-sm font-medium text-slate-700">Select a project to view chat</div>
          </div>
        )}
      </div>
    </div>
  );
}
