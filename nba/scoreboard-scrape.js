'use strict';

var async = require('async');
var request = require('request');
var cheerio = require('cheerio');

module.exports = function scoreboardScrape(dateArray, gameType, season, callback) {


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

          var jsonRoad = {};

          var jsonHome = {};

          var data = $(this);

          jsonRoad.date = data.attr('data-game-date').split(' ')[0];
          jsonHome.date = data.attr('data-game-date').split(' ')[0];
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

};