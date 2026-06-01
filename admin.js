// admin.js
async function addKey(ctx, getDoc, newKey, price) {
  if (ctx.from.id != process.env.ADMIN_ID) return; // Sirf tumhare liye
  const doc = await getDoc();
  const sheet = doc.sheetsByTitle['Keys'];
  await sheet.addRow({ Key: newKey, Status: 'Available', Price: price });
  ctx.reply('✅ New key added successfully!');
}

module.exports = { addKey };
