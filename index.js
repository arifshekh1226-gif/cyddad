// index.js mein balance logic ko aise update karo
bot.action('account', async (ctx) => {
  try {
    const doc = await getDoc();
    const sheet = doc.sheetsByTitle['Users'];
    await sheet.loadHeaderRow(); // Ye line zaroori hai
    const rows = await sheet.getRows();
    
    // Yahan bot check karega ki kis row mein user ki ID hai
    const user = rows.find(r => r.get('TelegramID') == ctx.from.id);
    const bal = user ? user.get('Balance') : "0";
    
    ctx.answerCbQuery();
    ctx.reply(`Aapka Balance: ₹${bal}`);
  } catch (err) {
    console.log(err);
    ctx.reply('Error: Database load nahi ho raha.');
  }
});
