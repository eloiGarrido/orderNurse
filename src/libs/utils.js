'use strict';

const chalk = require('chalk');

function sortDescendingByTime(orders) {
    return orders.concat().sort((x, y) => {
        return y.time - x.time;
    });
}

function sortAscendingByTime(orders) {
    return orders.concat().sort((x, y) => {
        return x.time - y.time;
    });
}

function getOrderIds(orders) {
    let orderIds = new Set();
    orders.map(order => {
        orderIds.add(order.orderId);
    });
    return orderIds;
}

function filterOutZeroBalanceAssets(balances = []) {
    return balances.filter(asset => {
        return (asset.free !== '0.00000000' || asset.locked !== '0.00000000') && asset.asset !== 'BTC';
    });
}

function getProfit(orders = [], price) {
    if (orders.length <= 0) return;
    // console.log(orders);
    console.log('getProfit', orders[0].symbol, price);

    let qBuy = 0;
    let qSell = 0;
    let cost = 0
    let rev = 0;
    let symbol = '';
    orders.forEach(order => {
        symbol = order.symbol;
        if (order.status === 'CANCELLED') return;
        let q = parseFloat(order.executedQty);
        let p = parseFloat(order.price);
        if (order.side === 'BUY') {
            qBuy += q;
            cost += q * p;
        }

        if (order.side === 'SELL') {
            qSell += q;
            rev += q * p;
        }
    });

    const remQty = qBuy - qSell;
    const remAssetValue = remQty * price;
    const totalTemp = rev + remAssetValue;
    const percent = ((totalTemp - cost) / cost * 100).toFixed(3);
    let percentString = percent > 0 ? chalk.green(percent.toString()) : chalk.red(percent.toString());
    return [symbol.replace('BTC', ''), cost.toFixed(4), rev.toFixed(4), remAssetValue.toFixed(4), totalTemp.toFixed(4), percentString];
}

function formatAccountAssets(assets) {
    let filterAsset = filterOutZeroBalanceAssets(assets);
    return filterAsset.map(entry => {
        return `${entry.asset}BTC`;
    });
}

module.exports = {
    getOrderIds               : getOrderIds,
    getProfit                 : getProfit,
    formatAccountAssets       : formatAccountAssets,
    filterOutZeroBalanceAssets: filterOutZeroBalanceAssets
};
