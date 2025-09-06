import { TaskLite } from "@/lib/types";
import StatusChip from "./StatusChips";

export default function Column({ task }: { task: TaskLite }) {
  function initials(name?: string) {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/).slice(0, 2);
    return parts.map((p)=>p[0]?.toUpperCase()||"").join("") || "?";
  }
  function fmt(date?: string) {
    if (!date) return "—";
    const d = new Date(date);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }

  return (
    <div className="rounded-lg border p-3 hover:bg-gray-50 dark:hover:bg-zinc-800">
      <div className="mb-1 flex items-center justify-between">
        <div className="text-sm font-medium truncate">{task.title}</div>
        <StatusChip status={task.status} />
      </div>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-[10px] font-semibold">
            {initials(task.assignee?.name)}
          </div>
          <span className="truncate">{task.assignee?.name || "Unassigned"}</span>
        </div>
        <div>Due {fmt(task.dueAt)}</div>
      </div>
    </div>
  );
}
