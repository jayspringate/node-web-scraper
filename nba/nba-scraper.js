'use strict';

var async = require('async');
var nbaDateLoop = require('./scraper-parts/nba-date-loop');
var nbaScoreboardScrape = require('./scraper-parts/nba-scoreboard-scrape');
var nbaLineHistoryScrape = require('./scraper-parts/nba-line-history-scrape');

module.exports = function(req, res) {

  async.waterfall([
      nbaDateLoop,
      nbaScoreboardScrape,
      nbaLineHistoryScrape
    ],

    function(err, result) {

    });

  res.send('See console');

};