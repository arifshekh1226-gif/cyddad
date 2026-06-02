const { getDoc } = require('./database');

module.exports = {
  setup: (bot) => {
    
    // 1. Command: /addbalance <userID> <amount>
    bot.command('addbalance', async (ctx) => {
      if (ctx.from.id.toString() !== process.env.ADMIN_ID) return;

      const args = ctx.message.text.split(' ');
      if (args.length < 3) return ctx.reply('❌ Format: `/addbalance <userID> <amount>`', { parse_mode: 'Markdown' });

      const userId = args[1];
      const amount = parseInt(args[2]);

      try {
        const doc = await getDoc();
        const usersSheet = doc.sheetsByTitle['Users'];
        const rows = await usersSheet.getRows();
        
        let user = rows.find(r => r.get('TelegramID') == userId);

        if (user) {
          const currentBalance = parseInt(user.get('Balance') || 0);
          const newBalance = currentBalance + amount;
          user.set('Balance', newBalance);
          await user.save();
          ctx.reply(`✅ Balance Updated!\n👤 User: ${userId}\n💰 Added: ₹${amount}\n📊 New Balance: ₹${newBalance}`);
        } else {
          await usersSheet.addRow({
            TelegramID: userId,
            Balance: amount
          });
          ctx.reply(`✅ New User Added!\n👤 User: ${userId}\n💰 Initial Balance: ₹${amount}`);
        }
      } catch (err) {
        console.error(err);
        ctx.reply('❌ Database error: Check if "Users" sheet and columns exist.');
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
        
        // Nayi key add karo
        await keysSheet.addRow({
          Product: product,
          Days: days,
          Key: key,
          Status: 'Available'
        });

        ctx.reply(`✅ Key Added Successfully!\n📦 Product: ${product}\n⏳ Days: ${days}\n🔑 Key: \`${key}\``, { parse_mode: 'Markdown' });
      } catch (err) {
        console.error(err);
        ctx.reply('❌ Error adding key: Check if "Keys" sheet and columns exist.');
      }
    });
  }
};
