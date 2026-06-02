bot.action('acc_menu', async (ctx) => {
  try {
    const doc = await getDoc();
    const usersSheet = doc.sheetsByTitle['Users'];
    const keysSheet = doc.sheetsByTitle['Keys'];
    
    let userRows = await usersSheet.getRows();
    let user = userRows.find(r => r.get('TelegramID') == ctx.from.id);

    // Agar user nahi mila, toh register karo
    if (!user) {
      await usersSheet.addRow({
        TelegramID: ctx.from.id,
        Balance: 0
      });
      // Refresh user list after adding
      userRows = await usersSheet.getRows();
      user = userRows.find(r => r.get('TelegramID') == ctx.from.id);
    }

    const keyRows = await keysSheet.getRows();
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
    console.error(err);
    ctx.reply('❌ Error: Kuch gadbad ho gayi.');
  }
});
