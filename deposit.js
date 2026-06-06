const { Markup } = require('telegraf');
const QRCode = require('qrcode');

module.exports = {
  setup: (bot) => {
    
    // INR Deposit
    bot.action('dep_inr', async (ctx) => {
      await ctx.answerCbQuery();
      const upiID = 'xejaj@fam'; 
      const qrBuffer = await QRCode.toBuffer(`upi://pay?pa=${upiID}&pn=CY_SHOP&cu=INR`, { errorCorrectionLevel: 'H', margin: 2 });
      
      await ctx.replyWithPhoto({ source: qrBuffer }, {
        caption: `💰 *INR DEPOSIT (UPI)*\n\nUPI: \`${upiID}\`\n\nSteps:\n1. Copy UPI ID.\n2. Pay & take Screenshot.\n3. Send screenshot with caption "INR"`,
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([[Markup.button.callback('⬅️ Back', 'main_menu')]])
      });
    });

    // USDT Deposit
    bot.action('dep_usd', async (ctx) => {
      await ctx.answerCbQuery();
      const address = 'TZ6gGNHMi8u8ZGkhG8c8Uwr4CSf58qFWDC';
      const qrBuffer = await QRCode.toBuffer(address, { errorCorrectionLevel: 'H', margin: 2 });

      await ctx.replyWithPhoto({ source: qrBuffer }, {
        caption: `💰 *USDT DEPOSIT (TRC20)*\n\nAddress: \`${address}\`\n\nSteps:\n1. Copy Address.\n2. Pay via TRC20 network.\n3. Send screenshot with caption "USDT"`,
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([[Markup.button.callback('⬅️ Back', 'main_menu')]])
      });
    });

    // Screenshot Handler
    bot.on('photo', async (ctx) => {
      if (ctx.chat.type !== 'private') return;
      const adminId = '7918372543';
      const photo = ctx.message.photo.pop().file_id;
      const note = ctx.message.caption || 'No Note';
      
      await ctx.telegram.sendPhoto(adminId, photo, {
        caption: `🔔 *New Payment*\nUser: @${ctx.from.username || 'N/A'}\nMode: ${note}`
      });
      ctx.reply('✅ Proof sent to admin!');
    });
  }
};
