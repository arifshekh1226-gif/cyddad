// Man lo tumne admin ID kisi config file ya constant mein rakha hai
const ADMIN_ID = process.env.ADMIN_ID || '7918372543'; // Yahan apna ID dalna

module.exports = {
  setup: (bot) => {
    // 1. Deposit Menu
    bot.action('deposit_menu', (ctx) => {
      ctx.editMessageText(
        '💰 *DEPOSIT BALANCE*\n\n' +
        'UPI ID: `example@upi`\n\n' +
        'Payment karne ke baad screenshot yahan send karein.', 
        {
          parse_mode: 'Markdown',
          ...Markup.inlineKeyboard([
            [Markup.button.callback('⬅️ Back', 'main_menu')]
          ])
        }
      );
    });

    // 2. Screenshot handle karna
    bot.on('photo', async (ctx) => {
      // User ko confirmation
      ctx.reply('✅ Screenshot admin ko bhej diya gaya hai. Wait for verification!');
      
      // Admin ko screenshot aur details forward karna
      await ctx.telegram.sendPhoto(ADMIN_ID, ctx.message.photo[ctx.message.photo.length - 1].file_id, {
        caption: `🔔 *New Deposit*\nFrom: @${ctx.from.username || 'NoUsername'} (${ctx.from.id})`
      });
    });
  }
};
