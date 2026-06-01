const { Telegraf, Markup } = require('telegraf');
const { GoogleSpreadsheet } = require('google-spreadsheet');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const doc = new GoogleSpreadsheet(process.env.SHEET_ID);

// Google Sheet connection setup
async function initSheet() {
  const creds = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  await doc.useServiceAccountAuth({
    client_email: creds.client_email,
    private_key: creds.private_key,
  });
  await doc.loadInfo();
}

// /start menu
bot.start(async (ctx) => {
  ctx.reply('Welcome! Chuno kya karna hai:', Markup.inlineKeyboard([
    [Markup.button.callback('💰 Balance Check', 'account')],
    [Markup.button.callback('🛒 Buy Key', 'purchase_key')],
    [Markup.button.callback('💳 Deposit Fund', 'deposit')]
  ]));
});

// Balance check logic
bot.action('account', async (ctx) => {
  try {
    await initSheet();
    const sheet = doc.sheetsByTitle['Users'];
    const rows = await sheet.getRows();
    const user = rows.find(r => r.TelegramID == ctx.from.id);
    const bal = user ? user.Balance : "0";
    ctx.answerCbQuery();
    ctx.reply(`Aapka Balance: ₹${bal}`);
  } catch (err) {
    console.error(err);
    ctx.reply('Error: Database load nahi ho raha.');
  }
});

// Deposit logic
bot.action('deposit', (ctx) => {
  ctx.answerCbQuery();
  ctx.reply('Payment karne ke liye UPI ID: example@upi\nScreenshot yahan send karein.');
});

bot.launch();
console.log("Bot is running perfectly!");
