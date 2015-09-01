'use strict';

var async = require('async');
var request = require('request');
var cheerio = require('cheerio');
var _ = require('lodash/array');

module.exports =

  function consensusScrape(eventIdArray, gameDataArray, initHomeSpreadClose, initTotalClose, callback) {

   async.eachSeries(eventIdArray, function consensusRequests(item, asyncCallback) { //item here refers to eventIdArray

      var consensusUrl = 'http://contests.covers.com/Handicapping/ConsensusPick/consensus-pick.aspx?sport=NCAAF&eventId=' + item; //actual url intentionally omitted

      request(consensusUrl, function(err, response, html) {
        if (err) {
          console.log(err);
        }

        var $ = cheerio.load(html);

        var roadConsensusSelector = $('table[class="match-logos"]').children().children().children().eq(1).text().split('%')[0];
        var homeConsensusSelector = $('table[class="match-logos"]').children().children().children().eq(3).text().split('%')[0];

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

        var homeConsensus = Math.round(parseFloat(homeConsensusSelector));
        var roadConsensus = Math.round(parseFloat(roadConsensusSelector));


        function findMatch() {
          var gameIndex = _.findIndex(gameDataArray, function(chr) {
            return chr.site == 'home' && chr.eventId == item + '-h';
          });

          gameDataArray[gameIndex].teamConsensus = homeConsensus;
          gameDataArray[gameIndex].opponentConsensus = roadConsensus;

          gameIndex = _.findIndex(gameDataArray, function(chr) {
            return chr.site == 'road' && chr.eventId == item + '-r';
          });

          gameDataArray[gameIndex].teamConsensus = roadConsensus;
          gameDataArray[gameIndex].opponentConsensus = homeConsensus;
        }

        findMatch();

        asyncCallback(); //callback inside request since that's the async part

      });
    });

    callback(null, eventIdArray, gameDataArray, initHomeSpreadClose, initTotalClose);
  };