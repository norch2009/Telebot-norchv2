module.exports = {
  name: 'uid',
  version: '1.0.0',
  description: 'Get your Telegram user ID.',
  cooldown: 3,
  permission: 'all',

  run: async (bot, msg, args, config) => {
    const userId = msg.from.id;
    const username = msg.from.username ? `@${msg.from.username}` : msg.from.first_name;

    await bot.sendMessage(msg.chat.id, `🆔 Your Telegram UID is: \`${userId}\`\n👤 Username: ${username}`, {
      parse_mode: 'Markdown'
    });
  }
};
