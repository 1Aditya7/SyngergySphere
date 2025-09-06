import { Badge } from "@/components/ui/badge";
import { TaskStatus } from "@/lib/types";

export default function StatusChip({ status }: { status: TaskStatus }) {
  const map: Record<TaskStatus, { label: string; className: string }> = {
    TODO: { label: "Not yet started", className: "bg-gray-200 text-gray-800 dark:bg-zinc-800 dark:text-gray-200" },
    IN_PROGRESS: { label: "In progress", className: "bg-yellow-200 text-yellow-900 dark:bg-yellow-300 dark:text-yellow-950" },
    DONE: { label: "Done", className: "bg-green-200 text-green-900 dark:bg-green-300 dark:text-green-950" },
  };
  const cfg = map[status];
  return <Badge className={`rounded-full ${cfg.className}`}>{cfg.label}</Badge>;
}
