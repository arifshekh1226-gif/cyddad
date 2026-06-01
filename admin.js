const { Markup } = require('telegraf');

function setupAdmin(bot, getDoc) {
  // Admin Panel Main Menu
  bot.action('admin_panel', async (ctx) => {
    if (ctx.from.id.toString() !== process.env.ADMIN_ID) return ctx.answerCbQuery('❌ Access Denied!');
    ctx.reply('👑 Admin Panel:', Markup.inlineKeyboard([
      [Markup.button.callback('➕ Add Key', 'admin_add'), Markup.button.callback('📢 Broadcast', 'admin_broad')]
    ]));
  });

  // Add Key Logic
  bot.action('admin_add', (ctx) => ctx.reply('Type: /addkey KEYNAME PRICE'));
  bot.command('addkey', async (ctx) => {
    if (ctx.from.id.toString() !== process.env.ADMIN_ID) return;
    const args = ctx.message.text.split(' ');
    const doc = await getDoc();
    await doc.sheetsByTitle['Keys'].addRow({ Key: args[1], Status: 'Available', Price: args[2] });
    ctx.reply('✅ Key added successfully!');
  });

  // Broadcast Logic
  bot.action('admin_broad', (ctx) => ctx.reply('Type: /broadcast MESSAGE'));
  bot.command('broadcast', async (ctx) => {
    if (ctx.from.id.toString() !== process.env.ADMIN_ID) return;
    const msg = ctx.message.text.replace('/broadcast ', '');
    ctx.reply('📢 Broadcast message send ho raha hai...');
  });

  // Balance Approval Logic
  bot.action(/approve_custom_(\d+)/, (ctx) => {
    ctx.reply(`Amount bhejein (Format: /setamount ${ctx.match[1]} [AMOUNT])`);
  });

  bot.command('setamount', async (ctx) => {
    if (ctx.from.id.toString() !== process.env.ADMIN_ID) return;
    const args = ctx.message.text.split(' ');
    const userId = args[1];
    const amount = parseInt(args[2]);
    const doc = await getDoc();
    const sheet = doc.sheetsByTitle['Users'];
    const rows = await sheet.getRows();
    let userRow = rows.find(r => r.get('UserID') == userId);
    
    if (userRow) {
      userRow.set('Balance', parseInt(userRow.get('Balance') || 0) + amount);
      await userRow.save();
    } else {
      await sheet.addRow({ UserID: userId, Balance: amount });
    }
    ctx.reply(`✅ Done! ${amount} added to ${userId}`);
  });
}
module.exports = { setupAdmin };
