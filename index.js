bot.start((ctx) => {
  ctx.reply(`*🛒 GAMING KEY SHOP*\n\n🔑 Premium Gaming Keys Marketplace\n✅ Instant Delivery of your order.\n🥇 Trusted Automated Key Distribution\n\n👋 Welcome ${ctx.from.first_name}`, {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard([
      [Markup.button.callback('• Purchase Key •', 'purchase_key')],
      [Markup.button.callback('• Account •', 'account'), Markup.button.callback('• History •', 'history')],
      [Markup.button.callback('• Deposit Fund (₹) •', 'dep_inr'), Markup.button.callback('• Deposit Fund ($) •', 'dep_usd')],
      [Markup.button.callback('• Feedback •', 'feedback')]
    ])
  });
});
