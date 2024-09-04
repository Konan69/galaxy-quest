import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils"; // Adjust the import based on your setup

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    username,
    itemKey,
    price,
  }: { username: string; itemKey: string; price: number } = body;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.points < price) {
      return NextResponse.json(
        { error: "Insufficient points" },
        { status: 400 },
      );
    }

    const updateShop = await prisma.$transaction([
      prisma.userPurchases.update({
        where: { username },
        data: {
          [itemKey]: true,
        },
      }),
      prisma.user.update({
        where: { username },
        data: {
          points: {
            decrement: price,
          },
        },
        include: { tasks: true, purchases: true },
      }),
    ]);

    return NextResponse.json(updateShop[1]);
  } catch (error) {
    console.error("Error processing purchase:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
