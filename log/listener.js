module.exports = (bot) => {
  bot.on('polling_error', (err) => {
    console.error('Polling Error:', err);
  });
};
