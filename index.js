const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs-extra');
const config = require('./config.json');
const { loadCommands, loadEvents } = require('./utils/loader');
const path = require('path');

// Init bot
const bot = new TelegramBot(config.token, { polling: true });

// Store commands
const commands = new Map();

// Loaders
loadCommands(commands, './commands');
loadEvents(bot, './events');

// Message Listener
bot.on('message', async (msg) => {
  const prefix = config.botprefix;
  if (!msg.text || !msg.text.startsWith(prefix)) return;

  const args = msg.text.slice(prefix.length).trim().split(/ +/);
  const cmdName = args.shift().toLowerCase();

  if (commands.has(cmdName)) {
    try {
      await commands.get(cmdName).run(bot, msg, args);
    } catch (err) {
      console.error('Command Error:', err);
    }
  } else {
    // Suggestion System
    const available = [...commands.keys()];
    const suggestion = available.find(cmd => levenshtein(cmd, cmdName) <= 2);

    bot.sendMessage(msg.chat.id,
      `The command "${cmdName}" is not exist on my system.${suggestion ? ` Did you mean "${suggestion}"?` : ''}`
    );
  }
});

// Simple Levenshtein Distance function
function levenshtein(a, b) {
  const matrix = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[a.length][b.length];
}
