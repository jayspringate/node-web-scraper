'use strict';

var express = require('express');
var app = express();
var nbaScraper = require('./sports/nba/nba-scraper');
var cfbScraper = require('./sports/cfb/cfb-scraper');
var nflScraper = require('./sports/nfl/nfl-scraper');
var phantom = require('./phantom-scrape');
var cheerio = require('./cheerio-scrape');

app.get('/nbascrape', nbaScraper);
app.get('/cfbscrape', cfbScraper);
app.get('/nflscrape', nflScraper);
app.get('/phantom', phantom);
app.get('/cheerio', cheerio);

app.listen('3000', function() {
  console.log('server listening on port 3000');
});

module.exports = app;