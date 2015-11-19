'use strict';

var async = require('async');
var cbbDateLoop = require('./scraper-parts/cbb-date-loop');
var cbbScoreboardScrape = require('./scraper-parts/cbb-scoreboard-scrape');
var cbbLineHistoryScrape = require('./scraper-parts/cbb-line-history-scrape');

module.exports = function(req, res) {

  async.waterfall([
      cbbDateLoop,
      cbbScoreboardScrape,
      cbbLineHistoryScrape
    ],

    function(err, result) {

    });

  res.send('See console');

};