"use client";
import { useEffect, useState } from "react";
import { addMember, getMembers, MemberLite } from "@/lib/members.api";

export default function MemberList({ projectId }: { projectId: string }) {
  const [list, setList] = useState<MemberLite[]>([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let on = true;
    (async () => {
      setLoading(true);
      try { const data = await getMembers(projectId); if (on) setList(data); }
      finally { if (on) setLoading(false); }
    })();
    return () => { on = false; };
  }, [projectId]);

  async function handleAdd() {
    if (!email.trim()) return;
    setSaving(true); setError(null);
    try {
      const m = await addMember(projectId, email.trim());
      setList(prev => [...prev, m]);
      setEmail("");
    } catch (e: any) {
      setError(e?.message || "Failed to add member");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl border p-4 dark:border-zinc-800">
      <div className="mb-3 text-sm font-semibold">Team Members</div>

      {loading ? (
        <div className="text-xs text-gray-500">Loading…</div>
      ) : (
        <ul className="space-y-2">
          {list.map(m => (
            <li key={m.id} className="flex items-center justify-between text-sm">
              <span className="truncate">
                <strong>{m.name || m.email}</strong>
                <span className="text-gray-500"> — {m.email}</span>
              </span>
              <span className="text-xs text-gray-500">{m.role || "member"}</span>
            </li>
          ))}
          {list.length === 0 && <li className="text-xs text-gray-400">No members yet.</li>}
        </ul>
      )}

      <div className="mt-4 flex gap-2">
        <input
          type="email"
          placeholder="Add by email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded-md border px-3 py-2 text-sm dark:bg-zinc-950 dark:border-zinc-800"
        />
        <button
          onClick={handleAdd}
          disabled={saving || !email.trim()}
          className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50 dark:hover:bg-gray-800"
        >
          Add
        </button>
      </div>

      {error && <div className="mt-2 text-xs text-red-500">{error}</div>}
    </div>
  );
}
