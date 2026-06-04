require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');

if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.error('❌ ERROR: TELEGRAM_BOT_TOKEN is missing in .env file!');
    process.exit(1);
}

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Import Modules
const shop = require('./shop');
const deposit = require('./deposit');
const account = require('./account');
const admin = require('./admin');
const feedback = require('./feedback');

// Setup Modules
shop.setup(bot);
deposit.setup(bot);
account.setup(bot);
admin.setup(bot);
feedback.setup(bot);

// --- FORCE JOIN MIDDLEWARE ---
bot.use(async (ctx, next) => {
    const channelId = '-1002940703518'; 
    try {
        if (ctx.from && !ctx.callbackQuery?.data?.includes('admin')) {
            const chatMember = await ctx.telegram.getChatMember(channelId, ctx.from.id);
            const status = chatMember.status;
            if (status === 'left' || status === 'kicked') {
                return ctx.reply('❌ *ACCESS DENIED*\n\nBot use karne ke liye pehle hamara channel join karein:', {
                    parse_mode: 'Markdown',
                    ...Markup.inlineKeyboard([
                        [Markup.button.url('📢 Join Channel', 'https://t.me/c/2940703518/1')],
                        [Markup.button.callback('🔄 Check Status', 'start')]
                    ])
                });
            }
        }
        return next();
    } catch (err) {
        console.log('Channel check error:', err);
        return next();
    }
});

// Main Menu helper
const getMainMenu = () => {
    return {
        text: '🛒 *CY SHOP - MAIN MENU*\n\nWelcome back! Choose an option below to get started:',
        extra: {
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard([
                [Markup.button.callback('• Purchase Key •', 'shop_menu')],
                [Markup.button.callback('• Account •', 'acc_menu'), Markup.button.callback('• History •', 'hist_menu')],
                [Markup.button.callback('• Deposit Fund (₹) •', 'dep_inr'), Markup.button.callback('• Deposit Fund ($) •', 'dep_usd')],
                [Markup.button.callback('• Feedback •', 'feed_menu')]
            ])
        }
    };
};

// Main Menu Action
bot.action('main_menu', async (ctx) => {
    try {
        await ctx.answerCbQuery();
        const menu = getMainMenu();
        await ctx.editMessageText(menu.text, menu.extra);
    } catch (err) {
        if (err.description && !err.description.includes('there is no text in the message to edit')) {
            console.error('Error in main_menu:', err);
        }
    }
});

// Start Command
bot.start((ctx) => {
    const welcomeText = `👋 *Hello ${ctx.from.first_name.replace(/[*_`]/g, '')}!*

Welcome to *CY SHOP* 🎮
The most reliable and fastest marketplace for Premium Gaming Keys.

🔹 *Instant Delivery*
🔹 *24/7 Automated Service*
🔹 *Best Market Prices*

Click below to explore our products!`;

    ctx.reply(welcomeText, {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
            [Markup.button.callback('• Purchase Key •', 'shop_menu')],
            [Markup.button.callback('• Account •', 'acc_menu'), Markup.button.callback('• History •', 'hist_menu')],
            [Markup.button.callback('• Deposit Fund (₹) •', 'dep_inr'), Markup.button.callback('• Deposit Fund ($) •', 'dep_usd')],
            [Markup.button.callback('• Feedback •', 'feed_menu')]
        ])
    });
});

// Global Error Handler
bot.catch((err, ctx) => {
    console.error(`❌ Error in ${ctx.updateType}:`, err);
});

// Launch Bot
bot.launch()
    .then(() => console.log('✅ Bot is running...'))
    .catch((err) => {
        console.error('❌ Failed to launch:', err);
    });

// Graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
