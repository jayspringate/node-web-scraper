'use strict';

var async = require('async');
var request = require('request');
var cheerio = require('cheerio');
var _ = require('lodash/array');

module.exports =

  function boxScoreScrape(eventIdArray, gameDataArray, initHomeSpreadClose, initTotalClose, callback) {

    async.eachSeries(eventIdArray, function boxScoreRequests(item, asyncCallback) { //item here refers to eventIdArray

      var boxScoreUrl = 'http://www.covers.com/pageLoader/pageLoader.aspx?page=/data/ncf/results/2012-2013/boxscore' + item + '.html'; //actual url intentionally omitted

      request(boxScoreUrl, function(err, response, html) {
        if (err) {
          console.log(err);
        }

        var $ = cheerio.load(html);

        var stadiumSelector = $('div[class="row"]').last();

        var daySelector = $('div[class="row"]').last();

        var attendanceSelector = $('div[class="row"]').last();

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

        var stadium = stadiumSelector.text().split(' - ')[2].split('  ')[0];
        var dayOfWeek = daySelector.text().split(' - ')[1].split(',')[0];
        var attendance = parseInt(attendanceSelector.text().split(' - ')[3].trim());

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