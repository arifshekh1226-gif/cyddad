// deposit.js
async function handleDeposit(ctx) {
  ctx.reply('📸 Please apne payment ka screenshot bhejiye, hum verification ke baad balance add kar denge.');
}

async function handlePhoto(ctx, bot) {
  // Yeh admin ko photo bhej dega
  const photo = ctx.message.photo[ctx.message.photo.length - 1].file_id;
  await ctx.telegram.sendPhoto(process.env.ADMIN_ID, photo, {
    caption: `⚠️ New Deposit Request\nUser: ${ctx.from.username || ctx.from.first_name}\nID: ${ctx.from.id}`
  });
  ctx.reply('✅ Screenshot recieved! Admin verification ke baad balance update ho jayega.');
}

module.exports = { handleDeposit, handlePhoto };
