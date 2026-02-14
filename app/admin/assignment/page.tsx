"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  assignProjectToSpecialist,
  getAssignmentRequests,
  getProjects,
  getSpecialists,
  initMockDb,
  removeAssignmentRequest,
  runAiAssignment
} from "@/lib/mockDb";

export default function AssignmentDeskPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [refresh, setRefresh] = useState(0);
  const requests = useMemo(() => getAssignmentRequests(), [refresh]);
  const specialists = useMemo(() => getSpecialists(), [refresh]);
  const projects = useMemo(() => getProjects(), [refresh]);

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

  const handleAssign = (projectId: number, specialistName: string) => {
    const specialist = specialists.find((item) => item.name === specialistName);
    if (!specialist) {
      return;
    }
    assignProjectToSpecialist(projectId, specialist.name, specialist.role);
    setRefresh((value) => value + 1);
  };

  const handleReject = (id: number) => {
    removeAssignmentRequest(id);
    setRefresh((value) => value + 1);
  };

  const handleRunAi = (projectId: number) => {
    runAiAssignment(projectId);
    setRefresh((value) => value + 1);
    toast({ title: "AI assignment refreshed", description: "Recommendations updated." });
  };

  const handleClarification = () => {
    toast({ title: "Clarification requested", description: "We will follow up with the client." });
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Assignment Desk</h1>
          <p className="mt-2 text-sm text-slate-500">
            AI recommends, operations confirms. Assign specialists confidently.
          </p>
        </div>
        <Link className={buttonVariants({ variant: "outline" })} href="/admin">
          Back to Ops Overview
        </Link>
      </div>

      {requests.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-white/70 p-8 text-center">
          <div className="text-sm font-semibold text-slate-800">No pending assignments</div>
          <div className="mt-2 text-xs text-slate-500">All incoming requests have been processed.</div>
        </div>
      ) : (
        <div className="space-y-6">
          {requests.map((request) => {
            const project = projects.find((item) => item.id === request.projectId);
            return (
              <div key={request.id} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-lg font-semibold text-slate-900">{project?.title ?? "New Request"}</div>
                    <div className="text-xs text-slate-500">Assignment summary</div>
                  </div>
                  <Badge variant="secondary">AI</Badge>
                </div>

                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-xs text-slate-400">Service Type</div>
                      <div className="font-medium text-slate-900">{request.serviceType}</div>
                    </div>
                    <Badge variant="subtle">{request.budgetRange}</Badge>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-xs text-slate-400">Deadline</div>
                      <div className="font-medium text-slate-900">{request.deadline}</div>
                    </div>
                    <Badge variant="subtle">Complexity {request.complexityScore}</Badge>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-xs text-slate-400">Recommended Specialist</div>
                      <div className="font-medium text-slate-900">{request.recommendedSpecialist}</div>
                    </div>
                    <Badge variant="secondary">Confidence {request.confidence}%</Badge>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Why this match</div>
                    <div className="mt-1 text-sm text-slate-600">
                      {(request.recommendationReasons ?? []).join(" • ") || "AI rationale pending"}
                    </div>
                    <div className="mt-2 text-xs text-slate-500">{request.workloadSummary ?? "Workload pending"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Recommended Team</div>
                    <div className="mt-1 text-sm text-slate-600">
                      {(request.recommendedTeam ?? [])
                        .map((team) => `${team.role}: ${team.candidates.join(" / ")}`)
                        .join(" | ") || "Awaiting AI recommendations"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Alternatives</div>
                    <div className="mt-1 text-sm text-slate-600">{request.alternativeSpecialists.join(", ")}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">AI Summary</div>
                    <div className="mt-1 text-sm text-slate-600">{request.summary}</div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <Button onClick={() => handleRunAi(request.projectId)}>Run AI Assignment</Button>
                  <Button onClick={() => handleAssign(request.projectId, request.recommendedSpecialist)}>
                    Assign
                  </Button>
                  <Button variant="outline" onClick={handleClarification}>Request clarification</Button>
                  <Button variant="destructive" onClick={() => handleReject(request.id)}>
                    Reject
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
