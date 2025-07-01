module.exports = {
  name: 'restart',
  version: '1.0.0',
  description: 'Manually restarts the bot.',
  cooldown: 10,
  permission: 'owner',

  run: async (bot, msg, args, config) => {
    if (msg.from.id !== config.owneruid) return;

    await bot.sendMessage(msg.chat.id, "♻️ Restarting bot...");
    console.log("🛠️ Manual restart triggered by owner");
    process.exit(0);
  }
};
