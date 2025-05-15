import { NextRequest, NextResponse } from "next/server";
import bot from "@/lib/bot";

// Configure the runtime environment
export const runtime = 'nodejs'; // Changed from 'edge' to 'nodejs' since we're using Prisma

// Handle Telegram webhook requests
export async function POST(request: NextRequest) {
  try {
    // Get the request body as JSON
    const update = await request.json();
    
    // Process the webhook update with grammY
    await bot.handleUpdate(update);
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error in webhook handler:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}