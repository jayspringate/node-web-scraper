//partially sourced from scotch.io tutorial

var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.get('/scrape', function(req, res){

  var date;  //to be used in url below

  scoreboardUrl = 'http://www.covers.com/Sports/NBA/Matchups?selectedDate=2015-02-22';

  request(scoreboardUrl, function(err, response, html) {
    if(err) {
      console.log(err);
    }

    var $ = cheerio.load(html);

    var gameDataArray = [];

    var jsonRoad = {};

    var jsonHome = {};

    var eventIdArray = [];

    $('.cmg_matchup_game_box').each(function() {
      eventIdArray.push($(this).attr('data-event-id'));
    });

    fs.writeFile('data/console.js', eventIdArray, function(err){

    // console.log('Data successfully scraped');
  });

    var homeTeam, roadTeam;  //use these to test line history page for match

    //BEGIN SCRAPE WITH TEAM = ROAD TEAM

    //scrape date

    eventIdArray.forEach(function(element, index, array) {

    $('div[data-event-id=' + element + ']').filter(function() {

      var data = $(this);

      var date = data.data('game-date');

      jsonRoad.date = date;

      var team = data.children().children('.cmg_team_name').first().text();

      jsonRoad.team = team;
      jsonRoad.court = 'road';

      var opponent = data.children().children('.cmg_team_name').last().text();

      jsonRoad.opponent = opponent;

      var teamScore = parseInt(data.children().children().children('.cmg_matchup_list_score_away').text());

      jsonRoad.teamScore = teamScore;

      var opponentScore = parseInt(data.children().children().children('.cmg_matchup_list_score_home').text());

      jsonRoad.opponentScore = opponentScore;

      fs.appendFile('data/gameData.json', JSON.stringify(jsonRoad, null, 4), function(err){


      })

    })

  })

eventIdArray.forEach(function(element, index, array) {

    $('div[data-event-id=' + element + ']').filter(function() {

      var data = $(this);

      var date = data.data('game-date');

      jsonHome.date = date;

      var team = data.children().children('.cmg_team_name').last().text();

      jsonHome.team = team;
      jsonHome.court = 'home';

      var opponent = data.children().children('.cmg_team_name').first().text();

      jsonHome.opponent = opponent;

      var teamScore = parseInt(data.children().children().children('.cmg_matchup_list_score_home').text());

      jsonHome.teamScore = teamScore;

      var opponentScore = parseInt(data.children().children().children('.cmg_matchup_list_score_away').text());

      jsonHome.opponentScore = opponentScore;

      fs.appendFile('data/gameData.json', JSON.stringify(jsonHome, null, 4), function(err){


      })

    })

  })

    //won't be writing file, will be saving to postgresDB



  res.send('Check your console!');

  })

  console.log('Data successfully scraped');
})

app.listen('3000')

console.log('server listening on port 3000');

module.exports = app;