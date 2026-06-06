const { Markup } = require('telegraf');
const QRCode = require('qrcode');

module.exports = {
  setup: (bot) => {
    
    // --- 1. INR DEPOSIT (UPI) ---
    bot.action('dep_inr', async (ctx) => {
      await ctx.answerCbQuery();
      const upiID = 'xejaj@fam';
      const qrBuffer = await QRCode.toBuffer(`upi://pay?pa=${upiID}&pn=CY_SHOP&cu=INR`, { errorCorrectionLevel: 'H', margin: 2 });

      await ctx.editMessageMedia({
        type: 'photo',
        media: { source: qrBuffer },
        caption: `💰 *INR DEPOSIT (UPI)*\n\nUPI ID: \`${upiID}\`\n\n*Steps:*\n1. Scan QR.\n2. Pay & Screenshot.\n3. Send here with caption "INR".`
      }, {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
            [Markup.button.callback('⬅️ Back to Menu', 'main_menu')],
            [Markup.button.callback('🔄 Restart Bot', 'start_cmd')]
        ])
      });
    });

    // --- 2. USDT DEPOSIT (TRC20) ---
    bot.action('dep_usd', async (ctx) => {
      await ctx.answerCbQuery();
      const address = 'TZ6gGNHMi8u8ZGkhG8c8Uwr4CSf58qFWDC';
      const qrBuffer = await QRCode.toBuffer(address, { errorCorrectionLevel: 'H', margin: 2 });

      await ctx.editMessageMedia({
        type: 'photo',
        media: { source: qrBuffer },
        caption: `💰 *USDT DEPOSIT (TRC20)*\n\nAddress:\n\`${address}\`\n\n*Steps:*\n1. Copy address.\n2. Pay (TRC20 only).\n3. Send here with caption "USDT".`
      }, {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
            [Markup.button.callback('⬅️ Back to Menu', 'main_menu')],
            [Markup.button.callback('🔄 Restart Bot', 'start_cmd')]
        ])
      });
    });

    // --- 3. HANDLER: Photos ---
    bot.on('photo', async (ctx) => {
      if (ctx.chat.type !== 'private') return;
      const adminId = '7918372543';
      const photo = ctx.message.photo.pop().file_id;
      const note = ctx.message.caption || 'No Note';
      
      await ctx.telegram.sendPhoto(adminId, photo, {
        caption: `🔔 *New Payment*\nUser: @${ctx.from.username || 'N/A'}\nMode: ${note}`
      });
      ctx.reply('✅ Proof sent! Admin will verify soon.');
    });
  }
};
