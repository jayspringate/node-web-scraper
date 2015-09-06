'use strict';

module.exports = function dateLoop(callback) {

  var begin = '2013,8,31'; //using Saturdays
  var end = '2013,12,14';
  var gameType = 'reg';
  var season = '2013-14';
  var site = 'ignore';

  var dateArray = [];

  for (var date = new Date(begin); date <= new Date(end); date.setDate(date.getDate() + 7)) {
    dateArray.push(new Date(date));
  }

  callback(null, dateArray, site, gameType, season);
};