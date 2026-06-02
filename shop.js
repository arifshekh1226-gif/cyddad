const { getDoc } = require('./database');
const { Markup } = require('telegraf');

module.exports = {
  setup: (bot) => {
    // 1. Product Selection
    bot.action('sel_fluorite', (ctx) => {
      ctx.editMessageText('💎 *FLUORITE IOS - Select Days:*', {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          [Markup.button.callback('3 Days - ₹100', 'confirm_FLUORITE_3')],
          [Markup.button.callback('7 Days - ₹200', 'confirm_FLUORITE_7')],
          [Markup.button.callback('30 Days - ₹500', 'confirm_FLUORITE_30')]
        ])
      });
    });

    bot.action('sel_migul', (ctx) => {
      ctx.editMessageText('🔥 *MIGUL IOS - Select Days:*', {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          [Markup.button.callback('1 Day - ₹50', 'confirm_MIGUL_1')],
          [Markup.button.callback('5 Days - ₹150', 'confirm_MIGUL_5')],
          [Markup.button.callback('10 Days - ₹250', 'confirm_MIGUL_10')]
        ])
      });
    });

    // 2. Purchase Confirmation Logic
    bot.action(/^confirm_(.*)_(.*)$/, async (ctx) => {
      const product = ctx.match[1]; // FLUORITE / MIGUL
      const days = ctx.match[2];    // Din
      
      // Price Mapping (yahan apne hisaab se price set kar le)
      const prices = {
        'FLUORITE': { '3': 100, '7': 200, '30': 500 },
        'MIGUL': { '1': 50, '5': 150, '10': 250 }
      };
      
      const price = prices[product][days];

      try {
        const doc = await getDoc();
        const usersSheet = doc.sheetsByTitle['Users'];
        const keysSheet = doc.sheetsByTitle['Keys'];
        
        const userRows = await usersSheet.getRows();
        const user = userRows.find(r => r.get('TelegramID') == ctx.from.id);
        
        if (!user || user.get('Balance') < price) return ctx.reply('❌ Balance kam hai!');

        const keyRows = await keysSheet.getRows();
        const keyRow = keyRows.find(r => r.get('Product') === product && r.get('Status') !== 'Used');

        if (!keyRow) return ctx.reply('❌ Stock khatam ho gaya hai!');

        // Update Balance
        user.set('Balance', parseInt(user.get('Balance')) - price);
        await user.save();

        // Update Key
        keyRow.set('Status', 'Used');
        keyRow.set('UsedBy', ctx.from.id);
        await keyRow.save();

        ctx.editMessageText(`✅ *SUCCESS!*\n\n🔑 Key: \`${keyRow.get('Key')}\`\n📅 Product: ${product} (${days} Days)\n💰 Balance Deducted: ₹${price}`);
      } catch (err) {
        ctx.reply('❌ Error: ' + err.message);
      }
    });
  }
};
