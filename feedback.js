// feedback.js
module.exports = {
  setup: (bot) => {
    bot.action('feed_menu', (ctx) => {
      ctx.editMessageText('📝 *Feedback Panel*\n\nApna feedback yahan likhein:', {
        parse_mode: 'Markdown'
      });
      // Logic: Feedback collect karke admin ko bhej do
    });
  }
};
