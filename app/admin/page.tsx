"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Sparkles } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { getProjects, initMockDb, runAiAssignment } from "@/lib/mockDb";

export default function AdminLandingPage() {
  const router = useRouter();
  const [refresh, setRefresh] = useState(0);
  const projects = useMemo(() => getProjects(), [refresh]);

  const stats = useMemo(() => {
    const activeProjects = projects.filter((project) => project.status === "Active" || project.status === "In Progress").length;
    const pendingAssignments = projects.filter((project) => project.status === "Pending Assignment" || project.status === "New").length;
    const atRisk = projects.filter((project) => project.riskLevel === "Red").length;
    return { activeProjects, pendingAssignments, atRisk };
  }, [projects]);

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
    if (role === "client") {
      router.replace("/dashboard");
      return;
    }
    if (role !== "admin") {
      router.replace("/");
    }
  }, [router]);

  const handleRunAi = (projectId: number) => {
    runAiAssignment(projectId);
    setRefresh((value) => value + 1);
  };

  const statusLabel = (status: string) => {
    if (status === "Pending Assignment" || status === "New") {
      return "New";
    }
    if (status === "Active" || status === "In Progress") {
      return "In Progress";
    }
    if (status === "In Review" || status === "Review") {
      return "Review";
    }
    return status;
  };

  const riskLabel = (risk: string, deadline: string) => {
    const isDelayed = new Date(deadline) < new Date();
    if (isDelayed) {
      return "Delayed";
    }
    if (risk === "Red") {
      return "At risk";
    }
    return "On track";
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Projects Command Center</h1>
          <p className="mt-2 text-sm text-slate-500">Live portfolio of all projects, delivery status, and risk.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link className={buttonVariants({ variant: "outline" })} href="/admin/intake">
            New Project Intake
          </Link>
          <Link className={buttonVariants({ variant: "outline" })} href="/admin/analytics">
            View Reports
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <div className="text-xs font-medium text-slate-500">Active Projects</div>
          <div className="mt-3 text-3xl font-semibold text-slate-900">{stats.activeProjects}</div>
          <div className="mt-2 text-xs text-slate-500">In delivery</div>
        </div>
        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <div className="text-xs font-medium text-slate-500">Pending Assignments</div>
          <div className="mt-3 text-3xl font-semibold text-slate-900">{stats.pendingAssignments}</div>
          <div className="mt-2 text-xs text-slate-500">Needs matching</div>
        </div>
        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <div className="text-xs font-medium text-slate-500">At Risk</div>
          <div className="mt-3 text-3xl font-semibold text-slate-900">{stats.atRisk}</div>
          <div className="mt-2 text-xs text-rose-500">Needs attention</div>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Project Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assigned Roles</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead>Risk</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7}>
                <div className="flex flex-col items-center gap-2 py-10 text-center">
                  <div className="text-sm font-medium text-slate-700">No projects yet</div>
                  <div className="text-xs text-slate-500">New projects will appear here.</div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium text-slate-900">{project.client}</TableCell>
                <TableCell>{project.category || project.serviceType}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{statusLabel(project.status)}</Badge>
                </TableCell>
                <TableCell>{project.assignedRoles?.join(", ") || "Unassigned"}</TableCell>
                <TableCell>{project.deadline}</TableCell>
                <TableCell>
                  <Badge variant="subtle">{riskLabel(project.riskLevel, project.deadline)}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex items-center gap-2">
                    <Link
                      className={buttonVariants({ variant: "outline", size: "sm" })}
                      href={`/admin/projects/${project.id}`}
                    >
                      View
                    </Link>
                    <Button size="sm" onClick={() => handleRunAi(project.id)}>
                      <Sparkles className="h-4 w-4" />
                      Run AI
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="More actions">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/projects/${project.id}`}>Open workspace</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRunAi(project.id)}>
                          Re-run AI assignment
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
