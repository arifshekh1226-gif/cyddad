// admin.js
module.exports = {
  setup: (bot) => {
    // Yahan admin ka logic likho (jaise broadcast, key add, etc.)
    bot.command('admin', (ctx) => {
      ctx.reply('Admin panel active!');
    });
  }
};
