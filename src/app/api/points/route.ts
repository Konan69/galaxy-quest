import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username, points }: { username: string; points: number } = body;

  try {
    const updatedUser = await prisma.user.update({
      where: { username },
      data: {
        points: {
          increment: points,
        },
      },
    });
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ message: "Error updating points", error });
  }
}
