'use strict';

var async = require('async');
var cfbDateLoop = require('./scraper-parts/cfb-date-loop');
var cfbScoreboardScrape = require('./scraper-parts/cfb-scoreboard-scrape');
var cfbLineHistoryScrape = require('./scraper-parts/cfb-line-history-scrape');

module.exports = function(req, res) {

  async.waterfall([
      cfbDateLoop,
      cfbScoreboardScrape,
      cfbLineHistoryScrape
    ],

    function(err, result) {

    });

  res.send('See console');

};