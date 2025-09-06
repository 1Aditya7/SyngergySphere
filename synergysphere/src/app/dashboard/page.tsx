"use client";

import { useState, useEffect } from "react";
import { Project, CreateProjectData, TeamMember } from "@/types/project";
import { ProjectCard } from "@/components/project-card";
import { NewProjectModal } from "@/components/new-project-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Users, FolderOpen } from "lucide-react";
import { useRouter } from "next/navigation";

const mockProjects: Project[] = [
  {
    id: "1",
    name: "E-commerce Platform",
    description: "Building a modern e-commerce platform with React and Node.js. Features include user authentication, product catalog, shopping cart, and payment integration.",
    progress: 75,
    teamMembers: [
      { id: "1", name: "John Doe", email: "john@example.com", initials: "JD" },
      { id: "2", name: "Jane Smith", email: "jane@example.com", initials: "JS" },
      { id: "3", name: "Mike Johnson", email: "mike@example.com", initials: "MJ" },
    ],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "2",
    name: "Mobile App Redesign",
    description: "Complete redesign of our mobile application to improve user experience and add new features.",
    progress: 45,
    teamMembers: [
      { id: "4", name: "Sarah Wilson", email: "sarah@example.com", initials: "SW" },
      { id: "5", name: "David Brown", email: "david@example.com", initials: "DB" },
    ],
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18"),
  },
  {
    id: "3",
    name: "Data Analytics Dashboard",
    description: "Creating an interactive dashboard for business intelligence and data visualization.",
    progress: 90,
    teamMembers: [
      { id: "6", name: "Emily Davis", email: "emily@example.com", initials: "ED" },
      { id: "7", name: "Chris Lee", email: "chris@example.com", initials: "CL" },
      { id: "8", name: "Lisa Garcia", email: "lisa@example.com", initials: "LG" },
      { id: "9", name: "Tom Wilson", email: "tom@example.com", initials: "TW" },
    ],
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-19"),
  },
];

export default function Dashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(mockProjects);

  useEffect(() => {
    const filtered = projects.filter(project =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProjects(filtered);
  }, [projects, searchTerm]);

  const handleCreateProject = (data: CreateProjectData) => {
    const teamMembers: TeamMember[] = data.teamMemberEmails.map((email, index) => ({
      id: `new-${index}`,
      name: email.split('@')[0],
      email,
      initials: email.split('@')[0].substring(0, 2).toUpperCase(),
    }));

    const newProject: Project = {
      id: Date.now().toString(),
      name: data.name,
      description: data.description,
      progress: 0,
      teamMembers,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setProjects(prev => [newProject, ...prev]);
  };

  const handleProjectClick = (project: Project) => {
    router.push(`/projects/${project.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">SynergySphere</h1>
                <p className="text-sm text-muted-foreground">Team Collaboration Platform</p>
              </div>
            </div>
            <NewProjectModal onCreateProject={handleCreateProject} />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back!</h2>
          <p className="text-muted-foreground">
            Manage your projects and collaborate with your team in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center gap-3">
              <FolderOpen className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{projects.length}</p>
                <p className="text-sm text-muted-foreground">Total Projects</p>
              </div>
            </div>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">
                  {projects.reduce((acc, project) => acc + project.teamMembers.length, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Team Members</p>
              </div>
            </div>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {projects.filter(p => p.progress === 100).length}
                </p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "Try adjusting your search terms." : "Get started by creating your first project."}
            </p>
            {!searchTerm && <NewProjectModal onCreateProject={handleCreateProject} />}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => handleProjectClick(project)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
