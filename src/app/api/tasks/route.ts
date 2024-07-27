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
    const updateTask = await prisma.$transaction([
      prisma.userTasks.update({
        where: { username },
        data: {
          [taskId]: true,
        },
      }),
      prisma.user.update({
        where: { username },
        data: {
          points: {
            increment: points,
          },
        },
        include: { tasks: true },
      }),
    ]);

    return NextResponse.json(updateTask[1]);
  } catch (error) {
    return NextResponse.json({ message: "Error updating task", error });
  }
}
