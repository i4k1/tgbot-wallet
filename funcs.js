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

async function getBalance() {
    const balance = await provider.getBalance(wallet.address);
    const balanceInEth = ethers.formatEther(balance); // wei to ether
    return balanceInEth;
}

async function sendEth(whomTransfer, numOfTokens) {
    const tx = await wallet.sendTransaction({ to: whomTransfer, value: parseEther(numOfTokens) });
    const receipt = await tx.wait();
    console.log(tx.hash);
    console.log(receipt);
}

async function getERC20() {
    const balance = await contractp.balanceOf(wallet.address);
    const balanceInEth = ethers.formatEther(balance); // wei to ether
    return balanceInEth;
}

async function getERC20Name() {
    const erc20_name = await contractp.name();
    return erc20_name;
}

async function getERC20Symbol() {
    const erc20_symbol = await contractp.symbol();
    return erc20_symbol;
}

async function sendERC20(whomTransfer, numOfTokens) {
    const amount = parseUnits(numOfTokens, 18); // number of tokens
    const tx = await contractw.transfer(whomTransfer, amount); // to whom to transfer
    const receipt = await tx.wait();
    console.log(tx.hash);
    console.log(receipt);
}

module.exports = { getBalance, getERC20, getERC20Name, getERC20Symbol };
