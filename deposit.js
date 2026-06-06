const { Markup } = require('telegraf');
const QRCode = require('qrcode');

module.exports = {
  setup: (bot) => {
    
    // 1. INR Deposit (UPI) - Hinglish
    bot.action('dep_inr', async (ctx) => {
      await ctx.answerCbQuery();
      const upiID = xejaj@fam;
      const qrBuffer = await QRCode.toBuffer(`upi://pay?pa=${upiID}&pn=CY_SHOP&cu=INR`, { errorCorrectionLevel: 'H', margin: 2 });

      await ctx.editMessageMedia({
        type: 'photo',
        media: { source: qrBuffer },
        caption: `💰 *INR DEPOSIT (UPI)*\n\nUPI ID: \`${upiID}\`\n*(ID par click karke copy karein)*\n\n*Instructions:*\n1. Upar di gayi UPI ID copy karein.\n2. Payment poori karke screenshot yahan bhejein.\n3. Screenshot ke caption mein "INR" likhna na bhoolein.`
      }, {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
            [Markup.button.callback('⬅️ Back to Menu', 'main_menu')]
        ])
      });
    });

    // 2. USDT Deposit (TRC20) - English
    bot.action('dep_usd', async (ctx) => {
      await ctx.answerCbQuery();
      const address = TZ6gGNHMi8u8ZGkhG8c8Uwr4CSf58qFWDC;
      const qrBuffer = await QRCode.toBuffer(address, { errorCorrectionLevel: 'H', margin: 2 });

      await ctx.editMessageMedia({
        type: 'photo',
        media: { source: qrBuffer },
        caption: `💰 *USDT DEPOSIT (TRC20)*\n\nAddress: \`${address}\`\n*(Click address to copy)*\n\n*Instructions:*\n1. Copy the address above.\n2. Send USDT using TRC20 network only.\n3. Send the payment screenshot with "USDT" in the caption.`
      }, {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
            [Markup.button.callback('⬅️ Back to Menu', 'main_menu')]
        ])
      });
    });
  }
};
