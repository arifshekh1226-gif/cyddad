const { Markup } = require('telegraf');
const QRCode = require('qrcode');

module.exports = {
  setup: (bot) => {
    
    // 1. INR DEPOSIT (UPI)
    bot.action('dep_inr', async (ctx) => {
      await ctx.answerCbQuery();
      const upiID = 'xejaj@fam';
      const qrBuffer = await QRCode.toBuffer(`upi://pay?pa=${upiID}&pn=CY_SHOP&cu=INR`, { errorCorrectionLevel: 'H', margin: 2 });

      await ctx.editMessageMedia({
        type: 'photo',
        media: { source: qrBuffer },
        caption: `💰 *INR DEPOSIT (UPI)*\n\n*(Click ID below to copy)*\n\`${upiID}\`\n\n*Instructions:*\n1. Upar di gayi ID par click karke copy karein.\n2. Payment poori karke screenshot yahan bhejein.\n3. Screenshot ke caption mein "INR" zaroor likhein.`
      }, {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
            [Markup.button.callback('⬅️ Back to Menu', 'main_menu')]
        ])
      });
    });

    // 2. USDT DEPOSIT (TRC20)
    bot.action('dep_usd', async (ctx) => {
      await ctx.answerCbQuery();
      const address = 'TZ6gGNHMi8u8ZGkhG8c8Uwr4CSf58qFWDC';
      const qrBuffer = await QRCode.toBuffer(address, { errorCorrectionLevel: 'H', margin: 2 });

      await ctx.editMessageMedia({
        type: 'photo',
        media: { source: qrBuffer },
        caption: `💰 *USDT DEPOSIT (TRC20)*\n\n*(Click Address below to copy)*\n\`${address}\`\n\n*Instructions:*\n1. Upar diya gaya address click karke copy karein.\n2. Binance/Wallet mein TRC20 network use karein.\n3. Screenshot ke caption mein "USDT" likh kar yahan bhejein.`
      }, {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
            [Markup.button.callback('⬅️ Back to Menu', 'main_menu')]
        ])
      });
    });
  }
};
