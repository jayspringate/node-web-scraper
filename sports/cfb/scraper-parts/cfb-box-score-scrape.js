var async = require('async');
var request = require('request');
var phantom = require('phantom');
var _ = require('lodash/array');

module.exports =

function boxScoreScrape(eventIdArray, gameDataArray, initHomeSpreadClose, initTotalClose, callback) {

  async.eachSeries(eventIdArray, function boxScoreRequest(item, asyncCallback) {

    //item here refers to eventIdArray

    var boxScoreUrl = 'http://www.covers.com/pageLoader/pageLoader.aspx?page=/data/ncf/results/2011-2012/boxscore' + item + '.html'; //actual url intentionally omitted

    var selector, split, dayOfWeek, stadium, attendance,
      roadDivision, homeDivision, roadSelector, homeSelector;
    var arr = [];

    phantom.create(function(ph) {
      return ph.createPage(function(page) {
        return page.open(boxScoreUrl, function(status) {
          console.log("opened site? ", status);

          page.injectJs('https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js', function() {
            //jQuery Loaded.
            //Wait for a bit for AJAX content to load on the page. Here, we are waiting 5 seconds.
            setTimeout(function() {
              return page.evaluate(function() {

                roadSelector = $('.box-logo').eq(0).children('img[src*="div2"]').length;
                homeSelector = $('.box-logo').eq(1).children('img[src*="div2"]').length;

                if (roadSelector === 1) {
                  roadDivision = 'FCS';
                } else {
                  roadDivision = 'FBS';
                }

                if (homeSelector === 1) {
                  homeDivision = 'FCS';
                } else {
                  homeDivision = 'FBS';
                }

                selector = $('.row').last();

                arr = [];

                split = selector.text().split(' - ');

                dayOfWeek = split[1].split(',')[0];
                stadium = split[2].split(' Attendance')[0].trim().replace(/\'/g, "");
                attendance = parseInt(split[3].trim());

                arr.push(dayOfWeek);
                arr.push(stadium);
                arr.push(attendance);
                arr.push(roadDivision);
                arr.push(homeDivision);

                return arr;

              }, function(result) {
                console.log(result);
                ph.exit();
                dayOfWeek = result[0];
                stadium = result[1];
                attendance = result[2];
                roadDivision = result[3];
                homeDivision = result[4];

                var gameIndex = _.findIndex(gameDataArray, function(chr) {
                  return (chr.eventId == item + '-r');
                });

                gameDataArray[gameIndex].stadium = stadium;
                gameDataArray[gameIndex].attendance = attendance;
                gameDataArray[gameIndex].dayOfWeek = dayOfWeek;
                gameDataArray[gameIndex].teamDivision = roadDivision;
                gameDataArray[gameIndex].opponentDivision = homeDivision;

                if (roadDivision === 'FCS' || homeDivision === 'FCS') {
                  gameDataArray[gameIndex].gameConference = 'vs FCS';
                }

                gameIndex = _.findIndex(gameDataArray, function(chr) {
                  return (chr.eventId == item + '-h');
                });

                gameDataArray[gameIndex].stadium = stadium;
                gameDataArray[gameIndex].attendance = attendance;
                gameDataArray[gameIndex].dayOfWeek = dayOfWeek;
                gameDataArray[gameIndex].teamDivision = homeDivision;
                gameDataArray[gameIndex].opponentDivision = roadDivision;

                if (roadDivision === 'FCS' || homeDivision === 'FCS') {
                  gameDataArray[gameIndex].gameConference = 'vs FCS';
                }
              });
            }, 5000);
          });
        });
      });
    });
  });
};