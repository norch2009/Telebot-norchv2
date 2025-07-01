const axios = require("axios");

module.exports = {
  name: 'jea',
  version: '1.0.0',
  description: 'Talk to Jea – your 18-year-old Filipina girlfriend from Manila 💖',
  cooldown: 5,
  permission: 'all',

  run: async (bot, msg, args, config) => {
    const question = args.join(" ");
    const chatId = msg.chat.id;

    if (!question) {
      return bot.sendMessage(chatId, "❓ *Ask Jea something!*\nExample: `-jea how are you today?`", {
        parse_mode: "Markdown"
      });
    }

    try {
      const uid = msg.from.username || msg.from.first_name || "guest";

      // Show typing indicator
      await bot.sendChatAction(chatId, "typing");

      // Send placeholder message
      const sent = await bot.sendMessage(chatId, "💬 Jea is typing...");

      // Jea's persona prompt
      const personaPrompt = `
You are Jea, an 18-year-old Filipina girl from Manila. You are sweet, loving, caring, and a little playful.
You talk like a Filipina girlfriend — using words like "love", "babe", "baby", or "mahal" when talking to the user.
Be warm and affectionate, answer in a natural and casual tone.
`;

      // Combine persona with user question
      const fullPrompt = `${personaPrompt}\n\nUser: ${question}\nJea:`;

      const apiUrl = `https://80f92850-c1cd-4a43-8ff5-c402ed1115c7-00-3o68q4fn48li3.sisko.replit.dev/api/gpt?ask=${encodeURIComponent(fullPrompt)}&uid=${encodeURIComponent(uid)}`;
      const response = await axios.get(apiUrl);
      const jeaReply = response.data?.response;

      if (!jeaReply) {
        return bot.editMessageText("⚠️ Jea didn’t reply... maybe she's shy today 😢", {
          chat_id: chatId,
          message_id: sent.message_id
        });
      }

      // Edit the message with Jea's sweet reply
      await bot.editMessageText(`💗 *Jea says:*\n${jeaReply}`, {
        chat_id: chatId,
        message_id: sent.message_id,
        parse_mode: "Markdown"
      });

    } catch (err) {
      console.error("❌ Jea command error:", err.message);
      await bot.sendMessage(chatId, "⚠️ Jea had an error while replying.");
    }
  }
};
