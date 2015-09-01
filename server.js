'use strict';

var express = require('express');
var app = express();
var nbaScraper = require('./nba/nba-scraper');
var cfbScraper = require('./cfb/cfb-scraper');

app.get('/nbascrape', nbaScraper);
app.get('/cfbscrape', cfbScraper);

app.listen('3000', function() {
  console.log('server listening on port 3000');
});

module.exports = app;