export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export interface UserLite {
  id: string;
  name?: string;
  email?: string;
}

export interface TaskLite {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  dueAt?: string;         // ISO string for simplicity
  assignee?: UserLite | null;
  createdAt?: string;
  updatedAt?: string;
}
