'use strict';

const redis = require('redis');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const client = redis.createClient();

client.on("connect", (res) => {
    console.log("Connected", res);
});

client.on("error", function(err) {
    console.log("Error " + err);
});

function exitClient() {
    return client.quit();
}

/**
 * Save bulk orders into redis with TTL
 * @param {*} orders
 */
function saveOrders(orders) {

}

module.exports = {
    client    : client,
    exitClient: exitClient,
    saveOrders: saveOrders
};
