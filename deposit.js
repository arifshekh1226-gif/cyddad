const { Markup } = require('telegraf');
const { getDoc } = require('./database');

module.exports = {
  setup: (bot) => {
    bot.action('dep_inr', (ctx) => {
      ctx.replyWithPhoto('https://i.postimg.cc/k47v0N0R/qr-code.png', { caption: '💰 Payment karein aur SS bhejein.' });
    });
    // Yahan photo upload handle karne ka logic...
  }
};
