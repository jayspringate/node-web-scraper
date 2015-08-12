'use strict';

module.exports = function dateLoop(callback) {

  var begin = '2012,4,28';
  var end = '2012,6,21';
  var gameType = 'playoff';
  var season = '2011-12';

  var dateArray = [];

  for (var date = new Date(begin); date <= new Date(end); date.setDate(date.getDate() + 1)) {
    dateArray.push(new Date(date));
  }

  callback(null, dateArray, gameType, season);
};