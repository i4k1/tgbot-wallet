// 14-11-2023 i4k

const { Telegraf, Markup } = require("telegraf");
const ethPrice = require("eth-price");
const funcs = require("./funcs.js");
const walletJSON = require("./wallet.json");

const tgbotToken = walletJSON.tgbotToken; // telegram bot api token
const bot = new Telegraf(tgbotToken);

var cool_command = "";

bot.start(async (ctx) => {
    if ( ctx.message.from.id === walletJSON.tgUserId ) {
        ctx.replyWithHTML(`Добро пожаловать, <i>мой господин</i>, <b><i>${ctx.message.from.first_name}</i></b>!`);
    } else {
        ctx.replyWithHTML("Ты не мой господин! Брысь от сюда!");
    }
});

bot.command ("ethbalance", async (ctx) => {
    if ( ctx.message.from.id === walletJSON.tgUserId ) {
        const networkEthNames = Object.keys(walletJSON.networks);
        ctx.replyWithHTML("Выберите сеть:", Markup.keyboard(networkEthNames).oneTime().resize());

        const get_eth_network_name = ctx.message.text;
        if ( networkEthNames.includes(get_eth_network_name) ) {
            let get_balance_eth = await funcs.getBalanceETH(walletJSON.networks[get_eth_network_name].nodeUrl, "amount");
            let get_network_name = await funcs.getBalanceETH(walletJSON.networks[get_eth_network_name].nodeUrl, "name");
            ctx.replyWithHTML(`${get_balance_eth} <i><b>${get_network_name}</b></i>`);
        } else {
            ctx.reply("err");
        }
    } else {
        ctx.replyWithHTML("<s><u><i><b>ACCESS DENIED</b></i></u></s>");
    }
});

bot.command ("erc20balance", async (ctx) => {
    if ( ctx.message.from.id === walletJSON.tgUserId ) {
        const networkERC20Names = Object.keys(walletJSON.networks);
        ctx.replyWithHTML("Выберите сеть:", Markup.keyboard(networkERC20Names).oneTime().resize());

            const get_erc20_network_name = ctx.message.text;
            if ( networkERC20Names.includes(get_erc20_network_name) ) {
                let get_chain_id = await funcs.getBalanceETH(walletJSON.networks[get_erc20_network_name].nodeUrl, "id");
                if ( get_chain_id === 97n ) {
                    for ( let i = 0; i < walletJSON.networks[get_erc20_network_name].ERC20tokens.length; i++ ) {
                        let get_erc20_amount = await funcs.getBalanceERC20(walletJSON.networks[get_erc20_network_name].nodeUrl, walletJSON.networks[get_erc20_network_name].ERC20tokens[i].toString(), "amount");
                        let get_erc20_symbol = await funcs.getBalanceERC20(walletJSON.networks[get_erc20_network_name].nodeUrl, walletJSON.networks[get_erc20_network_name].ERC20tokens[i].toString(), "symbol");
                        let get_erc20_name = await funcs.getBalanceERC20(walletJSON.networks[get_erc20_network_name].nodeUrl, walletJSON.networks[get_erc20_network_name].ERC20tokens[i].toString(), "name");
                        ctx.replyWithHTML(`${get_erc20_amount} <i><b>${get_erc20_symbol}</b></i> (<i>${get_erc20_name}</i>)\n<code>${walletJSON.networks[get_erc20_network_name].ERC20tokens[i]}</code>\nhttps://testnet.bscscan.com/address/${walletJSON.networks[get_erc20_network_name].ERC20tokens[i]}`, { disable_web_page_preview: true });
                    }
                } else if ( get_chain_id === 80001n ) {
                    for ( let i = 0; i < walletJSON.networks[get_erc20_network_name].ERC20tokens.length; i++ ) {
                        let get_erc20_amount = await funcs.getBalanceERC20(walletJSON.networks[get_erc20_network_name].nodeUrl, walletJSON.networks[get_erc20_network_name].ERC20tokens[i].toString(), "amount");
                        let get_erc20_symbol = await funcs.getBalanceERC20(walletJSON.networks[get_erc20_network_name].nodeUrl, walletJSON.networks[get_erc20_network_name].ERC20tokens[i].toString(), "symbol");
                        let get_erc20_name = await funcs.getBalanceERC20(walletJSON.networks[get_erc20_network_name].nodeUrl, walletJSON.networks[get_erc20_network_name].ERC20tokens[i].toString(), "name");
                        ctx.replyWithHTML(`${get_erc20_amount} <i><b>${get_erc20_symbol}</b></i> (<i>${get_erc20_name}</i>)\n<code>${walletJSON.networks[get_erc20_network_name].ERC20tokens[i]}</code>\nhttps://mumbai.polygonscan.com/address/${walletJSON.networks[get_erc20_network_name].ERC20tokens[i]}`, { disable_web_page_preview: true });
                    }
                } else {
                    for ( let i = 0; i < walletJSON.networks[get_erc20_network_name].ERC20tokens.length; i++ ) {
                        let get_erc20_amount = await funcs.getBalanceERC20(walletJSON.networks[get_erc20_network_name].nodeUrl, walletJSON.networks[get_erc20_network_name].ERC20tokens[i].toString(), "amount");
                        let get_erc20_symbol = await funcs.getBalanceERC20(walletJSON.networks[get_erc20_network_name].nodeUrl, walletJSON.networks[get_erc20_network_name].ERC20tokens[i].toString(), "symbol");
                        let get_erc20_name = await funcs.getBalanceERC20(walletJSON.networks[get_erc20_network_name].nodeUrl, walletJSON.networks[get_erc20_network_name].ERC20tokens[i].toString(), "name");
                        ctx.replyWithHTML(`${get_erc20_amount} <i><b>${get_erc20_symbol}</b></i> (<i>${get_erc20_name}</i>)\n<code>${walletJSON.networks[get_erc20_network_name].ERC20tokens[i]}</code>`);
                    }
                }
            } else {
                ctx.reply("err");
            }

    } else {
        ctx.replyWithHTML("<s><u><i><b>ACCESS DENIED</b></i></u></s>");
    }
});

bot.command ("ethprice", async (ctx) => {
    let get_eth_price = await ethPrice("usd,rub");
    ctx.replyWithHTML(`<i><b>◊</b></i>1 • ${get_eth_price[0].replace("USD: ", "<i><b>$</b></i>")} • ${get_eth_price[1].replace("RUB: ", "<i><b>₽</b></i>")}`);
});

// bot.command ("sendeth", async (ctx) => {
//     if ( ctx.message.from.id === walletJSON.tgUserId ) {
//         let get_address, get_amount;

//         ctx.reply("Кому?");
//         bot.hears(/^0x\w+/, async (ctx) => {
//             get_address = ctx.message.text;

//             ctx.reply("Сколько?");
//             bot.hears(/^\d+/, async (ctx) => { // wtf?
//                 get_amount = ctx.message.text;
//                 let get_balance_eth = await funcs.getBalanceETH("amount");

//                 if ( get_balance_eth >= get_amount ) {
//                     let send_eth = await funcs.sendETH(get_address, get_amount);
//                     let get_chain_id = await funcs.getBalanceETH("id");

//                     if ( get_chain_id === 97n ) {
//                         ctx.replyWithHTML(`https://testnet.bscscan.com/tx/${send_eth}`, { disable_web_page_preview: true });
//                     } else if ( get_chain_id === 80001n ) {
//                         ctx.replyWithHTML(`https://mumbai.polygonscan.com/tx/${send_eth}`, { disable_web_page_preview: true });
//                     } else {
//                         ctx.replyWithHTML(`<code>${send_eth}</code>`);
//                     }
//                 } else {
//                     ctx.reply("Недостаточно средств");
//                 }
//             });
//         });
//     } else {
//         ctx.replyWithHTML("<s><u><i><b>ACCESS DENIED</b></i></u></s>");
//     }

// });

// bot.command ("senderc20", async (ctx) => {
//     if ( ctx.message.from.id === walletJSON.tgUserId ) {
//         ctx.replyWithHTML("Отправь мне сообщение следующего формата:\n\nадресКонтрактаТокена адресКомуПереводите колвоТокенов");
//         bot.on ("text", async (ctx) => {
//             const get_form_message = ctx.message.text.split(" ");

//             if ( get_form_message.length === 3 && get_form_message[0].startsWith("0x") && get_form_message[1].startsWith("0x") && !isNaN(get_form_message[2]) ) {
//                 const get_sent_token = get_form_message[0];
//                 const get_address = get_form_message[1];
//                 const get_amount = get_form_message[2];
//                 const get_balance_erc20 = await funcs.getBalanceERC20(get_sent_token, "amount");

//                 if ( get_balance_erc20 >= get_amount ) {
//                     let get_chain_id = await funcs.getBalanceETH("id");
//                     let send_erc20 = await funcs.sendERC20(get_sent_token, get_address, get_amount);

//                     if ( get_chain_id === 97n ) {
//                         ctx.replyWithHTML(`https://testnet.bscscan.com/tx/${send_erc20}`, { disable_web_page_preview: true });
//                     } else if ( get_chain_id === 80001n ) {
//                         ctx.replyWithHTML(`https://mumbai.polygonscan.com/tx/${send_eth}`, { disable_web_page_preview: true });
//                     } else {
//                         ctx.replyWithHTML(`<code>${send_erc20}</code>`);
//                     }
//                 } else {
//                     ctx.replyWithHTML("Недостаточно средств");
//                 }
//             } else {
//                 ctx.reply("error");
//             }
//         });
//     } else {
//         ctx.replyWithHTML("<s><u><i><b>ACCESS DENIED</b></i></u></s>");
//     }
// });

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
