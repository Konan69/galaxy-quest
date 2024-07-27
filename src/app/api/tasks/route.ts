import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils";
import { Prisma } from "@prisma/client";

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
    console.error("Error updating task:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { message: `Database error: ${error.message}` },
        { status: 400 },
      );
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      return NextResponse.json(
        { message: "Invalid data provided" },
        { status: 400 },
      );
    } else {
      return NextResponse.json(
        { message: "An unexpected error occurred" },
        { status: 500 },
      );
    }
  }
}
