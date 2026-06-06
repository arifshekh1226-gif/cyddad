// 1. INR Deposit (UPI)
bot.action('dep_inr', async (ctx) => {
  try {
    await ctx.answerCbQuery();
    const upiID = 'xejaj@fam';
    const upiLink = `upi://pay?pa=${upiID}&pn=CY_SHOP&cu=INR`;
    const qrBuffer = await QRCode.toBuffer(upiLink, { errorCorrectionLevel: 'H', margin: 2 });

    await ctx.editMessageMedia({
        type: 'photo',
        media: { source: qrBuffer },
        caption: `💰 *INR DEPOSIT (UPI)*\n\nUPI ID: \`${upiID}\`\n\n*Deposit Steps:*\n1. QR code scan karein.\n2. Payment poori karein.\n3. Screenshot yahan bhejein.`
    }, {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
            [Markup.button.callback('📋 Copy UPI ID', 'copy_upi')],
            [Markup.button.callback('⬅️ Back', 'main_menu')]
        ])
    });
  } catch (err) { console.error(err); }
});

// 2. USDT Deposit (TRC20)
bot.action('dep_usd', async (ctx) => {
  try {
    await ctx.answerCbQuery();
    const walletAddress = 'TZ6gGNHMi8u8ZGkhG8c8Uwr4CSf58qFWDC';
    const qrBuffer = await QRCode.toBuffer(walletAddress, { errorCorrectionLevel: 'H', margin: 2 });

    await ctx.editMessageMedia({
        type: 'photo',
        media: { source: qrBuffer },
        caption: `💰 *USDT DEPOSIT (TRC20)*\n\nAddress: \`${walletAddress}\`\n\n*Deposit Steps:*\n1. Scan QR code.\n2. Transfer USDT (TRC20 network).\n3. Send screenshot here.`
    }, {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
            [Markup.button.callback('📋 Copy Address', 'copy_usdt')],
            [Markup.button.callback('⬅️ Back', 'main_menu')]
        ])
    });
  } catch (err) { console.error(err); }
});

// 3. Handle Copy Actions
bot.action('copy_upi', (ctx) => {
    ctx.answerCbQuery('UPI ID Copied: xejaj@fam', { show_alert: true });
});

bot.action('copy_usdt', (ctx) => {
    ctx.answerCbQuery('Address Copied: TZ6gGNHMi8u8ZGkhG8c8Uwr4CSf58qFWDC', { show_alert: true });
});
