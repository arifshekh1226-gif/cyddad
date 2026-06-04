const { getDoc } = require('./database');
const { Markup } = require('telegraf');

module.exports = {
  setup: (bot) => {
    
    bot.action('shop_menu', async (ctx) => {
      try {
        const doc = await getDoc();
        const rows = await doc.sheetsByTitle['Products'].getRows();
        const uniqueProducts = [...new Set(rows.map(r => r.get('Product')))];
        const buttons = uniqueProducts.map(p => [Markup.button.callback(p, `sel_${p}`)]);
        buttons.push([Markup.button.callback('⬅️ Back', 'main_menu')]);

        ctx.editMessageText('🛒 *SELECT PRODUCT:*', {
          parse_mode: 'Markdown',
          ...Markup.inlineKeyboard(buttons)
        });
      } catch (err) { ctx.reply('❌ Error loading shop.'); }
    });

    bot.action(/^sel_(.+)$/, async (ctx) => {
      const product = ctx.match[1];
      const doc = await getDoc();
      const rows = await doc.sheetsByTitle['Products'].getRows();
      
      const productOptions = rows.filter(r => r.get('Product') === product);
      const buttons = productOptions.map(r => [
        Markup.button.callback(`${r.get('Days')} Days - ₹${r.get('Price')}`, `confirm_${product}_${r.get('Days')}`)
      ]);
      buttons.push([Markup.button.callback('⬅️ Back to Shop', 'shop_menu')]);

      ctx.editMessageText(`📦 *${product}*\nSelect Options:`, {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard(buttons)
      });
    });

    bot.action(/^confirm_(.*)_(.*)$/, async (ctx) => {
      const product = ctx.match[1];
      const days = ctx.match[2];

      try {
        const doc = await getDoc();
        const priceRows = await doc.sheetsByTitle['Products'].getRows();
        const priceRow = priceRows.find(r => r.get('Product') === product && r.get('Days') == days);
        const price = parseInt(priceRow.get('Price'));

        const userRows = await doc.sheetsByTitle['Users'].getRows();
        const user = userRows.find(r => r.get('TelegramID') == ctx.from.id);
        
        if (!user || parseInt(user.get('Balance')) < price) return ctx.reply('❌ Insufficient balance!');

        const keyRows = await doc.sheetsByTitle['Keys'].getRows();
        
        // --- ROBUST MATCHING FIX ---
        // Ye logic ab sheet ke product naam ko 'includes' se check karega
        const keyRow = keyRows.find(r => {
            const sheetProd = r.get('Product') ? r.get('Product').toString().trim() : "";
            return sheetProd.includes(product) && r.get('Status') === 'Available';
        });

        if (!keyRow) return ctx.reply('❌ Stock khatam ho gaya hai! (No key found for ' + product + ')');

        user.set('Balance', parseInt(user.get('Balance')) - price);
        await user.save();
        keyRow.set('Status', 'Used');
        keyRow.set('UsedBy', ctx.from.id);
        await keyRow.save();

        ctx.editMessageText(`✅ *SUCCESS!*\n\n🔑 Key: \`${keyRow.get('Key')}\`\n💰 Balance: ₹${user.get('Balance')}`);

        try {
          const salesChannelId = '@CY_SHOP_SALES'; 
          const salesMessage = `💼 *TRANSACTION PROOF*\n━━━━━━━━━━━━━━\n✅ *NEW SALE COMPLETED*\n\n👤 *Customer Details*\n• Name: ${ctx.from.first_name}\n• ID: \`${ctx.from.id}\`\n\n📦 *Order Details*\n• Game: ${product}\n• Duration: ${days} Days\n• Amount: ₹${price}\n• Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}\n━━━━━━━━━━━━━━\n🤖 *Powered by @CY_SHOP_BOT*`;
          await bot.telegram.sendMessage(salesChannelId, salesMessage, { parse_mode: 'Markdown' });
        } catch (e) { console.log('Channel post error:', e); }

      } catch (err) { ctx.reply('❌ Error: ' + err.message); }
    });
  }
};
