// deposit.js
const { Markup } = require('telegraf');

function setupDeposit(bot) {
  // Jab button dabaaye
  bot.action('deposit', (ctx) => {
    ctx.replyWithPhoto('https://i.postimg.cc/63XQc9wg/IMG-20260601-162334-289.jpg', {
      caption: '💰 Is QR par payment karein aur screenshot yahan bhejein.'
    });
  });

  // Jab screenshot aaye
  bot.on('photo', async (ctx) => {
    await ctx.telegram.sendPhoto(process.env.ADMIN_ID, ctx.message.photo[0].file_id, {
      caption: `⚠️ New Deposit from ${ctx.from.first_name}\nID: ${ctx.from.id}`
    });
    ctx.reply('✅ Screenshot admin ko bhej diya hai.');
  });
}

module.exports = { setupDeposit };
