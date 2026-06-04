const { getDoc } = require('./database');

module.exports = {
  setup: (bot) => {
    const isAdmin = (ctx) => ctx.from.id.toString() === process.env.ADMIN_ID;

    // --- 1. PRODUCT MANAGEMENT (Sahi Columns ke saath) ---
    bot.command('addproduct', async (ctx) => {
      if (!isAdmin(ctx)) return;
      const data = ctx.message.text.split(' ').slice(1).join(' ');
      if (!data) return ctx.reply('Format: `/addproduct Product|Days|Price`', { parse_mode: 'Markdown' });
      const [product, days, price] = data.split('|');
      try {
        const doc = await getDoc();
        await doc.sheetsByTitle['Products'].addRow({ Product: product, Days: days, Price: price });
        ctx.reply(`✅ Product '${product}' add ho gaya!`);
      } catch (err) { ctx.reply('❌ Error: ' + err.message); }
    });

    bot.command('delproduct', async (ctx) => {
      if (!isAdmin(ctx)) return;
      const name = ctx.message.text.split(' ')[1];
      try {
        const doc = await getDoc();
        const rows = await doc.sheetsByTitle['Products'].getRows();
        const row = rows.find(r => r.get('Product') == name);
        if (row) { await row.delete(); ctx.reply(`✅ Product ${name} delete ho gaya.`); }
        else ctx.reply('❌ Product nahi mila.');
      } catch (err) { ctx.reply('❌ Error: ' + err.message); }
    });

    bot.command('editproduct', async (ctx) => {
      if (!isAdmin(ctx)) return;
      const data = ctx.message.text.split(' ').slice(1).join(' ');
      if (!data) return ctx.reply('Format: `/editproduct Product|NewDays|NewPrice`', { parse_mode: 'Markdown' });
      const [product, newDays, newPrice] = data.split('|');
      try {
        const doc = await getDoc();
        const rows = await doc.sheetsByTitle['Products'].getRows();
        const row = rows.find(r => r.get('Product') == product);
        if (row) { 
          row.set('Days', newDays); 
          row.set('Price', newPrice); 
          await row.save(); 
          ctx.reply(`✅ Product ${product} update ho gaya!`); 
        } else ctx.reply('❌ Product nahi mila.');
      } catch (err) { ctx.reply('❌ Error: ' + err.message); }
    });

    // --- 2. KEYS & BALANCE MANAGEMENT ---
    bot.command('addbalance', async (ctx) => {
      if (!isAdmin(ctx)) return;
      const args = ctx.message.text.split(' ');
      try {
        const doc = await getDoc();
        const sheet = doc.sheetsByTitle['Users'];
        const rows = await sheet.getRows();
        let user = rows.find(r => r.get('TelegramID') == args[1]);
        if (user) { user.set('Balance', parseInt(user.get('Balance') || 0) + parseInt(args[2])); await user.save(); }
        else { await sheet.addRow({ TelegramID: args[1], Balance: args[2] }); }
        ctx.reply(`✅ Balance updated for ${args[1]}`);
      } catch (err) { ctx.reply('❌ Error: ' + err.message); }
    });

    bot.command('addkey', async (ctx) => {
      if (!isAdmin(ctx)) return;
      const args = ctx.message.text.split(' ');
      try {
        const doc = await getDoc();
        await doc.sheetsByTitle['Keys'].addRow({ Product: args[1], Days: args[2], Key: args[3], Status: 'Available' });
        ctx.reply(`✅ Key added for ${args[1]}`);
      } catch (err) { ctx.reply('❌ Error: ' + err.message); }
    });

    bot.command('delkey', async (ctx) => {
      if (!isAdmin(ctx)) return;
      const idx = parseInt(ctx.message.text.split(' ')[1]);
      try {
        const doc = await getDoc();
        const rows = await doc.sheetsByTitle['Keys'].getRows();
        if (rows[idx - 1]) { await rows[idx - 1].delete(); ctx.reply(`✅ Key ${idx} deleted.`); }
        else ctx.reply('❌ Invalid index.');
      } catch (err) { ctx.reply('❌ Error: ' + err.message); }
    });

    bot.command('broadcast', async (ctx) => {
      if (!isAdmin(ctx)) return;
      const msg = ctx.message.text.split('/broadcast ')[1];
      const doc = await getDoc();
      const rows = await doc.sheetsByTitle['Users'].getRows();
      for (const row of rows) { try { await bot.telegram.sendMessage(row.get('TelegramID'), msg); } catch (e) {} }
      ctx.reply('✅ Broadcast done.');
    });
  }
};
