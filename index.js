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

// 1. START MENU
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

// 2. PURCHASE LOGIC
bot.action('purchase_key', async (ctx) => {
  try {
    const doc = await getDoc();
    const rows = await doc.sheetsByTitle['Keys'].getRows();
    const keyRow = rows.find(r => r.get('Status') === 'Available');
    if (!keyRow) return ctx.reply('❌ No keys available.');
    
    keyRow.set('Status', 'Sold');
    await keyRow.save();
    ctx.reply(`✅ Key: ${keyRow.get('Key')}`);
  } catch (e) { ctx.reply('Error...'); }
});

// 3. DEPOSIT (QR + SCREENSHOT)
bot.action('deposit', (ctx) => {
  ctx.replyWithPhoto('https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg', {
    caption: '💰 Is QR par payment karein aur screenshot yahan bhejein.'
  });
});

bot.on('photo', async (ctx) => {
  await ctx.telegram.sendPhoto(process.env.ADMIN_ID, ctx.message.photo[0].file_id, {
    caption: `⚠️ New Deposit from ${ctx.from.first_name}\nID: ${ctx.from.id}`
  });
  ctx.reply('✅ Screenshot recieved! Admin check kar raha hai.');
});

// 4. PROTECTED ADMIN PANEL
bot.action('admin_panel', async (ctx) => {
  if (ctx.from.id.toString() !== process.env.ADMIN_ID) {
    return ctx.answerCbQuery('❌ Access Denied!');
  }
  ctx.reply('👑 Admin Panel', Markup.inlineKeyboard([
    [Markup.button.callback('➕ Add Key', 'admin_add')]
  ]));
});

// ADMIN ADD KEY (Simple way)
bot.action('admin_add', (ctx) => {
  ctx.reply('Format: /addkey KEYNAME PRICE\nExample: /addkey GOLD100 100');
});

bot.command('addkey', async (ctx) => {
  if (ctx.from.id.toString() !== process.env.ADMIN_ID) return;
  const args = ctx.message.text.split(' ');
  const doc = await getDoc();
  await doc.sheetsByTitle['Keys'].addRow({ Key: args[1], Status: 'Available', Price: args[2] });
  ctx.reply('✅ Key added successfully!');
});

bot.launch();
