"use client";

import * as React from "react";
import { Check, ChevronsUpDown, UserRound } from "lucide-react";
import { cn } from "@/lib/utils"; // shadcn util; if missing, export a simple cn = (...a)=>a.filter(Boolean).join(" ")
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type MemberLite = { id: string; name?: string | null; email: string };

export default function AssigneeCombobox({
  members,
  value,
  onChange,
  placeholder = "Select assignee",
}: {
  members: MemberLite[];
  value?: string;
  onChange: (id?: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const selected = members.find((m) => m.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className="w-full justify-between">
          <span className="truncate flex items-center gap-2">
            <UserRound className="h-4 w-4" />
            {selected ? selected.name || selected.email : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command shouldFilter>
          <CommandInput placeholder="Search members..." />
          <CommandList>
            <CommandEmpty>No members found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                key="__unassigned__"
                value="__unassigned__"
                onSelect={() => {
                  onChange(undefined);
                  setOpen(false);
                }}
              >
                <span className="flex items-center gap-2">
                  <UserRound className="h-4 w-4" />
                  Unassigned
                </span>
              </CommandItem>
              {members.map((m) => (
                <CommandItem
                  key={m.id}
                  value={(m.name || m.email || "").toLowerCase()}
                  onSelect={() => {
                    onChange(m.id);
                    setOpen(false);
                  }}
                >
                  <span className="flex items-center gap-2 truncate">
                    <UserRound className="h-4 w-4" />
                    {m.name || m.email}
                  </span>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === m.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
