import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    taskId,
    username,
    points,
  }: { taskId: string; username: string; points: number } = body;
  try {
    const updateTask = await prisma.user.update({
      where: { username },
      data: {
        [taskId]: true,
        points: {
          increment: points,
        },
      },
    });
    return NextResponse.json(updateTask);
  } catch (error) {
    return NextResponse.json({ message: "Error updating task", error });
  }
}
