require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Google Sheet connection setup
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

// Bot ka Main Menu
bot.start((ctx) => {
  ctx.reply(`*🛒 GAMING KEY SHOP*\n\n🔑 Premium Gaming Keys Marketplace\n✅ Instant Delivery of your order.\n🥇 Trusted Automated Key Distribution\n\n👋 Welcome ${ctx.from.first_name}\n👤 ${ctx.from.id}`, {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard([
      [Markup.button.callback('• Purchase Key •', 'purchase_key')],
      [Markup.button.callback('• Account •', 'account'), Markup.button.callback('• History •', 'history')],
      [Markup.button.callback('• Deposit Fund (₹) •', 'dep_inr'), Markup.button.callback('• Deposit Fund ($) •', 'dep_usd')],
      [Markup.button.callback('• Feedback •', 'feedback')]
    ])
  });
});

// Key Purchase ka logic (yahi code mein add kiya hai)
bot.action('purchase_key', async (ctx) => {
  try {
    ctx.answerCbQuery();
    const doc = await getDoc();
    const sheet = doc.sheetsByTitle['Keys'];
    await sheet.loadHeaderRow();
    const rows = await sheet.getRows();
    
    const keyRow = rows.find(r => r.get('Status') === 'Available');
    
    if (!keyRow) {
      return ctx.reply('❌ Sorry, abhi koi key available nahi hai.');
    }

    const key = keyRow.get('Key');
    keyRow.set('Status', 'Sold');
    await keyRow.save();
    
    ctx.reply(`✅ Key successfuly khareed li!\n\n🔑 Key: ${key}\n💰 Price: ${keyRow.get('Price')}`);
  } catch (err) {
    console.error(err);
    ctx.reply('⚠️ Error aayi hai, try again later.');
  }
});

// Baaki buttons ke liye (abhi sirf message)
bot.action('account', (ctx) => ctx.reply('💰 Aapka balance: ₹500'));
bot.action('dep_inr', (ctx) => ctx.reply('📸 Please payment screenshot bhejiye.'));

bot.launch();
