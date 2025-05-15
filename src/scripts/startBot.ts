const dotenv = require('dotenv'); // Use CommonJS style require for dotenv
const path = require('path');
const { fileURLToPath } = require('url'); // Although not used, you might need this for resolving __filename
const bot = require('../lib/bot');

// Load environment variables from .env file
dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
});

async function startBot() {
  console.log("Starting bot in polling mode...");
  
  try {
    console.log("Bot token available:", !!process.env.TELEGRAM_BOT_TOKEN);
    console.log("Gemini API key available:", !!process.env.GEMINI_API_KEY);
    
    // Remove any existing webhook
    await bot.api.deleteWebhook();
    
    // Start the bot in polling mode
    await bot.start();
    
    console.log("Bot is running in polling mode!");
  } catch (error) {
    console.error("Error in bot startup:", error);
  }
}

startBot().catch((err) => {
  console.error("Error starting bot:", err);
  process.exit(1);
});
