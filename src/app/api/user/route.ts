import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username } = body;

  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 },
    );
  }

  try {
    let user = await prisma.user.findFirst({
      where: { username },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { username },
      });
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

// You can add handlers for other HTTP methods (GET, PUT, DELETE) here as needed
