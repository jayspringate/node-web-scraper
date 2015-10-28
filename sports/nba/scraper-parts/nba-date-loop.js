'use strict';

module.exports = function dateLoop(callback) {

  var begin = '2015,10,27';
  var end = '2015,10,27';
  var gameType = 'reg';
  var season = '2015-16';

  var dateArray = [];

  for (var date = new Date(begin); date <= new Date(end); date.setDate(date.getDate() + 1)) {
    dateArray.push(new Date(date));
  }

  callback(null, dateArray, gameType, season);
};