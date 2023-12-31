// 22-12-2023 i4k

const { Telegraf, Markup } = require("telegraf");
const ethPrice = require("eth-price");
const funcs = require("./funcs.js");
const walletJSON = require("./wallet.json");
const bot = new Telegraf(walletJSON.tgbotToken); // telegram bot api token

bot.start(async (ctx) => {
    const date = new Date(ctx.message.date * 1000);
    const fulldate = `${date.getFullYear()}-${date.getDate()}-${date.getMonth()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

    console.log(`\x1b[1m\x1b[37m${ctx.message.from.first_name} ${ctx.message.from.last_name}\x1b[0m • \x1b[1m\x1b[32m@${ctx.message.from.username}\x1b[0m • ${ctx.message.from.id} • ${ctx.message.from.is_premium} • ${fulldate} • \x1b[1m\x1b[33m${ctx.message.text}\x1b[0m`);

    if ( ctx.message.from.id === walletJSON.tgUserId ) {
        ctx.replyWithHTML(`Добро пожаловать, <i>мой господин</i>, <b><i>${ctx.message.from.first_name}</i></b>!`);
    } else {
        ctx.replyWithHTML(`Ты не мой господин! Брысь от сюда, ${ctx.message.from.first_name}!`);
    }
});

bot.command ("ethbalance", async (ctx) => {
    const date = new Date(ctx.message.date * 1000);
    const fulldate = `${date.getFullYear()}-${date.getDate()}-${date.getMonth()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

    console.log(`\x1b[1m\x1b[37m${ctx.message.from.first_name} ${ctx.message.from.last_name}\x1b[0m • \x1b[1m\x1b[32m@${ctx.message.from.username}\x1b[0m • ${ctx.message.from.id} • ${ctx.message.from.is_premium} • ${fulldate} • \x1b[1m\x1b[33m${ctx.message.text}\x1b[0m`);

    if ( ctx.message.from.id === walletJSON.tgUserId ) {
        const network_names = Object.keys(walletJSON.networks);
        let keyboard_networks = { parse_mode: "HTML", ...Markup.inlineKeyboard([ network_names.map( (word) => Markup.button.callback(word, word)) ]) };
        ctx.reply("Выберите сеть", keyboard_networks);

        network_names.forEach(async (word) => {
            bot.action(word, async (ctx) => {
                let get_balance_eth = await funcs.getBalanceETH(walletJSON.networks[word].nodeUrl, "amount");
                let get_network_name = await funcs.getBalanceETH(walletJSON.networks[word].nodeUrl, "name");
                ctx.replyWithHTML(`${get_balance_eth} <i><b>${get_network_name}</b></i>`);
            });
        });
    } else {
        ctx.replyWithHTML("<s><u><i><b>ACCESS DENIED</b></i></u></s>");
    }
});

bot.command ("erc20balance", async (ctx) => {
    const date = new Date(ctx.message.date * 1000);
    const fulldate = `${date.getFullYear()}-${date.getDate()}-${date.getMonth()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

    console.log(`\x1b[1m\x1b[37m${ctx.message.from.first_name} ${ctx.message.from.last_name}\x1b[0m • \x1b[1m\x1b[32m@${ctx.message.from.username}\x1b[0m • ${ctx.message.from.id} • ${ctx.message.from.is_premium} • ${fulldate} • \x1b[1m\x1b[33m${ctx.message.text}\x1b[0m`);

    if ( ctx.message.from.id === walletJSON.tgUserId ) {
        const network_names = Object.keys(walletJSON.networks);
        let keyboard_networks = Markup.inlineKeyboard( network_names.map( (word) => Markup.button.callback(word, `${word}_erc20`)) );
        ctx.replyWithHTML("Выберите сеть", keyboard_networks);

        network_names.forEach(async (word) => {
            bot.action(`${word}_erc20`, async (ctx) => {
                let get_chain_id = await funcs.getBalanceETH(walletJSON.networks[word].nodeUrl, "id");
                let get_networks_node_url = walletJSON.networks[word].nodeUrl;

                if ( get_chain_id === 97n ) { // https://bsc-testnet.publicnode.com
                    for ( let i = 0; i < walletJSON.networks[word].ERC20tokens.length; i++ ) {
                        let get_networks_erc20tokens = walletJSON.networks[word].ERC20tokens[i].toString();
                        let get_erc20_amount = await funcs.getBalanceERC20(get_networks_node_url, get_networks_erc20tokens, "amount");
                        let get_erc20_symbol = await funcs.getBalanceERC20(get_networks_node_url, get_networks_erc20tokens, "symbol");
                        let get_erc20_name = await funcs.getBalanceERC20(get_networks_node_url, get_networks_erc20tokens, "name");
                        ctx.replyWithHTML(`${get_erc20_amount} <i><b>${get_erc20_symbol}</b></i> (<i>${get_erc20_name}</i>)\n<code>${get_networks_erc20tokens}</code>\nhttps://testnet.bscscan.com/address/${get_networks_erc20tokens}`, { disable_web_page_preview: true });
                    }
                } else if ( get_chain_id === 80001n ) { // https://polygon-mumbai-bor.publicnode.com
                    for ( let i = 0; i < walletJSON.networks[word].ERC20tokens.length; i++ ) {
                        let get_networks_erc20tokens = walletJSON.networks[word].ERC20tokens[i].toString();
                        let get_erc20_amount = await funcs.getBalanceERC20(get_networks_node_url, get_networks_erc20tokens, "amount");
                        let get_erc20_symbol = await funcs.getBalanceERC20(get_networks_node_url, get_networks_erc20tokens, "symbol");
                        let get_erc20_name = await funcs.getBalanceERC20(get_networks_node_url, get_networks_erc20tokens, "name");
                        ctx.replyWithHTML(`${get_erc20_amount} <i><b>${get_erc20_symbol}</b></i> (<i>${get_erc20_name}</i>)\n<code>${get_networks_erc20tokens}</code>\nhttps://mumbai.polygonscan.com/address/${get_networks_erc20tokens}`, { disable_web_page_preview: true });
                    }
                } else {
                    for ( let i = 0; i < walletJSON.networks[word].ERC20tokens.length; i++ ) {
                        let get_networks_erc20tokens = walletJSON.networks[word].ERC20tokens[i].toString();
                        let get_erc20_amount = await funcs.getBalanceERC20(get_networks_node_url, get_networks_erc20tokens, "amount");
                        let get_erc20_symbol = await funcs.getBalanceERC20(get_networks_node_url, get_networks_erc20tokens, "symbol");
                        let get_erc20_name = await funcs.getBalanceERC20(get_networks_node_url, get_networks_erc20tokens, "name");
                        ctx.replyWithHTML(`${get_erc20_amount} <i><b>${get_erc20_symbol}</b></i> (<i>${get_erc20_name}</i>)\n<code>${get_networks_erc20tokens}</code>`);
                    }
                }
            });
        });
    } else {
        ctx.replyWithHTML("<s><u><i><b>ACCESS DENIED</b></i></u></s>");
    }
});

bot.command ("ethprice", async (ctx) => {
    const date = new Date(ctx.message.date * 1000);
    const fulldate = `${date.getFullYear()}-${date.getDate()}-${date.getMonth()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

    console.log(`\x1b[1m\x1b[37m${ctx.message.from.first_name} ${ctx.message.from.last_name}\x1b[0m • \x1b[1m\x1b[32m@${ctx.message.from.username}\x1b[0m • ${ctx.message.from.id} • ${ctx.message.from.is_premium} • ${fulldate} • \x1b[1m\x1b[33m${ctx.message.text}\x1b[0m`);

    let get_eth_price = await ethPrice("usd,rub");
    ctx.replyWithHTML(`<i><b>◊</b></i>1 • ${get_eth_price[0].replace("USD: ", "<i><b>$</b></i>")} • ${get_eth_price[1].replace("RUB: ", "<i><b>₽</b></i>")}`);
});

bot.on ("text", async (ctx) => {
    const date = new Date(ctx.message.date * 1000);
    const fulldate = `${date.getFullYear()}-${date.getDate()}-${date.getMonth()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    console.log(`\x1b[1m\x1b[37m${ctx.message.from.first_name} ${ctx.message.from.last_name}\x1b[0m • \x1b[1m\x1b[32m@${ctx.message.from.username}\x1b[0m • ${ctx.message.from.id} • ${ctx.message.from.is_premium} • ${fulldate} • \x1b[1m\x1b[33m${ctx.message.text}\x1b[0m`);

    if ( ctx.message.from.id === walletJSON.tgUserId ) {
        const get_form_message = ctx.message.text.split(" ");
        if ( get_form_message.length === 3 && get_form_message[0] === "sendeth" && get_form_message[1].startsWith("0x") && isNaN(get_form_message[2]) ) {
            const get_address = get_form_message[1];
            const get_amount = parseFloat(get_form_message[2]).toString();
            const network_names = Object.keys(walletJSON.networks);
            const keyboard_networks = Markup.inlineKeyboard( network_names.map( (word) => Markup.button.callback(word, `${word}_sendeth`)) );
            ctx.replyWithHTML("Выберите сеть", keyboard_networks);
            network_names.forEach(async (word) => {
                bot.action(`${word}_sendeth`, async (ctx) => {
                    const get_networks_node_url = walletJSON.networks[word].nodeUrl;
                    let get_balance_eth = await funcs.getBalanceETH(get_networks_node_url, "amount");
                    if ( get_balance_eth >= get_amount ) {
                        let get_chain_id = await funcs.getBalanceETH(get_networks_node_url, "id");
                        if ( get_chain_id === 97n ) {
                            let send_eth = await funcs.sendETH(get_networks_node_url, get_address, get_amount);
                            ctx.replyWithHTML(`https://testnet.bscscan.com/tx/${send_eth}`, { disable_web_page_preview: true });
                        } else if ( get_chain_id === 80001n ) {
                            let send_eth = await funcs.sendETH(get_networks_node_url, get_address, get_amount);
                            ctx.replyWithHTML(`https://mumbai.polygonscan.com/tx/${send_eth}`, { disable_web_page_preview: true });
                        } else {
                            let send_eth = await funcs.sendETH(get_networks_node_url, get_address, get_amount);
                            ctx.replyWithHTML(`<code>${send_eth}</code>`);
                        }
                    } else {
                        ctx.reply("Недостаточно средств");
                    }
                });
            });
        } else if ( get_form_message.length === 4 && get_form_message[0] === "senderc20" && get_form_message[1].startsWith("0x") && get_form_message[2].startsWith("0x") && isNaN(get_form_message[3]) ) {
            const get_sent_token = get_form_message[1];
            const get_address = get_form_message[2];
            const get_amount = parseFloat(get_form_message[3]).toString();
            const network_names = Object.keys(walletJSON.networks);
            const keyboard_networks = Markup.inlineKeyboard( network_names.map( (word) => Markup.button.callback(word, `${word}_sendeth`)) );
            ctx.replyWithHTML("Выберите сеть", keyboard_networks);
            network_names.forEach(async (word) => {
                bot.action(`${word}_sendeth`, async (ctx) => {
                    const get_networks_node_url = walletJSON.networks[word].nodeUrl;
                    let get_balance_erc20 = await funcs.getBalanceERC20(get_networks_node_url, get_sent_token, "amount");

                    if ( get_balance_erc20 >= get_amount ) {
                        let get_chain_id = await funcs.getBalanceETH(get_networks_node_url, "id");
                        let send_erc20 = await funcs.sendERC20(get_networks_node_url, get_sent_token, get_address, get_amount);

                        if ( get_chain_id === 97n ) {
                            ctx.replyWithHTML(`https://testnet.bscscan.com/tx/${send_erc20}`, { disable_web_page_preview: true });
                        } else if ( get_chain_id === 80001n ) {
                            ctx.replyWithHTML(`https://mumbai.polygonscan.com/tx/${send_erc20}`, { disable_web_page_preview: true });
                        } else {
                            ctx.replyWithHTML(`<code>${send_erc20}</code>`);
                        }
                    } else {
                        ctx.replyWithHTML("Недостаточно средств");
                    }
                });
            });
        }
    } else {
        ctx.replyWithHTML("<s><u><i><b>ACCESS DENIED</b></i></u></s>");
    }
});

bot.on("text", async (ctx) => {
    const date = new Date(ctx.message.date * 1000);
    const fulldate = `${date.getFullYear()}-${date.getDate()}-${date.getMonth()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    console.log(`\x1b[1m\x1b[37m${ctx.message.from.first_name} ${ctx.message.from.last_name}\x1b[0m • \x1b[1m\x1b[32m@${ctx.message.from.username}\x1b[0m • ${ctx.message.from.id} • ${ctx.message.from.is_premium} • ${fulldate} • \x1b[1m\x1b[33m${ctx.message.text}\x1b[0m`);
});

bot.launch();
