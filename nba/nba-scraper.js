'use strict';

var async = require('async');
var dateLoop = require('./scraper-parts/date-loop');
var scoreboardScrape = require('./scraper-parts/scoreboard-scrape');
var lineHistoryScrape = require('./scraper-parts/line-history-scrape');

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