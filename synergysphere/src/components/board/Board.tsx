"use client";
import { useEffect, useMemo, useState } from "react";
import { TaskLite, TaskStatus } from "@/lib/types";
import { getTasks, createTask, updateTask, nextStatus } from "@/lib/api";
import Column from "./Column";
import NewTaskModal from "./NewTaskModal";

export default function Board({ projectId }: { projectId: string }) {
  const [tasks, setTasks] = useState<TaskLite[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const data = await getTasks(projectId);
      if (mounted) setTasks(data);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, [projectId]);

  const byStatus = useMemo(() => {
    const map: Record<TaskStatus, TaskLite[]> = { TODO: [], IN_PROGRESS: [], DONE: [] };
    for (const t of tasks) map[t.status].push(t);
    return map;
  }, [tasks]);

  async function handleCreate(payload: { title: string; description?: string; dueAt?: string; assigneeId?: string }) {
    const t = await createTask(projectId, payload);
    setTasks(prev => [t, ...prev]);
  }

  async function handleAdvance(t: TaskLite) {
    const s = nextStatus(t.status);
    setTasks(prev => prev.map(x => (x.id === t.id ? { ...x, status: s } : x))); // optimistic
    try {
      await updateTask(projectId, t.id, { status: s });
    } catch {
      // rollback on failure
      setTasks(prev => prev.map(x => (x.id === t.id ? { ...x, status: t.status } : x)));
    }
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Task Board</h1>
        <button
          onClick={() => setShowNew(true)}
          className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          + New Task
        </button>
      </div>

      {loading ? (
        <div className="text-sm text-gray-500">Loading tasks…</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <Column title="To-Do" status="TODO" tasks={byStatus.TODO} onAdvance={handleAdvance} />
          <Column title="In Progress" status="IN_PROGRESS" tasks={byStatus.IN_PROGRESS} onAdvance={handleAdvance} />
          <Column title="Done" status="DONE" tasks={byStatus.DONE} onAdvance={handleAdvance} />
        </div>
      )}

      <NewTaskModal
        open={showNew}
        onClose={() => setShowNew(false)}
        onCreate={async (p) => { await handleCreate(p); setShowNew(false); }}
      />
    </div>
  );
}
