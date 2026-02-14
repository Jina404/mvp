import Link from "next/link";
import { memo } from "react";
import type { Project } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";

const getNextMilestone = (project: Project) => {
  const active = project.milestones.find((milestone) =>
    ["Pending", "In Progress", "Submitted", "Changes Requested"].includes(milestone.status)
  );

  return active ? `${active.title} • ${active.dueDate}` : "No milestones yet";
};

function ProjectCard({ project }: { project: Project }) {
  const milestoneSummary = getNextMilestone(project);
  const isNotStarted = ["Pending Assignment", "New", "Scoping"].includes(project.status);
  const progressValue = isNotStarted ? 0 : 65;
  const progressWidth = isNotStarted ? 5 : 65;
  const statusTone = (() => {
    if (["New", "Scoping", "Pending Assignment"].includes(project.status))
      return "bg-purple-50 text-purple-700 border-purple-100";
    if (["Active", "In Progress"].includes(project.status))
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    if (["Review", "In Review"].includes(project.status))
      return "bg-sky-50 text-sky-700 border-sky-100";
    return "bg-slate-50 text-slate-700 border-slate-200";
  })();

  return (
    <Link
      href={`/projects/${project.id}`}
      className="group block rounded-2xl border border-slate-200/60 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] ring-1 ring-transparent transition-all duration-300 hover:shadow-lg hover:ring-purple-200/60 hover:border-purple-100 active:scale-[0.99] dark:border-white/5 dark:bg-[#1E2329] dark:hover:ring-purple-500/20 dark:hover:border-purple-500/10"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[15px] font-bold text-slate-900 transition-colors duration-200 group-hover:text-purple-700 dark:text-slate-100 dark:group-hover:text-purple-400">{project.title}</div>
          <div className="mt-1 text-xs font-medium text-slate-400 dark:text-slate-500">{project.serviceType}</div>
        </div>
        <Badge className={`shrink-0 rounded-lg border px-2.5 py-0.5 text-[11px] font-semibold ${statusTone}`}>{project.status}</Badge>
      </div>

      <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
        <div className="rounded-lg bg-slate-50/80 dark:bg-white/5 px-3 py-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-300 dark:text-slate-600">Specialist</div>
          <div className="mt-0.5 text-xs font-semibold text-slate-700 dark:text-slate-300">{project.assignedSpecialistRole}</div>
        </div>
        <div className="rounded-lg bg-slate-50/80 dark:bg-white/5 px-3 py-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-300 dark:text-slate-600">Next Milestone</div>
          <div className="mt-0.5 text-xs font-semibold text-slate-700 dark:text-slate-300">{milestoneSummary}</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-slate-400 dark:text-slate-500">Progress</span>
          <span className="text-sm font-bold tabular-nums text-slate-900 dark:text-slate-100">{progressValue}%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
          <div
            className="h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-700 ease-out"
            style={{ width: `${progressWidth}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-slate-400 dark:text-slate-500">
          <span className="font-medium">Deadline:</span>{" "}
          <span className="font-semibold text-slate-600 dark:text-slate-300">{project.deadline}</span>
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 opacity-0 transition-all duration-200 group-hover:opacity-100">
          View details <ArrowUpRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}

export default memo(ProjectCard);
