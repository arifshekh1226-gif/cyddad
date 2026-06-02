const { getDoc } = require('./database');

module.exports = {
  setup: (bot) => {
    
    // 1. Command: /addbalance <userID> <amount>
    bot.command('addbalance', async (ctx) => {
      // Check admin
      if (ctx.from.id.toString() !== process.env.ADMIN_ID) return;

      const args = ctx.message.text.split(' ');
      if (args.length < 3) return ctx.reply('❌ Format: `/addbalance <userID> <amount>`', { parse_mode: 'Markdown' });

      const userId = args[1];
      const amount = parseInt(args[2]);

      try {
        const doc = await getDoc();
        const usersSheet = doc.sheetsByTitle['Users'];
        const rows = await usersSheet.getRows();
        const user = rows.find(r => r.get('TelegramID') == userId);

        if (user) {
          const newBalance = parseInt(user.get('Balance') || 0) + amount;
          user.set('Balance', newBalance);
          await user.save();
          ctx.reply(`✅ Success!\n👤 User: ${userId}\n💰 Added: ₹${amount}\n📊 New Balance: ₹${newBalance}`);
        } else {
          ctx.reply('❌ User sheet mein nahi mila!');
        }
      } catch (err) {
        ctx.reply('❌ Database error.');
      }
    });

    // 2. Command: /addkey <product> <days> <key>
    bot.command('addkey', async (ctx) => {
      if (ctx.from.id.toString() !== process.env.ADMIN_ID) return;

      const args = ctx.message.text.split(' ');
      if (args.length < 4) return ctx.reply('❌ Format: `/addkey <Product> <Days> <Key>`', { parse_mode: 'Markdown' });

      const product = args[1];
      const days = args[2];
      const key = args[3];

      try {
        const doc = await getDoc();
        const keysSheet = doc.sheetsByTitle['Keys'];
        
        await keysSheet.addRow({
          Product: product,
          Days: days,
          Key: key,
          Status: 'Available'
        });

        ctx.reply(`✅ Key Added Successfully!\n📦 Product: ${product}\n⏳ Days: ${days}\n🔑 Key: \`${key}\``, { parse_mode: 'Markdown' });
      } catch (err) {
        ctx.reply('❌ Error adding key.');
      }
    });
  }
};
