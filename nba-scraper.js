'use strict';

var request = require('request');
var cheerio = require('cheerio');
var Game = require('./models/Game');
var Sql = require('sequelize');
var sql = new Sql('wagermetrics_dev', 'wagermetrics_dev',
  'prince', {
    dialect: 'postgres'
  });
var async = require('async');
var _ = require('lodash/array');

module.exports = function(req, res) {

  function scrapeLoop() {

    async.waterfall([

        function dateLoop(callback) {

          var begin = '2013,10,29';
          var end = '2014,2,13';
          var gameType = 'reg';
          var season = '2013-14';

          var dateArray = [];

          for (var d = new Date(begin); d <= new Date(end); d.setDate(d.getDate() + 1)) {
            dateArray.push(new Date(d));
          }

          callback(null, dateArray, gameType, season);

        },

        function scoreboardScrape(dateArray, gameType, season, callback) {

          async.eachSeries(dateArray, function scoreboardRequest(item, asyncCallback) {

            var gameDataArray = [];

            var eventIdArray = [];

            var urlDate = item.getFullYear().toString() + '-' +
              (item.getMonth() + 1).toString() + '-' + item.getDate().toString();

            var scoreboardUrl = 'http://www.covers.com/Sports/NBA/Matchups?selectedDate=' + urlDate;

            request(scoreboardUrl, function(err, response, html) {
              if (err) {
                console.log(err);
              }

              var $ = cheerio.load(html);

              $('.cmg_matchup_game_box').each(function() {
                eventIdArray.push($(this).attr('data-event-id'));
              });

              eventIdArray.forEach(function(element, index, array) {

                $('div[data-event-id=' + element + ']').filter(function() {

                  var data = $(this);

                  var jsonRoad = {};

                  var jsonHome = {};

                  jsonRoad.date = urlDate;
                  jsonHome.date = urlDate;
                  jsonRoad.gameType = gameType;
                  jsonHome.gameType = gameType;
                  jsonRoad.season = season;
                  jsonHome.season = season;
                  jsonRoad.teamCourt = 'road';
                  jsonHome.teamCourt = 'home';

                  var team = data.children().children('.cmg_team_name').first().contents().filter(function() {
                    return this.nodeType == 3;
                  }).text().trim();

                  jsonRoad.team = team;

                  var opponent = data.children().children('.cmg_team_name').last().contents().filter(function() {
                    return this.nodeType == 3;
                  }).text().trim();

                  jsonRoad.opponent = opponent;

                  var teamScore = parseInt(data.children().children().children('.cmg_matchup_list_score_away').text());

                  jsonRoad.teamScore = teamScore;

                  var opponentScore = parseInt(data.children().children().children('.cmg_matchup_list_score_home').text());

                  jsonRoad.opponentScore = opponentScore;

                  jsonHome.team = opponent;

                  jsonHome.opponent = team;

                  jsonHome.teamScore = opponentScore;

                  jsonHome.opponentScore = teamScore;

                  jsonRoad.eventId = element + '-r';

                  jsonHome.eventId = element + '-h';

                  gameDataArray.push(jsonRoad, jsonHome);

                });

              });

              asyncCallback();

              callback(null, eventIdArray, gameDataArray);

            });

          });

        },

        function lineHistoryScrape(eventIdArray, gameDataArray, callback) {

          async.eachSeries(eventIdArray, function lineHistoryRequests(item, asyncCallback) { //item here refers to eventIdArray

            var lineHistoryUrl = 'http://www.covers.com/odds/linehistory.aspx?eventId=' + item + '&sport=NBA';

            request(lineHistoryUrl, function(err, response, html) {
              if (err) {
                console.log(err);
              }

              var $$ = cheerio.load(html);

              var spreadOpenSelector = $$('a[href*="269"]').parent().parent().next().children().eq(1); //269 is the ID for Bookmaker

              var totalOpenSelector = $$('a[href*="269"]').parent().parent().next().children().last();

              var spreadCloseSelector = $$('a[href*="761"]').parent().parent().prev().children().eq(1); //761 is the ID of the book following BookMaker

              var totalCloseSelector = $$('a[href*="761"]').parent().parent().prev().children().last();

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

              function numberTestAndWrite() {
                if (isNaN(spreadOpen) === true ||
                    isNaN(spreadClose) === true ||
                    isNaN(totalOpen) === true ||
                    isNaN(totalClose) === true) {
                  console.log('initially NaN, rerunning...EVENTID = ' + item);
                  lineHistoryRequests(item, callback);
                } else {
                  var gameIndex = _.findIndex(gameDataArray, function(chr) {
                    return ((chr.teamCourt == 'home') && (chr.eventId == item + '-h'));
                  });

                  gameDataArray[gameIndex].spreadOpen = spreadOpen;
                  gameDataArray[gameIndex].spreadClose = spreadClose;
                  gameDataArray[gameIndex].totalOpen = totalOpen;
                  gameDataArray[gameIndex].totalClose = totalClose;

                  // console.log(gameDataArray[gameIndex]);

                  Game.create(gameDataArray[gameIndex]); //writing to db

                  gameIndex = _.findIndex(gameDataArray, function(chr) {
                    return chr.teamCourt == 'road' && chr.eventId == item + '-r';
                  });

                  gameDataArray[gameIndex].spreadOpen = -spreadOpen;
                  gameDataArray[gameIndex].spreadClose = -spreadClose;
                  gameDataArray[gameIndex].totalOpen = totalOpen;
                  gameDataArray[gameIndex].totalClose = totalClose;

                  // console.log(gameDataArray[gameIndex]);

                  Game.create(gameDataArray[gameIndex]);
                }
              }

              numberTestAndWrite();

              asyncCallback(); //callback inside request since that's the async part

            });
          });

          callback(null);
        }
      ],

      function(err, result) {

      });

    res.send('See console');

  }

  scrapeLoop();

};