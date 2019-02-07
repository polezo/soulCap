import AssetBuyer from "./node_modules/@0x/asset-buyer";
// import {BigNumber} from 'big-number';
// var BigNumber = require('big-number');
import BigNumber from "./node_modules/bignumber.js/bignumber.mjs";

const provider = web3.currentProvider;
const apiUrl = "https://relay.underwoodpaul.com/v2/";
const assetBuyer = AssetBuyer.getAssetBuyerForStandardRelayerAPIUrl(
  provider,
  apiUrl
);

const WETHAddress = "0xd0A1E359811322d97991E03f863a0C30C2cF029C";
console.log(new BigNumber(1));
const bNum = new BigNumber(1000000);
const buyQuote =  assetBuyer.getBuyQuoteForERC20TokenAddressAsync(WETHAddress, bNum);

console.log("buy them all")
