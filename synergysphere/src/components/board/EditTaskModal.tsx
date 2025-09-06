"use client";
import { useEffect, useState } from "react";
import AssignSelect from "./AssignSelect";
import { TaskLite } from "@/lib/types";

export default function EditTaskModal({
  open, onClose, task, onSave
}: {
  open: boolean;
  onClose: () => void;
  task: TaskLite | null;
  onSave: (delta: { title?: string; description?: string; assigneeId?: string; dueAt?: string; status?: TaskLite["status"] }) => Promise<void>;
}) {
  const [title, setTitle] = useState(""); const [desc, setDesc] = useState("");
  const [due, setDue] = useState<string>(""); const [assigneeId, setAssigneeId] = useState<string>("");

  useEffect(() => {
    if (!task) return;
    setTitle(task.title || "");
    setDesc(task.description || "");
    setAssigneeId(task.assignee?.id || "");
    setDue(task.dueAt || "");
  }, [task]);

  if (!open || !task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-4 shadow-xl dark:bg-zinc-900">
        <div className="mb-3 text-base font-semibold">Edit Task</div>
        <div className="space-y-3">
          <input className="w-full rounded-md border px-3 py-2 text-sm dark:bg-zinc-950 dark:border-zinc-800"
                 value={title} onChange={e=>setTitle(e.target.value)} />
          <textarea className="w-full rounded-md border px-3 py-2 text-sm dark:bg-zinc-950 dark:border-zinc-800"
                    rows={3} value={desc} onChange={e=>setDesc(e.target.value)} />
          <div className="flex gap-3">
            <input type="date"
              className="w-1/2 rounded-md border px-3 py-2 text-sm dark:bg-zinc-950 dark:border-zinc-800"
              value={due ? new Date(due).toISOString().slice(0,10) : ""}
              onChange={(e)=>setDue(e.target.value ? new Date(e.target.value).toISOString() : "")}/>
            <div className="w-1/2"><AssignSelect value={assigneeId} onChange={(id)=>setAssigneeId(id || "")} /></div>
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</button>
          <button
            onClick={async () => {
              await onSave({
                title: title.trim(),
                description: desc || undefined,
                dueAt: due || undefined,
                assigneeId: assigneeId || undefined,
              });
              onClose();
            }}
            className="rounded-md bg-black px-3 py-2 text-sm text-white hover:opacity-90 dark:bg-white dark:text-black"
          >Save</button>
        </div>
      </div>
    </div>
  );
}
