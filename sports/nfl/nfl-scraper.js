'use strict';

var async = require('async');
var nflDateLoop = require('./scraper-parts/nfl-date-loop');
var nflScoreboardScrape = require('./scraper-parts/nfl-scoreboard-scrape');
var nflLineHistoryScrape = require('./scraper-parts/nfl-line-history-scrape');

module.exports = function(req, res) {

  async.waterfall([
      nflDateLoop,
      nflScoreboardScrape,
      nflLineHistoryScrape
    ],

    function(err, result) {

    });

  res.send('See console');

};