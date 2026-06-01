const { Markup } = require('telegraf');

async function handlePurchase(ctx, getDoc) {
  try {
    const doc = await getDoc();
    const sheet = doc.sheetsByTitle['Keys'];
    await sheet.loadHeaderRow();
    const rows = await sheet.getRows();
    
    const keyRow = rows.find(r => r.get('Status') === 'Available');
    
    if (!keyRow) {
      return ctx.reply('❌ Sorry, abhi koi key available nahi hai.');
    }

    const key = keyRow.get('Key');
    keyRow.set('Status', 'Sold');
    await keyRow.save();
    
    ctx.reply(`✅ Key mil gayi!\n🔑 Key: ${key}`);
  } catch (err) {
    console.error(err);
    ctx.reply('⚠️ Error aayi hai, try again later.');
  }
}

module.exports = { handlePurchase };
