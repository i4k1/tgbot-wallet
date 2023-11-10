const ethers = require("ethers");
const { parseUnits, parseEther, Contract } = require("ethers");
const walletJSON = require("./wallet.json");

const provider = new ethers.JsonRpcProvider(walletJSON.nodeUrl); // blockchain RPC node link
const wallet = new ethers.Wallet(walletJSON.privateKey, provider); // wallet private key
const abi = [ "function transfer(address to, uint amount)",
              "function balanceOf(address) public view returns (uint)",
              "function symbol() view returns (string)",
              "function name() view returns (string)" ];

const contractp = new Contract(walletJSON.ERC20, abi, provider); // ERC20 token contract address
const contractw = new Contract(walletJSON.ERC20, abi, wallet);

async function getBalanceETH(value) {
    if ( value === "amount" ) {
        const balance = await provider.getBalance(wallet.address);
        const balanceInEth = ethers.formatEther(balance); // wei to ether
        return balanceInEth;
    } else if ( value === "name" ) {
        const networkDetect = await provider._detectNetwork();
        const networkName = networkDetect["name"];
        return networkName;
    }
}

async function getBalanceERC20(value) {
    if ( value === "amount" ) {
        const balance = await contractp.balanceOf(wallet.address);
        const balanceInEth = ethers.formatEther(balance); // wei to ether
        return balanceInEth;
    } else if ( value === "name" ) {
        const erc20_name = await contractp.name();
        return erc20_name;
    } else if ( value === "symbol" ) {
        const erc20_symbol = await contractp.symbol();
        return erc20_symbol;
    }
}

async function sendEth(whomTransfer, amount) {
    // const balance = await contractp.balanceOf(wallet.address);
    // const balanceInEth = ethers.formatEther(balance); // wei to ether

    const balance = await provider.getBalance(wallet.address)
    let sendValue = parseEther(amount)
    let str = ethers.formatEther(sendValue)

    if ( balance >= sendValue ) {
        const tx = await wallet.sendTransaction({ to: whomTransfer, value: parseEther(str) });
        const receipt = await tx.wait();
        console.log(tx.hash);
        console.log(receipt);
        return tx.hash;
    } else {
        return "insufficient funds";
    }
}

async function sendERC20(whomTransfer, numOfTokens) {
    const balance = await contractw.balanceOf(wallet.address);
    const amount = parseUnits(numOfTokens, 18); // number of tokens
    if ( balance >= amount ) {
        const tx = await contractw.transfer(whomTransfer, amount); // to whom to transfer
        const receipt = await tx.wait();
        console.log(tx.hash);
        console.log(receipt);
        return tx.hash;
    } else {
        return "insufficient funds";
    }
}

module.exports = { getBalanceETH, getBalanceERC20, sendEth, sendERC20 };
