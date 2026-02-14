"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  getAccessRequests,
  getProjects,
  getSpecialists,
  initMockDb,
  updateAccessRequestStatus
} from "@/lib/mockDb";

const ACTIVE_PROJECT_STATUSES = ["Active", "In Progress"];

export default function AdminUsersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [refresh, setRefresh] = useState(0);

  const specialists = useMemo(() => getSpecialists(), [refresh]);
  const projects = useMemo(() => getProjects(), [refresh]);
  const accessRequests = useMemo(() => getAccessRequests(), [refresh]);

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

  const activeFreelancers = specialists.filter(
    (specialist) => specialist.availability !== "Paused" && specialist.verificationStatus !== "Rejected"
  );

  const activeClients = useMemo(() => {
    const map = new Map<
      string,
      { name: string; activeProjects: number; lastUpdate: string; latestStatus: string }
    >();

    projects
      .filter((project) => ACTIVE_PROJECT_STATUSES.includes(project.status))
      .forEach((project) => {
        const existing = map.get(project.client);
        if (!existing) {
          map.set(project.client, {
            name: project.client,
            activeProjects: 1,
            lastUpdate: project.lastUpdate,
            latestStatus: project.status
          });
          return;
        }
        map.set(project.client, {
          ...existing,
          activeProjects: existing.activeProjects + 1,
          lastUpdate: project.lastUpdate > existing.lastUpdate ? project.lastUpdate : existing.lastUpdate,
          latestStatus: project.status
        });
      });

    return Array.from(map.values());
  }, [projects]);

  const handleAccessDecision = (id: number, status: "Accepted" | "Rejected") => {
    updateAccessRequestStatus(id, status);
    setRefresh((value) => value + 1);
    toast({
      title: `Request ${status.toLowerCase()}`,
      description: `Access request marked as ${status.toLowerCase()}.`
    });
  };

  const formatDate = (value: string) => new Date(value).toLocaleDateString();

  return (
    <div className="mt-8 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Users</h1>
          <p className="mt-2 text-sm text-slate-500">
            Active freelancers, active clients, and access requests.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="text-sm font-semibold text-slate-500 transition hover:text-slate-700"
            onClick={() => setRefresh((value) => value + 1)}
          >
            Refresh
          </button>
          <Link className={buttonVariants({ variant: "outline" })} href="/admin">
            Back to Command Center
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">Active Freelancers</div>
            <Badge variant="secondary">{activeFreelancers.length}</Badge>
          </div>
          <div className="mt-4 space-y-3">
            {activeFreelancers.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-4 text-center">
                <div className="text-sm font-medium text-slate-700">No active freelancers</div>
                <div className="mt-1 text-xs text-slate-500">Paused profiles appear when reactivated.</div>
              </div>
            ) : (
              activeFreelancers.map((freelancer) => (
                <div key={freelancer.id} className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{freelancer.name}</div>
                    <div className="text-xs text-slate-500">{freelancer.role}</div>
                  </div>
                  <Badge
                    className={
                      freelancer.availability === "Available"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-700"
                    }
                  >
                    {freelancer.availability}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">Active Clients</div>
            <Badge variant="secondary">{activeClients.length}</Badge>
          </div>
          <div className="mt-4 space-y-3">
            {activeClients.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-4 text-center">
                <div className="text-sm font-medium text-slate-700">No active clients</div>
                <div className="mt-1 text-xs text-slate-500">Clients show when projects are active.</div>
              </div>
            ) : (
              activeClients.map((client) => (
                <div key={client.name} className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{client.name}</div>
                    <div className="text-xs text-slate-500">{client.activeProjects} active project(s)</div>
                    <div className="text-xs text-slate-400">Last update {client.lastUpdate}</div>
                  </div>
                  <Badge variant="subtle">{client.latestStatus}</Badge>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-900">Request Access</div>
          <Badge variant="secondary">{accessRequests.length}</Badge>
        </div>
        <div className="mt-4 space-y-3">
          {accessRequests.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-4 text-center">
              <div className="text-sm font-medium text-slate-700">No access requests yet</div>
              <div className="mt-1 text-xs text-slate-500">New submissions will appear here.</div>
            </div>
          ) : (
            accessRequests.map((request) => (
              <div key={request.id} className="flex flex-col gap-3 rounded-xl border border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-900">{request.orgName}</div>
                  <div className="text-xs text-slate-500">{request.fullName} • {request.email}</div>
                  <div className="text-xs text-slate-400">{request.location} • {formatDate(request.createdAt)}</div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    className={
                      request.status === "Accepted"
                        ? "bg-emerald-100 text-emerald-700"
                        : request.status === "Rejected"
                        ? "bg-rose-100 text-rose-700"
                        : "bg-slate-100 text-slate-700"
                    }
                  >
                    {request.status}
                  </Badge>
                  <Button
                    size="sm"
                    onClick={() => handleAccessDecision(request.id, "Accepted")}
                    disabled={request.status !== "New"}
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleAccessDecision(request.id, "Rejected")}
                    disabled={request.status !== "New"}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
