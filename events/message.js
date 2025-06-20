const path = require('path');
const fs = require('fs');
const config = require('../config.json');

module.exports = (bot) => {
  bot.on('message', async (msg) => {
    if (msg.new_chat_members) {
      try {
        const me = await bot.getMe();
        const isBotAdded = msg.new_chat_members.some(user => user.username === me.username);

        if (isBotAdded) {
          const groupName = msg.chat.title || "this group";

          // ✅ Welcome message
          await bot.sendMessage(
            msg.chat.id,
            `✅ ${config.botname} successfully connected to ${groupName}!\n\n ${config.ownername}!`
          );

          // 📁 Path to norch.gif (upload this sa root folder!)
          const gifPath = path.join(__dirname, 'gift', 'norch.gif');

          if (fs.existsSync(gifPath)) {
            await bot.sendAnimation(msg.chat.id, fs.createReadStream(gifPath));
          } else {
            await bot.sendMessage(msg.chat.id, `⚠️ Missing 'norch.gif' file in root folder.`);
          }
        }
      } catch (err) {
        console.error('❌ Error handling group join event:', err);
      }
    }
  });
};
