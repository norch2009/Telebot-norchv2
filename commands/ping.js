module.exports = {
  name: 'ping',
  version: '1.0.0',
  description: 'Check if the bot is alive.',
  cooldown: 5,
  permission: 'all',

  run: async (bot, msg, args, config) => {
    try {
      // Send initial message
      const sent = await bot.sendMessage(msg.chat.id, 'Pinging...');
      
      // Edit that message after 500ms
      setTimeout(() => {
        bot.editMessageText('🏓 Pong!', {
          chat_id: msg.chat.id,
          message_id: sent.message_id
        });
      }, 500);

    } catch (err) {
      console.error('❌ Ping command error:', err);
      await bot.sendMessage(msg.chat.id, '⚠️ Error executing ping.');
    }
  }
};
