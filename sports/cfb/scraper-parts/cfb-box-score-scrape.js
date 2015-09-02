var async = require('async');
var request = require('request');
var phantom = require('phantom');

module.exports = function boxScoreScrape(eventIdArray, gameDataArray, initHomeSpreadClose, initTotalClose, callback) {

  async.eachSeries(eventIdArray, function boxScoreRequest(item, asyncCallback) {

    //item here refers to eventIdArray

    var boxScoreUrl = 'http://www.covers.com/pageLoader/pageLoader.aspx?page=/data/ncf/results/2011-2012/boxscore' + item + '.html'; //actual url intentionally omitted

    phantom.create(function(ph) {
      return ph.createPage(function(page) {
        return page.open(boxScoreUrl, function(status) {
          console.log("opened site? ", status);

          page.injectJs('https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js', function() {
            //jQuery Loaded.
            //Wait for a bit for AJAX content to load on the page. Here, we are waiting 5 seconds.
            setTimeout(function() {
              return page.evaluate(function() {

                var selector = $('.row').last();

                var arr = [];

                var split = selector.text().split(' - ');

                var dayOfWeek = split[1].split(',')[0];
                var stadium = split[2].split(' Attendance')[0].trim().replace(/\'/g, "");
                var attendance = parseInt(split[3].trim());

                arr.push(dayOfWeek);
                arr.push(stadium);
                arr.push(attendance);

                var gameIndex = _.findIndex(gameDataArray, function(chr) {
                  return (chr.eventId == item + '-h');
                });

                gameDataArray[gameIndex].stadium = stadium;
                gameDataArray[gameIndex].attendance = attendance;
                gameDataArray[gameIndex].dayOfWeek = dayOfWeek;

                gameIndex = _.findIndex(gameDataArray, function(chr) {
                  return (chr.eventId == item + '-r');
                });

                gameDataArray[gameIndex].stadium = stadium;
                gameDataArray[gameIndex].attendance = attendance;
                gameDataArray[gameIndex].dayOfWeek = dayOfWeek;

                asyncCallback();

                callback(null, eventIdArray, gameDataArray, initHomeSpreadClose, initTotalClose);

                return arr;

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
};