'use strict';

var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var app = express();
var nbaScraper = require('./nba-scraper');

app.get('/nbascrape', nbaScraper);

app.listen('3000');

console.log('server listening on port 3000');

module.exports = app;