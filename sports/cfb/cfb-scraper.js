'use strict';

var async = require('async');
var cfbDateLoop = require('./scraper-parts/cfb-date-loop');
var cfbScoreboardScrape = require('./scraper-parts/cfb-scoreboard-scrape');
var cfbBoxScoreScrape = require('./scraper-parts/cfb-box-score-scrape');
var cfbLineHistoryScrape = require('./scraper-parts/cfb-line-history-scrape');
var cfbConsensusScrape = require('./scraper-parts/cfb-consensus-scrape');
var cfbCheckNeutral = require('./scraper-parts/cfb-check-neutral');

module.exports = function(req, res) {

  async.waterfall([
      cfbDateLoop,
      cfbScoreboardScrape,
      cfbBoxScoreScrape,
      cfbConsensusScrape,
      cfbLineHistoryScrape
    ],

    function(err, result) {

    });

  res.send('See console');

};