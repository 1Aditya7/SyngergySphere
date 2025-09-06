"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import AssigneeCombobox, { MemberLite } from "./AssigneeCombobox";
import TagSelector, { TagLite } from "./TagSelector";
import { format } from "date-fns";
import { toast } from "sonner";

type Payload = {
  title: string;
  description?: string;
  assigneeId?: string;
  dueAt?: string;           // ISO
  tags?: { id?: string; name: string }[];
  assignedById?: string;    // current user
};

export default function NewTaskModal({
  open,
  onClose,
  mode = "create",
  initial,
  onSubmit,
  projectId,
  members = [],
  currentUserId,
  initialTags = [],
}: {
  open: boolean;
  onClose: () => void;
  mode?: "create" | "edit";
  initial?: {
    title?: string;
    description?: string;
    assigneeId?: string;
    dueAt?: string;
    tags?: TagLite[];
  } | null;
  onSubmit: (payload: Payload) => Promise<void>;
  projectId?: string;
  members?: MemberLite[];
  currentUserId?: string;
  initialTags?: TagLite[];
}) {
  const isEdit = mode === "edit";

  const [title, setTitle] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [assigneeId, setAssigneeId] = React.useState<string | undefined>(undefined);
  const [due, setDue] = React.useState<Date | undefined>(undefined);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [allTags, setAllTags] = React.useState<TagLite[]>(initialTags);
  const [selTags, setSelTags] = React.useState<TagLite[]>([]);

  React.useEffect(() => {
    if (!open) return;
    setError(null);
    if (isEdit && initial) {
      setTitle(initial.title || "");
      setDesc(initial.description || "");
      setAssigneeId(initial.assigneeId);
      setDue(initial.dueAt ? new Date(initial.dueAt) : undefined);
      setSelTags(initial.tags || []);
      // merge any initial tags into pool
      const merged = [...initialTags];
      (initial.tags || []).forEach(t => {
        if (!merged.find(m => m.name.toLowerCase() === t.name.toLowerCase())) merged.push(t);
      });
      setAllTags(merged);
    } else {
      setTitle("");
      setDesc("");
      setAssigneeId(undefined);
      setDue(undefined);
      setSelTags([]);
      setAllTags(initialTags);
    }
  }, [open, isEdit, initial, initialTags]);

  function createLocalTag(name: string): TagLite {
    const t = { id: Math.random().toString(36).slice(2), name };
    setAllTags(prev => [...prev, t]);
    return t;
  }

  async function handleSave() {
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    setSaving(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: desc || undefined,
        assigneeId,
        dueAt: due ? due.toISOString() : undefined,
        tags: selTags.map(t => ({ id: t.id, name: t.name })),
        assignedById: currentUserId,
      });
      toast.success(isEdit ? "Task updated" : "Task created", { description: title.trim() });
      onClose();
    } catch (e: any) {
      setError(e?.message || "Failed to save task.");
      toast.error("Action failed", { description: e?.message || "Please try again." });
    } finally {
      setSaving(false);
    }
  }

  const dueLabel = due ? format(due, "PPP") : "Pick a date";

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Task" : "Create Task"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="task-title">Title *</Label>
            <Input
              id="task-title"
              placeholder="Short, clear title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={80}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="task-desc">Description</Label>
            <Textarea
              id="task-desc"
              placeholder="Add details, links, acceptance criteria…"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={4}
            />
          </div>

          <div className="grid gap-2">
            <Label>Assignee</Label>
            <AssigneeCombobox
              members={members}
              value={assigneeId}
              onChange={setAssigneeId}
              placeholder="Unassigned"
            />
          </div>

          <div className="grid gap-2">
            <Label>Tags</Label>
            <TagSelector
              value={selTags}
              onChange={setSelTags}
              allTags={allTags}
              onCreateTag={createLocalTag}
              placeholder="Select or create tags"
            />
          </div>

          <div className="grid gap-2">
            <Label>Due date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("justify-start w-full", !due && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueLabel}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Calendar mode="single" selected={due} onSelect={setDue} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !title.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isEdit ? "Save" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
