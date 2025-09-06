"use client";

import { useEffect, useMemo, useState } from "react";
import { TaskLite, TaskStatus } from "@/lib/types";
import { getTasks, createTask, updateTask, nextStatus } from "@/lib/api";
import Column from "./Column";
import NewTaskModal from "./NewTaskModal";
import type { MemberLite } from "./AssigneeCombobox";
import { mockMembers } from "@/mocks/members";
import type { TagLite } from "./TagSelector";

export default function Board({
  projectId,
  currentUserId = "u1",
}: {
  projectId: string;
  currentUserId?: string;
}) {
  // tasks
  const [tasks, setTasks] = useState<TaskLite[]>([]);
  const [loading, setLoading] = useState(true);

  // members
  const [members, setMembers] = useState<MemberLite[]>([]);

  // tags (local pool for now; swap to API later)
  const [tagsPool, setTagsPool] = useState<TagLite[]>([
    { id: "t-bug", name: "bug" },
    { id: "t-ui", name: "ui" },
    { id: "t-backend", name: "backend" },
  ]);

  // modals
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<TaskLite | null>(null);

  // load tasks
  useEffect(() => {
    let on = true;
    (async () => {
      setLoading(true);
      try {
        const data = await getTasks(projectId);
        if (on) setTasks(Array.isArray(data) ? data : []);
      } catch {
        if (on) setTasks([]);
      } finally {
        if (on) setLoading(false);
      }
    })();
    return () => {
      on = false;
    };
  }, [projectId]);

  // load members (fallback to mocks)
  useEffect(() => {
    let on = true;
    (async () => {
      try {
        const r = await fetch(`/api/projects/${projectId}/members`, { cache: "no-store" });
        if (!r.ok) throw new Error();
        const data = (await r.json()) as MemberLite[];
        if (on) setMembers(data);
      } catch {
        if (on) setMembers(mockMembers as MemberLite[]);
      }
    })();
    return () => {
      on = false;
    };
  }, [projectId]);

  // group
  const byStatus = useMemo(() => {
    const map: Record<TaskStatus, TaskLite[]> = { TODO: [], IN_PROGRESS: [], DONE: [] };
    for (const t of tasks) map[t.status].push(t);
    return map;
  }, [tasks]);

  // CREATE
  async function handleCreate(payload: {
    title: string;
    description?: string;
    dueAt?: string;
    assigneeId?: string;
    tags?: { id?: string; name: string }[];
    assignedById?: string;
  }) {
    const t = await createTask(projectId, payload);
    setTasks((prev) => [t, ...prev]);
  }

  // ADVANCE
  async function handleAdvance(t: TaskLite) {
    const s = nextStatus(t.status);
    setTasks((prev) => prev.map((x) => (x.id === t.id ? { ...x, status: s } : x)));
    try {
      await updateTask(projectId, t.id, { status: s });
    } catch {
      setTasks((prev) => prev.map((x) => (x.id === t.id ? { ...x, status: t.status } : x)));
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
    tags?: { id?: string; name: string }[];
  }) {
    if (!editing) return;
    setTasks((prev) =>
      prev.map((x) =>
        x.id === editing.id
          ? {
              ...x,
              ...payload,
              assignee:
                payload.assigneeId !== undefined
                  ? payload.assigneeId
                    ? {
                        id: payload.assigneeId,
                        name:
                          members.find((m) => m.id === payload.assigneeId)?.name ||
                          "Member",
                        email: "",
                      }
                    : null
                  : x.assignee,
            }
          : x
      )
    );
    try {
      await updateTask(projectId, editing.id, payload);
    } catch {
      // optional: re-fetch
    }
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Task Board</h1>
        <button
          onClick={() => setCreateOpen(true)}
          className="rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
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
            tasks={byStatus.TODO}
            onAdvance={handleAdvance}
            onEdit={openEdit}
          />
          <Column
            title="In Progress"
            status="IN_PROGRESS"
            tasks={byStatus.IN_PROGRESS}
            onAdvance={handleAdvance}
            onEdit={openEdit}
          />
          <Column
            title="Done"
            status="DONE"
            tasks={byStatus.DONE}
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
        projectId={projectId}
        members={members.length ? members : (mockMembers as MemberLite[])}
        currentUserId={currentUserId}
        initialTags={tagsPool}
      />

      {/* Edit */}
      <NewTaskModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        mode="edit"
        initial={
          editing
            ? {
                title: editing.title,
                description: editing.description,
                assigneeId: editing.assignee?.id,
                dueAt: editing.dueAt,
                tags: [], // supply when you persist tags on tasks
              }
            : null
        }
        onSubmit={handleEditSave}
        projectId={projectId}
        members={members.length ? members : (mockMembers as MemberLite[])}
        currentUserId={currentUserId}
        initialTags={tagsPool}
      />
    </div>
  );
}
