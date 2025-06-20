
module.exports = (msg, bot, commands) => {
  const config = require('../config.json');
  
  // 🎮 Handle XOX game inputs
  const xoxCommand = commands.get('xox');
  if (xoxCommand && xoxCommand.inline) {
    return xoxCommand.inline(bot, msg);
  }
};
