"use strict";

// bluebird = require('bluebird'),
// redis = require('redis'),
const pkg = require("./package.json");
const binance = require("./src/libs/binance");
const vorpal = require("vorpal")();
const orderMan = require("./src/managers/order-manager");
const utils = require("./src/libs/utils");

// TODO Export redis into own file
// add a Async to all node_redis functions (e.g. return client.getAsync().then())
// bluebird.promisifyAll(redis.RedisClient.prototype);
// bluebird.promisifyAll(redis.Multi.prototype);
// const redisClient = redis.createClient();

// let sendMessage = ()=>{pushjet.sendMessage('hola');}

// vorpal
//     .command('time', 'Get server time".')
//     .action((args, callback) => {
//         time();
//         callback();
//     });

vorpal
    .command("openOrders", 'Get all open orders".')
    .action((args, callback) => {
        binance.allOpenOrders();
        callback();
    });

vorpal.command("account", 'Get account info".').action((args, callback) => {
    orderMan
        .getAccountBalances()
        .then(res => {
            console.log(utils.formatAccountAssets(res));
            callback();
        })
        .catch(err => {
            console.log(err);
            callback();
        });
});

// vorpal
//     .command('openLimit', 'Get open limit orders".')
//     .action((args, callback) => {
//         binance.getOpenLimitOrders();
//         callback();
//     });

vorpal
    .command("myTrades <symbol>", 'Get my trades".')
    .action((args, callback) => {
        orderMan
            .myTrades(args.symbol)
            .then(res => {
                console.log(res);
                callback();
            })
            .catch(err => {
                console.log(err);
            });
    });

// vorpal
//     .command('tradesHistory <symbol>', 'Get tradesHistory".')
//     .action((args, callback) => {
//         binance.tradesHistory(args.symbol);
//         callback();
//     });

// vorpal
//     .command('getOrder <symbol> <orderId>', 'Get order info')
//     .action((args, callback) => {
//         binance.getOrder(args.symbol, args.orderId);
//         callback();
//     });
//
// vorpal
//     .command('ordersInfo <symbol>', 'Get order extended info')
//     .action((args, callback) => {
//         // Promise.all(orderMan.ordersInfo(args.symbol),  orderMan.getAssetPrice(args.symbol))
//         let symbol = args.symbol;
//         orderMan.ordersInfo(symbol)
//             .then(orders => {
//                 // console.log(res);
//                 // let price = orderMan.getAssetPrice(args.symbol);
//
//                 binance.client.dailyStats({symbol: symbol})
//                     .then(daily => {
//                         const price = parseFloat(daily.lastPrice);
//                         console.log('dailyStats', price);
//                         orderMan.getProfit(orders, price);
//                         // return price;
//                     })
//                     .catch(err => {
//                         console.log(err);
//                     })
//
//                 // orderMan.getProfit(res[0], res[1]);
//             })
//             .catch(err => {
//                 console.log(err);
//             });
//         callback();
//     });
vorpal
    .command("assetSummary <symbol>", "Get asset summary")
    .action((args, callback) => {
        orderMan
            .getAssetSummary(args.symbol)
            .then(res => {
                console.log(res);
                callback();
            })
            .catch(err => {
                console.log(err);
                callback();
            });
    });

vorpal.command("assets", "Get profit summary").action((args, callback) => {
    orderMan
        .getProfitSnapshot()
        .then(res => {
            console.log(res);
            callback();
        })
        .catch(err => {
            console.log(err);
            callback();
        });
});

vorpal
    .command("assetPrice <symbol>", "Get asset price")
    .action((args, callback) => {
        orderMan
            .getAssetPrice(args.symbol)
            .then(res => {
                console.log(res);
                callback();
            })
            .catch(err => {
                console.log(err);
                callback();
            });
    });

vorpal
    .command("ordersInfo <symbol>", "Get asset price")
    .action((args, callback) => {
        orderMan
            .ordersInfo(args.symbol)
            .then(res => {
                console.log(res);
                callback();
            })
            .catch(err => {
                console.log(err);
                callback();
            });
    });

vorpal.delimiter("orderNurse$").show();
