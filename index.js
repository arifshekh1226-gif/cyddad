require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// 1. Saare Modules Import karo
const shop = require('./shop');
const deposit = require('./deposit');
const account = require('./account');
const admin = require('./admin');
const feedback = require('./feedback');

// 2. Har module ko bot ka access de do
shop.setup(bot);
deposit.setup(bot);
account.setup(bot);
admin.setup(bot);
feedback.setup(bot);

// --- MAINFUNCTION: Back Button Handler (Sabke liye) ---
bot.action('main_menu', async (ctx) => {
  try {
    await ctx.answerCbQuery();
    
    // Yahan error handling add ki hai
    await ctx.editMessageText('🛒 *CY SHOP - MAIN MENU*\n\nWelcome back! Choose an option below to get started:', {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('• Purchase Key •', 'shop_menu')],
        [Markup.button.callback('• Account •', 'acc_menu'), Markup.button.callback('• History •', 'hist_menu')],
        [Markup.button.callback('• Deposit Fund (₹) •', 'dep_inr'), Markup.button.callback('• Deposit Fund ($) •', 'dep_usd')],
        [Markup.button.callback('• Feedback •', 'feed_menu')]
      ])
    });
  } catch (err) {
    // Agar error "no text to edit" hai, toh ignore karo, baaki errors print karo
    if (err.description !== 'Bad Request: there is no text in the message to edit') {
      console.error('Error in main_menu:', err);
    }
  }
});

// 3. Welcome Message (Start Command)
bot.start((ctx) => {
  const welcomeText = `👋 *Hello ${ctx.from.first_name}!*

Welcome to *CY SHOP* 🎮
The most reliable and fastest marketplace for Premium Gaming Keys.

🔹 *Instant Delivery*
🔹 *24/7 Automated Service*
🔹 *Best Market Prices*

Click below to explore our products!`;

  ctx.reply(welcomeText, {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard([
      [Markup.button.callback('• Purchase Key •', 'shop_menu')],
      [Markup.button.callback('• Account •', 'acc_menu'), Markup.button.callback('• History •', 'hist_menu')],
      [Markup.button.callback('• Deposit Fund (₹) •', 'dep_inr'), Markup.button.callback('• Deposit Fund ($) •', 'dep_usd')],
      [Markup.button.callback('• Feedback •', 'feed_menu')]
    ])
  });
});

// Graceful Shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

bot.launch().then(() => console.log('✅ Bot is running...'));
