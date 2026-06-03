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

    // 3. Command: /broadcast <message>
    bot.command('broadcast', async (ctx) => {
      if (ctx.from.id.toString() !== process.env.ADMIN_ID) return;

      const message = ctx.message.text.split('/broadcast ')[1];
      if (!message) return ctx.reply('❌ Format: `/broadcast <message>`', { parse_mode: 'Markdown' });

      try {
        const doc = await getDoc();
        const usersSheet = doc.sheetsByTitle['Users'];
        const rows = await usersSheet.getRows();
        
        ctx.reply(`📢 Broadcast shuru ho gaya hai... Total users: ${rows.length}`);

        let successCount = 0;
        for (const row of rows) {
          const userId = row.get('TelegramID');
          try {
            await bot.telegram.sendMessage(userId, message, { parse_mode: 'Markdown' });
            successCount++;
            // Chhota delay taaki Telegram ban na kare
            await new Promise(resolve => setTimeout(resolve, 100)); 
          } catch (err) {
            console.log(`Failed to send to ${userId}`);
          }
        }

        ctx.reply(`✅ Broadcast complete! Total users reached: ${successCount}`);
      } catch (err) {
        ctx.reply('❌ Broadcast failed: ' + err.message);
      }
    });
  }
};
