const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = 'YOUR_TELEGRAM_BOT_TOKEN';
const bot = new TelegramBot(token, { polling: true });
const instagramAPIEndpoint = 'YOUR_INSTAGRAM_API_ENDPOINT';

async function fetchInstagramData() {
    try {
        const response = await axios.get(instagramAPIEndpoint);
        return response.data;
    } catch (error) {
        console.error('Error fetching Instagram data:', error);
        return null;
    }
}

bot.onText(/\/instagram/, async (msg) => {
    const chatId = msg.chat.id;
    const instagramData = await fetchInstagramData();
    if (instagramData) {
        bot.sendMessage(chatId, 'Here is the latest Instagram data: ' + JSON.stringify(instagramData));
    } else {
        bot.sendMessage(chatId, 'Failed to fetch Instagram data. Please try again later.');
    }
});

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Welcome to the Instagram Telegram Bot. Use /instagram to get the latest Instagram data.');
});

bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Commands:\n/instagram - Get the latest Instagram data\n/help - Show this help message');
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Unsupported command. Use /help to see available commands.');
});

setInterval(async () => {
    const instagramData = await fetchInstagramData();
    if (instagramData) {
        console.log('Instagram data:', instagramData);
    } else {
        console.error('Failed to fetch Instagram data.');
    }
}, 3600000);
