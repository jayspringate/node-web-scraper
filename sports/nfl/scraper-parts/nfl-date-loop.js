'use strict';

module.exports = function dateLoop(callback) {

  var begin = '2015,10,25'; //using Sundays
  var end = '2015,10,25';
  var gameType = 'reg';
  var season = '2015-16';
  var site = 'ignore';

  var dateArray = [];

  for (var date = new Date(begin); date <= new Date(end); date.setDate(date.getDate() + 7)) {
    dateArray.push(new Date(date));
  }

  callback(null, dateArray, site, gameType, season);
};