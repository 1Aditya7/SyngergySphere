"use client";
import { useEffect, useMemo, useState } from "react";
import AssignSelect from "./AssignSelect";
import { TaskLite } from "@/lib/types";

type Payload = {
  title: string;
  description?: string;
  assigneeId?: string;
  dueAt?: string; // ISO
};

export default function NewTaskModal({
  open,
  onClose,
  mode = "create",
  initial,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  mode?: "create" | "edit";
  initial?: TaskLite | null;
  onSubmit: (payload: Payload) => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [due, setDue] = useState<string>("");
  const [assigneeId, setAssigneeId] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const isEdit = mode === "edit";
  const header = useMemo(() => (isEdit ? "Edit Task" : "New Task"), [isEdit]);

  useEffect(() => {
    if (!open) return;
    if (isEdit && initial) {
      setTitle(initial.title || "");
      setDesc(initial.description || "");
      setAssigneeId(initial.assignee?.id || "");
      setDue(initial.dueAt || "");
    } else {
      setTitle("");
      setDesc("");
      setAssigneeId("");
      setDue("");
    }
  }, [open, isEdit, initial]);

  if (!open) return null;

  const dateInputValue = due ? new Date(due).toISOString().slice(0, 10) : "";

  async function handleSave() {
    if (!title.trim()) return;
    setSaving(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: desc || undefined,
        assigneeId: assigneeId || undefined,
        dueAt: due || undefined,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-4 shadow-xl dark:bg-zinc-900">
        <div className="mb-3 text-base font-semibold">{header}</div>

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
              value={dateInputValue}
              onChange={(e) =>
                setDue(e.target.value ? new Date(e.target.value).toISOString() : "")
              }
            />
            <div className="w-1/2">
              <AssignSelect value={assigneeId} onChange={(id) => setAssigneeId(id || "")} />
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={saving}
            className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !title.trim()}
            className="rounded-md bg-black px-3 py-2 text-sm text-white hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-black"
          >
            {isEdit ? "Save" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
