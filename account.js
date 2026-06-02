const { getDoc } = require('./database');
const { Markup } = require('telegraf');

module.exports = {
  setup: (bot) => {
    bot.action('acc_menu', async (ctx) => {
      try {
        const doc = await getDoc();
        const usersSheet = doc.sheetsByTitle['Users'];
        const keysSheet = doc.sheetsByTitle['Keys'];
        
        const userRows = await usersSheet.getRows();
        const keyRows = await keysSheet.getRows();
        
        // User dhoondo
        const user = userRows.find(r => r.get('TelegramID') == ctx.from.id);
        
        if (!user) {
          return ctx.editMessageText('❌ Tumhara account abhi register nahi hai. Pehle kuch purchase karo!');
        }

        // Uski kitni keys use hui hai?
        const myKeys = keyRows.filter(r => r.get('UsedBy') == ctx.from.id);
        
        const profileText = `👤 *YOUR ACCOUNT*\n\n` +
                            `🆔 ID: \`${ctx.from.id}\`\n` +
                            `💰 Balance: ₹${user.get('Balance')}\n` +
                            `🔑 Total Keys Purchased: ${myKeys.length}`;

        ctx.editMessageText(profileText, {
          parse_mode: 'Markdown',
          ...Markup.inlineKeyboard([
            [Markup.button.callback('⬅️ Back to Menu', 'main_menu')]
          ])
        });
      } catch (err) {
        ctx.reply('❌ Error fetching account details.');
      }
    });
  }
};
