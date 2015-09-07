'use strict';

module.exports = function dateLoop(callback) {

  var begin = '2015,1,4'; //using Sundays
  var end = '2015,1,18';
  var gameType = 'playoff';
  var season = '2014-15';
  var site = 'ignore';

  var dateArray = [];

  for (var date = new Date(begin); date <= new Date(end); date.setDate(date.getDate() + 7)) {
    dateArray.push(new Date(date));
  }

  callback(null, dateArray, site, gameType, season);
};