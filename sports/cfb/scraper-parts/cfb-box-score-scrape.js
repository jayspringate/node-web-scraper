'use strict';

var async = require('async');
var request = require('request');
var cheerio = require('cheerio');
var _ = require('lodash/array');

module.exports =

  function lineHistoryScrape(eventIdArray, gameDataArray, initHomeSpreadClose, initTotalClose, callback) {

    var count = 0;

    async.eachSeries(eventIdArray, function lineHistoryRequests(item, asyncCallback) { //item here refers to eventIdArray

      var lineHistoryUrl = 'http://www.covers.com/odds/linehistory.aspx?eventId=' + item + '&sport=NCF'; //actual url intentionally omitted

      request(lineHistoryUrl, function(err, response, html) {
        if (err) {
          console.log(err);
        }

        var $ = cheerio.load(html);

        var stadiumSelector = $('div[class="row"]').last().text().split(' - ')[2].split('  ')[0];

        var daySelector = $('div[class="row"]').last().text().split(' - ')[1].split(',')[0];

        var attendanceSelector = $('div[class="row"]').last().text().split(' - ')[3].trim();

        // function totalOpenSelectorTest() {
        //   if (totalOpenSelector.text() === 'OFF' || totalOpenSelector.text().split('-')[0].length > 5) {
        //     console.log("OFF TEST FAIL - EVENTID = " + item);
        //     totalOpenSelector = totalOpenSelector.parent().next().children().last();
        //     totalOpenSelectorTest();
        //   }
        // }

        // function spreadOpenSelectorTest() {
        //   if (spreadOpenSelector.text() === 'OFF' || spreadOpenSelector.text().split('/')[0].length > 5) {
        //     console.log("OFF TEST FAIL - EVENTID = " + item);
        //     spreadOpenSelector = spreadOpenSelector.parent().next().children().eq(1);
        //     spreadOpenSelectorTest();
        //   }
        // }

        // totalOpenSelectorTest();
        // spreadOpenSelectorTest();

        var stadium = stadiumSelector;
        var dayOfWeek = daySelector;
        var attendance = parseInt(attendanceSelector);

        function findMatch() {
          var gameIndex = _.findIndex(gameDataArray, function(chr) {
            return chr.site == 'home' && chr.eventId == item + '-h';
          });

          gameDataArray[gameIndex].stadium = stadium;
          gameDataArray[gameIndex].dayOfWeek = dayOfWeek;
          gameDataArray[gameIndex].attendance = attendance;

          gameIndex = _.findIndex(gameDataArray, function(chr) {
            return chr.site == 'road' && chr.eventId == item + '-r';
          });

          gameDataArray[gameIndex].stadium = stadium;
          gameDataArray[gameIndex].dayOfWeek = dayOfWeek;
          gameDataArray[gameIndex].attendance = attendance;
        }

        findMatch();

        asyncCallback(); //callback inside request since that's the async part

      });
    });

    callback(null, eventIdArray, gameDataArray, initHomeSpreadClose, initTotalClose);
  };