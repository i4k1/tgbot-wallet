// 12-11-2023 i4k

const { Telegraf } = require("telegraf");
const ethPrice = require("eth-price");
const funcs = require("./funcs.js");
const walletJSON = require("./wallet.json");

const tgbotToken = walletJSON.tgbotToken; // telegram bot api token
const bot = new Telegraf(tgbotToken);

bot.command ("ethbalance", async (ctx) => {
    let get_balance_eth = await funcs.getBalanceETH("amount");
    let get_eth_network_name = await funcs.getBalanceETH("name");
    ctx.replyWithHTML(`${get_balance_eth} <i><b>${get_eth_network_name}</b></i>`);
});

bot.command ("erc20balance", async (ctx) => {
    let get_balance_erc20 = await funcs.getBalanceERC20("amount");
    let get_erc20_name = await funcs.getBalanceERC20("name");
    let get_erc20_symbol = await funcs.getBalanceERC20("symbol");
    ctx.replyWithHTML(`${get_balance_erc20} <b>${get_erc20_symbol}</b> <i>${get_erc20_name}</i>`);
});

bot.command ("ethprice", async (ctx) => {
    let get_eth_price = await ethPrice("usd,rub");
    ctx.replyWithHTML(`<i><b>◊</b></i>1 • ${get_eth_price[0].replace("USD: ", "<i><b>$</b></i>")} • ${get_eth_price[1].replace("RUB: ", "<i><b>₽</b></i>")}`);
});

bot.command ("sendeth", async (ctx) => {
    let get_address, get_amount;

    ctx.reply("Кому?");
    bot.hears(/^0x\w+/, async (ctx) => {
        get_address = ctx.message.text;

        ctx.reply("Сколько?");
        bot.hears(/^\d+/, async (ctx) => { // wtf?
            get_amount = ctx.message.text;
            let get_balance_eth = await funcs.getBalanceETH("amount");

            if ( get_balance_eth >= get_amount ) {
                let send_eth = await funcs.sendETH(get_address, get_amount);
                let get_chain_id = await funcs.getBalanceETH("id");

                if ( get_chain_id === 97n ) {
                    ctx.replyWithHTML(`https://testnet.bscscan.com/tx/${send_eth}`);
                } else {
                    ctx.replyWithHTML(`<code>${send_eth}</code>`);
                }
            } else {
                ctx.reply("Недостаточно средств");
            }
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
            let get_balance_erc20 = await funcs.getBalanceERC20("amount");

            if ( get_balance_erc20 >= get_amount ) {
                let get_erc20_symbol = await funcs.getBalanceERC20("symbol");
                let send_erc20 = await funcs.sendERC20(get_address, get_amount);
                ctx.replyWithHTML(`Отправлено: ${get_amount} <i><b>${get_erc20_symbol}</b></i>, по адресу: <code>${get_address}</code>.\nХэш транзакции: <code>${send_erc20}</code>.`);
            } else {
                ctx.replyWithHTML("Недостаточно средств");
            }
        });
    });
});

bot.launch();
