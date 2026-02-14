"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Tabs from "@/components/Tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  addClientMessage,
  addFeedback,
  addSystemMessage,
  getProjectById,
  initMockDb,
  runQualityCheck,
  updateMilestoneStatus,
  type MilestoneStatus
} from "@/lib/mockDb";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "milestones", label: "Milestones" },
  { id: "deliverables", label: "Deliverables" },
  { id: "messages", label: "Messages" },
  { id: "feedback", label: "Feedback" }
];

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const projectId = Number(params.id);
  const [activeTab, setActiveTab] = useState("overview");
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState("");
  const [rating, setRating] = useState(5);
  const [feedback, setFeedbackText] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const project = useMemo(() => getProjectById(projectId), [projectId, refresh]);

  useEffect(() => {
    const loaded = initMockDb();
    if (loaded) {
      setRefresh((value) => value + 1);
    }
    setIsLoading(false);
  }, [projectId]);

  if (isLoading) {
    return (
      <div className="px-4 pb-12 pt-6 sm:px-6">
        <Skeleton className="h-24" />
        <div className="mt-6 grid gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div style={{ padding: "2rem" }}>
        <div className="empty-state">
          <div className="empty-title">Project not found</div>
          <Link className="btn btn-secondary" href="/dashboard" style={{ textDecoration: "none" }}>
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const handleMilestoneUpdate = (milestoneId: number, status: MilestoneStatus) => {
    updateMilestoneStatus(projectId, milestoneId, status);
    addSystemMessage(projectId, `Milestone updated to ${status}.`);
    setRefresh((value) => value + 1);
    toast({ title: "Milestone updated", description: `Status set to ${status}.` });
  };

  const handleSendMessage = () => {
    if (!message.trim()) {
      setErrors((prev) => ({ ...prev, message: "Message cannot be empty." }));
      toast({ title: "Message required", description: "Please type a message.", variant: "destructive" });
      return;
    }

    addClientMessage(projectId, message.trim(), attachment ? [attachment] : []);
    setMessage("");
    setAttachment("");
    setRefresh((value) => value + 1);
    setErrors((prev) => ({ ...prev, message: "" }));
    toast({ title: "Message sent", description: "Your update was sent to the Project Desk." });
  };

  const handleQualityCheck = (milestoneId: number) => {
    runQualityCheck(projectId, milestoneId);
    setRefresh((value) => value + 1);
    toast({ title: "QA running", description: "AI QA is reviewing the milestone." });
  };

  const roleLabel = (role: string) => {
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
    return "Developer";
  };

  const handleSaveFeedback = () => {
    if (!feedback.trim()) {
      setErrors((prev) => ({ ...prev, feedback: "Please add feedback before submitting." }));
      toast({ title: "Feedback required", description: "Please add feedback text.", variant: "destructive" });
      return;
    }

    addFeedback(projectId, rating, feedback.trim());
    setFeedbackText("");
    setRefresh((value) => value + 1);
    setErrors((prev) => ({ ...prev, feedback: "" }));
    toast({ title: "Feedback submitted", description: "Thanks for sharing your feedback." });
  };

  return (
    <div className="px-4 pb-12 pt-6 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{project.title}</h1>
          <p className="mt-2 text-sm text-slate-500">
            Status: {project.status} • Deadline: {project.deadline}
          </p>
        </div>
        <Link className="btn btn-secondary" href="/dashboard" style={{ textDecoration: "none" }}>
          Back to Dashboard
        </Link>
      </div>

      <div className="mt-6">
        <Tabs tabs={tabs} activeId={activeTab} onChange={setActiveTab} />
      </div>

      {activeTab === "overview" && (
        <div className="mt-6 rounded-2xl border border-border bg-white p-6 shadow-sm">
          <div className="project-meta">
            <div>
              <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>Assigned Specialist</div>
              <div style={{ fontWeight: 600 }}>{project.assignedSpecialistRole}</div>
            </div>
            <div>
              <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>Service Type</div>
              <div style={{ fontWeight: 600 }}>{project.serviceType}</div>
            </div>
          </div>

          <div style={{ margin: "1rem 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span>Progress</span>
              <span style={{ fontWeight: 600 }}>
                {["Pending Assignment", "New", "Scoping"].includes(project.status) ? "0%" : "65%"}
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: ["Pending Assignment", "New", "Scoping"].includes(project.status) ? "5%" : "65%" }}
              ></div>
            </div>
          </div>

          <div className="project-meta">
            <div>
              <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>Budget Range</div>
              <div style={{ fontWeight: 600 }}>{project.budgetRange}</div>
            </div>
            <div>
              <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>Key Dates</div>
              <div style={{ fontWeight: 600 }}>Kickoff: {project.milestones[0]?.dueDate ?? "TBD"}</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "milestones" && (
        <div className="mt-6">
          {isLoading ? (
            <Skeleton className="h-36" />
          ) : (
            <>
              <div className="sm:hidden space-y-3">
                {project.milestones.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border bg-white/70 p-8 text-center">
                    <div className="text-sm font-semibold text-slate-800">No milestones yet</div>
                    <div className="mt-2 text-xs text-slate-500">SkillLink Nexus will add the delivery plan soon.</div>
                  </div>
                ) : (
                  project.milestones.map((milestone) => (
                    <div key={milestone.id} className="rounded-2xl border border-border bg-white p-4 shadow-sm">
                      <div className="text-sm font-semibold text-slate-900">{milestone.title}</div>
                      <div className="mt-1 text-xs text-slate-500">Due {milestone.dueDate}</div>
                      <Badge className="mt-2" variant="subtle">{milestone.status}</Badge>
                      {milestone.status === "Submitted" ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Button size="sm" onClick={() => handleMilestoneUpdate(milestone.id, "Approved")}>Approve</Button>
                          <Button size="sm" variant="outline" onClick={() => handleMilestoneUpdate(milestone.id, "Changes Requested")}>
                            Request changes
                          </Button>
                          <Button size="sm" variant="secondary" onClick={() => handleQualityCheck(milestone.id)}>
                            Run AI QA
                          </Button>
                        </div>
                      ) : (
                        <div className="mt-2 text-xs text-slate-500">No action</div>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="hidden sm:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Milestone</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {project.milestones.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4}>
                          <div className="flex flex-col items-center gap-2 py-10 text-center">
                            <div className="text-sm font-medium text-slate-700">No milestones yet</div>
                            <div className="text-xs text-slate-500">SkillLink Nexus will add the delivery plan soon.</div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      project.milestones.map((milestone) => (
                        <TableRow key={milestone.id}>
                          <TableCell>{milestone.title}</TableCell>
                          <TableCell>{milestone.dueDate}</TableCell>
                          <TableCell>
                            <Badge variant="subtle">{milestone.status}</Badge>
                          </TableCell>
                          <TableCell>
                            {milestone.status === "Submitted" ? (
                              <div className="flex flex-wrap gap-2">
                                <Button size="sm" onClick={() => handleMilestoneUpdate(milestone.id, "Approved")}>
                                  Approve
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleMilestoneUpdate(milestone.id, "Changes Requested")}>
                                  Request changes
                                </Button>
                                <Button size="sm" variant="secondary" onClick={() => handleQualityCheck(milestone.id)}>
                                  Run AI QA
                                </Button>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-500">No action</span>
                            )}
                            {milestone.qaStatus && (
                              <div className="mt-2 text-xs text-slate-500">
                                QA: {milestone.qaStatus}
                                {milestone.qaIssues && milestone.qaIssues.length > 0 && (
                                  <div>Issues: {milestone.qaIssues.join(", ")}</div>
                                )}
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === "deliverables" && (
        <div className="mt-6">
          <div className="sm:hidden space-y-3">
            {project.deliverables.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-white/70 p-8 text-center">
                <div className="text-sm font-semibold text-slate-800">No deliverables yet</div>
                <div className="mt-2 text-xs text-slate-500">Files will appear once milestones are submitted.</div>
              </div>
            ) : (
              project.deliverables.map((deliverable) => (
                <div key={deliverable.id} className="rounded-2xl border border-border bg-white p-4 shadow-sm">
                  <div className="text-sm font-semibold text-slate-900">{deliverable.name}</div>
                  <div className="mt-1 text-xs text-slate-500">Version {deliverable.version}</div>
                  <div className="mt-2 text-xs text-slate-500">Uploaded {deliverable.uploadedAt}</div>
                  <a className="mt-3 inline-flex text-sm font-semibold text-purple-700" href={deliverable.url}>
                    Download
                  </a>
                </div>
              ))
            )}
          </div>

          <div className="hidden sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Deliverable</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead>Link</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {project.deliverables.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <div className="flex flex-col items-center gap-2 py-10 text-center">
                        <div className="text-sm font-medium text-slate-700">No deliverables yet</div>
                        <div className="text-xs text-slate-500">Files will appear once milestones are submitted.</div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  project.deliverables.map((deliverable) => (
                    <TableRow key={deliverable.id}>
                      <TableCell>{deliverable.name}</TableCell>
                      <TableCell>{deliverable.version}</TableCell>
                      <TableCell>{deliverable.uploadedAt}</TableCell>
                      <TableCell>
                        <a className="font-semibold text-purple-700" href={deliverable.url}>
                          Download
                        </a>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {activeTab === "messages" && (
        <div className="chat-wrapper">
          <div className="chat-header">SkillLink Nexus Project Desk</div>
          <div className="chat-body">
            {project.messages.length === 0 ? (
              <div className="empty-state">
                <div className="empty-title">No messages yet</div>
                <div className="empty-subtitle">Start a conversation with the Project Desk.</div>
              </div>
            ) : (
              project.messages.map((item) => (
                <div
                  key={item.id}
                  className={`chat-message ${item.senderType === "specialist" ? "project_desk" : item.senderType}`}
                >
                  <div className="chat-label">
                    {item.senderType === "client"
                      ? "You"
                      : item.senderType === "system"
                        ? "System"
                        : item.senderType === "project_desk"
                            ? "Project Manager (SkillLink Nexus)"
                            : item.roleLabel ?? roleLabel(project.assignedSpecialistRole)}
                  </div>
                  <div className="chat-bubble">{item.body}</div>
                  {item.attachments.length > 0 && (
                    <div className="chat-attachments">Attachments: {item.attachments.join(", ")}</div>
                  )}
                  <div className="chat-time">{item.createdAt}</div>
                </div>
              ))
            )}
          </div>

          <div className="chat-input sticky bottom-0 mt-4 bg-white/90 p-3 backdrop-blur">
            <Textarea
              placeholder="Type a message for the Project Desk..."
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
            {errors.message ? <p className="mt-1 text-xs text-rose-600">{errors.message}</p> : null}
            <Input
              className="mt-3"
              placeholder="Attachment link (optional)"
              value={attachment}
              onChange={(event) => setAttachment(event.target.value)}
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <Button onClick={handleSendMessage}>Send</Button>
              <Button variant="outline" onClick={() => setMessage("")}>Clear</Button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "feedback" && (
        <div className="mt-6 rounded-2xl border border-border bg-white p-6 shadow-sm">
          <div style={{ marginBottom: "1rem" }}>
            <div className="project-title">Share feedback</div>
            <p style={{ color: "#6b7280", marginTop: "0.5rem" }}>
              Tell us how the delivery is going and what we can improve.
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">Rating</label>
            <select
              className="form-select"
              value={rating}
              onChange={(event) => setRating(Number(event.target.value))}
            >
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value} - {value === 5 ? "Excellent" : value === 4 ? "Good" : value === 3 ? "Average" : value === 2 ? "Needs work" : "Poor"}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Feedback</label>
            <Textarea
              placeholder="Share your thoughts..."
              value={feedback}
              onChange={(event) => setFeedbackText(event.target.value)}
            />
            {errors.feedback ? <p className="mt-1 text-xs text-rose-600">{errors.feedback}</p> : null}
          </div>

          <div className="form-actions">
            <Button onClick={handleSaveFeedback}>Submit Feedback</Button>
          </div>
        </div>
      )}
    </div>
  );
}
