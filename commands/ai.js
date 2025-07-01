const axios = require("axios");

module.exports = {
  name: 'ai',
  version: '1.0.1',
  description: 'Ask something to GPT-4o using the Norch API.',
  cooldown: 5,
  permission: 'all',

  run: async (bot, msg, args, config) => {
    const ask = args.join(" ");
    const chatId = msg.chat.id;

    if (!ask) {
      return bot.sendMessage(chatId, "❓ *Please provide a question.*\nExample: `-ai what is an earthquake?`", {
        parse_mode: "Markdown"
      });
    }

    try {
      const uid = msg.from.username || msg.from.first_name || "guest";

      // Show typing indicator
      await bot.sendChatAction(chatId, "typing");

      // Send temporary loading message
      const sent = await bot.sendMessage(chatId, "🔄 Thinking...");

      // Build and call your API
      const apiUrl = `https://80f92850-c1cd-4a43-8ff5-c402ed1115c7-00-3o68q4fn48li3.sisko.replit.dev/api/gpt?ask=${encodeURIComponent(ask)}&uid=${encodeURIComponent(uid)}`;
      const response = await axios.get(apiUrl);
      const answer = response.data?.response;

      if (!answer) {
        return bot.editMessageText("⚠️ No response received from the Norch API.", {
          chat_id: chatId,
          message_id: sent.message_id
        });
      }

      // Edit the placeholder message with the actual response
      await bot.editMessageText(`🧠 *Question:* ${ask}\n\n💬 *Answer:* ${answer}`, {
        chat_id: chatId,
        message_id: sent.message_id,
        parse_mode: "Markdown"
      });

    } catch (err) {
      console.error("❌ AI command error:", err.message);

      await bot.editMessageText("⚠️ An error occurred while getting a response from the AI.", {
        chat_id: chatId,
        message_id: sent?.message_id || msg.message_id
      });
    }
  }
};
