"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  addSpecialistSkill,
  getSpecialists,
  initMockDb,
  updateSpecialistAvailability,
  updateSpecialistVerification
} from "@/lib/mockDb";
import type { Specialist } from "@/lib/types";

export default function SpecialistsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [refresh, setRefresh] = useState(0);
  const specialists = useMemo<Specialist[]>(() => getSpecialists(), [refresh]);
  const [skillInputs, setSkillInputs] = useState<Record<number, string>>({});

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

  const handlePause = (id: number) => {
    updateSpecialistAvailability(id, "Paused");
    setRefresh((value) => value + 1);
    toast({ title: "Specialist paused", description: "Availability set to Paused." });
  };

  const handleActivate = (id: number) => {
    updateSpecialistAvailability(id, "Available");
    setRefresh((value) => value + 1);
    toast({ title: "Specialist activated", description: "Availability set to Available." });
  };

  const handleVerify = (id: number, status: "Verified" | "Rejected") => {
    updateSpecialistVerification(id, status);
    setRefresh((value) => value + 1);
    toast({ title: `Specialist ${status.toLowerCase()}`, description: "Verification updated." });
  };

  const handleAddSkill = (id: number) => {
    const value = skillInputs[id]?.trim();
    if (!value) {
      toast({ title: "Skill required", description: "Enter a skill to add.", variant: "destructive" });
      return;
    }
    addSpecialistSkill(id, value);
    setSkillInputs((prev) => ({ ...prev, [id]: "" }));
    setRefresh((value) => value + 1);
    toast({ title: "Skill added", description: "Specialist profile updated." });
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Verified Specialists</h1>
          <p className="mt-2 text-sm text-slate-500">
            Talent pool oversight with reliability and availability signals.
          </p>
        </div>
        <Link className={buttonVariants({ variant: "outline" })} href="/admin">
          Back to Ops Overview
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {specialists.map((specialist) => (
          <div key={specialist.id} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-semibold text-slate-900">{specialist.name}</div>
                <div className="mt-1 text-xs text-slate-500">{specialist.role}</div>
              </div>
              <Badge
                className={
                  specialist.availability === "Available"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-100 text-slate-700"
                }
              >
                {specialist.availability}
              </Badge>
            </div>

            <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
              <div>
                <div className="text-xs text-slate-400">Verification</div>
                <div className="mt-1 font-medium text-slate-900">{specialist.verificationStatus ?? "Pending"}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Assessment Score</div>
                <div className="mt-1 font-medium text-slate-900">{specialist.assessmentScore ?? 0}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Delivery Score</div>
                <div className="mt-1 font-medium text-slate-900">{specialist.deliveryScore ?? 0}%</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">On-time Rate</div>
                <div className="mt-1 font-medium text-slate-900">{specialist.onTimeRate ?? 0}%</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Active Projects</div>
                <div className="mt-1 font-medium text-slate-900">{specialist.activeProjects ?? 0}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Risk Level</div>
                <div className="mt-1 font-medium text-slate-900">{specialist.riskLevel ?? "Low"}</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-xs font-semibold text-slate-500">Skills</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {specialist.skills.map((skill) => (
                  <Badge key={skill} variant="subtle">
                    {skill}
                  </Badge>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <Input
                  placeholder="Add skill"
                  value={skillInputs[specialist.id] ?? ""}
                  onChange={(event) =>
                    setSkillInputs((prev) => ({ ...prev, [specialist.id]: event.target.value }))
                  }
                />
                <Button variant="secondary" onClick={() => handleAddSkill(specialist.id)}>
                  Add
                </Button>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-xs font-semibold text-slate-500">Risk History</div>
              <div className="mt-1 text-xs text-slate-500">{specialist.riskHistory.join(", ") || "No flags"}</div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Button onClick={() => handleVerify(specialist.id, "Verified")}>Approve</Button>
              <Button variant="outline" onClick={() => handleVerify(specialist.id, "Rejected")}>
                Reject
              </Button>
              <Button variant="secondary" onClick={() => handlePause(specialist.id)}>
                Suspend
              </Button>
              <Button variant="secondary" onClick={() => handleActivate(specialist.id)}>
                Activate
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
