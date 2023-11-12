// 12-11-2023 i4k

const { Telegraf, Markup } = require("telegraf");
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
    let get_chain_id = await funcs.getBalanceETH("id");
    if ( get_chain_id === 97n ) {
        let tokens = [];
        for ( let i = 0; i < walletJSON.ERC20tokens.length; i++ ) {
            let get_erc20_amount = await funcs.getBalanceERC20(walletJSON.ERC20tokens[i].toString(), "amount");
            let get_erc20_symbol = await funcs.getBalanceERC20(walletJSON.ERC20tokens[i].toString(), "symbol");
            let get_erc20_name = await funcs.getBalanceERC20(walletJSON.ERC20tokens[i].toString(), "name");
            ctx.replyWithHTML(`${get_erc20_amount} <i><b>${get_erc20_symbol}</b></i> (<i>${get_erc20_name}</i>)\n<code>${walletJSON.ERC20tokens[i]}</code>\nhttps://testnet.bscscan.com/tx/${walletJSON.ERC20tokens[i]}`);
        }
    } else if ( get_chain_id === 80001n ) {
        for ( let i = 0; i < walletJSON.ERC20tokens.length; i++ ) {
            let get_erc20_amount = await funcs.getBalanceERC20(walletJSON.ERC20tokens[i].toString(), "amount");
            let get_erc20_symbol = await funcs.getBalanceERC20(walletJSON.ERC20tokens[i].toString(), "symbol");
            let get_erc20_name = await funcs.getBalanceERC20(walletJSON.ERC20tokens[i].toString(), "name");
            ctx.replyWithHTML(`${get_erc20_amount} <i><b>${get_erc20_symbol}</b></i> (<i>${get_erc20_name}</i>)\n<code>${walletJSON.ERC20tokens[i]}</code>\nhttps://mumbai.polygonscan.com/tx/${walletJSON.ERC20tokens[i]}`);
        }
    } else {
        let tokens = [];
        for ( let i = 0; i < walletJSON.ERC20tokens.length; i++ ) {
            let get_erc20_amount = await funcs.getBalanceERC20(walletJSON.ERC20tokens[i].toString(), "amount");
            let get_erc20_symbol = await funcs.getBalanceERC20(walletJSON.ERC20tokens[i].toString(), "symbol");
            let get_erc20_name = await funcs.getBalanceERC20(walletJSON.ERC20tokens[i].toString(), "name");
            ctx.replyWithHTML(`${get_erc20_amount} <i><b>${get_erc20_symbol}</b></i> (<i>${get_erc20_name}</i>)\n<code>${walletJSON.ERC20tokens[i]}</code>`);
        }
    }
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
                } else if ( get_chain_id === 80001n ) {
                    ctx.replyWithHTML(`https://mumbai.polygonscan.com/tx/${send_eth}`);
                } else {
                    ctx.replyWithHTML(`<code>${send_eth}</code>`);
                }
            } else {
                ctx.reply("Недостаточно средств");
            }
        });
    });
});

bot.command ("erc20aviable", async (ctx) => {
    let available_tokens = [];
    for ( let i = 0; i < walletJSON.ERC20tokens.length; i++ ) {
        let get_erc20_symbol = await funcs.getBalanceERC20(walletJSON.ERC20tokens[i].toString(), "symbol");
        available_tokens.push(`<code>${walletJSON.ERC20tokens[i]}</code> <i><b>${get_erc20_symbol}</b></i>`);
    }

    ctx.replyWithHTML(`Доступны следующие токены:\n${available_tokens}`);
});

bot.command ("senderc20", async (ctx) => {
    ctx.replyWithHTML("Отправь мне сообщение следующего формата:\n\nадресКонтрактаТокена адресКомуПереводите колвоТокенов");
    bot.on ("text", async (ctx) => {
        const get_form_message = ctx.message.text.split(" ");

        if ( get_form_message.length === 3 && get_form_message[0].startsWith("0x") && get_form_message[1].startsWith("0x") && !isNaN(get_form_message[2]) ) {
            const get_sent_token = get_form_message[0];
            const get_address = get_form_message[1];
            const get_amount = get_form_message[2];
            const get_balance_erc20 = await funcs.getBalanceERC20(get_sent_token, "amount");

            if ( get_balance_erc20 >= get_amount ) {
                let get_chain_id = await funcs.getBalanceETH("id");
                let send_erc20 = await funcs.sendERC20(get_sent_token, get_address, get_amount);

                if ( get_chain_id === 97n ) {
                    ctx.replyWithHTML(`https://testnet.bscscan.com/tx/${send_erc20}`);
                } else if ( get_chain_id === 80001n ) {
                    ctx.replyWithHTML(`https://mumbai.polygonscan.com/tx/${send_eth}`);
                } else {
                    ctx.replyWithHTML(`<code>${send_erc20}</code>`);
                }
            } else {
                ctx.replyWithHTML("Недостаточно средств");
            }
        } else {
            ctx.reply("error");
        }
    });
});

bot.launch();
