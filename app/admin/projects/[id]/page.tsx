"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  addProjectMilestone,
  escalateProject,
  getProjectById,
  initMockDb,
  replaceSpecialist,
  runQualityCheck,
  updateMilestoneStatus,
  type MilestoneStatus
} from "@/lib/mockDb";

const milestoneActionMap: Record<MilestoneStatus, MilestoneStatus | null> = {
  Pending: "In Progress",
  "In Progress": "Submitted",
  Submitted: null,
  Approved: null,
  "Changes Requested": "In Progress"
};

export default function AdminProjectDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const projectId = Number(params.id);
  const [refresh, setRefresh] = useState(0);
  const project = useMemo(() => getProjectById(projectId), [projectId, refresh]);
  const [milestoneTitle, setMilestoneTitle] = useState("");
  const [milestoneDue, setMilestoneDue] = useState("");
  const [milestoneRole, setMilestoneRole] = useState("Developer");
  const roleOptions = ["Developer", "Designer", "Marketer", "QA Reviewer", "Project Manager"];

  useEffect(() => {
    const loaded = initMockDb();
    if (loaded) {
      setRefresh((value) => value + 1);
    }
  }, [projectId]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const role = window.localStorage.getItem("skilllink_role");
    if (role !== "admin") {
      router.replace("/");
    }
  }, [router]);

  if (!project) {
    return (
      <div style={{ padding: "2rem" }}>
        <div className="empty-state">
          <div className="empty-title">Project not found</div>
          <Link className="btn btn-secondary" href="/admin/projects" style={{ textDecoration: "none" }}>
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const totalRevisions = project.milestones.reduce((sum, milestone) => sum + milestone.revisions, 0);

  const timeRemaining = () => {
    const due = new Date(project.deadline).getTime();
    const diff = due - Date.now();
    if (diff <= 0) {
      return "Overdue";
    }
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return `${days} days`;
  };

  const handleAdvance = (milestoneId: number, status: MilestoneStatus) => {
    if (!status) {
      return;
    }
    updateMilestoneStatus(projectId, milestoneId, status);
    setRefresh((value) => value + 1);
    toast({ title: "Milestone updated", description: `Status set to ${status}.` });
  };

  const handleQualityCheck = (milestoneId: number) => {
    runQualityCheck(projectId, milestoneId);
    setRefresh((value) => value + 1);
    toast({ title: "QA running", description: "AI QA is reviewing the milestone." });
  };

  const handleEscalate = () => {
    escalateProject(projectId, "Milestone overdue or freelancer unresponsive.");
    setRefresh((value) => value + 1);
    toast({ title: "Escalation sent", description: "The escalation has been logged." });
  };

  const handleReplace = () => {
    replaceSpecialist(projectId);
    setRefresh((value) => value + 1);
    toast({ title: "Replacement started", description: "A new specialist is being assigned." });
  };

  const handleAddMilestone = () => {
    if (!milestoneTitle.trim() || !milestoneDue) {
      toast({ title: "Missing details", description: "Add a title and due date.", variant: "destructive" });
      return;
    }
    addProjectMilestone(projectId, milestoneTitle.trim(), milestoneDue, milestoneRole);
    setMilestoneTitle("");
    setMilestoneDue("");
    setRefresh((value) => value + 1);
    toast({ title: "Milestone added", description: "Milestone added to the timeline." });
  };

  const qaChecklist = project.category === "Website"
    ? ["Requirements met", "Mobile responsiveness", "Accessibility basics", "No broken links", "Assets used correctly"]
    : project.category === "Chatbot"
      ? ["Flow coverage", "Fallback responses", "Tone matches brief", "Edge cases handled"]
      : project.category === "Branding"
        ? ["Design consistency", "Resolution correct", "Assets exported", "Brand rules followed"]
        : ["Requirements met", "Design consistency", "Assets used correctly"];

  return (
    <div className="px-4 pb-12 pt-6 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{project.title}</h1>
          <p className="mt-2 text-sm text-slate-500">
            {project.client} • {project.serviceType} • {project.status}
          </p>
        </div>
        <Link className="btn btn-secondary" href="/admin/projects" style={{ textDecoration: "none" }}>
          Back to Projects
        </Link>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">Delivery Tracking</div>
            <Badge variant="secondary">Ops</Badge>
          </div>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">Milestone Timeline</div>
                <div className="text-sm font-medium text-slate-900">{project.milestones.length} milestones</div>
              </div>
              <Badge variant="subtle">{timeRemaining()} remaining</Badge>
            </div>
            <div>
              <div className="text-xs text-slate-400">Deliverables Uploaded</div>
              <div className="text-sm font-medium text-slate-900">{project.deliverables.length} files</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Client Approval Status</div>
              <div className="text-sm font-medium text-slate-900">
                Pending approvals: {project.milestones.filter((m) => m.status === "Submitted").length}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Revision Count</div>
              <div className="text-sm font-medium text-slate-900">{totalRevisions} revisions logged</div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={handleReplace}>Replace Specialist</Button>
            <Button variant="outline" onClick={handleEscalate}>Escalate Issue</Button>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">Milestones</div>
            <Badge variant="secondary">Timeline</Badge>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">Create Milestone</div>
            <div className="mt-3 grid gap-3 md:grid-cols-[2fr_1fr_1fr]">
              <Input
                placeholder="Milestone title"
                value={milestoneTitle}
                onChange={(event) => setMilestoneTitle(event.target.value)}
              />
              <Input
                type="date"
                value={milestoneDue}
                onChange={(event) => setMilestoneDue(event.target.value)}
              />
              <select
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={milestoneRole}
                onChange={(event) => setMilestoneRole(event.target.value)}
              >
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <Button className="mt-3" variant="secondary" onClick={handleAddMilestone}>
              Add Milestone
            </Button>
          </div>

          <div className="mt-6 space-y-3">
            {project.milestones.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-4 text-center">
                <div className="text-sm font-medium text-slate-700">No milestones yet</div>
                <div className="mt-1 text-xs text-slate-500">Add milestones to start tracking delivery.</div>
              </div>
            ) : (
              project.milestones.map((milestone) => (
                <div key={milestone.id} className="rounded-xl border border-border p-4">
                  <div className="text-sm font-semibold text-slate-900">{milestone.title}</div>
                  <div className="mt-1 text-xs text-slate-500">
                    Due: {milestone.dueDate} • {milestone.status} • Role: {milestone.assignedRole ?? "Unassigned"}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">Revisions: {milestone.revisions}</div>
                  {milestone.qaStatus && (
                    <div className="mt-1 text-xs text-slate-500">
                      QA: {milestone.qaStatus}
                      {milestone.qaIssues && milestone.qaIssues.length > 0 && (
                        <span> • Issues: {milestone.qaIssues.join(", ")}</span>
                      )}
                    </div>
                  )}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {milestoneActionMap[milestone.status] && (
                      <Button size="sm" variant="outline" onClick={() => handleAdvance(milestone.id, milestoneActionMap[milestone.status] as MilestoneStatus)}>
                        Advance
                      </Button>
                    )}
                    {milestone.status === "Submitted" && (
                      <Button size="sm" variant="secondary" onClick={() => handleQualityCheck(milestone.id)}>
                        Run AI QA
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">QA Checklist</div>
            <Badge variant="secondary">Quality</Badge>
          </div>
          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              {qaChecklist.map((item) => (
                <label key={item} className="flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" className="h-4 w-4" />
                  {item}
                </label>
              ))}
            </div>
            <Button
              onClick={() => {
                const firstMilestone = project.milestones[0];
                if (firstMilestone) {
                  handleQualityCheck(firstMilestone.id);
                }
              }}
            >
              QA Verified
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">Deliverables</div>
            <Badge variant="secondary">Files</Badge>
          </div>
          <div className="mt-4 space-y-3">
            {project.deliverables.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-4 text-center">
                <div className="text-sm font-medium text-slate-700">No deliverables uploaded</div>
                <div className="mt-1 text-xs text-slate-500">Deliverables will appear as milestones are submitted.</div>
              </div>
            ) : (
              project.deliverables.map((deliverable) => (
                <div key={deliverable.id} className="flex items-center justify-between gap-3 rounded-xl border border-border p-4">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{deliverable.name}</div>
                    <div className="mt-1 text-xs text-slate-500">{deliverable.version} • {deliverable.uploadedAt}</div>
                  </div>
                  <a className="text-sm font-semibold text-purple-700" href={deliverable.url}>
                    Download
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
