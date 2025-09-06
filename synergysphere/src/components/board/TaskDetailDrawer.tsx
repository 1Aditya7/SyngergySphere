"use client";

import * as React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Pencil, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";
import StatusChip from "./StatusChips";
import AssigneeCombobox, { MemberLite } from "./AssigneeCombobox";
import type { TaskLite, TaskStatus } from "@/lib/types";
import { format } from "date-fns";

export default function TaskDetailDrawer({
  open,
  onClose,
  task,
  members,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  task: TaskLite | null;
  members: MemberLite[];
  onSave: (
    id: string,
    delta: Partial<Pick<TaskLite, "title" | "description" | "status" | "dueAt">> & {
      assigneeId?: string | null;
    }
  ) => Promise<void>;
}) {
  const [editing, setEditing] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [status, setStatus] = React.useState<TaskStatus>("TODO");
  const [assigneeId, setAssigneeId] = React.useState<string | undefined>();
  const [due, setDue] = React.useState<Date | undefined>();

  // Safely seed local state when a task opens
  React.useEffect(() => {
    if (!open || !task) return;
    setEditing(false);
    setTitle(task.title);
    setDesc(task.description || "");
    setStatus(task.status);
    setAssigneeId(task.assignee?.id);
    setDue(task.dueAt ? new Date(task.dueAt) : undefined);
  }, [open, task]);

  // Hard guard: don’t render without a task
  if (!task) return null;
  const t: TaskLite = task; // narrowed alias for TS

  const dueLabel = due ? format(due, "PPP") : "Pick a date";

  async function handleSave() {
    await onSave(t.id, {
      title: title.trim() || t.title,
      description: desc,
      status,
      dueAt: due ? due.toISOString() : undefined,
      assigneeId: assigneeId ?? null,
    });
    setEditing(false);
  }

  return (
    <Drawer open={open} onOpenChange={(v) => !v && onClose()}>
      <DrawerContent className="max-h-[92vh]">
        <DrawerHeader className="flex items-center justify-between">
          <DrawerTitle className="flex items-center gap-3">
            <StatusChip status={status} />
            <span className="truncate">{t.title}</span>
          </DrawerTitle>
          <div className="flex items-center gap-2">
            {editing ? (
              <>
                <Button
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
                <Button variant="outline" onClick={() => setEditing(false)}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setEditing(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}
          </div>
        </DrawerHeader>

        <div className="px-6 pb-6 space-y-4">
          {/* Title */}
          <Field label="Title" editing={editing}>
            {editing ? (
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-2 border-dashed"
              />
            ) : (
              <div className="text-sm">{t.title}</div>
            )}
          </Field>

          {/* Description */}
          <Field label="Description" editing={editing}>
            {editing ? (
              <Textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="border-2 border-dashed"
                rows={4}
              />
            ) : (
              <div className="text-sm whitespace-pre-wrap">
                {t.description || "—"}
              </div>
            )}
          </Field>

          {/* Assignee */}
          <Field label="Assignee" editing={editing}>
            {editing ? (
              <AssigneeCombobox
                members={members}
                value={assigneeId}
                onChange={setAssigneeId}
                placeholder="Unassigned"
              />
            ) : (
              <div className="text-sm">{t.assignee?.name || "Unassigned"}</div>
            )}
          </Field>

          {/* Due date */}
          <Field label="Due date" editing={editing}>
            {editing ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("justify-start", !due && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueLabel}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Calendar
                    mode="single"
                    selected={due}
                    onSelect={setDue}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            ) : (
              <div className="text-sm">
                {t.dueAt ? format(new Date(t.dueAt), "PPP") : "—"}
              </div>
            )}
          </Field>

          {/* Status */}
          <Field label="Status" editing={editing}>
            {editing ? (
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as TaskStatus)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODO">To-Do</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="DONE">Done</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <StatusChip status={t.status} />
            )}
          </Field>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function Field({
  label,
  editing,
  children,
}: {
  label: string;
  editing: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid gap-1",
        editing && "p-3 rounded-lg border-2 border-dashed dark:border-zinc-700"
      )}
    >
      <div className="text-xs text-gray-500">{label}</div>
      <div>{children}</div>
    </div>
  );
}
