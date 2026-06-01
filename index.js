require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// 1. Saare Modules Import karo
const shop = require('./shop');
const deposit = require('./deposit');
const account = require('./account');
const admin = require('./admin');
const feedback = require('./feedback'); // Agar hai toh

// 2. Har module ko bot ka access de do
shop.setup(bot);
deposit.setup(bot);
account.setup(bot);
admin.setup(bot);
feedback.setup(bot);

// 3. Main Menu (Jo tere screenshot jaisa dikhega)
bot.start((ctx) => {
  ctx.reply('🛒 *GAMING KEY SHOP*\n\n🔑 Premium Gaming Keys Marketplace...', {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard([
      [Markup.button.callback('• Purchase Key •', 'shop_menu')],
      [Markup.button.callback('• Account •', 'acc_menu'), Markup.button.callback('• History •', 'hist_menu')],
      [Markup.button.callback('• Deposit Fund (₹) •', 'dep_inr'), Markup.button.callback('• Deposit Fund ($) •', 'dep_usd')],
      [Markup.button.callback('• Feedback •', 'feed_menu')]
    ])
  });
});

bot.launch();
