const config = require('../config.json');
const path = require('path');
const fs = require('fs');

module.exports = (bot) => {
  bot.on('message', async (msg) => {
    // When bot is added to a group
    if (msg.new_chat_members) {
      const isBotAdded = msg.new_chat_members.some(user => user.username === (await bot.getMe()).username);
      if (isBotAdded) {
        const groupName = msg.chat.title || "this group";

        // 1. Send welcome text
        await bot.sendMessage(msg.chat.id, `✅ ${config.botname} successfully connected to ${groupName}!`);

        // 2. Send GIF (must be uploaded in Replit Files tab)
        const gifPath = path.join(__dirname, '..', 'norch.gif');
        if (fs.existsSync(gifPath)) {
          await bot.sendAnimation(msg.chat.id, fs.createReadStream(gifPath));
        } else {
          await bot.sendMessage(msg.chat.id, `⚠️ Missing welcome.gif file in bot folder.`);
        }
      }
    }
  });
};
