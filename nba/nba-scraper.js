'use strict';

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