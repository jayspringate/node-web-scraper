'use strict';

var async = require('async');
var _ = require('lodash/array');
var request = require('request');
var cheerio = require('cheerio');
var Game = require('../models/Game');

module.exports =

  function lineHistoryScrape(eventIdArray, gameDataArray, callback) {

    var count = 0;

    async.eachSeries(eventIdArray, function lineHistoryRequests(item, asyncCallback) { //item here refers to eventIdArray

      var lineHistoryUrl = 'http://www.covers.com/odds/linehistory.aspx?eventId=' + item + '&sport=NBA';  //actual url intentionally omitted

      request(lineHistoryUrl, function(err, response, html) {
        if (err) {
          console.log(err);
        }

        var $$ = cheerio.load(html);

        var spreadOpenSelector = $$('a[href*="269"]').parent().parent().next().children().eq(1); //269 is the ID for Bookmaker

        var totalOpenSelector = $$('a[href*="269"]').parent().parent().next().children().last();

        var spreadCloseSelector = $$('a[href*="269"]').parent().parent().nextUntil('tr[bgcolor=#ECECE4]').children().last().prev(); //761 is the ID of the book following BookMaker

        var totalCloseSelector = $$('a[href*="269"]').parent().parent().nextUntil('tr[bgcolor=#ECECE4]').children().last();

        function totalOpenSelectorTest() {
          if (totalOpenSelector.text() === 'OFF' || totalOpenSelector.text().split('-')[0].length > 5) {
            console.log("OFF TEST FAIL - EVENTID = " + item);
            totalOpenSelector = totalOpenSelector.parent().next().children().last();
            totalOpenSelectorTest();
          }
        }

        totalOpenSelectorTest();

        function spreadOpenSelectorTest() {
          if (spreadOpenSelector.text() === 'OFF' || spreadOpenSelector.text().split('/')[0].length > 5) {
            console.log("OFF TEST FAIL - EVENTID = " + item);
            spreadOpenSelector = spreadOpenSelector.parent().next().children().eq(1);
            spreadOpenSelectorTest();
          }
        }

        spreadOpenSelectorTest();

        var spreadOpen = parseFloat(spreadOpenSelector.text().split('/')[0]);
        var totalOpen = parseFloat(totalOpenSelector.text().split('-')[0]);
        var spreadClose = parseFloat(spreadCloseSelector.text().split('/')[0]);
        var totalClose = parseFloat(totalCloseSelector.text().split('-')[0]);

        function dbWrite () {
          var gameIndex = _.findIndex(gameDataArray, function(chr) {
            return ((chr.teamCourt == 'home') && (chr.eventId == item + '-h'));
            });

            gameDataArray[gameIndex].spreadOpen = spreadOpen;
            gameDataArray[gameIndex].spreadClose = spreadClose;
            gameDataArray[gameIndex].totalOpen = totalOpen;
            gameDataArray[gameIndex].totalClose = totalClose;

            function atsGrade (arr, i) {
              if ((arr[i].teamScore + arr[i].spreadClose) > arr[i].opponentScore) {
                arr[i].atsGrade = 'W';
              } else if ((arr[i].teamScore + arr[i].spreadClose) < arr[i].opponentScore) {
                  arr[i].atsGrade = 'L';
              } else {
                  arr[i].atsGrade = 'P';
              }
            }

            function suGrade (arr, i) {
              if (arr[i].teamScore > arr[i].opponentScore) {
                arr[i].suGrade = 'W';
              } else {
                  arr[i].suGrade = 'L';
              }
            }

            function totalGrade (arr, i) {
              if ((arr[i].teamScore + arr[i].opponentScore) > totalClose) {
                arr[i].totalGrade = 'O';
              } else if ((arr[i].teamScore + arr[i].opponentScore) < totalClose) {
                arr[i].totalGrade = 'U';
              } else {
                arr[i].totalGrade = 'P';
              }
            }

            function spreadMove (arr, i) {
              if (arr[i].spreadClose < arr[i].spreadOpen) {
                arr[i].spreadMove = 'FOR';
              } else if (arr[i].spreadClose > arr[i].spreadOpen) {
                arr[i].spreadMove = 'AGAINST';
              } else {
                arr[i].spreadMove = 'NONE';
              }
            }

            function totalMove (arr, i) {
              if (arr[i].totalClose < arr[i].totalOpen) {
                arr[i].totalMove = 'DOWN';
              } else if (arr[i].totalClose > arr[i].totalOpen) {
                arr[i].totalMove = 'UP';
              } else {
                arr[i].totalMove = 'NONE';
              }
            }

            atsGrade(gameDataArray, gameIndex);
            suGrade(gameDataArray, gameIndex);
            totalGrade(gameDataArray, gameIndex);
            spreadMove(gameDataArray, gameIndex);
            totalMove(gameDataArray, gameIndex);

            Game.create(gameDataArray[gameIndex]); //writing to db

            gameIndex = _.findIndex(gameDataArray, function(chr) {
              return chr.teamCourt == 'road' && chr.eventId == item + '-r';
            });

            gameDataArray[gameIndex].spreadOpen = -spreadOpen;
            gameDataArray[gameIndex].spreadClose = -spreadClose;
            gameDataArray[gameIndex].totalOpen = totalOpen;
            gameDataArray[gameIndex].totalClose = totalClose;

            atsGrade(gameDataArray, gameIndex);
            suGrade(gameDataArray, gameIndex);
            totalGrade(gameDataArray, gameIndex);
            spreadMove(gameDataArray, gameIndex);
            totalMove(gameDataArray, gameIndex);

            Game.create(gameDataArray[gameIndex]); //writing to db
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
            dbWrite();
          } else {
            dbWrite();
          }
        }

        numberTest();

        asyncCallback(); //callback inside request since that's the async part

      });
    });

    callback(null);
  };