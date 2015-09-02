var async = require('async');
var request = require('request');
var cheerio = require('cheerio');
var _ = require('lodash/array');
var phantom = require('phantom');

module.exports =

  function neutralSitesScrape(weekArray, eventIdArray, gameDataArray, initHomeSpreadClose, initTotalClose, callback) {

    async.eachSeries(weekArray, function boxScoreRequests(item, asyncCallback) { //item here refers to eventIdArray

      var boxScoreUrl = 'http://espn.go.com/college-football/scoreboard/_/year/2011/seasontype/2/week/' + item; //actual url intentionally omitted

      phantom.create(function(ph) {
        return ph.createPage(function(page) {
          return page.open("http://tilomitra.com/repository/screenscrape/ajax.html", function(status) {
            console.log("opened site? ", status);

            page.injectJs('https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js', function() {
              //jQuery Loaded.
              //Wait for a bit for AJAX content to load on the page. Here, we are waiting 5 seconds.
              setTimeout(function() {
                return page.evaluate(function() {

                  // var teamName = $('.sb-notes').text();
                  // var opponentName = $('.sb-notes').text();

                  // .parent().children().children().children().children('#teams').children('.away').children('.away').children('.sb-meta').children('h2').children('a')

                  // .parent().children().children().children().children('#teams').children('.home').children('.home').children('.sb-meta').children('h2').children('a')

                  // function totalOpenSelectorTest() {
                  //   if (totalOpenSelector.text() === 'OFF' || totalOpenSelector.text().split('-')[0].length > 5) {
                  //     console.log("OFF TEST FAIL - EVENTID = " + item);
                  //     totalOpenSelector = totalOpenSelector.parent().next().children().last();
                  //     totalOpenSelectorTest();
                  //   }
                  // }

                  // function spreadOpenSelectorTest() {
                  //   if (spreadOpenSelector.text() === 'OFF' || spreadOpenSelector.text().split('/')[0].length > 5) {
                  //     console.log("OFF TEST FAIL - EVENTID = " + item);
                  //     spreadOpenSelector = spreadOpenSelector.parent().next().children().eq(1);
                  //     spreadOpenSelectorTest();
                  //   }
                  // }

                  // totalOpenSelectorTest();
                  // spreadOpenSelectorTest();
                  console.log('ran');
                  console.log(teamName);

                  //         var stadium = stadiumDayAttendanceSelector.text();
                  // // .split(' - ')[2].split('  ')[0]
                  //         var dayOfWeek = stadiumDayAttendanceSelector.text();
                  // // .split(' - ')[1].split(',')[0]
                  //         var attendance = parseInt(stadiumDayAttendanceSelector.text());
                  //           // .split(' - ')[3].trim())

                  function findMatch() {
                    var gameIndex = _.findIndex(gameDataArray, function(chr) {
                      return (chr.teamName == teamName || chr.opponentName == teamName) &&
                        (chr.teamName == opponentName || chr.teamName == opponentName);
                    });

                    // gameDataArray[gameIndex].stadium = stadium;
                    // gameDataArray[gameIndex].dayOfWeek = dayOfWeek;
                    // gameDataArray[gameIndex].attendance = attendance;

                    // gameIndex = _.findIndex(gameDataArray, function(chr) {
                    //   return chr.site == 'road' && chr.eventId == item + '-r';
                    // });

                    // gameDataArray[gameIndex].stadium = stadium;
                    // gameDataArray[gameIndex].dayOfWeek = dayOfWeek;
                    // gameDataArray[gameIndex].attendance = attendance;
                  }

                  findMatch();

                  asyncCallback(); //callback inside request since that's the async part
                  //Get what you want from the page using jQuery. A good way is to populate an object with all the jQuery commands that you need and then return the object.
                  var h2Arr = [],
                    pArr = [];
                  $('h2').each(function() {
                    h2Arr.push($(this).html());
                  });
                  $('p').each(function() {
                    pArr.push($(this).html());
                  });

                  return {
                    h2: h2Arr,
                    p: pArr
                  };
                }, function(result) {
                  console.log(result);
                  ph.exit();
                });
              }, 5000);

            });
          });
        });
      });
    });

    callback(null, eventIdArray, gameDataArray, initHomeSpreadClose, initTotalClose);
  };