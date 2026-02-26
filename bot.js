const { Telegraf } = require('telegraf');
const { invokeScript } = require('@waves/waves-transactions');
const axios = require('axios');
const CONFIG = require('./config');

// Валидация конфигурации
CONFIG.validate();

const bot = new Telegraf(CONFIG.BOT_TOKEN);

// Логирование ошибок
const logError = (context, error, details = {}) => {
  console.error({
    timestamp: new Date().toISOString(),
    context,
    error: error.message,
    details,
    stack: error.stack
  });
};

// Парсинг суммы с валидацией
const parseAmount = (input, minAmount) => {
  const amount = parseFloat(input);
  if (isNaN(amount) || amount < minAmount) {
    throw new Error(Минимум ${minAmount});
  }
  return amount;
};

async function callContract(functionName, paymentAmount = 0) {
  const invokeParams = {
    dApp: CONFIG.CONTRACT_ID,
    call: {
      function: functionName,
      args: []
    },
    payment: paymentAmount > 0 ? [{
      assetId: CONFIG.ROME_ASSET_ID,
      amount: paymentAmount
    }] : [],
    chainId: 'W'
  };

  try {
    const signedTx = invokeScript(invokeParams, CONFIG.ADMIN_SEED);
    const response = await axios.post(${CONFIG.NODE_URL}/transactions/broadcast, signedTx);
    return response.data;
  } catch (error) {
    logError('callContract', error, { functionName, paymentAmount });
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
    const url = ${CONFIG.NODE_URL}/addresses/data/${CONFIG.CONTRACT_ID};
    const response = await axios.get(url);
    const data = response.data;

    let basePrice, buyPrice, sellPrice;

    data.forEach(item => {
      switch (item.key) {
        case 'base_price':
          basePrice = (item.value / CONFIG.DECIMAL_PRECISION).toFixed(6);
          break;
        case 'buy_price':
          buyPrice = (item.value / CONFIG.DECIMAL_PRECISION).toFixed(6);
          break;
        case 'sell_price':
          sellPrice = (item.value / CONFIG.DECIMAL_PRECISION).toFixed(6);
          break;
      }
    });

    // Проверка, что все цены получены
    if (!basePrice  !buyPrice  !sellPrice) {
      throw new Error('Не удалось получить актуальные цены');
    }

    await ctx.reply(
      📊 Цены MTKS:\n\n +
      💰 Покупка: ${buyPrice} Rome\n +
      💸 Продажа: ${sellPrice} Rome\n +
      📈 База: ${basePrice} Rome
    );
  } catch (error) {
    logError('price_command', error, { userId: ctx.from.id });
    await ctx.reply(❌ Ошибка: ${error.message});
  }
});

bot.command('buy', async (ctx) => {
  try {
    const args = ctx.message.text.split(' ');
    if (args.length < 2) {
      return ctx.reply('❗ Укажите сумму в Rome\nПример: /buy 1.05');
    }

    const romeAmount = parseAmount(args[1], CONFIG.MIN_BUY_AMOUNT);
    const amount = Math.round(romeAmount * CONFIG.DECIMAL_PRECISION);

    await ctx.reply(⏳ Покупаю MTKS на ${romeAmount} Rome...);
    const result = await callContract('buyMtks', amount);

    await ctx.reply(
      ✅ Успешно!\nТранзакция: https://wavesexplorer.com/tx/${result.id}
    );
  } catch (error) {
    logError('buy_command', error, { userId: ctx.from.id });
    await ctx.reply(❌ Ошибка: ${error.message});
  }
});

bot.command('sell', async (ctx) => {
  try {
    const args = ctx.message.text.split(' ');
    if (args.length < 2) {
      return ctx.reply('❗ Укажите количество MTKS\nПример: /sell 1');
    }

    const mtksAmount = parseAmount(args[1], 1.0);

    await ctx.reply('⏳ Функция продажи скоро будет доступна');
  } catch (error) {
    logError('sell_command', error, { userId: ctx.from.id });
    await ctx.reply(❌ Ошибка: ${error.message});
  }
});

bot.help((ctx) => ctx.reply(
  '📖 Помощь:\n\n' +
  '/price — текущие цены\n' +
  '/buy 1.05 — купить MTKS за Rome\n' +
  '/sell 1 — продать MTKS за Rome\n\n' +
