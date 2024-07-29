import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils";
import { Prisma } from "@prisma/client";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username, wallet }: { username: string; wallet: string } = body;
  try {
    const updatewallet = await prisma.user.update({
      where: { username },
      data: {
        wallet,
      },
    });
    return NextResponse.json(updatewallet);
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
