"use client";
import * as React from "react";
import { Plus, Tag, Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type TagLite = { id: string; name: string };

export default function TagSelector({
  value,
  onChange,
  allTags,
  onCreateTag,
  placeholder = "Select or create tags",
}: {
  value: TagLite[];                           // selected tags
  onChange: (next: TagLite[]) => void;
  allTags: TagLite[];                         // available tags
  onCreateTag: (name: string) => TagLite;     // create immediately (mock/local)
  placeholder?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const isSelected = (t: TagLite) => value.some(v => v.id === t.id);
  const toggle = (t: TagLite) => {
    if (isSelected(t)) onChange(value.filter(v => v.id !== t.id));
    else onChange([...value, t]);
  };

  const canCreate = query.trim().length > 0 && !allTags.some(t => t.name.toLowerCase() === query.trim().toLowerCase());

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className="w-full justify-between">
          <span className="truncate flex items-center gap-2">
            <Tag className="h-4 w-4" />
            {value.length ? value.map(v => v.name).join(", ") : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command shouldFilter>
          <CommandInput placeholder="Search or type to create…" value={query} onValueChange={setQuery} />
          <CommandList>
            <CommandEmpty>
              {canCreate ? (
                <button
                  className="flex w-full items-center gap-2 px-2 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-zinc-800"
                  onClick={() => {
                    const created = onCreateTag(query.trim());
                    onChange([...value, created]);
                    setQuery("");
                    setOpen(false);
                  }}
                >
                  <Plus className="h-4 w-4" /> Create “{query.trim()}”
                </button>
              ) : (
                <span>No tags found.</span>
              )}
            </CommandEmpty>
            <CommandGroup>
              {allTags.map((t) => (
                <CommandItem key={t.id} value={t.name.toLowerCase()} onSelect={() => toggle(t)}>
                  <span className="flex items-center gap-2 truncate">
                    <Tag className="h-4 w-4" />
                    {t.name}
                  </span>
                  <Check className={cn("ml-auto h-4 w-4", isSelected(t) ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
