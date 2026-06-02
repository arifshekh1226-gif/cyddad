const { Markup } = require('telegraf');

module.exports = {
  setup: (bot) => {
    // Deposit Menu
    bot.action('dep_inr', (ctx) => {
      ctx.editMessageText('💰 *DEPOSIT BALANCE*\n\nUPI: `your_upi@oksbi`\n\nPayment ka screenshot yahan bhejein.', {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([ [Markup.button.callback('⬅️ Back', 'main_menu')] ])
      });
    });

    // Handle Photos (Screenshot)
    bot.on('photo', async (ctx) => {
      try {
        const adminId = '7918372543'; // Yahan apni ID daal
        const photo = ctx.message.photo[ctx.message.photo.length - 1].file_id;
        
        await ctx.telegram.sendPhoto(adminId, photo, {
          caption: `🔔 *New Payment Request*\nUser: @${ctx.from.username || 'N/A'}\nID: ${ctx.from.id}`
        });
        
        ctx.reply('✅ Screenshot admin ko bhej diya gaya hai!');
      } catch (err) {
        console.error("Deposit Error:", err);
        ctx.reply('❌ Error: Payment bhejte waqt problem aayi.');
      }
    });
  }
};
