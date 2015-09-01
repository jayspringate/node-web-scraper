'use strict';

module.exports = function dateLoop(callback) {

  var begin = '2011,8,30';
  var end = '2011,8,30';
  var gameType = 'reg';
  var season = '2011-12';

  var dateArray = [];

  for (var date = new Date(begin); date <= new Date(end); date.setDate(date.getDate() + 7)) {
    dateArray.push(new Date(date));
  }

  callback(null, dateArray, gameType, season);
};