'use strict';

var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var sequelize = require('sequelize');
var async = require('async');
var _ = require('lodash/array');

//figure out a way to make this not global

module.exports = function (req, res) {

  var gameDataArray = [];

  var urlDate = '2015-02-22';  //to be used in url below

  var scoreboardUrl = 'http://www.covers.com/Sports/NBA/Matchups?selectedDate=' + urlDate;

  request(scoreboardUrl, scoreboardCallback); //function call

  res.send('See console');

  //begin function definitions

  function scoreboardCallback (err, response, html) {
    if(err) {
      console.log(err);
    }

    var $ = cheerio.load(html);

    var eventIdArray = [];

    $('.cmg_matchup_game_box').each(function() {
      eventIdArray.push($(this).attr('data-event-id'));
    });

    fs.writeFile('data/event-id-array.js', eventIdArray, function (err){
    });

    fs.unlink('data/gameDataArray.js', function (err) {

    });

    eventIdArray.forEach(function (element, index, array) {

      $('div[data-event-id=' + element + ']').filter(function() {

      var data = $(this);

      var jsonRoad = {};

      var jsonHome = {};

      jsonRoad.date = jsonHome.date = urlDate;

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

      jsonRoad.eventId = jsonHome.eventId = parseInt(element);

      gameDataArray.push(jsonRoad, jsonHome);

    })

  })

  function lineHistoryCallback(arr) {

    function logArray(item, callback) {//item here refers to eventIdArray

      var lineHistoryUrl = 'http://www.covers.com/odds/linehistory.aspx?eventId=' + item + '&sport=NBA';

      request(lineHistoryUrl, function (err, response, html) {
      if(err) {
        console.log(err);
      }

      var $$ = cheerio.load(html);

      var selectorArray = [];
      var resultArray = [];

      var spreadOpenSelector = $$('a[href*="269"]').parent().parent().next().children().eq(1); //269 is the ID for Bookmaker

      var totalOpenSelector = $$('a[href*="269"]').parent().parent().next().children().last();

      var spreadCloseSelector = $$('a[href*="761"]').parent().parent().prev().children().eq(1); //761 is the ID of the book  following BookMaker

      var totalCloseSelector = $$('a[href*="761"]').parent().parent().prev().children().last();

      selectorArray.push(spreadOpenSelector, spreadCloseSelector, totalOpenSelector, totalCloseSelector);

      function totalOpenSelectorTest () {
        if (totalOpenSelector.text() === 'OFF') {
          totalOpenSelector = totalOpenSelector.parent().next().children().last();
            totalOpenSelectorTest();
          }
      };

      function spreadOpenSelectorTest () {
        if (spreadOpenSelector.text() === 'OFF') {
          spreadOpenSelector = spreadOpenSelector.parent().next().children.eq(2);
            spreadOpenSelectorTest();
          }
      };

      totalOpenSelectorTest(); //function call
      spreadOpenSelectorTest(); //function call

      var spreadOpen = parseInt(spreadOpenSelector.text().split('/')[0]);
      var totalOpen = parseInt(totalOpenSelector.text().split('-')[0]);
      var spreadClose = parseInt(spreadCloseSelector.text().split('/')[0]);
      var totalClose = parseInt(totalCloseSelector.text().split('-')[0]);

      resultArray.push(item, spreadOpen, spreadClose, totalOpen, totalClose);

     console.log(resultArray);

    var gameIndex = _.findIndex(gameDataArray, function(chr) {
      return ((chr.teamCourt == 'home') && (chr.eventId == item));
    });

    gameDataArray[gameIndex].spreadOpen = spreadOpen;
    gameDataArray[gameIndex].spreadClose = spreadClose;
    gameDataArray[gameIndex].totalOpen = totalOpen;
    gameDataArray[gameIndex].totalClose = totalClose;

    console.log(gameDataArray[gameIndex]);

    gameIndex =_.findIndex(gameDataArray, function(chr) {
      return chr.teamCourt == 'road' && chr.eventId == item;
    });

    gameDataArray[gameIndex].spreadOpen = -spreadOpen;
    gameDataArray[gameIndex].spreadClose = -spreadClose;
    gameDataArray[gameIndex].totalOpen = totalOpen;
    gameDataArray[gameIndex].totalClose = totalClose;

    console.log(gameDataArray[gameIndex]);

    callback(); //callback inside request since that's the async part

  })

  }

    async.eachSeries(arr, logArray); //function call

    console.log('Data successfully scraped');
  }

  lineHistoryCallback(eventIdArray); //function call

  }
}














