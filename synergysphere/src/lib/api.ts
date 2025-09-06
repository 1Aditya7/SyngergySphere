import { TaskLite, TaskStatus } from "@/lib/types";
import { mockTasks } from "@/mocks/tasks";

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "false";

// Shared Helper Functions
async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}

// Tasks API (with fallback)
export async function getTasks(projectId: string): Promise<TaskLite[]> {
  if (USE_MOCKS) return mockTasks.filter(t => t.projectId === projectId || projectId === "demo");
  try {
    return await api<TaskLite[]>(`/api/projects/${projectId}/tasks`);
  } catch {
    return mockTasks.filter(t => t.projectId === projectId || projectId === "demo");
  }
}

export async function createTask(
  projectId: string,
  payload: Pick<TaskLite, "title" | "description" | "dueAt"> & { assigneeId?: string }
): Promise<TaskLite> {
  if (USE_MOCKS) {
    const t: TaskLite = {
      id: Math.random().toString(36).slice(2),
      projectId,
      title: payload.title,
      description: payload.description,
      status: "TODO",
      dueAt: payload.dueAt,
      assignee: payload.assigneeId ? { id: payload.assigneeId, name: "Member" } : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockTasks.unshift(t);
    return t;
  }
  try {
    return await api<TaskLite>(`/api/projects/${projectId}/tasks`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  } catch {
    // Optimistic Fallback
    const t: TaskLite = {
      id: Math.random().toString(36).slice(2),
      projectId,
      title: payload.title,
      description: payload.description,
      status: "TODO",
      dueAt: payload.dueAt,
      assignee: payload.assigneeId ? { id: payload.assigneeId, name: "Member" } : null,
    };
    mockTasks.unshift(t);
    return t;
  }
}

export async function updateTask(
  projectId: string,
  taskId: string,
  delta: Partial<Pick<TaskLite, "title" | "description" | "dueAt" | "status">> & { assigneeId?: string }
): Promise<TaskLite> {
  if (USE_MOCKS) {
    const idx = mockTasks.findIndex(t => t.id === taskId);
    if (idx >= 0) {
      mockTasks[idx] = {
        ...mockTasks[idx],
        ...delta,
        assignee: delta.assigneeId ? { id: delta.assigneeId, name: "Member" } : mockTasks[idx].assignee,
        updatedAt: new Date().toISOString(),
      };
      return mockTasks[idx];
    }
    throw new Error("Task not found (mock)");
  }
  try {
    return await api<TaskLite>(`/api/projects/${projectId}/tasks/${taskId}`, {
      method: "PATCH",
      body: JSON.stringify(delta),
    });
  } catch {
    // Optimistic Local Update
    const idx = mockTasks.findIndex(t => t.id === taskId);
    if (idx >= 0) {
      mockTasks[idx] = {
        ...mockTasks[idx],
        ...delta,
        assignee: delta.assigneeId ? { id: delta.assigneeId, name: "Member" } : mockTasks[idx].assignee,
      };
      return mockTasks[idx];
    }
    throw new Error("Task not found (fallback)");
  }
}

export const nextStatus = (s: TaskStatus): TaskStatus =>
  s === "TODO" ? "IN_PROGRESS" : s === "IN_PROGRESS" ? "DONE" : "TODO";
