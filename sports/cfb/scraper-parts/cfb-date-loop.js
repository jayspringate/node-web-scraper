'use strict';

module.exports = function dateLoop(callback) {

  var begin = '2011,9,6'; //week begins on Tuesday, ends on Monday
  var end = '2011,11,22';
  var gameType = 'reg';
  var season = '2011-12';

  var dateArray = [];

  for (var date = new Date(begin); date <= new Date(end); date.setDate(date.getDate() + 7)) {
    dateArray.push(new Date(date));
  }

  callback(null, dateArray, gameType, season);
};