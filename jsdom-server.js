var jsdom = require('node-jsdom');
var fs = require('fs');

jsdom.jsdom({
  url: "http://www.covers.com/sports/NBA/matchups?selectedDate=2015-2-20",
  done: function (errors, window) {

  jsdom.jQueryify(window, "http://code.jquery.com/jquery-2.1.1.js", function () {

    var $ = window.$;

    var size = $('.cmg_total_odds')[0].size;

    console.log(size);

    console.log('Data successfully scraped');
  })
  }
});