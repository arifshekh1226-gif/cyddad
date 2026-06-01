require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const fs = require('fs');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

async function getDoc() {
  const creds = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  const auth = new JWT({ email: creds.client_email, key: creds.private_key, scopes: ['https://www.googleapis.com/auth/spreadsheets'] });
  const doc = new GoogleSpreadsheet(process.env.SHEET_ID, auth);
  await doc.loadInfo();
  return doc;
}

// PLUGIN LOADER: Ye loop har file ko khud load kar lega
const pluginFiles = fs.readdirSync('./plugins').filter(file => file.endsWith('.js'));
for (const file of pluginFiles) {
  const plugin = require(`./plugins/${file}`);
  plugin.setup(bot, getDoc); 
  console.log(`Loaded plugin: ${file}`);
}

bot.start((ctx) => {
  ctx.reply('🛒 MENU:', Markup.inlineKeyboard([
    [Markup.button.callback('• Purchase •', 'purchase_key')],
    [Markup.button.callback('• Deposit •', 'deposit'), Markup.button.callback('👑 Admin', 'admin_panel')]
  ]));
});

bot.launch();
