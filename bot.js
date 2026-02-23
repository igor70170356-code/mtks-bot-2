const { Telegraf } = require('telegraf');
const { invokeScript } = require('@waves/waves-transactions');
const axios = require('axios');

// ========== КОНФИГУРАЦИЯ ==========
const BOT_TOKEN = '8447787179:AAG-CQc7pJ7NJScnavBCZJ9aFbCBaW80SbM'; // ← СЮДА ТОКЕН ОТ BOTFATHER
const CONTRACT_ID = '3PJYK94GQDFQdYfQqPTxtVVmSYBZPWtMmLN'; // ← АДРЕС ВАШЕГО КОНТРАКТА
const ROME_ASSET_ID = 'AP4Cb5xLYGH6ZigHreCZHoXpQTWDkPsG2BHqfDUx6taJ'; // ← ID ROME
const NODE_URL = 'https://nodes.wavesnodes.com';
const ADMIN_SEED = 'guess coin visual burger identify ring submit unfold wisdom know trap easy used minute clinic'; // ← СЮДА СИД-ФРАЗУ АДМИНА
const MIN_AMOUNT_ROME = 1_000000; // 1 Rome (6 знаков)
// ==================================

const bot = new Telegraf(BOT_TOKEN);

// Функция для вызова контракта
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
    '/buy 1.05 — купить 1 MTKS (указать сумму в Rome)\n' +
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
            💰 Покупка (вы платите Rome): ${buyPrice} Rome за 1 MTKS\n +
            💸 Продажа (вы получаете Rome): ${sellPrice} Rome за 1 MTKS\n +
            📈 Базовая цена: ${basePrice} Rome
        );
    } catch (error) {
        ctx.reply(❌ Ошибка получения цен: ${error.message});
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
        ctx.reply(🔄 Отправляю запрос на покупку ${(amount / 1_000000).toFixed(6)} Rome...);
        const result = await callContract('buyMtks', amount);
        ctx.reply(
            ✅ Покупка выполнена!\n +
            Tx ID: ${result.id}\n +
            Посмотреть: https://wavesexplorer.com/tx/${result.id}
        );
    } catch (error) {
        ctx.reply(❌ Ошибка: ${error.response?.data?.message || error.message});
    }
});

// Команда /help
bot.help((ctx) => ctx.reply(
    '📖 Справка:\n\n' +
    '/price — показать текущие цены\n' +
    '/buy [сумма] — купить MTKS за Rome (например /buy 1.05)\n\n' +
    'Все комиссии уже включены в цену.'
));

bot.launch();
console.log('Бот запущен!');const { Telegraf } = require('telegraf');
const { invokeScript } = require('@waves/waves-transactions');
const axios = require('axios');

// ========== КОНФИГУРАЦИЯ ==========
const BOT_TOKEN = '8447787179:AAG-CQc7pJ7NJScnavBCZJ9aFbCBaW80SbM'; // ← СЮДА ТОКЕН ОТ BOTFATHER
const CONTRACT_ID = '3PJYK94GQDFQdYfQqPTxtVVmSYBZPWtMmLN'; // ← АДРЕС ВАШЕГО КОНТРАКТА
const ROME_ASSET_ID = 'AP4Cb5xLYGH6ZigHreCZHoXpQTWDkPsG2BHqfDUx6taJ'; // ← ID ROME
const NODE_URL = 'https://nodes.wavesnodes.com';
const ADMIN_SEED = 'guess coin visual burger identify ring submit unfold wisdom know trap easy used minute clinic'; // ← СЮДА СИД-ФРАЗУ АДМИНА
const MIN_AMOUNT_ROME = 1_000000; // 1 Rome (6 знаков)
// ==================================

const bot = new Telegraf(BOT_TOKEN);

// Функция для вызова контракта
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
    '/buy 1.05 — купить 1 MTKS (указать сумму в Rome)\n' +
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
            💰 Покупка (вы платите Rome): ${buyPrice} Rome за 1 MTKS\n +
            💸 Продажа (вы получаете Rome): ${sellPrice} Rome за 1 MTKS\n +
            📈 Базовая цена: ${basePrice} Rome
        );
    } catch (error) {
        ctx.reply(❌ Ошибка получения цен: ${error.message});
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
        ctx.reply(🔄 Отправляю запрос на покупку ${(amount / 1_000000).toFixed(6)} Rome...);
        const result = await callContract('buyMtks', amount);
        ctx.reply(
            ✅ Покупка выполнена!\n +
            Tx ID: ${result.id}\n +
            Посмотреть: https://wavesexplorer.com/tx/${result.id}
        );
    } catch (error) {
        ctx.reply(❌ Ошибка: ${error.response?.data?.message || error.message});
    }
});

// Команда /help
bot.help((ctx) => ctx.reply(
    '📖 Справка:\n\n' +
    '/price — показать текущие цены\n' +
    '/buy [сумма] — купить MTKS за Rome (например /buy 1.05)\n\n' +
    'Все комиссии уже включены в цену.'
));

bot.launch();
console.log('Бот запущен!');const { Telegraf } = require('telegraf');
const { invokeScript } = require('@waves/waves-transactions');
const axios = require('axios');

// ========== КОНФИГУРАЦИЯ ==========
const BOT_TOKEN = '8447787179:AAG-CQc7pJ7NJScnavBCZJ9aFbCBaW80SbM'; // ← СЮДА ТОКЕН ОТ BOTFATHER
const CONTRACT_ID = '3PJYK94GQDFQdYfQqPTxtVVmSYBZPWtMmLN'; // ← АДРЕС ВАШЕГО КОНТРАКТА
const ROME_ASSET_ID = 'AP4Cb5xLYGH6ZigHreCZHoXpQTWDkPsG2BHqfDUx6taJ'; // ← ID ROME
const NODE_URL = 'https://nodes.wavesnodes.com';
const ADMIN_SEED = 'guess coin visual burger identify ring submit unfold wisdom know trap easy used minute clinic'; // ← СЮДА СИД-ФРАЗУ АДМИНА
const MIN_AMOUNT_ROME = 1_000000; // 1 Rome (6 знаков)
// ==================================

const bot = new Telegraf(BOT_TOKEN);

// Функция для вызова контракта
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
    '/buy 1.05 — купить 1 MTKS (указать сумму в Rome)\n' +
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
            💰 Покупка (вы платите Rome): ${buyPrice} Rome за 1 MTKS\n +
            💸 Продажа (вы получаете Rome): ${sellPrice} Rome за 1 MTKS\n +
            📈 Базовая цена: ${basePrice} Rome
        );
    } catch (error) {
        ctx.reply(❌ Ошибка получения цен: ${error.message});
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
        ctx.reply(🔄 Отправляю запрос на покупку ${(amount / 1_000000).toFixed(6)} Rome...);
        const result = await callContract('buyMtks', amount);
        ctx.reply(
            ✅ Покупка выполнена!\n +
            Tx ID: ${result.id}\n +
            Посмотреть: https://wavesexplorer.com/tx/${result.id}
        );
    } catch (error) {
        ctx.reply(❌ Ошибка: ${error.response?.data?.message || error.message});
    }
});

// Команда /help
bot.help((ctx) => ctx.reply(
    '📖 Справка:\n\n' +
    '/price — показать текущие цены\n' +
    '/buy [сумма] — купить MTKS за Rome (например /buy 1.05)\n\n' +
    'Все комиссии уже включены в цену.'
));

bot.launch();
console.log('Бот запущен!');const { Telegraf } = require('telegraf');
const { invokeScript } = require('@waves/waves-transactions');
const axios = require('axios');

// ========== КОНФИГУРАЦИЯ ==========
const BOT_TOKEN = '8447787179:AAG-CQc7pJ7NJScnavBCZJ9aFbCBaW80SbM'; // ← СЮДА ТОКЕН ОТ BOTFATHER
const CONTRACT_ID = '3PJYK94GQDFQdYfQqPTxtVVmSYBZPWtMmLN'; // ← АДРЕС ВАШЕГО КОНТРАКТА
const ROME_ASSET_ID = 'AP4Cb5xLYGH6ZigHreCZHoXpQTWDkPsG2BHqfDUx6taJ'; // ← ID ROME
const NODE_URL = 'https://nodes.wavesnodes.com';
const ADMIN_SEED = 'guess coin visual burger identify ring submit unfold wisdom know trap easy used minute clinic'; // ← СЮДА СИД-ФРАЗУ АДМИНА
const MIN_AMOUNT_ROME = 1_000000; // 1 Rome (6 знаков)
// ==================================

const bot = new Telegraf(BOT_TOKEN);

// Функция для вызова контракта
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
    '/buy 1.05 — купить 1 MTKS (указать сумму в Rome)\n' +
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
            💰 Покупка (вы платите Rome): ${buyPrice} Rome за 1 MTKS\n +
            💸 Продажа (вы получаете Rome): ${sellPrice} Rome за 1 MTKS\n +
            📈 Базовая цена: ${basePrice} Rome
        );
    } catch (error) {
        ctx.reply(❌ Ошибка получения цен: ${error.message});
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
        ctx.reply(🔄 Отправляю запрос на покупку ${(amount / 1_000000).toFixed(6)} Rome...);
        const result = await callContract('buyMtks', amount);
        ctx.reply(
            ✅ Покупка выполнена!\n +
            Tx ID: ${result.id}\n +
            Посмотреть: https://wavesexplorer.com/tx/${result.id}
        );
    } catch (error) {
        ctx.reply(❌ Ошибка: ${error.response?.data?.message || error.message});
    }
});

// Команда /help
bot.help((ctx) => ctx.reply(
    '📖 Справка:\n\n' +
    '/price — показать текущие цены\n' +
    '/buy [сумма] — купить MTKS за Rome (например /buy 1.05)\n\n' +
    'Все комиссии уже включены в цену.'
));

bot.launch();
console.log('Бот запущен!');const { Telegraf } = require('telegraf');
const { invokeScript } = require('@waves/waves-transactions');
const axios = require('axios');

// ========== КОНФИГУРАЦИЯ ==========
const BOT_TOKEN = '8447787179:AAG-CQc7pJ7NJScnavBCZJ9aFbCBaW80SbM'; // ← СЮДА ТОКЕН ОТ BOTFATHER
const CONTRACT_ID = '3PJYK94GQDFQdYfQqPTxtVVmSYBZPWtMmLN'; // ← АДРЕС ВАШЕГО КОНТРАКТА
const ROME_ASSET_ID = 'AP4Cb5xLYGH6ZigHreCZHoXpQTWDkPsG2BHqfDUx6taJ'; // ← ID ROME
const NODE_URL = 'https://nodes.wavesnodes.com';
const ADMIN_SEED = 'guess coin visual burger identify ring submit unfold wisdom know trap easy used minute clinic'; // ← СЮДА СИД-ФРАЗУ АДМИНА
const MIN_AMOUNT_ROME = 1_000000; // 1 Rome (6 знаков)
// ==================================

const bot = new Telegraf(BOT_TOKEN);

// Функция для вызова контракта
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
    '/buy 1.05 — купить 1 MTKS (указать сумму в Rome)\n' +
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
            💰 Покупка (вы платите Rome): ${buyPrice} Rome за 1 MTKS\n +
            💸 Продажа (вы получаете Rome): ${sellPrice} Rome за 1 MTKS\n +
            📈 Базовая цена: ${basePrice} Rome
        );
    } catch (error) {
        ctx.reply(❌ Ошибка получения цен: ${error.message});
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
        ctx.reply(🔄 Отправляю запрос на покупку ${(amount / 1_000000).toFixed(6)} Rome...);
        const result = await callContract('buyMtks', amount);
        ctx.reply(
            ✅ Покупка выполнена!\n +
            Tx ID: ${result.id}\n +
            Посмотреть: https://wavesexplorer.com/tx/${result.id}
        );
    } catch (error) {
        ctx.reply(❌ Ошибка: ${error.response?.data?.message || error.message});
    }
});

// Команда /help
bot.help((ctx) => ctx.reply(
    '📖 Справка:\n\n' +
    '/price — показать текущие цены\n' +
    '/buy [сумма] — купить MTKS за Rome (например /buy 1.05)\n\n' +
    'Все комиссии уже включены в цену.'
));

bot.launch();
console.log('Бот запущен!');const { Telegraf } = require('telegraf');
const { invokeScript } = require('@waves/waves-transactions');
const axios = require('axios');

// ========== КОНФИГУРАЦИЯ ==========
const BOT_TOKEN = '8447787179:AAG-CQc7pJ7NJScnavBCZJ9aFbCBaW80SbM'; // ← СЮДА ТОКЕН ОТ BOTFATHER
const CONTRACT_ID = '3PJYK94GQDFQdYfQqPTxtVVmSYBZPWtMmLN'; // ← АДРЕС ВАШЕГО КОНТРАКТА
const ROME_ASSET_ID = 'AP4Cb5xLYGH6ZigHreCZHoXpQTWDkPsG2BHqfDUx6taJ'; // ← ID ROME
const NODE_URL = 'https://nodes.wavesnodes.com';
const ADMIN_SEED = 'guess coin visual burger identify ring submit unfold wisdom know trap easy used minute clinic'; // ← СЮДА СИД-ФРАЗУ АДМИНА
const MIN_AMOUNT_ROME = 1_000000; // 1 Rome (6 знаков)
// ==================================

const bot = new Telegraf(BOT_TOKEN);

// Функция для вызова контракта
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
    '/buy 1.05 — купить 1 MTKS (указать сумму в Rome)\n' +
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
            💰 Покупка (вы платите Rome): ${buyPrice} Rome за 1 MTKS\n +
            💸 Продажа (вы получаете Rome): ${sellPrice} Rome за 1 MTKS\n +
            📈 Базовая цена: ${basePrice} Rome
        );
    } catch (error) {
        ctx.reply(❌ Ошибка получения цен: ${error.message});
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
        ctx.reply(🔄 Отправляю запрос на покупку ${(amount / 1_000000).toFixed(6)} Rome...);
        const result = await callContract('buyMtks', amount);
        ctx.reply(
            ✅ Покупка выполнена!\n +
            Tx ID: ${result.id}\n +
            Посмотреть: https://wavesexplorer.com/tx/${result.id}
        );
    } catch (error) {
        ctx.reply(❌ Ошибка: ${error.response?.data?.message || error.message});
    }
});

// Команда /help
bot.help((ctx) => ctx.reply(
    '📖 Справка:\n\n' +
    '/price — показать текущие цены\n' +
    '/buy [сумма] — купить MTKS за Rome (например /buy 1.05)\n\n' +
    'Все комиссии уже включены в цену.'
));

bot.launch();
console.log('Бот запущен!');