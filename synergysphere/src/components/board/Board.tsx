"use client";
import { useEffect, useMemo, useState } from "react";
import { TaskLite, TaskStatus } from "@/lib/types";
import { getTasks, createTask, updateTask, nextStatus } from "@/lib/api";
import Column from "./Column";
import NewTaskModal from "./NewTaskModal";

export default function Board({ projectId }: { projectId: string }) {
  const [tasks, setTasks] = useState<TaskLite[]>([]);
  const [loading, setLoading] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<TaskLite | null>(null);

  // Load tasks (mocks ON by default in api.ts)
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await getTasks(projectId);
        if (mounted) setTasks(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("getTasks failed:", e);
        if (mounted) setTasks([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [projectId]);

  const byStatus = useMemo(() => {
    const map: Record<TaskStatus, TaskLite[]> = { TODO: [], IN_PROGRESS: [], DONE: [] };
    for (const t of tasks) (map[t.status] ?? (map[t.status] = [])).push(t);
    return map;
  }, [tasks]);

  // CREATE
  async function handleCreate(payload: {
    title: string;
    description?: string;
    dueAt?: string;
    assigneeId?: string;
  }) {
    const t = await createTask(projectId, payload);
    setTasks((prev) => [t, ...prev]);
  }

  // STATUS ADVANCE
  async function handleAdvance(t: TaskLite) {
    const s = nextStatus(t.status);
    setTasks((prev) => prev.map((x) => (x.id === t.id ? { ...x, status: s } : x))); // optimistic
    try {
      await updateTask(projectId, t.id, { status: s });
    } catch (e) {
      console.error("updateTask status failed:", e);
      setTasks((prev) => prev.map((x) => (x.id === t.id ? { ...x, status: t.status } : x))); // rollback
    }
  }

  // EDIT
  function openEdit(t: TaskLite) {
    setEditing(t);
    setEditOpen(true);
  }

  async function handleEditSave(payload: {
    title?: string;
    description?: string;
    assigneeId?: string;
    dueAt?: string;
  }) {
    if (!editing) return;
    // optimistic
    setTasks((prev) =>
      prev.map((x) =>
        x.id === editing.id
          ? {
              ...x,
              ...payload,
              assignee:
                payload.assigneeId !== undefined
                  ? payload.assigneeId
                    ? { id: payload.assigneeId, name: "Member" } // placeholder until real members API
                    : null
                  : x.assignee,
            }
          : x
      )
    );
    try {
      await updateTask(projectId, editing.id, payload);
    } catch (e) {
      console.error("updateTask edit failed:", e);
    }
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Task Board</h1>
        <button
          onClick={() => setCreateOpen(true)}
          className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          + New Task
        </button>
      </div>

      {loading ? (
        <div className="text-sm text-gray-500">Loading tasks…</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <Column
            title="To-Do"
            status="TODO"
            tasks={byStatus?.TODO ?? []}
            onAdvance={handleAdvance}
            onEdit={openEdit}
          />
          <Column
            title="In Progress"
            status="IN_PROGRESS"
            tasks={byStatus?.IN_PROGRESS ?? []}
            onAdvance={handleAdvance}
            onEdit={openEdit}
          />
          <Column
            title="Done"
            status="DONE"
            tasks={byStatus?.DONE ?? []}
            onAdvance={handleAdvance}
            onEdit={openEdit}
          />
        </div>
      )}

      {/* Create */}
      <NewTaskModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        mode="create"
        initial={null}
        onSubmit={handleCreate}
      />

      {/* Edit (reuses same modal) */}
      <NewTaskModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        mode="edit"
        initial={editing}
        onSubmit={handleEditSave}
      />
    </div>
  );
}
