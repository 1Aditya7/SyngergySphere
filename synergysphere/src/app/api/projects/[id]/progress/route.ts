import { NextRequest, NextResponse } from "next/server";

const mockProgressData: Record<string, number> = {
  "1": 75,
  "2": 45,
  "3": 90,
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    
    
    const progress = mockProgressData[projectId] || 0;
    
    return NextResponse.json({
      projectId,
      progress,
      totalTasks: 100,
      completedTasks: Math.round((progress / 100) * 100),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch project progress" },
      { status: 500 }
    );
  }
}
