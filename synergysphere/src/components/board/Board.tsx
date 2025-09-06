"use client";

import { useEffect, useMemo, useState } from "react";
import { TaskLite, TaskStatus } from "@/lib/types";
import { getTasks, createTask, updateTask } from "@/lib/api";
import Column from "./Column";
import NewTaskModal from "./NewTaskModal";
import type { MemberLite } from "./AssigneeCombobox";
import { mockMembers } from "@/mocks/members";
import type { TagLite } from "./TagSelector";
import FiltersBar, { Filters } from "./FiltersBar";
import TaskDetailDrawer from "./TaskDetailDrawer";

// dnd-kit
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function Board({
  projectId,
  currentUserId = "u1",
}: {
  projectId: string;
  currentUserId?: string;
}) {
  // tasks & members
  const [tasks, setTasks] = useState<TaskLite[]>([]);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<MemberLite[]>([]);
  const [tagsPool] = useState<TagLite[]>([
    { id: "t-bug", name: "bug" },
    { id: "t-ui", name: "ui" },
    { id: "t-backend", name: "backend" },
  ]);

  // modals/drawer
  const [createOpen, setCreateOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<TaskLite | null>(null);

  // DnD active for overlay
  const [draggingTask, setDraggingTask] = useState<TaskLite | null>(null);

  // filters
  const [filters, setFilters] = useState<Filters>({
    status: "ALL",
    assigneeId: "ALL",
    tagId: "ALL",
    from: null,
    to: null,
  });

  // load tasks
  useEffect(() => {
    let on = true;
    (async () => {
      setLoading(true);
      try {
        const data = await getTasks(projectId);
        if (on) setTasks(Array.isArray(data) ? data : []);
      } finally {
        if (on) setLoading(false);
      }
    })();
    return () => {
      on = false;
    };
  }, [projectId]);

  // load members
  useEffect(() => {
    let on = true;
    (async () => {
      try {
        const r = await fetch(`/api/projects/${projectId}/members`, {
          cache: "no-store",
        });
        const data = r.ok ? await r.json() : [];
        if (on) setMembers(data.length ? data : (mockMembers as MemberLite[]));
      } catch {
        if (on) setMembers(mockMembers as MemberLite[]);
      }
    })();
    return () => {
      on = false;
    };
  }, [projectId]);

  // filtering
  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (filters.status && filters.status !== "ALL" && t.status !== filters.status)
        return false;
      if (filters.assigneeId && filters.assigneeId !== "ALL") {
        if ((filters.assigneeId as string) === "__unassigned__") {
          if (t.assignee) return false;
        } else if (t.assignee?.id !== filters.assigneeId) return false;
      }
      if (filters.q) {
        const q = filters.q.toLowerCase();
        const text = `${t.title} ${t.description || ""}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      if (filters.from || filters.to) {
        const d = t.dueAt ? new Date(t.dueAt) : null;
        if (d) {
          const from = filters.from ?? new Date(0);
          const to = filters.to ?? new Date(8640000000000000);
          if (!(d >= from && d <= to)) return false;
        } else if (filters.from || filters.to) {
          return false;
        }
      }
      return true;
    });
  }, [tasks, filters]);

  // group by status
  const byStatus = useMemo(() => {
    const map: Record<TaskStatus, TaskLite[]> = {
      TODO: [],
      IN_PROGRESS: [],
      DONE: [],
    };
    for (const t of filtered) {
      const key: TaskStatus =
        t.status === "IN_PROGRESS" || t.status === "DONE" ? t.status : "TODO";
      map[key].push(t);
    }
    return map;
  }, [filtered]);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  );

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

  // DETAIL open
  function openTask(t: TaskLite) {
    setActiveTask(t);
    setDetailOpen(true);
  }

  // Save from detail drawer
  async function saveDetail(id: string, delta: any) {
    setTasks((prev) =>
      prev.map((x) =>
        x.id === id
          ? {
              ...x,
              ...delta,
              assignee:
                delta.assigneeId === undefined
                  ? x.assignee
                  : delta.assigneeId
                  ? {
                      id: delta.assigneeId,
                      name:
                        members.find((m) => m.id === delta.assigneeId)?.name ||
                        "Member",
                      email: "",
                    }
                  : null,
            }
          : x
      )
    );
    try {
      await updateTask(projectId, id, delta);
    } catch {}
  }

  // Drag end: item moved to another column
  async function onDragEnd(e: DragEndEvent) {
    setDraggingTask(null);
    const taskId = e.active.id as string;
    const destCol = (e.over?.id as TaskStatus) || null;
    if (!destCol) return;

    const t = tasks.find((x) => x.id === taskId);
    if (!t || t.status === destCol) return;

    // optimistic status change
    setTasks((prev) =>
      prev.map((x) => (x.id === taskId ? { ...x, status: destCol } : x))
    );
    try {
      await updateTask(projectId, taskId, { status: destCol });
    } catch {
      setTasks((prev) =>
        prev.map((x) =>
          x.id === taskId ? { ...x, status: t.status } : x
        )
      );
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

      <FiltersBar members={members} tags={tagsPool} onChange={setFilters} />

      {loading ? (
        <div className="text-sm text-gray-500">Loading tasks…</div>
      ) : (
        <DndContext
          sensors={sensors}
          onDragEnd={onDragEnd}
          onDragStart={(e) => {
            const t = tasks.find((x) => x.id === e.active.id);
            if (t) setDraggingTask(t);
          }}
        >
          <div className="grid gap-4 md:grid-cols-3">
            <DropColumn id="TODO" title="To-Do">
              <SortableColumnList
                columnId="TODO"
                items={byStatus.TODO}
                render={(t) => (
                  <div onClick={() => openTask(t)}>
                    <Column task={t} />
                  </div>
                )}
              />
            </DropColumn>

            <DropColumn id="IN_PROGRESS" title="In Progress">
              <SortableColumnList
                columnId="IN_PROGRESS"
                items={byStatus.IN_PROGRESS}
                render={(t) => (
                  <div onClick={() => openTask(t)}>
                    <Column task={t} />
                  </div>
                )}
              />
            </DropColumn>

            <DropColumn id="DONE" title="Done">
              <SortableColumnList
                columnId="DONE"
                items={byStatus.DONE}
                render={(t) => (
                  <div onClick={() => openTask(t)}>
                    <Column task={t} />
                  </div>
                )}
              />
            </DropColumn>
          </div>

          {/* Ghost overlay */}
          <DragOverlay>
            {draggingTask ? <Column task={draggingTask} /> : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* Create */}
      <NewTaskModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        mode="create"
        initial={null}
        onSubmit={handleCreate}
        projectId={projectId}
        members={members}
        currentUserId={currentUserId}
        initialTags={tagsPool}
      />

      {/* Detail */}
      <TaskDetailDrawer
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        task={activeTask}
        members={members}
        onSave={saveDetail}
      />
    </div>
  );
}

/* --- DND helpers --- */
function DropColumn({
  id,
  title,
  children,
}: {
  id: TaskStatus;
  title: string;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl border bg-white p-3 dark:bg-zinc-900 dark:border-zinc-800 min-h-[60vh] transition-colors duration-200 ${
        isOver ? "bg-blue-50 dark:bg-zinc-800/50" : ""
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-medium">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function SortableColumnList({
  columnId,
  items,
  render,
}: {
  columnId: TaskStatus;
  items: TaskLite[];
  render: (t: TaskLite) => React.ReactNode;
}) {
  return (
    <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
      <div className="space-y-2">
        {items.map((t) => (
          <SortableCard key={t.id} id={t.id}>
            {render(t)}
          </SortableCard>
        ))}
        {items.length === 0 && (
          <div className="text-xs text-gray-400">No tasks here.</div>
        )}
      </div>
    </SortableContext>
  );
}

function SortableCard({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 200ms ease", // ✅ smoother
    opacity: isDragging ? 0.8 : 1,
    cursor: "grab",
    zIndex: isDragging ? 50 : "auto",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}
