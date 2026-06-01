require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

// Apni files ko yahan import karo
const { setupDeposit } = require('./deposit');
const { setupAdmin } = require('./admin');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

async function getDoc() {
  const creds = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  const auth = new JWT({ email: creds.client_email, key: creds.private_key, scopes: ['https://www.googleapis.com/auth/spreadsheets'] });
  const doc = new GoogleSpreadsheet(process.env.SHEET_ID, auth);
  await doc.loadInfo();
  return doc;
}

// Features load karo
setupDeposit(bot);
setupAdmin(bot, getDoc);

bot.start((ctx) => {
  ctx.reply('🛒 MENU:', Markup.inlineKeyboard([
    [Markup.button.callback('• Purchase •', 'purchase_key')],
    [Markup.button.callback('• Deposit •', 'deposit'), Markup.button.callback('👑 Admin', 'admin_panel')]
  ]));
});

bot.launch();
