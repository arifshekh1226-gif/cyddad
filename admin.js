const { Markup } = require('telegraf');
function setupAdmin(bot, getDoc) {
  bot.action('admin_panel', async (ctx) => {
    if (ctx.from.id.toString() !== process.env.ADMIN_ID) return;
    ctx.reply('👑 Admin Panel:', Markup.inlineKeyboard([
      [Markup.button.callback('➕ Add Key', 'admin_add'), Markup.button.callback('📢 Broadcast', 'admin_broad')]
    ]));
  });

  bot.action(/approve_custom_(\d+)/, (ctx) => ctx.reply(`Amount: /setamount ${ctx.match[1]} [AMOUNT]`));

  bot.command('setamount', async (ctx) => {
    if (ctx.from.id.toString() !== process.env.ADMIN_ID) return;
    const [_, userId, amount] = ctx.message.text.split(' ');
    const doc = await getDoc();
    const sheet = doc.sheetsByTitle['Users'];
    const rows = await sheet.getRows();
    let row = rows.find(r => r.get('UserID') == userId);
    if(row) row.set('Balance', parseInt(row.get('Balance') || 0) + parseInt(amount));
    else await sheet.addRow({ UserID: userId, Balance: amount });
    await row ? row.save() : null;
    ctx.reply(`✅ Added ${amount} to ${userId}`);
  });
}
module.exports = { setupAdmin };
