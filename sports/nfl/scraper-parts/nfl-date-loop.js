'use strict';

module.exports = function dateLoop(callback) {

  //this will scrape yesterday's games

  var today = new Date();
  var begin = today.getFullYear() + ',' + (today.getMonth() + 1) + ',' + (today.getDate() - 1);
  var end = begin;
  var gameType = 'reg';
  var season = '2015-16';
  var site = 'ignore';

  var dateArray = [];

  for (var date = new Date(begin); date <= new Date(end); date.setDate(date.getDate() + 7)) {
    dateArray.push(new Date(date));
  }

  callback(null, dateArray, site, gameType, season);
};