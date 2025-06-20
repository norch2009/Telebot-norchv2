module.exports = {
  name: 'pair',
  version: '1.0.0',
  description: 'Pair with the bot for private chat.',
  cooldown: 5,
  permission: 'all',

  run: async (bot, msg, args, config) => {
    // Check if message is from private chat
    if (msg.chat.type !== 'private') {
      return bot.sendMessage(msg.chat.id, '❌ This command only works in private message (PM).');
    }

    await bot.sendMessage(msg.chat.id,
      `🤖 I'm your pair now! Let's talk 💬\n\n` +
      `Try saying:\n` +
      `• "hi"\n` +
      `• "what's your name?"\n` +
      `• "who's your owner?"\n` +
      `• "i love you"\n` +
      `• or anything sweet 😳`
    );
  }
};
