const { Telegraf, Markup } = require('telegraf');
const { GoogleSpreadsheet } = require('google-spreadsheet');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const doc = new GoogleSpreadsheet(process.env.SHEET_ID);

// Initialize Sheet
async function initSheet() {
  const creds = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
}

// /start menu
bot.start(async (ctx) => {
  await initSheet();
  ctx.reply('Welcome! Chuno kya karna hai:', Markup.inlineKeyboard([
    [Markup.button.callback('💰 Balance Check', 'account')],
    [Markup.button.callback('🛒 Buy Key', 'purchase_key')]
  ]));
});

// Balance check logic
bot.action('account', async (ctx) => {
  await initSheet();
  const sheet = doc.sheetsByTitle['Users'];
  const rows = await sheet.getRows();
  const user = rows.find(r => r.TelegramID == ctx.from.id);
  
  const bal = user ? user.Balance : "0";
  ctx.answerCbQuery();
  ctx.reply(`Aapka Balance: ₹${bal}`);
});

bot.launch();
console.log("Bot fully connected with Google Sheets!");
