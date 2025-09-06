"use client";
import { useState } from "react";
import { mockMembers } from "@/mocks/members";

export default function AssignSelect({
  value,
  onChange,
}: { value?: string; onChange: (id?: string) => void }) {
  const [open, setOpen] = useState(false);
  const selected = mockMembers.find(m => m.id === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full rounded-md border px-3 py-2 text-left text-sm dark:bg-zinc-950 dark:border-zinc-800"
      >
        {selected ? selected.name : "Unassigned"}
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-full rounded-md border bg-white p-1 text-sm shadow dark:bg-zinc-900 dark:border-zinc-800">
          <button className="w-full px-2 py-1 text-left hover:bg-gray-100 dark:hover:bg-zinc-800"
            onClick={() => { onChange(undefined); setOpen(false); }}>Unassigned</button>
          {mockMembers.map(m => (
            <button key={m.id}
              className="w-full px-2 py-1 text-left hover:bg-gray-100 dark:hover:bg-zinc-800"
              onClick={() => { onChange(m.id); setOpen(false); }}>
              {m.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
