require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const { handlePurchase } = require('./shop'); // Yahan import karna zaroori hai

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

// UI Menu
bot.start((ctx) => {
  ctx.reply(`*🛒 GAMING KEY SHOP*\n\n👋 Welcome ${ctx.from.first_name}`, {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard([
      [Markup.button.callback('• Purchase Key •', 'purchase_key')],
      [Markup.button.callback('• Account •', 'account'), Markup.button.callback('• History •', 'history')]
    ])
  });
});

// Shop Action
bot.action('purchase_key', async (ctx) => {
  await handlePurchase(ctx, getDoc);
});

bot.launch();
