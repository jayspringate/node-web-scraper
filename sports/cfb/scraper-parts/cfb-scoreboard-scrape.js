'use strict';

var async = require('async');
var request = require('request');
var cheerio = require('cheerio');

module.exports = function scoreboardScrape(dateArray, site, gameType, season, callback) {

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

      var week = $('.cmg_active_navigation_item').text().trim().split(' ')[1];

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
          jsonRoad.week = week;
          jsonHome.week = week;
          jsonRoad.gameType = gameType;
          jsonHome.gameType = gameType;
          jsonRoad.season = season;
          jsonHome.season = season;

          if (site === 'ignore') {
            jsonRoad.teamSite = 'road';
            jsonHome.teamSite = 'home';
          } else {
            jsonRoad.teamSite = site;
            jsonHome.teamSite = site;
          }

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

          var teamNameWithRank, opponentNameWithRank;

          if (data.children().children('.cmg_matchup_header_team_names').text().split(' at ')[1] === undefined) {
            teamNameWithRank = data.children().children('.cmg_matchup_header_team_names').text().split(' vs ')[0].trim();
            opponentNameWithRank = data.children().children('.cmg_matchup_header_team_names').text().split(' vs ')[1].trim();
            jsonRoad.teamSite = 'neutral';
            jsonHome.teamSite = 'neutral';
          } else {
            teamNameWithRank = data.children().children('.cmg_matchup_header_team_names').text().split(' at ')[0].trim();
            opponentNameWithRank = data.children().children('.cmg_matchup_header_team_names').text().split(' at ')[1].trim();
          }

          var teamName, teamRanking;

          if (teamNameWithRank[0] === '(') {
            teamName = teamNameWithRank.split(')')[1].trim();
            teamRanking = parseInt(teamNameWithRank.split(')')[0].split('(')[1]);
          } else {
            teamName = teamNameWithRank;
            teamRanking = 0;
          }

          var opponentName, opponentRanking;

          if (opponentNameWithRank[0] === '(') {
            opponentName = opponentNameWithRank.split(')')[1].trim();
            opponentRanking = parseInt(opponentNameWithRank.split(')')[0].split('(')[1]);
          } else {
            opponentName = opponentNameWithRank;
            opponentRanking = 0;
          }

          jsonRoad.teamName = teamName;
          jsonRoad.opponentName = opponentName;
          jsonHome.teamName = opponentName;
          jsonHome.opponentName = teamName;
          jsonRoad.teamRanking = teamRanking;
          jsonRoad.opponentRanking = opponentRanking;
          jsonHome.teamRanking = opponentRanking;
          jsonHome.opponentRanking = teamRanking;

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

          var teamDivision, opponentDivision;

          if (teamConference === 'American Athletic' ||
              teamConference === 'Atlantic Coast' ||
              teamConference === 'Big 12' ||
              teamConference === 'Big Ten' ||
              teamConference === 'Conference USA' ||
              teamConference === 'Independents I-A' ||
              teamConference === 'Mid-American' ||
              teamConference === 'Mountain West' ||
              teamConference === 'Pacific-12' ||
              teamConference === 'Southeastern' ||
              teamConference === 'Sun Belt') {
            teamDivision = 'FBS';
          } else {
            teamDivision = 'FCS';
          }

          if (opponentConference === 'American Athletic' ||
              opponentConference === 'Atlantic Coast' ||
              opponentConference === 'Big 12' ||
              opponentConference === 'Big Ten' ||
              opponentConference === 'Conference USA' ||
              opponentConference === 'Independents I-A' ||
              opponentConference === 'Mid-American' ||
              opponentConference === 'Mountain West' ||
              opponentConference === 'Pacific-12' ||
              opponentConference === 'Southeastern' ||
              opponentConference === 'Sun Belt') {
            opponentDivision = 'FBS';
          } else {
            opponentDivision = 'FCS';
          }

          jsonRoad.teamDivision = teamDivision;
          jsonRoad.opponentDivision = opponentDivision;
          jsonHome.teamDivision = opponentDivision;
          jsonHome.opponentDivision = teamDivision;

          if (data.attr('data-game-odd') === '') {
            jsonHome.initHomeSpreadClose = '';
            jsonRoad.initHomeSpreadClose = '';
          } else {
            jsonHome.initHomeSpreadClose = parseFloat(data.attr('data-game-odd'));
            jsonRoad.initHomeSpreadClose = parseFloat(data.attr('data-game-odd'));
          }

          if (data.attr('data-game-total') === '') {
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