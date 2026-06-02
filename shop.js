const { getDoc } = require('./database');
const { Markup } = require('telegraf');

module.exports = {
  setup: (bot) => {
    // 1. Shop Menu: Product Selection
    bot.action('shop_menu', (ctx) => {
      ctx.editMessageText('🛒 *SELECT PRODUCT:*', {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          [Markup.button.callback('💎 FLUORITE IOS', 'sel_fluorite')],
          [Markup.button.callback('🔥 MIGUL IOS', 'sel_migul')],
          [Markup.button.callback('⬅️ Back', 'main_menu')]
        ])
      });
    });

    // 2. Product select kiya toh Days dikhao (Prices sheet se fetch kar ke)
    bot.action(['sel_fluorite', 'sel_migul'], async (ctx) => {
      const product = ctx.match[0] === 'sel_fluorite' ? 'FLUORITE' : 'MIGUL';
      
      const doc = await getDoc();
      const pricesSheet = doc.sheetsByTitle['Prices'];
      const priceRows = await pricesSheet.getRows();
      
      // Is product ke liye saare available days filter karo
      const productPrices = priceRows.filter(r => r.get('Product') === product);

      const buttons = productPrices.map(r => [
        Markup.button.callback(`${r.get('Days')} Days - ₹${r.get('Price')}`, `confirm_${product}_${r.get('Days')}`)
      ]);
      buttons.push([Markup.button.callback('⬅️ Back to Shop', 'main_menu')]);

      ctx.editMessageText(`📦 *${product} IOS*\nSelect Days:`, {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard(buttons)
      });
    });

    // 3. Purchase Confirmation
    bot.action(/^confirm_(.*)_(.*)$/, async (ctx) => {
      const product = ctx.match[1];
      const days = ctx.match[2];

      try {
        const doc = await getDoc();
        const usersSheet = doc.sheetsByTitle['Users'];
        const keysSheet = doc.sheetsByTitle['Keys'];
        const pricesSheet = doc.sheetsByTitle['Prices'];
        
        // Price get karo
        const priceRows = await pricesSheet.getRows();
        const priceRow = priceRows.find(r => r.get('Product') === product && r.get('Days') == days);
        const price = parseInt(priceRow.get('Price'));

        // Balance check karo
        const userRows = await usersSheet.getRows();
        const user = userRows.find(r => r.get('TelegramID') == ctx.from.id);
        
        if (!user || parseInt(user.get('Balance')) < price) {
          return ctx.reply('❌ Insufficient balance!');
        }

        // Key check karo
        const keyRows = await keysSheet.getRows();
        const keyRow = keyRows.find(r => r.get('Product') === product && r.get('Status') !== 'Used');

        if (!keyRow) return ctx.reply('❌ Stock khatam ho gaya hai!');

        // Transaction
        user.set('Balance', parseInt(user.get('Balance')) - price);
        await user.save();

        keyRow.set('Status', 'Used');
        keyRow.set('UsedBy', ctx.from.id);
        await keyRow.save();

        ctx.editMessageText(`✅ *SUCCESS!*\n\n🔑 Key: \`${keyRow.get('Key')}\`\n💰 Balance: ₹${user.get('Balance')}`);
      } catch (err) {
        ctx.reply('❌ Error: ' + err.message);
      }
    });
  }
};
