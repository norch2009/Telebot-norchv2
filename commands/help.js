module.exports = {
  name: 'help',
  description: '📜 Shows the categorized command list.',
  cooldown: 3,
  async run(bot, msg, args, config) {
    const allCommands = [...bot.commands.values()]
      .filter(cmd => cmd.permission !== 'owner' || msg.from.id === config.owneruid);

    // Categorize commands (you can adjust these)
    const categories = {
      Admin: ['cmd'],
      Ai: ['grok', 'venice'],
      Anime: ['animeme', 'cosplay', 'waifu'],
      Fun: ['meme'],
      Info: ['uptime'],
      Music: ['spotify', 'spotify2'],
      Owner: ['eval'],
      System: ['admin', 'help', 'requestvip', 'vip'],
      Utility: ['funfact', 'joke'],
    };

    let helpMsg = `*🤖 ${config.botname} Help Menu*\n\n`;

    for (const [category, cmds] of Object.entries(categories)) {
      const visibleCmds = cmds
        .map(name => {
          const cmd = bot.commands.get(name);
          if (!cmd || (cmd.permission === 'owner' && msg.from.id !== config.owneruid)) return null;
          return `│➥ -${cmd.name}`;
        })
        .filter(Boolean)
        .join('\n');

      if (visibleCmds) {
        helpMsg += `╭─────────────────✦\n`;
        helpMsg += `│ ${category}\n`;
        helpMsg += `├───✦\n`;
        helpMsg += `${visibleCmds}\n`;
        helpMsg += `╰─────────────────✦\n\n`;
      }
    }

    helpMsg += `*Total Commands:* ${allCommands.length}`;

    bot.sendMessage(msg.chat.id, helpMsg, { parse_mode: 'Markdown' });
  }
};
