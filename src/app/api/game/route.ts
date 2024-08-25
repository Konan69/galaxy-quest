import { NextRequest, NextResponse } from "next/server";
import { outcomes } from "./outcomes";
import { prisma } from "@/lib/utils";

type MultiplierType = {
  [key: number]: number;
};

type RiskMultipliers = {
  Low: MultiplierType;
  Medium: MultiplierType;
  High: MultiplierType;
};

const TOTAL_DROPS = 16;

const MULTIPLIERS: RiskMultipliers = {
  Low: {
    0: 16,
    1: 9,
    2: 2,
    3: 1.4,
    4: 1.4,
    5: 1.2,
    6: 1.1,
    7: 1,
    8: 0.5,
    9: 1,
    10: 1.1,
    11: 1.2,
    12: 1.4,
    13: 1.4,
    14: 2,
    15: 9,
    16: 16,
  },
  Medium: {
    0: 110,
    1: 41,
    2: 10,
    3: 5,
    4: 3,
    5: 1.5,
    6: 1,
    7: 0.5,
    8: 0.3,
    9: 0.5,
    10: 1,
    11: 1.5,
    12: 3,
    13: 5,
    14: 10,
    15: 41,
    16: 110,
  },
  High: {
    0: 1000,
    1: 130,
    2: 26,
    3: 9,
    4: 4,
    5: 2,
    6: 0.2,
    7: 0.2,
    8: 0.2,
    9: 0.2,
    10: 0.2,
    11: 2,
    12: 4,
    13: 9,
    14: 26,
    15: 130,
    16: 1000,
  },
};

export async function POST(request: NextRequest) {
  const { username, riskLevel, userBalance, betAmount } = await request.json();
  let outcome = 0;
  const pattern: string[] = [];

  // Special cases for 0 and 17
  for (let i = 0; i < TOTAL_DROPS; i++) {
    if (Math.random() > 0.5) {
      pattern.push("R");
      outcome++;
    } else {
      pattern.push("L");
    }
  }

  const multiplier =
    MULTIPLIERS[riskLevel as keyof typeof MULTIPLIERS][
      outcome as keyof (typeof MULTIPLIERS)[keyof typeof MULTIPLIERS]
    ];
  const possibleOutcomes = outcomes[outcome] || [outcome]; // Fallback for 0 and 17
  const newBalance = userBalance - betAmount + betAmount * multiplier;

  try {
    // const updatedUser = await prisma.user.update({
    //   where: { username },
    //   data: { points: newBalance },
    //   include: { tasks: true },
    // });
    const point =
      possibleOutcomes[Math.floor(Math.random() * possibleOutcomes.length)];
    console.log("point:", point);
    return NextResponse.json({
      point,
      multiplier,
      pattern,
      riskLevel,

      // updatedUser,
    });
  } catch (error) {
    console.error("Error updating user balance:", error);
    NextResponse.json({ status: "error", message: error });
  }
}
