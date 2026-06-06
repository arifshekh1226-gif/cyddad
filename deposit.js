const { Markup } = require('telegraf');
const QRCode = require('qrcode');

module.exports = {
  setup: (bot) => {
    
    // 1. INR Deposit (UPI) - Hindi Instructions
    bot.action('dep_inr', async (ctx) => {
      try {
        await ctx.answerCbQuery();
        const upiID = 'xejaj@fam'; 
        const upiLink = `upi://pay?pa=${upiID}&pn=CY_SHOP&cu=INR`;
        const qrBuffer = await QRCode.toBuffer(upiLink, { errorCorrectionLevel: 'H', margin: 2 });

        try { await ctx.deleteMessage(); } catch (e) {}

        await ctx.replyWithPhoto({ source: qrBuffer }, {
          caption: `💰 *INR DEPOSIT (UPI)*\n\nUPI ID: \`${upiID}\`\n\n*Deposit Steps:*\n1. QR code scan karein ya UPI ID copy karein.\n2. Payment poori karein.\n3. Payment hone ke baad screenshot yahan bhejein.\n\n⚠️ Screenshot bhejte waqt "INR" zaroor likhein.`,
          parse_mode: 'Markdown',
          ...Markup.inlineKeyboard([[Markup.button.callback('⬅️ Back', 'main_menu')]])
        });
      } catch (err) { ctx.reply('❌ Error generating QR.'); }
    });

    // 2. USDT Deposit (TRC20) - English Instructions
    bot.action('dep_usd', async (ctx) => {
      try {
        await ctx.answerCbQuery();
        const walletAddress = 'TZ6gGNHMi8u8ZGkhG8c8Uwr4CSf58qFWDC';
        const qrBuffer = await QRCode.toBuffer(`tron:${walletAddress}`, { errorCorrectionLevel: 'H', margin: 2 });

        try { await ctx.deleteMessage(); } catch (e) {}

        await ctx.replyWithPhoto({ source: qrBuffer }, {
          caption: `💰 *USDT DEPOSIT (TRC20)*\n\nAddress: \`${walletAddress}\`\n\n*Deposit Steps:*\n1. Scan the QR code or copy the wallet address.\n2. Transfer USDT using TRC20 network only.\n3. Send the payment screenshot here.\n\n⚠️ Note: Mention "USDT" when sending the screenshot.`,
          parse_mode: 'Markdown',
          ...Markup.inlineKeyboard([[Markup.button.callback('⬅️ Back', 'main_menu')]])
        });
      } catch (err) { ctx.reply('❌ Error generating USDT QR.'); }
    });

    // 3. Handle Payment Screenshots
    bot.on('photo', async (ctx) => {
      if (ctx.chat.type !== 'private') return;
      
      try {
        const adminId = '7918372543';
        const photo = ctx.message.photo[ctx.message.photo.length - 1].file_id;
        const userNote = ctx.message.caption || 'No Method Specified';
        
        await ctx.telegram.sendPhoto(adminId, photo, {
          caption: `🔔 *New Payment Proof Received*\n👤 User: @${ctx.from.username || 'No Username'}\n🆔 ID: ${ctx.from.id}\n💳 Payment Mode: ${userNote}\n\n*Verify karke Balance add karein.*`
        });
        
        ctx.reply('✅ Screenshot Admin ko bhej diya gaya hai! Verify hote hi balance update ho jayega.');
      } catch (err) {
        ctx.reply('❌ Screenshot bhejne mein error aaya.');
      }
    });
  }
};
