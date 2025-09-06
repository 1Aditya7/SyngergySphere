"use client";
import { useMemo, useState } from "react";
import { format, isWithinInterval } from "date-fns";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, X } from "lucide-react";
import type { TaskLite, TaskStatus } from "@/lib/types";
import type { MemberLite } from "./AssigneeCombobox";
import type { TagLite } from "./TagSelector";
import { cn } from "@/lib/utils";

export type Filters = {
  q?: string;
  status?: TaskStatus | "ALL";
  assigneeId?: string | "ALL";
  tagId?: string | "ALL";
  from?: Date | null;
  to?: Date | null;
};

export default function FiltersBar({
  members,
  tags,
  onChange,
}: {
  members: MemberLite[];
  tags: TagLite[];
  onChange: (f: Filters) => void;
}) {
  const [f, setF] = useState<Filters>({ status: "ALL", assigneeId: "ALL", tagId: "ALL", from: null, to: null });

  function update(patch: Partial<Filters>) {
    const next = { ...f, ...patch };
    setF(next);
    onChange(next);
  }

  return (
    <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center">
      <Input
        placeholder="Search title/description…"
        className="md:w-56"
        value={f.q || ""}
        onChange={(e) => update({ q: e.target.value })}
      />

      <Select value={f.status || "ALL"} onValueChange={(v) => update({ status: v as any })}>
        <SelectTrigger className="w-44"><SelectValue placeholder="Status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Statuses</SelectItem>
          <SelectItem value="TODO">To-Do</SelectItem>
          <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
          <SelectItem value="DONE">Done</SelectItem>
        </SelectContent>
      </Select>

      <Select value={f.assigneeId || "ALL"} onValueChange={(v) => update({ assigneeId: v as any })}>
        <SelectTrigger className="w-48"><SelectValue placeholder="Assignee" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Anyone</SelectItem>
          {members.map(m => <SelectItem key={m.id} value={m.id}>{m.name || m.email}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={f.tagId || "ALL"} onValueChange={(v) => update({ tagId: v as any })}>
        <SelectTrigger className="w-44"><SelectValue placeholder="Tag" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All tags</SelectItem>
          {tags.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
        </SelectContent>
      </Select>

      {/* Date range */}
      <div className="flex items-center gap-2">
        <DateBtn label="From" date={f.from} onChange={(d)=>update({ from: d })} />
        <DateBtn label="To" date={f.to} onChange={(d)=>update({ to: d })} />
        {(f.from || f.to) && (
          <Button variant="ghost" size="icon" onClick={()=>update({ from: null, to: null })}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

function DateBtn({ label, date, onChange }: { label: string; date?: Date | null; onChange: (d: Date | null) => void; }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("w-36 justify-start", !date && "text-muted-foreground")}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PP") : label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Calendar mode="single" selected={date ?? undefined} onSelect={(d)=>onChange(d ?? null)} initialFocus />
      </PopoverContent>
    </Popover>
  );
}
