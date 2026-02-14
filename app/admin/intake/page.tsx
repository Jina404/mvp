"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  addProjectMilestone,
  getAccessRequests,
  getProjects,
  initMockDb,
  requestMissingAssets,
  updateProjectBrief,
  updateProjectPricing,
  updateProjectStatus
} from "@/lib/mockDb";

const roleOptions = ["Developer", "Designer", "Marketer", "QA Reviewer", "Project Manager"];

export default function IntakePanelPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [refresh, setRefresh] = useState(0);
  const projects = useMemo(() => getProjects(), [refresh]);
  const accessRequests = useMemo(() => getAccessRequests(), [refresh]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [deliverablesInput, setDeliverablesInput] = useState("");
  const [timelineInput, setTimelineInput] = useState("");
  const [budgetInput, setBudgetInput] = useState("");
  const [quoteInput, setQuoteInput] = useState("");
  const [milestoneTitle, setMilestoneTitle] = useState("");
  const [milestoneDue, setMilestoneDue] = useState("");
  const [milestoneRole, setMilestoneRole] = useState("Developer");
  const [assetsInput, setAssetsInput] = useState("");

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

  const scopingProjects = projects.filter((project) =>
    ["New", "Scoping", "Pending Assignment"].includes(project.status)
  );
  const selected = selectedId ? projects.find((project) => project.id === selectedId) : scopingProjects[0];
  const formatAccessDate = (value: string) => new Date(value).toLocaleDateString();

  useEffect(() => {
    if (!selected) {
      return;
    }
    setDescription(selected.description ?? "");
    setDeliverablesInput((selected.deliverablesChecklist ?? []).join(", "));
    setTimelineInput(selected.estimatedTimeline ?? "");
    setBudgetInput(selected.budgetEstimate ?? "");
    setQuoteInput(selected.quoteAmount ?? "");
  }, [selected]);

  const handleSaveBrief = () => {
    if (!selected) {
      toast({ title: "Select a project", description: "Choose a project to update.", variant: "destructive" });
      return;
    }

    updateProjectBrief(selected.id, {
      description,
      deliverablesChecklist: deliverablesInput
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      requiredAssets: selected.requiredAssets,
      estimatedTimeline: timelineInput,
      budgetEstimate: budgetInput
    });
    updateProjectStatus(selected.id, "Scoping");
    setRefresh((value) => value + 1);
    toast({ title: "Brief saved", description: "Scoping details updated." });
  };

  const handleSavePricing = () => {
    if (!selected) {
      toast({ title: "Select a project", description: "Choose a project to update.", variant: "destructive" });
      return;
    }

    updateProjectPricing(selected.id, {
      quoteAmount: quoteInput,
      budgetEstimate: budgetInput,
      margin: selected.margin
    });
    setRefresh((value) => value + 1);
    toast({ title: "Pricing saved", description: "Quote and margin updated." });
  };

  const handleAddMilestone = () => {
    if (!selected || !milestoneTitle.trim() || !milestoneDue) {
      toast({ title: "Missing milestone details", description: "Add a title and due date.", variant: "destructive" });
      return;
    }

    addProjectMilestone(selected.id, milestoneTitle.trim(), milestoneDue, milestoneRole);
    setMilestoneTitle("");
    setMilestoneDue("");
    setRefresh((value) => value + 1);
    toast({ title: "Milestone added", description: "Milestone added to the timeline." });
  };

  const handleRequestAssets = () => {
    if (!selected || !assetsInput.trim()) {
      toast({ title: "Missing assets list", description: "Add at least one asset to request.", variant: "destructive" });
      return;
    }
    requestMissingAssets(selected.id, assetsInput.split(",").map((item) => item.trim()).filter(Boolean));
    setAssetsInput("");
    setRefresh((value) => value + 1);
    toast({ title: "Assets requested", description: "Client will be notified." });
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">New Project Intake + Scoping</h1>
          <p className="mt-2 text-sm text-slate-500">
            Review AI briefs, scope deliverables, and prepare projects for assignment.
          </p>
        </div>
        <Link className={buttonVariants({ variant: "outline" })} href="/admin">
          Back to Command Center
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-900">Incoming Requests</div>
              <Badge variant="secondary">New</Badge>
            </div>
            <div className="mt-4 space-y-2">
              {scopingProjects.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-4 text-center">
                  <div className="text-sm font-medium text-slate-700">No projects waiting for scoping</div>
                  <div className="mt-1 text-xs text-slate-500">New submissions will appear here.</div>
                </div>
              ) : (
                scopingProjects.map((project) => (
                  <button
                    key={project.id}
                    className={`flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left text-sm transition ${
                      selected?.id === project.id
                        ? "border-purple-200 bg-purple-50/70"
                        : "border-border bg-white hover:bg-slate-50"
                    }`}
                    onClick={() => setSelectedId(project.id)}
                  >
                    <div>
                      <div className="font-medium text-slate-900">{project.title}</div>
                      <div className="text-xs text-slate-500">{project.category} • {project.client}</div>
                    </div>
                    <Badge variant="subtle">{project.status}</Badge>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-900">Access Requests</div>
              <button
                type="button"
                className="text-xs font-semibold text-slate-500 transition hover:text-slate-700"
                onClick={() => setRefresh((value) => value + 1)}
              >
                Refresh
              </button>
            </div>
            <div className="mt-4 space-y-2">
              {accessRequests.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-4 text-center">
                  <div className="text-sm font-medium text-slate-700">No access requests yet</div>
                  <div className="mt-1 text-xs text-slate-500">New submissions will appear here.</div>
                </div>
              ) : (
                accessRequests.map((request) => (
                  <div key={request.id} className="rounded-xl border border-border bg-white px-3 py-3 text-left text-sm">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-slate-900">{request.orgName}</div>
                      <Badge variant="subtle">{request.status}</Badge>
                    </div>
                    <div className="mt-1 text-xs text-slate-500">{request.fullName} • {request.email}</div>
                    <div className="mt-1 text-xs text-slate-500">{request.location} • {formatAccessDate(request.createdAt)}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">Scoping Panel</div>
            <Badge variant="secondary">Brief</Badge>
          </div>
          {!selected ? (
            <div className="mt-6 rounded-xl border border-dashed border-border p-6 text-center">
              <div className="text-sm font-medium text-slate-700">Select a project to scope</div>
              <div className="mt-1 text-xs text-slate-500">Choose a request on the left.</div>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500">AI Project Brief</label>
                <Textarea value={description} onChange={(event) => setDescription(event.target.value)} />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500">Deliverables (comma separated)</label>
                <Textarea value={deliverablesInput} onChange={(event) => setDeliverablesInput(event.target.value)} />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-slate-500">Estimated Timeline</label>
                  <Input value={timelineInput} onChange={(event) => setTimelineInput(event.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500">Budget Estimate</label>
                  <Input value={budgetInput} onChange={(event) => setBudgetInput(event.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500">Price Quote</label>
                  <Input value={quoteInput} onChange={(event) => setQuoteInput(event.target.value)} />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={handleSaveBrief}>Save Brief</Button>
                <Button variant="secondary" onClick={handleSavePricing}>Save Pricing</Button>
              </div>

              <div className="rounded-xl border border-border bg-slate-50/70 p-4">
                <div className="text-xs font-semibold text-slate-600">Assign Milestones</div>
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

              <div className="rounded-xl border border-border bg-slate-50/70 p-4">
                <div className="text-xs font-semibold text-slate-600">Request Missing Assets</div>
                <Input
                  className="mt-2"
                  placeholder="Brand guide, content, data exports"
                  value={assetsInput}
                  onChange={(event) => setAssetsInput(event.target.value)}
                />
                <Button className="mt-3" variant="secondary" onClick={handleRequestAssets}>
                  Request Assets
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
