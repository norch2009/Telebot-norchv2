const fs = require('fs-extra');
const path = require('path');

/**
 * Loads all command files from the given folder into the provided Map
 * @param {Map} map - Map object where commands will be stored
 * @param {string} folder - Path to the commands folder
 */
function loadCommands(map, folder) {
  const files = fs.readdirSync(folder).filter(file => file.endsWith('.js'));

  for (const file of files) {
    const filePath = path.join(__dirname, '..', folder, file);
    try {
      const command = require(filePath);

      if (command.name && typeof command.run === 'function') {
        map.set(command.name, command);
        console.log(`✅ Command loaded: ${command.name}`);
      } else {
        console.warn(`⚠️ Skipped invalid command: ${file}`);
      }
    } catch (err) {
      console.error(`❌ Failed to load command ${file}:`, err);
    }
  }

  console.log(`📦 Total commands loaded: ${map.size}`);
}

/**
 * Loads all event files from the given folder and registers them to the bot
 * @param {TelegramBot} bot - The initialized Telegram bot instance
 * @param {string} folder - Path to the events folder
 */
function loadEvents(bot, folder) {
  const files = fs.readdirSync(folder).filter(file => file.endsWith('.js'));

  for (const file of files) {
    const filePath = path.join(__dirname, '..', folder, file);
    try {
      const event = require(filePath);
      if (typeof event === 'function') {
        event(bot);
        console.log(`📡 Event loaded: ${file}`);
      } else {
        console.warn(`⚠️ Skipped invalid event: ${file}`);
      }
    } catch (err) {
      console.error(`❌ Failed to load event ${file}:`, err);
    }
  }
}

module.exports = {
  loadCommands,
  loadEvents
};
