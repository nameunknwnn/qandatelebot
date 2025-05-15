import { Bot, Context, session, SessionFlavor } from "grammy";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "./db";
import { SYSTEM_PROMPT } from "./geminiPrompt";

// Initialize Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Define session data interface
interface SessionData {
  lastQuery?: string;
}

// Create a custom context type that includes session data
type BotContext = Context & SessionFlavor<SessionData>;

// Create a bot instance with the proper context type
export const bot = new Bot<BotContext>(process.env.TELEGRAM_BOT_TOKEN || "");

// Use session to store user data (with proper typing)
bot.use(session({
  initial: (): SessionData => ({
    lastQuery: undefined
  })
}));

// Handle the /start command
bot.command("start", async (ctx) => {
  await ctx.reply(
    "👋 Hello! I'm a Gemini-powered bot. Use /q followed by your question to ask me anything!"
  );
});

// Handle the /q command
bot.command("q", async (ctx) => {
  try {
    // Extract the query (remove the /q part)
    const query = ctx.message?.text?.replace(/^\/q\s*/i, "").trim();
    
    if (!query) {
      await ctx.reply("Please provide a question after /q");
      return;
    }
    
    // Store the query in the session
    ctx.session.lastQuery = query;
    
    // Send a "thinking" message
    await ctx.reply("Thinking...");
    
    // Generate a response using Gemini with system prompt
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Create a chat session with the system prompt
    const chat = model.startChat({
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
      history: [
        { role: "user", parts: [{ text: "System: " + SYSTEM_PROMPT }] },
        { role: "model", parts: [{ text: "I understand my role and will follow these guidelines." }] },
      ],
    });
    
    // Send user query to the chat
    const result = await chat.sendMessage(query);
    const response = result.response.text();
    
    // Save the query and response to the database
    await prisma.query.create({
      data: {
        userId: ctx.from?.id.toString() || "unknown",
        username: ctx.from?.username || null,
        query,
        response,
      },
    });
    
    // Send the response
    await ctx.reply(response);
  } catch (error) {
    console.error("Error processing query:", error);
    await ctx.reply("Sorry, I encountered an error processing your request.");
  }
});

// Handle text messages (not commands)
bot.on("message:text", async (ctx) => {
  await ctx.reply("Please use /q followed by your question to ask me something!");
});

// Export the bot instance
export default bot;