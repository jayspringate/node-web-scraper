'use strict';

module.exports = function dateLoop(callback) {

  var begin = '2015,4,18';
  var end = '2015,6,16';
  var gameType = 'playoff';
  var season = '2014-15'; //experiment with exporting table name to model

  var dateArray = [];

  for (var d = new Date(begin); d <= new Date(end); d.setDate(d.getDate() + 1)) {
    dateArray.push(new Date(d));
  }

  callback(null, dateArray, gameType, season);
};