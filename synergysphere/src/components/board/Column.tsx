import { TaskLite, TaskStatus } from "@/lib/types";
import TaskCard from "./TaskCard";

export default function Column({
  title,
  status,
  tasks,
  onAdvance,
  onEdit,
}: {
  title: string;
  status: TaskStatus;
  tasks?: TaskLite[];                         // allow undefined
  onAdvance: (t: TaskLite) => void | Promise<void>;
  onEdit: (t: TaskLite) => void;
}) {
  const list = tasks ?? [];                   // safe fallback

  return (
    <div className="rounded-xl border bg-white p-3 dark:bg-zinc-900 dark:border-zinc-800">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-medium">{title}</h2>
        <span className="text-xs text-gray-500">{list.length}</span>
      </div>
      <div className="space-y-2">
        {list.length === 0 ? (
          <div className="text-xs text-gray-400">No tasks here.</div>
        ) : (
          list.map((t) => (
            <TaskCard
              key={t.id}
              task={t}
              onAdvance={() => onAdvance(t)}
              onEdit={() => onEdit(t)}
            />
          ))
        )}
      </div>
    </div>
  );
}
