'use strict';

module.exports = function dateLoop(callback) {

  var begin = '2013,2,19';
  var end = '2013,4,17';
  var gameType = 'reg';
  var season = '2012-13'; //experiment with exporting table name to model

  var dateArray = [];

  for (var d = new Date(begin); d <= new Date(end); d.setDate(d.getDate() + 1)) {
    dateArray.push(new Date(d));
  }

  callback(null, dateArray, gameType, season);
};