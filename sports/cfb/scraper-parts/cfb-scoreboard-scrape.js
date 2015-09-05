'use strict';

var async = require('async');
var request = require('request');
var cheerio = require('cheerio');

module.exports = function scoreboardScrape(dateArray, gameType, season, callback) {

  async.eachSeries(dateArray, function scoreboardRequest(item, asyncCallback) {

    var gameDataArray = [];

    var eventIdArray = [];

    var primaryKeyArray = [];

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
          jsonRoad.teamSite = 'road';
          jsonHome.teamSite = 'home';

          var teamAbbrev = data.children().children('.cmg_team_name').first().contents().filter(function() {
            return this.nodeType == 3;
          }).text().trim();


          var opponentAbbrev = data.children().children('.cmg_team_name').last().contents().filter(function() {
            return this.nodeType == 3;
          }).text().trim();

          jsonRoad.teamAbbrev = teamAbbrev;
          jsonRoad.opponentAbbrev = opponentAbbrev;
          jsonHome.teamAbbrev = opponentAbbrev;
          jsonHome.opponentAbbrev = teamAbbrev;

          var teamName = data.children().children('.cmg_matchup_header_team_names').text().split(' at ')[0].trim();

          var opponentName = data.children().children('.cmg_matchup_header_team_names').text().split(' at ')[1].trim();

          jsonRoad.teamName = teamName;
          jsonRoad.opponentName = opponentName;
          jsonHome.teamName = opponentName;
          jsonHome.opponentName = teamName;

          var teamScore = parseInt(data.attr('data-away-score'));
          var opponentScore = parseInt(data.attr('data-home-score'));

          jsonRoad.teamScore = teamScore;
          jsonRoad.opponentScore = opponentScore;
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
          jsonHome.gameConference = gameConference;

          if(data.attr('data-game-odd') === '') {
            jsonHome.initHomeSpreadClose = '';
            jsonRoad.initHomeSpreadClose = '';
          } else {
            jsonHome.initHomeSpreadClose = parseFloat(data.attr('data-game-odd'));
            jsonRoad.initHomeSpreadClose = parseFloat(data.attr('data-game-odd'));
          }

          if(data.attr('data-game-total') === '') {
            jsonRoad.initTotalClose = '';
            jsonHome.initTotalClose = '';
          } else {
            jsonRoad.initTotalClose = parseFloat(data.attr('data-game-total'));
            jsonHome.initTotalClose = parseFloat(data.attr('data-game-total'));
          }

          jsonRoad.eventId = element + '-r';
          jsonHome.eventId = element + '-h';

          gameDataArray.push(jsonRoad, jsonHome);

        });
      });

      asyncCallback();

      callback(null, eventIdArray, gameDataArray);

    });
  });
};