"use strict";

require("dotenv").config({path: __dirname + "/../.env"});

const config = {
    binance: {
        key   : process.env.binanceApiKey,
        secret: process.env.binanceApiSecret
    }
};

module.exports = config;
