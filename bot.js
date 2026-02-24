const { Telegraf } = require('telegraf');

const BOT_TOKEN = '8447787179:AAG-CQc7pJ7NJScnavBCZJ9aFbCBaW80SbM';

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => ctx.reply('Бот работает!'));
bot.help((ctx) => ctx.reply('Отправьте /start'));
bot.command('test', (ctx) => ctx.reply('Тест пройден'));

bot.launch();
console.log('Тестовый бот запущен');
