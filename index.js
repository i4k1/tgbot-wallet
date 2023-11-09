const { Telegraf } = require("telegraf");
const ethPrice = require("eth-price");
const funcs = require("./funcs.js");
const walletJSON = require("./wallet.json");

const tgbotToken = walletJSON.tgbotToken; // telegram bot api token
const bot = new Telegraf(tgbotToken);

bot.command("balance", async (ctx) => {
    let get_balance = await funcs.getBalance();
    let get_erc20 = await funcs.getERC20();
    let get_erc20_name = await funcs.getERC20Name();
    let get_erc20_symbol = await funcs.getERC20Symbol();
    let eth_price = await ethPrice("usd,rub");
    ctx.replyWithHTML(`<u>◊</u>1 - ${eth_price[0].replace("USD: ", "<u>$</u>")} - ${eth_price[1].replace("RUB: ", "<u>₽</u>")}\n${get_balance}\n${get_erc20} <u>${get_erc20_symbol} (${get_erc20_name})</u>`);
});

bot.launch();
