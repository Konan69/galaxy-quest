import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 },
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: { tasks: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username, inv_code }: { username: string; inv_code?: string } = body;

  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 },
    );
  }

  try {
    const user = await prisma.user.upsert({
      where: { username },
      update: {},
      create: {
        username,
        invitedBy: inv_code || undefined,
        tasks: {
          create: {}, // This will create a UserTasks record with default values
        },
      },
      include: { tasks: true },
    });

    // If there's an invitedBy, update the inviter's invites array
    if (inv_code) {
      await prisma.user.update({
        where: { id: inv_code },
        data: {
          invites: { increment: 1 },
          points: { increment: 1000 },
        },
      });
    }

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
