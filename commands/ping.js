module.exports = {
  name: 'ping',
  run: async (bot, msg, args) => {
    bot.sendMessage(msg.chat.id, 'Pong! ✅');
  }
};
