require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const { setupDeposit } = require('./deposit'); // <-- Nayi file import ki

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Deposit logic ko connect kiya
setupDeposit(bot); 

async function getDoc() {
  const creds = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  const auth = new JWT({ email: creds.client_email, key: creds.private_key, scopes: ['https://www.googleapis.com/auth/spreadsheets'] });
  const doc = new GoogleSpreadsheet(process.env.SHEET_ID, auth);
  await doc.loadInfo();
  return doc;
}

bot.start((ctx) => {
  ctx.reply(`*🛒 GAMING KEY SHOP*\n\n👋 Welcome ${ctx.from.first_name}`, {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard([
      [Markup.button.callback('• Purchase Key •', 'purchase_key')],
      [Markup.button.callback('• Deposit Fund •', 'deposit'), Markup.button.callback('• History •', 'history')],
      [Markup.button.callback('👑 Admin Panel', 'admin_panel')]
    ])
  });
});

// Purchase Logic
bot.action('purchase_key', async (ctx) => {
  try {
    const doc = await getDoc();
    const rows = await doc.sheetsByTitle['Keys'].getRows();
    const keyRow = rows.find(r => r.get('Status') === 'Available');
    if (!keyRow) return ctx.reply('❌ No keys available.');
    keyRow.set('Status', 'Sold');
    await keyRow.save();
    ctx.reply(`✅ Key mil gayi: ${keyRow.get('Key')}`);
  } catch (e) { ctx.reply('Error: Bot busy hai.'); }
});

// Admin Panel Logic
bot.action('admin_panel', async (ctx) => {
  if (ctx.from.id.toString() !== process.env.ADMIN_ID) return ctx.answerCbQuery('❌ Access Denied!');
  ctx.reply('👑 Admin Panel:', Markup.inlineKeyboard([
    [Markup.button.callback('➕ Add Key', 'admin_add'), Markup.button.callback('📢 Broadcast', 'admin_broad')]
  ]));
});

bot.action('admin_add', (ctx) => ctx.reply('Type: /addkey KEYNAME PRICE'));
bot.command('addkey', async (ctx) => {
  if (ctx.from.id.toString() !== process.env.ADMIN_ID) return;
  const args = ctx.message.text.split(' ');
  const doc = await getDoc();
  await doc.sheetsByTitle['Keys'].addRow({ Key: args[1], Status: 'Available', Price: args[2] });
  ctx.reply('✅ Key added!');
});

bot.command('broadcast', async (ctx) => {
  if (ctx.from.id.toString() !== process.env.ADMIN_ID) return;
  ctx.reply('📢 Broadcast command receive hui!');
});

bot.launch();
