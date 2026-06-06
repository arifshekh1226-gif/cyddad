const { Markup } = require('telegraf');
const QRCode = require('qrcode');

module.exports = {
  setup: (bot) => {
    
    // --- 1. INR (UPI) ---
    bot.action('dep_inr', async (ctx) => {
      await ctx.answerCbQuery();
      const upiID = 'xejaj@fam';
      const qrBuffer = await QRCode.toBuffer(`upi://pay?pa=${upiID}&pn=CY_SHOP&cu=INR`, { errorCorrectionLevel: 'H', margin: 2 });

      await ctx.editMessageMedia({
        type: 'photo',
        media: { source: qrBuffer },
        caption: `💰 *INR DEPOSIT (UPI)*\n\n*Instructions:*\n1. QR scan karein ya "Copy UPI" button dabayein.\n2. Payment poori karein.\n3. Payment hone ke baad screenshot bhejein aur caption mein "INR" likhein.`
      }, {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
            [Markup.button.callback('📋 Copy UPI ID', 'copy_upi')],
            [Markup.button.callback('⬅️ Back', 'main_menu'), Markup.button.callback('🔄 Restart', 'start_cmd')]
        ])
      });
    });

    // --- 2. USDT (TRC20) ---
    bot.action('dep_usd', async (ctx) => {
      await ctx.answerCbQuery();
      const address = 'TZ6gGNHMi8u8ZGkhG8c8Uwr4CSf58qFWDC';
      const qrBuffer = await QRCode.toBuffer(address, { errorCorrectionLevel: 'H', margin: 2 });

      await ctx.editMessageMedia({
        type: 'photo',
        media: { source: qrBuffer },
        caption: `💰 *USDT DEPOSIT (TRC20)*\n\n*Instructions:*\n1. "Copy Address" button dabayein.\n2. Binance/Wallet mein TRC20 network select karein.\n3. Address paste karke send karein.\n4. Screenshot bhejein aur caption mein "USDT" likhein.`
      }, {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
            [Markup.button.callback('📋 Copy Address', 'copy_usdt')],
            [Markup.button.callback('⬅️ Back', 'main_menu'), Markup.button.callback('🔄 Restart', 'start_cmd')]
        ])
      });
    });

    // --- 3. Alerts (Copy logic) ---
    bot.action('copy_upi', (ctx) => ctx.answerCbQuery('UPI ID: xejaj@fam\n(Long press to copy this text)', { show_alert: true }));
    bot.action('copy_usdt', (ctx) => ctx.answerCbQuery('Address: TZ6gGNHMi8u8ZGkhG8c8Uwr4CSf58qFWDC\n(Long press to copy this text)', { show_alert: true }));
  }
};
