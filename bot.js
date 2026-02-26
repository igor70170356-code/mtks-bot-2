'js
const { Telegraf } = require('telegraf');
const { invokeScript } = require('@waves/waves-transactions');
const axios = require('axios');

// ========== ВАШИ ДАННЫЕ ==========
const BOTTOKEN = '8447787179:AAG-CQc7pJ7NJScnavBCZJ9aFbCBaW80SbM';
const CONTRACTID = '3PJYK94GQDFQdYfQqPTxtVVmSYBZPWtMmLN';
const ROMEASSETID = 'AP4Cb5xLYGH6ZigHreCZHoXpQTWDkPsG2BHqfDUx6taJ';
const NODEURL = 'https://nodes.wavesnodes.com';
const ADMINSEED = 'guess coin visual burger identify ring submit unfold wisdom know trap easy used minute clinic';
// ==================================

const bot = new Telegraf(BOTTOKEN);

async function callContract(functionName, paymentAmount = 0) {
  const invokeParams = {
    dApp: CONTRACTID,
    call: {
      function: functionName,
      args: []
    },
    payment: paymentAmount > 0 ? [{
      assetId: ROMEASSETID,
      amount: paymentAmount
    }] : [],
    chainId: 'W'
  };
  try {
    const signedTx = invokeScript(invokeParams, ADMINSEED);
    const response = await axios.post(${NODEURL}/transactions/broadcast, signedTx);
    return response.data;
  } catch (error) {
    console.error('Ошибка вызова контракта:', error.response ? error.response.data : error.message);
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

// Обработка команды /price
bot.command('price', async (ctx) => {
  try {
    // Предположим, вызываем контракт для получения цен
    const result = await callContract('getPrices');
    ctx.reply(Текущие цены: ${result});
  } catch (e) {
    ctx.reply('Ошибка получения цен');
  }
});

// Обработка команды /buy
bot.command('buy', async (ctx) => {
  const amountStr = ctx.message.text.split(' ')[1];
  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount <= 0) {
    return ctx.reply('Некорректная сумма для покупки');
  }
  try {
    const result = await callContract('buy', Math.round(amount  1e8)); // пересчет в сатоши
    ctx.reply(Покупка выполнена: ${result.id});
  } catch (e) {
    ctx.reply('Ошибка при покупке');
  }
});

// Обработка команды /sell
bot.command('sell', async (ctx) => {
  const amountStr = ctx.message.text.split(' ')[1];
  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount <= 0) {
    return ctx.reply('Некорректная сумма для продажи');
  }
  try {
    const result = await callContract('sell', Math.round(amount  1e8));
    ctx.reply(Продажа выполнена: ${result.id});
  } catch (e) {
    ctx.reply('Ошибка при продаже');
  }
});

bot.help((ctx) => ctx.reply('Доступные команды:\n/price — цены\n/buy [сумма] — купить\n/sell [сумма] — продать'));

bot.launch();
