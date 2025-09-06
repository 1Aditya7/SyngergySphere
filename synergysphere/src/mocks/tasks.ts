import { TaskLite } from "@/lib/types";

export const mockTasks: TaskLite[] = [
  {
    id: "t1",
    projectId: "demo",
    title: "Set up Tailwind",
    status: "TODO",
    dueAt: new Date(Date.now() + 86400000).toISOString(),
    assignee: { id: "u1", name: "Aditya P" },
  },
  {
    id: "t2",
    projectId: "demo",
    title: "Define Prisma models",
    status: "IN_PROGRESS",
    dueAt: new Date(Date.now() + 2 * 86400000).toISOString(),
    assignee: { id: "u2", name: "Arindam" },
  },
  {
    id: "t3",
    projectId: "demo",
    title: "Projects dashboard cards",
    status: "DONE",
    dueAt: new Date().toISOString(),
    assignee: { id: "u3", name: "Aditya V" },
  },
];
