const { Telegraf, Markup } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// /start command - Menu dikhane ke liye
bot.start((ctx) => {
  ctx.reply('Welcome to Key Shopping Bot! 🛒', Markup.inlineKeyboard([
    [Markup.button.callback('Purchase Key', 'purchase_key')],
    [Markup.button.callback('Account', 'account'), Markup.button.callback('History', 'history')],
    [Markup.button.callback('Deposit Fund', 'deposit')]
  ]));
});

// Button ka action (Jab koi click kare)
bot.action('purchase_key', (ctx) => {
  ctx.reply('Select your game:', Markup.inlineKeyboard([
    [Markup.button.callback('KOS CARROM', 'carrom')],
    [Markup.button.callback('KOS 8BP', '8bp')]
  ]));
});

bot.launch();
console.log("Bot is running with Buttons...");
