import { NextRequest, NextResponse } from "next/server";

// Mock progress data - in real app, this would calculate from tasks
const mockProgressData: Record<string, number> = {
  "1": 75,
  "2": 45,
  "3": 90,
};

// GET /api/projects/[id]/progress - Get project progress
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    
    // In a real app, you would:
    // 1. Fetch the project from database
    // 2. Count total tasks
    // 3. Count completed tasks
    // 4. Calculate percentage
    
    const progress = mockProgressData[projectId] || 0;
    
    return NextResponse.json({
      projectId,
      progress,
      totalTasks: 100, // Mock data
      completedTasks: Math.round((progress / 100) * 100), // Mock calculation
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch project progress" },
      { status: 500 }
    );
  }
}
