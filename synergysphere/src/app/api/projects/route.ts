import { NextRequest, NextResponse } from "next/server";
import { Project, CreateProjectData, TeamMember } from "@/types/project";

// Mock database - in real app, this would be a database
let projects: Project[] = [
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

// GET /api/projects - List all projects
export async function GET() {
  try {
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const data: CreateProjectData = await request.json();
    
    // Validate required fields
    if (!data.name || !data.name.trim()) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      );
    }

    // Create team members from emails
    const teamMembers: TeamMember[] = data.teamMemberEmails.map((email, index) => ({
      id: `member-${Date.now()}-${index}`,
      name: email.split('@')[0],
      email,
      initials: email.split('@')[0].substring(0, 2).toUpperCase(),
    }));

    // Create new project
    const newProject: Project = {
      id: `project-${Date.now()}`,
      name: data.name.trim(),
      description: data.description?.trim() || "",
      progress: 0,
      teamMembers,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add to projects array
    projects.unshift(newProject);

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
