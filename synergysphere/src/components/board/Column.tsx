import { TaskLite, TaskStatus } from "@/lib/types";
import TaskCard from "./TaskCard";

export default function Column({
  title,
  status,
  tasks,
  onAdvance,
}: {
  title: string;
  status: TaskStatus;
  tasks: TaskLite[];
  onAdvance: (t: TaskLite) => void;
}) {
  return (
    <div className="rounded-xl border bg-white p-3 dark:bg-zinc-900 dark:border-zinc-800">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-medium">{title}</h2>
        <span className="text-xs text-gray-500">{tasks.length}</span>
      </div>
      <div className="space-y-2">
        {tasks.length === 0 ? (
          <div className="text-xs text-gray-400">No tasks here.</div>
        ) : (
          tasks.map((t) => (
            <TaskCard key={t.id} task={t} onAdvance={() => onAdvance(t)} />
          ))
        )}
      </div>
    </div>
  );
}
