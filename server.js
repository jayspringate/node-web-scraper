'use strict';

var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();
var scraper = require('./scraper')

app.get('/scrape', scraper);

app.listen('3000')

console.log('server listening on port 3000');

module.exports = app;