const { Markup } = require('telegraf');

module.exports = {
  setup: (bot) => {
    // 1. Menu dikhao (FLUORITE vs MIGUL)
    bot.action('shop_menu', (ctx) => {
      ctx.editMessageText('🛒 *SELECT PRODUCT:*', {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          [Markup.button.callback('💎 FLUORITE IOS', 'sel_fluorite')],
          [Markup.button.callback('🔥 MIGUL IOS', 'sel_migul')]
        ])
      });
    });

    // 2. Product select karte hi Days dikhao
    bot.action(['sel_fluorite', 'sel_migul'], (ctx) => {
      const product = ctx.match[0] === 'sel_fluorite' ? 'FLUORITE IOS' : 'MIGUL IOS';
      ctx.editMessageText(`📦 *${product}*\nSelect Days:`, {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          [Markup.button.callback('3 Days - ₹100', `confirm_${product}_3`)],
          [Markup.button.callback('7 Days - ₹200', `confirm_${product}_7`)]
        ])
      });
    });

    // 3. Confirm Purchase (Balance check aur Key generation)
    bot.action(/^confirm_(.*)_(.*)$/, async (ctx) => {
      const match = ctx.match; // [full, product, days]
      const product = match[1];
      const days = match[2];

      // Yahan Database check karo (Balance kaatne ke liye)
      // Pseudo-code logic:
      // const user = await getBalance(ctx.from.id);
      // if (user.balance >= price) {
      //    const key = generateKey();
      //    ctx.editMessageText(`✅ Success! Key: ${key}`);
      // } else {
      //    ctx.reply('❌ Insufficient balance!');
      // }
      
      ctx.answerCbQuery('Processing...');
      ctx.reply(`✅ Confirm Purchase: ${product} for ${days} days?\n\nBalance cut ho jayega aur key mil jayegi!`);
    });
  }
};
