import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH -> update status and fields.
export async function PATCH(
  req: Request,
  { params }: { params: { id: string; taskId: string } }
) {
  try {
    const body = await req.json();
    const task = await prisma.task.update({
      where: { id: params.taskId },
      data: {
        title: body.title,
        description: body.description,
        status: body.status,
        dueAt: body.dueAt ? new Date(body.dueAt) : undefined,
        assigneeId: body.assigneeId,
      },
    });
    return NextResponse.json(task);
  } catch (err) {
    console.error("PATCH task error:", err);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}
