"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { getAnalyticsSummary, initMockDb } from "@/lib/mockDb";

export default function AnalyticsPage() {
  const router = useRouter();
  const [refresh, setRefresh] = useState(0);
  const summary = useMemo(() => getAnalyticsSummary(), [refresh]);

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

  return (
    <div className="mt-8 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Reports + Analytics</h1>
          <p className="mt-2 text-sm text-slate-500">
            Performance metrics, demand trends, and delivery score system.
          </p>
        </div>
        <Link className={buttonVariants({ variant: "outline" })} href="/admin">
          Back to Command Center
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <div className="text-xs font-medium text-slate-500">Total Clients Served</div>
          <div className="mt-3 text-2xl font-semibold text-slate-900">{summary.totalClients}</div>
        </div>
        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <div className="text-xs font-medium text-slate-500">Active Projects</div>
          <div className="mt-3 text-2xl font-semibold text-slate-900">{summary.activeProjects}</div>
        </div>
        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <div className="text-xs font-medium text-slate-500">Completion Rate</div>
          <div className="mt-3 text-2xl font-semibold text-slate-900">{summary.completionRate}%</div>
        </div>
        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <div className="text-xs font-medium text-slate-500">Avg Project Value</div>
          <div className="mt-3 text-2xl font-semibold text-slate-900">KES {summary.averageProjectValue}</div>
        </div>
        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <div className="text-xs font-medium text-slate-500">Repeat Clients</div>
          <div className="mt-3 text-2xl font-semibold text-slate-900">{summary.repeatClients}</div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">Top Freelancer Performance</div>
            <Badge variant="secondary">Delivery Score</Badge>
          </div>
          <div className="mt-4">
            <div className="space-y-3 sm:hidden">
              {summary.topFreelancers.map((freelancer) => (
                <div key={freelancer.id} className="rounded-xl border border-border bg-slate-50/70 p-3">
                  <div className="text-sm font-semibold text-slate-900">{freelancer.name}</div>
                  <div className="mt-1 text-xs text-slate-500">{freelancer.role}</div>
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                    <span>Delivery Score</span>
                    <span className="font-semibold text-slate-900">{freelancer.deliveryScore}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="hidden sm:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Freelancer</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summary.topFreelancers.map((freelancer) => (
                    <TableRow key={freelancer.id}>
                      <TableCell className="font-medium text-slate-900">{freelancer.name}</TableCell>
                      <TableCell>{freelancer.role}</TableCell>
                      <TableCell className="text-right">{freelancer.deliveryScore}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">Demand by Category</div>
            <Badge variant="secondary">Market</Badge>
          </div>
          <div className="mt-4">
            <div className="space-y-3 sm:hidden">
              {Object.entries(summary.categoryDemand).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between rounded-xl border border-border bg-slate-50/70 p-3">
                  <div className="text-sm font-semibold text-slate-900">{category}</div>
                  <div className="text-sm font-semibold text-slate-900">{count}</div>
                </div>
              ))}
            </div>
            <div className="hidden sm:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Projects</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(summary.categoryDemand).map(([category, count]) => (
                    <TableRow key={category}>
                      <TableCell className="font-medium text-slate-900">{category}</TableCell>
                      <TableCell className="text-right">{count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
