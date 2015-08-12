'use strict';

var Game = require('../models/Game');
var Sql = require('sequelize');
var sql = new Sql('wagermetrics_dev', 'wagermetrics_dev',
  'passwordGoesHere', {  //password intentionally omitted
    dialect: 'postgres'
  });
var async = require('async');
var dateLoop = require('./date-loop');
var scoreboardScrape = require('./scoreboard-scrape');
var lineHistoryScrape = require('./line-history-scrape');

module.exports = function(req, res) {

  async.waterfall([
      dateLoop,
      scoreboardScrape,
      lineHistoryScrape
    ],

    function(err, result) {

    });

  res.send('See console');

};