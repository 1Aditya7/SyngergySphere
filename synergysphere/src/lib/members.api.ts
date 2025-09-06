export type MemberLite = { id: string; name?: string | null; email: string; role?: string };

export async function getMembers(projectId: string): Promise<MemberLite[]> {
  try {
    const r = await fetch(`/api/projects/${projectId}/members`, { cache: "no-store" });
    if (!r.ok) throw new Error();
    return r.json();
  } catch {
    return [
      { id: "u1", name: "Member One", email: "one@example.com" },
      { id: "u2", name: "Member Two", email: "two@example.com" },
    ];
  }
}

export async function addMember(projectId: string, email: string, role?: string): Promise<MemberLite> {
  try {
    const r = await fetch(`/api/projects/${projectId}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, role }),
    });
    if (!r.ok) throw new Error();
    return r.json();
  } catch {
    return { id: Math.random().toString(36).slice(2), name: email.split("@")[0], email, role };
  }
}
