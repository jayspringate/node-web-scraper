var request = require('request');
var cheerio = require('cheerio');

module.exports = function(req, res) {

  var boxScoreUrl = 'http://www.covers.com/pageLoader/pageLoader.aspx?page=/data/ncf/results/2012-2013/boxscore29674.html'; //actual url intentionally omitted

  request(boxScoreUrl, function(err, response, html) {
    if (err) {
      console.log(err);
    }

    var $ = cheerio.load(html);

    var selector = $('.row').last();

    var obj = {};

    var arr = [];

    // var split = selector[0].text;

    console.log(selector);

    // .split(' - ');

    // var dayOfWeek = split[1].split(',')[0];
    // var stadium = split[2].split(' Attendance')[0].trim().replace(/\'/g, "");
    // var attendance = parseInt(split[3].trim());

    // arr.push(dayOfWeek);
    // arr.push(stadium);
    // arr.push(attendance);

    // obj.dayOfWeek = dayOfWeek;
    // obj.stadium = stadium;
    // obj.attendance = attendance;

    console.log(arr);
  });

  res.send('see console');

};