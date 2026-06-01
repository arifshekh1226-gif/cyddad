const { Markup } = require('telegraf');
function setupDeposit(bot) {
  bot.action('deposit', (ctx) => {
    ctx.answerCbQuery();
    ctx.replyWithPhoto('https://i.postimg.cc/k47v0N0R/qr-code.png', { caption: '💰 QR par payment karein.' });
  });
  bot.on('photo', async (ctx) => {
    await ctx.telegram.sendPhoto(process.env.ADMIN_ID, ctx.message.photo[0].file_id, {
      caption: `⚠️ New Deposit\nUser: ${ctx.from.first_name}\nID: ${ctx.from.id}`,
      ...Markup.inlineKeyboard([[Markup.button.callback('✅ Approve Custom', `approve_custom_${ctx.from.id}`)]])
    });
    ctx.reply('✅ Screenshot bhej diya hai.');
  });
}
module.exports = { setupDeposit };
