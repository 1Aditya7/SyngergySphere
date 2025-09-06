import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET -> load all tasks
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tasks = await prisma.task.findMany({
      where: { projectId: params.id },
      include: { assignee: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(tasks);
  } catch (err) {
    console.error("GET tasks error:", err);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

// POST -> create new tasks
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const task = await prisma.task.create({
      data: {
        title: body.title,
        description: body.description || "",
        projectId: params.id,
        status: "TODO",
        dueAt: body.dueAt ? new Date(body.dueAt) : null,
        assigneeId: body.assigneeId || null,
      },
    });
    return NextResponse.json(task);
  } catch (err) {
    console.error("POST task error:", err);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
