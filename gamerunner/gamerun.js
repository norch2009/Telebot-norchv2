module.exports = (bot, commands, config) => {
    const prefix = config.botprefix;
    const args = msg.text.trim().split(/ +/);
    const cmdName = args.shift().slice(prefix.length).toLowerCase();
    const command = commands.get(cmdName);

    // Handle regular commands
    if (msg.text.startsWith(prefix) && command) {
      return command.run(bot, msg, args, config);
    }

    // 🎮 Handle XOX game inputs
    const xoxCommand = commands.get('xox');
    if (xoxCommand && xoxCommand.inline) {
      return xoxCommand.inline(bot, msg);
    }
  });
};
