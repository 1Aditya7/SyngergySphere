"use client";
import { useState } from "react";
import MembersModal from "@/components/members/MembersModal";

export default function ProjectDetail({ params }: { params: { id: string } }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Project</h1>
        <button
          onClick={() => setOpen(true)}
          className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          Add Members
        </button>
      </div>

      {/* dashboard content here */}

      <MembersModal open={open} onClose={() => setOpen(false)} projectId={params.id} />
    </div>
  );
}
