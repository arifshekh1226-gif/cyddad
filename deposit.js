const { Markup } = require('telegraf');

function setupDeposit(bot) {
  // Button click handle
  bot.action('deposit', (ctx) => {
    ctx.answerCbQuery();
    ctx.replyWithPhoto('https://postimg.cc/QBfsxZFJ', {
      caption: '💰 Payment karein aur screenshot yahan bhejein.'
    });
  });

  // Photo receive handle
  bot.on('photo', async (ctx) => {
    // Check agar admin ko bhej rahe hain (Sirf deposit ke liye)
    await ctx.telegram.sendPhoto(process.env.ADMIN_ID, ctx.message.photo[0].file_id, {
      caption: `⚠️ New Deposit from ${ctx.from.first_name}\nID: ${ctx.from.id}`
    });
    ctx.reply('✅ Screenshot admin ko bhej diya hai.');
  });
}

module.exports = { setupDeposit };
