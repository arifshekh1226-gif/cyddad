const { Markup } = require('telegraf');
const QRCode = require('qrcode');

module.exports = {
  setup: (bot) => {
    
    // 1. INR Deposit (UPI)
    bot.action('dep_inr', async (ctx) => {
      try {
        await ctx.answerCbQuery();
        const upiID = 'xejaj@fam'; 
        const upiLink = `upi://pay?pa=${upiID}&pn=CY_SHOP&cu=INR`;

        const qrBuffer = await QRCode.toBuffer(upiLink, { errorCorrectionLevel: 'H', margin: 2 });

        await ctx.editMessageText('💰 *INR DEPOSIT (UPI)*\n\nScan this QR to pay.\n*UPI ID:* `' + upiID + '`\n\nPayment ka screenshot yahan bhejein.', { parse_mode: 'Markdown' });
        await ctx.replyWithPhoto({ source: qrBuffer }, { caption: '👆 Scan QR to Pay.', ...Markup.inlineKeyboard([[Markup.button.callback('⬅️ Back', 'main_menu')]]) });
      } catch (err) { ctx.reply('❌ Error generating QR.'); }
    });

    // 2. USDT Deposit (TRC20)
    bot.action('dep_usd', async (ctx) => {
      try {
        await ctx.answerCbQuery();
        const walletAddress = 'TZ6gGNHMi8u8ZGkhG8c8Uwr4CSf58qFWDC';
        const qrBuffer = await QRCode.toBuffer(walletAddress, { errorCorrectionLevel: 'H', margin: 2 });

        const text = `💰 *USDT DEPOSIT (TRC20)*\n\nScan QR or copy address:\n\`${walletAddress}\`\n\nPayment ka screenshot yahan bhejein.`;
        
        await ctx.editMessageText(text, { parse_mode: 'Markdown' });
        await ctx.replyWithPhoto({ source: qrBuffer }, { caption: '👆 Scan QR to Pay.', ...Markup.inlineKeyboard([[Markup.button.callback('⬅️ Back', 'main_menu')]]) });
      } catch (err) { ctx.reply('❌ Error generating USDT QR.'); }
    });

    // 3. Handle Payment Screenshots (INR & USDT)
    bot.on('photo', async (ctx) => {
      if (ctx.chat.type !== 'private') return;
      
      try {
        const adminId = '7918372543';
        const photo = ctx.message.photo[ctx.message.photo.length - 1].file_id;
        
        await ctx.telegram.sendPhoto(adminId, photo, {
          caption: `🔔 *New Payment Request*\n👤 User: @${ctx.from.username || 'No Username'}\n🆔 ID: ${ctx.from.id}\n\n*Verify karke Balance add karein.*`
        });
        
        ctx.reply('✅ Screenshot Admin ko bhej diya gaya hai! Verify hote hi balance update ho jayega.');
      } catch (err) {
        ctx.reply('❌ Screenshot bhejne mein error aaya.');
      }
    });
  }
};
