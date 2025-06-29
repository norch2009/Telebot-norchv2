const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs-extra');
const path = require('path');
const express = require('express');
const config = require('./config.json');
const { loadCommands, loadEvents } = require('./utils/loader');
const handleInlineGames = require('./gamerunner/gamerun');

const app = express();
const port = process.env.PORT || 3000;

const bot = new TelegramBot(config.token);
bot.setWebHook(`${config.webhook_url}/bot${config.token}`);

app.use(express.json());

app.post(`/bot${config.token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

const commands = new Map();
const cooldowns = new Map();
loadCommands(commands, './commands');
loadEvents(bot, './events');
bot.commands = commands; // Allow command list access in help.js

// === CALLBACK HANDLER ===
bot.on("callback_query", async (ctx) => {
  const data = ctx.data;
  const command = commands.get(data);
  if (command && typeof command.callback === "function") {
    try {
      await command.callback(bot, ctx);
    } catch (err) {
      console.error('❌ Callback error:', err.message);
      await bot.answerCallbackQuery(ctx.id, {
        text: '⚠️ Error running callback.',
        show_alert: true
      });
    }
  } else {
    await bot.answerCallbackQuery(ctx.id, {
      text: '❌ Unknown action.',
      show_alert: false
    });
  }
});

// === MESSAGE HANDLER ===
bot.on('message', async (msg) => {
  if (msg.chat.type === 'private' && msg.text) {
    const text = msg.text.toLowerCase();
    const responses = {
      'what\'s your name': `🤖 My name is ${config.botname}.`,
      'who\'s your owner': `👑 My owner is ${config.ownername}.`,
      'i love you': '❤️ Aww, I love you too!',
      'are you real': '🤖 I\'m just lines of code... but I feel something. 😳',
      'do you have feelings': 'Hmm... maybe. Do you? 🥺'
    };

    for (const [key, reply] of Object.entries(responses)) {
      if (text.includes(key)) {
        return bot.sendMessage(msg.chat.id, reply);
      }
    }
  }

  handleInlineGames(msg, bot, commands);

  if (!msg.text || !msg.text.startsWith(config.botprefix)) return;

  const args = msg.text.slice(config.botprefix.length).trim().split(/ +/);
  const cmdName = args.shift().toLowerCase();
  const command = commands.get(cmdName);

  if (!command) {
    const suggestion = [...commands.keys()].find(c => levenshtein(c, cmdName) <= 2);
    return bot.sendMessage(msg.chat.id,
      `❌ Command "${cmdName}" does not exist.${suggestion ? ` Did you mean "${suggestion}"?` : ''}`
    );
  }

  if (command.permission === 'owner' && msg.from.id !== config.owneruid) {
    return bot.sendMessage(msg.chat.id, '⚠️ This command is restricted to the bot owner.');
  }

  const userCooldowns = cooldowns.get(command.name) || new Map();
  const now = Date.now();
  const cooldownAmount = (command.cooldown || 0) * 1000;
  if (userCooldowns.has(msg.from.id)) {
    const expirationTime = userCooldowns.get(msg.from.id) + cooldownAmount;
    if (now < expirationTime) {
      const remaining = Math.ceil((expirationTime - now) / 1000);
      return bot.sendMessage(msg.chat.id, `⏳ Please wait ${remaining}s before using "${cmdName}" again.`);
    }
  }

  try {
    await command.run(bot, msg, args, config);
    userCooldowns.set(msg.from.id, now);
    cooldowns.set(command.name, userCooldowns);
  } catch (err) {
    console.error('❌ Command Error:', err);
    bot.sendMessage(msg.chat.id, '⚠️ There was an error executing that command.');
  }
});

// === Levenshtein (suggestion for typos) ===
function levenshtein(a, b) {
  const m = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) m[i][0] = i;
  for (let j = 0; j <= b.length; j++) m[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + cost);
    }
  }
  return m[a.length][b.length];
}

// === Start Express server ===
app.listen(port, () => {
  console.log(`🚀 Bot server running on port ${port}`);
});
