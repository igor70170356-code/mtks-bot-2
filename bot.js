const { Telegraf } = require('telegraf');
const { invokeScript } = require('@waves/waves-transactions');
const axios = require('axios');

// ========== ВАШИ РЕАЛЬНЫЕ ДАННЫЕ ==========
const BOT_TOKEN = '8447787179:AAG-CQc7pJ7NJScnavBCZJ9aFbCBaW80SbM';
const CONTRACT_ID = '3PJYK94GQDFQdYfQqPTxtVVmSYBZPWtMmLN';
const ROME_ASSET_ID = 'AP4Cb5xLYGH6ZigHreCZHoXpQTWDkPsG2BHqfDUx6taJ';
const NODE_URL = 'https://nodes.wavesnodes.com';
const ADMIN_SEED = 'guess coin visual burger identify ring submit unfold wisdom know trap easy used minute clinic';
// ==========================================

const bot = new Telegraf(BOT_TOKEN);

// Функция вызова контракта
async function callContract(functionName, paymentAmount = 0) {
    const invokeParams = {
        dApp: CONTRACT_ID,
        call: {
            function: functionName,
            args: []
        },
        payment: paymentAmount > 0 ? [{
            assetId: ROME_ASSET_ID,
            amount: paymentAmount
        }] : [],
        chainId: 'W'
    };
    try {
        const signedTx = invokeScript(invokeParams, ADMIN_SEED);
        const response = await axios.post(${NODE_URL}/transactions/broadcast, signedTx);
        return response.data;
    } catch (error) {
        console.error('Ошибка вызова контракта:', error.response?.data || error.message);
        throw error;
    }
}

// Команда /start
bot.start((ctx) => ctx.reply(
    '👋 Добро пожаловать в бот MTKS!\n\n' +
    'Доступные команды:\n' +
    '/price — текущие цены\n' +
    '/buy 1.05 — купить 1 MTKS\n' +
    '/sell 1 — продать 1 MTKS\n' +
    '/help — помощь'
));

// Команда /price
bot.command('price', async (ctx) => {
    try {
        const dataUrl = ${NODE_URL}/addresses/data/${CONTRACT_ID};
        const response = await axios.get(dataUrl);
        const data = response.data;
        
        let basePrice = '1.05';
        let buyPrice = '1.05';
        let sellPrice = '1.0395';
        
        for (const item of data) {
            if (item.key === 'base_price') basePrice = (item.value / 1_000000).toFixed(6);
            if (item.key === 'buy_price') buyPrice = (item.value / 1_000000).toFixed(6);
            if (item.key === 'sell_price') sellPrice = (item.value / 1_000000).toFixed(6);
        }
        
        ctx.reply(
            📊 Текущие цены MTKS:\n\n +
            💰 Покупка: ${buyPrice} Rome за 1 MTKS\n +
            💸 Продажа: ${sellPrice} Rome за 1 MTKS\n +
            📈 Базовая цена: ${basePrice} Rome\n\n +
            Спред: 1%\n +
            Комиссия: 0.3% + 0.005 WAVES
        );
    } catch (error) {
        ctx.reply(❌ Ошибка: ${error.message});
    }
});

// Команда /buy
bot.command('buy', async (ctx) => {
    const args = ctx.message.text.split(' ');
    if (args.length < 2) {
        return ctx.reply('Укажите сумму в Rome, например: /buy 1.05');
    }
    
    const romeAmount = parseFloat(args[1]);
    if (isNaN(romeAmount) || romeAmount < 1.0) {
        return ctx.reply('Минимальная сумма: 1 Rome');
    }
    
    const amount = Math.round(romeAmount * 1_000000);
    
    try {
        ctx.reply(🔄 Покупаю MTKS на ${romeAmount} Rome...);
        const result = await callContract('buyMtks', amount);
        ctx.reply(
            ✅ Куплено!\n +
            Tx: https://wavesexplorer.com/tx/${result.id}
        );
    } catch (error) {
        ctx.reply(❌ Ошибка: ${error.response?.data?.message || error.message});
    }
});

// Команда /sell
bot.command('sell', async (ctx) => {
    const args = ctx.message.text.split(' ');
    if (args.length < 2) {
        return ctx.reply('Укажите количество MTKS, например: /sell 1');
    }
    
    const mtksAmount = parseFloat(args[1]);
    if (isNaN(mtksAmount) || mtksAmount < 1.0) {
        return ctx.reply('Минимальная сумма: 1 MTKS');
    }
    
    try {
        ctx.reply(🔄 Функция продажи будет доступна после настройки. Пока используйте /buy.);
    } catch (error) {
        ctx.reply(❌ Ошибка: ${error.message});
    }
});
// Команда /help
bot.help((ctx) => ctx.reply(
    '📖 Помощь:\n\n' +
    '/price — цены\n' +
    '/buy 1.05 — купить MTKS\n' +
    '/sell 1 — продать MTKS (скоро)\n\n' +
    'Все комиссии уже в цене.'
));

bot.launch();
console.log('✅ Бот MTKS версии 5.0 запущен!');
