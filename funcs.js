// 24-11-2023 i4k

const ethers = require("ethers");
const { parseUnits, parseEther, Contract } = require("ethers");
const walletJSON = require("./wallet.json");

const abi = [
    "function transfer(address to, uint amount)",
    "function balanceOf(address) public view returns (uint)",
    "function symbol() view returns (string)",
    "function name() view returns (string)"
];

async function getBalanceETH(node_url, value) {
    const provider = new ethers.JsonRpcProvider(node_url); // blockchain RPC node link
    const walletMnemonic = ethers.Wallet.fromPhrase(walletJSON.mnemonicPhrase, provider); // wallet mnemonic phrase
    const wallet = new ethers.Wallet(walletMnemonic.privateKey, provider); // wallet private key

    if ( value === "amount" ) {
        const balance = await provider.getBalance(wallet.address);
        const balanceInEth = ethers.formatEther(balance); // wei to ether
        return balanceInEth;
    } else if ( value === "name" ) {
        const networkDetect = await provider._detectNetwork();
        const networkName = networkDetect["name"];
        return networkName;
    } else if ( value === "id" ) {
        const networkDetect = await provider._detectNetwork();
        const networkId = networkDetect["chainId"];
        return networkId;
    } else {
        return "invalid function parameter";
    }
}

async function getBalanceERC20(node_url, token, value) {
    const provider = new ethers.JsonRpcProvider(node_url); // blockchain RPC node link
    const walletMnemonic = ethers.Wallet.fromPhrase(walletJSON.mnemonicPhrase, provider); // wallet mnemonic phrase
    const wallet = new ethers.Wallet(walletMnemonic.privateKey, provider); // wallet private key
    const contract = new Contract(token, abi, provider); // ERC20 token contract address
    if ( value === "amount" ) {
        const balance = await contract.balanceOf(wallet.address);
        const balanceInEth = ethers.formatEther(balance); // wei to ether
        return balanceInEth;
    } else if ( value === "name" ) {
        const erc20_name = await contract.name();
        return erc20_name;
    } else if ( value === "symbol" ) {
        const erc20_symbol = await contract.symbol();
        return erc20_symbol;
    } else {
        return "invalid function parameter";
    }
}

async function sendETH(node_url, addressTo, amount) {
    const provider = new ethers.JsonRpcProvider(node_url); // blockchain RPC node link
    const walletMnemonic = ethers.Wallet.fromPhrase(walletJSON.mnemonicPhrase, provider); // wallet mnemonic phrase
    const wallet = new ethers.Wallet(walletMnemonic.privateKey, provider); // wallet private key
    const tx = await wallet.sendTransaction({ to: addressTo, value: parseEther(amount) });
    const receipt = await tx.wait();
    console.log(tx.hash, receipt);
    return tx.hash;
}

async function sendERC20(node_url, token, addressTo, amountToken) {
    const provider = new ethers.JsonRpcProvider(node_url); // blockchain RPC node link
    const walletMnemonic = ethers.Wallet.fromPhrase(walletJSON.mnemonicPhrase, provider); // wallet mnemonic phrase
    const wallet = new ethers.Wallet(walletMnemonic.privateKey, provider); // wallet private key
    const contract = new Contract(token, abi, wallet);
    const amount = parseUnits(amountToken, 18); // number of tokens
    const tx = await contract.transfer(addressTo, amount); // to whom to transfer
    const receipt = await tx.wait();
    console.log(tx.hash, receipt);
    return tx.hash;
}

module.exports = { getBalanceETH, getBalanceERC20, sendETH, sendERC20 };
