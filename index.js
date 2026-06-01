require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Import Plugins
const shop = require('./shop');
const deposit = require('./deposit');
const account = require('./account');
const admin = require('./admin');

// Initialize Plugins
shop.setup(bot);
deposit.setup(bot);
account.setup(bot);
admin.setup(bot);

bot.start((ctx) => {
  ctx.reply('🛒 MENU:', Markup.inlineKeyboard([
      [Markup.button.callback('• Purchase Key •', 'shop_menu')],
      [Markup.button.callback('• Account •', 'acc_menu'), Markup.button.callback('• History •', 'hist_menu')],
      [Markup.button.callback('• Deposit Fund (₹) •', 'dep_inr'), Markup.button.callback('• Deposit Fund ($) •', 'dep_usd')],
      [Markup.button.callback('• Feedback •', 'feed_menu')]
  ]));
});

bot.launch();
