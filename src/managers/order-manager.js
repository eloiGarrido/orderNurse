'use strict';

const Table = require('cli-table');
const Binance = require('../libs/binance');
const utils = require('../libs/utils');

let clientBinance = new Binance();


async function getOrdersInfo(symbol, orderIds) {
    return clientBinance.getOrders(symbol, orderIds);
}

async function ordersInfo(symbol) {
    let trades = await clientBinance.getMyTrades(symbol);
    let ids = utils.getOrderIds(trades);
    return getOrdersInfo(symbol, ids);
}

async function getAccountBalances() {
    const assets = await clientBinance.getAccountInfo();
    return assets.balances;
}

async function getAssetSummary(symbol) {
    // console.log('getAssetSummary', symbol);
    let data = await Promise.all([
        ordersInfo(symbol),
        clientBinance.getAssetPrice(symbol)
    ]);
    return utils.getProfit(data[0], data[1]);
}

async function getProfitSnapshot() {
    // Get all assets of the account
    const assets = utils.formatAccountAssets(await clientBinance.getAccountBalances());
    let promises = [];
    assets.forEach(pair => {
        promises.push(getAssetSummary(pair));
    });

    let data = await Promise.all(promises);
    console.log(' ====> data', data);
    const table = new Table({
        head     : ['Asset', 'Cost', 'Rev', 'Rev(t)', 'Total(t)', '%'],
        colWidths: [10, 10, 10, 10, 10, 10]
    });
    data.forEach(entry => {
        table.push(entry);
    });
    // table = data;
    return table.toString();
    // return assets;
}

async function myTrades(symbol) {
    return clientBinance.getMyTrades(symbol);
}

async function getAssetPrice(symbol) {
    return clientBinance.getAssetPrice(symbol);
}

/**
 * Fetch last price form asset and update
 * @param symbol
 */
function updateAssetPrice(symbol) {

}

/**
 * Fetch orders older than last saved in database
 * @param symbol
 */
function updateAssetOrders(symbol) {

}


module.exports = {
    getProfitSnapshot : getProfitSnapshot,
    myTrades          : myTrades,
    getAssetSummary   : getAssetSummary,
    getAccountBalances: getAccountBalances,
    ordersInfo        : ordersInfo,
    getAssetPrice     : getAssetPrice
};
