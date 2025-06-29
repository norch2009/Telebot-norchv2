module.exports = {
  name: 'help',
  description: '📜 Shows all commands by category.',
  cooldown: 3,
  run: async (bot, msg, args, config) => {
    const allCommands = [...bot.commands.values()]
      .filter(cmd => cmd.permission !== 'owner' || msg.from.id === config.owneruid);

    const categories = {};

    // Group commands by `command.category`
    for (const cmd of allCommands) {
      const cat = cmd.category || 'Uncategorized';
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(cmd.name);
    }

    // Create styled output
    let helpMsg = `*🤖 ${config.botname} Help Menu*\n\n`;

    for (const [cat, cmds] of Object.entries(categories)) {
      helpMsg += `╭─────────────────✦\n`;
      helpMsg += `│ ${cat}\n`;
      helpMsg += `├───✦\n`;
      helpMsg += cmds.map(cmd => `│➥ -${cmd}`).join('\n') + '\n';
      helpMsg += `╰─────────────────✦\n\n`;
    }

    helpMsg += `*Total Commands:* ${allCommands.length}`;

    await bot.sendMessage(msg.chat.id, helpMsg, { parse_mode: 'Markdown' });
  }
};
