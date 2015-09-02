'use strict';

var async = require('async');
var request = require('request');
var cheerio = require('cheerio');

module.exports = function scoreboardScrape(dateArray, weekArray, gameType, season, callback) {

  async.eachSeries(dateArray, function scoreboardRequest(item, asyncCallback) {

    var gameDataArray = [];

    var eventIdArray = [];

    var initHomeSpreadClose,
        initTotalClose;

    var urlDate = item.getFullYear().toString() + '-' +
      (item.getMonth() + 1).toString() + '-' + item.getDate().toString();

    var scoreboardUrl = 'http://www.covers.com/Sports/NCAAF/Matchups?selectedDate=' + urlDate; //actual url intentionally omitted

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

          var jsonRoad = {};
          var jsonHome = {};

          var data = $(this);

          jsonRoad.date = data.attr('data-game-date').split(' ')[0];
          jsonHome.date = data.attr('data-game-date').split(' ')[0];
          jsonRoad.gameType = gameType;
          jsonHome.gameType = gameType;
          jsonRoad.season = season;
          jsonHome.season = season;
          jsonRoad.site = 'road';
          jsonHome.site = 'home';

          var team = $('.cmg_team_name').first().contents().filter(function() {
            return this.nodeType == 3;
          }).text().trim();

          jsonRoad.team = team;

          var opponent = $('.cmg_team_name').last().contents().filter(function() {
            return this.nodeType == 3;
          }).text().trim();

          jsonRoad.opponent = opponent;

          var homeDivision, roadDivision;

          if ($('.cmg_team_logo').eq(0).children().attr('childElementCount') === 0) {
            roadDivision = 'FCS';
          } else {
            roadDivision = 'FBS';
          }

          if ($('.cmg_team_logo').eq(1).children().attr('childElementCount') === 0) {
            homeDivision = 'FCS';
          } else {
            homeDivision = 'FBS';
          }

          jsonRoad.teamDivision = roadDivision;
          jsonRoad.opponentDivision = homeDivision;
          jsonHome.teamDivision = homeDivision;
          jsonHome.opponentDivision = roadDivision;

          var teamScore = parseInt(data.attr('data-away-score'));

          jsonRoad.teamScore = teamScore;

          var opponentScore = parseInt(data.attr('data-home-score'));

          jsonRoad.opponentScore = opponentScore;

          jsonHome.team = opponent;

          jsonHome.opponent = team;

          jsonHome.teamScore = opponentScore;

          jsonHome.opponentScore = teamScore;

          var teamConference = data.attr('data-away-conference');
          var opponentConference = data.attr('data-home-conference');
          var gameConference = data.attr('data-conference');

          jsonRoad.teamConference = teamConference;
          jsonRoad.opponentConference = opponentConference;
          jsonRoad.gameConference = gameConference;

          jsonHome.teamConference = opponentConference;
          jsonHome.opponentConference = teamConference;
          jsonRoad.gameConference = gameConference;

          if(data.attr('data-game-odd') === '') {
            initHomeSpreadClose = '';
          } else {
            initHomeSpreadClose = parseFloat(data.attr('data-game-odd'));
          }

          if(data.attr('data-game-total') === '') {
            initTotalClose = '';
          } else {
            initTotalClose = parseFloat(data.attr('data-game-total'));
          }

          console.log(initHomeSpreadClose, initTotalClose);

          jsonRoad.eventId = element + '-r';
          jsonHome.eventId = element + '-h';

          gameDataArray.push(jsonRoad, jsonHome);

        });
      });

      asyncCallback();

      callback(null, weekArray, eventIdArray, gameDataArray, initHomeSpreadClose, initTotalClose);

    });
  });
};