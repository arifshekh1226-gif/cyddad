// shop.js
module.exports = {
  setup: (bot) => {
    // Yahan tera saara logic aayega
    bot.action('shop_menu', (ctx) => {
      ctx.reply('Shop menu active!');
    });
  }
};
