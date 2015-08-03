'use strict';

var bodyparser = require('body-parser');
var Game = require('../models/Game');
var Sql = require('sequelize');
var sql = new Sql('wagermetrics_dev', 'wagermetrics_dev',
  'prince', {
  dialect: 'postgres'
});

module.exports = function(router) {
  router.use(bodyparser.json());

  router.post('/games', function(req, res) {
    sql.sync()
    .then(function() {
      Game.create(req.body)
      .then(function(data) {
        res.json(data);
      })
      .error(function(err) {
        console.log(err);
        res.status(500).json({msg: 'server error'});
      });
    });
  });
};