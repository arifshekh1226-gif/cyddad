const { getDoc } = require('./database');

module.exports = {
  setup: (bot) => {
    bot.action('acc_menu', async (ctx) => {
      const doc = await getDoc();
      const sheet = doc.sheetsByTitle['Users'];
      const rows = await sheet.getRows();
      const user = rows.find(r => r.get('UserID') == ctx.from.id);
      
      const balance = user ? user.get('Balance') : 0;
      ctx.editMessageText(`👤 *ACCOUNT DASHBOARD*\n\n💰 Balance: ₹${balance}`, { parse_mode: 'Markdown' });
    });
  }
};
