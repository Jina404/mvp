"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  extendProjectDeadline,
  getProjects,
  initMockDb,
  markSpecialistUnreliable,
  replaceSpecialist,
  sendWarningToFreelancer
} from "@/lib/mockDb";

export default function EscalationsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [refresh, setRefresh] = useState(0);
  const projects = useMemo(() => getProjects(), [refresh]);
  const [deadlineInputs, setDeadlineInputs] = useState<Record<number, string>>({});

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

  const flagged = projects.filter((project) => {
    const overdue = new Date(project.deadline) < new Date();
    return overdue || project.riskLevel === "Red" || project.riskLevel === "Yellow";
  });

  const handleWarning = (projectId: number) => {
    sendWarningToFreelancer(projectId, "Please provide an update within 24 hours.");
    setRefresh((value) => value + 1);
    toast({ title: "Warning sent", description: "Freelancer notified." });
  };

  const handleReassign = (projectId: number) => {
    replaceSpecialist(projectId);
    setRefresh((value) => value + 1);
    toast({ title: "Reassignment started", description: "Searching for replacement." });
  };

  const handleExtend = (projectId: number) => {
    const deadline = deadlineInputs[projectId];
    if (!deadline) {
      toast({ title: "Deadline required", description: "Select a new date.", variant: "destructive" });
      return;
    }
    extendProjectDeadline(projectId, deadline);
    setRefresh((value) => value + 1);
    toast({ title: "Deadline extended", description: "Project timeline updated." });
  };

  const handleUnreliable = (projectId: number) => {
    markSpecialistUnreliable(projectId);
    setRefresh((value) => value + 1);
    toast({ title: "Marked unreliable", description: "Specialist flagged." });
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Escalation + Replacement</h1>
          <p className="mt-2 text-sm text-slate-500">Monitor delayed projects and take action quickly.</p>
        </div>
        <Link className={buttonVariants({ variant: "outline" })} href="/admin">
          Back to Command Center
        </Link>
      </div>

      {flagged.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-white/70 p-8 text-center">
          <div className="text-sm font-semibold text-slate-800">No escalations right now</div>
          <div className="mt-2 text-xs text-slate-500">All projects are on track.</div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {flagged.map((project) => (
            <div key={project.id} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold text-slate-900">{project.title}</div>
                  <div className="mt-1 text-xs text-slate-500">Client: {project.client}</div>
                </div>
                <Badge
                  className={
                    project.riskLevel === "Red"
                      ? "bg-rose-100 text-rose-700"
                      : "bg-slate-100 text-slate-700"
                  }
                >
                  {project.riskLevel}
                </Badge>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs text-slate-400">Assigned Role</div>
                    <div className="font-medium text-slate-900">{project.assignedSpecialistRole}</div>
                  </div>
                  <Badge variant="subtle">{project.assignedSpecialistName ?? "Unassigned"}</Badge>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs text-slate-400">Deadline</div>
                    <div className="font-medium text-slate-900">{project.deadline}</div>
                  </div>
                  <Badge variant="subtle">Needs attention</Badge>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Button onClick={() => handleWarning(project.id)}>Send Warning</Button>
                <Button variant="secondary" onClick={() => handleReassign(project.id)}>
                  Reassign Role
                </Button>
                <Button variant="outline" onClick={() => handleUnreliable(project.id)}>
                  Mark Unreliable
                </Button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Input
                  type="date"
                  value={deadlineInputs[project.id] ?? ""}
                  onChange={(event) =>
                    setDeadlineInputs((prev) => ({ ...prev, [project.id]: event.target.value }))
                  }
                />
                <Button variant="secondary" onClick={() => handleExtend(project.id)}>
                  Extend Deadline
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
