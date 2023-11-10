const { Telegraf } = require("telegraf");
const ethPrice = require("eth-price");
const funcs = require("./funcs.js");
const walletJSON = require("./wallet.json");

const tgbotToken = walletJSON.tgbotToken; // telegram bot api token
const bot = new Telegraf(tgbotToken);

bot.command ("ethbalance", async (ctx) => {
    let get_balance_eth = await funcs.getBalanceETH("amount");
    let get_eth_network_name = await funcs.getBalanceETH("name");
    ctx.replyWithHTML(`${get_balance_eth} <u><b>${get_eth_network_name}</b></u>`);
});

bot.command ("erc20balance", async (ctx) => {
    let get_balance_erc20 = await funcs.getBalanceERC20("amount");
    let get_erc20_name = await funcs.getBalanceERC20("name");
    let get_erc20_symbol = await funcs.getBalanceERC20("symbol");
    ctx.replyWithHTML(`${get_balance_erc20} <b>${get_erc20_symbol}</b> (<i>${get_erc20_name}</i>)`);
});

bot.command ("ethprice", async (ctx) => {
    let get_eth_price = await ethPrice("usd,rub");
    ctx.replyWithHTML(`<u><b>◊</b></u>1 • ${get_eth_price[0].replace("USD: ", "<u><b>$</b></u>")} • ${get_eth_price[1].replace("RUB: ", "<u><b>₽</b></u>")}`);
});

bot.command ("sendeth", async (ctx) => {
    let get_address, get_amount;
    ctx.reply("Кому?");

    bot.hears(/^0x\w+/, async (ctx) => {
        get_address = ctx.message.text;
        ctx.reply("Сколько?");
        bot.hears(/^\d+/, async (ctx) => { // what the fuck?
            get_amount = ctx.message.text;
            let send_eth = await funcs.sendEth(get_address, get_amount);
            ctx.replyWithHTML(`${send_eth}`);
        });
    });
});

bot.command ("senderc20", async (ctx) => {
    let get_address, get_amount;
    ctx.reply("Кому?");

    bot.hears(/^0x\w+/, async (ctx) => {
        get_address = ctx.message.text;
        ctx.reply("Сколько?");
        bot.hears(/^\d+/, async (ctx) => { // what the fuck?
            get_amount = ctx.message.text;
            let send_erc20 = await funcs.sendERC20(get_address, get_amount);
            ctx.replyWithHTML(`${send_erc20}`);
        });
    });
});

bot.launch();
