const { Telegraf, Markup } = require('telegraf');
// Baad mein hum baaki files yahan import karenge: const shop = require('./shop');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.start((ctx) => {
  ctx.replyWithPhoto('https://telegra.ph/file/your-image-link.jpg', { // Yahan apni image ka link daal
    caption: `*🛒 GAMING KEY SHOP*\n\n🔑 Premium Gaming Keys Marketplace\n✅ Instant Delivery of your order.\n🥇 Trusted Automated Key Distribution\n\n👋 Welcome ${ctx.from.first_name}\n👤 ${ctx.from.id}`,
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard([
      [Markup.button.callback('• Purchase Key •', 'purchase_key')],
      [Markup.button.callback('• Account •', 'account'), Markup.button.callback('• History •', 'history')],
      [Markup.button.callback('• Deposit Fund (₹) •', 'dep_inr'), Markup.button.callback('• Deposit Fund ($) •', 'dep_usd')],
      [Markup.button.callback('• Feedback •', 'feedback')]
    ])
  });
});

bot.launch();
