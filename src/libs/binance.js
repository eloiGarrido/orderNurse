// 'use strict';
//
// // require('dotenv').load();
//
// const Binance = require('binance-api-node').default //https://github.com/binance-exchange/binance-api-node
// const chalk = require('chalk');
// const orderType = require('./enums').orderType;
//
// const binanceKey = process.env.apiKey;
// const binanceSecred = process.env.apiSecred;
//
// let client = null;
//
// if(binanceKey === undefined){
//     console.log('No exchange key provided, private queries disabled');
//     client = Binance();
// } else {
//     console.log('Key provided, private mode enabled');
//     client = Binance({
//         apiKey:binanceKey,
//         apiSecret: binanceSecred
//     });
// }
//
// function getServerTime() {
//     client.time().then(time=>{
//         console.log(time);
//     });
// }
//
// function getOrder(symbol, orderId){
//     if(symbol === undefined){
//         console.log(chalk.red('ERROR:') + ' symbol not provided');
//         return;
//     }
//     client.getOrder({symbol: symbol, orderId:orderId})
//     .then(orders=>{
//         console.log(orders);
//     })
//     .catch(err=>{
//         console.log(err);
//     })
// }
//
// function cancelOrder(symbol, orderId){
//     if(symbol === undefined){
//         console.log(chalk.red('ERROR:') + ' symbol not provided');
//         return;
//     }
//     client.getOrder({symbol: symbol, orderId:orderId})
//     .then(orders=>{
//         console.log(orders);
//     })
//     .catch(err=>{
//         console.log(err);
//     })
// }
//
// function allOpenOrders(){
//     client.openOrders()
//     .then(orders=>{
//         console.log(orders);
//         return;
//     })
//     .catch(err=>{
//         console.log(err);
//         return
//     })
// }
//
// function openOrdersByPair(symbol){
//     if(symbol=== undefined){
//         console.log(chalk.red('ERROR:') + ' symbol not provided');
//         return;
//     }
//     client.openOrders({symbol:symbol})
//     .then(orders=>{
//         console.log(orders);
//     })
//     .catch(err=>{
//         console.log(err);
//     })
// }
//
// function allOrders(symbol){
//     if(symbol=== undefined){
//         console.log(chalk.red('ERROR:') + ' symbol not provided');
//         return;
//     }
//     client.allOrders({symbol:symbol})
//         .then(orders=>{
//             console.log(orders);
//         })
//         .catch(err=>{
//             console.log(err);
//         });
// }
//
// function getAccountInfo(){
//     client.accountInfo()
//     .then(data=>{
//         let filterOrders = data.balances.filter(asset=>{
//             return asset.free !== '0.00000000' || asset.locked !== '0.00000000';
//         });
//         console.log(filterOrders)
//     })
//     .catch(err=>{
//         console.log(err);
//     });
// }
//
// async function accountAssets(){
//     const account = await client.accountInfo();
//     let filterAsset = account.balances.filter(asset=>{
//         return (asset.free !== '0.00000000' || asset.locked !== '0.00000000') && asset.asset !== 'BTC';
//     });
//     let assetPairs = filterAsset.map(entry=>{
//         return `${entry.asset}BTC`;
//     })
//     return assetPairs;
// }
//
// function myTrades(symbol){
//     if(symbol=== undefined){
//         console.log(chalk.red('ERROR:') + ' symbol not provided');
//         return;
//     }
//     client.myTrades({symbol:symbol})
//         .then(trades=>{
//             console.log(trades);
//         })
//         .catch(err=>{
//             console.log(err);
//         });
// }
//
// function tradesHistory(symbol){
//     client.tradesHistory({symbol:symbol})
//         .then(trades=>{
//             console.log(trades);
//         })
//         .catch(err=>{
//             console.log(err);
//         });
// }
//
// function getOpenLimitOrders(){
//     client.openOrders()
//     .then(orders=>{
//         const filterOrders = orders.filter(entry=>{
//             return entry.type === orderType.LIMIT
//         });
//         console.log(filterOrders);
//     })
//     .catch(err=>{
//         console.log(err);
//     });
// }
//
// async function getAssetPrice(symbol){
//     let dailyStats = await client.dailyStats({ symbol: symbol });
//     return parseFloat(dailyStats.lastPrice);
// }
//
// module.exports = {
//     getServerTime: getServerTime,
//     getAccountInfo:getAccountInfo,
//     allOrders:allOrders,
//     myTrades: myTrades,
//     openOrdersByPair: openOrdersByPair,
//     allOpenOrders: allOpenOrders,
//     getOpenLimitOrders: getOpenLimitOrders,
//     tradesHistory: tradesHistory,
//     getOrder: getOrder,
//     client: client,
//     accountAssets: accountAssets,
//     getAssetPrice:getAssetPrice
// }


'use strict';

const Promise = require('bluebird');
const log = require('fancy-log');
const config = require('../../config/config').binance;
const binance = require('binance-api-node').default;  //https://github.com/binance-exchange/binance-api-node

Promise.config({
    cancellation: true
});


class Binance {
    constructor() {
        // constructor      l
        let self = this;
        if (config.key === undefined) {
            log('No exchange key provided, private queries disabled');
            self.client = binance();
        } else {
            log('Key provided, private mode enabled');
            self.client = binance({
                apiKey   : config.key,
                apiSecret: config.secret,
                options  : {
                    adjustForTimeDifference: true,
                    verbose                : true, // if needed, not mandatory
                    recvWindow             : 10000000, // not really needed
                }
            });
        }
    }

    async getServerTime() {
        return await this.client.time();
    }

    async getAccountInfo() {
        return await this.client.accountInfo();
    }

    async getMyTrades(symbol) {
        return this.client.myTrades({symbol: symbol});
    }

    async getOrders(symbol, orderIds) {
        let promises = [];
        orderIds.forEach(id => {
            promises.push(this.client.getOrder({symbol: symbol, orderId: id}));
        });
        return Promise.all(promises);
    }

    async getOrder(symbol, orderId) {
        return this.client.getOrder({symbol: symbol, orderId: orderId})
    }

    async allOrders(symbol) {
        return this.client.allOrders({symbol: symbol});
    }

    async dailyStats(symbol) {
        return parseFloat(await this.client.dailyStats({symbol: symbol}));
    }

    async getAssetPrice(symbol) {
        const dailyStats = await this.client.dailyStats({symbol: symbol});
        return parseFloat(dailyStats.lastPrice);
    }

    async getAccountBalances() {
        const assets = await this.client.accountInfo();
        return assets.balances;
    }
}

module.exports = Binance;
