'use strict';

var async = require('async');
var _ = require('lodash/array');
var request = require('request');
var cheerio = require('cheerio');
var Game = require('../../models/Game');
var atsGrade = require('./assign/atsGrade');
var suGrade = require('./assign/suGrade');
var totalGrade = require('./assign/totalGrade');
var spreadMove = require('./assign/spreadMove');
var totalMove = require('./assign/totalMove');

module.exports =

  function lineHistoryScrape(eventIdArray, gameDataArray, callback) {

    var count = 0;

    async.eachSeries(eventIdArray, function lineHistoryRequests(item, asyncCallback) { //item here refers to eventIdArray

      var lineHistoryUrl = 'beginUrlGoesHere' + item + '&sport=NBA'; //actual url intentionally omitted

      request(lineHistoryUrl, function(err, response, html) {
        if (err) {
          console.log(err);
        }

        var $$ = cheerio.load(html);

        var spreadOpenSelector = $$('a[href*="269"]').parent().parent().next().children().eq(1); //269 is an important ID

        var totalOpenSelector = $$('a[href*="269"]').parent().parent().next().children().last();

        var spreadCloseSelector = $$('a[href*="269"]').parent().parent().nextUntil('tr[bgcolor=#ECECE4]').children().last().prev(); //761 is an important ID

        var totalCloseSelector = $$('a[href*="269"]').parent().parent().nextUntil('tr[bgcolor=#ECECE4]').children().last();

        function totalOpenSelectorTest() {
          if (totalOpenSelector.text() === 'OFF' || totalOpenSelector.text().split('-')[0].length > 5) {
            console.log("OFF TEST FAIL - EVENTID = " + item);
            totalOpenSelector = totalOpenSelector.parent().next().children().last();
            totalOpenSelectorTest();
          }
        }

        function spreadOpenSelectorTest() {
          if (spreadOpenSelector.text() === 'OFF' || spreadOpenSelector.text().split('/')[0].length > 5) {
            console.log("OFF TEST FAIL - EVENTID = " + item);
            spreadOpenSelector = spreadOpenSelector.parent().next().children().eq(1);
            spreadOpenSelectorTest();
          }
        }


        totalOpenSelectorTest();
        spreadOpenSelectorTest();

        var spreadOpen = parseFloat(spreadOpenSelector.text().split('/')[0]);
        var totalOpen = parseFloat(totalOpenSelector.text().split('-')[0]);
        var spreadClose = parseFloat(spreadCloseSelector.text().split('/')[0]);
        var totalClose = parseFloat(totalCloseSelector.text().split('-')[0]);

        function findMatch() {
          var gameIndex = _.findIndex(gameDataArray, function(chr) {
            return ((chr.teamCourt == 'home') && (chr.eventId == item + '-h'));
          });

          gameDataArray[gameIndex].spreadOpen = spreadOpen;
          gameDataArray[gameIndex].spreadClose = spreadClose;
          gameDataArray[gameIndex].totalOpen = totalOpen;
          gameDataArray[gameIndex].totalClose = totalClose;

          function assignWrite() {
            atsGrade(gameDataArray, gameIndex);
            suGrade(gameDataArray, gameIndex);
            totalGrade(gameDataArray, gameIndex);
            spreadMove(gameDataArray, gameIndex);
            totalMove(gameDataArray, gameIndex);

            Game.create(gameDataArray[gameIndex]); //writing to db
          }

          assignWrite();

          gameIndex = _.findIndex(gameDataArray, function(chr) {
            return chr.teamCourt == 'road' && chr.eventId == item + '-r';
          });

          gameDataArray[gameIndex].spreadOpen = -spreadOpen;
          gameDataArray[gameIndex].spreadClose = -spreadClose;
          gameDataArray[gameIndex].totalOpen = totalOpen;
          gameDataArray[gameIndex].totalClose = totalClose;

          assignWrite();
        }

        function numberTest() {
          if ((isNaN(spreadOpen) === true ||
              isNaN(spreadClose) === true ||
              isNaN(totalOpen) === true ||
              isNaN(totalClose) === true) && count < 2) {
            console.log('initially NaN, rerunning...EVENTID = ' + item);
            count++;
            lineHistoryRequests(item, callback);
          } else if ((isNaN(spreadOpen) === true ||
              isNaN(spreadClose) === true ||
              isNaN(totalOpen) === true ||
              isNaN(totalClose) === true) && count === 2) {
            spreadClose = spreadOpen;
            totalClose = totalOpen;
            findMatch();
          } else {
            findMatch();
          }
        }

        numberTest();

        asyncCallback(); //callback inside request since that's the async part

      });
    });

    callback(null);
  };