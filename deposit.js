const { Markup } = require('telegraf');
const QRCode = require('qrcode');

module.exports = {
  setup: (bot) => {
    // 1. Deposit Menu (Auto QR Generation)
    bot.action('dep_inr', async (ctx) => {
      try {
        await ctx.answerCbQuery();
        
        // Tumhari UPI ID yahan updated hai
        const upiID = 'xejaj@fam'; 
        const upiLink = `upi://pay?pa=${upiID}&pn=CY_SHOP&cu=INR`;

        // QR Code generate karo
        const qrBuffer = await QRCode.toBuffer(upiLink, {
          errorCorrectionLevel: 'H',
          margin: 2
        });

        // QR aur instructions bhejo
        await ctx.editMessageText('💰 *DEPOSIT BALANCE*\n\nScan this QR code to pay via any UPI app.\n\n*UPI ID:* `' + upiID + '`\n\nPayment karne ke baad, *screenshot* yahan bhejein.', {
          parse_mode: 'Markdown'
        });

        await ctx.replyWithPhoto({ source: qrBuffer }, {
          caption: '👆 Scan this QR to Pay.',
          ...Markup.inlineKeyboard([ [Markup.button.callback('⬅️ Back', 'main_menu')] ])
        });
        
      } catch (err) {
        console.error("QR Error:", err);
        ctx.reply('❌ QR generate karne mein error aaya.');
      }
    });

    // 2. Handle Payment Screenshot (Private chat only)
    bot.on('photo', async (ctx) => {
      if (ctx.chat.type !== 'private') return;
      
      try {
        const adminId = '7918372543'; // Tumhari Admin ID
        const photo = ctx.message.photo[ctx.message.photo.length - 1].file_id;
        
        // Admin ko screenshot bhejo
        await ctx.telegram.sendPhoto(adminId, photo, {
          caption: `🔔 *New Payment Request*\n👤 User: @${ctx.from.username || 'N/A'}\n🆔 ID: ${ctx.from.id}`
        });
        
        ctx.reply('✅ Screenshot admin ko bhej diya gaya hai! Admin verify karte hi balance add kar denge.');
      } catch (err) {
        console.error("Deposit Error:", err);
        ctx.reply('❌ Screenshot bhejne mein error aaya.');
      }
    });
  }
};
