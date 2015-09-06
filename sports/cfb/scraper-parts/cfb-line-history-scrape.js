'use strict';

var async = require('async');
var _ = require('lodash/array');
var request = require('request');
var cheerio = require('cheerio');
var Game = require('../../../models/CfbGame');
var atsGrade = require('../../../scraper-functions/atsGrade');
var suGrade = require('../../../scraper-functions/suGrade');
var totalGrade = require('../../../scraper-functions/totalGrade');
var spreadMove = require('../../../scraper-functions/spreadMove');
var totalMove = require('../../../scraper-functions/totalMove');

module.exports =

  function lineHistoryScrape(eventIdArray, gameDataArray, callback) {

    async.eachSeries(eventIdArray, function lineHistoryRequests(item, asyncCallback) { //item here refers to eventIdArray

      var lineHistoryUrl = 'http://www.covers.com/odds/linehistory.aspx?eventId=' + item + '&sport=NCF'; //actual url intentionally omitted

      request(lineHistoryUrl, function(err, response, html) {
        if (err) {
          console.log(err);
        }

        var $ = cheerio.load(html);

        var spreadOpenSelector,
          spreadCloseSelector,
          totalOpenSelector,
          totalCloseSelector,
          spreadOpen,
          spreadClose,
          totalOpen,
          totalClose;

        function spreadOpenSelectorTest() {
          if (spreadOpenSelector.text() === 'OFF' || spreadOpenSelector.text().split('/')[0].length > 5) {
            console.log("OFF TEST FAIL - EVENTID = " + item);
            spreadOpenSelector = spreadOpenSelector.parent().next().children().eq(1);
            spreadOpenSelectorTest();
          } else {
            spreadOpen = parseFloat(spreadOpenSelector.text().split('/')[0]);
          }
        }

        function totalOpenSelectorTest() {
          if (totalOpenSelector.text() === 'OFF' || totalOpenSelector.text().split('-')[0].length > 5) {
            console.log("OFF TEST FAIL - EVENTID = " + item);
            totalOpenSelector = totalOpenSelector.parent().next().children().last();
            totalOpenSelectorTest();
          } else {
            totalOpen = parseFloat(totalOpenSelector.text().split('-')[0]);
          }
        }

        spreadOpenSelector = $('a[href*="38"]').parent().parent().next().children().eq(1); //269 is an important ID
        spreadOpenSelectorTest();
        spreadCloseSelector = $('a[href*="38"]').parent().parent().nextUntil('tr[bgcolor=#ECECE4]').children().last().prev();
        spreadClose = parseFloat(spreadCloseSelector.text().split('/')[0]);

        totalOpenSelector = $('a[href*="38"]').parent().parent().next().children().last();
        totalOpenSelectorTest();
        totalCloseSelector = $('a[href*="38"]').parent().parent().nextUntil('tr[bgcolor=#ECECE4]').children().last();
        totalClose = parseFloat(totalCloseSelector.text().split('-')[0]);


        var gameIndex;

        function findMatch() {

          gameIndex = _.findIndex(gameDataArray, function(chr) {
            return chr.eventId == item + '-h';
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

            delete gameDataArray[gameIndex].initHomeSpreadClose;
            delete gameDataArray[gameIndex].initTotalClose;

            Game.create(gameDataArray[gameIndex]); //writing to db
          }

          assignWrite();

          gameIndex = _.findIndex(gameDataArray, function(chr) {
            return chr.eventId == item + '-r';
          });

          gameDataArray[gameIndex].spreadOpen = -spreadOpen;
          gameDataArray[gameIndex].spreadClose = -spreadClose;
          gameDataArray[gameIndex].totalOpen = totalOpen;
          gameDataArray[gameIndex].totalClose = totalClose;

          assignWrite();

        }

        function numberTest() {

          gameIndex = _.findIndex(gameDataArray, function(chr) {
            return chr.eventId == item + '-h';
          }); //only need to find home, will be same for home and road, will be written later

          if (isNaN(spreadOpen) === true &&
            isNaN(spreadClose) === true &&
            isNaN(totalOpen) === true &&
            isNaN(totalClose) === true && gameDataArray[gameIndex].initHomeSpreadClose !== '') {
            console.log('initially NaN, rerunning...EVENTID = ' + item);
            console.log(spreadOpen, spreadClose, totalOpen, totalClose);
            lineHistoryRequests(item, callback);
          } else if (isNaN(spreadOpen) === true &&
            isNaN(spreadClose) === true &&
            isNaN(totalOpen) === true &&
            isNaN(totalClose) === true && gameDataArray[gameIndex].initHomeSpreadClose === '') {
            spreadOpen = 99;
            spreadClose = 99;
            totalOpen = 99;
            totalClose = 99;
            findMatch();
          } else if ((isNaN(spreadOpen) === true ||
              isNaN(spreadClose) === true ||
              isNaN(totalOpen) === true ||
              isNaN(totalClose) === true)) {

            if (isNaN(spreadOpen) === true ||
              isNaN(spreadClose) === true) {
              if (gameDataArray[gameIndex].initHomeSpreadClose !== '') {
                spreadOpen = gameDataArray[gameIndex].initHomeSpreadClose;
                spreadClose = gameDataArray[gameIndex].initHomeSpreadClose;
              } else {
                spreadOpen = 99;
                spreadClose = 99;
              }
            }
            if (isNaN(totalOpen) === true ||
              isNaN(totalClose) === true) {
              if (gameDataArray[gameIndex].initTotalClose !== '') {
                totalOpen = gameDataArray[gameIndex].initTotalClose;
                totalClose = gameDataArray[gameIndex].initTotalClose;
              } else {
                totalOpen = 99;
                totalClose = 99;
              }
            }

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