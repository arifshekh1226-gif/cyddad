const { Telegraf, Markup } = require('telegraf');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

async function getDoc() {
  const creds = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  const serviceAccountAuth = new JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const doc = new GoogleSpreadsheet(process.env.SHEET_ID, serviceAccountAuth);
  await doc.loadInfo();
  return doc;
}

bot.start((ctx) => {
  ctx.reply('Bot chal raha hai! Chuno:', Markup.inlineKeyboard([
    [Markup.button.callback('💰 Balance Check', 'account')]
  ]));
});

bot.action('account', async (ctx) => {
  try {
    const doc = await getDoc();
    const sheet = doc.sheetsByTitle['Users'];
    await sheet.loadHeaderRow();
    const rows = await sheet.getRows();
    const user = rows.find(r => r.get('TelegramID') == ctx.from.id);
    const bal = user ? user.get('Balance') : "0";
    ctx.answerCbQuery();
    ctx.reply(`Aapka Balance: ₹${bal}`);
  } catch (err) {
    console.log(err);
    ctx.reply('Error: Sheet se connection nahi hua.');
  }
});

bot.launch();
console.log("Bot update ho gaya hai!");
