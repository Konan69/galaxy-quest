// File: app/api/check-membership/route.js

import TelegramBot from "node-telegram-bot-api";
import { NextRequest, NextResponse } from "next/server";
const token = process.env.TELEGRAM_BOT_TOKEN!;

// Replace 'YOUR_BOT_TOKEN' with your actual Telegram Bot Token
const bot = new TelegramBot(token, { polling: false });

async function checkUserInGroup(userId: number, groupId: TelegramBot.ChatId) {
  try {
    const chatMember = await bot.getChatMember(groupId, userId);

    // Check if the user is a member, admin, or creator of the group/channel
    const validStatuses = ["member", "administrator", "creator"];
    return validStatuses.includes(chatMember.status);
  } catch (error) {
    console.error("Error checking user membership:", error);
    return false;
  }
}

export async function GET(req: NextRequest) {
  const userId = Number(req.nextUrl.searchParams.get("userId"));
  const groupId = req.nextUrl.searchParams.get("groupId") as string | number;

  if (!userId || !groupId) {
    return NextResponse.json(
      { error: "Missing userId or groupId" },
      { status: 400 },
    );
  }

  const isUserInGroup = await checkUserInGroup(userId, groupId);

  return NextResponse.json({ isUserInGroup });
}
