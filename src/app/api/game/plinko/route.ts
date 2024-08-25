// File: app/api/plinko/update-balance/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils";

export async function POST(request: NextRequest) {
  const { username, betAmount, multiplier } = await request.json();

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json(
        { status: "error", message: "User not found" },
        { status: 404 },
      );
    }

    if (user.points < betAmount) {
      return NextResponse.json(
        { status: "error", message: "not enough points" },
        { status: 500 },
      );
    }

    const newBalance = user.points - betAmount + betAmount * multiplier;

    await prisma.user.update({
      where: { username },
      data: { points: newBalance },
    });

    if (!user) {
      return NextResponse.json(
        { status: "error", message: "User not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({
      newBalance,
    });
  } catch (error) {
    console.error("Error updating user balance:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to update user balance" },
      { status: 500 },
    );
  }
}
