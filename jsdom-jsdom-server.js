var jsdom = require('node-jsdom').jsdom
  , doc = jsdom({
                      url: 'http://www.covers.com/sports/NBA/matchups?selectedDate=2015-2-20',
                      done: function(errors, window) {
                        console.log('hi');
                        var $ = window.$;
                        var size = $('.cmg_side_odds').attr('size');
                        console.log(size);
                      }})
  , window = doc.defaultView;