export interface Project {
  id: string;
  name: string;
  description: string;
  progress: number; // percentage of tasks completed
  teamMembers: TeamMember[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  initials: string;
}

export interface CreateProjectData {
  name: string;
  description: string;
  teamMemberEmails: string[];
}
