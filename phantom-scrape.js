var async = require('async');
var request = require('request');
var cheerio = require('cheerio');
var _ = require('lodash/array');
var phantom = require('phantom');

module.exports = function(req, res) {

  //item here refers to eventIdArray

  var boxScoreUrl = 'http://espn.go.com/college-football/scoreboard/_/year/2011/seasontype/2/week/' + item; //actual url intentionally omitted

  phantom.create(function(ph) {
    return ph.createPage(function(page) {
      return page.open('http://www.covers.com/pageLoader/pageLoader.aspx?page=/data/ncf/results/2011-2012/boxscore29674.html', function(status) {
        console.log("opened site? ", status);

        page.injectJs('https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js', function() {
          //jQuery Loaded.
          //Wait for a bit for AJAX content to load on the page. Here, we are waiting 5 seconds.
          setTimeout(function() {
            return page.evaluate(function() {

              var selector = $('.row').last();

              var obj = {};

              var arr = [];

              var split = selector.text().split(' - ');

              var dayOfWeek = split[1].split(',')[0];
              var stadium = split[2].split(' Attendance')[0].trim().replace(/\'/g,"");
              var attendance = parseInt(split[3].trim());

              arr.push(dayOfWeek);
              arr.push(stadium);
              arr.push(attendance);

              obj.dayOfWeek = dayOfWeek;
              obj.stadium = stadium;
              obj.attendance = attendance;

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
  res.end('see console');
};