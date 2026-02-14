"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getProjects, initMockDb, runAiAssignment } from "@/lib/mockDb";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

export default function AdminProjectsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    status: "",
    serviceType: "",
    dueDate: "",
    risk: "",
    specialist: "",
    client: ""
  });
  const [refresh, setRefresh] = useState(0);
  const projects = useMemo(() => getProjects(), [refresh]);

  useEffect(() => {
    const loaded = initMockDb();
    if (loaded) {
      setRefresh((value) => value + 1);
    }
  }, []);

  const handleRunAi = (projectId: number) => {
    runAiAssignment(projectId);
    setRefresh((value) => value + 1);
    toast({ title: "AI assignment refreshed", description: "Recommendations updated." });
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const role = window.localStorage.getItem("skilllink_role");
    if (role !== "admin") {
      router.replace("/");
    }
  }, [router]);

  const filtered = projects.filter((project) => {
    if (filters.status) {
      const status = project.status;
      const normalized =
        filters.status === "In Progress" ? ["In Progress", "Active"]
        : filters.status === "Review" ? ["Review", "In Review"]
        : filters.status === "New" ? ["New", "Pending Assignment"]
        : [filters.status];
      if (!normalized.includes(status)) {
        return false;
      }
    }
    if (filters.serviceType && project.serviceType !== filters.serviceType) {
      return false;
    }
    if (filters.risk && project.riskLevel !== filters.risk) {
      return false;
    }
    if (filters.specialist && project.assignedSpecialistRole !== filters.specialist) {
      return false;
    }
    if (filters.client && project.client !== filters.client) {
      return false;
    }
    if (filters.dueDate && project.deadline !== filters.dueDate) {
      return false;
    }
    return true;
  });

  return (
    <div className="mt-8 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Projects Control Board</h1>
          <p className="mt-2 text-sm text-slate-500">Filter delivery status, risk, and specialist allocation.</p>
        </div>
        <Link className={buttonVariants({ variant: "outline" })} href="/admin">
          Back to Ops Overview
        </Link>
      </div>

      <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
          <select className="form-select" value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}>
            <option value="">Status</option>
            <option>New</option>
            <option>Scoping</option>
            <option>Pending Assignment</option>
            <option>In Progress</option>
            <option>Active</option>
            <option>Review</option>
            <option>In Review</option>
            <option>Completed</option>
          </select>
          <select
            className="form-select"
            value={filters.serviceType}
            onChange={(event) => setFilters({ ...filters, serviceType: event.target.value })}
          >
            <option value="">Service Type</option>
            {[...new Set(projects.map((project) => project.serviceType))].map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
          <select className="form-select" value={filters.risk} onChange={(event) => setFilters({ ...filters, risk: event.target.value })}>
            <option value="">Risk Level</option>
            <option>Green</option>
            <option>Yellow</option>
            <option>Red</option>
          </select>
          <select
            className="form-select"
            value={filters.specialist}
            onChange={(event) => setFilters({ ...filters, specialist: event.target.value })}
          >
            <option value="">Assigned Specialist</option>
            {[...new Set(projects.map((project) => project.assignedSpecialistRole))].map((role) => (
              <option key={role}>{role}</option>
            ))}
          </select>
          <select className="form-select" value={filters.client} onChange={(event) => setFilters({ ...filters, client: event.target.value })}>
            <option value="">Client</option>
            {[...new Set(projects.map((project) => project.client))].map((client) => (
              <option key={client}>{client}</option>
            ))}
          </select>
          <Input
            type="date"
            value={filters.dueDate}
            onChange={(event) => setFilters({ ...filters, dueDate: event.target.value })}
          />
        </div>
      </div>

      <div className="sm:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-white/70 p-8 text-center">
            <div className="text-sm font-semibold text-slate-800">No projects match filters</div>
            <div className="mt-2 text-xs text-slate-500">Adjust filters to find projects.</div>
          </div>
        ) : (
          filtered.map((project) => (
            <div key={project.id} className="rounded-2xl border border-border bg-white p-4 shadow-sm">
              <div className="text-sm font-semibold text-slate-900">{project.title}</div>
              <div className="mt-1 text-xs text-slate-500">{project.category || project.serviceType}</div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <Badge variant="subtle">{project.riskLevel}</Badge>
                <div className="text-xs text-slate-500">Deadline {project.deadline}</div>
              </div>
              <div className="mt-3 text-xs text-slate-500">Assigned: {project.assignedSpecialistRole}</div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link className={buttonVariants({ variant: "outline", size: "sm" })} href={`/admin/projects/${project.id}`}>
                  View
                </Link>
                <Button size="sm" onClick={() => handleRunAi(project.id)}>
                  Run AI Assignment
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="hidden sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Assigned Specialist</TableHead>
              <TableHead>Next Milestone</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead>Last Update</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <div className="flex flex-col items-center gap-2 py-10 text-center">
                    <div className="text-sm font-medium text-slate-700">No projects match filters</div>
                    <div className="text-xs text-slate-500">Adjust filters to find projects.</div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <div className="font-medium text-slate-900">{project.title}</div>
                    <div className="text-xs text-slate-500">{project.category || project.serviceType}</div>
                  </TableCell>
                  <TableCell>{project.assignedSpecialistRole}</TableCell>
                  <TableCell>{project.milestones[0]?.title ?? "TBD"}</TableCell>
                  <TableCell>{project.deadline}</TableCell>
                  <TableCell>
                    <Badge variant="subtle">{project.riskLevel}</Badge>
                  </TableCell>
                  <TableCell>{project.lastUpdate}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Link className={buttonVariants({ variant: "outline", size: "sm" })} href={`/admin/projects/${project.id}`}>
                        View
                      </Link>
                      <Button size="sm" onClick={() => handleRunAi(project.id)}>
                        Run AI Assignment
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
