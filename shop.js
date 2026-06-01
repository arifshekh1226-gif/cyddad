// shop.js file ka content
module.exports = {
  setup: (bot) => {
    bot.action('shop_menu', (ctx) => {
      ctx.reply('Shop menu is working!');
    });
  }
};
