"use client";
import { useState } from "react";

export default function NewTaskModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (p: { title: string; description?: string; dueAt?: string; assigneeId?: string }) => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [due, setDue] = useState<string>("");
  const [assigneeId, setAssigneeId] = useState<string>("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-4 shadow-xl dark:bg-zinc-900">
        <div className="mb-3 text-base font-semibold">New Task</div>

        <div className="space-y-3">
          <input
            className="w-full rounded-md border px-3 py-2 text-sm dark:bg-zinc-950 dark:border-zinc-800"
            placeholder="Title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="w-full rounded-md border px-3 py-2 text-sm dark:bg-zinc-950 dark:border-zinc-800"
            placeholder="Description"
            rows={3}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <div className="flex gap-3">
            <input
              type="date"
              className="w-1/2 rounded-md border px-3 py-2 text-sm dark:bg-zinc-950 dark:border-zinc-800"
              value={due}
              onChange={(e) => setDue(e.target.value ? new Date(e.target.value).toISOString() : "")}
            />
            <input
              className="w-1/2 rounded-md border px-3 py-2 text-sm dark:bg-zinc-950 dark:border-zinc-800"
              placeholder="Assignee ID (optional)"
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              if (!title.trim()) return;
              await onCreate({ title: title.trim(), description: desc || undefined, dueAt: due || undefined, assigneeId: assigneeId || undefined });
              setTitle(""); setDesc(""); setDue(""); setAssigneeId("");
            }}
            className="rounded-md bg-black px-3 py-2 text-sm text-white hover:opacity-90 dark:bg-white dark:text-black"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
