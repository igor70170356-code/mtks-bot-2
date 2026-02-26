const { Telegraf } = require('telegraf');
const { invokeScript } = require('@waves/waves-transactions');
const axios = require('axios');

// ========== ВАШИ ДАННЫЕ ==========
const BOT_TOKEN = '8447787179:AAG-CQc7pJ7NJScnavBCZJ9aFbCBaW80SbM';
const CONTRACT_ID = '3PJYK94GQDFQdYfQqPTxtVVmSYBZPWtMmLN';
const ROME_ASSET_ID = 'AP4Cb5xLYGH6ZigHreCZHoXpQTWDkPsG2BHqfDUx6taJ';
const NODE_URL = 'https://nodes.wavesnodes.com';
const ADMIN_SEED = 'guess coin visual burger identify ring submit unfold wisdom know trap easy used minute clinic';
// ==================================

const bot = new Telegraf(BOT_TOKEN);

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
        console.error('Ошибка:', error);
        throw error;
    }
}

bot.start((ctx) => ctx.reply(
    '👋 Добро пожаловать!\n\n' +
    '/price — цены MTKS\n' +
    '/buy 1.05 — купить\n' +
    '/sell 1 — продать\n' +
    '/help — помощь'
));

bot.command('price', async (ctx) => {
    try {
        const url = ${NODE_URL}/addresses/data/${CONTRACT_ID};
        const res = await axios.get(url);
        const data = res.data;
        
        let basePrice = '1.05', buyPrice = '1.05', sellPrice = '1.0395';
        
        data.forEach(item => {
            if (item.key === 'base_price') basePrice = (item.value / 1_000000).toFixed(6);
            if (item.key === 'buy_price') buyPrice = (item.value / 1_000000).toFixed(6);
            if (item.key === 'sell_price') sellPrice = (item.value / 1_000000).toFixed(6);
        });
        
        await ctx.reply(
            📊 Цены MTKS:\n\n +
            💰 Покупка: ${buyPrice} Rome\n +
            💸 Продажа: ${sellPrice} Rome\n +
            📈 База: ${basePrice} Rome
        );
    } catch (error) {
        await ctx.reply(❌ Ошибка: ${error.message});
    }
});

bot.command('buy', async (ctx) => {
    const args = ctx.message.text.split(' ');
    if (args.length < 2) {
        return ctx.reply('❗ Укажите сумму в Rome\nПример: /buy 1.05');
    }
    
    const romeAmount = parseFloat(args[1]);
    if (isNaN(romeAmount) || romeAmount < 1.0) {
        return ctx.reply('❗ Минимум 1 Rome');
    }
    
    const amount = Math.round(romeAmount * 1_000000);
    
    try {
        await ctx.reply(⏳ Покупаю MTKS на ${romeAmount} Rome...);
        const result = await callContract('buyMtks', amount);
        await ctx.reply(
            ✅ Успешно!\n +
            Транзакция: https://wavesexplorer.com/tx/${result.id}
        );
    } catch (error) {
        await ctx.reply(❌ Ошибка: ${error.response?.data?.message || error.message});
    }
});

bot.command('sell', async (ctx) => {
    const args = ctx.message.text.split(' ');
    if (args.length < 2) {
        return ctx.reply('❗ Укажите количество MTKS\nПример: /sell 1');
    }
    
    const mtksAmount = parseFloat(args[1]);
    if (isNaN(mtksAmount) || mtksAmount < 1.0) {
        return ctx.reply('❗ Минимум 1 MTKS');
    }
    
    await ctx.reply('⏳ Функция продажи скоро будет доступна');
});

bot.help((ctx) => ctx.reply(
    '📖 Помощь:\n\n' +
    '/price — текущие цены\n' +
    '/buy 1.05 — купить MTKS за Rome\n' +
    '/sell 1 — продать MTKS за Rome\n\n' +
    'Комиссия: 0.3% + 0.005 WAVES'
));

bot.launch();
console.log('✅ БОТ MTKS ЗАПУЩЕН');
