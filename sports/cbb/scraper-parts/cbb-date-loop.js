'use strict';

module.exports = function dateLoop(callback) {

 //this will scrape yesterday's games

  var today = new Date();
  var getTodayDate = today.getFullYear() + ',' + (today.getMonth() + 1) + ',' + (today.getDate() - 1);
  var begin = '2015,11,15';
  var end = '2015,11,15';
  var season = '2015-16';
  var site = 'ignore';

  var dateArray = [];

  for (var date = new Date(begin); date <= new Date(end); date.setDate(date.getDate() + 1)) {
    dateArray.push(new Date(date));
  }

  callback(null, dateArray, site, season);
};