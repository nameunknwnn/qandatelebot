import { NextRequest, NextResponse } from "next/server";
import bot from "@/lib/bot";

// Configure the runtime environment
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Check secret token
    const params = request.nextUrl.searchParams;
    const secret = params.get('secret');
    
    if (secret !== process.env.SETUP_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get request body
    const body = await request.json();
    
    const webhookUrl = body.url;
    if (!webhookUrl) {
      return NextResponse.json({ error: "Webhook URL is required" }, { status: 400 });
    }

    // Set the webhook
    await bot.api.setWebhook(webhookUrl);
    
    return NextResponse.json({ success: true, message: "Webhook set successfully" });
  } catch (error) {
    console.error("Error setting webhook:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}