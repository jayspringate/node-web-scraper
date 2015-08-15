'use strict';

module.exports = function dateLoop(callback) {

  var begin = '2014,11,1';
  var end = '2014,11,30';
  var gameType = 'reg';
  var season = '2014-15';

  var dateArray = [];

  for (var date = new Date(begin); date <= new Date(end); date.setDate(date.getDate() + 1)) {
    dateArray.push(new Date(date));
  }

  callback(null, dateArray, gameType, season);
};