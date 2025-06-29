const axios = require('axios');

module.exports = {
  name: 'shoti',
  version: '1.0.0',
  description: 'Get a random Shoti TikTok video.',
  cooldown: 5,
  permission: 'all',

  run: async (bot, msg, args, config) => {
    try {
      const res = await axios.get('https://shotiapi-urw9.onrender.com/shoti');
      const videoUrl = res?.data?.result?.video_url;
      const title = res?.data?.result?.title || '🎥 Random Shoti';

      if (!videoUrl) throw new Error('No video URL');

      await bot.sendVideo(msg.chat.id, videoUrl, {
        caption: `🎥 ${title}`,
        reply_markup: {
          inline_keyboard: [
            [{ text: '🔁 More', callback_data: 'shoti' }]
          ]
        }
      });
    } catch (err) {
      console.error('❌ run() error:', err.message);
      await bot.sendMessage(msg.chat.id, '⚠️ Failed to fetch Shoti video.');
    }
  },

  callback: async (bot, ctx) => {
    console.log('🔁 Shoti callback triggered');
    try {
      const res = await axios.get('https://shotiapi-urw9.onrender.com/shoti');
      const videoUrl = res?.data?.result?.video_url;
      const title = res?.data?.result?.title || '🎥 Another Shoti';
      const tiktok_author = res?.data?.result?.author?.unique_id || 'unknown';

      if (!videoUrl) throw new Error('No video URL');

      await bot.editMessageMedia(
        {
          type: 'video',
          media: videoUrl,
          caption: `🎥 ${title}`,
        },
        {
          chat_id: ctx.message.chat.id,
          message_id: ctx.message.message_id,
          reply_markup: {
            inline_keyboard: [
              [{ text: '🔁 More', callback_data: 'shoti' }]
            ]
          }
        }
      );

      await bot.answerCallbackQuery(ctx.id);
    } catch (err) {
      console.error('❌ callback() error:', err.message);
      await bot.answerCallbackQuery(ctx.id, {
        text: '⚠️ Failed to load another Shoti',
        show_alert: true
      });
    }
  }
};
