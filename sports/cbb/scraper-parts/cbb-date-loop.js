'use strict';

module.exports = function dateLoop(callback) {

 //this will scrape yesterday's games

  var today = new Date();
  var todayDate = today.getFullYear() + ',' + (today.getMonth() + 1) + ',' + (today.getDate() - 1);
  var begin = todayDate;
  var end = todayDate;
  var season = '2015-16';

  var dateArray = [];

  for (var date = new Date(begin); date <= new Date(end); date.setDate(date.getDate() + 1)) {
    dateArray.push(new Date(date));
  }

  callback(null, dateArray, season);
};