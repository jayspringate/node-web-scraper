'use strict';

module.exports = function dateLoop(callback) {

  var begin = '2012,4,28';
  var end = '2012,6,21';
  var gameType = 'playoff';
  var season = '2011-12'; //experiment with exporting table name to model

  var dateArray = [];

  for (var d = new Date(begin); d <= new Date(end); d.setDate(d.getDate() + 1)) {
    dateArray.push(new Date(d));
  }

  callback(null, dateArray, gameType, season);
};