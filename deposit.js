// deposit.js
const { Markup } = require('telegraf');

function setupDeposit(bot) {
  // Deposit button click
  bot.action('deposit', (ctx) => {
    ctx.answerCbQuery();
    ctx.replyWithPhoto('https://i.postimg.cc/k47v0N0R/qr-code.png', {
      caption: '💰 Payment karein aur screenshot yahan bhejein.'
    });
  });

  // Photo handle
  bot.on('photo', async (ctx) => {
    const userId = ctx.from.id;
    const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
    
    await ctx.telegram.sendPhoto(process.env.ADMIN_ID, fileId, {
      caption: `⚠️ New Deposit Request\nUser: ${ctx.from.first_name}\nID: ${userId}`,
      ...Markup.inlineKeyboard([
        [Markup.button.callback('✅ Approve Custom', `approve_custom_${userId}`)]
      ])
    });
    ctx.reply('✅ Screenshot admin ko bhej diya hai.');
  });
}
module.exports = { setupDeposit }; // <--- Ye line bhoolna mat!
