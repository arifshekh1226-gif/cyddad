// deposit.js
const { Markup } = require('telegraf');

function setupDeposit(bot) {
  bot.action('deposit', (ctx) => {
    ctx.answerCbQuery();
    ctx.replyWithPhoto('https://i.postimg.cc/k47v0N0R/qr-code.png', { // Yahan apna direct image link daal
      caption: '💰 *Deposit Fund*\n\n1. Is QR par payment karein.\n2. Screenshot yahan bhejein.\n3. Admin check karke balance add kar dega.',
      parse_mode: 'Markdown'
    });
  });

  bot.on('photo', async (ctx) => {
    const userId = ctx.from.id;
    const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
    
    // Admin ko notification
    await ctx.telegram.sendPhoto(process.env.ADMIN_ID, fileId, {
      caption: `⚠️ *New Deposit Request*\n👤 User: ${ctx.from.first_name}\n🆔 ID: \`${userId}\``,
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('✅ Approve Custom', `approve_custom_${userId}`)]
      ])
    });
    ctx.reply('✅ Screenshot admin ko bhej diya gaya hai. Wait for approval.');
  });
}
module.exports = { setupDeposit };
