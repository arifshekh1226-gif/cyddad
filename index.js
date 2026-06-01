require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

async function getDoc() {
  const creds = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  const auth = new JWT({ email: creds.client_email, key: creds.private_key, scopes: ['https://www.googleapis.com/auth/spreadsheets'] });
  const doc = new GoogleSpreadsheet(process.env.SHEET_ID, auth);
  await doc.loadInfo();
  return doc;
}

// === 1. DEPOSIT LOGIC ===
bot.action('deposit', (ctx) => {
  ctx.answerCbQuery();
  ctx.replyWithPhoto('https://i.postimg.cc/k47v0N0R/qr-code.png', { caption: '💰 QR par payment karein.' });
});

bot.on('photo', async (ctx) => {
  const userId = ctx.from.id;
  await ctx.telegram.sendPhoto(process.env.ADMIN_ID, ctx.message.photo[0].file_id, {
    caption: `⚠️ New Deposit\nUser: ${ctx.from.first_name}\nID: ${userId}`,
    ...Markup.inlineKeyboard([[Markup.button.callback('✅ Approve Custom', `approve_${userId}`)]])
  });
  ctx.reply('✅ Screenshot admin ko bhej diya hai.');
});

// === 2. ADMIN LOGIC ===
bot.action(/approve_(\d+)/, (ctx) => ctx.reply(`Amount add karne ke liye likhein: /setamount ${ctx.match[1]} [AMOUNT]`));

bot.command('setamount', async (ctx) => {
  if (ctx.from.id.toString() !== process.env.ADMIN_ID) return;
  const [_, userId, amount] = ctx.message.text.split(' ');
  const doc = await getDoc();
  const sheet = doc.sheetsByTitle['Users'];
  const rows = await sheet.getRows();
  let row = rows.find(r => r.get('UserID') == userId);
  if(row) row.set('Balance', parseInt(row.get('Balance') || 0) + parseInt(amount));
  else await sheet.addRow({ UserID: userId, Balance: amount });
  await row ? row.save() : null;
  ctx.reply(`✅ Done! ${amount} added to ${userId}`);
});

// === 3. START MENU ===
bot.start((ctx) => {
  ctx.reply('🛒 MENU:', Markup.inlineKeyboard([
    [Markup.button.callback('• Purchase •', 'purchase_key')],
    [Markup.button.callback('• Deposit •', 'deposit'), Markup.button.callback('👑 Admin', 'admin_panel')]
  ]));
});

bot.launch();
